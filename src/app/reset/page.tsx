"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function ResetInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(params.get("token") || "");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"request" | "confirm">(
    params.get("token") ? "confirm" : "request"
  );
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const requestReset = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Failed");
      return;
    }
    setMsg(data.message);
    if (data.token) {
      setToken(data.token);
      setStep("confirm");
    }
  };

  const confirmReset = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/auth/reset", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Failed");
      return;
    }
    setMsg("Password updated. Sign in.");
    setTimeout(() => router.push("/login"), 1200);
  };

  return (
    <div className="mx-auto max-w-md space-y-5 animate-fade-in py-6">
      <h1 className="font-display text-3xl text-echo-50 text-center">
        Reset password
      </h1>

      {step === "request" ? (
        <form onSubmit={requestReset} className="card p-5 space-y-3">
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset"}
          </button>
        </form>
      ) : (
        <form onSubmit={confirmReset} className="card p-5 space-y-3">
          <div>
            <label className="label">Token</label>
            <input
              className="input font-mono text-xs"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">New password</label>
            <input
              className="input"
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Set new password"
            )}
          </button>
        </form>
      )}

      {(msg || err) && (
        <p
          className={`text-xs rounded-xl px-3 py-2 border ${
            err
              ? "text-rose-200 border-rose-500/30 bg-rose-950/30"
              : "text-echo-100 border-echo-500/25 bg-echo-950/30"
          }`}
        >
          {err || msg}
        </p>
      )}

      <p className="text-center text-xs text-ink-500">
        <Link href="/login" className="underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
        </div>
      }
    >
      <ResetInner />
    </Suspense>
  );
}
