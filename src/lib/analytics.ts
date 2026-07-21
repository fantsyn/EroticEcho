/**
 * Lightweight product analytics.
 * - Always logs to console in dev
 * - If NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, sends Plausible events
 * - Stores last N events in sessionStorage for god debug panel
 */

export type AnalyticsEvent =
  | "page_view"
  | "register"
  | "login"
  | "story_generate"
  | "story_limit"
  | "checkout_click"
  | "upgrade_complete"
  | "redeem_code"
  | "preset_play"
  | "age_verify";

const KEY = "ee_analytics_buf";

function pushLocal(name: AnalyticsEvent, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  try {
    const prev = JSON.parse(sessionStorage.getItem(KEY) || "[]") as unknown[];
    const next = [
      { t: Date.now(), name, props },
      ...prev,
    ].slice(0, 40);
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* */
  }
}

export function track(
  name: AnalyticsEvent,
  props?: Record<string, string | number>
) {
  if (typeof window === "undefined") return;
  pushLocal(name, props);

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, props || {});
  }

  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (domain && typeof window !== "undefined") {
    const w = window as unknown as {
      plausible?: (n: string, o?: { props?: Record<string, string | number> }) => void;
    };
    try {
      w.plausible?.(name, props ? { props } : undefined);
    } catch {
      /* */
    }
  }
}

export function readAnalyticsBuffer(): {
  t: number;
  name: string;
  props?: Record<string, string | number>;
}[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
