/**
 * Typed loaders for modular JSON libraries.
 * To add content: edit the JSON files under src/data/ — no code changes required.
 */
import charactersData from "@/data/characters.json";
import scenariosData from "@/data/scenarios.json";
import kinksData from "@/data/kinks.json";
import type {
  Character,
  Scenario,
  Kink,
  HardNo,
  WritingStyle,
  StoryMode,
  DomSubRole,
  VibeKit,
} from "./types";
import { getMergedOutfitStyles } from "./character-tweaks";

export const characters: Character[] = charactersData.characters as Character[];
export const scenarios: Scenario[] = scenariosData.scenarios as Scenario[];
export const scenarioCategories: string[] = scenariosData.categories;
export const kinks: Kink[] = kinksData.kinks as Kink[];
export const hardNoPresets: HardNo[] = kinksData.hardNoPresets as HardNo[];
export const writingStyles: WritingStyle[] =
  kinksData.writingStyles as WritingStyle[];
export const storyModes: StoryMode[] = kinksData.storyModes as StoryMode[];
export const domSubRoles = kinksData.domSubRoles as {
  id: DomSubRole;
  label: string;
}[];

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

/** All unique tags across the library (for filter chips). */
export const characterTags: string[] = Array.from(
  new Set(characters.flatMap((c) => c.tags))
).sort();

/**
 * Search by name, alias, tags, bio, body, personality, relationship, voice.
 * Tag filters are AND (all selected tags must match).
 */
