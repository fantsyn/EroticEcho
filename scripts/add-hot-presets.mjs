import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const scenPath = path.join(root, "src/data/scenarios.json");
const prePath = path.join(root, "src/data/presets.json");
const kinksPath = path.join(root, "src/data/kinks.json");

const s = JSON.parse(fs.readFileSync(scenPath, "utf8"));
const p = JSON.parse(fs.readFileSync(prePath, "utf8"));
const k = JSON.parse(fs.readFileSync(kinksPath, "utf8"));

const newScenarios = [
  {
    id: "peg-first-try",
    title: "She Bought a Harness",
    category: "Intense",
    tags: ["pegging", "role-reversal", "first-times", "domme"],
    intensityHint: 8,
    preferredCharacterIds: [
      "shy-library",
      "shy-bombshell",
      "coworker",
      "secretary",
      "roommate",
    ],
    setup: "She shows you the box. Hands shake. Voice does not. Tonight she wants to top you.",
    openingHook:
      'I set the black box on the bed between us. My cheeks burn, but I do not look away. "I practiced. On a pillow. Do not laugh."',
  },
  {
    id: "peg-shy-orders",
    title: "Soft Voice, Hard Rules",
    category: "Corruption",
    tags: ["pegging", "shy-to-dom", "praise", "power"],
    intensityHint: 8,
    preferredCharacterIds: [
      "shy-library",
      "shy-barista",
      "shy-masseuse",
      "neighbour-young",
    ],
    setup:
      "The shy one finally takes the lead — strap-on, careful orders, praise when you obey.",
    openingHook:
      'I fumble the straps twice before they click. When I look up, something new is in my eyes. "On your back. Please. I mean… do it."',
  },
  {
    id: "peg-boss-desk",
    title: "Performance Review (Peg)",
    category: "Office",
    tags: ["pegging", "office", "power", "desk"],
    intensityHint: 9,
    preferredCharacterIds: ["boss", "teacher-professor", "principal"],
    setup:
      "After-hours review. She locks the door. The harness is already under her skirt.",
    openingHook:
      'I perch on the edge of my desk, skirt riding up. "Sit. Hands where I can see them. This is still a review."',
  },
  {
    id: "watersports-shower",
    title: "Shower Permission",
    category: "Intense",
    tags: ["watersports", "humiliation", "domme", "consent"],
    intensityHint: 8,
    preferredCharacterIds: ["psycho-ex", "bully-f", "boss", "stranger-bar"],
    setup:
      "Negotiated watersports. Safeword active. She wants you on your knees in the shower.",
    openingHook:
      'Hot water hits my shoulders. I tip your chin up with two fingers. "Color? Green means you stay open. Red means everything stops."',
  },
  {
    id: "watersports-desperate",
    title: "Hold It (Desperation)",
    category: "Taboo+",
    tags: ["watersports", "desperation", "teasing", "control"],
    intensityHint: 7,
    preferredCharacterIds: ["step-sis", "roommate", "bully-f", "secretary"],
    setup:
      "She makes you hold it. Then she does not let you leave the room. Consensual desperation play.",
    openingHook:
      'I lock the bathroom door from the outside and lean against it, smiling. "Ask nicely. Beg if you have to. I like when your voice cracks."',
  },
  {
    id: "humiliation-mirror",
    title: "Mirror, Say It",
    category: "Intense",
    tags: ["humiliation", "degradation", "mirror", "domme"],
    intensityHint: 8,
    preferredCharacterIds: ["bully-f", "boss", "psycho-ex", "stripper"],
    setup:
      "She makes you watch yourself while you say the words she feeds you.",
    openingHook:
      'I turn your face to the mirror with my palm on your jaw. "Look. Now say what you are. Louder."',
  },
  {
    id: "humiliation-public-whisper",
    title: "Quiet Filth in Public",
    category: "Public",
    tags: ["humiliation", "public-risk", "whisper", "domme"],
    intensityHint: 7,
    preferredCharacterIds: [
      "coworker",
      "stranger-bar",
      "bully-f",
      "school-crush",
    ],
    setup:
      "Crowded space. Her mouth at your ear. Soft humiliation nobody else can hear.",
    openingHook:
      'I smile like we are a normal couple and lean in. My voice is sugar. The words are not. "If they knew what you let me call you…"',
  },
  {
    id: "shy-dom-library-risk",
    title: "Stacks After Closing — She Leads",
    category: "School",
    tags: ["shy-to-dom", "public-quiet", "library", "corruption"],
    intensityHint: 7,
    preferredCharacterIds: ["shy-library", "librarian"],
    setup:
      "Library closed. She used to blush at dirty books. Tonight she pins you between shelves.",
    openingHook:
      'I press a finger to my lips, then to yours. "Shhh. I am still shy about being heard. I am not shy about this." My knee slides between yours.',
  },
  {
    id: "shy-dom-classroom",
    title: "Empty Classroom, New Rules",
    category: "School",
    tags: ["shy-to-dom", "school", "authority-flip"],
    intensityHint: 7,
    preferredCharacterIds: ["shy-library", "school-crush", "shy-bombshell"],
    setup:
      "After the bell. She used to need notes. Now she needs you on the desk.",
    openingHook:
      'Chalk dust on my fingers. I lock the classroom door with a click that sounds too loud. "Sit on the desk. I practiced what I would say if I ever got brave."',
  },
  {
    id: "shy-dom-car",
    title: "Parking Lot Practice Domme",
    category: "Public",
    tags: ["shy-to-dom", "car", "risk", "first-times"],
    intensityHint: 7,
    preferredCharacterIds: [
      "shy-barista",
      "shy-bombshell",
      "neighbour-young",
    ],
    setup:
      "Dark parking lot. Engine off. She is trembling and giving orders anyway.",
    openingHook:
      'I kill the headlights and my voice still shakes. "Hands on the wheel. Do not touch me until I say. I want to try being in charge."',
  },
  {
    id: "taboo-stepsister-blackmail",
    title: "Screenshots (Step-Sis)",
    category: "Taboo+",
    tags: ["taboo", "blackmail", "step", "humiliation"],
    intensityHint: 8,
    preferredCharacterIds: ["step-sis", "best-friends-sis"],
    setup:
      "She has screenshots. The price is not money. Adult step-fiction only.",
    openingHook:
      'I flip my phone around. Your face. Your messages. My smile is sweet. "Here is how this works: you do what I say, or everyone sees."',
  },
  {
    id: "taboo-caught-stepmom",
    title: "Almost Caught By Dad",
    category: "Forbidden",
    tags: ["taboo", "almost-caught", "step", "risk"],
    intensityHint: 8,
    preferredCharacterIds: ["step-mom"],
    setup:
      "His keys in the lock. She does not stop. Quiet, frantic, taboo heat.",
    openingHook:
      'The front door rattle freezes us. I clamp a hand over your mouth, eyes wild. "Do not you dare make a sound — and do not you dare stop."',
  },
  {
    id: "freeuse-toilet-edge",
    title: "Occupied (Free-Use Edge)",
    category: "Free Use",
    tags: ["free-use", "humiliation", "risk", "watersports"],
    intensityHint: 8,
    preferredCharacterIds: ["secretary", "roommate", "maid"],
    setup:
      "Free-use house rules. The bathroom is not private. She uses the moment to edge and humiliate lightly.",
    openingHook:
      'I do not knock. The door is already open. "Rules are rules. Eyes on me. You can wait — or you can be useful."',
  },
  {
    id: "peg-aftercare-flip",
    title: "After She Tops",
    category: "Romance",
    tags: ["pegging", "aftercare", "switch", "soft"],
    intensityHint: 5,
    preferredCharacterIds: [
      "shy-library",
      "coworker",
      "roommate",
      "shy-bombshell",
    ],
    setup:
      "Post-pegging aftercare. She is soft again, checking in, still proud of herself.",
    openingHook:
      'I unbuckle with clumsy fingers and crawl into your lap, face buried in your neck. "Was that okay? I felt… powerful. Hold me."',
  },
];

