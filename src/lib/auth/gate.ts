import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "./session";
import { consumeUsage } from "./users";
import type { MeterKind } from "./plans";

/**
 * Auth + plan metering for paid AI routes.
 * - God / bypass plans skip limits
 * - AUTH_REQUIRED when not signed in (story/image)
 * - Guest mode only if ALLOW_GUEST_AI=true (dev)
 */
export async function gateAiRequest(
  req: NextRequest,
  kind: MeterKind
): Promise<
  | { ok: true; userId: string; plan: string }
  | { ok: false; response: NextResponse }
> {
  const allowGuest = process.env.ALLOW_GUEST_AI === "true";
  const auth = await requireUser(req);

  if (!auth.ok) {
    if (allowGuest) {
      return { ok: true, userId: "guest", plan: "free" };
    }
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Sign in to generate stories. Create a free account to start.",
          code: "AUTH_REQUIRED",
          upgradeUrl: "/pricing",
          loginUrl: "/login",
        },
        { status: 401 }
      ),
    };
  }

  if (auth.user.plan === "god" || auth.user.features.canBypassLimits) {
    return { ok: true, userId: auth.recordId, plan: auth.user.plan };
  }

  // Live AI image/avatar generation is a paid feature (covers xAI image credits).
  // Free tier uses pre-generated static portraits only.
  const imageKind = kind === "image" || kind === "avatar";
  const imagesGloballyOff = process.env.IMAGE_GEN_ENABLED === "false";
  if (imageKind && (imagesGloballyOff || !auth.user.features.canGenerateImages)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: imagesGloballyOff
            ? "AI image generation is temporarily disabled. Using pre-made portraits only."
            : "AI image generation is a Pro feature (covers image API cost). Free accounts use the pre-made portrait library only.",
          code: "IMAGE_PAYWALL",
          plan: auth.user.plan,
          upgradeUrl: "/pricing",
        },
        { status: 402 }
      ),
    };
  }

  const used = await consumeUsage(auth.recordId, kind);
  if (!used.ok) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: used.error,
          code: "LIMIT_REACHED",
          plan: auth.user.plan,
          upgradeUrl: "/pricing",
        },
        { status: 402 }
      ),
    };
  }

  return { ok: true, userId: auth.recordId, plan: auth.user.plan };
}
