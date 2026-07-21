/**
 * Creates new story sessions from character + scenario + settings.
 */
import { v4 as uuidv4 } from "uuid";
import type {
  ActiveStory,
  Character,
  MidStoryMods,
  Scenario,
  StorySettings,
} from "./types";
import { themeFromCategory } from "./themes";

export function defaultMods(): MidStoryMods {
  return {
    appearanceNotes: "",
    personalityNotes: "",
    relationshipNotes: "",
    locationOverride: "",
    extraCharacters: "",
    addedKinks: [],
    freeformNotes: "",
    referenceImageUrls: [],
    clothingState: "dressed",
  };
}

export function defaultStorySettings(
  partial?: Partial<StorySettings>
): StorySettings {
  return {
    mode: "slow-burn",
    intensity: 7,
    length: "medium",
    cncSafeword: "red",
    voiceMode: true,
    typewriter: true,
    autoImages: false,
    voiceAccent: "american",
    companionVoiceId: "eve-us",
    ...partial,
  };
}

export function createStory(
  character: Character,
  scenario: Scenario,
  settings?: Partial<StorySettings>,
  mods?: Partial<MidStoryMods>,
  extra?: Partial<Pick<ActiveStory, "title" | "themeId" | "presetId">>
): ActiveStory {
  const now = new Date().toISOString();
  const charName = character.customName || character.name;
  return {
    id: uuidv4(),
    title: extra?.title || `${charName} — ${scenario.title}`,
    createdAt: now,
    updatedAt: now,
    character: {
      ...character,
      // Prefer pre-generated photoreal portrait when present
      avatarUrl:
        character.avatarUrl ||
        (character.id ? `/avatars/${character.id}.png?v=2` : undefined),
    },
    scenario: { ...scenario },
    settings: defaultStorySettings(settings),
    mods: { ...defaultMods(), ...mods },
    scenes: [],
    memorySummary: "",
    status: "active",
    gallery: [],
    themeId: extra?.themeId || themeFromCategory(scenario.category),
    presetId: extra?.presetId,
  };
}
