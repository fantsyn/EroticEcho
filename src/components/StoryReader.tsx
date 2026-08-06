"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import {
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  ImagePlus,
  Loader2,
  Maximize2,
  Minimize2,
  BookOpen,
  Image as ImageIcon,
  List,
  MoreHorizontal,
  Pause,
  Play,
  RefreshCw,
  Rewind,
  Save,
  Send,
  Settings2,
  ShieldOff,
  Sparkles,
  Shirt,
  Undo2,
} from "lucide-react";
import { Typewriter } from "./Typewriter";
import { useAppStore } from "@/store/useAppStore";
import type { GenerateStoryResponse, StoryScene } from "@/lib/types";
import { buildSceneImagePrompt } from "@/lib/prompts";
import {
  isMobileBrowser,
  narrateText,
  pauseNarration,
  resumeNarration,
  stopNarration,
  unlockAudio,
  warmVoices,
} from "@/lib/voice";
import { DEFAULT_COMPANION_ID } from "@/lib/companion-voices";
import { resolveStoryThemeId } from "@/lib/presets";
import { getTheme } from "@/lib/themes";
import {
  imagesRemaining,
  MAX_STORY_IMAGES,
  pickShotStyle,
  resolveDisplayImage,
  shouldAutoGenerateImage,
} from "@/lib/image-policy";
import { isTouchDevice } from "@/lib/mobile";
import { CharacterAvatar } from "./CharacterAvatar";
import { ShareCodePanel } from "./ShareCodePanel";
import { publishStoryToCloud } from "@/lib/cloud-client";
import { MOOD_CHIPS } from "@/lib/mood-chips";
import { CLOTHING_STATES } from "@/lib/clothing-states";
import { tagChoice } from "@/lib/choice-tags";
import { getCharacterById, hardNoPresets } from "@/lib/data";
import { UsageBanner } from "./UsageBanner";
import { LimitReachedModal } from "./LimitReachedModal";
import { track } from "@/lib/analytics";
import { useAuthStore } from "@/store/useAuthStore";
import { AmbientAudio } from "./AmbientAudio";
import { unlockAmbient } from "@/lib/ambient";
import {
  chemistryLabel,
  chemistryOverall,
  evolveChemistry,
  getStoryChemistry,
  herVibeFromChemistry,
} from "@/lib/chemistry";
import {
  applyRelationshipFrame,
  RELATIONSHIP_FRAME_GROUPS,
  RELATIONSHIP_FRAMES,
} from "@/lib/character-tweaks";
import clsx from "clsx";

/** Moods shown first — rest behind “More moods” so the drawer stays light */
const FEATURED_MOOD_IDS = [
  "softer",
  "filthier",
  "slow-burn",
  "aftercare",
  "she-melts",
  "you-submit",
  "public-risk",
  "next-escalate",
  "peg-her",
  "piss-play",
  "humiliate",
];

