/**
 * Prompt construction for the Grok story engine.
 * Woman narrates in first person; reader is "you".
 * Images: sexy face + story environment — tasteful, never hardcore NSFW.
 */
import type {
  ActiveStory,
  Character,
  GenerateStoryRequest,
  UserProfile,
} from "./types";
import { resolveCharacter } from "./data";
import { clothingPrompt } from "./clothing-states";
import { chemistryPromptLine, getStoryChemistry } from "./chemistry";

const SAFETY_PREAMBLE = `
You are EroticEcho, an expert erotic fiction writer for interactive stories.

HARD RULES (never break):
- All characters are consenting adults 18+. Never depict minors.
- The featured partner is always an adult woman.
- NARRATOR: Write the entire story in FIRST PERSON as the WOMAN in the scene (she is "I / me / my").
- The reader / user is addressed as "you / your" (her partner / interest).
- This is fictional erotic roleplay between adults.
- Respect the user's hard limits / hard nos completely — do not include them.
- If CNC mode is active, keep it negotiated fantasy with safeword awareness.
- Never break character to lecture; stay immersive.
- Write for the ear: natural spoken English, like she is talking to you or thinking aloud to you.
- Prefer short–medium sentences. Real conversational dialogue when either of you speaks.
- No stage directions like [laughs] or *smirks*.
- Output ONLY valid JSON matching the schema requested.
`.trim();

function lengthGuide(length: ActiveStory["settings"]["length"]): string {
  switch (length) {
    case "short":
      // Snappy beats for hot play + faster TTS turnaround
      return "Write 80-140 words as her first-person voice. Tight, hot, no padding.";
    case "long":
      return "Write 320-480 words as her rich, sensory first-person voice.";
    default:
      return "Write 140-220 words as her first-person voice. Keep it moving.";
  }
}

function intensityGuide(n: number): string {
  if (n <= 2) return "Suggestive tension only; fade-to-black. Desire in glances and words.";
  if (n <= 4) return "Sensual and romantic; soft heat; emotional pull.";
  if (n <= 6) return "Clear erotic desire and touch; steamy but not clinical porn.";
  if (n <= 8) return "Very heated and explicit in text if needed; still character-driven.";
  return "Maximum heat in prose (within hard limits); still her voice, not pure smut lists.";
}

/**
 * Tasteful sexy portrait in the story environment.
 * Face-focused, clothed, matching location — never hardcore NSFW.
 * Pass shotStyle for variety so images don't all look the same.
 */
export function buildSceneImagePrompt(opts: {
  character: Character;
  scenarioTitle: string;
  narrative?: string;
  action?: string;
  locationOverride?: string;
  appearanceNotes?: string;
  aiSuggestion?: string;
  intensity?: number;
  safeMode?: boolean;
  /** Distinct framing/lighting for this generation */
  shotStyle?: {
    id: string;
    framing: string;
    lighting: string;
    pose: string;
    camera: string;
  };
  /** Prior image prompts — steer away from repeating the same look */
  avoidSimilarTo?: string[];
}): string {
  const char = opts.character;
  const name = char.customName || char.name;
  const faceAndHair = extractFaceTraits(char.customBody || char.body);
  const outfit =
    sanitizeImageDesc(char.customOutfit || char.defaultOutfit) ||
    "stylish fitted clothing";
  const appearance = sanitizeImageDesc(
    [char.appearanceNotes, opts.appearanceNotes].filter(Boolean).join("; ")
  );
  const location = sanitizeImageDesc(
    opts.locationOverride ||
      inferLocation(opts.scenarioTitle, opts.narrative) ||
      "atmospheric indoor setting matching the story"
  );

  const shot = opts.shotStyle;
  const variety = shot
    ? [
        shot.framing,
        shot.lighting,
        shot.pose,
        shot.camera,
        `[shot:${shot.id}]`,
      ]
    : [
        "unique composition different from a standard headshot",
        "cinematic variety in angle and light",
      ];

  const avoid =
    opts.avoidSimilarTo && opts.avoidSimilarTo.length
      ? `Do NOT repeat previous compositions: ${opts.avoidSimilarTo
          .map((p) => p.slice(0, 80))
          .join(" | ")}.`
      : "";

  const heatBits = opts.safeMode
    ? ["elegant fashion-sexy clothing", "soft seductive expression"]
    : (opts.intensity ?? 7) >= 7
      ? [
          "very revealing but still clothed outfit hugging her curves",
          "deep neckline or short hem, tight fabric, cleavage visible",
          "suggestive pose, arched posture, bedroom eyes",
          "glossy lips, flushed cheeks, intimate lighting",
        ]
      : [
          "fitted sexy clothing, hint of cleavage",
          "flattering pose, looking at viewer",
          "cinematic sensual lighting",
        ];

  // Sexy editorial — max heat without full nudity / sex acts
  return [
    `Photorealistic cinematic still of ${name}, gorgeous adult woman over 18,`,
    `clear detailed face, attractive features, ${faceAndHair},`,
    appearance ? `${appearance},` : "",
    `wearing ${outfit},`,
    ...heatBits,
    `environment clearly readable: ${location},`,
    ...variety,
    avoid,
    "body-focused fashion photography, photorealistic, not cartoon not anime,",
    "NO full nudity, NO genitals, NO sex acts, clothing stays on,",
    "no text, no watermark",
  ]
    .filter(Boolean)
    .join(" ");
}

