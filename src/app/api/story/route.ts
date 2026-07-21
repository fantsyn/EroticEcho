import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { GenerateStoryRequest, GenerateStoryResponse, StoryChoice } from "@/lib/types";
import { buildSystemPrompt, buildUserTurnPrompt } from "@/lib/prompts";
import { generateOfflineScene } from "@/lib/offline-story";

export const runtime = "nodejs";
export const maxDuration = 60;

function getClient(): OpenAI | null {
  const key = process.env.XAI_API_KEY;
  if (!key) return null;
  return new OpenAI({
    apiKey: key,
    baseURL: "https://api.x.ai/v1",
  });
}

function extractJson(text: string): GenerateStoryResponse | null {
  try {
    // Strip markdown fences if present
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end < 0) return null;
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (!parsed.narrative || !Array.isArray(parsed.choices)) return null;
    const choices: StoryChoice[] = parsed.choices.map(
      (c: { id?: string; label?: string; hint?: string }, i: number) => ({
        id: c.id || `c${i + 1}`,
        label: String(c.label || `Choice ${i + 1}`),
        hint: c.hint,
      })
    );
    return {
      narrative: String(parsed.narrative),
      choices,
      memoryUpdate: parsed.memoryUpdate
        ? String(parsed.memoryUpdate)
        : undefined,
      imagePromptSuggestion: parsed.imagePromptSuggestion
        ? String(parsed.imagePromptSuggestion)
        : undefined,
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { gateAiRequest } = await import("@/lib/auth/gate");
    const gate = await gateAiRequest(req, "story");
    if (!gate.ok) return gate.response;

    const body = (await req.json()) as GenerateStoryRequest;
    if (!body?.story || !body?.userProfile) {
      return NextResponse.json(
        { error: "Missing story or userProfile" },
        { status: 400 }
      );
    }

    const forceOffline = process.env.FORCE_OFFLINE_STORY === "true";
    const client = forceOffline ? null : getClient();

    if (!client) {
      const offline = generateOfflineScene(
        body.story,
        body.userProfile,
        body.action || "",
        Boolean(body.isOpening)
      );
      return NextResponse.json({ ...offline, plan: gate.plan });
    }

    const model = process.env.XAI_MODEL || "grok-4.5";
    const system = buildSystemPrompt(body.userProfile, body.story);
    const user = buildUserTurnPrompt(body);

    // Prefer chat completions for broad compatibility with OpenAI SDK
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.9,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const text = completion.choices[0]?.message?.content || "";
    const parsed = extractJson(text);

    if (!parsed) {
      // Fallback offline if model returned unparseable content
      const offline = generateOfflineScene(
        body.story,
        body.userProfile,
        body.action || "",
        Boolean(body.isOpening)
      );
      offline.narrative =
        text.trim() ||
        offline.narrative +
          "\n\n*(AI response could not be parsed; showing offline beat.)*";
      return NextResponse.json({ ...offline, offline: true });
    }

    return NextResponse.json(parsed satisfies GenerateStoryResponse);
  } catch (err) {
    console.error("[api/story]", err);
    const message = err instanceof Error ? err.message : "Story generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
