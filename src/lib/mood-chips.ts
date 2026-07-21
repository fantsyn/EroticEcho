/**
 * Mid-story mood chips — one-tap inject tone into settings + mods.
 */
import type { ActiveStory, StoryModeId } from "./types";

export interface MoodChip {
  id: string;
  label: string;
  description: string;
  heat: 1 | 2 | 3;
  /** Apply returns partial story patch */
  apply: (story: ActiveStory) => Partial<ActiveStory>;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function appendNote(existing: string, line: string): string {
  const t = (existing || "").trim();
  if (!t) return line;
  if (t.includes(line)) return t;
  return `${t}\n${line}`;
}

function uniqKinks(story: ActiveStory, add: string[]): string[] {
  return Array.from(new Set([...(story.mods.addedKinks || []), ...add]));
}

export const MOOD_CHIPS: MoodChip[] = [
  {
    id: "softer",
    label: "Softer",
    description: "Dial heat down, more romance & aftercare",
    heat: 1,
    apply: (s) => ({
      settings: {
        ...s.settings,
        intensity: clamp(s.settings.intensity - 2, 1, 10),
        mode: "romance" as StoryModeId,
      },
      mods: {
        ...s.mods,
        personalityNotes: appendNote(
          s.mods.personalityNotes,
          "Tone: softer, tender, more affectionate; less rough."
        ),
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "Prefer romance, kissing, aftercare beats."
        ),
        addedKinks: uniqKinks(s, ["romance", "aftercare", "kissing", "gentle"]),
      },
    }),
  },
  {
    id: "filthier",
    label: "Filthier",
    description: "Push explicit language and acts",
    heat: 3,
    apply: (s) => ({
      settings: {
        ...s.settings,
        intensity: clamp(s.settings.intensity + 2, 1, 10),
        mode: "pure-filth" as StoryModeId,
      },
      mods: {
        ...s.mods,
        personalityNotes: appendNote(
          s.mods.personalityNotes,
          "Tone: shameless, filthy-mouthed, explicit desire."
        ),
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "Max explicit dirty talk and graphic heat (still respect hard nos)."
        ),
        addedKinks: uniqKinks(s, ["pure-filth", "oral", "degradation"]),
      },
    }),
  },
  {
    id: "free-use",
    label: "Free-use",
    description: "Available anytime energy this session",
    heat: 3,
    apply: (s) => ({
      settings: {
        ...s.settings,
        intensity: clamp(Math.max(s.settings.intensity, 8), 1, 10),
        mode: "free-use" as StoryModeId,
      },
      mods: {
        ...s.mods,
        relationshipNotes: appendNote(
          s.mods.relationshipNotes,
          "Free-use dynamic agreed this session — safeword still sacred."
        ),
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "She treats herself as available; green unless she says the safeword."
        ),
        addedKinks: uniqKinks(s, ["free-use", "being-used", "ownership"]),
      },
    }),
  },
  {
    id: "cnc-edge",
    label: "CNC edge",
    description: "Darker play with safeword awareness",
    heat: 3,
    apply: (s) => ({
      settings: {
        ...s.settings,
        intensity: clamp(Math.max(s.settings.intensity, 8), 1, 10),
        mode: "cnc" as StoryModeId,
      },
      mods: {
        ...s.mods,
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          `CNC fantasy tone. Safeword "${s.settings.cncSafeword || "red"}" ends play instantly.`
        ),
        personalityNotes: appendNote(
          s.mods.personalityNotes,
          "Predatory / struggle-play energy that stays negotiated fiction."
        ),
        addedKinks: uniqKinks(s, ["CNC", "dubcon", "control"]),
      },
    }),
  },
  {
    id: "breeding",
    label: "Breeding",
    description: "Heat, claim, creampie framing",
    heat: 3,
    apply: (s) => ({
      settings: {
        ...s.settings,
        intensity: clamp(Math.max(s.settings.intensity, 8), 1, 10),
        mode: "breeding" as StoryModeId,
      },
      mods: {
        ...s.mods,
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "Breeding-kink language: fill, claim, keep full (adult fantasy)."
        ),
        addedKinks: uniqKinks(s, [
          "breeding-fantasy",
          "creampie",
          "ownership",
        ]),
      },
    }),
  },
  {
    id: "public-risk",
    label: "Public risk",
    description: "Almost-caught thrills",
    heat: 2,
    apply: (s) => ({
      settings: {
        ...s.settings,
        intensity: clamp(s.settings.intensity + 1, 1, 10),
      },
      mods: {
        ...s.mods,
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "Emphasize risk of being overheard or seen; quiet filth."
        ),
        addedKinks: uniqKinks(s, ["public-risk", "exhibition", "semi-public"]),
      },
    }),
  },
  {
    id: "corrupt",
    label: "Corrupt her",
    description: "Innocent → filthy arc push",
    heat: 2,
    apply: (s) => ({
      settings: {
        ...s.settings,
        mode: "corruption" as StoryModeId,
        intensity: clamp(s.settings.intensity + 1, 1, 10),
      },
      mods: {
        ...s.mods,
        personalityNotes: appendNote(
          s.mods.personalityNotes,
          "She's being corrupted: shy → filthy language and boldness rising."
        ),
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "Corruption arc: teach her filth, praise when she says dirty things."
        ),
        addedKinks: uniqKinks(s, [
          "corruption",
          "innocent-to-filthy",
          "praise",
        ]),
      },
    }),
  },
  {
    id: "praise",
    label: "Praise",
    description: "Good-girl energy, soft dom",
    heat: 1,
    apply: (s) => ({
      mods: {
        ...s.mods,
        personalityNotes: appendNote(
          s.mods.personalityNotes,
          "She melts for praise; eager, soft, needy for approval."
        ),
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "Heavy praise kink, gentle-to-firm guidance."
        ),
        addedKinks: uniqKinks(s, ["praise", "gentle-dom", "service"]),
      },
    }),
  },
  {
    id: "meaner",
    label: "Meaner",
    description: "Brat / degradation / control",
    heat: 2,
    apply: (s) => ({
      settings: {
        ...s.settings,
        intensity: clamp(s.settings.intensity + 1, 1, 10),
      },
      mods: {
        ...s.mods,
        personalityNotes: appendNote(
          s.mods.personalityNotes,
          "Sharper tongue, meaner teasing, light degradation if allowed."
        ),
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "More brat/mean energy and control games."
        ),
        addedKinks: uniqKinks(s, ["degradation", "competition", "control"]),
      },
    }),
  },
  {
    id: "slow-burn",
    label: "Slow burn",
    description: "Stretch tension, delay payoff",
    heat: 1,
    apply: (s) => ({
      settings: {
        ...s.settings,
        mode: "slow-burn" as StoryModeId,
        intensity: clamp(s.settings.intensity - 1, 1, 10),
      },
      mods: {
        ...s.mods,
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "Slow-burn: prolong teasing, dialogue, almost-touches."
        ),
        addedKinks: uniqKinks(s, ["teasing", "slow-seduction"]),
      },
    }),
  },
  {
    id: "time-skip",
    label: "Time skip",
    description: "Jump hours later in the same night",
    heat: 1,
    apply: (s) => ({
      mods: {
        ...s.mods,
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "Next scene: time-skip several hours later same night; keep continuity."
        ),
      },
      memorySummary: appendNote(
        s.memorySummary,
        "Time skip pending: hours later, same arc."
      ),
    }),
  },
  {
    id: "aftercare",
    label: "Aftercare",
    description: "Cool down, soft close energy",
    heat: 1,
    apply: (s) => ({
      settings: {
        ...s.settings,
        intensity: clamp(s.settings.intensity - 3, 1, 6),
        mode: "romance" as StoryModeId,
      },
      mods: {
        ...s.mods,
        freeformNotes: appendNote(
          s.mods.freeformNotes,
          "Aftercare focus: water, blankets, soft praise, emotional check-in."
        ),
        addedKinks: uniqKinks(s, ["aftercare", "caretaking", "romance"]),
      },
    }),
  },
];

export function getMoodChip(id: string): MoodChip | undefined {
  return MOOD_CHIPS.find((m) => m.id === id);
}
