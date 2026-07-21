import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { listUsers, toPublic, updateUser } from "@/lib/auth/users";
import type { PlanId } from "@/lib/auth/types";

export const runtime = "nodejs";

async function requireGod(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth;
  if (!auth.user.isGod && !auth.user.features.canAccessAdmin) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "God access required" }, { status: 403 }),
    };
  }
  return auth;
}

export async function GET(req: NextRequest) {
  const auth = await requireGod(req);
  if (!auth.ok) return auth.response;
  const users = await listUsers();
  return NextResponse.json({
    users: users.map((u) => ({
      ...toPublic(u),
      createdAt: u.createdAt,
      banned: !!u.banned,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireGod(req);
  if (!auth.ok) return auth.response;
  const body = await req.json().catch(() => ({}));
  const userId = String(body.userId || "");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  const patch: {
    plan?: PlanId;
    banned?: boolean;
    name?: string;
  } = {};
  if (body.plan) patch.plan = body.plan as PlanId;
  if (typeof body.banned === "boolean") patch.banned = body.banned;
  if (body.name) patch.name = String(body.name).slice(0, 40);
  const updated = await updateUser(userId, patch);
  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user: toPublic(updated) });
}
