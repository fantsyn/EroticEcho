"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Moon, X } from "lucide-react";
import { useState } from "react";
import { LimitReachedModal } from "./LimitReachedModal";

/**
 * Soft banner near limit; full modal when exhausted.
 */
export function UsageBanner() {
  const user = useAuthStore((s) => s.user);
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (!user || user.isGod) return null;
  const { storyUses, storyLimit } = user.usage;
  if (storyLimit === null || storyLimit <= 0) return null;

  const left = Math.max(0, storyLimit - storyUses);
  const ratio = storyUses / storyLimit;
  if (ratio < 0.75 && left > 0) return null;
  if (dismissed && left > 0) return null;

  const exhausted = left <= 0;

  return (
    <>
      <div
        className={`rounded-xl border px-3 py-2.5 flex items-start gap-2 text-xs ${
          exhausted
            ? "border-rose-500/35 bg-rose-950/40 text-rose-50"
            : "border-amber-500/30 bg-amber-950/35 text-amber-50"
        }`}
      >
        <div className="flex-1 min-w-0 leading-relaxed">
          {exhausted ? (
            <>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Moon className="h-3.5 w-3.5" />
                Come back tomorrow
              </span>
              <span className="block mt-1 text-rose-100/85">
                You&apos;ve used all <strong>{storyLimit}</strong> free scenes
                today. Limits reset at midnight UTC — or unlock more with Pro
                if you want another night tonight.
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-ghost text-[11px] min-h-9 px-3"
                  onClick={() => setModalOpen(true)}
                >
                  Details
                </button>
                <Link
                  href="/pricing"
                  className="btn-primary text-[11px] min-h-9 px-3 inline-flex"
                >
                  See Pro
                </Link>
              </div>
            </>
          ) : (
            <>
              <strong>{left}</strong> free scene{left === 1 ? "" : "s"} left
              today ({storyUses}/{storyLimit}). When they&apos;re gone,
              you&apos;re welcome back tomorrow — or{" "}
              <Link href="/pricing" className="underline font-medium">
                go Pro
              </Link>{" "}
              for a longer night.
            </>
          )}
        </div>
        {!exhausted && (
          <button
            type="button"
            className="p-1 opacity-70 hover:opacity-100"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <LimitReachedModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
