"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  checkoutRequest,
  redeemCodeRequest,
} from "@/lib/auth-client";
import { queueUpgradeCelebration } from "@/components/UpgradeCelebration";
import type { PlanId } from "@/lib/auth/types";
import { Crown, Loader2, LogOut, Shield } from "lucide-react";

function AccountInner() {
  const router = useRouter();
  const params = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const refresh = useAuthStore((s) => s.refresh);
  const logout = useAuthStore((s) => s.logout);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (params.get("upgraded") === "1") {
      setMsg("Upgrade complete — refreshing plan…");
      void refresh();
    }
  }, [params, refresh]);

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=/account");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex justify-center py-20 text-ink-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const u = user.usage;
  const pct = (used: number, limit: number | null) =>
    limit === null ? 0 : Math.min(100, Math.round((used / limit) * 100));

  const upgrade = async (plan: "pro" | "lifetime") => {
    setBusy(true);
    setMsg(null);
    const res = await checkoutRequest(plan);
    setBusy(false);
    if (res.error) {
      setMsg(res.error);
      return;
    }
    if (res.url) {
      window.location.href = res.url;
      return;
    }
    if (res.upgraded) {
      queueUpgradeCelebration((res.plan || plan) as PlanId);
      setMsg(res.message || `Upgraded to ${plan}`);
      await refresh();
    }
  };

  const redeem = async () => {
    setBusy(true);
    const res = await redeemCodeRequest(code);
    setBusy(false);
    if (res.error) setMsg(res.error);
    else {
      if (res.plan) queueUpgradeCelebration(res.plan as PlanId);
      setMsg(`Redeemed — plan is now ${res.plan}`);
      setCode("");
      await refresh();
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="panel-title text-2xl">Account</h1>
          <p className="text-sm text-ink-500 mt-1">{user.email}</p>
        </div>
        <button
          type="button"
          className="btn-ghost min-h-10 text-xs"
          onClick={async () => {
            await logout();
            router.push("/");
          }}
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>

      {user.isGod && (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-950/40 p-4 flex gap-3">
          <Shield className="h-5 w-5 text-amber-300 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber-100 font-medium">God access</p>
            <p className="text-xs text-amber-100/70 mt-1">
              Unrestricted generation, no daily caps, owner plan.
            </p>
            <Link
              href="/admin"
              className="inline-flex mt-2 text-xs text-amber-200 underline"
            >
              Open admin panel →
            </Link>
          </div>
        </div>
      )}

      <section className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="label mb-0">Plan</p>
            <p className="font-display text-2xl text-echo-100 flex items-center gap-2">
              {user.plan === "pro" || user.plan === "lifetime" || user.isGod ? (
                <Crown className="h-5 w-5 text-amber-300" />
              ) : null}
              {user.features.label}
            </p>
          </div>
          <Link href="/pricing" className="btn-primary text-xs min-h-10">
            Upgrade
          </Link>
        </div>
        <p className="text-xs text-ink-500">Hello, {user.name}</p>
      </section>

      <section className="card p-5 space-y-4">
        <h2 className="label">Today&apos;s usage</h2>
        {(
          [
            ["Stories", u.storyUses, u.storyLimit],
            ["Images", u.imageUses, u.imageLimit],
            ["Avatars", u.avatarUses, u.avatarLimit],
          ] as const
        ).map(([label, used, limit]) => (
          <div key={label}>
            <div className="flex justify-between text-xs text-ink-400 mb-1">
              <span>{label}</span>
              <span>
                {used}
                {limit === null ? " / ∞" : ` / ${limit}`}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-echo-500 to-velvet-500 transition-all"
                style={{
                  width: limit === null ? "8%" : `${pct(used, limit)}%`,
                }}
              />
            </div>
          </div>
        ))}
        <p className="text-[10px] text-ink-600">
          Resets {new Date(u.resetsAt).toLocaleString()}
        </p>
      </section>

      <section className="card p-5 space-y-3">
        <h2 className="label">Quick upgrade</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary min-h-11 text-sm"
            disabled={busy || user.plan === "pro" || user.isGod}
            onClick={() => void upgrade("pro")}
          >
            Pro $12/mo
          </button>
          <button
            type="button"
            className="btn-ghost min-h-11 text-sm"
            disabled={busy || user.plan === "lifetime" || user.isGod}
            onClick={() => void upgrade("lifetime")}
          >
            Lifetime $79
          </button>
        </div>
        <div className="flex gap-2 pt-2">
          <input
            className="input flex-1 text-sm"
            placeholder="Redeem code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="button"
            className="btn-ghost min-h-11 text-xs"
            disabled={!code.trim() || busy}
            onClick={() => void redeem()}
          >
            Redeem
          </button>
        </div>
        {msg && (
          <p className="text-xs text-echo-200 bg-echo-950/40 border border-echo-500/25 rounded-xl px-3 py-2">
            {msg}
          </p>
        )}
      </section>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20 text-ink-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      <AccountInner />
    </Suspense>
  );
}
