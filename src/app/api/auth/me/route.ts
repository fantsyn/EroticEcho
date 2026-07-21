import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { ensureGodUser } from "@/lib/auth/users";
import { PLANS } from "@/lib/auth/plans";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Ensure god account is seeded for owner login
  try {
    await ensureGodUser();
  } catch {
    /* ignore seed errors */
  }
  const user = await getSessionUser(req);
  return NextResponse.json({
    user,
    plans: Object.values(PLANS).filter((p) => p.id !== "god"),
    authRequired: process.env.ALLOW_GUEST_AI !== "true",
  });
}
