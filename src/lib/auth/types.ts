export type PlanId = "free" | "pro" | "lifetime" | "god";

export interface UserRecord {
  id: string;
  email: string;
  /** display name */
  name: string;
  passwordHash: string;
  salt: string;
  plan: PlanId;
  /** Stripe customer id when wired */
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
  /** YYYY-MM-DD of usage counter */
  usageDate: string;
  storyUses: number;
  imageUses: number;
  avatarUses: number;
  /** ban flag */
  banned?: boolean;
}

export interface SessionPayload {
  uid: string;
  email: string;
  plan: PlanId;
  exp: number;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  plan: PlanId;
  isGod: boolean;
  usage: {
    storyUses: number;
    imageUses: number;
    avatarUses: number;
    storyLimit: number | null;
    imageLimit: number | null;
    avatarLimit: number | null;
    resetsAt: string;
  };
  features: PlanFeatures;
}

export interface PlanFeatures {
  id: PlanId;
  label: string;
  priceLabel: string;
  storyPerDay: number | null; // null = unlimited
  imagePerDay: number | null;
  avatarPerDay: number | null;
  maxActiveStories: number | null;
  /** Live AI image/avatar generation (costs xAI credits) — Pro+ only by default */
  canGenerateImages: boolean;
  offlineOnly: boolean;
  priority: boolean;
  canBypassLimits: boolean;
  canAccessAdmin: boolean;
  marketingBullets: string[];
}