export function filterCharacters(query: string, tags: string[] = []): Character[] {
  const q = query.trim().toLowerCase();
  return characters.filter((c) => {
    const haystack = [
      c.name,
      c.bio,
      c.body,
      c.relationship,
      c.voiceStyle,
      c.defaultOutfit,
      c.ageRange,
      c.defaultRole,
      ...c.aliases,
      ...c.tags,
      ...c.personality,
      ...c.kinkAffinity,
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !q || haystack.includes(q) || q.split(/\s+/).every((w) => haystack.includes(w));
    const matchesTags =
      tags.length === 0 || tags.every((t) => c.tags.includes(t));
    return matchesQuery && matchesTags;
  });
}

export function filterScenarios(
  query: string,
  category?: string,
  tags: string[] = []
): Scenario[] {
  const q = query.trim().toLowerCase();
  return scenarios.filter((s) => {
    const matchesQuery =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.setup.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory = !category || category === "All" || s.category === category;
    const matchesTags =
      tags.length === 0 || tags.some((t) => s.tags.includes(t));
    return matchesQuery && matchesCategory && matchesTags;
  });
}

export function resolveRole(character: Character): Exclude<DomSubRole, "random"> {
  const role = character.roleOverride || character.defaultRole;
  // Normalize longer labels used in some JSON presets
  const normalized =
    role === "dominant"
      ? "dom"
      : role === "submissive"
        ? "sub"
        : role;
  if (normalized === "random") {
    const options: Exclude<DomSubRole, "random">[] = [
      "dom",
      "sub",
      "switch",
      "brat",
      "yandere",
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  return normalized as Exclude<DomSubRole, "random">;
}

/** Active outfit from style pack or custom override */
export function resolveOutfit(character: Character): string {
  if (character.customOutfit) return character.customOutfit;
  const styles = character.outfitStyles || [];
  if (character.selectedOutfitStyleId && styles.length) {
    const hit = styles.find((s) => s.id === character.selectedOutfitStyleId);
    if (hit?.outfit) return hit.outfit;
  }
  if (styles[0]?.outfit) return styles[0].outfit;
  return character.defaultOutfit;
}

/** Resolved fields used by prompts, cards, and TTS-facing copy. */
export function resolveCharacter(character: Character) {
  return {
    name: character.customName || character.name,
    body: character.customBody || character.body,
    outfit: resolveOutfit(character),
    personality: character.customPersonality?.length
      ? character.customPersonality
      : character.personality,
    relationship: character.customRelationship || character.relationship,
    bio: character.customBio || character.bio,
    voiceStyle: character.customVoiceStyle || character.voiceStyle,
    ageRange: character.customAgeRange || character.ageRange,
    kinkAffinity: character.customKinkAffinity?.length
      ? character.customKinkAffinity
      : character.kinkAffinity,
    tags: character.customTags?.length
      ? Array.from(new Set([...character.tags, ...character.customTags]))
      : character.tags,
    role: resolveRole(character),
    avatarVibe: character.avatarVibe,
    selectedOutfitStyleId: character.selectedOutfitStyleId,
  };
}

/** Apply an outfit style pack entry onto the character draft */
export function applyOutfitStyle(
  character: Character,
  styleId: string
): Character {
  const style = getMergedOutfitStyles(character).find((s) => s.id === styleId);
  if (!style) return character;
  return {
    ...character,
    selectedOutfitStyleId: style.id,
    customOutfit: style.outfit,
    avatarVibe: style.vibe || character.avatarVibe,
  };
}

/**
 * One-tap "vibe kits" — merge into custom* fields so presets stay editable.
 * Apply again stacks additively on personality/kinks.
 */
export const vibeKits: VibeKit[] = [
  {
    id: "more-slutty",
    label: "More slutty",
    description: "Louder, filthier, dresses like she wants it.",
    heat: 2,
    personalityAdd: ["slutty", "shameless", "eager", "filthy-mouthed"],
    kinkAdd: ["pure-filth", "teasing", "exhibition", "oral"],
    outfitHint:
      "Micro skirt, no panties, deep-plunge top, heels — clothes that beg to be ruined",
    appearanceHint: "smudged lipstick, bedroom eyes, always slightly disheveled",
    voiceHint: "Filthy, breathy, says exactly what she wants with zero shame.",
  },
  {
    id: "pure-dom",
    label: "Pure Dom",
    description: "She leads. You obey.",
    heat: 2,
    role: "dom",
    personalityAdd: ["commanding", "ruthless", "possessive", "controlled"],
    kinkAdd: ["power-exchange", "control", "punishment", "ownership"],
    voiceHint: "Low, precise, every sentence an order wrapped as a gift.",
    bioHint: "She doesn't ask. She decides — and makes you grateful.",
  },
  {
    id: "pure-sub",
    label: "Pure Sub",
    description: "Eager, yielding, praise-hungry.",
    heat: 1,
    role: "sub",
    personalityAdd: ["eager-to-please", "obedient", "needy", "soft"],
    kinkAdd: ["praise", "service", "gentle-dom", "being-used"],
    voiceHint: "Soft, breathy, asks permission even when she's already wet.",
  },
  {
    id: "free-use",
    label: "Free-use",
    description: "Available. Consenting. Always ready.",
    heat: 3,
    personalityAdd: ["free-use", "obedient", "shameless", "available"],
    kinkAdd: ["being-used", "pure-filth", "public-risk", "ownership", "free-use"],
    outfitHint:
      "Easy-access clothes, short skirt, nothing underneath, free-use collar optional",
    relationshipHint:
      "She agreed to free-use rules with you — anytime, almost anywhere, safeword respected.",
    bioHint:
      "She wants to be used like she belongs on your schedule, not hers.",
    voiceHint: "Obedient, eager, thanks you for using her.",
  },
  {
    id: "corrupt-her",
    label: "Corrupt her",
    description: "Innocent → filthy arc.",
    heat: 2,
    personalityAdd: ["curious", "corruptible", "nervous", "secretly-desperate"],
    kinkAdd: ["corruption", "innocent-to-filthy", "first-times", "praise"],
    appearanceHint: "still tries to look proper while her eyes go dark",
    bioHint: "She started sweet. You're teaching her how to be ruined.",
    voiceHint: "Hesitant at first, then shocked by the filth leaving her own mouth.",
  },
  {
    id: "brat-mode",
    label: "Brat mode",
    description: "Pushes buttons until you break her.",
    heat: 2,
    role: "brat",
    personalityAdd: ["bratty", "defiant", "teasing", "pushy"],
    kinkAdd: ["competition", "punishment", "hate-to-love", "rough"],
    voiceHint: "Sarcastic, challenging, melts the second you prove you can handle her.",
  },
  {
    id: "yandere-mode",
    label: "Yandere",
    description: "Obsessive devotion. Sweet to scary.",
    heat: 3,
    role: "yandere",
    personalityAdd: ["obsessive", "sweet", "jealous", "unhinged-devoted"],
    kinkAdd: ["yandere", "obsession", "possessiveness", "stalking-fantasy"],
    relationshipHint: "She decided you belong to her. Leaving is not on the menu.",
    voiceHint: "Honey-sweet until someone else looks at you — then knife-edge soft.",
  },
  {
    id: "public-risk",
    label: "Public risk",
    description: "Almost caught is the point.",
    heat: 2,
    personalityAdd: ["reckless", "exhibitionist", "thrill-seeking", "quiet-filthy"],
    kinkAdd: ["exhibition", "public-risk", "semi-public", "caught"],
    outfitHint: "Looks respectable from afar; ruinable up close",
    voiceHint: "Whispers filth while people walk past a few feet away.",
  },
  {
    id: "breeding",
    label: "Breeding kink",
    description: "Heat, claim, creampie focus (adult fantasy).",
    heat: 3,
    personalityAdd: ["fertile-heat", "needy", "claim-hungry", "raw"],
    kinkAdd: ["breeding-fantasy", "creampie", "ownership", "pure-filth"],
    appearanceHint: "flushed skin, soft belly focus optional, desperate eyes",
    voiceHint: "Begs to be filled and kept full — raw, filthy, needy.",
  },
  {
    id: "dark-cnc",
    label: "Dark CNC",
    description: "Scary-hot, safeword always real.",
    heat: 3,
    role: "dom",
    personalityAdd: ["predatory", "merciless", "intense", "controlling"],
    kinkAdd: ["CNC", "dubcon", "blackmail-light", "control"],
    voiceHint:
      "Calm threats, soft cruelty. Safeword is sacred; everything else is a game.",
    bioHint: "She likes when you struggle — because you both chose the game.",
  },
  {
    id: "soft-romance",
    label: "Soft romance",
    description: "Tender, emotional, still steamy.",
    heat: 1,
    role: "switch",
    personalityAdd: ["tender", "romantic", "attentive", "warm"],
    kinkAdd: ["romance", "kissing", "aftercare", "slow-seduction"],
    voiceHint: "Warm, intimate, says your name like a promise.",
    outfitHint: "Soft fabrics, easy access, more intimate than slutty",
  },
  {
    id: "mind-games",
    label: "Mind games",
    description: "Hypnosis / control / psychological heat.",
    heat: 3,
    personalityAdd: ["psychological", "manipulative", "soft-voiced", "dangerous"],
    kinkAdd: ["hypnosis", "mind-control", "control", "possession"],
    voiceHint: "Slow, rhythmic, every word a hook in your head.",
    bioHint: "She doesn't need ropes when her voice works better.",
  },
  {
    id: "girl-next-door",
    label: "Girl next door",
    description: "Approachable, warm, still hot.",
    heat: 1,
    role: "switch",
    personalityAdd: ["warm", "approachable", "playful", "sincere"],
    kinkAdd: ["romance", "teasing", "first-kiss", "slow-seduction"],
    outfitHint: "Cute casual: soft top, jeans or sundress, light makeup",
    voiceHint: "Easy smile in her voice; flirty without trying too hard.",
  },
  {
    id: "ice-queen",
    label: "Ice queen",
    description: "Cold exterior, molten underneath.",
    heat: 2,
    role: "dom",
    personalityAdd: ["aloof", "precise", "controlled", "secretly-intense"],
    kinkAdd: ["power-exchange", "teasing", "control", "praise"],
    voiceHint: "Cool and clipped — heat only when she decides you've earned it.",
    appearanceHint: "immaculate hair, sharp makeup, unreadable eyes",
  },
  {
    id: "pillow-princess",
    label: "Pillow princess",
    description: "She receives; you worship.",
    heat: 2,
    role: "sub",
    personalityAdd: ["receptive", "lazy-sensual", "demanding-soft", "spoiled"],
    kinkAdd: ["body-worship", "oral", "praise", "service"],
    voiceHint: "Soft orders: right there, slower, good — she barely moves.",
  },
  {
    id: "switch-fluid",
    label: "Fluid switch",
    description: "Leads then melts mid-scene.",
    heat: 2,
    role: "switch",
    personalityAdd: ["fluid", "playful", "adaptive", "curious"],
    kinkAdd: ["switch", "power-exchange", "teasing"],
    voiceHint: "She flips mid-sentence — orders one moment, whimpers the next.",
  },
];

export function getVibeKit(id: string): VibeKit | undefined {
  return vibeKits.find((k) => k.id === id);
}

/** Merge a vibe kit into character custom* fields (non-destructive to base JSON). */
export function applyVibeKit(character: Character, kitId: string): Character {
  const kit = getVibeKit(kitId);
  if (!kit) return character;

  const personalityBase =
    character.customPersonality?.length
      ? character.customPersonality
      : character.personality;
  const kinkBase =
    character.customKinkAffinity?.length
      ? character.customKinkAffinity
      : character.kinkAffinity;

  const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

  const next: Character = {
    ...character,
    vibeKitId: kit.id,
    customPersonality: uniq([
      ...personalityBase,
      ...(kit.personalityAdd || []),
    ]),
    customKinkAffinity: uniq([...kinkBase, ...(kit.kinkAdd || [])]),
  };

  if (kit.role) next.roleOverride = kit.role;
  if (kit.outfitHint) {
    next.customOutfit = character.customOutfit
      ? `${character.customOutfit}; ${kit.outfitHint}`
      : kit.outfitHint;
  }
  if (kit.appearanceHint) {
    next.appearanceNotes = character.appearanceNotes
      ? `${character.appearanceNotes}; ${kit.appearanceHint}`
      : kit.appearanceHint;
  }
  if (kit.relationshipHint) {
    next.customRelationship = kit.relationshipHint;
  }
  if (kit.bioHint) {
    next.customBio = kit.bioHint;
  }
  if (kit.voiceHint) {
    next.customVoiceStyle = kit.voiceHint;
  }

  return next;
}

/** Intelligent randomize: pick character + fitting scenario + role */
export function randomizeSetup(): {
  character: Character;
  scenario: Scenario;
  role: DomSubRole;
} {
  const character = {
    ...characters[Math.floor(Math.random() * characters.length)],
  };
  const preferred = scenarios.filter((s) =>
    s.preferredCharacterIds.includes(character.id)
  );
  const pool = preferred.length > 0 ? preferred : scenarios;
  const scenario = pool[Math.floor(Math.random() * pool.length)];
  const roles: DomSubRole[] = ["dom", "sub", "switch", "brat", "yandere"];
  const role = roles[Math.floor(Math.random() * roles.length)];
  character.roleOverride = role;
  return { character, scenario, role };
}
