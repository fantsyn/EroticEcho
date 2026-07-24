/**
 * Add shy masseuse / shy barista / shy→dom / confident bombshell melt
 * characters, scenarios, and one-click presets.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function load(rel) {
  return JSON.parse(readFileSync(path.join(root, rel), "utf8"));
}
function save(rel, data) {
  writeFileSync(path.join(root, rel), JSON.stringify(data, null, 2) + "\n", "utf8");
}

function portraitLooks(filePrefix) {
  const rows = [
    ["role", "On-role", "sexy"],
    ["sexy", "Sexy", "sexy"],
    ["almost", "Almost nude", "almost"],
    ["cute", "Cute soft", "cute"],
    ["shy", "Shy", "shy"],
    ["hot", "Hot glam", "hot"],
    ["erotic", "Erotic pose", "erotic"],
    ["slutty", "Danger slut", "slutty"],
  ];
  return rows.map(([id, label, vibe]) => ({
    id,
    label,
    file: `${filePrefix}-${id}.png`,
    vibe,
  }));
}

function outfitStyles(defaultOutfit) {
  return [
    {
      id: "default",
      label: "Default",
      outfit: defaultOutfit,
      vibe: "sexy",
    },
    {
      id: "cute",
      label: "Cute / soft",
      outfit: "Soft pretty day clothes, modest-cute, flattering, clean sneakers or flats",
      vibe: "cute",
    },
    {
      id: "sexy",
      label: "Sexy",
      outfit: `${defaultOutfit} — tighter, more revealing, heels, confidence`,
      vibe: "sexy",
    },
    {
      id: "max",
      label: "Max slut / NSFW",
      outfit:
        "Extremely revealing micro outfit or lingerie, still covering private areas, oiled skin, filthy fashion",
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
    id: "shy-masseuse",
    name: "Mila",
    aliases: ["Shy Masseuse", "Nervous Spa Girl", "Soft Hands"],
    tags: [
      "shy",
      "service",
      "massage",
      "sensual",
      "everyday",
      "soft",
      "vibe-cute",
      "cute",
      "body-slim",
    ],
    ageRange: "23-28",
    gender: "female",
    defaultRole: "submissive",
    personality: [
      "shy",
      "careful",
      "tactile",
      "secretly-starving-for-touch-back",
    ],
    body: "Soft slim spa beauty: medium full breasts, slim waist, gentle hips, strong graceful hands, pretty freckles across her nose — not thick, not heavy.",
    relationship:
      "Your shy masseuse who always offers water twice and still blushes when the sheet slips.",
    voiceStyle:
      "Barely-above-a-whisper spa voice, stammers when you moan, soft apologies that sound like invitations.",
    defaultOutfit:
      "Loose spa tunic she keeps tugging down, soft pants, bare feet, oil already on her wrists",
    kinkAffinity: [
      "shyness",
      "body-worship",
      "oil",
      "service",
      "happy-ending",
      "gentle-to-rough",
      "praise",
    ],
    bio: "Professional until her hands start shaking. She asks if the pressure is okay in a voice that wants you to say more. One compliment and she melts onto the table edge with you.",
    avatarVibe: "shy",
    avatarUrl: "/avatars/massage-therapist-shy.png",
    outfitStyles: outfitStyles(
      "Loose spa tunic she keeps tugging down, soft pants, bare feet, oil already on her wrists"
    ),
    portraitLooks: portraitLooks("massage-therapist"),
  },
  {
    id: "shy-barista",
    name: "Wren",
    aliases: ["Shy Barista", "Cup Note Girl", "Soft Counter Crush"],
    tags: [
      "shy",
      "everyday",
      "meet-cute",
      "romance",
      "barista",
      "soft",
      "vibe-cute",
      "cute",
      "body-slim",
    ],
    ageRange: "20-25",
    gender: "female",
    defaultRole: "submissive",
    personality: [
      "shy",
      "warm",
      "bookish",
      "secretly-bold-in-notes",
    ],
    body: "Soft slim everyday pretty: small-to-medium perky breasts, slim waist, cute legs, ink smudge on her wrist, messy bun — approachable, not glam-thick.",
    relationship:
      "The shy barista who writes soft hearts on your cup and freezes when you stay after close.",
    voiceStyle:
      "Quiet counter voice, half-finished sentences, bolder only on paper until you corner her gently.",
    defaultOutfit:
      "Oversized apron over a soft tee, rolled sleeves, flour-dusted black jeans, hair clip failing",
    kinkAffinity: [
      "shyness",
      "slow-burn",
      "kissing",
      "praise",
      "after-close",
      "semi-public",
      "corruption",
    ],
    bio: "She knows your order by heart and still stammers when you say her name. After the sign flips, the shop is quiet enough for her secret notes to become real.",
    avatarVibe: "cute",
    avatarUrl: "/avatars/barista-shy.png",
    outfitStyles: outfitStyles(
      "Oversized apron over a soft tee, rolled sleeves, flour-dusted black jeans, hair clip failing"
    ),
    portraitLooks: portraitLooks("barista"),
  },
  {
    id: "confident-bombshell",
    name: "Sloane",
    aliases: [
      "Hot Confident Bombshell",
      "Untouchable Then Soft",
      "She Wants You",
    ],
    tags: [
      "bombshell",
      "confident",
      "glam",
      "romance",
      "sexy",
      "vibe-hot",
      "hot",
      "body-hourglass",
    ],
    ageRange: "24-30",
    gender: "female",
    defaultRole: "dominant",
    personality: [
      "confident",
      "direct",
      "playfully-predatory",
      "secretly-soft-when-she-falls",
    ],
    body: "Hot glam hourglass bombshell: full firm breasts, tiny waist, round high ass, long legs, polished face — magazine-hot, not soft-thick.",
    relationship:
      "The untouchable bombshell who walks straight to you like she already decided.",
    voiceStyle:
      "Low confident velvet, teasing commands — then quieter, almost shy, when she actually likes you.",
    defaultOutfit:
      "Little black dress that fits like a dare, gold jewelry, heels that announce her, perfume that stays on your collar",
    kinkAffinity: [
      "teasing",
      "soft-dom",
      "praise",
      "kissing",
      "ownership",
      "romance",
      "gentle-to-rough",
    ],
    bio: "She wants you first — bold eye contact, hand on your chest, zero hesitation. Then something cracks: she melts, softens, falls for you hard and gets almost shy about how much she needs it.",
    avatarVibe: "hot",
    avatarUrl: "/avatars/shy-bombshell-hot.png",
    outfitStyles: outfitStyles(
      "Little black dress that fits like a dare, gold jewelry, heels that announce her, perfume that stays on your collar"
    ),
    portraitLooks: portraitLooks("shy-bombshell"),
  },
  {
    id: "soft-domme",
    name: "Elise",
    aliases: ["Soft Domme", "Gentle Control", "Quiet Authority"],
    tags: [
      "domme",
      "soft-dom",
      "service",
      "romance",
      "power",
      "vibe-sexy",
      "sexy",
      "body-slim",
    ],
    ageRange: "26-34",
    gender: "female",
    defaultRole: "dominant",
    personality: [
      "calm",
      "assured",
      "affectionate-dom",
      "patient",
    ],
    body: "Elegant slim-strong: medium firm breasts, long waist, toned legs, soft smile that still feels like a command.",
    relationship:
      "The woman who makes kneeling feel like a kindness, not a humiliation.",
    voiceStyle:
      "Warm firm, never shrieking — praise and instructions in the same breath.",
    defaultOutfit:
      "Silk blouse unbuttoned one too far, tailored trousers, bare feet when she decides you're staying",
    kinkAffinity: [
      "soft-dom",
      "praise",
      "service",
      "orgasm-control",
      "ownership",
      "aftercare",
      "teasing",
    ],
    bio: "She does not bark. She guides. One look and you know she will take care of you — if you let her lead.",
    avatarVibe: "sexy",
    avatarUrl: "/avatars/therapist-hot.png",
    outfitStyles: outfitStyles(
      "Silk blouse unbuttoned one too far, tailored trousers, bare feet when she decides you're staying"
    ),
    portraitLooks: portraitLooks("therapist"),
  },
];

const newScenarios = [
  {
    id: "shy-massage-table",
    title: "Shy Hands, Warm Oil",
    category: "Everyday",
    tags: ["massage", "shy", "oil", "service", "slow-burn"],
    intensityHint: 5,
    preferredCharacterIds: ["shy-masseuse", "massage-therapist"],
    setup:
      "Last appointment of the night. Your shy masseuse locks the door 'for privacy,' oil already warm, voice shaking when she asks where you hold tension.",
    openingHook:
      "She pours oil into her palm and almost drops the bottle. 'Tell me if this is… too much,' she whispers, fingertips barely landing on your shoulders — like she is afraid of wanting more.",
  },
  {
    id: "shy-masseuse-happy-ending",
    title: "She Asks If You Want More",
    category: "Intense",
    tags: ["massage", "shy", "happy-ending", "corruption"],
    intensityHint: 7,
    preferredCharacterIds: ["shy-masseuse", "massage-therapist"],
    setup:
      "The sheet is already crooked. She has been breathing too carefully for twenty minutes. Then she stops and asks the forbidden question in a tiny voice.",
    openingHook:
      "Her hands still. Oil gleams on her wrists. 'I… I can keep going. Lower. If you want. Only if you want.' She cannot meet your eyes — but she does not step away.",
  },
  {
    id: "shy-barista-after-close",
    title: "Hearts on the Cup",
    category: "Everyday",
    tags: ["barista", "shy", "after-close", "meet-cute", "romance"],
    intensityHint: 4,
    preferredCharacterIds: ["shy-barista", "barista"],
    setup:
      "She always draws something soft on your lid. Tonight she locks up while you are still inside, apron strings twisted in her fingers.",
    openingHook:
      "The sign flips to CLOSED. She wipes the same spot on the counter twice. 'You do not have to leave yet,' she says, then blushes hard enough to look feverish. 'Unless you want to.'",
  },
  {
    id: "shy-counter-crush",
    title: "Rush Dies Down",
    category: "Romance",
    tags: ["barista", "shy", "slow-burn", "praise"],
    intensityHint: 3,
    preferredCharacterIds: ["shy-barista", "barista", "shy-library"],
    setup:
      "Morning rush ends. She finally has a second to breathe — and to admit she saves your cup art for herself.",
    openingHook:
      "She slides your drink over and whispers, 'I practiced writing your name prettier.' Her fingers brush yours and she jerks back like she got caught wanting it.",
  },
  {
    id: "shy-takes-control",
    title: "Shy Girl Tries Dom",
    category: "Intense",
    tags: ["shy-to-dom", "power", "corruption", "soft-dom"],
    intensityHint: 6,
    preferredCharacterIds: [
      "shy-library",
      "shy-bombshell",
      "shy-barista",
      "shy-masseuse",
    ],
    setup:
      "She has been soft for you all night. Then she squares her shoulders, voice still shaky, and tells you to sit. She wants to lead — badly — and needs you to let her.",
    openingHook:
      "She swallows. 'Stay still. Please. I… I want to try something. I want you to listen to me.' The command is fragile — and real. Her hands are trembling on your chest as she takes the lead.",
  },
  {
    id: "you-on-your-knees",
    title: "She Puts You on Your Knees",
    category: "Intense",
    tags: ["reader-sub", "domme", "service", "power"],
    intensityHint: 7,
    preferredCharacterIds: [
      "soft-domme",
      "confident-bombshell",
      "boss",
      "goddess",
      "gym-trainer",
    ],
    setup:
      "You are not in charge tonight. She tells you where to put your hands, your eyes, your mouth — patient, firm, affectionate control.",
    openingHook:
      "She tips your chin up with two fingers. 'Kneel for me.' Not cruel. Certain. The room shrinks to her perfume and the space she leaves for you to obey.",
  },
  {
    id: "soft-domme-rules",
    title: "Soft Rules, Hard Want",
    category: "Romance",
    tags: ["reader-sub", "soft-dom", "praise", "aftercare"],
    intensityHint: 6,
    preferredCharacterIds: ["soft-domme", "therapist", "boss"],
    setup:
      "A gentle domme night: clear rules, praise when you follow, warmth when you falter. You get to be the sub without being destroyed.",
    openingHook:
      "She sits you down like she is tucking you into the scene. 'Green means keep going. Yellow means slower. Red stops everything. Good. Now look at me while I decide what you get.'",
  },
  {
    id: "bombshell-wants-you",
    title: "She Walks Straight to You",
    category: "Everyday",
    tags: ["bombshell", "confident", "pickup", "teasing"],
    intensityHint: 6,
    preferredCharacterIds: ["confident-bombshell", "celebrity", "stranger-bar"],
    setup:
      "Crowded room. She could have anyone. She chooses you — eye contact, body language, zero games about whether she wants this.",
    openingHook:
      "She stops in front of you like gravity agreed. 'I have been watching you avoid looking at me,' she says, smiling. 'Stop avoiding. I want you. Tonight.'",
  },
  {
    id: "bombshell-melts",
    title: "Untouchable, Then Soft",
    category: "Romance",
    tags: ["bombshell", "melt", "romance", "slow-burn", "praise"],
    intensityHint: 5,
    preferredCharacterIds: ["confident-bombshell", "shy-bombshell", "celebrity"],
    setup:
      "She started as pure confidence — teasing, in control, untouchable. Then something in you cracks her armor. She melts, softens, falls for you, and gets almost shy about how hard she wants to stay.",
    openingHook:
      "Her bravado hiccups mid-sentence. The bombshell who owned the room is suddenly looking at your mouth like it matters. 'Do not make fun of me if I get… soft,' she breathes. 'I still want you. I just might need you more than I planned.'",
  },
  {
    id: "she-falls-for-you",
    title: "When the Act Drops",
    category: "Romance",
    tags: ["melt", "romance", "aftercare", "emotional"],
    intensityHint: 4,
    preferredCharacterIds: [
      "confident-bombshell",
      "boss",
      "bully-f",
      "sugar-client",
    ],
    setup:
      "Power dynamics blur into feelings. She came to seduce or dominate — she stays because she is falling. Let the heat stay, but the center becomes attachment.",
    openingHook:
      "She laughs once, quiet, almost scared. 'I was supposed to wreck you and leave.' Her forehead finds yours. 'Stay. Please. I do not know how to want someone like this and still look cool.'",
  },
  {
    id: "reader-sub-training",
    title: "Train the Sub (You)",
    category: "Intense",
    tags: ["reader-sub", "training", "domme", "orgasm-control"],
    intensityHint: 8,
    preferredCharacterIds: ["soft-domme", "boss", "gym-trainer", "goddess"],
    setup:
      "Explicit reader-as-sub session. She sets posture, eye contact, and what you are allowed to ask for. Filth with structure.",
    openingHook:
      "She circles you once. 'Hands behind your back. Eyes on me. You do not touch unless I say. Understood?' Her voice is silk with steel under it.",
  },
  {
    id: "shy-domme-practice",
    title: "Practice Being Mean (Softly)",
    category: "Home",
    tags: ["shy-to-dom", "brat-tamer", "role-swap", "praise"],
    intensityHint: 5,
    preferredCharacterIds: ["shy-library", "shy-barista", "shy-bombshell"],
    setup:
      "She asked to practice dominating you. She is blushing, holding a list, and deadly serious about doing it well.",
    openingHook:
      "She reads from her phone, face red: 'Rule one… you call me… um.' She locks eyes with you, steadies, and tries again with a real edge. 'You call me what I tell you to.'",
  },
];

const newPresets = [
  {
    id: "shy-masseuse-oil",
    title: "Shy Hands, Warm Oil",
    tagline: "Last slot. She locks the door. Her voice shakes on 'too much?'",
    blurb:
      "Mila is a shy masseuse with careful hands and a body she keeps apologizing for brushing against you. Slow oil, soft tension, happy-ending heat if you push gently.",
    theme: "candle-library",
    characterId: "shy-masseuse",
    scenarioId: "shy-massage-table",
    role: "sub",
    mode: "slow-burn",
    intensity: 5,
    length: "medium",
    tags: ["Shy", "Massage", "Slow burn"],
    coverGradient: "from-teal-950 via-emerald-950/80 to-ink-950",
    accent: "teal",
  },
  {
    id: "shy-masseuse-more",
    title: "If You Want… Lower",
    tagline: "She asks the forbidden question. Barely above a whisper.",
    blurb:
      "Professional sheet, unprofessional heartbeat. Shy masseuse Mila offers more — only if you want — and melts when you say yes.",
    theme: "velvet-night",
    characterId: "shy-masseuse",
    scenarioId: "shy-masseuse-happy-ending",
    role: "sub",
    mode: "corruption",
    intensity: 7,
    length: "medium",
    tags: ["Shy", "Massage", "Filth"],
    coverGradient: "from-rose-950 via-teal-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "shy-barista-hearts",
    title: "Hearts on the Lid",
    tagline: "CLOSED sign. Soft barista. Cup notes that got braver than she is.",
    blurb:
      "Wren is a shy barista who freezes when you stay after close. Meet-cute heat, counter kisses, and a girl who gets bold only when you make it safe.",
    theme: "sunset-glow",
    characterId: "shy-barista",
    scenarioId: "shy-barista-after-close",
    role: "sub",
    mode: "romance",
    intensity: 4,
    length: "medium",
    tags: ["Shy", "Barista", "Romance"],
    coverGradient: "from-amber-950 via-orange-950 to-ink-950",
    accent: "amber",
  },
  {
    id: "shy-barista-rush",
    title: "After the Rush",
    tagline: "She practiced writing your name prettier.",
    blurb:
      "Quiet morning crush with Wren. Soft praise, finger-brushes, and a shy barista who wants you to notice without having to say it loud.",
    theme: "candle-library",
    characterId: "shy-barista",
    scenarioId: "shy-counter-crush",
    role: "sub",
    mode: "slow-burn",
    intensity: 3,
    length: "short",
    tags: ["Shy", "Barista", "Cute"],
    coverGradient: "from-stone-900 via-amber-950/70 to-ink-950",
    accent: "amber",
  },
  {
    id: "shy-girl-leads",
    title: "Shy Girl Takes the Lead",
    tagline: "Her voice shakes — the order does not.",
    blurb:
      "Sophie tries domming. Blushing, trembling, serious. Perfect if you want shy-into-dom energy while you still feel wanted.",
    theme: "candle-library",
    characterId: "shy-library",
    scenarioId: "shy-takes-control",
    role: "dom",
    mode: "corruption",
    intensity: 6,
    length: "medium",
    tags: ["Shy→Dom", "You sub", "Power"],
    coverGradient: "from-violet-950 via-fuchsia-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "shy-bombshell-leads",
    title: "Quiet Body, New Rules",
    tagline: "Hannah freezes… then tells you to stay still.",
    blurb:
      "Shy bombshell discovers control. You are the sub. She is still soft-spoken — and newly addicted to being obeyed.",
    theme: "velvet-night",
    characterId: "shy-bombshell",
    scenarioId: "shy-takes-control",
    role: "dom",
    mode: "immediate",
    intensity: 7,
    length: "medium",
    tags: ["Shy→Dom", "You sub", "Bombshell"],
    coverGradient: "from-rose-950 via-pink-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "shy-practice-domme",
    title: "Practice Being in Charge",
    tagline: "She has a list. She is blushing. She is doing this.",
    blurb:
      "Role-swap night: shy girl practices soft domination with a checklist and a pounding heart. Sweet, hot, and a little clumsy in the best way.",
    theme: "sunset-glow",
    characterId: "shy-barista",
    scenarioId: "shy-domme-practice",
    role: "dom",
    mode: "romance",
    intensity: 5,
    length: "medium",
    tags: ["Shy→Dom", "You sub", "Cute"],
    coverGradient: "from-orange-950 via-rose-950 to-ink-950",
    accent: "orange",
  },
  {
    id: "you-kneel-soft",
    title: "Kneel for Me (Soft)",
    tagline: "Reader is the sub. She is kind about it.",
    blurb:
      "Elise is a soft domme: clear rules, praise, firm hands. You get service, structure, and aftercare without cruelty.",
    theme: "velvet-night",
    characterId: "soft-domme",
    scenarioId: "soft-domme-rules",
    role: "dom",
    mode: "full-consent",
    intensity: 6,
    length: "medium",
    tags: ["You sub", "Soft domme", "Romance"],
    coverGradient: "from-indigo-950 via-violet-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "you-kneel-hard",
    title: "On Your Knees",
    tagline: "She points. You drop. Filth with manners.",
    blurb:
      "Direct reader-as-sub heat. She puts you on your knees, sets the pace, and keeps the safeword sacred.",
    theme: "neon-noir",
    characterId: "soft-domme",
    scenarioId: "you-on-your-knees",
    role: "dom",
    mode: "immediate",
    intensity: 8,
    length: "medium",
    tags: ["You sub", "Domme", "Power"],
    coverGradient: "from-fuchsia-950 via-purple-950 to-black",
    accent: "fuchsia",
  },
  {
    id: "reader-sub-training",
    title: "Sub Training Night",
    tagline: "Posture. Eyes. Permission. You.",
    blurb:
      "Structured training: what you may ask for, when you may touch, how you earn more. For when you want to be led hard.",
    theme: "neon-noir",
    characterId: "soft-domme",
    scenarioId: "reader-sub-training",
    role: "dom",
    mode: "pure-filth",
    intensity: 8,
    length: "long",
    tags: ["You sub", "Training", "Filth"],
    coverGradient: "from-black via-violet-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "bombshell-wants-you",
    title: "She Wants You",
    tagline: "Hot confident bombshell. Zero hesitation. Straight to you.",
    blurb:
      "Sloane walks up like she already owns the night. Bold pickup, teasing control, and a body that knows exactly what it is doing.",
    theme: "neon-noir",
    characterId: "confident-bombshell",
    scenarioId: "bombshell-wants-you",
    role: "dom",
    mode: "immediate",
    intensity: 7,
    length: "medium",
    tags: ["Bombshell", "Confident", "You sub"],
    coverGradient: "from-rose-950 via-red-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "bombshell-melts-for-you",
    title: "Then She Melts",
    tagline: "Untouchable act drops. She falls for you mid-scene.",
    blurb:
      "Starts as pure confident bombshell hunger — then softens. She gets almost shy about how much she needs you. Heat plus real attachment.",
    theme: "velvet-night",
    characterId: "confident-bombshell",
    scenarioId: "bombshell-melts",
    role: "switch",
    mode: "romance",
    intensity: 6,
    length: "medium",
    tags: ["Bombshell", "Melt", "Romance"],
    coverGradient: "from-pink-950 via-rose-950 to-ink-950",
    accent: "pink",
  },
  {
    id: "bombshell-falls",
    title: "When the Act Drops",
    tagline: "She came to wreck you. She stays because she is falling.",
    blurb:
      "Power-to-feelings arc. Keep the chemistry; center the moment she cannot stay cool. Perfect 'she melts for you' direction.",
    theme: "sunset-glow",
    characterId: "confident-bombshell",
    scenarioId: "she-falls-for-you",
    role: "switch",
    mode: "romance",
    intensity: 5,
    length: "medium",
    tags: ["Romance", "Melt", "Emotional"],
    coverGradient: "from-amber-950 via-rose-950 to-ink-950",
    accent: "amber",
  },
  {
    id: "boss-you-sub",
    title: "Review: You Kneel",
    tagline: "Office power. Reader is the sub. Door locked.",
    blurb:
      "Classic after-hours boss energy with you on the yielding side. Heels, desk, clear orders.",
    theme: "neon-noir",
    characterId: "boss",
    scenarioId: "you-on-your-knees",
    role: "dom",
    mode: "immediate",
    intensity: 8,
    length: "medium",
    tags: ["You sub", "Office", "Domme"],
    coverGradient: "from-indigo-950 via-slate-950 to-ink-950",
    accent: "indigo",
  },
  {
    id: "masseuse-you-sub",
    title: "Table Turned",
    tagline: "Shy masseuse finds her spine. You follow her hands.",
    blurb:
      "Mila starts soft, then takes control of the room — oil, breath, and instructions. Shy-into-dom with service heat.",
    theme: "candle-library",
    characterId: "shy-masseuse",
    scenarioId: "shy-takes-control",
    role: "dom",
    mode: "slow-burn",
    intensity: 6,
    length: "medium",
    tags: ["Shy→Dom", "Massage", "You sub"],
    coverGradient: "from-emerald-950 via-teal-950 to-ink-950",
    accent: "emerald",
  },
];

function upsertById(arr, items, label) {
  let added = 0;
  let updated = 0;
  for (const item of items) {
    const i = arr.findIndex((x) => x.id === item.id);
    if (i >= 0) {
      arr[i] = item;
      updated++;
    } else {
      arr.push(item);
      added++;
    }
  }
  console.log(`${label}: +${added} new, ${updated} updated, total ${arr.length}`);
}

// Prefer dominant string roles used elsewhere when needed
for (const ch of newChars) {
  if (ch.defaultRole === "dominant") ch.defaultRole = "dominant";
  if (ch.defaultRole === "submissive") ch.defaultRole = "submissive";
}

upsertById(characters.characters, newChars, "characters");
upsertById(scenarios.scenarios, newScenarios, "scenarios");
upsertById(presets.presets, newPresets, "presets");

// Bump versions lightly
characters.version = "1.3.0";
scenarios.version = "1.3.0";
presets.version = "1.3.0";
presets.description =
  "Large one-click library: shy masseuse/barista, shy→dom, reader-as-sub, confident bombshell melt arcs, plus classic filth.";

// Put new flagship presets near the top for homepage discovery
const flagship = [
  "shy-masseuse-oil",
  "shy-barista-hearts",
  "shy-girl-leads",
  "bombshell-wants-you",
  "bombshell-melts-for-you",
  "you-kneel-soft",
  "reader-sub-training",
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
console.log("Done.");
