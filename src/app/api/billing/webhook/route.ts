import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { updateUser } from "@/lib/auth/users";
import type { PlanId } from "@/lib/auth/types";

export const runtime = "nodejs";

/**
 * Stripe webhook: checkout.session.completed → set user plan.
 * Configure endpoint: POST /api/billing/webhook
 * Env: STRIPE_WEBHOOK_SECRET=whsec_...
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const raw = await req.text();

  if (secret) {
    const sig = req.headers.get("stripe-signature") || "";
    if (!verifyStripeSignature(raw, sig, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 503 }
    );
  }

  let event: {
    type?: string;
    data?: { object?: Record<string, unknown> };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const obj = event.data?.object || {};
    const meta = (obj.metadata || {}) as Record<string, string>;
    const userId =
      meta.userId ||
      (typeof obj.client_reference_id === "string"
        ? obj.client_reference_id
        : "");
    const plan = (meta.plan || "pro") as PlanId;
    if (userId && (plan === "pro" || plan === "lifetime")) {
      await updateUser(userId, {
        plan,
        stripeCustomerId:
          typeof obj.customer === "string" ? obj.customer : undefined,
      });
    }
  }

  return NextResponse.json({ received: true });
}

/** Minimal Stripe signature check (v1) */
function verifyStripeSignature(
  payload: string,
  header: string,
  secret: string
): boolean {
  try {
    const parts = Object.fromEntries(
      header.split(",").map((p) => {
        const [k, v] = p.split("=");
        return [k.trim(), v];
      })
    );
    const t = parts.t;
    const v1 = parts.v1;
    if (!t || !v1) return false;
    const signed = `${t}.${payload}`;
    const expect = createHmac("sha256", secret).update(signed).digest("hex");
    const a = Buffer.from(v1, "hex");
    const b = Buffer.from(expect, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
