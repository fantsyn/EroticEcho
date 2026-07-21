"use client";

import { create } from "zustand";
import type { PlanFeatures, PublicUser } from "@/lib/auth/types";
import {
  fetchMe,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "@/lib/auth-client";
import { track } from "@/lib/analytics";

interface AuthState {
  ready: boolean;
  user: PublicUser | null;
  plans: PlanFeatures[];
  authRequired: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  ready: false,
  user: null,
  plans: [],
  authRequired: true,
  error: null,

  refresh: async () => {
    try {
      const data = await fetchMe();
      set({
        ready: true,
        user: data.user,
        plans: data.plans || [],
        authRequired: data.authRequired !== false,
        error: null,
      });
    } catch {
      set({ ready: true, user: null, error: "Could not load session" });
    }
  },

  login: async (email, password) => {
    set({ error: null });
    const res = await loginRequest(email, password);
    if (res.error || !res.user) {
      set({ error: res.error || "Login failed" });
      return false;
    }
    set({ user: res.user, error: null });
    track("login", { plan: res.user.plan });
    return true;
  },

  register: async (email, password, name) => {
    set({ error: null });
    const res = await registerRequest({ email, password, name });
    if (res.error || !res.user) {
      set({ error: res.error || "Register failed" });
      return false;
    }
    set({ user: res.user, error: null });
    track("register", { plan: res.user.plan });
    return true;
  },

  logout: async () => {
    await logoutRequest();
    set({ user: null });
  },
}));
