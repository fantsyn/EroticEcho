/**
 * Browser helpers for story cloud codes.
 */
import type { ActiveStory } from "./types";

export async function publishStoryToCloud(
  story: ActiveStory
): Promise<{ ok: true; code: string; story: ActiveStory } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/cloud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story, code: story.shareCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error || `HTTP ${res.status}` };
    }
    return {
      ok: true,
      code: String(data.code),
      story: data.story as ActiveStory,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Publish failed",
    };
  }
}

export async function claimStoryFromCloud(
  code: string
): Promise<{ ok: true; story: ActiveStory; code: string } | { ok: false; error: string }> {
  try {
    const res = await fetch(
      `/api/cloud?code=${encodeURIComponent(code.trim())}`
    );
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error || `HTTP ${res.status}` };
    }
    const story = data.story as ActiveStory;
    // Fresh local id so it doesn't collide oddly; keep shareCode link
    return {
      ok: true,
      code: String(data.code),
      story: {
        ...story,
        shareCode: String(data.code),
      },
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Claim failed",
    };
  }
}

export function formatShareCode(code: string): string {
  const c = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (c.length <= 3) return c;
  return `${c.slice(0, 3)}-${c.slice(3)}`;
}
