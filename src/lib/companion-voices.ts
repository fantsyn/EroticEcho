/**
 * Grok narration voices — one natural default for conversation-like storytelling.
 * Extra voices kept for future use; the app always uses the default.
 */

export type VoiceAccent = "american" | "british" | "australian";

export interface CompanionVoice {
  id: string;
  voiceId: string;
  label: string;
  accent: VoiceAccent;
  vibe: string;
  /** Near 1.0 = natural conversation pace */
  speed: number;
  recommended?: boolean;
}

/** Single default: Eve — warm natural companion (conversation-ready) */
export const DEFAULT_COMPANION_ID = "eve-us";

export const COMPANION_VOICES: CompanionVoice[] = [
  {
    id: "eve-us",
    voiceId: "eve",
    label: "Eve",
    accent: "american",
    vibe: "Natural conversation · warm · unforced",
    // Slightly brisker = less wait, still natural
    speed: 1.02,
    recommended: true,
  },
  {
    id: "ara-uk",
    voiceId: "ara",
    label: "Ara",
    accent: "british",
    vibe: "Natural conversation · clear · warm",
    speed: 1.02,
  },
  {
    id: "luna-us",
    voiceId: "luna",
    label: "Luna",
    accent: "american",
    vibe: "Soft natural · easy listening",
    speed: 1.0,
  },
];

export function getCompanionById(id: string): CompanionVoice | undefined {
  return COMPANION_VOICES.find((v) => v.id === id);
}

export function defaultCompanionId(): string {
  return DEFAULT_COMPANION_ID;
}

/**
 * Light touch for natural conversational TTS.
 * Keeps punctuation pacing; avoids over-tagging that makes speech robotic.
 */
export function enhanceTextForNaturalTts(raw: string): string {
  let t = raw
    .replace(/\*+|_+/g, "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\r\n/g, "\n")
    .trim();

  // Paragraph breaks = natural breath between beats (like someone telling a story)
  t = t.replace(/\n{2,}/g, ". ");

  // Single newlines → space (continuous speech)
  t = t.replace(/\n/g, " ");

  // Collapse whitespace
  t = t.replace(/\s+/g, " ").trim();

  // Avoid double periods from join
  t = t.replace(/\.\s*\./g, ".");
  t = t.replace(/\s+([,.!?;:])/g, "$1");

  // Light conversational pause only before quoted speech (like a person starting dialogue)
  t = t.replace(
    /([.!?])\s*"/g,
    "$1 [pause] \""
  );

  // Soften very long run-ons: after "; " leave as-is (natural)
  if (t.length > 14000) t = t.slice(0, 14000);

  return t;
}

/** @deprecated use enhanceTextForNaturalTts */
export const enhanceTextForSexyTts = enhanceTextForNaturalTts;
