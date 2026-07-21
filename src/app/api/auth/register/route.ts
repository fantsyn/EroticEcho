import { NextRequest, NextResponse } from "next/server";
import { createUser, toPublic } from "@/lib/auth/users";
import { attachSessionCookie, createSessionToken } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (process.env.REGISTER_OPEN === "false") {
      return NextResponse.json(
        { error: "Registration is closed" },
        { status: 403 }
      );
    }
    const body = await req.json();
    const email = String(body.email || "");
    const password = String(body.password || "");
    const name = body.name ? String(body.name) : undefined;

    const user = await createUser({ email, password, name, plan: "free" });
    const token = createSessionToken(user);

    // Themed welcome email (Resend if configured, else data/outbox)
    try {
      const { welcomeEmailHtml } = await import("@/lib/email/theme");
      const { sendEmail } = await import("@/lib/email/send");
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        req.headers.get("origin") ||
        "http://localhost:3000";
      const mail = welcomeEmailHtml({
        name: user.name,
        appUrl,
      });
      void sendEmail({
        to: user.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    } catch (err) {
      console.warn("[register] welcome email", err);
    }

    const res = NextResponse.json({ user: toPublic(user) });
    return attachSessionCookie(res, token);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Register failed" },
      { status: 400 }
    );
  }
}
