"use client";

import { useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import clsx from "clsx";
import type { ActiveStory } from "@/lib/types";
import {
  AMBIENT_PRESETS,
  type AmbientId,
  getAmbientVolume,
  inferAmbient,
  loadAmbientPreference,
  saveAmbientPreference,
  setAmbient,
  setAmbientVolume,
  unlockAmbient,
} from "@/lib/ambient";
import { resolveStoryThemeId } from "@/lib/presets";

interface Props {
  story: ActiveStory | null;
  /** Compact control for play toolbar */
  compact?: boolean;
  className?: string;
}

/**
 * Soft ambient bed matched to story tone/location.
 * Starts only after a user gesture (toggle / volume).
 */
export function AmbientAudio({ story, compact, className }: Props) {
  const pref = useMemo(() => loadAmbientPreference(), []);
  const [enabled, setEnabled] = useState(pref.enabled);
  const [volume, setVolume] = useState(pref.volume);
  const [lockedId, setLockedId] = useState<AmbientId | null>(pref.lockedId);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<AmbientId>("off");

  const inferred = useMemo(() => {
    if (!story) return "night" as AmbientId;
    return inferAmbient({
      themeId: resolveStoryThemeId(story),
      category: story.scenario.category,
      tags: story.scenario.tags,
      setup: story.scenario.setup,
      title: story.title,
      location: story.mods.locationOverride,
    });
  }, [story]);

  const targetId: AmbientId = !enabled
    ? "off"
    : lockedId && lockedId !== "off"
      ? lockedId
      : inferred;

  useEffect(() => {
    setAmbientVolume(volume);
  }, [volume]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!enabled) {
        await setAmbient("off");
        if (!cancelled) setActiveId("off");
        return;
      }
      // Only start once unlocked via gesture; setAmbient no-ops if suspended
      await setAmbient(targetId);
      if (!cancelled) setActiveId(targetId);
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, targetId]);

  useEffect(() => {
    return () => {
      void setAmbient("off");
    };
  }, []);

  const persist = (next: {
    enabled?: boolean;
    volume?: number;
    lockedId?: AmbientId | null;
  }) => {
    const e = next.enabled ?? enabled;
    const v = next.volume ?? volume;
    const l = next.lockedId !== undefined ? next.lockedId : lockedId;
    saveAmbientPreference({ enabled: e, volume: v, lockedId: l });
  };

  const onToggle = async () => {
    await unlockAmbient();
    const next = !enabled;
    setEnabled(next);
    persist({ enabled: next });
    if (next) {
      await setAmbient(targetId === "off" ? inferred : targetId);
      setActiveId(targetId === "off" ? inferred : targetId);
    } else {
      await setAmbient("off");
      setActiveId("off");
    }
  };

  const pick = async (id: AmbientId) => {
    await unlockAmbient();
    if (id === "off") {
      setEnabled(false);
      setLockedId(null);
      persist({ enabled: false, lockedId: null });
      await setAmbient("off");
      setActiveId("off");
      return;
    }
    if (id === "auto" as AmbientId) {
      // not used
    }
    setEnabled(true);
    // "match" = clear lock and use inferred
    if (id === inferred) {
      setLockedId(null);
      persist({ enabled: true, lockedId: null });
    } else {
      setLockedId(id);
      persist({ enabled: true, lockedId: id });
    }
    await setAmbient(id);
    setActiveId(id);
  };

  const label =
    AMBIENT_PRESETS.find((p) => p.id === (enabled ? activeId : "off"))
      ?.label || "Ambient";

  if (compact) {
    return (
      <div className={clsx("relative", className)}>
        <button
          type="button"
          className={clsx(
            "btn-ghost min-h-10 px-2.5 text-xs touch-manipulation gap-1",
            enabled && activeId !== "off" && "border-echo-500/35 text-echo-200",
            open && "border-white/25"
          )}
          title="Background ambience"
          onClick={() => setOpen((v) => !v)}
        >
          {enabled && activeId !== "off" ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline max-w-[4.5rem] truncate">
            {enabled ? label : "Quiet"}
          </span>
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl border border-white/10 bg-ink-950/95 backdrop-blur-md p-2.5 shadow-2xl space-y-2 animate-fade-in">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-widest text-ink-500">
                Ambience
              </p>
              <button
                type="button"
                className="text-[11px] text-echo-300 hover:text-echo-100"
                onClick={() => void onToggle()}
              >
                {enabled ? "Mute" : "On"}
              </button>
            </div>
            <p className="text-[10px] text-ink-500 leading-snug">
              Auto: <span className="text-ink-300">{inferred}</span>
              {lockedId ? ` · locked ${lockedId}` : " · matching scene"}
            </p>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                className={clsx(
                  "rounded-full border px-2 py-0.5 text-[10px] min-h-7",
                  enabled && !lockedId
                    ? "border-echo-400/50 bg-echo-500/20 text-echo-50"
                    : "border-white/10 text-ink-400"
                )}
                onClick={async () => {
                  await unlockAmbient();
                  setEnabled(true);
                  setLockedId(null);
                  persist({ enabled: true, lockedId: null });
                  await setAmbient(inferred);
                  setActiveId(inferred);
                }}
              >
                Auto
              </button>
              {AMBIENT_PRESETS.filter((p) => p.id !== "off").map((p) => (
                <button
                  key={p.id}
                  type="button"
                  title={p.hint}
                  className={clsx(
                    "rounded-full border px-2 py-0.5 text-[10px] min-h-7",
                    enabled && activeId === p.id
                      ? "border-echo-400/50 bg-echo-500/20 text-echo-50"
                      : "border-white/10 text-ink-400"
                  )}
                  onClick={() => void pick(p.id)}
                >
                  {p.label}
                </button>
              ))}
              <button
                type="button"
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] min-h-7 text-ink-500"
                onClick={() => void pick("off")}
              >
                Off
              </button>
            </div>
            <label className="flex items-center gap-2 text-[10px] text-ink-400">
              <span className="w-10 shrink-0">Vol</span>
              <input
                type="range"
                min={0}
                max={0.2}
                step={0.01}
                value={volume}
                className="w-full accent-echo-400"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  setAmbientVolume(v);
                  persist({ volume: v });
                  void unlockAmbient();
                }}
              />
            </label>
            <p className="text-[9px] text-ink-600 leading-snug">
              Soft procedural beds only — very low by default.
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

/** Ensure volume stays in sync if external tools change it */
export function syncAmbientVolumeFromStorage() {
  const p = loadAmbientPreference();
  setAmbientVolume(p.volume || getAmbientVolume());
}
