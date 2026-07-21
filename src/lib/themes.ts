/**
 * Immersive visual themes — drive ambient backgrounds, accents, and play mood.
 */

export type ThemeId =
  | "velvet-night"
  | "neon-noir"
  | "candle-library"
  | "blood-rose"
  | "sunset-glow"
  | "arcane-smoke"
  | "ember-cafe"
  | "default";

export interface EchoTheme {
  id: ThemeId;
  label: string;
  /** CSS class applied to body/shell */
  className: string;
  glow: string;
  card: string;
  chip: string;
  prose: string;
  /** Soft ambient orbs */
  orbs: { color: string; position: string }[];
}

export const THEMES: Record<ThemeId, EchoTheme> = {
  default: {
    id: "default",
    label: "Velvet Default",
    className: "theme-default",
    glow: "from-echo-600/20 to-velvet-600/10",
    card: "border-white/10 bg-ink-900/60",
    chip: "border-echo-500/40 bg-echo-500/15 text-echo-100",
    prose: "text-ink-100",
    orbs: [
      { color: "bg-echo-600/25", position: "-top-24 left-1/3" },
      { color: "bg-velvet-600/20", position: "bottom-0 right-0" },
    ],
  },
  "velvet-night": {
    id: "velvet-night",
    label: "Velvet Night",
    className: "theme-velvet-night",
    glow: "from-rose-600/25 to-fuchsia-800/15",
    card: "border-rose-500/20 bg-rose-950/30",
    chip: "border-rose-400/40 bg-rose-500/15 text-rose-100",
    prose: "text-rose-50/95",
    orbs: [
      { color: "bg-rose-600/30", position: "-top-20 right-1/4" },
      { color: "bg-fuchsia-700/20", position: "bottom-10 left-0" },
    ],
  },
  "neon-noir": {
    id: "neon-noir",
    label: "Neon Noir",
    className: "theme-neon-noir",
    glow: "from-violet-500/25 to-cyan-600/10",
    card: "border-violet-500/25 bg-violet-950/35",
    chip: "border-violet-400/40 bg-violet-500/15 text-violet-100",
    prose: "text-violet-50/95",
    orbs: [
      { color: "bg-violet-600/30", position: "-top-16 left-10" },
      { color: "bg-cyan-500/15", position: "bottom-0 right-1/4" },
    ],
  },
  "candle-library": {
    id: "candle-library",
    label: "Candle Library",
    className: "theme-candle-library",
    glow: "from-amber-600/25 to-orange-900/15",
    card: "border-amber-500/20 bg-amber-950/25",
    chip: "border-amber-400/40 bg-amber-500/15 text-amber-100",
    prose: "text-amber-50/95",
    orbs: [
      { color: "bg-amber-500/25", position: "top-0 right-1/3" },
      { color: "bg-orange-800/20", position: "bottom-20 left-1/4" },
    ],
  },
  "blood-rose": {
    id: "blood-rose",
    label: "Blood Rose",
    className: "theme-blood-rose",
    glow: "from-red-600/30 to-rose-900/20",
    card: "border-red-500/25 bg-red-950/30",
    chip: "border-red-400/40 bg-red-500/15 text-red-100",
    prose: "text-red-50/95",
    orbs: [
      { color: "bg-red-600/35", position: "-top-10 left-1/2" },
      { color: "bg-rose-900/30", position: "bottom-0 right-0" },
    ],
  },
  "sunset-glow": {
    id: "sunset-glow",
    label: "Sunset Glow",
    className: "theme-sunset-glow",
    glow: "from-orange-500/25 to-pink-600/15",
    card: "border-orange-400/20 bg-orange-950/25",
    chip: "border-orange-400/40 bg-orange-500/15 text-orange-100",
    prose: "text-orange-50/95",
    orbs: [
      { color: "bg-orange-500/25", position: "-top-20 right-10" },
      { color: "bg-pink-600/20", position: "bottom-10 left-10" },
    ],
  },
  "arcane-smoke": {
    id: "arcane-smoke",
    label: "Arcane Smoke",
    className: "theme-arcane-smoke",
    glow: "from-emerald-500/25 to-teal-800/15",
    card: "border-emerald-500/20 bg-emerald-950/30",
    chip: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100",
    prose: "text-emerald-50/95",
    orbs: [
      { color: "bg-emerald-500/25", position: "top-10 left-1/4" },
      { color: "bg-teal-700/20", position: "bottom-0 right-1/3" },
    ],
  },
  "ember-cafe": {
    id: "ember-cafe",
    label: "Ember Café",
    className: "theme-ember-cafe",
    glow: "from-stone-500/20 to-amber-700/15",
    card: "border-stone-400/20 bg-stone-950/40",
    chip: "border-amber-500/30 bg-amber-900/30 text-amber-100",
    prose: "text-stone-100",
    orbs: [
      { color: "bg-amber-700/25", position: "-top-16 left-1/3" },
      { color: "bg-stone-600/20", position: "bottom-0 right-10" },
    ],
  },
};

/** Map scenario category → ambient theme */
export function themeFromCategory(category?: string): ThemeId {
  switch ((category || "").toLowerCase()) {
    case "forbidden":
    case "home":
      return "velvet-night";
    case "office":
    case "public":
    case "school":
      return "neon-noir";
    case "romance":
    case "everyday":
      return "ember-cafe";
    case "dark":
    case "intense":
      return "blood-rose";
    case "fantasy":
      return "arcane-smoke";
    default:
      return "default";
  }
}

export function getTheme(id?: string | null): EchoTheme {
  if (id && id in THEMES) return THEMES[id as ThemeId];
  return THEMES.default;
}
