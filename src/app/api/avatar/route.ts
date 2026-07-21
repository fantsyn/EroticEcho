import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  AVATAR_HEAT_ORDER,
  avatarCacheKey,
  buildAvatarPrompt,
  staticAvatarPath,
  type AvatarHeat,
} from "@/lib/avatars";
import type { Character } from "@/lib/types";
import charactersData from "@/data/characters.json";

export const runtime = "nodejs";
export const maxDuration = 90;

const characters = charactersData.characters as Character[];

/**
 * GET ?id=step-mom  → cached portrait for preset
 * POST { character } → generate / return portrait for full character (incl. customs)
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const preset = characters.find((c) => c.id === id);
  if (!preset) {
    return NextResponse.json({ error: "Unknown character" }, { status: 404 });
  }

  // GET never spends image credits — static library only
  const result = await resolveAvatar(preset, false, false);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const { gateAiRequest } = await import("@/lib/auth/gate");
    const gate = await gateAiRequest(req, "avatar");
    if (!gate.ok) return gate.response;

    const body = await req.json();
    const character = body.character as Character | undefined;
    if (!character?.id && !character?.name) {
      return NextResponse.json({ error: "Missing character" }, { status: 400 });
    }

    const force = Boolean(body.force);
    // Live gen only when force=true and plan already passed gateAiRequest
    const allowLiveGen = force;
    const merged: Character = {
      id: character.id || "custom",
      name: character.name || "Companion",
      aliases: character.aliases || [],
      tags: character.tags || [],
      ageRange: character.ageRange || "adult 18+",
      gender: character.gender || "female",
      defaultRole: character.defaultRole || "switch",
      personality: character.personality || [],
      body: character.body || "",
      relationship: character.relationship || "",
      voiceStyle: character.voiceStyle || "",
      defaultOutfit: character.defaultOutfit || "",
      kinkAffinity: character.kinkAffinity || [],
      bio: character.bio || "",
      customName: character.customName,
      customBody: character.customBody,
      customOutfit: character.customOutfit,
      customPersonality: character.customPersonality,
      appearanceNotes: character.appearanceNotes,
      avatarUrl: character.avatarUrl,
    };

    const result = await resolveAvatar(merged, force, allowLiveGen);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/avatar]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Avatar failed" },
      { status: 500 }
    );
  }
}

async function resolveAvatar(
  character: Character,
  force: boolean,
  /** Only true after paid POST gate — never burn xAI credits on free/static paths */
  allowLiveGen = false
): Promise<{
  url: string;
  cacheKey: string;
  offline?: boolean;
  error?: string;
  generated?: boolean;
  heat?: AvatarHeat;
  prompt?: string;
}> {
  const cacheKey = avatarCacheKey(character);
  const isBasePreset =
    cacheKey === character.id &&
    characters.some((c) => c.id === character.id);

  // 1. Disk cache for base presets (pre-generated library)
  if (!force && isBasePreset) {
    const disk = await readDiskAvatar(character.id);
    if (disk) {
      return { url: staticAvatarPath(character.id), cacheKey, generated: false };
    }
  }

  // 2. Disk cache for custom keys / multi-looks
  if (!force) {
    const diskCustom = await readDiskAvatar(cacheKey);
    if (diskCustom) {
      return {
        url: `/avatars/${sanitizeFilename(cacheKey)}.png`,
        cacheKey,
        generated: false,
      };
    }
    // Prefer static role portrait over live gen
    if (character.id) {
      const roleDisk = await readDiskAvatar(`${character.id}-role`);
      if (roleDisk) {
        return {
          url: staticAvatarPath(character.id, `${character.id}-role.png`),
          cacheKey,
          generated: false,
        };
      }
      const baseDisk = await readDiskAvatar(character.id);
      if (baseDisk) {
        return {
          url: staticAvatarPath(character.id),
          cacheKey,
          generated: false,
        };
      }
    }
  }

  // 3. No live generation unless explicitly allowed (Pro+ POST after paywall)
  const imagesOff = process.env.IMAGE_GEN_ENABLED === "false";
  if (!allowLiveGen || !force || imagesOff) {
    return {
      url:
        character.id && characters.some((c) => c.id === character.id)
          ? staticAvatarPath(character.id)
          : elegantPlaceholderDataUrl(character),
      cacheKey,
      offline: true,
      generated: false,
      error: imagesOff
        ? "Image generation disabled — using pre-made portraits"
        : "Using pre-made portrait (upgrade to Pro to regen with AI)",
    };
  }

  // 4. Generate via xAI — try hot → warm → soft until moderation clears
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) {
    return {
      url: elegantPlaceholderDataUrl(character),
      cacheKey,
      offline: true,
      error: "XAI_API_KEY missing — using elegant placeholder",
    };
  }

  let lastError = "";
  let usedHeat: AvatarHeat = "hot";
  let usedPrompt = "";

  for (const heat of AVATAR_HEAT_ORDER) {
    usedHeat = heat;
    usedPrompt = buildAvatarPrompt(character, heat);
    // two attempts per heat
    for (let attempt = 0; attempt < 2; attempt++) {
      const gen = await generateImage(key, usedPrompt);
      if (gen.ok) {
        const saved = await persistAvatar(cacheKey, gen.url);
        return {
          url: saved || gen.url,
          cacheKey,
          generated: true,
          heat: usedHeat,
        };
      }
      lastError = gen.error;
      console.warn("[api/avatar]", heat, attempt, gen.error);
      if (!gen.moderated) {
        // network / other — retry same heat once
        continue;
      }
      break; // moderated → next cooler heat
    }
  }

  return {
    url: elegantPlaceholderDataUrl(character),
    cacheKey,
    offline: true,
    error: lastError || "Avatar generation failed all heats",
    heat: usedHeat,
    prompt: usedPrompt,
  };
}

