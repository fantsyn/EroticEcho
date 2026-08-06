/**
 * Lightweight relationship chemistry — drives a thin UI bar + prompt memory.
 * Keeps the screen clean: one combined heat score, optional detail on demand.
 */
import type { ActiveStory } from "./types";
import { tagChoice } from "./choice-tags";

export type Chemistry = {
  /** Physical / erotic pull 0–100 */
  desire: number;
  /** Emotional closeness / trust 0–100 */
  bond: number;
  /** Tension / unfinished charge 0–100 */
  tension: number;
};

export const defaultChemistry = (): Chemistry => ({
  desire: 35,
  bond: 30,
  tension: 40,
});

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Single 0–100 score for a slim bar */
export function chemistryOverall(c: Chemistry): number {
  return clamp(c.desire * 0.45 + c.bond * 0.3 + c.tension * 0.25);
}

export function chemistryLabel(score: number): string {
  if (score < 25) return "Cool";
  if (score < 45) return "Warming";
  if (score < 65) return "Charged";
  if (score < 85) return "On fire";
  return "Electric";
}

/** Her vibe chip — one short word for the header */
export function herVibeFromChemistry(c: Chemistry): string {
  if (c.desire >= 75 && c.bond < 40) return "Hungry";
  if (c.bond >= 70 && c.desire >= 55) return "Melting";
  if (c.tension >= 70) return "Wired";
  if (c.bond >= 65) return "Soft";
  if (c.desire >= 60) return "Teasing";
  return "Curious";
}

/**
 * Update chemistry after a reader action (choice label / free text).
 */
export function evolveChemistry(
  prev: Chemistry | undefined,
  action: string,
  intensity: number
): Chemistry {
  const c = { ...(prev || defaultChemistry()) };
  const tag = tagChoice(action);
  const t = action.toLowerCase();
  const heat = intensity / 10;

  // Base drift toward intensity
  c.desire = clamp(c.desire + heat * 2);
  c.tension = clamp(c.tension + 1);

  if (tag?.id === "soft" || /\b(kiss|hold|comfort|aftercare|gentle|love)\b/.test(t)) {
    c.bond = clamp(c.bond + 8);
    c.desire = clamp(c.desire + 3);
    c.tension = clamp(c.tension - 4);
  } else if (tag?.id === "filth" || /\b(fuck|harder|use|filth|ruin)\b/.test(t)) {
    c.desire = clamp(c.desire + 10);
    c.tension = clamp(c.tension + 6);
    c.bond = clamp(c.bond + 1);
  } else if (tag?.id === "dark" || /\b(force|pin|cnc|threat|obsess)\b/.test(t)) {
    c.desire = clamp(c.desire + 7);
    c.tension = clamp(c.tension + 12);
    c.bond = clamp(c.bond - 2);
  } else if (tag?.id === "play" || /\b(tease|laugh|joke|dare)\b/.test(t)) {
    c.tension = clamp(c.tension + 5);
    c.bond = clamp(c.bond + 3);
    c.desire = clamp(c.desire + 4);
  } else if (tag?.id === "talk" || /\b(ask|wait|stop|listen|talk)\b/.test(t)) {
    c.bond = clamp(c.bond + 5);
    c.tension = clamp(c.tension - 3);
  } else {
    c.desire = clamp(c.desire + 4);
    c.bond = clamp(c.bond + 2);
  }

  return c;
}

/** One line for AI memory / freeform context */
export function chemistryPromptLine(c: Chemistry | undefined): string {
  if (!c) return "";
  const overall = chemistryOverall(c);
  return `Chemistry now: desire ${c.desire}/100, bond ${c.bond}/100, tension ${c.tension}/100 (${chemistryLabel(overall)} / she feels ${herVibeFromChemistry(c)}). Reflect this in her first-person tone.`;
}

export function getStoryChemistry(story: ActiveStory): Chemistry {
  return story.chemistry || defaultChemistry();
}
