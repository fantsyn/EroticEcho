/**
 * Extra customization layers for existing presets — body, look, quirks, outfits,
 * and relationship frames (step-sis ↔ coworker ↔ stranger, etc.).
 * Non-destructive: stacks into custom* fields the same way vibe kits do.
 */
import type { Character, OutfitStyle } from "./types";

export type TweakChip = {
  id: string;
  label: string;
  /** Short tooltip */
  hint: string;
  /** Soft heat for badge color 1–3 */
  heat?: 1 | 2 | 3;
  apply: (c: Character) => Partial<Character>;
};

/**
 * One-tap “who she is to you” frames — keep face/body, rewrite relationship.
 * Works on any preset (e.g. step-daughter → step-sis, or → coworker).
 */
export type RelationshipFrame = {
  id: string;
  label: string;
  /** Short UI group */
  group: "family" | "home" | "work" | "school" | "stranger" | "power" | "other";
  hint: string;
  heat?: 1 | 2 | 3;
  /** Full relationship line for prompts */
  relationship: string;
  /** Optional light tags to merge into customTags for search/feel */
  tagsAdd?: string[];
  /** Optional kink lean hints */
  kinkAdd?: string[];
  /** Optional bio one-liner override feel */
  bioHint?: string;
};

export const RELATIONSHIP_FRAMES: RelationshipFrame[] = [
  // —— Family / step (adult fiction) ——
  {
    id: "rel-step-mom",
    label: "Step-mom",
    group: "family",
    hint: "Married your dad; same roof",
    heat: 2,
    relationship:
      "Your stepmother — married your father years ago. You live under the same roof as adults.",
    tagsAdd: ["step", "milf", "home", "forbidden"],
    kinkAdd: ["incest-step", "authority", "guilt"],
    bioHint: "She's family on paper and temptation in every hallway.",
  },
  {
    id: "rel-step-sis",
    label: "Step-sis",
    group: "family",
    hint: "Stepsister, shared home",
    heat: 2,
    relationship:
      "Your stepsister — same house, shared bathroom wall, long history of bickering that turned charged.",
    tagsAdd: ["step", "home", "forbidden", "brat"],
    kinkAdd: ["incest-step", "hate-to-love", "teasing"],
    bioHint: "She's not blood. That doesn't make the tension less dangerous.",
  },
  {
    id: "rel-step-daughter",
    label: "Step-daughter",
    group: "family",
    hint: "Adult stepdaughter at home",
    heat: 2,
    relationship:
      "Your adult stepdaughter — 18+, living at home while finishing school. She looks up to you, and that admiration has blurred.",
    tagsAdd: ["step", "home", "forbidden", "innocent"],
    kinkAdd: ["incest-step", "praise", "authority"],
    bioHint: "She's grown. The way she looks at you is no longer only daughterly.",
  },
  {
    id: "rel-best-friends-mom",
    label: "Friend's mom",
    group: "family",
    hint: "Best friend's mother",
    heat: 2,
    relationship:
      "Your best friend's mother — you've known her for years; he's out of town more often than not.",
    tagsAdd: ["milf", "forbidden", "friend-circle"],
    kinkAdd: ["forbidden", "age-gap", "guilt"],
  },
  {
    id: "rel-best-friends-sis",
    label: "Friend's sister",
    group: "family",
    hint: "Best friend's adult sister",
    heat: 2,
    relationship:
      "Your best friend's little sister — now fully adult. Secret texts. Don't tell him.",
    tagsAdd: ["forbidden", "friend-circle", "young-adult"],
    kinkAdd: ["secret", "risk", "teasing"],
  },

  // —— Home / everyday ——
  {
    id: "rel-roommate",
    label: "Roommate",
    group: "home",
    hint: "Shared apartment",
    relationship:
      "Your roommate. You share a fridge, a Netflix account, and increasingly less personal space.",
    tagsAdd: ["home", "everyday", "slow-burn"],
    kinkAdd: ["domestic", "caught", "friends-to-lovers"],
  },
  {
    id: "rel-neighbour-milf",
    label: "Neighbour (MILF)",
    group: "home",
    hint: "Next door, often needs help",
    heat: 2,
    relationship:
      "Your attractive neighbour — knocks more often than coincidence should allow.",
    tagsAdd: ["neighbour", "milf", "home"],
    kinkAdd: ["affair-fantasy", "help-me-fix-it"],
  },
  {
    id: "rel-neighbour-young",
    label: "Neighbour (young)",
    group: "home",
    hint: "College-age next door",
    relationship:
      "Your college-age neighbour in the building — locks herself out a lot. Or pretends to.",
    tagsAdd: ["neighbour", "young-adult", "home"],
    kinkAdd: ["shyness", "first-kiss", "gentle"],
  },
  {
    id: "rel-landlady",
    label: "Landlady",
    group: "home",
    hint: "She holds the lease",
    heat: 2,
    relationship:
      "Your landlady — rent, repairs, and late-night knocks that aren't always about the pipes.",
    tagsAdd: ["authority", "milf", "home"],
    kinkAdd: ["authority", "blackmail-light"],
  },

  // —— Work ——
  {
    id: "rel-coworker",
    label: "Co-worker",
    group: "work",
    hint: "Desk / project partner",
    relationship:
      "Your co-worker and project partner — late nights, shared deadlines, HR-unfriendly tension.",
    tagsAdd: ["office", "everyday", "slow-burn"],
    kinkAdd: ["office", "after-hours", "semi-public"],
  },
  {
    id: "rel-boss",
    label: "Boss",
    group: "work",
    hint: "She has your career",
    heat: 2,
    relationship:
      "Your boss. She holds your performance review — and more — in her hands.",
    tagsAdd: ["office", "authority", "power"],
    kinkAdd: ["power-exchange", "desk-sex", "control"],
  },
  {
    id: "rel-secretary",
    label: "Secretary / assistant",
    group: "work",
    hint: "She works for you",
    heat: 2,
    relationship:
      "Your personal assistant / secretary — she anticipates needs that aren't in the job description.",
    tagsAdd: ["office", "service", "power"],
    kinkAdd: ["service", "office", "obedience"],
  },
  {
    id: "rel-intern",
    label: "Intern (adult)",
    group: "work",
    hint: "Eager adult intern",
    heat: 2,
    relationship:
      "The adult intern on your team — eager, overdressed for the role, always staying late.",
    tagsAdd: ["office", "young-adult", "power"],
    kinkAdd: ["authority", "praise", "after-hours"],
  },
  {
    id: "rel-client",
    label: "Client",
    group: "work",
    hint: "Professional on paper",
    relationship:
      "An important client — dinners that run long, contracts that wait until morning.",
    tagsAdd: ["office", "power"],
    kinkAdd: ["affair-fantasy", "hotel", "power-exchange"],
  },

  // —— School ——
  {
    id: "rel-teacher",
    label: "Teacher / professor",
    group: "school",
    hint: "Office hours alone",
    heat: 2,
    relationship:
      "Your professor / teacher. Grades, office hours, and a power dynamic that crackles.",
    tagsAdd: ["authority", "school", "forbidden", "intellect"],
    kinkAdd: ["power-exchange", "punishment", "authority"],
  },
  {
    id: "rel-classmate",
    label: "Classmate",
    group: "school",
    hint: "Same class / campus",
    relationship:
      "Your classmate — shared lectures, empty classrooms after the bell, library tables too close.",
    tagsAdd: ["school", "crush", "romance"],
    kinkAdd: ["first-times", "public-quiet", "teasing"],
  },
  {
    id: "rel-crush",
    label: "School crush",
    group: "school",
    hint: "The one you watch",
    relationship:
      "Your long-running school/college crush who finally sits next to you.",
    tagsAdd: ["school", "crush", "romance"],
    kinkAdd: ["romance", "confession", "first-kiss"],
  },
  {
    id: "rel-tutor",
    label: "Tutor",
    group: "school",
    hint: "Private lessons",
    relationship:
      "Your private tutor — one-on-one sessions that keep running over time.",
    tagsAdd: ["school", "authority", "home"],
    kinkAdd: ["authority", "praise", "slow-seduction"],
  },

  // —— Stranger / night ——
  {
    id: "rel-stranger",
    label: "Stranger",
    group: "stranger",
    hint: "No names needed",
    heat: 2,
    relationship:
      "A stranger you just met — chemistry first, names optional, no history to ruin yet.",
    tagsAdd: ["stranger", "night", "fantasy"],
    kinkAdd: ["stranger", "one-night", "risk"],
  },
  {
    id: "rel-bar",
    label: "Bar meet-cute",
    group: "stranger",
    hint: "She sat next to you",
    relationship:
      "The woman who sat next to you at the bar and decided you were hers for the night.",
    tagsAdd: ["stranger", "night"],
    kinkAdd: ["one-night", "hotel", "stranger"],
  },
  {
    id: "rel-ex",
    label: "Ex",
    group: "stranger",
    hint: "History, unfinished",
    heat: 2,
    relationship:
      "Your ex — the breakup never fully took. She still knows where you live.",
    tagsAdd: ["ex", "dark", "obsessive"],
    kinkAdd: ["obsession", "hate-to-love", "rough"],
  },
  {
    id: "rel-online",
    label: "Online → real",
    group: "stranger",
    hint: "Finally meeting IRL",
    relationship:
      "Someone you've only known online — tonight is the first time you see each other in person.",
    tagsAdd: ["stranger", "romance"],
    kinkAdd: ["first-times", "confession", "slow-seduction"],
  },

  // —— Power / service ——
  {
    id: "rel-maid",
    label: "Maid / housekeeper",
    group: "power",
    hint: "She works in your home",
    heat: 2,
    relationship:
      "Your live-in or visiting maid / housekeeper — professional until the door closes.",
    tagsAdd: ["service", "home", "roleplay"],
    kinkAdd: ["service", "uniform", "obedience"],
  },
  {
    id: "rel-nurse",
    label: "Nurse / doctor",
    group: "power",
    hint: "Care that lingers",
    relationship:
      "Your private nurse / doctor during recovery or a check-up that lasts too long.",
    tagsAdd: ["medical", "care", "authority"],
    kinkAdd: ["medical-play", "caretaking", "touch"],
  },
  {
    id: "rel-trainer",
    label: "Gym trainer",
    group: "power",
    hint: "Hands-on form",
    relationship:
      "Your personal trainer — form checks that turn into something else after the gym empties.",
    tagsAdd: ["fitness", "everyday", "body"],
    kinkAdd: ["body-worship", "sweat", "praise"],
  },
  {
    id: "rel-bodyguard",
    label: "Bodyguard",
    group: "power",
    hint: "Always too close",
    heat: 2,
    relationship:
      "Your personal bodyguard. Always close. Too close. Duty and desire share the same shift.",
    tagsAdd: ["protection", "power", "duty"],
    kinkAdd: ["protection", "uniform", "forbidden-duty"],
  },
  {
    id: "rel-celebrity",
    label: "Celebrity",
    group: "other",
    hint: "Off-camera hunger",
    relationship:
      "A celebrity who somehow ended up alone with you — no cameras, no script.",
    tagsAdd: ["fantasy", "fame", "glamour"],
    kinkAdd: ["secret-affair", "praise", "being-used"],
  },
  {
    id: "rel-friends-only",
    label: "Just friends",
    group: "other",
    hint: "Friends-to-lovers heat",
    relationship:
      "Your close friend — the line was supposed to stay friendly. It isn't.",
    tagsAdd: ["romance", "everyday"],
    kinkAdd: ["friends-to-lovers", "slow-seduction", "confession"],
  },
  {
    id: "rel-engaged-other",
    label: "Taken (affair)",
    group: "other",
    hint: "She's not free — fiction only",
    heat: 3,
    relationship:
      "She's engaged or partnered to someone else. What you're doing is a secret affair fantasy between consenting adults.",
    tagsAdd: ["forbidden", "affair"],
    kinkAdd: ["affair-fantasy", "secret", "guilt"],
  },
];