async function readDiskAvatar(key: string): Promise<boolean> {
  try {
    const file = path.join(
      process.cwd(),
      "public",
      "avatars",
      `${sanitizeFilename(key)}.png`
    );
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function sanitizeFilename(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
}

async function persistAvatar(
  cacheKey: string,
  url: string
): Promise<string | null> {
  try {
    const dir = path.join(process.cwd(), "public", "avatars");
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, `${sanitizeFilename(cacheKey)}.png`);

    let buf: Buffer;
    if (url.startsWith("data:")) {
      const b64 = url.split(",")[1];
      if (!b64) return null;
      buf = Buffer.from(b64, "base64");
    } else {
      const res = await fetch(url);
      if (!res.ok) return null;
      buf = Buffer.from(await res.arrayBuffer());
    }

    await fs.writeFile(file, buf);
    return `/avatars/${sanitizeFilename(cacheKey)}.png`;
  } catch (e) {
    console.warn("[api/avatar] persist failed", e);
    return null;
  }
}

async function generateImage(
  key: string,
  prompt: string
): Promise<
  | { ok: true; url: string }
  | { ok: false; error: string; moderated: boolean }
> {
  const model = process.env.XAI_IMAGE_MODEL || "grok-imagine-image";
  const res = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, prompt, n: 1 }),
  });

  const raw = await res.text();
  let data: {
    data?: { url?: string; b64_json?: string }[];
    error?: string;
    code?: string;
  } = {};
  try {
    data = JSON.parse(raw);
  } catch {
    /* */
  }

  if (!res.ok) {
    const blob = `${data.code || ""} ${data.error || ""} ${raw}`.toLowerCase();
    const moderated =
      res.status === 400 &&
      (blob.includes("moderat") ||
        blob.includes("safety") ||
        blob.includes("content filter") ||
        blob.includes("violat"));
    return {
      ok: false,
      error: data.error || raw.slice(0, 200),
      moderated,
    };
  }

  const url =
    data?.data?.[0]?.url ||
    (data?.data?.[0]?.b64_json
      ? `data:image/png;base64,${data.data[0].b64_json}`
      : null);

  if (!url) return { ok: false, error: "No image in response", moderated: false };
  return { ok: true, url };
}

/** Elegant monogram fallback — dark editorial, not cartoon */
function elegantPlaceholderDataUrl(character: Character): string {
  const name = (character.customName || character.name || "EE").replace(
    /[<>&"']/g,
    ""
  );
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "EE";
  const alias = (character.aliases?.[0] || "").replace(/[<>&"']/g, "").slice(0, 28);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="640" viewBox="0 0 512 640">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2a0f24"/>
      <stop offset="55%" stop-color="#1a0a14"/>
      <stop offset="100%" stop-color="#0d0a12"/>
    </linearGradient>
    <radialGradient id="r" cx="50%" cy="38%" r="45%">
      <stop offset="0%" stop-color="#be185d" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0d0a12" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="640" fill="url(#g)"/>
  <rect width="512" height="640" fill="url(#r)"/>
  <circle cx="256" cy="250" r="88" fill="none" stroke="#f472b6" stroke-opacity="0.35" stroke-width="1.5"/>
  <text x="256" y="268" fill="#fce7f3" font-family="Georgia,serif" font-size="52" text-anchor="middle" font-weight="600">${initials}</text>
  <text x="256" y="400" fill="#f9a8d4" font-family="Georgia,serif" font-size="22" text-anchor="middle">${name.slice(0, 24)}</text>
  <text x="256" y="432" fill="#a78bfa" font-family="system-ui,sans-serif" font-size="12" text-anchor="middle" opacity="0.75">${alias}</text>
  <text x="256" y="580" fill="#6b7280" font-family="system-ui,sans-serif" font-size="11" text-anchor="middle">portrait pending</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
