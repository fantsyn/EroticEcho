"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { PLANS } from "@/lib/auth/plans";
import type { PlanId } from "@/lib/auth/types";
import { track } from "@/lib/analytics";

const KEY = "eroticecho:celebratePlan";

/** Call after successful upgrade to queue the popup once. */
export function queueUpgradeCelebration(plan: PlanId) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, plan);
}

/**
 * Small themed popup: what you unlocked after subscribe / redeem / demo upgrade.
 */
export function UpgradeCelebration() {
  const user = useAuthStore((s) => s.user);
  const refresh = useAuthStore((s) => s.refresh);
  const [plan, setPlan] = useState<PlanId | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    if (q.get("upgraded") === "1") {
      const p = (user?.plan || "pro") as PlanId;
      sessionStorage.setItem(KEY, p);
      void refresh();
    }
    const stored = sessionStorage.getItem(KEY) as PlanId | null;
    if (stored && stored !== "free" && stored !== "god") {
      setPlan(stored);
      track("upgrade_complete", { plan: stored });
    }
  }, [user?.plan, refresh]);

  const dismiss = () => {
    sessionStorage.removeItem(KEY);
    setPlan(null);
    // clean query
    if (typeof window !== "undefined" && window.location.search.includes("upgraded")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("upgraded");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  };

  if (!plan) return null;
  const features = PLANS[plan] || PLANS.pro;

  return (
    <div className="fixed inset-0 z-[96] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="card w-full max-w-sm p-6 relative border-violet-400/30 shadow-2xl animate-slide-up">
        <button
          type="button"
          className="absolute top-3 right-3 p-2 text-ink-500 min-h-10 min-w-10"
          onClick={dismiss}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/40 to-echo-600/40 mb-3">
          <Crown className="h-6 w-6 text-amber-200" />
        </div>
        <h2 className="font-display text-2xl text-echo-50 mb-1">
          You&apos;re on {features.label}
        </h2>
        <p className="text-xs text-ink-400 mb-4">Here&apos;s what you unlocked:</p>
        <ul className="space-y-2 mb-5">
          {features.marketingBullets.map((b) => (
            <li
              key={b}
              className="text-sm text-ink-200 flex gap-2 leading-snug"
            >
              <span className="text-echo-400">✓</span> {b}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost flex-1" onClick={dismiss}>
            Close
          </button>
          <Link
            href="/play"
            className="btn-primary flex-1 justify-center"
            onClick={dismiss}
          >
            Play
          </Link>
        </div>
      </div>
    </div>
  );
}
