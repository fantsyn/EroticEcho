"use client";

import { useAppStore } from "@/store/useAppStore";
import { unlockAudio } from "@/lib/voice";
import { track } from "@/lib/analytics";

export function AgeGate() {
  const verifyAge = useAppStore((s) => s.verifyAge);

  const enter = () => {
    // Fire unlock in the same user gesture (don't await — iOS needs sync chain)
    void unlockAudio();
    track("age_verify");
    verifyAge();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-xl">
      <div className="card max-w-md w-full p-6 sm:p-8 text-center animate-slide-up">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-echo-600 to-velvet-700 text-2xl shadow-lg shadow-echo-900/50">
          18+
        </div>
        <h1 className="font-display text-3xl text-echo-100 mb-2">EroticEcho</h1>
        <p className="text-ink-300 text-sm leading-relaxed mb-6">
          This app contains{" "}
          <strong className="text-echo-200">explicit erotic fiction</strong> for
          adults. All characters and participants must be 18 years of age or
          older. Content is fictional and meant for private, consensual
          enjoyment.
        </p>
        <ul className="text-left text-xs text-ink-400 mb-6 space-y-1 border border-white/5 rounded-xl p-4 bg-black/20">
          <li>• No content involving minors — ever</li>
          <li>• CNC / dark themes are fantasy with safewords</li>
          <li>• You control hard limits and intensity</li>
          <li>• Stories save locally in your browser by default</li>
        </ul>
        <button
          type="button"
          className="btn-primary w-full mb-3 min-h-12"
          onClick={enter}
        >
          I am 18 or older — Enter
        </button>
        <a
          href="https://www.google.com"
          className="text-xs text-ink-500 hover:text-ink-300 underline"
        >
          I am under 18 — Leave
        </a>
      </div>
    </div>
  );
}
