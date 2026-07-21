"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import type { StoryPreset } from "@/lib/presets";
import { getCharacterById } from "@/lib/data";
import { getTheme } from "@/lib/themes";
import { staticAvatarPath } from "@/lib/avatars";
import {
  isFavoritePreset,
  toggleFavoritePreset,
} from "@/lib/storage";
import { Play, ChevronLeft, ChevronRight, Star } from "lucide-react";
import clsx from "clsx";
import { unlockAudio } from "@/lib/voice";

interface Props {
  preset: StoryPreset;
  onPlay: () => void;
  /** Controlled favorite state from parent */
  favorited?: boolean;
  onFavoriteChange?: (ids: string[]) => void;
}

const LOOK_PRIORITY = [
  "role",
  "sexy",
  "hot",
  "erotic",
  "slutty",
  "almost",
  "cute",
  "shy",
] as const;

function probeImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

export function PresetCard({
  preset,
  onPlay,
  favorited: favoritedProp,
  onFavoriteChange,
}: Props) {
  const theme = getTheme(preset.theme);
  const character = getCharacterById(preset.characterId);
  const [lookIndex, setLookIndex] = useState(0);
  const [available, setAvailable] = useState<
    { id: string; label: string; src: string }[]
  >([]);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(
      favoritedProp !== undefined
        ? favoritedProp
        : isFavoritePreset(preset.id)
    );
  }, [preset.id, favoritedProp]);

  const candidates = useMemo(() => {
    if (!character) return [];
    const labels = new Map(
      (character.portraitLooks || []).map((l) => [l.id, l.label])
    );
    const list: { id: string; label: string; src: string }[] = [];
    for (const id of LOOK_PRIORITY) {
      list.push({
        id,
        label: labels.get(id) || id,
        src: staticAvatarPath(character.id, `${character.id}-${id}.png`),
      });
    }
    list.push({
      id: "base",
      label: "Default",
      src: staticAvatarPath(character.id),
    });
    return list;
  }, [character]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok: { id: string; label: string; src: string }[] = [];
      for (const c of candidates) {
        const good = await probeImage(c.src);
        if (cancelled) return;
        if (good) ok.push(c);
      }
      if (!cancelled) {
        setAvailable(ok.length ? ok : candidates.slice(-1));
        setLookIndex(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [candidates]);

  const safeIndex =
    available.length === 0 ? 0 : lookIndex % Math.max(available.length, 1);
  const current = available[safeIndex];

  const cycle = (dir: 1 | -1) => {
    if (available.length < 2) return;
    setLookIndex((i) => (i + dir + available.length) % available.length);
  };

  const toggleFav = (e: MouseEvent) => {
    e.stopPropagation();
    const next = toggleFavoritePreset(preset.id);
    setFav(next.includes(preset.id));
    onFavoriteChange?.(next);
  };

  return (
    <article
      className={clsx(
        "group relative overflow-hidden rounded-2xl border border-white/10",
        "bg-gradient-to-br",
        preset.coverGradient,
        "transition duration-300 hover:border-white/25 sm:hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40"
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/70 via-transparent to-white/5 pointer-events-none" />

      <div className="relative p-4 sm:p-6 min-h-[240px] flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          {character && current && (
            <div className="relative shrink-0">
              <div className="h-16 w-14 sm:h-20 sm:w-16 rounded-xl overflow-hidden ring-2 ring-white/15 bg-black/40 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={current.src}
                  src={current.src}
                  alt={`${character.name} ${current.label}`}
                  className="h-full w-full object-cover object-top"
                  draggable={false}
                />
              </div>
              {available.length > 1 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                  <button
                    type="button"
                    className="p-1 rounded-full bg-black/70 text-white/80 active:text-white min-h-7 min-w-7 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      cycle(-1);
                    }}
                    aria-label="Previous look"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded-full bg-black/70 text-white/80 active:text-white min-h-7 min-w-7 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      cycle(1);
                    }}
                    aria-label="Next look"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 flex-1 min-w-0 content-start">
            <button
              type="button"
              onClick={toggleFav}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-full border touch-manipulation",
                fav
                  ? "border-amber-400/50 bg-amber-500/20 text-amber-200"
                  : "border-white/15 bg-black/30 text-white/50"
              )}
              aria-label={fav ? "Unfavorite" : "Favorite"}
            >
              <Star className={clsx("h-3.5 w-3.5", fav && "fill-current")} />
            </button>
            {preset.tags.map((t) => (
              <span key={t} className={clsx("chip text-[10px]", theme.chip)}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {available.length > 1 && current && (
          <div className="flex flex-wrap items-center gap-1 mb-2 min-h-[1rem]">
            {available.slice(0, 8).map((l, i) => (
              <button
                key={l.id}
                type="button"
                title={l.label}
                onClick={(e) => {
                  e.stopPropagation();
                  setLookIndex(i);
                }}
                className={clsx(
                  "h-1.5 rounded-full transition",
                  i === safeIndex
                    ? "w-4 bg-white/90"
                    : "w-1.5 bg-white/30 active:bg-white/50"
                )}
              />
            ))}
            <span className="text-[10px] text-white/45 ml-1 capitalize">
              {current.label}
            </span>
          </div>
        )}

        <h3 className="font-display text-xl sm:text-2xl text-white leading-snug mb-1">
          {preset.title}
        </h3>
        <p className="text-sm text-white/70 italic mb-2 sm:mb-3 line-clamp-2">
          {preset.tagline}
        </p>
        <p className="text-xs text-white/55 line-clamp-2 sm:line-clamp-3 flex-1 leading-relaxed">
          {preset.blurb}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-widest text-white/40 truncate">
            Heat {preset.intensity}/10 · {preset.mode}
            {character ? ` · ${character.name}` : ""}
          </span>
          <button
            type="button"
            onClick={async () => {
              await unlockAudio();
              onPlay();
            }}
            className="btn-primary py-2.5 px-4 text-xs shadow-lg min-h-11 shrink-0"
          >
            <Play className="h-3.5 w-3.5" /> Play
          </button>
        </div>
      </div>
    </article>
  );
}