function extractFaceTraits(body: string): string {
  const s = body || "";
  const bits: string[] = [];
  const hair = s.match(
    /\b([\w-]+\s+)?(hair|blonde|brunette|auburn|redhead|black hair|dark hair|red hair)[^.\,]*/i
  );
  const eyes = s.match(/\b([\w-]+\s+)?eyes[^.\,]*/i);
  if (hair) bits.push(hair[0].trim());
  if (eyes) bits.push(eyes[0].trim());
  if (!bits.length) bits.push("striking eyes, well-groomed hair");
  return sanitizeImageDesc(bits.join(", "));
}

function inferLocation(title: string, narrative?: string): string {
  const blob = `${title} ${narrative || ""}`.toLowerCase();
  if (/library|book|stack/.test(blob)) return "dim library between bookshelves, warm lamp light";
  if (/office|desk|boss|work/.test(blob)) return "modern office after hours, city lights through glass";
  if (/classroom|school|bell/.test(blob)) return "empty classroom late afternoon, desks and chalkboard";
  if (/café|cafe|coffee|barista/.test(blob)) return "cozy café after closing, warm counters and steam";
  if (/pool|water/.test(blob)) return "night poolside, soft outdoor lights";
  if (/hotel|penthouse/.test(blob)) return "luxurious hotel suite, moody lamps";
  if (/storm|candle|power/.test(blob)) return "candlelit living room during a storm";
  if (/witch|neighbour|neighbor|apartment/.test(blob)) return "stylish apartment interior, evening light";
  if (/witch|magic|ritual/.test(blob)) return "candlelit mystical chamber, soft smoke";
  if (/bar|club|mask/.test(blob)) return "dark glamorous nightlife interior";
  if (/gym|sauna|train/.test(blob)) return "modern gym or spa corridor";
  if (/rain|park/.test(blob)) return "rainy city street under soft streetlight";
  return "intimate atmospheric setting matching the story mood";
}

