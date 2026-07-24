"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import type { Character } from "@/lib/types";
import {
  characterInitials,
  portraitFallbackUrls,
  resolvePortraitUrl,
} from "@/lib/avatars";

type Size = "sm" | "md" | "lg" | "xl" | "hero";

const sizeClass: Record<Size, string> = {
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-sm",
  lg: "h-20 w-20 text-lg",
  xl: "h-28 w-28 text-xl",
  hero: "h-40 w-40 sm:h-48 sm:w-48 text-2xl",
};

interface Props {
  character: Character;
  size?: Size;
  className?: string;
  shape?: "circle" | "soft" | "portrait";
  /** Only when user clicks regen — never auto-generates */
  refreshToken?: number;
  onUrl?: (url: string) => void;
  showName?: boolean;
  /** Explicit opt-in to call /api/avatar (customize regen only) */
  allowGenerate?: boolean;
}

function seedUrl(character: Character): string | null {
  return resolvePortraitUrl(character);
}

export function CharacterAvatar({
  character,
  size = "md",
  className,
  shape = "soft",
  refreshToken = 0,
  onUrl,
  showName,
  allowGenerate = false,
}: Props) {
  const portraitKey = useMemo(
    () =>
      [
        character.id,
        character.selectedPortraitId || "",
        character.avatarUrl || "",
        character.selectedOutfitStyleId || "",
        refreshToken,
      ].join("|"),
    [
      character.id,
      character.selectedPortraitId,
      character.avatarUrl,
      character.selectedOutfitStyleId,
      refreshToken,
    ]
  );

  const [url, setUrl] = useState<string | null>(() => seedUrl(character));
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const fallbackIdx = useRef(0);
  const fallbacksRef = useRef<string[]>([]);
  const onUrlRef = useRef(onUrl);
  onUrlRef.current = onUrl;

  useEffect(() => {
    let cancelled = false;
    fallbackIdx.current = 0;
    fallbacksRef.current = portraitFallbackUrls(character);

    // User explicitly requested regen from Customize
    if (allowGenerate && refreshToken > 0) {
      void generate(true);
      return () => {
        cancelled = true;
      };
    }

    // Static / selected look only — NEVER auto-hit the image API
    const seed = seedUrl(character) || fallbacksRef.current[0] || null;
    setUrl(seed);
    setFailed(false);
    setLoading(false);
    if (seed) onUrlRef.current?.(seed);

    return () => {
      cancelled = true;
    };

    async function generate(force: boolean) {
      setLoading(true);
      setFailed(false);
      try {
        const res = await fetch("/api/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ character, force }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data.url) {
          setUrl(data.url);
          onUrlRef.current?.(data.url);
        } else {
          setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portraitKey, allowGenerate, refreshToken]);

  const shapeCls =
    shape === "circle"
      ? "rounded-full"
      : shape === "portrait"
        ? "rounded-2xl aspect-[4/5] !h-auto w-full max-w-[12rem]"
        : "rounded-2xl";

  const initials = characterInitials(character);
  const name = character.customName || character.name;

  return (
    <div className={clsx("flex flex-col items-center gap-1.5", className)}>
      <div
        className={clsx(
          "relative shrink-0 overflow-hidden ring-1 ring-white/15 shadow-lg shadow-black/40 bg-gradient-to-br from-echo-950 to-ink-950 pointer-events-none",
          shape !== "portrait" && sizeClass[size],
          shapeCls
        )}
      >
        {url && !failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={name}
            className="h-full w-full object-cover object-top"
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => {
              // Walk portrait look fallbacks, then monogram — no API retry
              const list = fallbacksRef.current.length
                ? fallbacksRef.current
                : portraitFallbackUrls(character);
              fallbackIdx.current += 1;
              const next = list[fallbackIdx.current];
              if (next && next !== url) {
                setUrl(next);
                setFailed(false);
                return;
              }
              setFailed(true);
              setLoading(false);
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-echo-100/90 tracking-wide">
            {initials}
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="h-5 w-5 rounded-full border-2 border-echo-400/40 border-t-echo-300 animate-spin" />
          </div>
        )}
      </div>
      {showName && (
        <span className="text-[10px] text-ink-400 font-medium truncate max-w-[6rem] text-center">
          {name}
        </span>
      )}
    </div>
  );
}
