import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { signPayload, verifySigned } from "./crypto";
import { findById, toPublic } from "./users";
import type { PlanId, PublicUser, SessionPayload } from "./types";

export const COOKIE_NAME = "ee_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

export function createSessionToken(user: {
  id: string;
  email: string;
  plan: PlanId;
}): string {
  const payload: SessionPayload = {
    uid: user.id,
    email: user.email,
    plan: user.plan,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SEC,
  };
  return signPayload(payload);
}

export function readTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value || null;
}

export async function readTokenFromCookies(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value || null;
}

export function parseSession(token: string | null): SessionPayload | null {
  if (!token) return null;
  const p = verifySigned<SessionPayload>(token);
  if (!p?.uid || !p.exp) return null;
  if (p.exp * 1000 < Date.now()) return null;
  return p;
}

export function attachSessionCookie(
  res: NextResponse,
  token: string
): NextResponse {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
  return res;
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function getSessionUser(
  req?: NextRequest
): Promise<PublicUser | null> {
  const token = req
    ? readTokenFromRequest(req)
    : await readTokenFromCookies();
  const session = parseSession(token);
  if (!session) return null;
  const user = await findById(session.uid);
  if (!user || user.banned) return null;
  return toPublic(user);
}

/** Require login; returns user or a NextResponse error */
export async function requireUser(
  req: NextRequest
): Promise<
  | { ok: true; user: PublicUser; recordId: string }
  | { ok: false; response: NextResponse }
> {
  const token = readTokenFromRequest(req);
  const session = parseSession(token);
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Sign in required", code: "AUTH_REQUIRED" },
        { status: 401 }
      ),
    };
  }
  const user = await findById(session.uid);
  if (!user || user.banned) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Account unavailable", code: "AUTH_FORBIDDEN" },
        { status: 403 }
      ),
    };
  }
  return { ok: true, user: toPublic(user), recordId: user.id };
}