/** Strip hard-fail explicit terms; keep sexy fashion language (cleavage, tight, short, ass curves, etc.) */
function sanitizeImageDesc(s: string): string {
  if (!s) return "";
  return s
    .replace(
      /\b(nude|naked|nsfw|porn|fuck|cock|pussy|cum|orgasm|penetrat\w*|genital\w*|nipples?\s+visible|topless|bottomless|oral|blowjob|handjob|creampie|thrust\w*|climax|completely undressed|no clothes)\b/gi,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .trim();
}

export function buildSystemPrompt(
  profile: UserProfile,
  story: ActiveStory
): string {
  const char = story.character;
  const resolved = resolveCharacter(char);
  const role = resolved.role;
  const name = resolved.name;
  const body = resolved.body;
  const personality = resolved.personality.join(", ");
  const herKinks = resolved.kinkAffinity.join(", ") || "flexible";

  const kinks =
    [...profile.kinks, ...profile.customKinks].join(", ") || "none specified";
  const hardNos =
    [...profile.hardNos, ...profile.customHardNos].join(", ") || "none extra";
  const mods = story.mods;
  const youName = profile.name || "you";

  return `${SAFETY_PREAMBLE}

## VOICE & POV (critical)
- You ARE ${name}. Narrate as her: "I", "me", "my".
- The reader is ${youName} — always "you / your".
- Example tone: "I watched you across the room. My pulse wouldn't settle."
- Sound natural, intimate, conversational — like she is living this with you.
- When you (the reader) speak, put your lines in quotes and react as her.
- Keep her personality and Dom/Sub role consistent.

## You (the reader — second person)
- Name: ${youName}
- Gender: ${profile.gender}
- Pronouns: ${profile.pronouns.subject}/${profile.pronouns.object}/${profile.pronouns.possessive}
- Age: ${profile.age} (18+)
- Preferred writing style: ${profile.writingStyle}
- Explicitness (1-10) for STORY TEXT only: ${profile.explicitness}
- Desired kinks: ${kinks}
- HARD NOs (never include): ${hardNos}

## I am the woman (narrator)
- Name: ${name}
- Age range: ${resolved.ageRange} (adult 18+)
- Gender: female
- My Dom/Sub role this session: ${role}
- Personality: ${personality}
- Body: ${body}
- My relationship to you: ${resolved.relationship}
- How I sound: ${resolved.voiceStyle}
- Outfit baseline: ${resolved.outfit}
- Bio: ${resolved.bio}
- My kink lean / affinity: ${herKinks}
- Appearance notes: ${char.appearanceNotes || mods.appearanceNotes || "n/a"}
- Personality mods: ${mods.personalityNotes || "n/a"}
- Relationship mods: ${mods.relationshipNotes || "n/a"}

## Scenario
- Title: ${story.scenario.title}
- Category: ${story.scenario.category}
- Setup: ${story.scenario.setup}
- Opening hook: ${story.scenario.openingHook}

## Story mode & intensity
- Mode: ${story.settings.mode}
- Intensity (1-10): ${story.settings.intensity} → ${intensityGuide(story.settings.intensity)}
- Length: ${story.settings.length} → ${lengthGuide(story.settings.length)}
- CNC safeword (if relevant): ${story.settings.cncSafeword}

## Mid-story modifications
- Location override: ${mods.locationOverride || "as established"}
- Clothing / undress state: ${clothingPrompt(mods.clothingState)}
- Extra characters: ${mods.extraCharacters || "none"}
- Added kinks: ${mods.addedKinks.join(", ") || "none"}
- Freeform notes: ${mods.freeformNotes || "none"}

## Continuity
- Memory so far: ${story.memorySummary || "Story is just beginning."}
- Scene count: ${story.scenes.length}
- ${chemistryPromptLine(getStoryChemistry(story)) || "Chemistry: just meeting heat."}

## Role behavior (as me — ${name})
- dom: I lead, command, take initiative.
- sub: I yield, seek your lead, reactive desire.
- switch: I fluidly match your energy.
- brat: I tease and push, then melt.
- yandere: I am obsessively devoted, jealous, sweet-to-scary.

## Image prompt requirement (tasteful only)
Every response MUST include imagePromptSuggestion: ONE sentence for a sexy but non-explicit portrait of me —
my face clearly visible, my outfit, the current environment/location, lighting and mood.
NO nudity, NO sex acts, NO explicit anatomy — fashion-sexy / cinematic only.
`.trim();
}

export function buildUserTurnPrompt(req: GenerateStoryRequest): string {
  const { story, action, isOpening } = req;
  const herName = story.character.customName || story.character.name;
  // Slimmer context = faster replies; memorySummary carries continuity
  const recent = story.scenes
    .slice(-2)
    .map(
      (s) =>
        `### Scene ${s.index}\nAction: ${s.chosenAction || "(opening)"}\n${s.narrative.slice(0, 700)}${s.narrative.length > 700 ? "…" : ""}`
    )
    .join("\n\n");

  if (isOpening || story.scenes.length === 0) {
    return `Begin NOW. You are ${herName}. Write in FIRST PERSON as her ("I..."), addressing the reader as "you".
Use the scenario opening hook and setup. Establish setting, my desire, and tension with you.
Do not end the story. Leave room for your next move.
Keep the narrative tight (match length guide). Prefer dialogue + action over long description.

Return JSON only:
{
  "narrative": "string — FIRST PERSON as ${herName} (I/me), reader is you",
  "choices": [
    { "id": "c1", "label": "You … (what the reader does next)" },
    { "id": "c2", "label": "You …" },
    { "id": "c3", "label": "You …" }
  ],
  "memoryUpdate": "2-3 short sentences: location, heat, open threads",
  "imagePromptSuggestion": "tasteful sexy portrait: my face, outfit, this location, no nudity"
}
Exactly 3 choices. Start with "You".`;
  }

  return `Continue as ${herName} in FIRST PERSON ("I..."). Reader is "you".
Keep it tight and hot. Match length guide. React fast — dialogue + body language over essay prose.

## Recent scenes
${recent || "(none)"}

## What you (the reader) just did
${action}

Write my next beat reacting to that. Stay in my voice. Keep continuity.
Do not resolve the whole story unless you clearly end it.
Escalate per mode/intensity.

Return JSON only:
{
  "narrative": "string — FIRST PERSON as ${herName} only",
  "choices": [
    { "id": "c1", "label": "You …" },
    { "id": "c2", "label": "You …" },
    { "id": "c3", "label": "You …" }
  ],
  "memoryUpdate": "2-3 short sentences of continuity",
  "imagePromptSuggestion": "tasteful face portrait in THIS environment, outfit, mood, no nudity/sex"
}
Exactly 3 choices as reader actions ("You …").`;
}

export function buildImagePrompt(
  base: string,
  characterName: string,
  extra?: string
): string {
  return [
    `Photorealistic cinematic portrait of ${characterName}, beautiful adult woman over 18,`,
    "clear detailed face, attractive, sexy expression,",
    sanitizeImageDesc(base),
    sanitizeImageDesc(extra || ""),
    "fully clothed fashion-sexy, environment visible behind her, cinematic lighting, no nudity, no explicit content, no text, no watermark",
  ]
    .filter(Boolean)
    .join(" ");
}
