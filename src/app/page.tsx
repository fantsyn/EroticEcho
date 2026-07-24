"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Library,
  Sparkles,
  User,
  Shuffle,
  Flame,
  Play,
  Star,
  Heart,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { randomizeSetup } from "@/lib/data";
import { storyPresets, createStoryFromPreset } from "@/lib/presets";
import { PresetCard } from "@/components/PresetCard";
import { ClaimCode } from "@/components/ClaimCode";
import { useRouter } from "next/navigation";
import { loadFavoritePresets } from "@/lib/storage";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { UsageBanner } from "@/components/UsageBanner";
import { track } from "@/lib/analytics";
import {
  dismissStarter,
  loadPlaySignals,
  loadQuiz,
  loadStarterDismissed,
  scorePresetForYou,
  STARTER_PRESET_IDS,
  learnFromPlay,
} from "@/lib/quiz";
import clsx from "clsx";

const MOOD_FILTERS = [
  { id: "all", label: "All" },
  { id: "fav", label: "★ Favorites" },
  { id: "soft", label: "Soft / cute", match: /cute|soft|romance|shy|library|slow|barista|massage|melt/i },
  { id: "you-sub", label: "You are sub", match: /you sub|reader-sub|kneel|domme|training|soft dom|shy→dom|shy-to-dom/i },
  { id: "bombshell", label: "Bombshell / melt", match: /bombshell|melt|wants you|falls|confident/i },
  { id: "creative", label: "Creative / weird", match: /creative|time-loop|loop|hot mic|vault|ferry|drone|body.?swap|escape room|tattoo|yacht|opera|sauna|install|wrong key|clan|interview|storm bunk|garden of eyes/i },
  { id: "taboo", label: "Taboo", match: /taboo|forbidden|princess|roommate|veil|palace|wrong house|affair|step|wedding|confession|sin/i },
  { id: "public", label: "Public risk", match: /public|elevator|fitting|balcony|closet|exhibition|almost.?caught|subway|opera|museum|sauna|roof|pool closed|ferry|hot mic/i },
  { id: "switch", label: "Switch", match: /switch|coin|flip|fluid|mid-scene/i },
  { id: "humiliation", label: "Humiliation", match: /humiliation|brat|degradation|say it|corrected/i },
  { id: "blackmail", label: "Blackmail", match: /blackmail|leverage|photo|exposure|cnc/i },
  { id: "threesome", label: "Threesome", match: /threesome|ffm|best friend stays|rival/i },
  { id: "filth", label: "Filth / NSFW", match: /filth|nsfw|free use|breeding|cam|slut/i },
  { id: "forbidden", label: "Forbidden", match: /forbidden|taboo|milf|step|affair|home/i },
  { id: "dark", label: "Dark / CNC", match: /dark|cnc|yandere|edge|blackmail|mind|control/i },
  { id: "fantasy", label: "Fantasy", match: /fantasy|monster|magic|sci-fi|worship|demon|vampire|witch|princess|palace/i },
  { id: "power", label: "Power / uniform", match: /power|domme|authority|uniform|office|nurse|cop|boss|royal/i },
  { id: "hot", label: "Heat 8+", heatMin: 8 },
] as const;