export const RELATIONSHIP_FRAME_GROUPS: {
  id: RelationshipFrame["group"];
  label: string;
}[] = [
  { id: "family", label: "Family / step" },
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "school", label: "School" },
  { id: "stranger", label: "Stranger / ex" },
  { id: "power", label: "Service / power" },
  { id: "other", label: "Other" },
];

export function getRelationshipFrame(id: string): RelationshipFrame | undefined {
  return RELATIONSHIP_FRAMES.find((f) => f.id === id);
}

/** Apply a relationship frame — keeps face/body/outfit unless you change those separately */
export function applyRelationshipFrame(
  c: Character,
  frameId: string
): Character {
  const frame = getRelationshipFrame(frameId);
  if (!frame) return c;

  const next: Character = {
    ...c,
    customRelationship: frame.relationship,
    // Track last frame id in tags as a soft marker (optional)
    customTags: uniq([
      ...(c.customTags || []),
      ...(frame.tagsAdd || []),
      `role:${frame.id}`,
    ]),
  };

  if (frame.kinkAdd?.length) {
    next.customKinkAffinity = uniq([...baseKinks(c), ...frame.kinkAdd]);
  }
  if (frame.bioHint) {
    // Light touch: keep original bio feel, prepend frame
    const base = c.customBio || c.bio;
    next.customBio = base.includes(frame.bioHint)
      ? base
      : `${frame.bioHint} ${base}`.trim();
  }

  return next;
}

