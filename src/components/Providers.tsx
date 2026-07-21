"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { AgeGate } from "./AgeGate";
import { AuthProvider } from "./AuthProvider";
import { UpgradeCelebration } from "./UpgradeCelebration";
import { IntroQuiz } from "./IntroQuiz";
import { InstallPrompt } from "./InstallPrompt";
import { loadQuiz } from "@/lib/quiz";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAppStore((s) => s.hydrate);
  const hydrated = useAppStore((s) => s.hydrated);
  const ageVerified = useAppStore((s) => s.ageVerified);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizChecked, setQuizChecked] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated || !ageVerified || quizChecked) return;
    setQuizChecked(true);
    if (!loadQuiz()) setQuizOpen(true);
  }, [hydrated, ageVerified, quizChecked]);

  if (!hydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-echo-scene">
        <div className="text-echo-300 animate-pulse-soft font-display text-xl tracking-widest">
          EroticEcho
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      {!ageVerified && <AgeGate />}
      {ageVerified && quizOpen && (
        <IntroQuiz
          onDone={() => setQuizOpen(false)}
          onSkip={() => setQuizOpen(false)}
        />
      )}
      <UpgradeCelebration />
      {ageVerified && <InstallPrompt />}
      {children}
    </AuthProvider>
  );
}
