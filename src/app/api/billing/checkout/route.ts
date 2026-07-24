import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { setPlanByEmail, updateUser } from "@/lib/auth/users";
import type { PlanId } from "@/lib/auth/types";

export const runtime = "nodejs";

/**
 * Checkout:
 * - If STRIPE_SECRET_KEY + price IDs are set → returns Stripe Checkout URL (stub structure)
 * - Else DEMO_BILLING=true → instantly upgrades (for testing sales flow)
 * - Else returns instructions to enable Stripe
 */
export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => ({}));
  const plan = String(body.plan || "pro") as PlanId;
  if (plan !== "pro" && plan !== "lifetime") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  const pricePro = process.env.STRIPE_PRICE_PRO?.trim();
  const priceLife = process.env.STRIPE_PRICE_LIFETIME?.trim();
  const priceId = plan === "pro" ? pricePro : priceLife;

  if (stripeKey && priceId) {
    // Minimal Stripe Checkout Session create without SDK
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    try {
      const params = new URLSearchParams();
      params.set("mode", plan === "pro" ? "subscription" : "payment");
      params.set("success_url", `${origin}/account?upgraded=1`);
      params.set("cancel_url", `${origin}/pricing?canceled=1`);
      params.set("client_reference_id", auth.recordId);
      params.set("customer_email", auth.user.email);
      params.set("line_items[0][price]", priceId);
      params.set("line_items[0][quantity]", "1");
      params.set("metadata[plan]", plan);
      params.set("metadata[userId]", auth.recordId);

      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { error: data.error?.message || "Stripe error" },
          { status: 502 }
        );
      }
      return NextResponse.json({ url: data.url, mode: "stripe" });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Stripe failed" },
        { status: 502 }
      );
    }
  }

  // Demo / manual sales mode — never auto-enable in production unless explicit
  const demoBilling =
    process.env.DEMO_BILLING === "true" ||
    (process.env.NODE_ENV !== "production" &&
      process.env.DEMO_BILLING !== "false");
  if (demoBilling) {
    await updateUser(auth.recordId, { plan });
    try {
      const { upgradeEmailHtml } = await import("@/lib/email/theme");
      const { sendEmail } = await import("@/lib/email/send");
      const { getPlan } = await import("@/lib/auth/plans");
      const features = getPlan(plan);
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        req.headers.get("origin") ||
        "http://localhost:3000";
      const mail = upgradeEmailHtml({
        name: auth.user.name,
        planLabel: features.label,
        appUrl,
        bullets: features.marketingBullets,
      });
      void sendEmail({
        to: auth.user.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    } catch {
      /* non-fatal */
    }
    return NextResponse.json({
      mode: "demo",
      upgraded: true,
      plan,
      message:
        "Demo billing: plan upgraded instantly. Set STRIPE_SECRET_KEY for real payments.",
    });
  }

  return NextResponse.json(
    {
      error:
        "Payments not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_PRO / STRIPE_PRICE_LIFETIME, or DEMO_BILLING=true.",
      code: "BILLING_NOT_CONFIGURED",
    },
    { status: 503 }
  );
}

/** Redeem a manual promo / gift code (owner can create codes via env) */
export async function PUT(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;
  const body = await req.json().catch(() => ({}));
  const code = String(body.code || "")
    .trim()
    .toUpperCase();
  const mapRaw = process.env.REDEEM_CODES || "";
  // Format: PRO:CODE1,CODE2;LIFETIME:CODE3
  const map: Record<string, PlanId> = {};
  for (const part of mapRaw.split(";")) {
    const [plan, codes] = part.split(":");
    if (!plan || !codes) continue;
    const p = plan.trim().toLowerCase() as PlanId;
    for (const c of codes.split(",")) {
      map[c.trim().toUpperCase()] = p;
    }
  }
  const plan = map[code];
  if (!plan) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }
  await updateUser(auth.recordId, { plan });
  try {
    const { upgradeEmailHtml } = await import("@/lib/email/theme");
    const { sendEmail } = await import("@/lib/email/send");
    const { getPlan } = await import("@/lib/auth/plans");
    const features = getPlan(plan);
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.trim() ||
      req.headers.get("origin") ||
      "http://localhost:3000";
    const mail = upgradeEmailHtml({
      name: auth.user.name,
      planLabel: features.label,
      appUrl,
      bullets: features.marketingBullets,
    });
    void sendEmail({
      to: auth.user.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
  } catch {
    /* */
  }
  return NextResponse.json({ ok: true, plan });
}
