"use client";

import type { PublicUser } from "@/lib/auth/types";
import type { PlanFeatures } from "@/lib/auth/types";

export type MeResponse = {
  user: PublicUser | null;
  plans: PlanFeatures[];
  authRequired: boolean;
};

export async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) {
    return { user: null, plans: [], authRequired: true };
  }
  return res.json();
}

export async function loginRequest(
  email: string,
  password: string
): Promise<{ user?: PublicUser; error?: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || "Login failed" };
  return { user: data.user };
}

export async function registerRequest(opts: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ user?: PublicUser; error?: string }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || "Register failed" };
  return { user: data.user };
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

export async function checkoutRequest(
  plan: "pro" | "lifetime"
): Promise<{
  url?: string;
  upgraded?: boolean;
  plan?: string;
  error?: string;
  message?: string;
}> {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || "Checkout failed" };
  return data;
}

export async function redeemCodeRequest(
  code: string
): Promise<{ ok?: boolean; plan?: string; error?: string }> {
  const res = await fetch("/api/billing/checkout", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || "Invalid code" };
  return data;
}
