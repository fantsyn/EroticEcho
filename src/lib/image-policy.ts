/**
 * Sparse image generation: ~1 every 2–3 scenes, max 3 per story.
 * Each shot uses a different framing / lighting so images don't look identical.
 */
import type { ActiveStory } from "./types";

export const MAX_STORY_IMAGES = 3;
/** Generate on scene 1, then every 3 scenes (1, 4, 7…) → ~3 images in a long story */
export const IMAGE_EVERY_N_SCENES = 3;

export type ShotStyle = {
  id: string;
  framing: string;
  lighting: string;
  pose: string;
  camera: string;
};

/** Distinct looks — rotated so each generation feels different */
export const SHOT_STYLES: ShotStyle[] = [
  {
    id: "close-warm",
    framing: "tight close-up portrait emphasizing face and cleavage neckline",
    lighting: "warm golden key light, soft shadows, intimate bedroom glow",
    pose: "bedroom eyes at camera, lips slightly parted, hand near collarbone",
    camera: "85mm lens feel, creamy bokeh background",
  },
  {
    id: "medium-env",
    framing: "medium shot from hips up showing curves and outfit, environment visible",
    lighting: "mixed practical lights from the location, cinematic contrast",
    pose: "leaning forward slightly, weight on one hip, seductive stance",
    camera: "50mm documentary film still",
  },
  {
    id: "three-quarter",
    framing: "three-quarter view, over-the-shoulder composition emphasizing waist and hips",
    lighting: "cool rim light + soft fill, moody night palette",
    pose: "looking back over her shoulder, arched back, teasing glance",
    camera: "slightly low angle, dramatic depth",
  },
  {
    id: "profile-window",
    framing: "side profile near window, silhouette of figure and outfit",
    lighting: "strong side light, gentle silhouette edge",
    pose: "lips parted, chest lifted, contemplative but sexual energy",
    camera: "shallow focus, background architecture soft",
  },
  {
    id: "candid-wide",
    framing: "environmental portrait, full or three-quarter body in the room",
    lighting: "ambient location light only, realistic",
    pose: "caught mid-stretch or mid-turn, outfit riding short, natural sexy body language",
    camera: "35mm candid cinematic",
  },
  {
    id: "mirror-glam",
    framing: "beauty / boudoir shot with mirror, full glam body focus",
    lighting: "glamorous softbox feel, catchlights in eyes",
    pose: "direct eye contact, hand on hip or in hair, confident slutty calm",
    camera: "high-end fashion editorial",
  },
  {
    id: "low-angle-power",
    framing: "slightly low angle medium shot, legs and figure dominant",
    lighting: "moody key light from above, glossy skin highlights",
    pose: "standing tall, chin down at camera, one hand on thigh",
    camera: "35mm power portrait",
  },
];

/**
 * Whether to auto-generate an image for this new scene number (1-based count after add).
 */
export function shouldAutoGenerateImage(
  story: ActiveStory,
  _newSceneCount: number
): boolean {
  // Never auto-generate — images only when the user explicitly requests them.
  void story;
  void _newSceneCount;
  return false;
}

/** Pick a shot style that hasn't been used yet in this story's gallery prompts */
export function pickShotStyle(story: ActiveStory): ShotStyle {
  const used = new Set(
    (story.gallery || []).map((g) => {
      const m = g.prompt?.match(/\[shot:([^\]]+)\]/);
      return m?.[1] || "";
    })
  );
  const unused = SHOT_STYLES.filter((s) => !used.has(s.id));
  const pool = unused.length ? unused : SHOT_STYLES;
  // Prefer index matching gallery length for stable variety
  const idx = (story.gallery?.length ?? 0) % pool.length;
  return pool[idx];
}

/** Nearest image URL for a scene (own or previous scene's) */
export function resolveDisplayImage(
  scenes: ActiveStory["scenes"],
  viewIndex: number
): string | null {
  for (let i = viewIndex; i >= 0; i--) {
    if (scenes[i]?.imageUrl) return scenes[i].imageUrl || null;
  }
  return null;
}

export function imagesRemaining(story: ActiveStory): number {
  return Math.max(0, MAX_STORY_IMAGES - (story.gallery?.length ?? 0));
}
