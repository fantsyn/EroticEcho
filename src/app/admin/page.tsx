"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, Shield } from "lucide-react";
import type { PlanId } from "@/lib/auth/types";
import { readAnalyticsBuffer } from "@/lib/analytics";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  plan: PlanId;
  isGod: boolean;
  banned?: boolean;
  createdAt?: string;
  usage: {
    storyUses: number;
    imageUses: number;
    avatarUses: number;
    storyLimit: number | null;
  };
};

export default function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [events, setEvents] = useState<
    { t: number; name: string; props?: Record<string, string | number> }[]
  >([]);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setUsers(data.users || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setBusy(false);
    }
    setEvents(readAnalyticsBuffer());
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user?.isGod) {
      router.replace("/login?next=/admin");
      return;
    }
    void load();
  }, [ready, user, router, load]);

  const setPlan = async (userId: string, plan: PlanId) => {
    setBusy(true);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Update failed");
      return;
    }
    await load();
  };

  const toggleBan = async (userId: string, banned: boolean) => {
    setBusy(true);
    await fetch("/api/admin/users", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, banned }),
    });
    setBusy(false);
    await load();
  };

  if (!ready || !user?.isGod) {
    return (
      <div className="flex justify-center py-20 text-ink-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-amber-300" />
        <div>
          <h1 className="panel-title text-2xl">God admin</h1>
          <p className="text-xs text-ink-500">
            Users, plans, bans · local analytics buffer
          </p>
        </div>
        <button
          type="button"
          className="btn-ghost ml-auto text-xs min-h-10"
          onClick={() => void load()}
          disabled={busy}
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-300 border border-rose-500/30 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <section className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex justify-between">
          <h2 className="label mb-0">Users ({users.length})</h2>
        </div>
        <ul className="divide-y divide-white/5 max-h-[28rem] overflow-y-auto">
          {users.map((u) => (
            <li
              key={u.id}
              className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-echo-100 truncate">
                  {u.name}{" "}
                  <span className="text-ink-500 text-xs">· {u.email}</span>
                  {u.isGod && (
                    <span className="ml-2 text-[10px] text-amber-300">GOD</span>
                  )}
                  {u.banned && (
                    <span className="ml-2 text-[10px] text-rose-300">BANNED</span>
                  )}
                </p>
                <p className="text-[11px] text-ink-500">
                  Plan <strong className="text-ink-300">{u.plan}</strong> ·
                  stories today {u.usage.storyUses}
                  {u.usage.storyLimit != null
                    ? `/${u.usage.storyLimit}`
                    : "/∞"}
                </p>
              </div>
              {!u.isGod && (
                <div className="flex flex-wrap gap-1.5">
                  {(["free", "pro", "lifetime"] as PlanId[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="btn-ghost text-[10px] min-h-9 px-2 capitalize"
                      disabled={busy || u.plan === p}
                      onClick={() => void setPlan(u.id, p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="btn-ghost text-[10px] min-h-9 px-2 text-rose-300"
                    disabled={busy}
                    onClick={() => void toggleBan(u.id, !u.banned)}
                  >
                    {u.banned ? "Unban" : "Ban"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-4">
        <h2 className="label">Session analytics (this browser)</h2>
        <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto text-[11px] text-ink-400 font-mono">
          {events.length === 0 && <li>No events yet</li>}
          {events.map((e, i) => (
            <li key={i}>
              {new Date(e.t).toLocaleTimeString()} · {e.name}
              {e.props ? ` ${JSON.stringify(e.props)}` : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
