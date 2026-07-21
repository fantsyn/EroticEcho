"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { checkoutRequest } from "@/lib/auth-client";
import { PLANS } from "@/lib/auth/plans";
import { queueUpgradeCelebration } from "@/components/UpgradeCelebration";
import type { PlanId } from "@/lib/auth/types";
import { Check, Loader2 } from "lucide-react";
import clsx from "clsx";

const ORDER = ["free", "pro", "lifetime"] as const;

export default function PricingPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const buy = async (plan: "pro" | "lifetime") => {
    setErr(null);
    if (!user) {
      router.push("/login?next=/pricing");
      return;
    }
    setBusy(plan);
    const res = await checkoutRequest(plan);
    setBusy(null);
    if (res.error) {
      setErr(res.error);
      return;
    }
    if (res.url) {
      window.location.href = res.url;
      return;
    }
    if (res.upgraded) {
      queueUpgradeCelebration((res.plan || plan) as PlanId);
      router.push("/account?upgraded=1");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center max-w-xl mx-auto">
        <p className="section-kicker mb-2">Pricing</p>
        <h1 className="font-display text-3xl sm:text-5xl text-echo-50">
          Start free. Go unlimited when you&apos;re hooked.
        </h1>
        <p className="text-sm text-ink-400 mt-3">
          18+ interactive erotic fiction. Local saves, cloud share codes, and AI
          scenes powered by Grok.
        </p>
      </div>

      {err && (
        <p className="text-center text-xs text-rose-300 bg-rose-950/30 border border-rose-500/30 rounded-xl px-4 py-3">
          {err}
        </p>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {ORDER.map((id) => {
          const p = PLANS[id];
          const current = user?.plan === id;
          const featured = id === "pro";
          return (
            <div
              key={id}
              className={clsx(
                "card p-5 flex flex-col relative",
                featured && "ring-1 ring-echo-400/40 shadow-echo-900/40"
              )}
            >
              {featured && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest bg-echo-600 text-white px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              <h2 className="font-display text-2xl text-echo-50">{p.label}</h2>
              <p className="text-3xl font-semibold text-white mt-2">
                {p.priceLabel}
              </p>
              <ul className="mt-4 space-y-2 flex-1">
                {p.marketingBullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-2 text-xs text-ink-300 leading-snug"
                  >
                    <Check className="h-3.5 w-3.5 text-echo-400 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
              {id === "free" ? (
                <Link
                  href={user ? "/create" : "/login?next=/create"}
                  className="btn-ghost w-full mt-5 min-h-11 justify-center"
                >
                  {user ? "Open app" : "Get started"}
                </Link>
              ) : (
                <button
                  type="button"
                  className={clsx(
                    "w-full mt-5 min-h-11 justify-center",
                    featured ? "btn-primary" : "btn-ghost"
                  )}
                  disabled={!!busy || current || user?.isGod}
                  onClick={() => void buy(id)}
                >
                  {busy === id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : current ? (
                    "Current plan"
                  ) : (
                    `Get ${p.label}`
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-ink-600 max-w-md mx-auto">
        Payments: connect Stripe via env for live checkout, or use demo upgrade
        in development. Redeem gift codes on{" "}
        <Link href="/account" className="underline text-ink-400">
          Account
        </Link>
        .
      </p>
    </div>
  );
}
