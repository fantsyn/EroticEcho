import { NextRequest, NextResponse } from "next/server";
import { authenticate, toPublic } from "@/lib/auth/users";
import { attachSessionCookie, createSessionToken } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "");
    const password = String(body.password || "");
    const user = await authenticate(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    const token = createSessionToken(user);
    const res = NextResponse.json({ user: toPublic(user) });
    return attachSessionCookie(res, token);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Login failed" },
      { status: 400 }
    );
  }
}
