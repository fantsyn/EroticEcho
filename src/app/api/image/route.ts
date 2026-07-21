import { NextRequest, NextResponse } from "next/server";
import type { GenerateImageRequest, GenerateImageResponse } from "@/lib/types";
import { buildImagePrompt, buildSceneImagePrompt } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Personalized scene imagery via xAI Grok Imagine.
 * Retries with a safer prompt if content moderation blocks the first attempt.
 */
export async function POST(req: NextRequest) {
  try {
    const { gateAiRequest } = await import("@/lib/auth/gate");
    const gate = await gateAiRequest(req, "image");
    if (!gate.ok) return gate.response;

    const body = (await req.json()) as GenerateImageRequest;
    const name = body.characterName || "her";

    const makePrompt = (safeMode: boolean) =>
      body.narrative || body.action || body.bodyDescription || body.prompt
        ? buildSceneImagePrompt({
            character: {
              id: "runtime",
              name,
              aliases: [],
              tags: [],
              ageRange: "adult 18+",
              gender: "female",
              defaultRole: "switch",
              personality: [],
              body:
                body.bodyDescription ||
                "beautiful adult woman, striking eyes, attractive face",
              relationship: "",
              voiceStyle: "",
              defaultOutfit: body.outfit || "stylish fitted clothing",
              kinkAffinity: [],
              bio: "",
            },
            scenarioTitle: body.scenarioTitle || "atmospheric scene",
            narrative: body.narrative,
            action: body.action,
            locationOverride: body.location,
            aiSuggestion: body.prompt,
            intensity: body.intensity ?? 7,
            // Both modes are tasteful face+environment; safeMode = softer fashion look
            safeMode,
          })
        : buildImagePrompt(
            body.prompt ||
              "sexy cinematic face portrait, clothed, story environment behind her",
            name,
            body.style
          );

    if (process.env.IMAGE_GEN_ENABLED === "false") {
      return NextResponse.json(
        {
          url: null,
          prompt: makePrompt(false),
          offline: true,
          error:
            "AI image generation is disabled. Pre-made portraits only.",
        } satisfies GenerateImageResponse,
        { status: 402 }
      );
    }

    const key = process.env.XAI_API_KEY?.trim();
    if (!key) {
      return NextResponse.json({
        url: placeholderSvg(name, "API key missing on server"),
        prompt: makePrompt(false),
        offline: true,
        error:
          "XAI_API_KEY not loaded. Put it in .env.local and restart npm run dev.",
      } satisfies GenerateImageResponse);
    }

    const model = process.env.XAI_IMAGE_MODEL || "grok-imagine-image";

    // Prefer client prompt when it already includes shot variety
    const clientPrompt = body.prompt?.trim();
    let prompt =
      clientPrompt && clientPrompt.length > 48
        ? clientPrompt
        : makePrompt(false);
    let result = await generateImage(key, model, prompt);

    if (!result.ok && result.moderated) {
      prompt = makePrompt(true);
      result = await generateImage(key, model, prompt);
    }

    if (!result.ok) {
      console.error("[api/image]", result.status, result.error);
      return NextResponse.json({
        url: placeholderSvg(
          name,
          result.moderated
            ? "Content filter blocked this scene visual"
            : `Image API ${result.status}`
        ),
        prompt,
        offline: true,
        error: result.moderated
          ? "Scene was too explicit for image gen — try a softer intensity, or regenerate."
          : result.error || `Image API error ${result.status}`,
      } satisfies GenerateImageResponse);
    }

    return NextResponse.json({
      url: result.url,
      prompt,
      offline: false,
    } satisfies GenerateImageResponse);
  } catch (err) {
    console.error("[api/image]", err);
    return NextResponse.json(
      {
        url: null,
        prompt: "",
        error: err instanceof Error ? err.message : "Image generation failed",
      } satisfies GenerateImageResponse,
      { status: 500 }
    );
  }
}

async function generateImage(
  key: string,
  model: string,
  prompt: string
): Promise<
  | { ok: true; url: string }
  | { ok: false; status: number; error: string; moderated: boolean }
> {
  const res = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
    }),
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
    /* non-json */
  }

  if (!res.ok) {
    const moderated =
      res.status === 400 &&
      (String(data.code || "").includes("moderat") ||
        String(data.error || raw).toLowerCase().includes("moderat"));
    return {
      ok: false,
      status: res.status,
      error: data.error || raw.slice(0, 300),
      moderated,
    };
  }

  const url =
    data?.data?.[0]?.url ||
    (data?.data?.[0]?.b64_json
      ? `data:image/png;base64,${data.data[0].b64_json}`
      : null);

  if (!url) {
    return {
      ok: false,
      status: 502,
      error: "No image URL in API response",
      moderated: false,
    };
  }

  return { ok: true, url };
}

function placeholderSvg(name: string, reason: string): string {
  const safeName = name.replace(/[<>&"']/g, "");
  const safeReason = reason.slice(0, 90).replace(/[<>&"']/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="1024" viewBox="0 0 768 1024">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b0764"/>
      <stop offset="45%" stop-color="#be185d"/>
      <stop offset="100%" stop-color="#0d0a12"/>
    </linearGradient>
  </defs>
  <rect width="768" height="1024" fill="url(#g)"/>
  <ellipse cx="384" cy="360" rx="140" ry="170" fill="#f472b6" opacity="0.2"/>
  <text x="384" y="580" fill="#fce7f3" font-family="Georgia,serif" font-size="40" text-anchor="middle">${safeName}</text>
  <text x="384" y="640" fill="#f9a8d4" font-family="sans-serif" font-size="14" text-anchor="middle">Scene visual unavailable</text>
  <text x="384" y="680" fill="#e9d5ff" font-family="sans-serif" font-size="12" text-anchor="middle" opacity="0.7">${safeReason}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
