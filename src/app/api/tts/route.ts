import { NextRequest, NextResponse } from "next/server";
import {
  enhanceTextForNaturalTts,
  getCompanionById,
  DEFAULT_COMPANION_ID,
} from "@/lib/companion-voices";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Proxy to xAI Grok Text-to-Speech — companion-quality sexy narration.
 * Never call api.x.ai/tts from the browser (keeps the key server-side).
 */
export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      const raw = await req.text();
      if (!raw?.trim()) {
        return NextResponse.json({ error: "Empty body" }, { status: 400 });
      }
      body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const text = String(body.text || "").trim().slice(0, 5000);
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const companionId = String(body.companionId || DEFAULT_COMPANION_ID);
    const companion = getCompanionById(companionId);
    const voiceId = String(
      body.voiceId || companion?.voiceId || "eve"
    ).toLowerCase();
    // Natural conversation speed — slightly under 1.0 reads easily without dragging
    const speed = Number(body.speed ?? companion?.speed ?? 0.96);
    const natural = body.naturalEnhance !== false && body.sexyEnhance !== false;

    const key = process.env.XAI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "XAI_API_KEY not configured", offline: true },
        { status: 503 }
      );
    }

    const spoken = natural ? enhanceTextForNaturalTts(text) : text;

    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: spoken,
        voice_id: voiceId,
        language: "en",
        speed: Math.min(1.5, Math.max(0.7, speed)),
        text_normalization: true,
        output_format: {
          codec: "mp3",
          sample_rate: 24000,
          bit_rate: 128000,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[api/tts]", res.status, errText);
      return NextResponse.json(
        { error: `TTS failed (${res.status})`, detail: errText.slice(0, 300) },
        { status: res.status }
      );
    }

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "X-Voice-Id": voiceId,
        "X-Companion-Id": companionId,
      },
    });
  } catch (err) {
    console.error("[api/tts]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "TTS error" },
      { status: 500 }
    );
  }
}
