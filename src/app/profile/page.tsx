"use client";

import { useMemo, useState } from "react";
import { hardNoPresets, kinks, writingStyles } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";
import type { Gender } from "@/lib/types";
import { clearQuiz, loadQuiz } from "@/lib/quiz";
import { IntroQuiz } from "@/components/IntroQuiz";
import clsx from "clsx";
import { Sparkles } from "lucide-react";

export default function ProfilePage() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const [customKink, setCustomKink] = useState("");
  const [customNo, setCustomNo] = useState("");
  const [saved, setSaved] = useState(false);
  const [retakeQuiz, setRetakeQuiz] = useState(false);
  const quiz = typeof window !== "undefined" ? loadQuiz() : null;

  const kinkCategories = useMemo(() => {
    const map = new Map<string, typeof kinks>();
    for (const k of kinks) {
      const list = map.get(k.category) || [];
      list.push(k);
      map.set(k.category, list);
    }
    return map;
  }, []);

  const toggleKink = (id: string) => {
    const next = profile.kinks.includes(id)
      ? profile.kinks.filter((k) => k !== id)
      : [...profile.kinks, id];
    setProfile({ kinks: next });
  };

  const toggleHardNo = (id: string) => {
    const next = profile.hardNos.includes(id)
      ? profile.hardNos.filter((k) => k !== id)
      : [...profile.hardNos, id];
    setProfile({ hardNos: next });
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {retakeQuiz && (
        <IntroQuiz
          onDone={() => setRetakeQuiz(false)}
          onSkip={() => setRetakeQuiz(false)}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="panel-title text-2xl">Personalization</h1>
          <p className="text-sm text-ink-500 mt-1">
            Shapes every generated scene. Saved locally.
          </p>
        </div>
        {saved && (
          <span className="text-xs text-echo-300 animate-fade-in">Saved</span>
        )}
      </div>

      <section className="card p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="label mb-0">Intro vibe quiz</h2>
            <p className="text-xs text-ink-500 mt-1">
              Powers Home → For you.{" "}
              {quiz?.completed
                ? `Heat ${quiz.heat}/10 · ${quiz.vibes.join(", ") || "—"}`
                : "Not taken yet."}
            </p>
          </div>
          <button
            type="button"
            className="btn-primary text-xs min-h-10 shrink-0"
            onClick={() => {
              clearQuiz();
              setRetakeQuiz(true);
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {quiz?.completed ? "Retake quiz" : "Take quiz"}
          </button>
        </div>
      </section>

      <section className="card p-5 space-y-4">
        <h2 className="label">Identity</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              value={profile.name}
              onChange={(e) => {
                setProfile({ name: e.target.value });
                flashSaved();
              }}
              placeholder="Your name in stories"
            />
          </div>
          <div>
            <label className="label">Age (18+)</label>
            <input
              type="number"
              min={18}
              max={120}
              className="input"
              value={profile.age}
              onChange={(e) => {
                const age = Math.max(18, Number(e.target.value) || 18);
                setProfile({ age });
                flashSaved();
              }}
            />
          </div>
          <div>
            <label className="label">Gender</label>
            <select
              className="input"
              value={profile.gender}
              onChange={(e) => {
                setProfile({ gender: e.target.value as Gender });
                flashSaved();
              }}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Non-binary</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="label">Pronouns</label>
            <div className="flex gap-2">
              <input
                className="input"
                placeholder="they"
                value={profile.pronouns.subject}
                onChange={(e) =>
                  setProfile({
                    pronouns: { ...profile.pronouns, subject: e.target.value },
                  })
                }
              />
              <input
                className="input"
                placeholder="them"
                value={profile.pronouns.object}
                onChange={(e) =>
                  setProfile({
                    pronouns: { ...profile.pronouns, object: e.target.value },
                  })
                }
              />
              <input
                className="input"
                placeholder="their"
                value={profile.pronouns.possessive}
                onChange={(e) =>
                  setProfile({
                    pronouns: {
                      ...profile.pronouns,
                      possessive: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="card p-5 space-y-4">
        <h2 className="label">Writing style</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {writingStyles.map((w) => (
            <button
              key={w.id}
              type="button"
              className={clsx(
                "card p-3 text-left transition",
                profile.writingStyle === w.id
                  ? "border-echo-500/50 ring-1 ring-echo-500/30"
                  : "hover:border-white/20"
              )}
              onClick={() => {
                setProfile({ writingStyle: w.id });
                flashSaved();
              }}
            >
              <span className="text-sm text-echo-100">{w.label}</span>
              <p className="text-[11px] text-ink-500 mt-1">{w.description}</p>
            </button>
          ))}
        </div>
        <div>
          <label className="label">
            Explicitness default: {profile.explicitness}/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={profile.explicitness}
            onChange={(e) => {
              setProfile({ explicitness: Number(e.target.value) });
              flashSaved();
            }}
            className="w-full accent-echo-500"
          />
        </div>
      </section>

      <section className="card p-5 space-y-4">
        <h2 className="label">Kinks & interests</h2>
        {Array.from(kinkCategories.entries()).map(([cat, list]) => (
          <div key={cat}>
            <p className="text-[10px] uppercase tracking-wider text-ink-500 mb-2">
              {cat}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {list.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  className={clsx(
                    "chip",
                    profile.kinks.includes(k.id) && "chip-active"
                  )}
                  onClick={() => {
                    toggleKink(k.id);
                    flashSaved();
                  }}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Custom kink tag…"
            value={customKink}
            onChange={(e) => setCustomKink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customKink.trim()) {
                setProfile({
                  customKinks: [...profile.customKinks, customKink.trim()],
                });
                setCustomKink("");
                flashSaved();
              }
            }}
          />
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              if (!customKink.trim()) return;
              setProfile({
                customKinks: [...profile.customKinks, customKink.trim()],
              });
              setCustomKink("");
              flashSaved();
            }}
          >
            Add
          </button>
        </div>
        {profile.customKinks.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.customKinks.map((k) => (
              <button
                key={k}
                type="button"
                className="chip chip-active"
                onClick={() => {
                  setProfile({
                    customKinks: profile.customKinks.filter((x) => x !== k),
                  });
                  flashSaved();
                }}
              >
                {k} ×
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="card p-5 space-y-4 border-red-500/20">
        <h2 className="label text-red-300/80">Limits / hard no&apos;s</h2>
        <p className="text-xs text-ink-500">
          These are injected into every AI prompt as absolute exclusions.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {hardNoPresets.map((h) => (
            <button
              key={h.id}
              type="button"
              className={clsx(
                "chip",
                profile.hardNos.includes(h.id) &&
                  "border-red-400/40 bg-red-500/15 text-red-100"
              )}
              onClick={() => {
                if (h.id === "minors") return; // always on
                toggleHardNo(h.id);
                flashSaved();
              }}
            >
              {h.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Custom hard no…"
            value={customNo}
            onChange={(e) => setCustomNo(e.target.value)}
          />
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              if (!customNo.trim()) return;
              setProfile({
                customHardNos: [...profile.customHardNos, customNo.trim()],
              });
              setCustomNo("");
              flashSaved();
            }}
          >
            Add
          </button>
        </div>
        {profile.customHardNos.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.customHardNos.map((k) => (
              <button
                key={k}
                type="button"
                className="chip border-red-400/40 bg-red-500/15 text-red-100"
                onClick={() => {
                  setProfile({
                    customHardNos: profile.customHardNos.filter((x) => x !== k),
                  });
                  flashSaved();
                }}
              >
                {k} ×
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
