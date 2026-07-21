/**
 * Curated preset stories — one click into a full session.
 */
import presetsData from "@/data/presets.json";
import { getCharacterById, getScenarioById } from "./data";
import { createStory } from "./story-factory";
import { themeFromCategory } from "./themes";
import type { ActiveStory, DomSubRole, StoryModeId } from "./types";
import type { ThemeId } from "./themes";

export interface StoryPreset {
  id: string;
  title: string;
  tagline: string;
  blurb: string;
  theme: ThemeId;
  characterId: string;
  scenarioId: string;
  role: DomSubRole | string;
  mode: StoryModeId | string;
  intensity: number;
  length: "short" | "medium" | "long";
  tags: string[];
  coverGradient: string;
  accent: string;
}

export const storyPresets: StoryPreset[] = presetsData.presets as StoryPreset[];

export function getPresetById(id: string): StoryPreset | undefined {
  return storyPresets.find((p) => p.id === id);
}

/** Build a ready-to-play ActiveStory from a preset */
export function createStoryFromPreset(preset: StoryPreset): ActiveStory | null {
  const character = getCharacterById(preset.characterId);
  const scenario = getScenarioById(preset.scenarioId);
  if (!character || !scenario) return null;

  const char = {
    ...character,
    roleOverride: preset.role as DomSubRole,
  };

  return createStory(
    char,
    scenario,
    {
      mode: preset.mode as StoryModeId,
      intensity: preset.intensity,
      length: preset.length,
      voiceMode: true,
      autoImages: false,
      typewriter: true,
    },
    {},
    {
      title: preset.title,
      themeId: preset.theme,
      presetId: preset.id,
    }
  );
}

/** Resolve theme id from story (preset or category) */
export function resolveStoryThemeId(story: ActiveStory | null): string {
  if (!story) return "default";
  if (story.themeId) return story.themeId;
  return themeFromCategory(story.scenario.category);
}
