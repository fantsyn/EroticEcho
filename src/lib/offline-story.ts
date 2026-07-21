/**
 * Offline story engine — woman narrates in first person; reader is "you".
 */
import type {
  ActiveStory,
  GenerateStoryResponse,
  StoryChoice,
  UserProfile,
} from "./types";
import { resolveCharacter } from "./data";
import { buildSceneImagePrompt } from "./prompts";

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function roleAsMe(role: string): string {
  switch (role) {
    case "dom":
      return "I don't ask. I decide. My voice stays calm while I take the lead with you.";
    case "sub":
      return "I wait for your cue, pulse high, lips parted — hoping you'll take the next step.";
    case "brat":
      return "I smirk like I've already won, daring you to put me in my place.";
    case "yandere":
      return "I smile sweet enough to rot teeth — and I never look away from you.";
    default:
      return "I shift between challenge and yield, testing the heat between us.";
  }
}

function intensityAsMe(n: number): string {
  if (n <= 3)
    return "I keep it in glances and almost-touches — charged, unfinished, and all for you.";
  if (n <= 6)
    return "I let the desire show: my hands, my breath, the way I lean into you.";
  if (n <= 8)
    return "I stop pretending to be polite about what I want from you.";
  return "I go raw and shameless — hungry, honest, the kind of night that ruins softer things.";
}

function buildChoices(intensity: number): StoryChoice[] {
  const soft = [
    { id: "c1", label: "You hold my gaze and step closer" },
    { id: "c2", label: "You tease me with words instead of touch" },
    { id: "c3", label: "You ask what I really want from you" },
    { id: "c4", label: "You pull back and make me come to you" },
    { id: "c5", label: "You lead me somewhere more private" },
  ];
  const hot = [
    { id: "c1", label: "You pin me and take control" },
    { id: "c2", label: "You drop to your knees for me" },
    { id: "c3", label: "You whisper something filthy and act on it" },
    { id: "c4", label: "You slow everything down and edge me" },
    { id: "c5", label: "You let me use you however I want" },
  ];
  return intensity >= 6 ? hot : soft;
}

export function generateOfflineScene(
  story: ActiveStory,
  profile: UserProfile,
  action: string,
  isOpening: boolean
): GenerateStoryResponse {
  const char = story.character;
  const resolved = resolveCharacter(char);
  const name = resolved.name;
  const role = resolved.role;
  const you = profile.name || "you";
  const seed = hash(
    story.id + action + String(story.scenes.length) + story.settings.mode
  );
  const loc =
    story.mods.locationOverride ||
    pick(
      [
        "the dim living room",
        "the quiet hallway",
        "a bedroom lit only by streetlight",
        "the kitchen, counter cool under my palms",
        "a locked office after hours",
      ],
      seed
    );

  let narrative: string;

  if (isOpening || story.scenes.length === 0) {
    narrative = `I am ${name}. ${story.scenario.openingHook}

I stand in ${loc}, pulse loud in my ears, and I can't stop watching you${you !== "you" ? `, ${you}` : ""}. ${roleAsMe(role)}

"${pick(
      [
        "Don't look at me like that unless you mean it.",
        "You've been thinking about this. I can tell.",
        "We shouldn't… which is why I already feel it.",
        "Say something. Or better — come here.",
        "I locked the door. Just so you know.",
      ],
      seed + 1
    )}"

${story.scenario.setup} The air between us thickens. ${intensityAsMe(story.settings.intensity)}

${
  story.settings.mode === "cnc"
    ? `(Under the heat, we both know the safeword is "${story.settings.cncSafeword}".)`
    : ""
}`;
  } else {
    narrative = `You ${action.replace(/^you\s+/i, "").replace(/^I\s+/i, "")}.

I react before I can hide it — ${pick(
      [
        "a sharp inhale, pupils wide",
        "a low laugh that isn't innocent",
        "my hands fisting in your clothes",
        "a step that erases the last safe distance",
        "something possessive flashing in my eyes",
      ],
      seed
    )}. ${roleAsMe(role)}

"${pick(
      [
        "God, yes — like that.",
        "You're going to regret teasing me.",
        "Is that all you've got?",
        "I've waited long enough.",
        "Look at me while you do it.",
        "Don't stop. Don't you dare stop.",
      ],
      seed + 3
    )}"

Here in ${loc}, I tighten around your choice. ${intensityAsMe(story.settings.intensity)}

${
  story.mods.freeformNotes
    ? `Something extra hangs between us: ${story.mods.freeformNotes}`
    : ""
}

When the moment breaks for breath, I'm still right here — waiting for what you'll do next.`;
  }

  const memoryUpdate = [
    `${name} narrates (I); reader is ${you}. Role ${role}. Scenario "${story.scenario.title}".`,
    `Mode ${story.settings.mode}, intensity ${story.settings.intensity}.`,
    `Latest reader action: ${isOpening ? "opening" : action}.`,
    `Location: ${loc}.`,
    story.memorySummary ? `Prior: ${story.memorySummary.slice(0, 180)}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imagePromptSuggestion = buildSceneImagePrompt({
    character: char,
    scenarioTitle: story.scenario.title,
    narrative,
    action: isOpening ? "opening scene" : action,
    locationOverride: story.mods.locationOverride || loc,
    appearanceNotes: story.mods.appearanceNotes,
    intensity: story.settings.intensity,
  });

  return {
    narrative: narrative.replace(/\n{3,}/g, "\n\n").trim(),
    choices: buildChoices(story.settings.intensity),
    memoryUpdate,
    imagePromptSuggestion,
    offline: true,
  };
}
