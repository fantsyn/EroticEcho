import { NextRequest, NextResponse } from "next/server";
import { createResetToken, consumeResetToken } from "@/lib/auth/reset";

export const runtime = "nodejs";

/** Request reset — returns token in non-production for easy testing */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "");
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  const result = await createResetToken(email);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const expose =
    process.env.NODE_ENV !== "production" ||
    process.env.EXPOSE_RESET_TOKENS === "true";
  return NextResponse.json({
    ok: true,
    message: expose
      ? "Reset token created (dev mode — use it below)."
      : "If that email exists, a reset was issued. Contact support if you need the link.",
    token: expose ? result.token : undefined,
    resetPath: expose ? `/reset?token=${result.token}` : undefined,
  });
}

/** Complete reset with token + new password */
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const token = String(body.token || "");
  const password = String(body.password || "");
  const result = await consumeResetToken(token, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
