/**
 * Server-side story cloud.
 * Prefers Upstash Redis REST when configured (survives Vercel cold starts),
 * else /tmp or local data/cloud-stories.
 */
import { promises as fs } from "fs";
import path from "path";
import type { ActiveStory } from "./types";
import { getDataDir } from "@/lib/auth/data-path";
import { hasRemoteKv, kvGet, kvKeys, kvSet } from "@/lib/auth/remote-kv";

function cloudDir(): string {
  return path.join(getDataDir(), "cloud-stories");
}

function cloudKvKey(code: string): string {
  return `eroticecho:cloud:${normalizeCode(code)}`;
}

/** Unambiguous alphabet (no 0/O, 1/I/L) */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateShareCode(len = 6): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function normalizeCode(raw: string): string {
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
}

function fileFor(code: string): string {
  return path.join(cloudDir(), `${normalizeCode(code)}.json`);
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(cloudDir(), { recursive: true });
}

export type CloudPayload = {
  code: string;
  updatedAt: string;
  createdAt: string;
  story: ActiveStory;
};

/** Slim heavy data URLs so codes stay small across devices */
export function slimStoryForCloud(story: ActiveStory): ActiveStory {
  const slimGallery = (story.gallery || []).map((g) => ({
    ...g,
    // Keep http(s) and relative paths; drop huge data: URLs
    url:
      typeof g.url === "string" && g.url.startsWith("data:")
        ? ""
        : g.url,
  }));

  const slimScenes = (story.scenes || []).map((sc) => ({
    ...sc,
    imageUrl:
      sc.imageUrl && String(sc.imageUrl).startsWith("data:")
        ? null
        : sc.imageUrl,
  }));

  const mods = {
    ...story.mods,
    referenceImageUrls: (story.mods?.referenceImageUrls || []).filter(
      (u) => u && !String(u).startsWith("data:")
    ),
  };

  const character = {
    ...story.character,
    avatarUrl:
      story.character.avatarUrl &&
      String(story.character.avatarUrl).startsWith("data:")
        ? story.character.id
          ? `/avatars/${story.character.id}.png`
          : undefined
        : story.character.avatarUrl,
  };

  return {
    ...story,
    character,
    mods,
    gallery: slimGallery.filter((g) => g.url),
    scenes: slimScenes,
  };
}

export async function saveCloudStory(
  story: ActiveStory,
  existingCode?: string
): Promise<CloudPayload> {
  let code = existingCode ? normalizeCode(existingCode) : "";

  if (code) {
    // overwrite if exists; if not, still use that code
  } else if (story.shareCode) {
    code = normalizeCode(story.shareCode);
  } else {
    for (let i = 0; i < 12; i++) {
      const candidate = generateShareCode(6);
      if (hasRemoteKv()) {
        const hit = await kvGet(cloudKvKey(candidate));
        if (!hit) {
          code = candidate;
          break;
        }
      } else {
        try {
          await ensureDir();
          await fs.access(fileFor(candidate));
        } catch {
          code = candidate;
          break;
        }
      }
    }
    if (!code) code = generateShareCode(8);
  }

  const now = new Date().toISOString();
  let createdAt = now;
  const prevPayload = await loadCloudStory(code);
  if (prevPayload?.createdAt) createdAt = prevPayload.createdAt;

  const payload: CloudPayload = {
    code,
    createdAt,
    updatedAt: now,
    story: {
      ...slimStoryForCloud(story),
      shareCode: code,
      updatedAt: now,
    },
  };

  const json = JSON.stringify(payload);
  if (hasRemoteKv()) {
    const ok = await kvSet(cloudKvKey(code), json);
    if (ok) return payload;
  }

  try {
    await ensureDir();
    await fs.writeFile(fileFor(code), json, "utf8");
  } catch (e) {
    // Last resort: still return payload so client keeps code in-session
    console.warn("[cloud-store] write failed", e);
  }
  return payload;
}

export async function loadCloudStory(
  rawCode: string
): Promise<CloudPayload | null> {
  const code = normalizeCode(rawCode);
  if (code.length < 4) return null;

  if (hasRemoteKv()) {
    try {
      const raw = await kvGet(cloudKvKey(code));
      if (raw) {
        const data = JSON.parse(raw) as CloudPayload;
        if (data?.story) return data;
      }
    } catch {
      /* fall through */
    }
  }

  try {
    const raw = await fs.readFile(fileFor(code), "utf8");
    const data = JSON.parse(raw) as CloudPayload;
    if (!data?.story) return null;
    return data;
  } catch {
    return null;
  }
}

export async function listRecentCloud(limit = 20): Promise<
  { code: string; title: string; updatedAt: string; sceneCount: number }[]
> {
  const rows: {
    code: string;
    title: string;
    updatedAt: string;
    sceneCount: number;
  }[] = [];

  if (hasRemoteKv()) {
    try {
      const keys = await kvKeys("eroticecho:cloud:*");
      for (const k of keys.slice(0, 80)) {
        const raw = await kvGet(k);
        if (!raw) continue;
        try {
          const data = JSON.parse(raw) as CloudPayload;
          rows.push({
            code: data.code,
            title: data.story?.title || "Story",
            updatedAt: data.updatedAt,
            sceneCount: data.story?.scenes?.length || 0,
          });
        } catch {
          /* skip */
        }
      }
      return rows
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, limit);
    } catch {
      /* fall through to disk */
    }
  }

  await ensureDir();
  let files: string[] = [];
  try {
    files = await fs.readdir(cloudDir());
  } catch {
    return [];
  }
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(cloudDir(), f), "utf8");
      const data = JSON.parse(raw) as CloudPayload;
      rows.push({
        code: data.code,
        title: data.story?.title || "Story",
        updatedAt: data.updatedAt,
        sceneCount: data.story?.scenes?.length || 0,
      });
    } catch {
      /* skip */
    }
  }
  return rows
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, limit);
}
