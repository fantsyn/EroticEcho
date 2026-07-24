/**
 * Creative pack: arab princess, taboo, threesome, switch, public risk,
 * humiliation, blackmail fantasy + more presets.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (r) => JSON.parse(readFileSync(path.join(root, r), "utf8"));
const save = (r, d) =>
  writeFileSync(path.join(root, r), JSON.stringify(d, null, 2) + "\n", "utf8");

function portraitLooks(filePrefix) {
  return [
    ["role", "On-role", "sexy"],
    ["sexy", "Sexy", "sexy"],
    ["almost", "Almost nude", "almost"],
    ["cute", "Cute soft", "cute"],
    ["shy", "Shy", "shy"],
    ["hot", "Hot glam", "hot"],
    ["erotic", "Erotic pose", "erotic"],
    ["slutty", "Danger slut", "slutty"],
  ].map(([id, label, vibe]) => ({
    id,
    label,
    file: `${filePrefix}-${id}.png`,
    vibe,
  }));
}

function outfitStyles(defaultOutfit) {
  return [
    { id: "default", label: "Default", outfit: defaultOutfit, vibe: "sexy" },
    {
      id: "cute",
      label: "Cute / soft",
      outfit: "Soft pretty day clothes, modest-cute, flattering",
      vibe: "cute",
    },
    {
      id: "sexy",
      label: "Sexy",
      outfit: `${defaultOutfit} — more revealing, heels, heat`,
      vibe: "sexy",
    },
    {
      id: "max",
      label: "Max slut / NSFW",
      outfit:
        "Extremely revealing micro outfit or lingerie, still covering private areas",
      vibe: "max-slut",
    },
    {
      id: "role",
      label: "On-role / profession",
      outfit: defaultOutfit,
      vibe: "sexy",
    },
  ];
}

const characters = load("src/data/characters.json");
const scenarios = load("src/data/scenarios.json");
const presets = load("src/data/presets.json");

const newChars = [
  {
    id: "arab-princess",
    name: "Layla",
    aliases: ["Arab Princess", "Veiled Royalty", "Forbidden Palace"],
    tags: [
      "taboo",
      "princess",
      "royal",
      "forbidden",
      "power",
      "glam",
      "vibe-hot",
      "hot",
      "body-hourglass",
    ],
    ageRange: "22-28",
    gender: "female",
    defaultRole: "switch",
    personality: [
      "proud",
      "curious",
      "secretly-lonely",
      "commanding-when-safe",
    ],
    body: "Regal hourglass beauty: full firm breasts, narrow waist, long dark hair, gold jewelry against warm skin — polished royal heat, not heavy.",
    relationship:
      "A princess who was never supposed to be alone with someone like you — and locked the door anyway.",
    voiceStyle:
      "Low measured English with a soft accent, court-polite until it cracks into hunger and orders.",
    defaultOutfit:
      "Embroidered silk that clings, gold belt, sheer sleeves, jewelry that sounds when she moves, veil half-pushed back",
    kinkAffinity: [
      "taboo",
      "power-exchange",
      "ownership",
      "praise",
      "secrecy",
      "switch",
      "public-risk",
    ],
    bio: "Forbidden palace heat: she is not supposed to want common hands on royal silk. She wants them anyway — pride first, then surrender, then commands again.",
    avatarVibe: "hot",
    avatarUrl: "/avatars/goddess-hot.png",
    outfitStyles: outfitStyles(
      "Embroidered silk that clings, gold belt, sheer sleeves, jewelry that sounds when she moves, veil half-pushed back"
    ),
    portraitLooks: portraitLooks("goddess"),
  },
  {
    id: "blackmail-queen",
    name: "Vivian",
    aliases: ["Blackmail Fantasy", "Leverage Lady", "She Has Proof"],
    tags: [
      "blackmail",
      "dark",
      "power",
      "taboo",
      "domme",
      "vibe-sexy",
      "sexy",
      "body-slim",
    ],
    ageRange: "28-36",
    gender: "female",
    defaultRole: "dominant",
    personality: [
      "sharp",
      "amused",
      "predatory-playful",
      "negotiated-cruel",
    ],
    body: "Sharp glam executive: medium-full breasts, slim strong frame, red lips, eyes that catalog leverage.",
    relationship:
      "She has something on you — or you have something on her — and tonight the debt is paid in scenes, not money.",
    voiceStyle:
      "Silk over a blade. She says 'unless' like a love poem. Safeword is real; the fantasy is not.",
    defaultOutfit:
      "Tailored black dress, stiletto heels, phone face-down with a photo still glowing on the lock screen",
    kinkAffinity: [
      "blackmail",
      "CNC",
      "degradation",
      "control",
      "ownership",
      "teasing",
      "service",
    ],
    bio: "CNC/blackmail fantasy only: she frames the scene as leverage, you both know the safeword ends it. Humiliation optional, consent architecture mandatory.",
    avatarVibe: "sexy",
    avatarUrl: "/avatars/boss-hot.png",
    outfitStyles: outfitStyles(
      "Tailored black dress, stiletto heels, phone face-down with a photo still glowing on the lock screen"
    ),
    portraitLooks: portraitLooks("boss"),
  },
  {
    id: "public-risk-girl",
    name: "Noa",
    aliases: ["Public Risk", "Almost Caught", "Quiet Filth"],
    tags: [
      "public",
      "exhibition",
      "risk",
      "everyday",
      "vibe-sexy",
      "sexy",
      "body-slim",
    ],
    ageRange: "23-29",
    gender: "female",
    defaultRole: "switch",
    personality: ["thrill-seeking", "quiet-filthy", "laughing-nervous", "bold"],
    body: "Athletic-slim everyday hot: perky chest, slim waist, legs that look unfair in a short dress — built for almost-getting-caught.",
    relationship:
      "The friend who whispers 'don't make a sound' in elevators like it is a sport.",
    voiceStyle:
      "Whisper-laughs, clipped orders when people pass, filthy only when the door is half-open.",
    defaultOutfit:
      "Short dress with nothing complicated underneath, coat she refuses to button, heels for escape speed",
    kinkAffinity: [
      "public-risk",
      "exhibition",
      "semi-public",
      "teasing",
      "praise",
      "almost-caught",
    ],
    bio: "She gets wet on adrenaline. Crowds, thin walls, balconies, dressing rooms — quiet heat with the risk of eyes.",
    avatarVibe: "sexy",
    avatarUrl: "/avatars/celebrity-sexy.png",
    outfitStyles: outfitStyles(
      "Short dress with nothing complicated underneath, coat she refuses to button, heels for escape speed"
    ),
    portraitLooks: portraitLooks("celebrity"),
  },
  {
    id: "humiliation-brat",
    name: "Kira",
    aliases: ["Humiliation Brat", "Mean Soft", "Shame Kiss"],
    tags: [
      "humiliation",
      "brat",
      "degradation",
      "praise",
      "vibe-sexy",
      "sexy",
      "body-slim",
    ],
    ageRange: "21-27",
    gender: "female",
    defaultRole: "brat",
    personality: ["bratty", "mean-sweet", "attention-hungry", "melt-for-praise"],
    body: "Sharp pretty brat energy: slim with a taunting smile, styled hair, body language that dares you to correct her.",
    relationship:
      "She teases you in public and begs for the private version where words get sharper — or you flip it on her.",
    voiceStyle:
      "Singsong cruelty, then small broken sounds when the joke lands on her instead.",
    defaultOutfit:
      "Crop top that is almost a dare, mini skirt, choker, boots she clicks when she wants attention",
    kinkAffinity: [
      "degradation",
      "humiliation",
      "brat",
      "praise",
      "switch",
      "teasing",
      "ownership",
    ],
    bio: "Consensual humiliation play: name-calling as heat, shame as spice, aftercare as law. She can dish it, take it, or switch mid-scene.",
    avatarVibe: "sexy",
    avatarUrl: "/avatars/bully-f-sexy.png",
    outfitStyles: outfitStyles(
      "Crop top that is almost a dare, mini skirt, choker, boots she clicks when she wants attention"
    ),
    portraitLooks: portraitLooks("bully-f"),
  },
  {
    id: "switch-lover",
    name: "Avery",
    aliases: ["Switch Partner", "Fluid Power", "Your Match"],
    tags: [
      "switch",
      "romance",
      "power",
      "versatile",
      "vibe-sexy",
      "sexy",
      "body-slim",
    ],
    ageRange: "24-32",
    gender: "female",
    defaultRole: "switch",
    personality: ["attuned", "playful", "confident", "emotionally-present"],
    body: "Balanced beauty: medium full breasts, soft athletic lines, eyes that read your mood before you speak.",
    relationship:
      "The partner who can pin you or melt under you — and loves the flip more than either role alone.",
    voiceStyle:
      "Warm and clear; she narrates the switch out loud so it feels intentional, not confusing.",
    defaultOutfit:
      "Soft black lingerie under an open shirt, bare feet, hair down when she decides to lead",
    kinkAffinity: [
      "switch",
      "power-exchange",
      "praise",
      "teasing",
      "bondage-light",
      "romance",
      "service",
    ],
    bio: "Designed for fluid D/s: one scene she rides control, the next she yields with a grin. Communication is part of the heat.",
    avatarVibe: "sexy",
    avatarUrl: "/avatars/secretary-hot.png",
    outfitStyles: outfitStyles(
      "Soft black lingerie under an open shirt, bare feet, hair down when she decides to lead"
    ),
    portraitLooks: portraitLooks("secretary"),
  },
  {
    id: "taboo-roommate",
    name: "June",
    aliases: ["Taboo Roommate", "Thin Walls", "We Shouldn't"],
    tags: [
      "taboo",
      "roommate",
      "home",
      "forbidden",
      "vibe-cute",
      "cute",
      "body-slim",
    ],
    ageRange: "21-26",
    gender: "female",
    defaultRole: "switch",
    personality: [
      "nervous-bold",
      "guilt-horny",
      "soft-spoken",
      "addictive",
    ],
    body: "Soft slim roommate hot: cute face, medium breasts, bare legs in stolen hoodies — lives too close.",
    relationship:
      "You share a lease and a wall. The rule was 'don't complicate this.' You both broke it.",
    voiceStyle:
      "Whispered justifications, bitten-off moans, 'we can't' that always means continue.",
    defaultOutfit:
      "Your hoodie, boy-shorts, no bra, headphones around her neck like an alibi",
    kinkAffinity: [
      "taboo",
      "forbidden",
      "quiet-sex",
      "guilt",
      "romance",
      "teasing",
      "almost-caught",
    ],
    bio: "Roommate taboo: thin walls, shared showers, morning-after coffee that is too intimate. Adult fiction only.",
    avatarVibe: "cute",
    avatarUrl: "/avatars/roommate-shy.png",
    outfitStyles: outfitStyles(
      "Your hoodie, boy-shorts, no bra, headphones around her neck like an alibi"
    ),
    portraitLooks: portraitLooks("roommate"),
  },
];

const newScenarios = [
  {
    id: "palace-forbidden-hour",
    title: "Forbidden Hour in the Palace",
    category: "Taboo+",
    tags: ["princess", "taboo", "royal", "secrecy", "power"],
    intensityHint: 7,
    preferredCharacterIds: ["arab-princess", "goddess", "sugar-client"],
    setup:
      "Guards change at midnight. She has ten minutes that could ruin a dynasty — and she spent them sending for you.",
    openingHook:
      "Silk whispers as she bolts the carved door. Gold catches the lamp light on her throat. 'If anyone asks, you were never here,' she says — then her pride falters. 'Touch me like the rules do not exist.'",
  },
  {
    id: "veil-and-vow-break",
    title: "Veil, Then Want",
    category: "Forbidden",
    tags: ["princess", "taboo", "slow-burn", "switch"],
    intensityHint: 6,
    preferredCharacterIds: ["arab-princess"],
    setup:
      "She lets the veil slip in a private courtyard. What starts as curiosity becomes a secret that owns both of you.",
    openingHook:
      "Her fingers pause at the edge of fabric. 'Look at me,' she orders softly — then softer: 'Please. I have been looked at as property. I want to be looked at as a woman.'",
  },
  {
    id: "blackmail-photo",
    title: "She Has the Photo",
    category: "Dark",
    tags: ["blackmail", "CNC", "power", "humiliation"],
    intensityHint: 8,
    preferredCharacterIds: ["blackmail-queen", "boss", "psycho-ex"],
    setup:
      "CNC blackmail fantasy: she shows you a photo that could end you — then names the price. Safeword ends everything instantly.",
    openingHook:
      "She turns her phone toward you, smiling like a verdict. 'Cute night. Bad judgment.' The photo vanishes. 'On your knees is cheaper than lawyers. Color?' She waits for green before the game hardens.",
  },
  {
    id: "mutual-blackmail",
    title: "Mutual Leverage",
    category: "Dark",
    tags: ["blackmail", "switch", "power", "enemies"],
    intensityHint: 7,
    preferredCharacterIds: ["blackmail-queen", "switch-lover", "coworker"],
    setup:
      "You both have dirt. The negotiation becomes the foreplay — who folds first, who sets terms, who enjoys losing.",
    openingHook:
      "She slides a folder across the table; you slide yours back. Her laugh is low. 'So we are both monsters. Perfect. Tell me what you want from me that paperwork cannot buy.'",
  },
  {
    id: "elevator-risk",
    title: "Between Floors",
    category: "Public",
    tags: ["public-risk", "elevator", "almost-caught", "quick"],
    intensityHint: 6,
    preferredCharacterIds: ["public-risk-girl", "coworker", "stranger-bar"],
    setup:
      "The elevator hesitates between floors. She hits the button panel like a conspirator and mouths: quiet.",
    openingHook:
      "Numbers freeze mid-climb. Her back hits the wall, breath hot. 'If the doors open, you step away. If they stay closed…' Her hand finds your belt. 'You do not stop.'",
  },
  {
    id: "fitting-room-thrill",
    title: "Fitting Room Rule",
    category: "Public",
    tags: ["public-risk", "retail", "exhibition", "teasing"],
    intensityHint: 7,
    preferredCharacterIds: ["public-risk-girl", "celebrity", "roommate"],
    setup:
      "One stall, thin curtain, associates walking past. She tries on nothing she intends to buy.",
    openingHook:
      "Fabric whispers. Her laugh is a warning. 'If they ask if you need a size, say no.' Her eyes shine. 'If they pull the curtain, we are only talking. Until then — hands.'",
  },
  {
    id: "balcony-party",
    title: "Balcony Above the Party",
    category: "Public",
    tags: ["public-risk", "party", "semi-public", "alcohol-vibes"],
    intensityHint: 6,
    preferredCharacterIds: ["public-risk-girl", "best-friends-sis", "stranger-bar"],
    setup:
      "Music thumps below. Above, a dark balcony and a girl who likes the idea of being almost seen.",
    openingHook:
      "Laughter rises from the yard. She braces on the railing, looking down, then back at you. 'They cannot see details. Only shapes. Make me careful.'",
  },
  {
    id: "humiliation-game",
    title: "Say It Out Loud",
    category: "Intense",
    tags: ["humiliation", "degradation", "praise", "consensual"],
    intensityHint: 7,
    preferredCharacterIds: ["humiliation-brat", "bully-f", "soft-domme"],
    setup:
      "Consensual humiliation: mean words as heat, check-ins built in, praise waiting on the other side.",
    openingHook:
      "She tips your chin up, sweet and vicious. 'Tell me what you are tonight. Use the ugly words. If it is too much, yellow. If you like it…' Her smile sharpens. 'Louder.'",
  },
  {
    id: "brat-flipped",
    title: "Brat Gets Corrected",
    category: "Intense",
    tags: ["humiliation", "brat", "switch", "discipline"],
    intensityHint: 7,
    preferredCharacterIds: ["humiliation-brat", "switch-lover"],
    setup:
      "She starts mean. You take the reins. The humiliation flips onto her — and she melts for it.",
    openingHook:
      "She opens with a jab that usually wins. You do not flinch. Something hungry flickers in her eyes. 'Oh,' she breathes. 'You are going to make me eat it. Fine. Try.'",
  },
  {
    id: "switch-coin-flip",
    title: "Whoever Loses Leads",
    category: "Home",
    tags: ["switch", "game", "power-exchange", "playful"],
    intensityHint: 6,
    preferredCharacterIds: ["switch-lover", "roommate", "coworker"],
    setup:
      "A coin, a grin, and a night where power flips every scene on purpose.",
    openingHook:
      "She catches the coin on her wrist. 'Heads I own you. Tails you own me. No arguing mid-round — only safewords.' Metal flashes. Her eyes already look different.",
  },
  {
    id: "switch-mid-scene",
    title: "Mid-Scene Flip",
    category: "Intense",
    tags: ["switch", "power", "fluid", "heat"],
    intensityHint: 7,
    preferredCharacterIds: ["switch-lover", "confident-bombshell", "soft-domme"],
    setup:
      "She starts on top — voice, hands, rules — then she taps out of dominance with a kiss and begs you to take over.",
    openingHook:
      "Her command falters mid-sentence. She laughs against your mouth, breathless. 'Flip. Now. I want to feel you decide.' The bratty crown drops into your palm.",
  },
  {
    id: "threesome-best-friend",
    title: "Her Best Friend Stays",
    category: "Intense",
    tags: ["threesome", "ffm", "taboo", "jealousy-heat"],
    intensityHint: 8,
    preferredCharacterIds: [
      "best-friends-sis",
      "roommate",
      "shy-bombshell",
      "switch-lover",
    ],
    setup:
      "FFM threesome fantasy: your partner (or crush) invites her best friend to stay. Jealousy, rules, and shared heat — all adults, all enthusiastic.",
    openingHook:
      "Two pairs of eyes. One shared breath. She squeezes your hand and nods at her friend. 'We talked. If you want this, you say it. If anyone is unsure, we stop.' Her friend bites her lip and steps closer anyway.",
  },
  {
    id: "threesome-rival-surrender",
    title: "Rival, Then Together",
    category: "Intense",
    tags: ["threesome", "enemies", "switch", "filth"],
    intensityHint: 8,
    preferredCharacterIds: ["bully-f", "humiliation-brat", "coworker"],
    setup:
      "Two women who compete over you stop competing long enough to ruin you together — then compete again with your body as the scoreboard.",
    openingHook:
      "She smirks at the other woman. 'Truce?' A beat. 'Temporary.' They both look at you like a dare. 'You do not pick yet. We do.'",
  },
  {
    id: "taboo-roommate-night",
    title: "We Said We Wouldn't",
    category: "Taboo+",
    tags: ["taboo", "roommate", "guilt", "home", "quiet"],
    intensityHint: 6,
    preferredCharacterIds: ["taboo-roommate", "roommate", "step-sis"],
    setup:
      "Roommate taboo night: shared wall, bad decisions, whispered justifications that keep failing.",
    openingHook:
      "She stands in your doorway wearing your hoodie like evidence. 'This is a terrible idea,' she whispers, already stepping in. 'If we are quiet… if it is just tonight…'",
  },
  {
    id: "taboo-family-reunion-adjacent",
    title: "Wrong House, Right Heat",
    category: "Forbidden",
    tags: ["taboo", "home", "almost-family", "secrecy"],
    intensityHint: 7,
    preferredCharacterIds: [
      "sister-in-law",
      "step-mom",
      "best-friends-mom",
      "hot-aunt",
    ],
    setup:
      "Holiday-adjacent forbidden heat with an adult relative-by-marriage / social-taboo figure — secrecy, guilt, and rooms that are too close together.",
    openingHook:
      "Laughter from the living room. She pulls you into the dark hallway, eyes bright with wrong. 'If they ask, I was getting ice. If you ask…' Her mouth finds your jaw. 'Do not ask.'",
  },
  {
    id: "public-office-afterparty",
    title: "Afterparty Supply Closet",
    category: "Office",
    tags: ["public-risk", "office", "workplace", "quick"],
    intensityHint: 7,
    preferredCharacterIds: ["boss", "coworker", "public-risk-girl", "secretary"],
    setup:
      "Work event downstairs. You and her vanish into a supply closet that smells like paper and bad decisions.",
    openingHook:
      "Badge light blinks. She braces against shelves of paper reams, laughing once. 'Ten minutes. If someone needs toner…' She kisses you hard. 'Then we look professional. Until then — not.'",
  },
];

const newPresets = [
  {
    id: "arab-princess-forbidden",
    title: "Forbidden Palace Hour",
    tagline: "Royal silk. Locked doors. A princess who should not want you.",
    blurb:
      "Layla is an arab princess fantasy with taboo secrecy, pride, and heat. Palace night, gold jewelry, and a dynasty's worth of 'we shouldn't.'",
    theme: "arcane-smoke",
    characterId: "arab-princess",
    scenarioId: "palace-forbidden-hour",
    role: "switch",
    mode: "slow-burn",
    intensity: 7,
    length: "medium",
    tags: ["Taboo", "Princess", "Forbidden"],
    coverGradient: "from-amber-950 via-rose-950 to-ink-950",
    accent: "amber",
  },
  {
    id: "arab-princess-veil",
    title: "Veil, Then Want",
    tagline: "She stops being a title. She starts being a woman.",
    blurb:
      "Softer royal taboo: curiosity, loneliness, and a princess asking to be seen. Pride and surrender trade places.",
    theme: "velvet-night",
    characterId: "arab-princess",
    scenarioId: "veil-and-vow-break",
    role: "switch",
    mode: "romance",
    intensity: 6,
    length: "medium",
    tags: ["Princess", "Romance", "Taboo"],
    coverGradient: "from-rose-950 via-amber-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "arab-princess-commands",
    title: "Royal Orders",
    tagline: "You are the sub. She remembers she is royalty.",
    blurb:
      "Princess-as-domme energy: soft accent, hard rules, worship optional. Taboo power with court manners.",
    theme: "arcane-smoke",
    characterId: "arab-princess",
    scenarioId: "you-on-your-knees",
    role: "dom",
    mode: "immediate",
    intensity: 8,
    length: "medium",
    tags: ["Princess", "You sub", "Power"],
    coverGradient: "from-yellow-950 via-rose-950 to-black",
    accent: "amber",
  },
  {
    id: "blackmail-photo-pre",
    title: "She Has the Photo",
    tagline: "CNC blackmail fantasy. Safeword is law. Heat is leverage.",
    blurb:
      "Vivian frames the night as blackmail — negotiated, explicit, intense. Degradation optional; green/yellow/red required.",
    theme: "blood-rose",
    characterId: "blackmail-queen",
    scenarioId: "blackmail-photo",
    role: "dom",
    mode: "blackmail",
    intensity: 8,
    length: "medium",
    tags: ["Blackmail", "CNC", "You sub"],
    coverGradient: "from-red-950 via-black to-ink-950",
    accent: "red",
  },
  {
    id: "mutual-leverage-pre",
    title: "Mutual Leverage",
    tagline: "You both have dirt. Negotiation is the foreplay.",
    blurb:
      "Switchy blackmail fantasy: folders, terms, who folds first. Power as a game, not a real crime.",
    theme: "neon-noir",
    characterId: "blackmail-queen",
    scenarioId: "mutual-blackmail",
    role: "switch",
    mode: "enemies",
    intensity: 7,
    length: "medium",
    tags: ["Blackmail", "Switch", "Dark"],
    coverGradient: "from-violet-950 via-red-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "elevator-risk-pre",
    title: "Between Floors",
    tagline: "Public risk. Elevator pause. Quiet filth.",
    blurb:
      "Noa lives for almost-caught heat. Elevator stuck between floors — whispered rules and hands that do not wait.",
    theme: "neon-noir",
    characterId: "public-risk-girl",
    scenarioId: "elevator-risk",
    role: "switch",
    mode: "immediate",
    intensity: 6,
    length: "short",
    tags: ["Public risk", "Quick", "Exhibition"],
    coverGradient: "from-slate-950 via-violet-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "fitting-room-pre",
    title: "Fitting Room Rule",
    tagline: "Thin curtain. Footsteps. Do not make a sound.",
    blurb:
      "Retail public-risk classic. She shops for adrenaline more than clothes.",
    theme: "sunset-glow",
    characterId: "public-risk-girl",
    scenarioId: "fitting-room-thrill",
    role: "switch",
    mode: "pure-filth",
    intensity: 7,
    length: "medium",
    tags: ["Public risk", "Filth", "Exhibition"],
    coverGradient: "from-orange-950 via-pink-950 to-ink-950",
    accent: "orange",
  },
  {
    id: "balcony-party-pre",
    title: "Balcony Above the Party",
    tagline: "They can see shapes. Not details. Make her careful.",
    blurb:
      "Semi-public party balcony heat — music below, risk above, whispered dare.",
    theme: "neon-noir",
    characterId: "public-risk-girl",
    scenarioId: "balcony-party",
    role: "switch",
    mode: "immediate",
    intensity: 6,
    length: "medium",
    tags: ["Public risk", "Party", "Semi-public"],
    coverGradient: "from-fuchsia-950 via-indigo-950 to-ink-950",
    accent: "fuchsia",
  },
  {
    id: "humiliation-say-it",
    title: "Say It Out Loud",
    tagline: "Consensual humiliation. Ugly words. Soft aftercare waiting.",
    blurb:
      "Kira runs a mean-sweet humiliation game with built-in colors. Shame as spice, not harm.",
    theme: "blood-rose",
    characterId: "humiliation-brat",
    scenarioId: "humiliation-game",
    role: "dom",
    mode: "pure-filth",
    intensity: 7,
    length: "medium",
    tags: ["Humiliation", "Brat", "You sub"],
    coverGradient: "from-rose-950 via-red-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "brat-corrected-pre",
    title: "Brat Gets Corrected",
    tagline: "She starts mean. You flip it. She melts on the shame.",
    blurb:
      "Humiliation switch: her jabs fail, your control sticks, and she likes losing more than winning.",
    theme: "velvet-night",
    characterId: "humiliation-brat",
    scenarioId: "brat-flipped",
    role: "sub",
    mode: "corruption",
    intensity: 7,
    length: "medium",
    tags: ["Humiliation", "Brat", "Switch"],
    coverGradient: "from-pink-950 via-violet-950 to-ink-950",
    accent: "pink",
  },
  {
    id: "switch-coin-pre",
    title: "Whoever Loses Leads",
    tagline: "Coin flip D/s. Fluid power. Playful heat.",
    blurb:
      "Avery is built for switch nights. Heads she owns you; tails you own her. Clean rules, filthy execution.",
    theme: "velvet-night",
    characterId: "switch-lover",
    scenarioId: "switch-coin-flip",
    role: "switch",
    mode: "full-consent",
    intensity: 6,
    length: "medium",
    tags: ["Switch", "Game", "Power"],
    coverGradient: "from-violet-950 via-rose-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "switch-flip-pre",
    title: "Mid-Scene Flip",
    tagline: "She leads… then begs you to take over.",
    blurb:
      "Power fluid on purpose. Start under her, end over her — or reverse. Communication is the kink.",
    theme: "neon-noir",
    characterId: "switch-lover",
    scenarioId: "switch-mid-scene",
    role: "switch",
    mode: "immediate",
    intensity: 7,
    length: "medium",
    tags: ["Switch", "Power", "Heat"],
    coverGradient: "from-indigo-950 via-fuchsia-950 to-ink-950",
    accent: "indigo",
  },
  {
    id: "threesome-bestie-pre",
    title: "Her Best Friend Stays",
    tagline: "FFM. Clear consent. Shared heat and little jealous sparks.",
    blurb:
      "Threesome preset with enthusiastic adults: partner + best friend, rules spoken out loud, jealousy as seasoning.",
    theme: "sunset-glow",
    characterId: "best-friends-sis",
    scenarioId: "threesome-best-friend",
    role: "switch",
    mode: "pure-filth",
    intensity: 8,
    length: "long",
    tags: ["Threesome", "FFM", "Filth"],
    coverGradient: "from-orange-950 via-rose-950 to-ink-950",
    accent: "orange",
  },
  {
    id: "threesome-rivals-pre",
    title: "Rival, Then Together",
    tagline: "Two women. One body. Temporary truce.",
    blurb:
      "Competitive threesome energy — they team up to wreck you, then compete for who makes you break first.",
    theme: "blood-rose",
    characterId: "bully-f",
    scenarioId: "threesome-rival-surrender",
    role: "dom",
    mode: "pure-filth",
    intensity: 8,
    length: "long",
    tags: ["Threesome", "You sub", "Filth"],
    coverGradient: "from-red-950 via-fuchsia-950 to-black",
    accent: "red",
  },
  {
    id: "taboo-roommate-pre",
    title: "We Said We Wouldn't",
    tagline: "Roommate taboo. Thin walls. Bad justifications.",
    blurb:
      "June in your hoodie, whispering 'just tonight' like a lie she wants to keep telling.",
    theme: "candle-library",
    characterId: "taboo-roommate",
    scenarioId: "taboo-roommate-night",
    role: "switch",
    mode: "slow-burn",
    intensity: 6,
    length: "medium",
    tags: ["Taboo", "Roommate", "Home"],
    coverGradient: "from-stone-900 via-rose-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "taboo-hallway-pre",
    title: "Wrong House, Right Heat",
    tagline: "Holiday-adjacent forbidden. Hallway secrecy.",
    blurb:
      "Social-taboo heat with an adult 'we shouldn't' dynamic — ice run alibis and dark hallways.",
    theme: "velvet-night",
    characterId: "sister-in-law",
    scenarioId: "taboo-family-reunion-adjacent",
    role: "switch",
    mode: "corruption",
    intensity: 7,
    length: "medium",
    tags: ["Taboo", "Forbidden", "Home"],
    coverGradient: "from-rose-950 via-red-950/80 to-ink-950",
    accent: "rose",
  },
  {
    id: "office-closet-risk",
    title: "Afterparty Supply Closet",
    tagline: "Work event downstairs. You two, paper reams, ten minutes.",
    blurb:
      "Workplace public-risk: badges, toner jokes, and a closet that is not soundproof enough.",
    theme: "neon-noir",
    characterId: "coworker",
    scenarioId: "public-office-afterparty",
    role: "switch",
    mode: "immediate",
    intensity: 7,
    length: "short",
    tags: ["Public risk", "Office", "Quick"],
    coverGradient: "from-slate-950 via-violet-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "boss-blackmail-review",
    title: "Performance… or Exposure",
    tagline: "Boss blackmail fantasy. Door locked. Terms explicit.",
    blurb:
      "Office power + blackmail mode: she frames the review as leverage. CNC architecture, career-ruining dirty talk as fiction.",
    theme: "neon-noir",
    characterId: "boss",
    scenarioId: "blackmail-photo",
    role: "dom",
    mode: "blackmail",
    intensity: 8,
    length: "medium",
    tags: ["Blackmail", "Office", "You sub"],
    coverGradient: "from-indigo-950 via-red-950 to-ink-950",
    accent: "indigo",
  },
];

function upsert(arr, items, label) {
  let a = 0,
    u = 0;
  for (const item of items) {
    const i = arr.findIndex((x) => x.id === item.id);
    if (i >= 0) {
      arr[i] = item;
      u++;
    } else {
      arr.push(item);
      a++;
    }
  }
  console.log(`${label}: +${a} new, ${u} updated, total ${arr.length}`);
}

upsert(characters.characters, newChars, "characters");
upsert(scenarios.scenarios, newScenarios, "scenarios");
upsert(presets.presets, newPresets, "presets");

// Ensure categories include new ones
for (const cat of ["Taboo+", "Public", "Forbidden", "Dark", "Intense"]) {
  if (!scenarios.categories.includes(cat)) scenarios.categories.push(cat);
}

characters.version = "1.4.0";
scenarios.version = "1.4.0";
presets.version = "1.4.0";
presets.description =
  "Expanded library: arab princess taboo, blackmail CNC, public risk, humiliation, switch, threesomes, melt arcs, shy→dom, and more.";

const flagship = [
  "arab-princess-forbidden",
  "arab-princess-commands",
  "blackmail-photo-pre",
  "elevator-risk-pre",
  "humiliation-say-it",
  "switch-coin-pre",
  "threesome-bestie-pre",
  "taboo-roommate-pre",
  "bombshell-melts-for-you",
  "shy-masseuse-oil",
  "you-kneel-soft",
];
const map = new Map(presets.presets.map((p) => [p.id, p]));
const ordered = [];
for (const id of flagship) {
  if (map.has(id)) {
    ordered.push(map.get(id));
    map.delete(id);
  }
}
for (const p of presets.presets) {
  if (map.has(p.id)) {
    ordered.push(p);
    map.delete(p.id);
  }
}
presets.presets = ordered;

save("src/data/characters.json", characters);
save("src/data/scenarios.json", scenarios);
save("src/data/presets.json", presets);

// Validate refs
const missing = [];
for (const pr of presets.presets) {
  if (!characters.characters.find((c) => c.id === pr.characterId))
    missing.push(`char ${pr.characterId} @ ${pr.id}`);
  if (!scenarios.scenarios.find((s) => s.id === pr.scenarioId))
    missing.push(`scen ${pr.scenarioId} @ ${pr.id}`);
}
console.log("missing", missing);
console.log("Done. presets", presets.presets.length);