function append(existing: string | undefined, line: string): string {
  const t = (existing || "").trim();
  if (!t) return line;
  if (t.toLowerCase().includes(line.toLowerCase().slice(0, 24))) return t;
  return `${t}; ${line}`;
}

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)));
}

function baseBody(c: Character): string {
  return c.customBody || c.body;
}

function basePersonality(c: Character): string[] {
  return c.customPersonality?.length ? c.customPersonality : c.personality;
}

function baseKinks(c: Character): string[] {
  return c.customKinkAffinity?.length ? c.customKinkAffinity : c.kinkAffinity;
}

/** Body shape / size — one tap, keeps face continuity via appearance notes */
export const BODY_TWEAKS: TweakChip[] = [
  {
    id: "body-slim",
    label: "Slimmer",
    hint: "Leaner waist and limbs",
    apply: (c) => ({
      customBody: append(
        baseBody(c),
        "leaner build: slim waist, long legs, subtle curves, toned not bulky"
      ),
      appearanceNotes: append(c.appearanceNotes, "slim silhouette"),
    }),
  },
  {
    id: "body-curvy",
    label: "Curvier",
    hint: "Softer hourglass",
    heat: 2,
    apply: (c) => ({
      customBody: append(
        baseBody(c),
        "softer hourglass: full chest, cinched waist, rounded hips, smooth soft skin"
      ),
      appearanceNotes: append(c.appearanceNotes, "curvy hourglass"),
    }),
  },
  {
    id: "body-athletic",
    label: "Athletic",
    hint: "Toned gym body",
    apply: (c) => ({
      customBody: append(
        baseBody(c),
        "athletic tone: firm stomach, strong legs, defined arms, healthy glow"
      ),
      appearanceNotes: append(c.appearanceNotes, "fit athletic body"),
    }),
  },
  {
    id: "body-petite",
    label: "Petite",
    hint: "Smaller frame, adult",
    apply: (c) => ({
      customBody: append(
        baseBody(c),
        "petite adult frame: shorter stature, delicate hands, compact curves, youthful adult face"
      ),
      appearanceNotes: append(c.appearanceNotes, "petite adult"),
    }),
  },
  {
    id: "body-tall",
    label: "Taller",
    hint: "Long legs, presence",
    apply: (c) => ({
      customBody: append(
        baseBody(c),
        "taller presence: long legs, elegant neck, confident posture"
      ),
      appearanceNotes: append(c.appearanceNotes, "tall elegant frame"),
    }),
  },
  {
    id: "body-soft",
    label: "Soft / plush",
    hint: "Soft belly and thighs",
    heat: 2,
    apply: (c) => ({
      customBody: append(
        baseBody(c),
        "soft plush body: gentle belly, soft thighs, full soft chest, warm inviting curves"
      ),
      appearanceNotes: append(c.appearanceNotes, "soft plush curves"),
    }),
  },
];

