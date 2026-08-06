"use client";

import { useMemo, useState } from "react";
import type { Character, DomSubRole } from "@/lib/types";
import {
  applyOutfitStyle,
  applyVibeKit,
  domSubRoles,
  kinks,
  resolveOutfit,
  vibeKits,
} from "@/lib/data";
import {
  applyQuirkPack,
  applyRelationshipFrame,
  applyTweak,
  BODY_TWEAKS,
  getMergedOutfitStyles,
  getQuirkPacksForCharacter,
  LOOK_TWEAKS,
  RELATIONSHIP_FRAME_GROUPS,
  RELATIONSHIP_FRAMES,
} from "@/lib/character-tweaks";
import { CharacterAvatar } from "./CharacterAvatar";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Shirt,
  UserRound,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import clsx from "clsx";

interface Props {
  character: Character;
  onChange: (c: Character) => void;
}

/**
 * Full description-based customization — keeps classy editorial look.
 * Avatar regenerates from the written description when requested.
 * Includes vibe kits, body/look chips, character quirks, and kinks.
 */
export function CharacterCustomize({ character, onChange }: Props) {
  const [refreshToken, setRefreshToken] = useState(0);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [showAllKinks, setShowAllKinks] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [relGroup, setRelGroup] = useState<
    (typeof RELATIONSHIP_FRAME_GROUPS)[number]["id"] | "all"
  >("all");
  const [genError, setGenError] = useState<string | null>(null);
  // Single selector — never short-circuit multiple hooks with ||
  const canGenImages = useAuthStore(
    (s) =>
      s.user?.features.canGenerateImages === true || s.user?.isGod === true
  );

  const patch = (partial: Partial<Character>) => {
    onChange({ ...character, ...partial });
  };

  const personalityText = (
    character.customPersonality?.length
      ? character.customPersonality
      : character.personality
  ).join(", ");

  const activeKinks = character.customKinkAffinity?.length
    ? character.customKinkAffinity
    : character.kinkAffinity;

  const tagText = (character.customTags || []).join(", ");

  const popularKinkIds = useMemo(() => {
    const priority = [
      "teasing",
      "pure-filth",
      "praise",
      "degradation",
      "rough",
      "CNC",
      "exhibition",
      "public-risk",
      "free-use",
      "breeding-fantasy",
      "corruption",
      "yandere",
      "hypnosis",
      "ownership",
      "oral",
      "bondage",
      "incest-step",
      "affair-fantasy",
      "mind-control",
      "being-used",
    ];
    const ids = new Set(kinks.map((k) => k.id));
    return [
      ...priority.filter((id) => ids.has(id)),
      ...kinks.map((k) => k.id).filter((id) => !priority.includes(id)),
    ];
  }, []);

  const kinkList = showAllKinks
    ? popularKinkIds
    : popularKinkIds.slice(0, 18);

  const outfitStyles = useMemo(
    () => getMergedOutfitStyles(character),
    [character]
  );
  const quirkPacks = useMemo(
    () => getQuirkPacksForCharacter(character),
    [character]
  );

  const toggleKink = (id: string) => {
    const set = new Set(activeKinks);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    patch({ customKinkAffinity: Array.from(set) });
  };

  const regenerateAvatar = async () => {
    if (!canGenImages) {
      setGenError(
        "AI portrait regen is Pro-only (covers image API cost). Use Portrait look chips for free pre-made art."
      );
      return;
    }
    setAvatarBusy(true);
    setGenError(null);
    try {
      const res = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ character, force: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenError(data.error || "Portrait generation blocked");
        return;
      }
      if (data.url && !data.offline) {
        patch({ avatarUrl: data.url });
        setRefreshToken((t) => t + 1);
      } else if (data.error) {
        setGenError(data.error);
      }
    } finally {
      setAvatarBusy(false);
    }
  };

  const resetCustoms = () => {
    onChange({
      ...character,
      customName: undefined,
      customBody: undefined,
      customPersonality: undefined,
      customOutfit: undefined,
      roleOverride: undefined,
      appearanceNotes: undefined,
      customRelationship: undefined,
      customBio: undefined,
      customVoiceStyle: undefined,
      customAgeRange: undefined,
      customKinkAffinity: undefined,
      customTags: undefined,
      vibeKitId: undefined,
      selectedOutfitStyleId: undefined,
      avatarUrl: character.avatarUrl?.startsWith("data:")
        ? undefined
        : character.avatarUrl,
    });
    setRefreshToken((t) => t + 1);
  };

  const heatBadge = (heat: 1 | 2 | 3) => {
    if (heat === 1) return "text-emerald-300/90 border-emerald-500/30";
    if (heat === 2) return "text-amber-300/90 border-amber-500/30";
    return "text-rose-300/90 border-rose-500/40";
  };

  return (
    <div className="card p-5 space-y-5">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className="mx-auto sm:mx-0">
          <CharacterAvatar
            character={character}
            size="xl"
            shape="portrait"
            refreshToken={refreshToken}
            allowGenerate={canGenImages}
            onUrl={(url) => {
              if (url !== character.avatarUrl) patch({ avatarUrl: url });
            }}
          />
          {canGenImages ? (
            <button
              type="button"
              className="btn-ghost w-full mt-3 text-xs min-h-10"
              onClick={regenerateAvatar}
              disabled={avatarBusy}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${avatarBusy ? "animate-spin" : ""}`}
              />
              {avatarBusy ? "Generating…" : "AI regen portrait (Pro)"}
            </button>
          ) : (
            <Link
              href="/pricing"
              className="btn-ghost w-full mt-3 text-xs min-h-10 justify-center"
            >
              AI regen = Pro →
            </Link>
          )}
          <p className="text-[10px] text-ink-500 text-center mt-1 leading-snug max-w-[12rem] mx-auto">
            Free: pre-made Portrait look chips only. No auto image spend.
          </p>
          {genError && (
            <p className="text-[10px] text-amber-200/90 text-center mt-1 leading-snug max-w-[14rem] mx-auto">
              {genError}
            </p>
          )}
        </div>

        <div className="flex-1 w-full space-y-3 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="panel-title text-lg">Customize her</h2>
              <p className="text-xs text-ink-500 mt-1 leading-relaxed">
                Rewrite who she is to you, how she looks, talks, and plays.
                Portraits stay photoreal. Changes feed story text and images.
              </p>
            </div>
            <button
              type="button"
              className="btn-ghost text-xs shrink-0 min-h-9 px-2"
              onClick={resetCustoms}
              title="Reset all custom fields to preset"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* Portrait looks (static multi-images) */}
          {(character.portraitLooks?.length ?? 0) > 0 && (
            <div>
              <label className="label">Portrait look</label>
              <p className="text-[11px] text-ink-500 mb-2">
                Switch between on-role, sexy, and almost-nude saved portraits —
                no generation needed.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {character.portraitLooks!.map((look) => {
                  const active =
                    character.selectedPortraitId === look.id ||
                    (!character.selectedPortraitId && look.id === "role");
                  return (
                    <button
                      key={look.id}
                      type="button"
                      onClick={() =>
                        patch({
                          selectedPortraitId: look.id,
                          avatarUrl: undefined,
                          avatarVibe: look.vibe || character.avatarVibe,
                        })
                      }
                      className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                        active
                          ? "bg-violet-500/25 border-violet-400/50 text-violet-50"
                          : "bg-black/30 border-white/10 text-ink-400 hover:border-white/25"
                      }`}
                    >
                      {look.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Outfit styles (preset + universal extras) */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Shirt className="h-3.5 w-3.5 text-rose-400/80" />
              Outfit / style
            </label>
            <p className="text-[11px] text-ink-500 mb-2">
              Her looks + universal options. Story text follows the selection.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {outfitStyles.map((style) => {
                const active =
                  character.selectedOutfitStyleId === style.id ||
                  (!character.selectedOutfitStyleId &&
                    style.id === "default" &&
                    !character.customOutfit);
                return (
                  <button
                    key={style.id}
                    type="button"
                    title={style.outfit}
                    onClick={() => onChange(applyOutfitStyle(character, style.id))}
                    className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                      active
                        ? "bg-fuchsia-500/25 border-fuchsia-400/50 text-fuchsia-50"
                        : "bg-black/30 border-white/10 text-ink-400 hover:border-white/25"
                    }`}
                  >
                    {style.label}
                    {style.vibe === "max-slut" ? " · 🔥" : ""}
                    {style.vibe === "cute" ? " · 🎀" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Who she is to you — reframe any preset */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-rose-400/80" />
              Who she is to you
            </label>
            <p className="text-[11px] text-ink-500 mb-2">
              Keep her face and body — swap the relationship. Step-daughter →
              step-sis, coworker, stranger, etc.
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              <button
                type="button"
                onClick={() => setRelGroup("all")}
                className={clsx(
                  "rounded-full border px-2 py-0.5 text-[10px]",
                  relGroup === "all"
                    ? "border-echo-400/50 bg-echo-500/20 text-echo-100"
                    : "border-white/10 text-ink-500"
                )}
              >
                All
              </button>
              {RELATIONSHIP_FRAME_GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setRelGroup(g.id)}
                  className={clsx(
                    "rounded-full border px-2 py-0.5 text-[10px]",
                    relGroup === g.id
                      ? "border-echo-400/50 bg-echo-500/20 text-echo-100"
                      : "border-white/10 text-ink-500"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {RELATIONSHIP_FRAMES.filter(
                (f) => relGroup === "all" || f.group === relGroup
              ).map((f) => {
                const active =
                  (character.customRelationship || "").includes(
                    f.relationship.slice(0, 40)
                  ) ||
                  (character.customTags || []).includes(`role:${f.id}`);
                return (
                  <button
                    key={f.id}
                    type="button"
                    title={f.hint}
                    onClick={() =>
                      onChange(applyRelationshipFrame(character, f.id))
                    }
                    className={clsx(
                      "rounded-full border px-2.5 py-1 text-[11px] transition",
                      active
                        ? "bg-echo-500/25 border-echo-400/50 text-echo-50"
                        : f.heat === 3
                          ? "border-rose-500/25 bg-rose-950/20 text-rose-100/90"
                          : "border-white/10 bg-black/30 text-ink-300 hover:border-echo-400/35"
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-ink-600 mt-1.5 line-clamp-2">
              Now:{" "}
              <span className="text-ink-400">
                {character.customRelationship || character.relationship}
              </span>
            </p>
          </div>

          {/* Body + look chips — compact */}
          <div>
            <label className="label flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5 text-rose-400/80" />
              Body &amp; look
            </label>
            <p className="text-[11px] text-ink-500 mb-2">
              One-tap tweaks on top of this preset. Stack freely.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {BODY_TWEAKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  title={t.hint}
                  onClick={() => onChange(applyTweak(character, t))}
                  className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] text-ink-300 hover:border-echo-400/40 hover:text-echo-100 transition"
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LOOK_TWEAKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  title={t.hint}
                  onClick={() => onChange(applyTweak(character, t))}
                  className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[11px] text-ink-400 hover:border-violet-400/35 hover:text-violet-100 transition"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Character-specific quirks */}
          {quirkPacks.length > 0 && (
            <div>
              <label className="label">Her flavor (this character)</label>
              <p className="text-[11px] text-ink-500 mb-2">
                Tailored to {character.aliases[0] || character.name} — stacks on
                the base preset.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quirkPacks.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    title={q.hint}
                    onClick={() => onChange(applyQuirkPack(character, q))}
                    className={clsx(
                      "rounded-full border px-2.5 py-1 text-[11px] transition",
                      q.heat === 3
                        ? "border-rose-500/30 bg-rose-950/25 text-rose-100/90 hover:border-rose-400/50"
                        : q.heat === 2
                          ? "border-amber-500/25 bg-amber-950/20 text-amber-100/90 hover:border-amber-400/40"
                          : "border-white/10 bg-black/30 text-ink-300 hover:border-white/25"
                    )}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vibe kits */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-rose-400/80" />
              Quick vibe kits
            </label>
            <p className="text-[11px] text-ink-500 mb-2">
              One tap stacks personality, role, kinks, voice. Layer freely.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {vibeKits.map((kit) => {
                const active = character.vibeKitId === kit.id;
                return (
                  <button
                    key={kit.id}
                    type="button"
                    title={kit.description}
                    onClick={() => onChange(applyVibeKit(character, kit.id))}
                    className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                      active
                        ? "bg-rose-500/20 border-rose-400/50 text-rose-100"
                        : `bg-black/30 hover:bg-white/5 ${heatBadge(kit.heat)}`
                    }`}
                  >
                    {kit.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Display name</label>
              <input
                className="input"
                value={character.customName ?? character.name}
                onChange={(e) => patch({ customName: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Dom / Sub role</label>
              <select
                className="input"
                value={
                  character.roleOverride ||
                  (character.defaultRole === "dominant"
                    ? "dom"
                    : character.defaultRole === "submissive"
                      ? "sub"
                      : character.defaultRole) ||
                  "switch"
                }
                onChange={(e) =>
                  patch({ roleOverride: e.target.value as DomSubRole })
                }
              >
                {domSubRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced text fields — collapsed by default */}
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-black/20 px-3 py-2 text-left text-xs text-ink-300 hover:border-white/15 transition"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            <span>Fine-tune text (bio, voice, body write-up…)</span>
            {showAdvanced ? (
              <ChevronUp className="h-3.5 w-3.5 opacity-60" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            )}
          </button>

          {showAdvanced && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Age range (18+)</label>
                  <input
                    className="input"
                    value={character.customAgeRange ?? character.ageRange}
                    onChange={(e) => patch({ customAgeRange: e.target.value })}
                    placeholder="24-30"
                  />
                </div>
                <div>
                  <label className="label">Extra tags</label>
                  <input
                    className="input"
                    value={tagText}
                    onChange={(e) =>
                      patch({
                        customTags: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="free-use, dark, milf…"
                  />
                </div>
              </div>

              <div>
                <label className="label">Who she is to you</label>
                <textarea
                  className="input min-h-[64px] text-sm leading-relaxed"
                  value={character.customRelationship ?? character.relationship}
                  onChange={(e) => patch({ customRelationship: e.target.value })}
                  placeholder="Your stepmother, your boss, a stranger who owns your building…"
                />
              </div>

              <div>
                <label className="label">Bio / setup vibe</label>
                <textarea
                  className="input min-h-[64px] text-sm leading-relaxed"
                  value={character.customBio ?? character.bio}
                  onChange={(e) => patch({ customBio: e.target.value })}
                  placeholder="One-paragraph pitch for who she is in this fantasy…"
                />
              </div>

              <div>
                <label className="label">How she talks</label>
                <textarea
                  className="input min-h-[56px] text-sm leading-relaxed"
                  value={character.customVoiceStyle ?? character.voiceStyle}
                  onChange={(e) => patch({ customVoiceStyle: e.target.value })}
                  placeholder="Warm and husky, pet names, filthy when alone…"
                />
              </div>

              <div>
                <label className="label">Look &amp; body (portraits + prose)</label>
                <textarea
                  className="input min-h-[88px] text-sm leading-relaxed"
                  value={character.customBody ?? character.body}
                  onChange={(e) => patch({ customBody: e.target.value })}
                  placeholder="Hair, eyes, face, figure, skin…"
                />
              </div>

              <div>
                <label className="label">Outfit baseline</label>
                <input
                  className="input"
                  value={character.customOutfit ?? resolveOutfit(character)}
                  onChange={(e) =>
                    patch({
                      customOutfit: e.target.value,
                      selectedOutfitStyleId: undefined,
                    })
                  }
                  placeholder="Silk blouse, blazer, evening dress…"
                />
              </div>

              <div>
                <label className="label">Personality traits</label>
                <input
                  className="input"
                  value={personalityText}
                  onChange={(e) =>
                    patch({
                      customPersonality: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="confident, teasing, soft-spoken…"
                />
              </div>

              <div>
                <label className="label">Extra appearance notes</label>
                <textarea
                  className="input min-h-[60px] text-sm"
                  value={character.appearanceNotes || ""}
                  onChange={(e) => patch({ appearanceNotes: e.target.value })}
                  placeholder="Makeup, jewelry, freckles, expression…"
                />
              </div>
            </div>
          )}

          <div>
            <label className="label">Her kink lean</label>
            <p className="text-[11px] text-ink-500 mb-2">
              What she&apos;s into this run — stacked with your profile kinks.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {kinkList.map((id) => {
                const k = kinks.find((x) => x.id === id);
                if (!k) return null;
                const on = activeKinks.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleKink(id)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                      on
                        ? "bg-rose-500/25 border-rose-400/50 text-rose-50"
                        : "bg-black/25 border-white/10 text-ink-400 hover:border-white/20"
                    }`}
                  >
                    {k.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="text-[11px] text-ink-400 hover:text-ink-200 mt-2 underline-offset-2 hover:underline"
              onClick={() => setShowAllKinks((v) => !v)}
            >
              {showAllKinks ? "Show fewer kinks" : `Show all ${kinks.length} kinks`}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-black/25 p-3 text-[11px] text-ink-500 leading-relaxed">
        <span className="text-ink-400">Preset base: </span>
        {character.aliases[0] || character.id} · {character.ageRange} ·{" "}
        {character.relationship}
        {character.vibeKitId ? (
          <>
            {" "}
            · <span className="text-rose-300/80">kit: {character.vibeKitId}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