const newPresets = [
  {
    id: "peg-shy-harness",
    title: "She Bought a Harness",
    tagline: "Shy hands. Hard rules. You on your back.",
    blurb:
      "Classic peg fantasy: nervous first-time top energy that turns commanding. Strap-on, praise, role reversal.",
    theme: "velvet-night",
    characterId: "shy-library",
    scenarioId: "peg-first-try",
    role: "dom",
    mode: "full-consent",
    intensity: 8,
    length: "short",
    tags: ["Pegging", "Shy→dom", "Filth"],
    coverGradient: "from-rose-950 via-violet-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "peg-shy-orders",
    title: "Soft Voice, Hard Rules",
    tagline: "Please becomes an order.",
    blurb:
      "Shy girl learns to top — careful, filthy, addicted to being obeyed.",
    theme: "candle-library",
    characterId: "shy-bombshell",
    scenarioId: "peg-shy-orders",
    role: "dom",
    mode: "corruption",
    intensity: 8,
    length: "short",
    tags: ["Pegging", "Corruption", "Shy→dom"],
    coverGradient: "from-amber-950 via-rose-950 to-ink-950",
    accent: "amber",
  },
  {
    id: "peg-boss-review",
    title: "Review With a Strap",
    tagline: "KPIs can wait. Kneel cannot.",
    blurb:
      "Office power pegging — locked door, desk, performance she actually cares about.",
    theme: "neon-noir",
    characterId: "boss",
    scenarioId: "peg-boss-desk",
    role: "dom",
    mode: "immediate",
    intensity: 9,
    length: "short",
    tags: ["Pegging", "Office", "Power"],
    coverGradient: "from-violet-950 via-ink-950 to-black",
    accent: "violet",
  },
  {
    id: "piss-shower-green",
    title: "Shower Permission",
    tagline: "Color check. Then open.",
    blurb:
      "Consensual watersports with clear safeword. Domme energy, shower steam, negotiation first.",
    theme: "blood-rose",
    characterId: "bully-f",
    scenarioId: "watersports-shower",
    role: "dom",
    mode: "cnc",
    intensity: 8,
    length: "short",
    tags: ["Watersports", "Humiliation", "CNC-aware"],
    coverGradient: "from-cyan-950 via-slate-900 to-ink-950",
    accent: "cyan",
  },
  {
    id: "piss-hold-it",
    title: "Hold It",
    tagline: "Beg with a full bladder.",
    blurb:
      "Desperation / watersports tease — she controls the bathroom key and your dignity.",
    theme: "neon-noir",
    characterId: "step-sis",
    scenarioId: "watersports-desperate",
    role: "brat",
    mode: "pure-filth",
    intensity: 7,
    length: "short",
    tags: ["Watersports", "Brat", "Taboo"],
    coverGradient: "from-yellow-950 via-stone-950 to-ink-950",
    accent: "amber",
  },
  {
    id: "humil-mirror",
    title: "Mirror, Say It",
    tagline: "Look at yourself. Louder.",
    blurb:
      "Face-to-mirror humiliation and degradation with a mean, sexy lead.",
    theme: "blood-rose",
    characterId: "psycho-ex",
    scenarioId: "humiliation-mirror",
    role: "dom",
    mode: "pure-filth",
    intensity: 8,
    length: "short",
    tags: ["Humiliation", "Dark", "Filth"],
    coverGradient: "from-red-950 via-black to-ink-950",
    accent: "red",
  },
  {
    id: "humil-public-ear",
    title: "Quiet Filth in Public",
    tagline: "Nobody else can hear what she calls you.",
    blurb: "Public-risk humiliation whispers — soft smile, ruined pride.",
    theme: "ember-cafe",
    characterId: "coworker",
    scenarioId: "humiliation-public-whisper",
    role: "dom",
    mode: "immediate",
    intensity: 7,
    length: "short",
    tags: ["Humiliation", "Public risk", "Office"],
    coverGradient: "from-stone-900 via-rose-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "shy-dom-stacks",
    title: "Stacks: She Leads",
    tagline: "Shy about noise. Not about you.",
    blurb: "Library after-hours shy-to-dom — quiet filth between shelves.",
    theme: "candle-library",
    characterId: "shy-library",
    scenarioId: "shy-dom-library-risk",
    role: "dom",
    mode: "corruption",
    intensity: 7,
    length: "short",
    tags: ["Shy→dom", "Public quiet", "School"],
    coverGradient: "from-amber-950 via-orange-950 to-ink-950",
    accent: "amber",
  },
  {
    id: "shy-dom-class",
    title: "Classroom Rules Rewrite",
    tagline: "She practiced being brave.",
    blurb: "Empty classroom, door locked, soft girl with hard new rules.",
    theme: "neon-noir",
    characterId: "shy-bombshell",
    scenarioId: "shy-dom-classroom",
    role: "dom",
    mode: "corruption",
    intensity: 7,
    length: "short",
    tags: ["Shy→dom", "School", "Risk"],
    coverGradient: "from-sky-950 via-violet-950 to-ink-950",
    accent: "sky",
  },
  {
    id: "shy-dom-car",
    title: "Parking Lot Domme",
    tagline: "Hands on the wheel. Voice shaking.",
    blurb: "Car risk + shy practice-domme — adrenaline and first-time orders.",
    theme: "sunset-glow",
    characterId: "shy-barista",
    scenarioId: "shy-dom-car",
    role: "dom",
    mode: "full-consent",
    intensity: 7,
    length: "short",
    tags: ["Shy→dom", "Public risk", "Car"],
    coverGradient: "from-orange-950 via-ink-950 to-black",
    accent: "orange",
  },
  {
    id: "taboo-sis-shots",
    title: "Screenshots",
    tagline: "Do what I say or everyone sees.",
    blurb: "Adult step-sis blackmail fantasy — leverage, humiliation, heat.",
    theme: "blood-rose",
    characterId: "step-sis",
    scenarioId: "taboo-stepsister-blackmail",
    role: "brat",
    mode: "blackmail",
    intensity: 8,
    length: "short",
    tags: ["Taboo", "Blackmail", "Humiliation"],
    coverGradient: "from-rose-950 via-red-950 to-black",
    accent: "rose",
  },
  {
    id: "taboo-mom-keys",
    title: "Keys in the Lock",
    tagline: "Quiet. Do not stop.",
    blurb: "Almost-caught step-mom taboo risk — pure adrenaline filth.",
    theme: "velvet-night",
    characterId: "step-mom",
    scenarioId: "taboo-caught-stepmom",
    role: "switch",
    mode: "pure-filth",
    intensity: 9,
    length: "short",
    tags: ["Taboo", "Almost caught", "MILF"],
    coverGradient: "from-rose-950 via-fuchsia-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "freeuse-bathroom",
    title: "Occupied",
    tagline: "Free-use house. No privacy.",
    blurb: "Free-use bathroom edge — available, humiliating, rule-bound.",
    theme: "neon-noir",
    characterId: "secretary",
    scenarioId: "freeuse-toilet-edge",
    role: "sub",
    mode: "free-use",
    intensity: 8,
    length: "short",
    tags: ["Free use", "Humiliation", "Office"],
    coverGradient: "from-slate-900 via-rose-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "peg-aftercare",
    title: "After She Tops",
    tagline: "Power hangover. Soft now.",
    blurb: "Pegging aftercare — she unbuckles, checks in, needs to be held.",
    theme: "ember-cafe",
    characterId: "shy-library",
    scenarioId: "peg-aftercare-flip",
    role: "switch",
    mode: "romance",
    intensity: 5,
    length: "short",
    tags: ["Pegging", "Aftercare", "Soft"],
    coverGradient: "from-stone-900 via-amber-950 to-ink-950",
    accent: "amber",
  },
];