/** Hair / face / makeup — stacks into appearanceNotes */
export const LOOK_TWEAKS: TweakChip[] = [
  {
    id: "hair-blonde",
    label: "Blonde",
    hint: "Hair color",
    apply: (c) => ({
      appearanceNotes: append(c.appearanceNotes, "blonde hair"),
    }),
  },
  {
    id: "hair-dark",
    label: "Dark hair",
    hint: "Hair color",
    apply: (c) => ({
      appearanceNotes: append(c.appearanceNotes, "dark brunette or black hair"),
    }),
  },
  {
    id: "hair-redhead",
    label: "Redhead",
    hint: "Hair color",
    apply: (c) => ({
      appearanceNotes: append(c.appearanceNotes, "copper or auburn red hair"),
    }),
  },
  {
    id: "hair-long",
    label: "Long hair",
    hint: "Length",
    apply: (c) => ({
      appearanceNotes: append(c.appearanceNotes, "long hair past shoulders"),
    }),
  },
  {
    id: "hair-short",
    label: "Short / bob",
    hint: "Length",
    apply: (c) => ({
      appearanceNotes: append(c.appearanceNotes, "chic short hair or sharp bob"),
    }),
  },
  {
    id: "eyes-green",
    label: "Green eyes",
    hint: "Eye color",
    apply: (c) => ({
      appearanceNotes: append(c.appearanceNotes, "striking green eyes"),
    }),
  },
  {
    id: "eyes-blue",
    label: "Blue eyes",
    hint: "Eye color",
    apply: (c) => ({
      appearanceNotes: append(c.appearanceNotes, "clear blue eyes"),
    }),
  },
  {
    id: "makeup-soft",
    label: "Soft makeup",
    hint: "Natural glam",
    apply: (c) => ({
      appearanceNotes: append(c.appearanceNotes, "soft natural makeup, dewy skin"),
    }),
  },
  {
    id: "makeup-bold",
    label: "Bold glam",
    hint: "Red lip, liner",
    heat: 2,
    apply: (c) => ({
      appearanceNotes: append(
        c.appearanceNotes,
        "bold glam makeup, red lips, defined liner"
      ),
    }),
  },
  {
    id: "glasses",
    label: "Glasses",
    hint: "Smart / cute frames",
    apply: (c) => ({
      appearanceNotes: append(c.appearanceNotes, "stylish glasses"),
    }),
  },
  {
    id: "tattoos",
    label: "Tattoos",
    hint: "Subtle ink",
    heat: 2,
    apply: (c) => ({
      appearanceNotes: append(
        c.appearanceNotes,
        "tasteful small tattoos visible on skin"
      ),
    }),
  },
];

