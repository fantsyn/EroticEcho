"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const KEY = "eroticecho:installTipDismiss";

/**
 * One-time mobile tip: Add to Home Screen / install PWA.
 */
export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferred, setDeferred] = useState<{
    prompt: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(KEY) === "1") return;
    // Only tip on small screens / standalone not already installed
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).standalone === true;
    if (standalone) return;

    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    if (!isMobile && window.innerWidth > 900) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      const ev = e as Event & {
        prompt: () => Promise<void>;
      };
      setDeferred({ prompt: () => ev.prompt() });
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    // iOS never fires beforeinstallprompt — show manual tip once after short delay
    const t = window.setTimeout(() => {
      if (!localStorage.getItem(KEY)) setShow(true);
    }, 4000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.clearTimeout(t);
    };
  }, []);

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem(KEY, "1");
    setShow(false);
  };

  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-4 inset-x-3 z-[70] mx-auto max-w-md">
      <div className="card p-3.5 flex gap-3 items-start border-echo-500/25 shadow-2xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-echo-500/20">
          <Download className="h-5 w-5 text-echo-200" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-echo-50 font-medium">Install EroticEcho</p>
          <p className="text-[11px] text-ink-400 mt-0.5 leading-relaxed">
            {deferred
              ? "Add to your home screen for a full-app feel."
              : "On iPhone: Share → Add to Home Screen. On Android: browser menu → Install app."}
          </p>
          <div className="flex gap-2 mt-2">
            {deferred && (
              <button
                type="button"
                className="btn-primary text-[11px] min-h-9 px-3"
                onClick={async () => {
                  await deferred.prompt();
                  dismiss();
                }}
              >
                Install
              </button>
            )}
            <button
              type="button"
              className="btn-ghost text-[11px] min-h-9 px-3"
              onClick={dismiss}
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          className="p-1 text-ink-500"
          onClick={dismiss}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