const newKinks = [
  { id: "pegging", label: "Pegging / Strap-on", category: "act" },
  { id: "humiliation", label: "Humiliation", category: "power" },
  { id: "desperation", label: "Desperation Play", category: "edge" },
  { id: "role-reversal", label: "Role Reversal / She Tops", category: "dynamic" },
];

let addedS = 0;
let addedP = 0;
let addedK = 0;
for (const sc of newScenarios) {
  if (!s.scenarios.find((x) => x.id === sc.id)) {
    s.scenarios.push(sc);
    addedS++;
  }
}
for (const pr of newPresets) {
  if (!p.presets.find((x) => x.id === pr.id)) {
    p.presets.push(pr);
    addedP++;
  }
}
for (const kk of newKinks) {
  if (!k.kinks.find((x) => x.id === kk.id)) {
    k.kinks.push(kk);
    addedK++;
  }
}

// Ensure watersports is not only in hardNos — keep kink available
if (!k.kinks.find((x) => x.id === "watersports")) {
  k.kinks.push({
    id: "watersports",
    label: "Watersports / Piss play",
    category: "edge",
  });
  addedK++;
}

s.version = "1.6.0";
p.version = "1.6.0";
p.description =
  (p.description || "") +
  " Hot pack: pegging, watersports, humiliation, shy→dom risk, taboo.";

fs.writeFileSync(scenPath, JSON.stringify(s, null, 2) + "\n");
fs.writeFileSync(prePath, JSON.stringify(p, null, 2) + "\n");
fs.writeFileSync(kinksPath, JSON.stringify(k, null, 2) + "\n");
console.log(
  JSON.stringify({
    addedScenarios: addedS,
    addedPresets: addedP,
    addedKinks: addedK,
    totalScenarios: s.scenarios.length,
    totalPresets: p.presets.length,
  })
);
