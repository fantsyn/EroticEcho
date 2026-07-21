/** Core domain types for EroticEcho — keep in sync with JSON data shapes. */

export type Gender = "female" | "male" | "nonbinary" | "other";

export type DomSubRole =
  | "dom"
  | "sub"
  | "switch"
  | "brat"
  | "yandere"
  | "random";

export type WritingStyleId =
  | "slow-burn"
  | "direct"
  | "romantic"
  | "dark"
  | "literary"
  | "filthy"
  | "playful"
  | "psychological"
  | string;

export type StoryModeId =
  | "slow-burn"
  | "immediate"
  | "cnc"
  | "dubcon"
  | "full-consent"
  | "blackmail"
  | "romance"
  | "pure-filth"
  | "enemies"
  | "corruption"
  | "free-use"
  | "hypnosis"
  | "breeding"
  | "monster"
  | string;

/** Selectable outfit / style pack for a character */
export interface OutfitStyle {
  id: string;
  label: string;
  outfit: string;
  /** Optional avatar heat vibe for this look */
  vibe?: "cute" | "pretty" | "sexy" | "max-slut" | string;
}

/** Static multi-portrait look (role / sexy / almost-nude) */
export interface PortraitLook {
  id: string;
  label: string;
  /** File under /public/avatars e.g. nurse-role.png */
  file: string;
  vibe?: "cute" | "pretty" | "sexy" | "max-slut" | "almost" | string;
}

export interface Character {
  id: string;
  name: string;
  aliases: string[];
  tags: string[];
  ageRange: string;
  gender: Gender | string;
  defaultRole: DomSubRole | string;
  personality: string[];
  body: string;
  relationship: string;
  voiceStyle: string;
  defaultOutfit: string;
  kinkAffinity: string[];
  bio: string;
  /**
   * Static or cached photorealistic portrait URL
   * (e.g. /avatars/step-mom.png or data URL after generation).
   */
  avatarUrl?: string;
  /** Preset outfit / style options (home, max slut, uniform…) */
  outfitStyles?: OutfitStyle[];
  /** Portrait generation vibe for this preset */
  avatarVibe?: "cute" | "pretty" | "sexy" | "max-slut" | string;
  /** Multiple static portraits (role / sexy / almost) */
  portraitLooks?: PortraitLook[];
  /** Selected portrait look id */
  selectedPortraitId?: string;
  /** Runtime overrides (not in base JSON) */
  customName?: string;
  customBody?: string;
  customPersonality?: string[];
  customOutfit?: string;
  roleOverride?: DomSubRole;
  appearanceNotes?: string;
  /** Who she is to you — overrides relationship */
  customRelationship?: string;
  /** Rewrite her bio blurb */
  customBio?: string;
  /** How she talks / narration voice */
  customVoiceStyle?: string;
  /** Display age band (always 18+) */
  customAgeRange?: string;
  /** Per-character kink lean (ids or free labels) */
  customKinkAffinity?: string[];
  /** Extra filter/search tags for this draft */
  customTags?: string[];
  /** Last applied vibe kit id (cosmetic / undo hint) */
  vibeKitId?: string;
  /** Selected outfit style id from outfitStyles */
  selectedOutfitStyleId?: string;
}

/** One-tap personality/role/kink patches applied on create */
export interface VibeKit {
  id: string;
  label: string;
  description: string;
  /** Soft heat 1–3 for UI badge */
  heat: 1 | 2 | 3;
  role?: DomSubRole;
  personalityAdd?: string[];
  kinkAdd?: string[];
  outfitHint?: string;
  appearanceHint?: string;
  relationshipHint?: string;
  bioHint?: string;
  voiceHint?: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: string;
  tags: string[];
  intensityHint: number;
  preferredCharacterIds: string[];
  setup: string;
  openingHook: string;
}

export interface Kink {
  id: string;
  label: string;
  category: string;
}

export interface HardNo {
  id: string;
  label: string;
}

export interface WritingStyle {
  id: string;
  label: string;
  description: string;
}

export interface StoryMode {
  id: string;
  label: string;
}

