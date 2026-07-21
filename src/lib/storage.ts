/**
 * LocalStorage persistence layer.
 * Optional cloud (Supabase/Firebase) can wrap these same shapes later.
 */
import type {
  ActiveStory,
  AppSettings,
  CharacterLoadout,
  SavedStoryMeta,
  UserProfile,
} from "./types";

const KEYS = {
  profile: "eroticecho:profile",
  stories: "eroticecho:stories",
  settings: "eroticecho:settings",
  ageGate: "eroticecho:ageVerified",
  activeId: "eroticecho:activeStoryId",
  loadouts: "eroticecho:loadouts",
  favorites: "eroticecho:favoritePresets",
} as const;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const defaultProfile = (): UserProfile => ({
  name: "",
  gender: "other",
  age: 21,
  pronouns: { subject: "they", object: "them", possessive: "their" },
  kinks: [],
  customKinks: [],
  hardNos: ["minors", "scat", "gore", "snuff", "bestiality"],
  customHardNos: [],
  writingStyle: "slow-burn",
  explicitness: 7,
  contentWarningsEnabled: true,
  ageVerified: false,
});

export const defaultAppSettings = (): AppSettings => ({
  theme: "dark",
  reduceMotion: false,
  autoSave: true,
  showContentWarnings: true,
  voiceAccent: "american",
  companionVoiceId: "eve-us",
  defaultIntensity: 7,
  defaultMode: "slow-burn",
  defaultTypewriter: true,
});

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return defaultProfile();
  return { ...defaultProfile(), ...safeParse(localStorage.getItem(KEYS.profile), {}) };
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export function loadStories(): ActiveStory[] {
  if (typeof window === "undefined") return [];
  return safeParse<ActiveStory[]>(localStorage.getItem(KEYS.stories), []);
}

export function saveStories(stories: ActiveStory[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.stories, JSON.stringify(stories));
}

export function upsertStory(story: ActiveStory): void {
  const stories = loadStories();
  const idx = stories.findIndex((s) => s.id === story.id);
  if (idx >= 0) stories[idx] = story;
  else stories.unshift(story);
  saveStories(stories);
}

export function deleteStory(id: string): void {
  saveStories(loadStories().filter((s) => s.id !== id));
}

export function getStory(id: string): ActiveStory | undefined {
  return loadStories().find((s) => s.id === id);
}

export function storyToMeta(story: ActiveStory): SavedStoryMeta {
  const last = story.scenes[story.scenes.length - 1];
  return {
    id: story.id,
    title: story.title,
    characterName: story.character.customName || story.character.name,
    scenarioTitle: story.scenario.title,
    updatedAt: story.updatedAt,
    sceneCount: story.scenes.length,
    status: story.status,
    preview: (last?.narrative || story.scenario.setup).slice(0, 140) + "…",
  };
}

export function loadAppSettings(): AppSettings {
  if (typeof window === "undefined") return defaultAppSettings();
  return {
    ...defaultAppSettings(),
    ...safeParse(localStorage.getItem(KEYS.settings), {}),
  };
}

export function saveAppSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

export function setAgeVerified(value: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.ageGate, JSON.stringify(value));
}

export function isAgeVerified(): boolean {
  if (typeof window === "undefined") return false;
  return safeParse(localStorage.getItem(KEYS.ageGate), false);
}

export function setActiveStoryId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(KEYS.activeId, id);
  else localStorage.removeItem(KEYS.activeId);
}

export function getActiveStoryId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.activeId);
}

// ── Character loadouts ──────────────────────────────────────

export function loadLoadouts(): CharacterLoadout[] {
  if (typeof window === "undefined") return [];
  return safeParse<CharacterLoadout[]>(localStorage.getItem(KEYS.loadouts), []);
}

export function saveLoadouts(loadouts: CharacterLoadout[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.loadouts, JSON.stringify(loadouts));
}

export function upsertLoadout(loadout: CharacterLoadout): void {
  const all = loadLoadouts();
  const i = all.findIndex((l) => l.id === loadout.id);
  if (i >= 0) all[i] = loadout;
  else all.unshift(loadout);
  saveLoadouts(all);
}

export function deleteLoadout(id: string): void {
  saveLoadouts(loadLoadouts().filter((l) => l.id !== id));
}

// ── Favorite presets ────────────────────────────────────────

export function loadFavoritePresets(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse<string[]>(localStorage.getItem(KEYS.favorites), []);
}

export function saveFavoritePresets(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.favorites, JSON.stringify(ids));
}

export function toggleFavoritePreset(id: string): string[] {
  const cur = loadFavoritePresets();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
  saveFavoritePresets(next);
  return next;
}

export function isFavoritePreset(id: string): boolean {
  return loadFavoritePresets().includes(id);
}

/** Export all user data as a portable JSON blob */
export function exportAllData(): string {
  return JSON.stringify(
    {
      version: 2,
      exportedAt: new Date().toISOString(),
      profile: loadProfile(),
      stories: loadStories(),
      settings: loadAppSettings(),
      loadouts: loadLoadouts(),
      favorites: loadFavoritePresets(),
    },
    null,
    2
  );
}

export function importAllData(json: string): { ok: boolean; error?: string } {
  try {
    const data = JSON.parse(json);
    if (data.profile) saveProfile(data.profile);
    if (Array.isArray(data.stories)) saveStories(data.stories);
    if (data.settings) saveAppSettings(data.settings);
    if (Array.isArray(data.loadouts)) saveLoadouts(data.loadouts);
    if (Array.isArray(data.favorites)) saveFavoritePresets(data.favorites);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}
