import { NextRequest, NextResponse } from "next/server";
import type { ActiveStory } from "@/lib/types";
import {
  listRecentCloud,
  loadCloudStory,
  normalizeCode,
  saveCloudStory,
} from "@/lib/cloud-store";

export const runtime = "nodejs";

/**
 * Cloud story share codes — any device on this server.
 *
 * POST { story, code? } → { code, story }
 * GET  ?code=K7M2QX     → { code, story }
 * GET  ?list=1          → recent codes (titles only)
 */
export async function GET(req: NextRequest) {
  try {
    const list = req.nextUrl.searchParams.get("list");
    if (list === "1" || list === "true") {
      const recent = await listRecentCloud(30);
      return NextResponse.json({ ok: true, recent });
    }

    const code = normalizeCode(req.nextUrl.searchParams.get("code") || "");
    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const payload = await loadCloudStory(code);
    if (!payload) {
      return NextResponse.json(
        { error: "Code not found. Check and try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      code: payload.code,
      updatedAt: payload.updatedAt,
      story: payload.story,
    });
  } catch (err) {
    console.error("[api/cloud GET]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cloud read failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const story = body.story as ActiveStory | undefined;
    if (!story || !story.id) {
      return NextResponse.json({ error: "Missing story" }, { status: 400 });
    }

    const prefer = body.code
      ? normalizeCode(String(body.code))
      : story.shareCode
        ? normalizeCode(story.shareCode)
        : undefined;

    const payload = await saveCloudStory(story, prefer);
    return NextResponse.json({
      ok: true,
      code: payload.code,
      updatedAt: payload.updatedAt,
      story: payload.story,
    });
  } catch (err) {
    console.error("[api/cloud POST]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cloud save failed" },
      { status: 500 }
    );
  }
}
