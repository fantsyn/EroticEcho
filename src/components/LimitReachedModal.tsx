"use client";

import Link from "next/link";
import { Moon, Sparkles, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Full "come back tomorrow" + light sales when daily story scenes are gone.
 */
export function LimitReachedModal({ open, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  if (!open) return null;

  const limit = user?.usage.storyLimit ?? 4;
  const resets = user?.usage.resetsAt
    ? new Date(user.usage.resetsAt).toLocaleString()
    : "midnight UTC";

  return (
    <div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center bg-black/80 p-3 backdrop-blur-md">
      <div className="card w-full max-w-md p-5 sm:p-6 relative border-rose-500/25 shadow-2xl animate-slide-up">
        <button
          type="button"
          className="absolute top-3 right-3 p-2 text-ink-500 hover:text-ink-200 min-h-10 min-w-10"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600/40 to-violet-700/40 ring-1 ring-white/10 mb-4">
          <Moon className="h-6 w-6 text-rose-100" />
        </div>

        <h2 className="font-display text-2xl text-echo-50 mb-2">
          That&apos;s your echo for today
        </h2>
        <p className="text-sm text-ink-300 leading-relaxed mb-4">
          You&apos;ve used all <strong className="text-ink-100">{limit}</strong>{" "}
          free story scenes for today. Come back tomorrow — your limit resets
          around <span className="text-ink-200">{resets}</span>.
        </p>

        <ul className="text-xs text-ink-400 space-y-1.5 mb-5 rounded-xl border border-white/8 bg-black/30 p-3">
          <li>• Browse presets &amp; save favorites anytime</li>
          <li>• Tweak loadouts and profiles offline</li>
          <li>• Pre-made portraits stay free</li>
        </ul>

        <div className="rounded-xl border border-echo-500/25 bg-echo-950/40 p-3 mb-4">
          <p className="text-xs text-echo-100/90 leading-relaxed flex gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-echo-300 mt-0.5" />
            <span>
              Want more scenes tonight?{" "}
              <strong>Pro</strong> unlocks far higher daily limits and optional
              AI photos (paid feature so free never burns image credits).
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            className="btn-ghost flex-1 min-h-11"
            onClick={onClose}
          >
            I&apos;ll come back tomorrow
          </button>
          <Link
            href="/pricing"
            className="btn-primary flex-1 min-h-11 justify-center"
            onClick={onClose}
          >
            See Pro
          </Link>
        </div>
      </div>
    </div>
  );
}
