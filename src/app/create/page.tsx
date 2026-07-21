"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  characters,
  scenarios,
  scenarioCategories,
  storyModes,
  filterCharacters,
  filterScenarios,
  randomizeSetup,
  characterTags,
} from "@/lib/data";
import { CharacterCard } from "@/components/CharacterCard";
import { CharacterCustomize } from "@/components/CharacterCustomize";
import { ScenarioCard } from "@/components/ScenarioCard";
import { LoadoutPanel } from "@/components/LoadoutPanel";
import { useAppStore } from "@/store/useAppStore";
import type { DomSubRole, StoryModeId } from "@/lib/types";
import { unlockAudio } from "@/lib/voice";
import { Shuffle, ChevronRight, ChevronLeft, X } from "lucide-react";

type Step = 1 | 2 | 3;

export default function CreatePage() {
  const router = useRouter();
  const draftCharacter = useAppStore((s) => s.draftCharacter);
  const draftScenario = useAppStore((s) => s.draftScenario);
  const draftSettings = useAppStore((s) => s.draftSettings);
  const setDraftCharacter = useAppStore((s) => s.setDraftCharacter);
  const setDraftScenario = useAppStore((s) => s.setDraftScenario);
  const setDraftSettings = useAppStore((s) => s.setDraftSettings);
  const startNewStory = useAppStore((s) => s.startNewStory);

  const [step, setStep] = useState<Step>(
    draftCharacter ? (draftScenario ? 3 : 2) : 1
  );
  const [charQuery, setCharQuery] = useState("");
  const [scenQuery, setScenQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Also show loadouts early on step 1 for quick apply
  const filteredChars = useMemo(
    () => filterCharacters(charQuery, activeTags),
    [charQuery, activeTags]
  );
  const filteredScens = useMemo(
    () => filterScenarios(scenQuery, category),
    [scenQuery, category]
  );

  const popularTags = useMemo(() => {
    const priority = [
      "body-slim",
      "body-fit",
      "body-petite",
      "body-hourglass",
      "body-chubby",
      "milf",
      "slutty",
      "cute",
      "wild",
      "filthy",
      "step",
      "authority",
      "fantasy",
      "barely-legal-adult",
    ];
    const ranked = [
      ...priority.filter((t) => characterTags.includes(t)),
      ...characterTags.filter((t) => !priority.includes(t)),
    ];
    return ranked.slice(0, 16);
  }, []);

  const onRole = (role: DomSubRole) => {
    if (!draftCharacter) return;
    setDraftCharacter({ ...draftCharacter, roleOverride: role });
  };

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const surprise = () => {
    const { character, scenario } = randomizeSetup();
    setDraftCharacter(character);
    setDraftScenario(scenario);
    setDraftSettings({
      intensity: scenario.intensityHint,
      mode: "slow-burn",
    });
    setStep(3);
  };

  const launch = async () => {
    await unlockAudio();
    const story = startNewStory();
    if (story) router.push("/play");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="panel-title text-2xl">Create a story</h1>
          <p className="text-sm text-ink-500 mt-1">
            Step {step} of 3 · {characters.length} characters ·{" "}
            {scenarios.length} scenarios
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={surprise}>
          <Shuffle className="h-4 w-4" /> Randomize all
        </button>
      </div>

      <div className="flex gap-2">
        {([1, 2, 3] as Step[]).map((s) => (
          <button
            key={s}
            type="button"
            className={`h-1.5 flex-1 rounded-full transition ${
              s <= step ? "bg-echo-500" : "bg-white/10"
            }`}
            onClick={() => {
              if (s === 1) setStep(1);
              if (s === 2 && draftCharacter) setStep(2);
              if (s === 3 && draftCharacter && draftScenario) setStep(3);
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <section className="space-y-4">
          <LoadoutPanel
            character={draftCharacter}
            onApply={(c) => {
              setDraftCharacter(c);
              setStep(draftScenario ? 3 : 2);
            }}
          />

          <div>
            <h2 className="label">Choose by description</h2>
            <p className="text-xs text-ink-500 mb-2 leading-relaxed">
              Search look, vibe, relationship, tags — e.g. &quot;auburn
              milf&quot;, &quot;shy glasses&quot;, &quot;office boss&quot;.
            </p>
            <input
              className="input max-w-xl"
              placeholder="Describe who you want… hair, role, place, mood"
              value={charQuery}
              onChange={(e) => setCharQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`chip capitalize ${
                  activeTags.includes(tag) ? "chip-active" : ""
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
            {activeTags.length > 0 && (
              <button
                type="button"
                className="chip text-ink-400"
                onClick={() => setActiveTags([])}
              >
                <X className="h-3 w-3" /> Clear filters
              </button>
            )}
          </div>

          <p className="text-[11px] text-ink-600">
            Showing {filteredChars.length} of {characters.length}
            {charQuery || activeTags.length
              ? " matching your description"
              : ""}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredChars.map((c) => (
              <CharacterCard
                key={c.id}
                character={
                  draftCharacter?.id === c.id ? draftCharacter : c
                }
                selected={draftCharacter?.id === c.id}
                onSelect={() => {
                  setDraftCharacter({
                    ...c,
                    // Keep customizations if re-selecting same id
                    ...(draftCharacter?.id === c.id
                      ? {
                          customName: draftCharacter.customName,
                          customBody: draftCharacter.customBody,
                          customOutfit: draftCharacter.customOutfit,
                          customPersonality: draftCharacter.customPersonality,
                          appearanceNotes: draftCharacter.appearanceNotes,
                          customRelationship: draftCharacter.customRelationship,
                          customBio: draftCharacter.customBio,
                          customVoiceStyle: draftCharacter.customVoiceStyle,
                          customAgeRange: draftCharacter.customAgeRange,
                          customKinkAffinity: draftCharacter.customKinkAffinity,
                          customTags: draftCharacter.customTags,
                          vibeKitId: draftCharacter.vibeKitId,
                          selectedOutfitStyleId:
                            draftCharacter.selectedOutfitStyleId,
                          selectedPortraitId:
                            draftCharacter.selectedPortraitId,
                          portraitLooks:
                            draftCharacter.portraitLooks || c.portraitLooks,
                          outfitStyles: draftCharacter.outfitStyles || c.outfitStyles,
                          avatarVibe: draftCharacter.avatarVibe || c.avatarVibe,
                          avatarUrl: draftCharacter.avatarUrl,
                          roleOverride:
                            draftCharacter.roleOverride ||
                            (c.defaultRole as DomSubRole),
                        }
                      : {
                          roleOverride: c.defaultRole as DomSubRole,
                        }),
                  });
                }}
                onRoleChange={
                  draftCharacter?.id === c.id ? onRole : undefined
                }
              />
            ))}
          </div>

          {filteredChars.length === 0 && (
            <p className="text-sm text-ink-500 text-center py-8">
              No characters match that description. Try fewer words or clear
              tags.
            </p>
          )}

          <div className="flex justify-end sticky bottom-20 md:bottom-4 z-10">
            <button
              type="button"
              className="btn-primary shadow-xl"
              disabled={!draftCharacter}
              onClick={() => setStep(2)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <h2 className="label">Choose a scenario</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`chip ${category === "All" ? "chip-active" : ""}`}
              onClick={() => setCategory("All")}
            >
              All
            </button>
            {scenarioCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip ${category === cat ? "chip-active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            className="input max-w-md"
            placeholder="Search scenarios…"
            value={scenQuery}
            onChange={(e) => setScenQuery(e.target.value)}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {filteredScens.map((s) => (
              <ScenarioCard
                key={s.id}
                scenario={s}
                selected={draftScenario?.id === s.id}
                onSelect={() => {
                  setDraftScenario(s);
                  setDraftSettings({
                    intensity: draftSettings.intensity ?? s.intensityHint,
                  });
                }}
              />
            ))}
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setStep(1)}
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={!draftScenario}
              onClick={() => setStep(3)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {step === 3 && draftCharacter && draftScenario && (
        <section className="space-y-6">
          <CharacterCustomize
            character={draftCharacter}
            onChange={setDraftCharacter}
          />

          <LoadoutPanel
            character={draftCharacter}
            onApply={(c) => {
              setDraftCharacter(c);
            }}
          />

          <ScenarioCard scenario={draftScenario} selected />

          <div className="card p-5 space-y-4">
            <h2 className="panel-title text-lg">Story settings</h2>

            <div>
              <label className="label">Mode</label>
              <div className="flex flex-wrap gap-2">
                {storyModes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`chip ${
                      (draftSettings.mode || "slow-burn") === m.id
                        ? "chip-active"
                        : ""
                    }`}
                    onClick={() =>
                      setDraftSettings({ mode: m.id as StoryModeId })
                    }
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">
                Intensity: {draftSettings.intensity ?? 6}/10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={draftSettings.intensity ?? 6}
                onChange={(e) =>
                  setDraftSettings({ intensity: Number(e.target.value) })
                }
                className="w-full accent-echo-500"
              />
            </div>

            <div>
              <label className="label">Scene length</label>
              <div className="flex gap-2">
                {(["short", "medium", "long"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`chip capitalize ${
                      (draftSettings.length || "medium") === l
                        ? "chip-active"
                        : ""
                    }`}
                    onClick={() => setDraftSettings({ length: l })}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">CNC safeword</label>
              <input
                className="input max-w-xs"
                value={draftSettings.cncSafeword ?? "red"}
                onChange={(e) =>
                  setDraftSettings({ cncSafeword: e.target.value })
                }
              />
            </div>

            <p className="text-[11px] text-ink-500 leading-relaxed">
              First-person · natural voice · portraits from her description.
              On phone: tap <strong>Narrate</strong> if audio is blocked by
              the browser.
            </p>
          </div>

          <div className="flex justify-between gap-2 pb-4 md:pb-4 sticky bottom-0 z-20 -mx-1 px-1 pt-3 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent md:static md:bg-transparent md:pt-0">
            <button
              type="button"
              className="btn-ghost min-h-12"
              onClick={() => setStep(2)}
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              className="btn-primary min-h-12 px-6 shadow-xl"
              onClick={launch}
            >
              Start story <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
