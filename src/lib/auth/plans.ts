import type { PlanFeatures, PlanId } from "./types";

export const PLANS: Record<PlanId, PlanFeatures> = {
  free: {
    id: "free",
    label: "Free",
    priceLabel: "$0",
    // Hook: 4 free story scenes/day. No live image gen (uses pre-made portraits only).
    storyPerDay: 4,
    imagePerDay: 0,
    avatarPerDay: 0,
    maxActiveStories: 3,
    canGenerateImages: false,
    offlineOnly: false,
    priority: false,
    canBypassLimits: false,
    canAccessAdmin: false,
    marketingBullets: [
      "4 AI story scenes / day",
      "Full preset library + pre-made portraits",
      "No AI image spend on free tier",
      "Local saves + share codes",
    ],
  },
  pro: {
    id: "pro",
    label: "Pro",
    priceLabel: "$12/mo",
    // Story heavy; image caps priced to cover xAI image tokens
    storyPerDay: 200,
    imagePerDay: 20,
    avatarPerDay: 15,
    maxActiveStories: null,
    canGenerateImages: true,
    offlineOnly: false,
    priority: true,
    canBypassLimits: false,
    canAccessAdmin: false,
    marketingBullets: [
      "200 story scenes / day",
      "AI scene images (20/day) — covers API cost",
      "Portrait regen (15/day)",
      "Priority generation",
      "Unlimited saved stories",
    ],
  },
  lifetime: {
    id: "lifetime",
    label: "Lifetime",
    priceLabel: "$79 once",
    storyPerDay: null,
    imagePerDay: 60,
    avatarPerDay: 40,
    maxActiveStories: null,
    canGenerateImages: true,
    offlineOnly: false,
    priority: true,
    canBypassLimits: false,
    canAccessAdmin: false,
    marketingBullets: [
      "Unlimited story scenes",
      "AI images included (fair-use daily caps)",
      "All Pro story perks forever",
      "Founding-member badge",
    ],
  },
  god: {
    id: "god",
    label: "God",
    priceLabel: "Owner",
    storyPerDay: null,
    imagePerDay: null,
    avatarPerDay: null,
    maxActiveStories: null,
    canGenerateImages: true,
    offlineOnly: false,
    priority: true,
    canBypassLimits: true,
    canAccessAdmin: true,
    marketingBullets: ["Unrestricted owner access", "Admin tools", "No limits"],
  },
};

export function getPlan(id: PlanId | string | undefined): PlanFeatures {
  if (id && id in PLANS) return PLANS[id as PlanId];
  return PLANS.free;
}

export type MeterKind = "story" | "image" | "avatar";

export function limitFor(
  plan: PlanFeatures,
  kind: MeterKind
): number | null {
  if (kind === "story") return plan.storyPerDay;
  if (kind === "image") return plan.imagePerDay;
  return plan.avatarPerDay;
}