export interface UserProfile {
  name: string;
  gender: Gender | string;
  age: number;
  pronouns: { subject: string; object: string; possessive: string };
  kinks: string[];
  customKinks: string[];
  hardNos: string[];
  customHardNos: string[];
  writingStyle: WritingStyleId;
  explicitness: number; // 1-10
  contentWarningsEnabled: boolean;
  ageVerified: boolean;
}

export type VoiceAccent = "american" | "british" | "australian";

export interface StorySettings {
  mode: StoryModeId;
  intensity: number; // 1-10
  length: "short" | "medium" | "long";
  cncSafeword: string;
  /** Auto-narrate each scene with Grok companion / browser TTS */
  voiceMode: boolean;
  typewriter: boolean;
  /** User-only scene images (never auto — always opt-in) */
  autoImages: boolean;
  /** Accent family for sexy companion voices */
  voiceAccent: VoiceAccent;
  /** Companion preset id from companion-voices.ts */
  companionVoiceId: string;
}

export interface StoryChoice {
  id: string;
  label: string;
  hint?: string;
}

export interface StoryScene {
  id: string;
  index: number;
  narrative: string;
  choices: StoryChoice[];
  imageUrl?: string | null;
  imagePrompt?: string;
  bookmarked?: boolean;
  createdAt: string;
  /** User action that led into this scene */
  chosenAction?: string;
}

export interface MidStoryMods {
  appearanceNotes: string;
  personalityNotes: string;
  relationshipNotes: string;
  locationOverride: string;
  extraCharacters: string;
  addedKinks: string[];
  freeformNotes: string;
  /**
   * Optional user-supplied image URLs (data URLs or https) used as visual
   * reference alongside generated portraits. Not sent to image APIs yet —
   * shown in the gallery / scene when set.
   */
  referenceImageUrls: string[];
  /** Live clothing / undress state for prompts */
  clothingState?: string;
}

/** Quick clothing states for play UI */
export type ClothingStateId =
  | "dressed"
  | "disheveled"
  | "lingerie"
  | "partial"
  | "barely"
  | "wet"
  | "uniform-loose";

export interface ActiveStory {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  character: Character;
  scenario: Scenario;
  settings: StorySettings;
  mods: MidStoryMods;
  scenes: StoryScene[];
  /** Condensed memory for AI consistency */
  memorySummary: string;
  status: "active" | "completed" | "archived";
  gallery: { id: string; url: string; prompt: string; sceneId?: string }[];
  /** Immersive ambience theme id (velvet-night, neon-noir, …) */
  themeId?: string;
  /** Optional preset origin */
  presetId?: string;
  /**
   * Short cloud share code (e.g. "K7M2QX") so any device on this server
   * can load the same story via Library → Enter code.
   */
  shareCode?: string;
}

export interface SavedStoryMeta {
  id: string;
  title: string;
  characterName: string;
  scenarioTitle: string;
  updatedAt: string;
  sceneCount: number;
  status: ActiveStory["status"];
  preview: string;
}

export interface AppSettings {
  theme: "dark";
  reduceMotion: boolean;
  autoSave: boolean;
  showContentWarnings: boolean;
  /** Default accent for new stories */
  voiceAccent: VoiceAccent;
  /** Default companion voice id */
  companionVoiceId: string;
  /** Defaults for new stories */
  defaultIntensity?: number;
  defaultMode?: StoryModeId;
  defaultTypewriter?: boolean;
}

/** Saved customized character “skin” for reuse */
export interface CharacterLoadout {
  id: string;
  name: string;
  baseCharacterId: string;
  /** Full character snapshot (customs + selected looks/outfits) */
  character: Character;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateStoryRequest {
  story: ActiveStory;
  userProfile: UserProfile;
  /** Preset choice label or free-text action */
  action: string;
  isOpening?: boolean;
}

export interface GenerateStoryResponse {
  narrative: string;
  choices: StoryChoice[];
  memoryUpdate?: string;
  imagePromptSuggestion?: string;
  offline?: boolean;
}

export interface GenerateImageRequest {
  prompt: string;
  characterName?: string;
  style?: string;
  /** Full scene context for richer personalization */
  narrative?: string;
  action?: string;
  scenarioTitle?: string;
  bodyDescription?: string;
  outfit?: string;
  location?: string;
  intensity?: number;
}

export interface GenerateImageResponse {
  url: string | null;
  prompt: string;
  offline?: boolean;
  error?: string;
}
