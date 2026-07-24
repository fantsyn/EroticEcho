/**
 * Short intro quiz — local prefs for "For you" recommendations.
 */

export type QuizVibe =
  | "soft"
  | "filth"
  | "forbidden"
  | "dark"
  | "fantasy"
  | "power";

export interface QuizResult {
  completed: boolean;
  heat: number; // 1–10 preferred intensity
  vibes: QuizVibe[];
  completedAt: string;
}

const KEY = "eroticecho:introQuiz";
const PLAY_KEY = "eroticecho:playSignals";
const STARTER_DISMISS = "eroticecho:starter12Dismiss";

export type PlaySignals = {
  /** Weighted tag/mode tokens from stories the user played */
  tags: Record<string, number>;
  intensities: number[];
  lastPresetIds: string[];
};

export function loadQuiz(): QuizResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizResult;
  } catch {
    return null;
  }
}

export function saveQuiz(result: Omit<QuizResult, "completed" | "completedAt">) {
  if (typeof window === "undefined") return;
  const full: QuizResult = {
    ...result,
    completed: true,
    completedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(full));
  return full;
}

export function clearQuiz() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function loadPlaySignals(): PlaySignals {
  if (typeof window === "undefined") return { tags: {}, intensities: [], lastPresetIds: [] };
  try {
    const raw = localStorage.getItem(PLAY_KEY);
    if (!raw) return { tags: {}, intensities: [], lastPresetIds: [] };
    return JSON.parse(raw) as PlaySignals;
  } catch {
    return { tags: {}, intensities: [], lastPresetIds: [] };
  }
}

/** Learn from a played preset or finished story setup */
export function learnFromPlay(opts: {
  tags?: string[];
  mode?: string;
  intensity?: number;
  presetId?: string;
}) {
  if (typeof window === "undefined") return;
  const cur = loadPlaySignals();
  const tags = { ...cur.tags };
  for (const t of opts.tags || []) {
    const k = t.toLowerCase();
    tags[k] = (tags[k] || 0) + 2;
  }
  if (opts.mode) {
    const m = opts.mode.toLowerCase();
    tags[m] = (tags[m] || 0) + 3;
  }
  const intensities = [...cur.intensities, opts.intensity ?? 6].slice(-20);
  const lastPresetIds = opts.presetId
    ? [opts.presetId, ...cur.lastPresetIds.filter((id) => id !== opts.presetId)].slice(0, 12)
    : cur.lastPresetIds;
  // decay: cap tag weights
  for (const k of Object.keys(tags)) {
    tags[k] = Math.min(tags[k], 40);
  }
  localStorage.setItem(
    PLAY_KEY,
    JSON.stringify({ tags, intensities, lastPresetIds } satisfies PlaySignals)
  );
  window.dispatchEvent(new Event("ee-play-learn"));
}

/** Score a preset blob against quiz + kinks + play history */
export function scorePresetForYou(
  preset: {
    id?: string;
    tags: string[];
    intensity: number;
    mode: string;
    title: string;
    blurb: string;
  },
  quiz: QuizResult | null,
  profileKinks: string[] = [],
  favorited = false,
  play?: PlaySignals | null
): number {
  let score = 0;
  const blob = [...preset.tags, preset.mode, preset.title, preset.blurb]
    .join(" ")
    .toLowerCase();

  if (favorited) score += 50;

  if (quiz) {
    const heatDiff = Math.abs(preset.intensity - quiz.heat);
    score += Math.max(0, 12 - heatDiff * 2);

    const vibeMatchers: Record<QuizVibe, RegExp> = {
      soft: /cute|soft|romance|shy|slow|gentle|praise|library/,
      filth: /filth|nsfw|slut|free use|breeding|cam|explicit|pure/,
      forbidden: /forbidden|taboo|milf|step|affair|aunt|guilt/,
      dark: /dark|cnc|yandere|edge|blackmail|obsess|psycho/,
      fantasy: /fantasy|monster|magic|sci-fi|vampire|witch|demon|goddess|alien/,
      power: /power|domme|authority|uniform|office|nurse|cop|boss|control/,
    };
    for (const v of quiz.vibes) {
      if (vibeMatchers[v]?.test(blob)) score += 14;
    }
  }

  for (const k of profileKinks) {
    if (blob.includes(k.toLowerCase().replace(/-/g, " "))) score += 4;
    if (blob.includes(k.toLowerCase())) score += 4;
  }

  // Learn from what they actually play
  if (play) {
    for (const [tag, w] of Object.entries(play.tags)) {
      if (blob.includes(tag) || preset.tags.some((t) => t.toLowerCase() === tag)) {
        score += Math.min(18, w);
      }
    }
    if (play.intensities.length) {
      const avg =
        play.intensities.reduce((a, b) => a + b, 0) / play.intensities.length;
      score += Math.max(0, 8 - Math.abs(preset.intensity - avg));
    }
    if (preset.id && play.lastPresetIds.includes(preset.id)) {
      score += 6; // slight boost for familiar
    }
  }

  if (preset.intensity >= 5 && preset.intensity <= 8) score += 2;

  return score;
}

/** Curated starter twelve — approachable first nights */
export const STARTER_PRESET_IDS = [
  "arab-princess-forbidden",
  "elevator-risk-pre",
  "switch-coin-pre",
  "threesome-bestie-pre",
  "blackmail-photo-pre",
  "humiliation-say-it",
  "bombshell-melts-for-you",
  "shy-masseuse-oil",
  "you-kneel-soft",
  "taboo-roommate-pre",
  "shy-barista-hearts",
  "office-after-dark",
] as const;

export function loadStarterDismissed(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STARTER_DISMISS) === "1";
}

export function dismissStarter() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STARTER_DISMISS, "1");
}

export const QUIZ_STEPS = [
  {
    id: "heat",
    question: "How hot do you usually want it?",
    options: [
      { id: "3", label: "Soft & steamy", desc: "Tease, tension, romance" },
      { id: "6", label: "Balanced heat", desc: "Builds, then delivers" },
      { id: "9", label: "Filthy & intense", desc: "Direct, explicit, edge" },
    ],
  },
  {
    id: "vibe",
    question: "What vibes pull you in? (pick up to 3)",
    multi: true,
    options: [
      { id: "soft", label: "Soft / cute", desc: "Shy, sweet, praise" },
      { id: "filth", label: "Pure filth", desc: "Explicit, shameless" },
      { id: "forbidden", label: "Forbidden", desc: "Taboo, secret, MILF" },
      { id: "dark", label: "Dark", desc: "Obsession, CNC fantasy" },
      { id: "fantasy", label: "Fantasy", desc: "Magic, monsters, gods" },
      { id: "power", label: "Power", desc: "Boss, uniform, control" },
    ],
  },
  {
    id: "pace",
    question: "Opening pace?",
    options: [
      { id: "slow", label: "Slow burn", desc: "Let it simmer" },
      { id: "medium", label: "Meet in the middle", desc: "Some setup, then heat" },
      { id: "fast", label: "Jump in", desc: "Less preamble" },
    ],
  },
] as const;
