"use client";

import { create } from "zustand";
import type {
  ActiveStory,
  AppSettings,
  Character,
  Scenario,
  StorySettings,
  UserProfile,
  MidStoryMods,
} from "@/lib/types";
import {
  defaultAppSettings,
  defaultProfile,
  deleteStory as storageDelete,
  getActiveStoryId,
  isAgeVerified,
  loadAppSettings,
  loadProfile,
  loadStories,
  saveAppSettings,
  saveProfile,
  setActiveStoryId,
  setAgeVerified,
  upsertStory,
} from "@/lib/storage";
import { createStory } from "@/lib/story-factory";

interface AppState {
  hydrated: boolean;
  ageVerified: boolean;
  profile: UserProfile;
  settings: AppSettings;
  stories: ActiveStory[];
  activeStory: ActiveStory | null;
  /** Setup wizard draft */
  draftCharacter: Character | null;
  draftScenario: Scenario | null;
  draftSettings: Partial<StorySettings>;

  hydrate: () => void;
  verifyAge: () => void;
  setProfile: (p: Partial<UserProfile>) => void;
  setSettings: (s: Partial<AppSettings>) => void;
  setDraftCharacter: (c: Character | null) => void;
  setDraftScenario: (s: Scenario | null) => void;
  setDraftSettings: (s: Partial<StorySettings>) => void;
  startNewStory: () => ActiveStory | null;
  /** Launch a curated preset and make it active */
  startPresetStory: (story: ActiveStory) => void;
  setActiveStory: (story: ActiveStory | null) => void;
  updateActiveStory: (updater: (s: ActiveStory) => ActiveStory) => void;
  saveActive: () => void;
  loadStoryById: (id: string) => void;
  removeStory: (id: string) => void;
  updateMods: (mods: Partial<MidStoryMods>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  ageVerified: false,
  profile: defaultProfile(),
  settings: defaultAppSettings(),
  stories: [],
  activeStory: null,
  draftCharacter: null,
  draftScenario: null,
  draftSettings: {},

  hydrate: () => {
    const stories = loadStories();
    const activeId = getActiveStoryId();
    const active = activeId
      ? stories.find((s) => s.id === activeId) || null
      : null;
    set({
      hydrated: true,
      ageVerified: isAgeVerified(),
      profile: loadProfile(),
      settings: loadAppSettings(),
      stories,
      activeStory: active || null,
    });
  },

  verifyAge: () => {
    setAgeVerified(true);
    set({ ageVerified: true });
    const profile = { ...get().profile, ageVerified: true };
    saveProfile(profile);
    set({ profile });
  },

  setProfile: (p) => {
    const profile = { ...get().profile, ...p };
    saveProfile(profile);
    set({ profile });
  },

  setSettings: (s) => {
    const settings = { ...get().settings, ...s };
    saveAppSettings(settings);
    set({ settings });
  },

  setDraftCharacter: (c) => set({ draftCharacter: c }),
  setDraftScenario: (s) => set({ draftScenario: s }),
  setDraftSettings: (s) =>
    set({ draftSettings: { ...get().draftSettings, ...s } }),

  startNewStory: () => {
    const { draftCharacter, draftScenario, draftSettings } = get();
    if (!draftCharacter || !draftScenario) return null;
    const app = get().settings;
    const story = createStory(draftCharacter, draftScenario, {
      companionVoiceId: app.companionVoiceId || "eve-us",
      voiceMode: true,
      autoImages: false,
      typewriter: app.defaultTypewriter ?? true,
      intensity: app.defaultIntensity ?? 7,
      mode: (app.defaultMode as import("@/lib/types").StoryModeId) || "slow-burn",
      voiceAccent: app.voiceAccent || "american",
      ...draftSettings,
    });
    upsertStory(story);
    setActiveStoryId(story.id);
    set((state) => ({
      activeStory: story,
      stories: [story, ...state.stories.filter((s) => s.id !== story.id)],
      draftCharacter: null,
      draftScenario: null,
      draftSettings: {},
    }));
    // Fire-and-forget cloud code so phones can join immediately
    void import("@/lib/cloud-client").then(({ publishStoryToCloud }) =>
      publishStoryToCloud(story).then((r) => {
        if (!r.ok) return;
        const cur = get().activeStory;
        if (!cur || cur.id !== story.id) return;
        const next = { ...cur, shareCode: r.code };
        upsertStory(next);
        set({
          activeStory: next,
          stories: get().stories.map((s) => (s.id === next.id ? next : s)),
        });
      })
    );
    return story;
  },

  startPresetStory: (story) => {
    upsertStory(story);
    setActiveStoryId(story.id);
    set((state) => ({
      activeStory: story,
      stories: [story, ...state.stories.filter((s) => s.id !== story.id)],
    }));
    // Ensure claimed / preset stories get a code if missing
    if (!story.shareCode) {
      void import("@/lib/cloud-client").then(({ publishStoryToCloud }) =>
        publishStoryToCloud(story).then((r) => {
          if (!r.ok) return;
          const cur = get().activeStory;
          if (!cur || cur.id !== story.id) return;
          const next = { ...cur, shareCode: r.code };
          upsertStory(next);
          set({
            activeStory: next,
            stories: get().stories.map((s) => (s.id === next.id ? next : s)),
          });
        })
      );
    }
  },

  setActiveStory: (story) => {
    setActiveStoryId(story?.id ?? null);
    set({ activeStory: story });
  },

  updateActiveStory: (updater) => {
    const current = get().activeStory;
    if (!current) return;
    const next = {
      ...updater(current),
      updatedAt: new Date().toISOString(),
    };
    upsertStory(next);
    set((state) => ({
      activeStory: next,
      stories: state.stories.map((s) => (s.id === next.id ? next : s)),
    }));
  },

  saveActive: () => {
    const s = get().activeStory;
    if (!s) return;
    upsertStory(s);
    // Keep cloud copy fresh when user hits Save
    if (s.shareCode) {
      void import("@/lib/cloud-client").then(({ publishStoryToCloud }) =>
        publishStoryToCloud(s).then((r) => {
          if (!r.ok) return;
          const cur = get().activeStory;
          if (cur?.id === s.id && r.code !== cur.shareCode) {
            const next = { ...cur, shareCode: r.code };
            upsertStory(next);
            set({ activeStory: next });
          }
        })
      );
    }
  },

  loadStoryById: (id) => {
    const story = get().stories.find((s) => s.id === id) || null;
    if (story) {
      setActiveStoryId(id);
      set({ activeStory: story });
    }
  },

  removeStory: (id) => {
    storageDelete(id);
    set((state) => ({
      stories: state.stories.filter((s) => s.id !== id),
      activeStory: state.activeStory?.id === id ? null : state.activeStory,
    }));
    if (getActiveStoryId() === id) setActiveStoryId(null);
  },

  updateMods: (mods) => {
    get().updateActiveStory((s) => ({
      ...s,
      mods: { ...s.mods, ...mods },
    }));
  },
}));