export default function HomePage() {
  const stories = useAppStore((s) => s.stories);
  const profile = useAppStore((s) => s.profile);
  const setDraftCharacter = useAppStore((s) => s.setDraftCharacter);
  const setDraftScenario = useAppStore((s) => s.setDraftScenario);
  const setDraftSettings = useAppStore((s) => s.setDraftSettings);
  const startPresetStory = useAppStore((s) => s.startPresetStory);
  const loadStoryById = useAppStore((s) => s.loadStoryById);
  const router = useRouter();
  const [mood, setMood] = useState<(typeof MOOD_FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [quizTick, setQuizTick] = useState(0);
  const [showStarter, setShowStarter] = useState(false);
  /** Onboarding: pick a vibe → 3 quick cards */
  const [onboardMood, setOnboardMood] = useState<
    "soft" | "filth" | "power" | "creative" | null
  >(null);

  useEffect(() => {
    setFavorites(loadFavoritePresets());
    setShowStarter(!loadStarterDismissed());
    track("page_view", { page: "home" });
    const bump = () => setQuizTick((t) => t + 1);
    window.addEventListener("focus", bump);
    window.addEventListener("ee-quiz-done", bump);
    window.addEventListener("ee-play-learn", bump);
    return () => {
      window.removeEventListener("focus", bump);
      window.removeEventListener("ee-quiz-done", bump);
      window.removeEventListener("ee-play-learn", bump);
    };
  }, []);

  const recent = useMemo(
    () =>
      [...stories].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [stories]
  );
  const lastStory = recent[0];
  const continueStories = recent.slice(0, 3);

  const forYou = useMemo(() => {
    void quizTick;
    const quiz = loadQuiz();
    const play = loadPlaySignals();
    const kinks = [...(profile.kinks || []), ...(profile.customKinks || [])];
    const scored = storyPresets
      .map((p) => ({
        p,
        score: scorePresetForYou(
          p,
          quiz,
          kinks,
          favorites.includes(p.id),
          play
        ),
      }))
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 6).map((x) => x.p);
  }, [profile.kinks, profile.customKinks, favorites, quizTick]);

  const starterPack = useMemo(() => {
    return STARTER_PRESET_IDS.map((id) =>
      storyPresets.find((p) => p.id === id)
    ).filter(Boolean) as typeof storyPresets;
  }, []);

  const onboardCards = useMemo(() => {
    if (!onboardMood) return [];
    const re =
      onboardMood === "soft"
        ? /soft|shy|romance|cute|melt|barista|massage|storm bunk/i
        : onboardMood === "filth"
          ? /filth|public|hot mic|threesome|slut|breeding|cnc|blackmail/i
          : onboardMood === "power"
            ? /you sub|domme|kneel|boss|vault|hired|princess|training/i
            : /creative|loop|wrong key|escape|tattoo|yacht|body.?swap|drone|opera|garden/i;
    const hits = storyPresets.filter((p) =>
      re.test([p.title, p.tagline, p.blurb, ...p.tags].join(" "))
    );
    // Prefer unused variety
    const shuffled = [...hits].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [onboardMood]);

  const surpriseMe = () => {
    const { character, scenario } = randomizeSetup();
    setDraftCharacter(character);
    setDraftScenario(scenario);
    setDraftSettings({
      intensity: scenario.intensityHint,
      mode: scenario.intensityHint >= 8 ? "pure-filth" : "slow-burn",
      autoImages: false,
    });
    router.push("/create");
  };

  const playPreset = (id: string) => {
    const preset = storyPresets.find((p) => p.id === id);
    if (!preset) return;
    const story = createStoryFromPreset(preset);
    if (!story) {
      alert("Preset is missing character or scenario data.");
      return;
    }
    track("preset_play", { id });
    learnFromPlay({
      tags: preset.tags,
      mode: preset.mode,
      intensity: preset.intensity,
      presetId: preset.id,
    });
    startPresetStory(story);
    router.push("/play");
  };

  const filtered = useMemo(() => {
    const f = MOOD_FILTERS.find((m) => m.id === mood) || MOOD_FILTERS[0];
    const q = query.trim().toLowerCase();
    return storyPresets.filter((p) => {
      const blob = [p.title, p.tagline, p.blurb, ...p.tags, p.mode].join(" ");
      if (q && !blob.toLowerCase().includes(q)) return false;
      if (f.id === "all") return true;
      if (f.id === "fav") return favorites.includes(p.id);
      if ("heatMin" in f && f.heatMin) return p.intensity >= f.heatMin;
      if ("match" in f && f.match) return f.match.test(blob);
      return true;
    });
  }, [mood, query, favorites]);

  const sorted = useMemo(() => {
    if (mood !== "all" && mood !== "fav") return filtered;
    return [...filtered].sort((a, b) => {
      const af = favorites.includes(a.id) ? 0 : 1;
      const bf = favorites.includes(b.id) ? 0 : 1;
      if (af !== bf) return af - bf;
      return b.intensity - a.intensity;
    });
  }, [filtered, favorites, mood]);

  const surprisePreset = () => {
    const pool = forYou.length ? forYou : sorted.length ? sorted : storyPresets;
    const p = pool[Math.floor(Math.random() * pool.length)];
    playPreset(p.id);
  };

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in">
      <UsageBanner />

      {/* Continue */}
      {continueStories.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-2 mb-3">
            <div>
              <p className="section-kicker mb-0.5">Continue</p>
              <h2 className="panel-title text-xl sm:text-2xl">Pick up where you left off</h2>
            </div>
            <Link href="/library" className="text-xs text-ink-400 hover:text-ink-200">
              Library →
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {continueStories.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  loadStoryById(s.id);
                  router.push("/play");
                }}
                className={clsx(
                  "card-immersive p-3 sm:p-4 flex items-center gap-3 text-left transition active:scale-[0.99] hover:border-echo-400/30",
                  i === 0 && "sm:col-span-1 border-echo-500/20"
                )}
              >
                <CharacterAvatar
                  character={s.character}
                  size="md"
                  shape="soft"
                  className="shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-echo-50 truncate">
                    {s.title}
                  </p>
                  <p className="text-[11px] text-ink-500 truncate mt-0.5">
                    {s.character.customName || s.character.name} ·{" "}
                    {s.scenes.length} scenes
                  </p>
                </div>
                <Play className="h-4 w-4 text-echo-300 shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 card-immersive p-6 sm:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/40 via-transparent to-violet-950/40 pointer-events-none" />
        <div className="relative max-w-xl">
          <p className="section-kicker mb-2 sm:mb-3">18+ · Immersive Fiction</p>
          <h1 className="font-display text-3xl sm:text-6xl text-echo-50 leading-[1.1] mb-3 sm:mb-4">
            Step into the heat.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-echo-300 via-pink-200 to-velvet-300">
              Let it echo.
            </span>
          </h1>
          <p className="text-ink-300 text-sm sm:text-base leading-relaxed mb-5 sm:mb-8 max-w-md">
            She narrates in first person. You choose what happens next.{" "}
            <strong className="text-ink-200 font-medium">
              {storyPresets.length} presets
            </strong>
            , multi-look portraits, mood tools — free scenes daily, AI photos on
            Pro only.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link href="/create" className="btn-primary min-h-11">
              <Sparkles className="h-4 w-4" /> Create
            </Link>
            <button
              type="button"
              className="btn-ghost min-h-11"
              onClick={surprisePreset}
            >
              <Flame className="h-4 w-4" /> For you random
            </button>
            <button
              type="button"
              className="btn-ghost min-h-11"
              onClick={surpriseMe}
            >
              <Shuffle className="h-4 w-4" /> Surprise build
            </button>
            <Link href="/profile" className="btn-ghost min-h-11">
              <User className="h-4 w-4" /> Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="card p-4 sm:p-5 max-w-xl">
        <ClaimCode />
      </section>

      {/* Onboarding: mood → 3 cards */}
      <section className="card-immersive p-4 sm:p-6 space-y-3">
        <div>
          <p className="section-kicker mb-0.5">Start in 10 seconds</p>
          <h2 className="panel-title text-xl sm:text-2xl">
            What kind of night?
          </h2>
          <p className="text-xs text-ink-500 mt-1">
            Pick a vibe — we show three ready presets. No setup required.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["soft", "Soft / shy"],
              ["filth", "Filth / risk"],
              ["power", "You are sub"],
              ["creative", "Weird / creative"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setOnboardMood(id);
                track("onboard_mood", { mood: id });
              }}
              className={clsx(
                "rounded-full border px-3 py-2 text-xs min-h-10 touch-manipulation transition",
                onboardMood === id
                  ? "bg-rose-500/25 border-rose-400/50 text-rose-50"
                  : "bg-black/25 border-white/10 text-ink-300 active:border-white/25"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {onboardMood && onboardCards.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-3 pt-1 animate-fade-in">
            {onboardCards.map((p) => (
              <PresetCard
                key={p.id}
                preset={p}
                favorited={favorites.includes(p.id)}
                onFavoriteChange={setFavorites}
                onPlay={() => playPreset(p.id)}
              />
            ))}
          </div>
        )}
        {onboardMood && onboardCards.length === 0 && (
          <p className="text-xs text-ink-500">
            No matches — browse the full library below.
          </p>
        )}
      </section>

      {/* Starter 12 */}
      {showStarter && starterPack.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-2 mb-3">
            <div>
              <p className="section-kicker mb-0.5">Starter 12</p>
              <h2 className="panel-title text-xl sm:text-2xl">
                Easy first nights
              </h2>
              <p className="text-xs text-ink-500 mt-1">
                Curated openers — soft to steamy, not overwhelming
              </p>
            </div>
            <button
              type="button"
              className="text-xs text-ink-500 hover:text-ink-300 min-h-9"
              onClick={() => {
                dismissStarter();
                setShowStarter(false);
              }}
            >
              Hide
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {starterPack.map((p) => (
              <PresetCard
                key={`st-${p.id}`}
                preset={p}
                favorited={favorites.includes(p.id)}
                onFavoriteChange={setFavorites}
                onPlay={() => playPreset(p.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* For you */}
      <section>
        <div className="flex items-end justify-between gap-2 mb-3">
          <div>
            <p className="section-kicker mb-0.5 flex items-center gap-1.5">
              <Heart className="h-3 w-3 text-echo-400" /> For you
            </p>
            <h2 className="panel-title text-xl sm:text-2xl">
              Matched to your vibe
            </h2>
            <p className="text-xs text-ink-500 mt-1">
              Quiz · kinks · favorites · what you actually play
            </p>
          </div>
          <Link
            href="/profile"
            className="text-xs text-ink-400 hover:text-ink-200 min-h-9 flex items-center"
          >
            Update vibe →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {forYou.map((p) => (
            <PresetCard
              key={`fy-${p.id}`}
              preset={p}
              favorited={favorites.includes(p.id)}
              onFavoriteChange={setFavorites}
              onPlay={() => playPreset(p.id)}
            />
          ))}
        </div>
      </section>

      {/* Full library */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <div>
            <p className="section-kicker mb-1">Browse all</p>
            <h2 className="panel-title text-2xl sm:text-3xl">
              Preset stories
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              {sorted.length} of {storyPresets.length}
              {favorites.length > 0 && (
                <span className="text-amber-200/80">
                  {" "}
                  · {favorites.length} starred
                </span>
              )}
            </p>
          </div>
          <input
            className="input max-w-xs text-sm min-h-11"
            placeholder="Search presets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {MOOD_FILTERS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMood(m.id)}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-[11px] min-h-9 transition touch-manipulation",
                mood === m.id
                  ? "bg-rose-500/25 border-rose-400/50 text-rose-50"
                  : "bg-black/25 border-white/10 text-ink-400 active:border-white/25"
              )}
            >
              {m.id === "fav" ? (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3" /> Favorites
                </span>
              ) : (
                m.label
              )}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sorted.map((p) => (
            <PresetCard
              key={p.id}
              preset={p}
              favorited={favorites.includes(p.id)}
              onFavoriteChange={setFavorites}
              onPlay={() => playPreset(p.id)}
            />
          ))}
        </div>
        {sorted.length === 0 && (
          <p className="text-sm text-ink-500 text-center py-10">
            No presets match. Clear search or pick another mood.
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[
          {
            href: "/create",
            icon: Sparkles,
            title: "Create",
            desc: "Character + scenario",
          },
          {
            href: "/play",
            icon: BookOpen,
            title: "Play",
            desc: "Continue the heat",
          },
          {
            href: "/library",
            icon: Library,
            title: "Library",
            desc: `${stories.length} saved`,
          },
          {
            href: "/profile",
            icon: User,
            title: "You",
            desc: profile.name || "Name & kinks",
          },
        ].map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="card-immersive p-4 sm:p-5 hover:border-echo-400/30 transition group active:scale-[0.98]"
          >
            <Icon className="h-5 w-5 text-echo-400 mb-2 sm:mb-3 group-hover:scale-110 transition" />
            <h2 className="font-display text-base sm:text-lg text-ink-50">
              {title}
            </h2>
            <p className="text-xs text-ink-500 mt-1">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