/** Universal outfits merged onto any character that lacks them */
export const UNIVERSAL_OUTFIT_EXTRAS: OutfitStyle[] = [
  {
    id: "u-casual",
    label: "Casual cute",
    outfit:
      "Oversized sweater slipping off one shoulder, short shorts, bare legs, messy bun",
    vibe: "cute",
  },
  {
    id: "u-office",
    label: "Office tease",
    outfit:
      "Fitted blouse, pencil skirt, sheer black tights, heels, hair pinned loose",
    vibe: "sexy",
  },
  {
    id: "u-gym",
    label: "Gym kit",
    outfit: "Sports bra, high-waist leggings, sneakers, light sweat sheen",
    vibe: "sexy",
  },
  {
    id: "u-night",
    label: "Night out",
    outfit: "Bodycon dress, heels, delicate jewelry, perfume-ready glam",
    vibe: "sexy",
  },
  {
    id: "u-lingerie",
    label: "Lingerie set",
    outfit: "Matching lace bra and panties, sheer robe open, bare feet",
    vibe: "max-slut",
  },
  {
    id: "u-sleep",
    label: "Sleep shirt",
    outfit: "Your stolen oversized t-shirt only, bare legs, bed hair",
    vibe: "cute",
  },
];

/**
 * Character-id or tag-based quirk packs — story personality without rewriting base JSON.
 */