export function StoryReader() {
  const story = useAppStore((s) => s.activeStory);
  const profile = useAppStore((s) => s.profile);
  const updateActiveStory = useAppStore((s) => s.updateActiveStory);
  const saveActive = useAppStore((s) => s.saveActive);
  const updateMods = useAppStore((s) => s.updateMods);
  const refreshAuth = useAuthStore((s) => s.refresh);
  // Single selector — never short-circuit multiple hooks with ||
  const canGenImages = useAuthStore(
    (s) =>
      s.user?.features.canGenerateImages === true || s.user?.isGod === true
  );

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [customAction, setCustomAction] = useState("");
  const [showMods, setShowMods] = useState(false);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [typingDone, setTypingDone] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [touchUi, setTouchUi] = useState(false);
  const [lastMood, setLastMood] = useState<string | null>(null);
  const [moodFlash, setMoodFlash] = useState<string | null>(null);
  const [theater, setTheater] = useState(false);
  const [showHardNos, setShowHardNos] = useState(false);
  const [recentActions, setRecentActions] = useState<string[]>([]);
  const [limitModal, setLimitModal] = useState(false);
  /** Collapsed by default to keep the story page clean */
  const [panel, setPanel] = useState<
    null | "mood" | "clothes" | "looks" | "more"
  >(null);
  /** Continuous full-story reading (all scenes at once) */
  const [fullStoryMode, setFullStoryMode] = useState(false);
  /** Expand full mood list only when asked */
  const [allMoods, setAllMoods] = useState(false);
  /** Mid-story relationship frame filter */
  const [relGroupPlay, setRelGroupPlay] = useState<
    (typeof RELATIONSHIP_FRAME_GROUPS)[number]["id"] | "all"
  >("all");

  const togglePanel = (id: "mood" | "clothes" | "looks" | "more") => {
    setPanel((p) => (p === id ? null : id));
    if (id !== "more") setShowHardNos(false);
  };

  /** Prevents double-submit / double-generate on multi-touch */
  const generatingRef = useRef(false);
  const speakTokenRef = useRef(0);
  const mountedRef = useRef(true);
  const lastTapRef = useRef(0);

  const scenes = story?.scenes ?? [];
  const viewIndex = historyIndex ?? scenes.length - 1;
  const current = scenes[viewIndex];
  const isLatest = historyIndex === null || historyIndex === scenes.length - 1;

  // Mobile: skip typewriter so choices appear immediately (was blocking taps)
  // Full-story mode never typewrites (continuous read)
  const useTypewriter =
    !!story?.settings.typewriter &&
    isLatest &&
    !loading &&
    !touchUi &&
    !fullStoryMode;

  useEffect(() => {
    mountedRef.current = true;
    setTouchUi(isTouchDevice() || isMobileBrowser());
    warmVoices();
    return () => {
      mountedRef.current = false;
      stopNarration();
    };
  }, []);

  // Hydrate portrait library for older stories / missing multi-looks
  useEffect(() => {
    if (!story?.character?.id) return;
    const lib = getCharacterById(story.character.id);
    if (!lib) return;
    const needsLooks =
      !story.character.portraitLooks?.length && !!lib.portraitLooks?.length;
    const needsUrl =
      !story.character.avatarUrl &&
      !story.character.selectedPortraitId &&
      (!!lib.avatarUrl || !!lib.portraitLooks?.length);
    if (!needsLooks && !needsUrl) return;
    updateActiveStory((s) => ({
      ...s,
      character: {
        ...s.character,
        portraitLooks: s.character.portraitLooks?.length
          ? s.character.portraitLooks
          : lib.portraitLooks,
        selectedPortraitId:
          s.character.selectedPortraitId ||
          lib.selectedPortraitId ||
          "role",
        avatarUrl: s.character.avatarUrl?.startsWith("data:")
          ? s.character.avatarUrl
          : undefined,
      },
    }));
  }, [story?.character?.id, story?.character?.portraitLooks?.length, updateActiveStory]);

  // Reset typing gate when scene changes
  useEffect(() => {
    if (!current?.id) {
      setTypingDone(true);
      return;
    }
    if (!useTypewriter) {
      setTypingDone(true);
    } else {
      setTypingDone(false);
    }
  }, [current?.id, useTypewriter]);

  const attachImageToScene = useCallback(
    async (
      sceneId: string,
      opts: {
        narrative: string;
        action?: string;
        aiSuggestion?: string;
        force?: boolean;
      }
    ) => {
      const s = useAppStore.getState().activeStory;
      if (!s) return;

      if (!opts.force && (s.gallery?.length ?? 0) >= MAX_STORY_IMAGES) return;
      if (opts.force && (s.gallery?.length ?? 0) >= MAX_STORY_IMAGES) {
        const already = s.scenes.find((sc) => sc.id === sceneId)?.imageUrl;
        if (already) {
          if (mountedRef.current) {
            setError(
              `Image limit reached (${MAX_STORY_IMAGES} per story). Rewind or start a new story for more.`
            );
          }
          return;
        }
      }

      if (mountedRef.current) setImageLoading(true);
      try {
        const shot = pickShotStyle(s);
        const avoid = (s.gallery || []).map((g) => g.prompt).filter(Boolean);
        const prompt = buildSceneImagePrompt({
          character: s.character,
          scenarioTitle: s.scenario.title,
          narrative: opts.narrative,
          action: opts.action,
          locationOverride: s.mods.locationOverride,
          appearanceNotes: s.mods.appearanceNotes,
          aiSuggestion: opts.aiSuggestion,
          intensity: s.settings.intensity,
          shotStyle: shot,
          avoidSimilarTo: avoid,
        });

        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            prompt,
            characterName: s.character.customName || s.character.name,
            narrative: opts.narrative,
            action: opts.action,
            scenarioTitle: s.scenario.title,
            bodyDescription: s.character.customBody || s.character.body,
            outfit: s.character.customOutfit || s.character.defaultOutfit,
            location: s.mods.locationOverride,
            intensity: s.settings.intensity,
            shotId: shot.id,
          }),
        });
        const data = await res.json();
        if (!mountedRef.current) return;
        if (!res.ok) {
          setHint(
            data.error ||
              "AI photos require Pro (covers image API cost). Using pre-made portraits."
          );
          return;
        }
        if (data.url) {
          const img = {
            id: uuidv4(),
            url: data.url as string,
            prompt: (data.prompt as string) || prompt,
            sceneId,
          };
          updateActiveStory((prev) => ({
            ...prev,
            gallery: [...prev.gallery, img],
            scenes: prev.scenes.map((sc) =>
              sc.id === sceneId
                ? { ...sc, imageUrl: data.url, imagePrompt: img.prompt }
                : sc
            ),
          }));
        }
      } catch {
        /* non-fatal */
      } finally {
        if (mountedRef.current) setImageLoading(false);
      }
    },
    [updateActiveStory]
  );

  const speakScene = useCallback(async (text: string, _sceneId: string) => {
    if (!text || !mountedRef.current) return;

    // Lock UI immediately so double-taps can't race
    const token = ++speakTokenRef.current;
    setIsSpeaking(true);
    setIsPaused(false);
    setVoiceLoading(true);
    setError(null);
    setHint(isMobileBrowser() ? "Loading voice…" : null);

    // 1) Unlock FIRST while still in the user-gesture stack
    const unlocked = await unlockAudio();
    if (!mountedRef.current || token !== speakTokenRef.current) return;

    if (!unlocked) {
      setVoiceLoading(false);
      setIsSpeaking(false);
      setHint(
        "Could not unlock audio. Tap Narrate again (turn off silent mode)."
      );
      return;
    }

    const companionId =
      useAppStore.getState().activeStory?.settings.companionVoiceId ||
      DEFAULT_COMPANION_ID;

    try {
      await narrateText(text, {
        companionId,
        alreadyUnlocked: true,
        onStart: () => {
          if (!mountedRef.current || token !== speakTokenRef.current) return;
          setVoiceLoading(false);
          setHint(null);
          setIsSpeaking(true);
          setIsPaused(false);
        },
        onEnd: () => {
          if (!mountedRef.current || token !== speakTokenRef.current) return;
          setIsSpeaking(false);
          setIsPaused(false);
          setVoiceLoading(false);
        },
        onError: (msg) => {
          if (!mountedRef.current || token !== speakTokenRef.current) return;
          setVoiceLoading(false);
          if (msg) setHint(msg);
        },
      });
      // If browser TTS path returned without onStart (edge case), clear loading
      if (mountedRef.current && token === speakTokenRef.current) {
        setVoiceLoading(false);
      }
    } catch (e) {
      if (!mountedRef.current || token !== speakTokenRef.current) return;
      setIsSpeaking(false);
      setIsPaused(false);
      setVoiceLoading(false);
      setHint(
        e instanceof Error
          ? e.message.slice(0, 120)
          : "Tap Narrate again to play audio."
      );
    }
  }, []);

  const generate = useCallback(
    async (action: string, isOpening = false) => {
      if (!story) return;
      // Hard lock against multi-tap double scenes
      if (generatingRef.current) return;
      generatingRef.current = true;

      // Cancel any speech so it can't loop over the old scene
      speakTokenRef.current += 1;
      stopNarration();
      setIsSpeaking(false);
      setIsPaused(false);
      setVoiceLoading(false);
      setLoading(true);
      setError(null);
      setHint(null);
      setTypingDone(false);

      // Snapshot story at click time (avoid stale length after concurrent updates)
      const storySnap = useAppStore.getState().activeStory;
      const profileSnap = useAppStore.getState().profile;
      if (!storySnap) {
        generatingRef.current = false;
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            story: storySnap,
            userProfile: profileSnap,
            action,
            isOpening,
          }),
        });
        const data = (await res.json()) as GenerateStoryResponse & {
          error?: string;
        };
        if (res.status === 401) {
          track("story_limit", { reason: "auth" });
          const loginUrl =
            (data as { loginUrl?: string }).loginUrl ||
            "/login?next=/play";
          if (typeof window !== "undefined") {
            window.location.href = loginUrl;
          }
          throw new Error(data.error || "Sign in required");
        }
        if (res.status === 402) {
          track("story_limit", { reason: "quota" });
          void refreshAuth();
          if ((data as { code?: string }).code !== "IMAGE_PAYWALL") {
            setLimitModal(true);
          }
          throw new Error(
            data.error ||
              "That's your free scenes for today — come back tomorrow, or see Pro."
          );
        }
        if (!res.ok) throw new Error(data.error || "Generation failed");
        track("story_generate");
        void refreshAuth();

        const sceneId = uuidv4();
        const scene: StoryScene = {
          id: sceneId,
          index: storySnap.scenes.length + 1,
          narrative: data.narrative,
          choices: data.choices,
          imagePrompt: data.imagePromptSuggestion,
          createdAt: new Date().toISOString(),
          chosenAction: isOpening ? undefined : action,
        };

        const nextChem = isOpening
          ? getStoryChemistry(storySnap)
          : evolveChemistry(
              getStoryChemistry(storySnap),
              action,
              storySnap.settings.intensity
            );

        updateActiveStory((s) => ({
          ...s,
          scenes: [...s.scenes, scene],
          memorySummary: data.memoryUpdate || s.memorySummary,
          chemistry: nextChem,
        }));
        setHistoryIndex(null);
        setCustomAction("");
        setTypingDone(true);

        if (data.offline) {
          setHint(
            "Offline demo mode — add XAI_API_KEY for full Grok stories."
          );
        }

        const nextCount = storySnap.scenes.length + 1;
        const snapshot = {
          ...storySnap,
          scenes: [...storySnap.scenes, scene],
          gallery: storySnap.gallery,
        };
        if (shouldAutoGenerateImage(snapshot, nextCount)) {
          void attachImageToScene(sceneId, {
            narrative: data.narrative,
            action: isOpening ? "opening scene" : action,
            aiSuggestion: data.imagePromptSuggestion,
          });
        }

        // Never auto-narrate — mobile autoplay is broken; desktop is optional via Narrate.
        if (isMobileBrowser() || isTouchDevice()) {
          setHint("Tap Narrate to hear this scene.");
        }

        // Keep cloud code in sync so other devices can pull progress
        const after = useAppStore.getState().activeStory;
        if (after?.shareCode) {
          void publishStoryToCloud(after).then((r) => {
            if (r.ok && r.code && mountedRef.current) {
              updateActiveStory((s) =>
                s.shareCode === r.code ? s : { ...s, shareCode: r.code }
              );
            }
          });
        }
      } catch (e) {
        if (mountedRef.current) {
          setError(e instanceof Error ? e.message : "Failed to generate");
          setTypingDone(true);
        }
      } finally {
        generatingRef.current = false;
        if (mountedRef.current) setLoading(false);
      }
    },
    [story, updateActiveStory, attachImageToScene, refreshAuth]
  );

  const generateImage = async () => {
    if (!story || !current || imageLoading) return;
    if (!canGenImages) {
      setHint(
        "AI scene photos are Pro-only (covers image API cost). Free uses pre-made portraits."
      );
      return;
    }
    await attachImageToScene(current.id, {
      narrative: current.narrative,
      action: current.chosenAction,
      aiSuggestion: current.imagePrompt,
      force: true,
    });
  };

  const toggleBookmark = () => {
    if (!current) return;
    updateActiveStory((s) => ({
      ...s,
      scenes: s.scenes.map((sc) =>
        sc.id === current.id ? { ...sc, bookmarked: !sc.bookmarked } : sc
      ),
    }));
  };

  const rewindTo = (idx: number) => {
    if (!story) return;
    if (!confirm("Rewind will discard all scenes after this point. Continue?"))
      return;
    speakTokenRef.current += 1;
    stopNarration();
    setIsSpeaking(false);
    setIsPaused(false);
    updateActiveStory((s) => ({
      ...s,
      scenes: s.scenes.slice(0, idx + 1),
    }));
    setHistoryIndex(null);
  };

  /** Drop last scene only (quick undo) */
  const undoLastScene = () => {
    if (!story || story.scenes.length === 0 || busy) return;
    if (story.scenes.length > 1) {
      // soft confirm only when multi-scene
      if (!window.confirm("Undo the last scene?")) return;
    }
    speakTokenRef.current += 1;
    stopNarration();
    setIsSpeaking(false);
    setIsPaused(false);
    updateActiveStory((s) => ({
      ...s,
      scenes: s.scenes.slice(0, -1),
    }));
    setHistoryIndex(null);
    setHint("Last scene undone.");
  };

  /** Rewrite latest scene with the same action */
  const regenerateLastScene = async () => {
    if (!story || !current || !isLatest || busy) return;
    const action =
      current.chosenAction || "Begin — she starts speaking to you";
    const isOpening = story.scenes.length === 1 && !current.chosenAction;
    speakTokenRef.current += 1;
    stopNarration();
    setIsSpeaking(false);
    setIsPaused(false);
    updateActiveStory((s) => ({
      ...s,
      scenes: s.scenes.slice(0, -1),
    }));
    // Let store settle, then generate
    await Promise.resolve();
    setHint("Regenerating scene…");
    await generate(action, isOpening);
  };

  const setClothing = (id: string) => {
    updateMods({ clothingState: id });
    setHint(`Clothing: ${CLOTHING_STATES.find((c) => c.id === id)?.label || id}`);
  };

  /** Swap pre-made portrait look mid-story (no API spend) */
  const setPortraitLook = (lookId: string) => {
    if (!story) return;
    const looks = story.character.portraitLooks || [];
    const look = looks.find((l) => l.id === lookId);
    updateActiveStory((s) => ({
      ...s,
      character: {
        ...s.character,
        selectedPortraitId: lookId,
        // Clear generated override so static multi-look files win
        avatarUrl: undefined,
        avatarVibe: look?.vibe || s.character.avatarVibe,
      },
      updatedAt: new Date().toISOString(),
    }));
    setHint(`Portrait: ${look?.label || lookId}`);
  };

  const injectHardNo = (label: string) => {
    const line = `HARD NO this session: ${label}. Never include.`;
    updateActiveStory((s) => ({
      ...s,
      mods: {
        ...s.mods,
        freeformNotes: s.mods.freeformNotes?.includes(line)
          ? s.mods.freeformNotes
          : `${s.mods.freeformNotes || ""}\n${line}`.trim(),
      },
    }));
    const p = useAppStore.getState().profile;
    if (!p.hardNos.includes(label) && !p.customHardNos.includes(label)) {
      useAppStore.getState().setProfile({
        customHardNos: [...p.customHardNos, label],
      });
    }
    setHint(`Blocked: ${label}`);
    setShowHardNos(false);
  };

  const fullStoryText = useCallback(() => {
    if (!story?.scenes?.length) return "";
    return story.scenes
      .map((sc, i) => {
        const head = `Scene ${i + 1}`;
        const action = sc.chosenAction ? `\nYou: ${sc.chosenAction}\n` : "\n";
        return `${head}${action}${sc.narrative}`;
      })
      .join("\n\n——\n\n");
  }, [story]);

  const toggleNarratePause = async () => {
    if (!current && !(fullStoryMode && story?.scenes?.length)) return;
    void unlockAmbient();
    // Allow re-tap even while loading (cancel + restart) on mobile
    if (voiceLoading) {
      speakTokenRef.current += 1;
      stopNarration();
      setVoiceLoading(false);
      setIsSpeaking(false);
      setIsPaused(false);
    }

    if (isSpeaking && !isPaused && !voiceLoading) {
      if (pauseNarration()) {
        setIsPaused(true);
        return;
      }
    }

    if (isSpeaking && isPaused) {
      // Resume needs a gesture on mobile — unlock then resume
      await unlockAudio();
      if (resumeNarration()) {
        setIsPaused(false);
        return;
      }
    }

    if (fullStoryMode && story?.scenes?.length) {
      const text = fullStoryText();
      if (text) await speakScene(text, "full-story");
      return;
    }
    if (!current) return;
    await speakScene(current.narrative, current.id);
  };

  const onChoice = (label: string) => {
    const now = Date.now();
    // Debounce double pointerup/click on iOS
    if (now - lastTapRef.current < 700) return;
    lastTapRef.current = now;
    if (loading || generatingRef.current) return;
    setRecentActions((prev) =>
      [label, ...prev.filter((x) => x !== label)].slice(0, 4)
    );
    void unlockAudio();
    void generate(label);
  };

  // Quiet shortcuts (no legend on screen)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === " " || e.key === "n" || e.key === "N") {
        if (!current && !(fullStoryMode && scenes.length)) return;
        e.preventDefault();
        void toggleNarratePause();
        return;
      }
      if ((e.key === "b" || e.key === "B") && current) {
        e.preventDefault();
        toggleBookmark();
        return;
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setFullStoryMode((v) => !v);
        return;
      }
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setTheater((v) => !v);
        return;
      }
      const num = Number(e.key);
      if (
        num >= 1 &&
        num <= 5 &&
        current &&
        isLatest &&
        typingDone &&
        !loading &&
        current.choices[num - 1]
      ) {
        e.preventDefault();
        onChoice(current.choices[num - 1].label);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    current,
    fullStoryMode,
    scenes.length,
    isLatest,
    typingDone,
    loading,
  ]);

  if (!story) {
    return (
      <div className="card-immersive p-10 text-center text-ink-400 animate-curtain">
        <p className="font-display text-2xl text-echo-100 mb-2">
          The room is empty
        </p>
        <p className="text-sm mb-6">No active story yet.</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/" className="btn-primary">
            Browse presets
          </Link>
          <Link href="/create" className="btn-ghost">
            Create your own
          </Link>
        </div>
      </div>
    );
  }

  const theme = getTheme(resolveStoryThemeId(story));
  const displayImage =
    current?.imageUrl ||
    (scenes.length ? resolveDisplayImage(scenes, Math.max(0, viewIndex)) : null);
  const imgLeft = imagesRemaining(story);
  const herName = story.character.customName || story.character.name;
  const busy = loading || generatingRef.current;
  const chem = getStoryChemistry(story);
  const chemScore = chemistryOverall(chem);
  const chemLbl = chemistryLabel(chemScore);
  const vibe = herVibeFromChemistry(chem);
  const hotMoments = scenes.filter((s) => s.bookmarked);
  const featuredMoods = MOOD_CHIPS.filter((m) =>
    FEATURED_MOOD_IDS.includes(m.id)
  );
  const extraMoods = MOOD_CHIPS.filter(
    (m) => !FEATURED_MOOD_IDS.includes(m.id)
  );

  const applyMood = (moodId: string) => {
    const chip = MOOD_CHIPS.find((m) => m.id === moodId);
    if (!chip || !story) return;
    const patch = chip.apply(story);
    updateActiveStory((s) => ({
      ...s,
      ...patch,
      settings: patch.settings ? { ...s.settings, ...patch.settings } : s.settings,
      mods: patch.mods ? { ...s.mods, ...patch.mods } : s.mods,
      memorySummary:
        patch.memorySummary !== undefined
          ? patch.memorySummary
          : s.memorySummary,
      updatedAt: new Date().toISOString(),
    }));
    setLastMood(chip.id);
    setMoodFlash(chip.label);
    setHint(`Mood: ${chip.label} — applies on the next scene.`);
    window.setTimeout(() => setMoodFlash(null), 2200);
  };

  return (
    <div
      className={clsx(
        "grid gap-4 animate-curtain",
        theater
          ? "max-w-3xl mx-auto lg:grid-cols-1"
          : "lg:grid-cols-[minmax(0,1fr)_280px]"
      )}
      data-theater={theater ? "1" : "0"}
    >
      <div className="space-y-3 min-w-0">
        <UsageBanner />
        <LimitReachedModal
          open={limitModal}
          onClose={() => setLimitModal(false)}
        />
        <div
          className={clsx(
            "card-immersive p-3 sm:p-8",
            theme.card,
            theater && "sm:p-10 border-white/15"
          )}
        >
          {/* Slim header — story first, controls second */}
          <div className="flex flex-col gap-2.5 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <CharacterAvatar
                character={story.character}
                size="sm"
                shape="soft"
                className="shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="panel-title text-base sm:text-xl truncate leading-tight">
                  {story.title}
                </h1>
                <p className="text-[11px] text-ink-500 mt-0.5 truncate">
                  <span className="text-ink-300">{herName}</span>
                  {scenes.length > 0 && (
                    <span>
                      {" "}
                      ·{" "}
                      {fullStoryMode
                        ? `Full · ${scenes.length} scenes`
                        : `${viewIndex + 1}/${scenes.length}`}
                    </span>
                  )}
                  {scenes.length > 0 && (
                    <span className="text-echo-300/80"> · {vibe}</span>
                  )}
                  {moodFlash && (
                    <span className="text-echo-300/90"> · {moodFlash}</span>
                  )}
                </p>
                {/* Slim chemistry bar — one glance, no panel clutter */}
                {scenes.length > 0 && (
                  <div
                    className="mt-1.5 flex items-center gap-2 max-w-xs"
                    title={`Desire ${chem.desire} · Bond ${chem.bond} · Tension ${chem.tension}`}
                  >
                    <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-echo-600/80 to-rose-400/90 transition-all duration-500"
                        style={{ width: `${chemScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-ink-500 shrink-0 tabular-nums">
                      {chemLbl}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Primary bar only — secondary tools collapse */}
            <div className="flex flex-wrap items-center gap-1.5 sticky top-[3.25rem] z-30 bg-black/55 backdrop-blur-md py-1.5 -mx-1 px-1 rounded-xl md:static md:bg-transparent md:p-0">
              {(current || (fullStoryMode && scenes.length > 0)) && (
                <button
                  type="button"
                  className={clsx(
                    "btn-primary min-h-10 px-4 text-sm touch-manipulation select-none",
                    voiceLoading && "opacity-90"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void toggleNarratePause();
                  }}
                >
                  {voiceLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> …
                    </>
                  ) : isSpeaking && !isPaused ? (
                    <>
                      <Pause className="h-3.5 w-3.5" /> Pause
                    </>
                  ) : isSpeaking && isPaused ? (
                    <>
                      <Play className="h-3.5 w-3.5" /> Resume
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />{" "}
                      {fullStoryMode ? "Narrate all" : "Narrate"}
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                className="btn-ghost min-h-10 min-w-10 px-2.5 touch-manipulation"
                title="Save"
                onClick={(e) => {
                  e.preventDefault();
                  saveActive();
                  setHint("Saved");
                }}
              >
                <Save className="h-4 w-4" />
              </button>
              {scenes.length > 0 && (
                <button
                  type="button"
                  className={clsx(
                    "btn-ghost min-h-10 px-2.5 text-xs touch-manipulation gap-1",
                    fullStoryMode && "border-echo-500/40 text-echo-200"
                  )}
                  title={
                    fullStoryMode
                      ? "Back to scene-by-scene"
                      : "Read full story continuously"
                  }
                  onClick={() => {
                    setFullStoryMode((v) => !v);
                    if (!fullStoryMode) {
                      setHistoryIndex(null);
                      setTypingDone(true);
                      setHint("Full story mode — scroll the whole arc");
                    } else {
                      setHint("Scene mode");
                    }
                  }}
                >
                  {fullStoryMode ? (
                    <List className="h-3.5 w-3.5" />
                  ) : (
                    <BookOpen className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {fullStoryMode ? "Scenes" : "Full"}
                  </span>
                </button>
              )}
              <AmbientAudio story={story} compact />
              <button
                type="button"
                className={clsx(
                  "btn-ghost min-h-10 px-2.5 text-xs touch-manipulation gap-1",
                  panel === "mood" && "border-echo-500/40 text-echo-200"
                )}
                title="Mood inject"
                disabled={busy}
                onClick={() => togglePanel("mood")}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mood</span>
                {panel === "mood" ? (
                  <ChevronUp className="h-3 w-3 opacity-60" />
                ) : (
                  <ChevronDown className="h-3 w-3 opacity-60" />
                )}
              </button>
              {(story.character.portraitLooks?.length ?? 0) > 0 && (
                <button
                  type="button"
                  className={clsx(
                    "btn-ghost min-h-10 px-2.5 text-xs touch-manipulation gap-1",
                    panel === "looks" && "border-echo-500/40 text-echo-200"
                  )}
                  title="Portrait looks"
                  onClick={() => togglePanel("looks")}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Portrait</span>
                </button>
              )}
              {scenes.length > 0 && (
                <button
                  type="button"
                  className={clsx(
                    "btn-ghost min-h-10 px-2.5 text-xs touch-manipulation gap-1",
                    panel === "clothes" && "border-echo-500/40 text-echo-200"
                  )}
                  title="Clothing state"
                  onClick={() => togglePanel("clothes")}
                >
                  <Shirt className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clothes</span>
                </button>
              )}
              <button
                type="button"
                className={clsx(
                  "btn-ghost min-h-10 min-w-10 px-2.5 touch-manipulation ml-auto",
                  panel === "more" && "border-echo-500/40 text-echo-200"
                )}
                title="More tools"
                onClick={() => togglePanel("more")}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Mood drawer */}
            {panel === "mood" && (
              <div className="rounded-xl border border-white/8 bg-black/30 p-2.5 space-y-1.5 animate-fade-in">
                <p className="text-[10px] uppercase tracking-widest text-ink-500 px-0.5">
                  Mood for next scene
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(allMoods
                    ? [...featuredMoods, ...extraMoods]
                    : featuredMoods
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      title={m.description}
                      disabled={busy}
                      onClick={() => applyMood(m.id)}
                      className={clsx(
                        "rounded-full border px-2.5 py-1 text-[11px] transition touch-manipulation min-h-8",
                        lastMood === m.id
                          ? "bg-echo-500/25 border-echo-400/50 text-echo-50"
                          : m.heat === 3
                            ? "border-rose-500/30 bg-rose-950/30 text-rose-100/90"
                            : m.heat === 2
                              ? "border-amber-500/25 bg-amber-950/25 text-amber-100/90"
                              : "border-white/10 bg-white/5 text-ink-300"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                {extraMoods.length > 0 && (
                  <button
                    type="button"
                    className="text-[10px] text-ink-500 hover:text-ink-300 px-0.5"
                    onClick={() => setAllMoods((v) => !v)}
                  >
                    {allMoods
                      ? "Show fewer"
                      : `+ ${extraMoods.length} more moods`}
                  </button>
                )}
              </div>
            )}

            {/* Portrait looks drawer — pre-made images, mid-story */}
            {panel === "looks" &&
              (story.character.portraitLooks?.length ?? 0) > 0 && (
                <div className="rounded-xl border border-white/8 bg-black/30 p-2.5 animate-fade-in space-y-2">
                  <div className="flex items-center justify-between gap-2 px-0.5">
                    <p className="text-[10px] uppercase tracking-widest text-ink-500">
                      Portrait look
                    </p>
                    <p className="text-[10px] text-ink-600">
                      Pre-made · free · works mid-story
                    </p>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                    {story.character.portraitLooks!.map((look) => {
                      const active =
                        story.character.selectedPortraitId === look.id ||
                        (!story.character.selectedPortraitId &&
                          look.id === "role");
                      const src = `/avatars/${look.file}?v=4`;
                      return (
                        <button
                          key={look.id}
                          type="button"
                          title={look.label}
                          onClick={() => setPortraitLook(look.id)}
                          className={clsx(
                            "group relative overflow-hidden rounded-xl border text-left transition touch-manipulation",
                            active
                              ? "border-echo-400/60 ring-1 ring-echo-400/40"
                              : "border-white/10 hover:border-white/25"
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={look.label}
                            className="aspect-[4/5] w-full object-cover object-top bg-ink-900"
                            loading="lazy"
                            draggable={false}
                            onError={(e) => {
                              const el = e.currentTarget;
                              if (!el.dataset.fb) {
                                el.dataset.fb = "1";
                                el.src = `/avatars/${story.character.id}.png?v=4`;
                              }
                            }}
                          />
                          <span
                            className={clsx(
                              "absolute inset-x-0 bottom-0 px-1 py-1 text-[9px] text-center truncate",
                              "bg-gradient-to-t from-black/85 to-transparent text-ink-100"
                            )}
                          >
                            {look.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Clothing drawer */}
            {panel === "clothes" && scenes.length > 0 && (
              <div className="rounded-xl border border-white/8 bg-black/30 p-2.5 animate-fade-in">
                <p className="text-[10px] uppercase tracking-widest text-ink-500 mb-1.5 px-0.5">
                  Clothing state (story text)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CLOTHING_STATES.map((c) => {
                    const active =
                      (story.mods.clothingState || "dressed") === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setClothing(c.id)}
                        className={clsx(
                          "rounded-full border px-2.5 py-1 text-[11px] min-h-8 touch-manipulation transition",
                          active
                            ? "bg-echo-500/25 border-echo-400/45 text-echo-50"
                            : "border-white/10 bg-white/5 text-ink-400"
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* More tools drawer */}
            {panel === "more" && (
              <div className="rounded-xl border border-white/8 bg-black/30 p-2.5 space-y-2 animate-fade-in">
                <div className="flex flex-wrap gap-1.5">
                  {current && (
                    <button
                      type="button"
                      className={clsx(
                        "btn-ghost min-h-9 text-xs",
                        current.bookmarked && "text-echo-300 border-echo-500/30"
                      )}
                      onClick={toggleBookmark}
                    >
                      <Bookmark className="h-3.5 w-3.5" /> Bookmark
                    </button>
                  )}
                  <button
                    type="button"
                    className={clsx(
                      "btn-ghost min-h-9 text-xs",
                      showMods && "border-echo-500/40 text-echo-200"
                    )}
                    onClick={() => setShowMods((v) => !v)}
                  >
                    <Settings2 className="h-3.5 w-3.5" /> Edit scene
                  </button>
                  {scenes.length > 0 && isLatest && (
                    <button
                      type="button"
                      className="btn-ghost min-h-9 text-xs"
                      disabled={busy}
                      onClick={undoLastScene}
                    >
                      <Undo2 className="h-3.5 w-3.5" /> Undo
                    </button>
                  )}
                  {scenes.length > 0 && isLatest && current && (
                    <button
                      type="button"
                      className="btn-ghost min-h-9 text-xs"
                      disabled={busy}
                      onClick={() => void regenerateLastScene()}
                    >
                      <RefreshCw
                        className={clsx("h-3.5 w-3.5", busy && "animate-spin")}
                      />{" "}
                      Regen
                    </button>
                  )}
                  <button
                    type="button"
                    className={clsx(
                      "btn-ghost min-h-9 text-xs",
                      theater && "border-echo-500/40 text-echo-200"
                    )}
                    onClick={() => setTheater((v) => !v)}
                  >
                    {theater ? (
                      <Minimize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5" />
                    )}{" "}
                    Theater
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      "btn-ghost min-h-9 text-xs",
                      showHardNos && "border-rose-500/40 text-rose-200"
                    )}
                    onClick={() => setShowHardNos((v) => !v)}
                  >
                    <ShieldOff className="h-3.5 w-3.5" /> Hard nos
                  </button>
                </div>
                {hotMoments.length > 0 && (
                  <div className="rounded-lg border border-white/8 bg-black/25 p-2 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-ink-500">
                      Bookmarked ({hotMoments.length})
                    </p>
                    <ul className="space-y-0.5 max-h-28 overflow-y-auto">
                      {hotMoments.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            className="w-full text-left text-[11px] text-ink-400 hover:text-echo-200 truncate py-0.5"
                            onClick={() => {
                              const idx = scenes.findIndex((x) => x.id === s.id);
                              if (idx >= 0) {
                                setFullStoryMode(false);
                                setHistoryIndex(idx);
                                setPanel(null);
                              }
                            }}
                          >
                            ★ Scene {s.index}
                            {s.chosenAction
                              ? ` — ${s.chosenAction.slice(0, 36)}`
                              : ""}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-[10px] text-ink-600 px-0.5 leading-relaxed">
                  Keys: Space narrate · 1–5 choices · B bookmark · F full · T
                  theater
                </p>
                {showHardNos && (
                  <div className="rounded-lg border border-rose-500/25 bg-rose-950/30 p-2.5 space-y-2">
                    <p className="text-[11px] text-rose-100/90">
                      Block for this story (and profile)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {hardNoPresets
                        .filter((h) => h.id !== "minors")
                        .slice(0, 12)
                        .map((h) => (
                          <button
                            key={h.id}
                            type="button"
                            className="rounded-full border border-rose-400/30 bg-black/30 px-2.5 py-1 text-[11px] text-rose-100 min-h-8"
                            onClick={() => injectHardNo(h.label)}
                          >
                            {h.label}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-xs text-red-50">
              <p className="leading-relaxed">{error}</p>
              <button
                type="button"
                className="shrink-0 min-h-8 min-w-8"
                onClick={() => setError(null)}
              >
                ✕
              </button>
            </div>
          )}

          {hint && !error && (
            <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-echo-500/20 bg-echo-500/10 px-4 py-3 text-xs text-echo-50">
              <p className="leading-relaxed">{hint}</p>
              <button
                type="button"
                className="shrink-0 min-h-8 min-w-8"
                onClick={() => setHint(null)}
              >
                ✕
              </button>
            </div>
          )}

          {scenes.length === 0 ? (
            <div className="text-center py-8 px-2">
              <div className="flex justify-center mb-5">
                <CharacterAvatar
                  character={story.character}
                  size="xl"
                  shape="portrait"
                  className="mx-auto"
                />
              </div>
              <p className="font-display text-xl text-echo-100 mb-1">
                {herName}
              </p>
              <p className="font-display text-base text-ink-200 mb-3 leading-relaxed max-w-md mx-auto">
                {story.scenario.openingHook}
              </p>
              <button
                type="button"
                className="btn-primary min-h-14 px-8 text-base w-full sm:w-auto touch-manipulation select-none"
                disabled={busy}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (busy || generatingRef.current) return;
                  void unlockAudio();
                  void generate("Begin — she starts speaking to you", true);
                }}
              >
                {busy ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Writing…
                  </>
                ) : (
                  "Begin story"
                )}
              </button>
            </div>
          ) : fullStoryMode ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-[11px] text-ink-500">
                  Continuous read · {scenes.length} scene
                  {scenes.length === 1 ? "" : "s"}
                </p>
                <button
                  type="button"
                  className="text-[11px] text-echo-300 hover:text-echo-100 underline-offset-2 hover:underline"
                  onClick={() => {
                    setFullStoryMode(false);
                    setHistoryIndex(null);
                  }}
                >
                  Back to scene mode
                </button>
              </div>
              {displayImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayImage}
                  alt={herName}
                  className="max-h-[min(16rem,36vh)] w-full rounded-2xl object-cover object-top border border-white/10 shadow-lg"
                  draggable={false}
                />
              )}
              <div className="space-y-8">
                {scenes.map((sc, i) => (
                  <article
                    key={sc.id}
                    className="scroll-mt-24 border-t border-white/8 pt-5 first:border-0 first:pt-0"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-[10px] uppercase tracking-widest text-ink-500">
                        Scene {i + 1}
                      </p>
                      <button
                        type="button"
                        className="text-[10px] text-ink-500 hover:text-ink-300"
                        onClick={() => {
                          setFullStoryMode(false);
                          setHistoryIndex(i);
                          setTypingDone(true);
                        }}
                      >
                        Open scene
                      </button>
                    </div>
                    {sc.chosenAction && (
                      <p className="text-xs text-echo-300/90 italic mb-2 px-1 border-l-2 border-echo-500/40 pl-3">
                        You: {sc.chosenAction}
                      </p>
                    )}
                    <div
                      className={clsx(
                        "story-prose whitespace-pre-wrap",
                        theater && "text-base sm:text-lg leading-relaxed"
                      )}
                    >
                      {sc.narrative}
                    </div>
                    {sc.imageUrl && i !== viewIndex && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sc.imageUrl}
                        alt=""
                        className="mt-3 max-h-40 w-full rounded-xl object-cover object-top border border-white/8 opacity-90"
                        draggable={false}
                      />
                    )}
                  </article>
                ))}
              </div>
              {isLatest && !busy && current && (
                <p className="text-[11px] text-ink-500 text-center pt-2">
                  Scroll down for choices to continue the arc
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="relative mb-5">
                {displayImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayImage}
                    alt={`${herName}`}
                    className="max-h-[min(22rem,42vh)] w-full rounded-2xl object-cover object-top border border-white/10 shadow-xl pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <CharacterAvatar
                      character={story.character}
                      size="lg"
                      shape="soft"
                      className="shrink-0"
                    />
                    <div className="min-w-0 text-left">
                      <p className="font-display text-lg text-echo-100">
                        {herName}
                      </p>
                      <p className="text-xs text-ink-500 line-clamp-2 mt-1">
                        {story.character.customBody || story.character.body}
                      </p>
                    </div>
                  </div>
                )}
                {imageLoading && isLatest && (
                  <div className="mt-2 flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-echo-500/25 bg-black/30 text-sm text-echo-200">
                    <Loader2 className="h-4 w-4 animate-spin" /> Photo…
                  </div>
                )}
              </div>

              {current?.chosenAction && (
                <p className="text-xs text-echo-300/90 italic mb-3 px-1 border-l-2 border-echo-500/40 pl-3">
                  You: {current.chosenAction}
                </p>
              )}
              <Typewriter
                key={current?.id}
                text={current?.narrative || ""}
                enabled={useTypewriter}
                speed={touchUi ? 4 : 8}
                className={clsx(
                  "story-prose min-h-[100px]",
                  theater && "text-base sm:text-lg leading-relaxed"
                )}
                onDone={() => setTypingDone(true)}
              />
              {useTypewriter && !typingDone && current && (
                <div className="sticky bottom-2 z-20 mt-4 flex justify-center">
                  <button
                    type="button"
                    className="btn-primary text-xs min-h-11 px-5 shadow-xl shadow-black/40"
                    onClick={() => setTypingDone(true)}
                  >
                    Skip to choices
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Choices — always visible once typing done; never blocked by ghost state */}
        {current && isLatest && typingDone && !busy && (
          <div
            className={clsx(
              "card-immersive p-3 sm:p-4 space-y-2.5",
              theme.card,
              "pb-[calc(1rem+env(safe-area-inset-bottom))]"
            )}
          >
            <div className="grid gap-2">
              {current.choices.map((c, i) => {
                const tag = tagChoice(c.label);
                return (
                  <button
                    key={`${current.id}-${c.id}-${i}`}
                    type="button"
                    className="btn-choice w-full text-left min-h-[3.25rem] touch-manipulation select-none active:bg-echo-500/15"
                    disabled={busy}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (busy) return;
                      onChoice(c.label);
                    }}
                  >
                    <span className="text-echo-400/70 text-[10px] font-medium w-5 shrink-0 pt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-snug flex-1 min-w-0 text-sm">
                      {c.label}
                    </span>
                    {tag && (
                      <span
                        className={clsx(
                          "shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-wide opacity-80",
                          tag.className
                        )}
                      >
                        {tag.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {recentActions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {recentActions.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-ink-500 max-w-[10rem] truncate min-h-7"
                    onClick={() => onChoice(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <input
                className="input flex-1 min-h-12 text-base"
                placeholder="Or type your move…"
                value={customAction}
                enterKeyHint="send"
                onChange={(e) => setCustomAction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customAction.trim() && !busy) {
                    e.preventDefault();
                    onChoice(customAction.trim());
                  }
                }}
              />
              <button
                type="button"
                className="btn-primary px-4 min-h-12 min-w-12 touch-manipulation"
                disabled={!customAction.trim() || busy}
                onClick={(e) => {
                  e.preventDefault();
                  if (customAction.trim()) onChoice(customAction.trim());
                }}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {busy && (
          <div className="card-immersive p-8 flex flex-col items-center justify-center gap-3 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-echo-900/20 via-transparent to-violet-900/20 animate-pulse-soft pointer-events-none" />
            <Loader2 className="h-7 w-7 animate-spin text-echo-300 relative" />
            <p className="text-sm text-echo-100 font-display text-lg relative">
              She&apos;s writing…
            </p>
            <p className="text-[11px] text-ink-500 relative max-w-xs text-center leading-relaxed">
              One scene at a time. Soft music optional. Don&apos;t leave this page.
            </p>
            <div className="w-40 h-1 rounded-full bg-white/10 overflow-hidden relative mt-1">
              <div className="h-full w-1/2 bg-gradient-to-r from-echo-500 to-velvet-500 animate-pulse rounded-full" />
            </div>
          </div>
        )}
      </div>

      <aside
        className={clsx(
          "space-y-4 lg:sticky lg:top-20 lg:self-start pb-10",
          theater && "hidden"
        )}
      >
        <ShareCodePanel story={story} />

        <div className={clsx("card-immersive p-4", theme.card)}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="label mb-0">Scenes</h2>
            <span className="text-[10px] text-ink-500">
              {canGenImages
                ? imgLeft > 0
                  ? `${imgLeft} AI photos left`
                  : "Photo limit"
                : "Pre-made art"}
            </span>
          </div>
          {current && canGenImages && imagesRemaining(story) > 0 && (
            <button
              type="button"
              className="btn-ghost w-full text-xs mb-3 min-h-11 touch-manipulation"
              onClick={() => void generateImage()}
              disabled={imageLoading}
            >
              {imageLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              AI photo (Pro)
            </button>
          )}
          {current && !canGenImages && (
            <a
              href="/pricing"
              className="btn-ghost w-full text-xs mb-3 min-h-11 touch-manipulation justify-center"
            >
              AI photos = Pro →
            </a>
          )}
          <ul className="space-y-1 max-h-48 overflow-y-auto overscroll-contain">
            {scenes.map((s, i) => (
              <li key={s.id} className="flex items-center gap-1">
                <button
                  type="button"
                  className={clsx(
                    "flex-1 text-left text-xs rounded-lg px-2 py-2.5 truncate touch-manipulation min-h-10",
                    i === viewIndex
                      ? "bg-echo-500/20 text-echo-100"
                      : "text-ink-400 active:bg-white/10"
                  )}
                  onClick={() => {
                    setHistoryIndex(i);
                    speakTokenRef.current += 1;
                    stopNarration();
                    setIsSpeaking(false);
                    setIsPaused(false);
                  }}
                >
                  {s.bookmarked && "★ "}
                  Scene {i + 1}
                  {s.chosenAction
                    ? `: ${s.chosenAction.slice(0, 18)}`
                    : " (open)"}
                </button>
                {i < scenes.length - 1 && (
                  <button
                    type="button"
                    className="p-2 text-ink-500 min-h-10 min-w-10 touch-manipulation"
                    title="Rewind to here"
                    onClick={() => rewindTo(i)}
                  >
                    <Rewind className="h-3 w-3" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {historyIndex !== null && historyIndex < scenes.length - 1 && (
            <button
              type="button"
              className="btn-ghost w-full mt-2 text-xs min-h-11"
              onClick={() => setHistoryIndex(null)}
            >
              <ChevronLeft className="h-3 w-3" /> Back to latest
            </button>
          )}
        </div>

        {showMods && (
          <div className="card p-4 space-y-3">
            <h2 className="label">Modifications</h2>

            <div>
              <label className="label">Who she is to you</label>
              <p className="text-[10px] text-ink-500 mb-1.5">
                Reframe mid-story — face stays, relationship changes next scene.
              </p>
              <div className="flex flex-wrap gap-1 mb-1.5">
                <button
                  type="button"
                  onClick={() => setRelGroupPlay("all")}
                  className={clsx(
                    "rounded-full border px-2 py-0.5 text-[10px]",
                    relGroupPlay === "all"
                      ? "border-echo-400/50 bg-echo-500/15 text-echo-100"
                      : "border-white/10 text-ink-500"
                  )}
                >
                  All
                </button>
                {RELATIONSHIP_FRAME_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setRelGroupPlay(g.id)}
                    className={clsx(
                      "rounded-full border px-2 py-0.5 text-[10px]",
                      relGroupPlay === g.id
                        ? "border-echo-400/50 bg-echo-500/15 text-echo-100"
                        : "border-white/10 text-ink-500"
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {RELATIONSHIP_FRAMES.filter(
                  (f) => relGroupPlay === "all" || f.group === relGroupPlay
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    title={f.hint}
                    onClick={() => {
                      updateActiveStory((s) => {
                        const nextChar = applyRelationshipFrame(
                          s.character,
                          f.id
                        );
                        return {
                          ...s,
                          character: nextChar,
                          mods: {
                            ...s.mods,
                            relationshipNotes: f.relationship,
                            freeformNotes: [
                              s.mods.freeformNotes,
                              `Relationship reframed: she is now ${f.label.toLowerCase()} to you. Keep continuity of what already happened; adjust how she addresses you going forward.`,
                            ]
                              .filter(Boolean)
                              .join("\n"),
                          },
                          memorySummary: [
                            s.memorySummary,
                            `Relationship updated mid-story: ${f.label}.`,
                          ]
                            .filter(Boolean)
                            .join(" "),
                        };
                      });
                      setHint(`She’s now: ${f.label} — applies next scene.`);
                    }}
                    className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-ink-300 hover:border-echo-400/40 hover:text-echo-100"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-ink-600 mt-1 line-clamp-2">
                {story.character.customRelationship ||
                  story.character.relationship}
              </p>
            </div>

            <div>
              <label className="label">Her appearance</label>
              <textarea
                className="input min-h-[72px] text-base"
                value={
                  story.mods.appearanceNotes ||
                  story.character.customBody ||
                  story.character.body
                }
                onChange={(e) => {
                  const v = e.target.value;
                  updateMods({ appearanceNotes: v });
                  updateActiveStory((s) => ({
                    ...s,
                    character: {
                      ...s.character,
                      customBody: v,
                      appearanceNotes: v,
                    },
                  }));
                }}
              />
            </div>
            <div>
              <label className="label">Personality</label>
              <textarea
                className="input min-h-[60px] text-base"
                value={story.mods.personalityNotes}
                onChange={(e) =>
                  updateMods({ personalityNotes: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Location</label>
              <input
                className="input text-base"
                value={story.mods.locationOverride}
                onChange={(e) =>
                  updateMods({ locationOverride: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Freeform notes</label>
              <textarea
                className="input min-h-[60px] text-base"
                value={story.mods.freeformNotes}
                onChange={(e) => updateMods({ freeformNotes: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="card p-4 text-xs text-ink-500 space-y-1">
          <p>
            <span className="text-ink-400">D/s:</span>{" "}
            {story.character.roleOverride || story.character.defaultRole}
          </p>
          <p className="line-clamp-2">
            <span className="text-ink-400">To you:</span>{" "}
            {(
              story.character.customRelationship ||
              story.character.relationship
            ).slice(0, 80)}
            …
          </p>
          <p className="line-clamp-3">
            <span className="text-ink-400">Memory:</span>{" "}
            {story.memorySummary || "—"}
          </p>
        </div>
      </aside>
    </div>
  );
}
