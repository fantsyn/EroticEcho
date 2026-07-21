"use client";

import { useMemo, useState } from "react";
import {
  QUIZ_STEPS,
  saveQuiz,
  type QuizVibe,
} from "@/lib/quiz";
import { track } from "@/lib/analytics";
import clsx from "clsx";

interface Props {
  onDone: () => void;
  onSkip: () => void;
}

/**
 * Short 3-step intro quiz for new users → powers "For you".
 */
export function IntroQuiz({ onDone, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [heat, setHeat] = useState(6);
  const [vibes, setVibes] = useState<QuizVibe[]>([]);
  const [pace, setPace] = useState<"slow" | "medium" | "fast">("medium");

  const current = QUIZ_STEPS[step];
  const progress = ((step + 1) / QUIZ_STEPS.length) * 100;

  const canNext = useMemo(() => {
    if (current.id === "vibe") return vibes.length > 0;
    return true;
  }, [current.id, vibes.length]);

  const pickHeat = (id: string) => {
    setHeat(Number(id) || 6);
  };

  const toggleVibe = (id: string) => {
    const v = id as QuizVibe;
    setVibes((prev) => {
      if (prev.includes(v)) return prev.filter((x) => x !== v);
      if (prev.length >= 3) return [...prev.slice(1), v];
      return [...prev, v];
    });
  };

  const finish = () => {
    // pace nudges heat slightly
    let h = heat;
    if (pace === "slow") h = Math.max(2, h - 1);
    if (pace === "fast") h = Math.min(10, h + 1);
    saveQuiz({ heat: h, vibes: vibes.length ? vibes : ["soft"] });
    track("page_view", { page: "quiz_done", heat: h });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ee-quiz-done"));
    }
    onDone();
  };

  const next = () => {
    if (step >= QUIZ_STEPS.length - 1) {
      finish();
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-ink-950/90 p-3 sm:p-4 backdrop-blur-xl">
      <div className="card w-full max-w-md p-5 sm:p-7 animate-slide-up shadow-2xl border-echo-500/20">
        <div className="mb-4">
          <p className="section-kicker mb-1">Quick intro</p>
          <h2 className="font-display text-2xl text-echo-50">
            {current.question}
          </h2>
          <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-echo-500 to-velvet-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {current.options.map((opt) => {
            const selected =
              current.id === "heat"
                ? String(heat) === opt.id
                : current.id === "vibe"
                  ? vibes.includes(opt.id as QuizVibe)
                  : pace === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  if (current.id === "heat") pickHeat(opt.id);
                  else if (current.id === "vibe") toggleVibe(opt.id);
                  else setPace(opt.id as "slow" | "medium" | "fast");
                }}
                className={clsx(
                  "w-full text-left rounded-xl border px-3.5 py-3 min-h-14 transition touch-manipulation",
                  selected
                    ? "border-echo-400/50 bg-echo-500/15 text-echo-50"
                    : "border-white/10 bg-black/25 text-ink-200 active:bg-white/5"
                )}
              >
                <span className="block text-sm font-medium">{opt.label}</span>
                {"desc" in opt && opt.desc && (
                  <span className="block text-[11px] text-ink-500 mt-0.5">
                    {opt.desc}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="btn-ghost flex-1 min-h-11 text-xs"
            onClick={() => {
              saveQuiz({ heat: 6, vibes: ["soft", "filth"] });
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("ee-quiz-done"));
              }
              onSkip();
            }}
          >
            Skip
          </button>
          <button
            type="button"
            className="btn-primary flex-1 min-h-11"
            disabled={!canNext}
            onClick={next}
          >
            {step >= QUIZ_STEPS.length - 1 ? "Show my picks" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