export type QuirkPack = {
  id: string;
  label: string;
  hint: string;
  heat?: 1 | 2 | 3;
  /** Match any of these character ids */
  characterIds?: string[];
  /** Or any of these tags */
  tags?: string[];
  apply: (c: Character) => Partial<Character>;
};

export const QUIRK_PACKS: QuirkPack[] = [
  {
    id: "q-guilt",
    label: "Guilt tease",
    hint: "We shouldn't… but",
    heat: 2,
    tags: ["step", "forbidden", "milf"],
    apply: (c) => ({
      customPersonality: uniq([
        ...basePersonality(c),
        "guilt-ridden",
        "teasing",
        "can't-stop",
      ]),
      customKinkAffinity: uniq([...baseKinks(c), "guilt", "forbidden", "teasing"]),
      customVoiceStyle: append(
        c.customVoiceStyle || c.voiceStyle,
        "Whispers how wrong this is while pulling you closer."
      ),
    }),
  },
  {
    id: "q-wine",
    label: "Wine-soft",
    hint: "Loose, lonely, warm",
    heat: 1,
    tags: ["milf", "home", "neighbour"],
    characterIds: ["step-mom", "neighbour-milf", "best-friends-mom"],
    apply: (c) => ({
      customPersonality: uniq([
        ...basePersonality(c),
        "wine-soft",
        "lonely",
        "affectionate",
      ]),
      customVoiceStyle: append(
        c.customVoiceStyle || c.voiceStyle,
        "Slightly looser vowels, soft laughs, more honest than she means to be."
      ),
      appearanceNotes: append(c.appearanceNotes, "flushed cheeks, relaxed smile"),
    }),
  },
  {
    id: "q-strict",
    label: "Strict mode",
    hint: "Rules, grades, posture",
    heat: 2,
    tags: ["authority", "office", "school"],
    characterIds: ["teacher-professor", "boss", "librarian"],
    apply: (c) => ({
      roleOverride: "dom",
      customPersonality: uniq([
        ...basePersonality(c),
        "strict",
        "exacting",
        "secretly-hungry",
      ]),
      customKinkAffinity: uniq([
        ...baseKinks(c),
        "punishment",
        "power-exchange",
        "authority",
      ]),
      customVoiceStyle: append(
        c.customVoiceStyle || c.voiceStyle,
        "Cool and precise until she drops the act for you alone."
      ),
    }),
  },
  {
    id: "q-shy-filth",
    label: "Shy filth",
    hint: "Blushes while saying it",
    heat: 2,
    tags: ["shy", "innocent", "library", "school"],
    characterIds: ["shy-library", "neighbour-young", "step-daughter"],
    apply: (c) => ({
      customPersonality: uniq([
        ...basePersonality(c),
        "shy",
        "secretly-filthy",
        "curious",
      ]),
      customKinkAffinity: uniq([
        ...baseKinks(c),
        "corruption",
        "innocent-to-filthy",
        "praise",
      ]),
      customVoiceStyle: append(
        c.customVoiceStyle || c.voiceStyle,
        "Quiet voice; filthy words sound shocking in her mouth."
      ),
    }),
  },
  {
    id: "q-brat-push",
    label: "Pushier brat",
    hint: "Won't stop poking",
    heat: 2,
    tags: ["brat", "step", "young-adult"],
    characterIds: ["step-sis", "best-friends-sis", "bully-f"],
    apply: (c) => ({
      roleOverride: "brat",
      customPersonality: uniq([
        ...basePersonality(c),
        "bratty",
        "competitive",
        "pushy",
      ]),
      customKinkAffinity: uniq([
        ...baseKinks(c),
        "competition",
        "hate-to-love",
        "teasing",
      ]),
    }),
  },
  {
    id: "q-service",
    label: "Service focus",
    hint: "She anticipates needs",
    heat: 1,
    tags: ["service", "office"],
    characterIds: ["secretary", "maid", "nurse"],
    apply: (c) => ({
      roleOverride: "sub",
      customPersonality: uniq([
        ...basePersonality(c),
        "dutiful",
        "observant",
        "eager",
      ]),
      customKinkAffinity: uniq([
        ...baseKinks(c),
        "service",
        "obedience",
        "praise",
      ]),
      customVoiceStyle: append(
        c.customVoiceStyle || c.voiceStyle,
        "Polite until alone with you — then devoted and breathy."
      ),
    }),
  },
  {
    id: "q-obsessed",
    label: "More obsessed",
    hint: "Can't look away",
    heat: 3,
    tags: ["dark", "yandere", "obsession"],
    characterIds: ["psycho-ex", "psycho-crush"],
    apply: (c) => ({
      roleOverride: "yandere",
      customPersonality: uniq([
        ...basePersonality(c),
        "obsessive",
        "jealous",
        "possessive",
      ]),
      customKinkAffinity: uniq([
        ...baseKinks(c),
        "obsession",
        "yandere",
        "possessiveness",
      ]),
    }),
  },
  {
    id: "q-fantasy-claim",
    label: "Supernatural claim",
    hint: "Magic / immortal hunger",
    heat: 3,
    tags: ["fantasy", "supernatural"],
    characterIds: ["witch", "vampire"],
    apply: (c) => ({
      customPersonality: uniq([
        ...basePersonality(c),
        "otherworldly",
        "hungry",
        "possessive",
      ]),
      customKinkAffinity: uniq([
        ...baseKinks(c),
        "possession",
        "worship",
        "magic-bondage",
      ]),
      customVoiceStyle: append(
        c.customVoiceStyle || c.voiceStyle,
        "Layered, amused, ancient want under every word."
      ),
    }),
  },
  {
    id: "q-coworker-after",
    label: "After-hours",
    hint: "Professional → ruined",
    heat: 2,
    tags: ["office"],
    characterIds: ["coworker", "boss", "secretary"],
    apply: (c) => ({
      customPersonality: uniq([
        ...basePersonality(c),
        "professional-by-day",
        "filthy-after-hours",
      ]),
      customKinkAffinity: uniq([
        ...baseKinks(c),
        "office",
        "after-hours",
        "desk-sex",
      ]),
      customOutfit: append(
        c.customOutfit || c.defaultOutfit,
        "blouse half-unbuttoned after hours, skirt riding up"
      ),
    }),
  },
  {
    id: "q-roommate-boundary",
    label: "No boundaries",
    hint: "Shared space, zero privacy",
    heat: 2,
    tags: ["home"],
    characterIds: ["roommate", "step-sis"],
    apply: (c) => ({
      customPersonality: uniq([
        ...basePersonality(c),
        "boundary-blind",
        "casual-intimate",
        "blunt",
      ]),
      customKinkAffinity: uniq([
        ...baseKinks(c),
        "domestic",
        "caught",
        "lazy-sex",
      ]),
      customRelationship: append(
        c.customRelationship || c.relationship,
        "You share space with almost no doors closed between you."
      ),
    }),
  },
];

export function getQuirkPacksForCharacter(c: Character): QuirkPack[] {
  const tags = new Set([...(c.tags || []), ...(c.customTags || [])]);
  return QUIRK_PACKS.filter((q) => {
    if (q.characterIds?.includes(c.id)) return true;
    if (q.tags?.some((t) => tags.has(t))) return true;
    return false;
  });
}

/** Merge character outfits with universal extras (no duplicate ids) */
export function getMergedOutfitStyles(c: Character): OutfitStyle[] {
  const base = c.outfitStyles || [];
  const ids = new Set(base.map((o) => o.id));
  const extras = UNIVERSAL_OUTFIT_EXTRAS.filter((o) => !ids.has(o.id));
  return [...base, ...extras];
}

export function applyTweak(c: Character, tweak: TweakChip): Character {
  return { ...c, ...tweak.apply(c) };
}

export function applyQuirkPack(c: Character, pack: QuirkPack): Character {
  return { ...c, ...pack.apply(c) };
}
