"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, LogIn, UserPlus } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const error = useAuthStore((s) => s.error);
  const user = useAuthStore((s) => s.user);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok =
      mode === "login"
        ? await login(email, password)
        : await register(email, password, name || undefined);
    setBusy(false);
    if (ok) router.push(next);
  };

  return (
    <div className="mx-auto max-w-md space-y-6 animate-fade-in py-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-echo-50">
          {mode === "login" ? "Sign in" : "Create account"}
        </h1>
        <p className="text-sm text-ink-500 mt-2">
          Free tier included. Upgrade anytime for more generations.
        </p>
      </div>

      <form onSubmit={submit} className="card p-5 sm:p-6 space-y-4">
        {mode === "register" && (
          <div>
            <label className="label">Display name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="nickname"
              placeholder="Optional"
            />
          </div>
        )}
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            placeholder="Min 8 characters"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary w-full min-h-12"
          disabled={busy}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : mode === "login" ? (
            <LogIn className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {mode === "login" ? "Sign in" : "Create free account"}
        </button>

        <button
          type="button"
          className="w-full text-center text-xs text-ink-400 hover:text-ink-200 min-h-10"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "Need an account? Register free"
            : "Already have an account? Sign in"}
        </button>
      </form>

      <p className="text-center text-[11px] text-ink-600">
        <Link href="/reset" className="underline text-ink-400">
          Forgot password?
        </Link>
        {" · "}
        By continuing you confirm you are 18+ and agree to the{" "}
        <Link href="/terms" className="underline text-ink-400">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline text-ink-400">
          Privacy
        </Link>
        .
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20 text-ink-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
