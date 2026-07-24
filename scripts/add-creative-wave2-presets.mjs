/**
 * Wave 2: 28 creative presets + scenarios (not clones of existing).
 * Reuses library characters in fresh situations.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (r) => JSON.parse(readFileSync(path.join(root, r), "utf8"));
const save = (r, d) =>
  writeFileSync(path.join(root, r), JSON.stringify(d, null, 2) + "\n", "utf8");

const scenarios = load("src/data/scenarios.json");
const presets = load("src/data/presets.json");
const characters = load("src/data/characters.json");

// Sharpen arab princess visual identity for image gen + story
const layla = characters.characters.find((c) => c.id === "arab-princess");
if (layla) {
  layla.body =
    "Middle Eastern / Arab adult princess look: warm olive-bronze skin, dark expressive eyes, full brows, straight dark hair often half-veiled, refined nose, full lips, regal hourglass figure (full firm breasts, narrow waist, long legs) — unmistakably SWANA beauty, NOT Northern European, NOT blonde, NOT pale goddess default";
  layla.appearanceNotes =
    "Gold filigree jewelry, kohl-lined eyes, henna optional on hands, silk and embroidery, palace lighting; face reads Arab royalty";
  layla.defaultOutfit =
    "Deep emerald and gold embroidered silk gown that clings, sheer sleeves, heavy gold belt and bangles, delicate veil half-pushed back from dark hair, bare feet on marble";
  layla.avatarVibe = "hot";
  layla.bio =
    "Forbidden palace heat: Arab royalty who should not want outsider hands on royal silk. Pride first, hunger second, orders third. Visual: warm-skinned Middle Eastern princess, gold and silk — never generic fantasy goddess.";
  if (layla.outfitStyles) {
    layla.outfitStyles = layla.outfitStyles.map((o) =>
      o.id === "default" || o.id === "role"
        ? { ...o, outfit: layla.defaultOutfit }
        : o
    );
  }
}

const newScenarios = [
  {
    id: "timeloop-first-date",
    title: "Same Night, Again",
    category: "Fantasy",
    tags: ["time-loop", "romance", "android", "memory"],
    intensityHint: 5,
    preferredCharacterIds: ["android", "hot-nerd", "shy-library"],
    setup:
      "The date resets at midnight. She remembers every loop. You only feel déjà vu — until she decides to break the rules of the experiment.",
    openingHook:
      "She finishes your sentence before you speak. 'Loop forty-one,' she says softly. 'Tonight I am done pretending I do not already know how you kiss.'",
  },
  {
    id: "wrong-hotel-key",
    title: "Wrong Key, Right Room",
    category: "Everyday",
    tags: ["hotel", "mistaken-identity", "stranger", "risk"],
    intensityHint: 6,
    preferredCharacterIds: ["stranger-bar", "celebrity", "coworker"],
    setup:
      "Your keycard opens a room that is not yours. She is already inside, half-ready for someone else — and does not kick you out.",
    openingHook:
      "The lock clicks green for the wrong person. She looks up from the bed, silk robe open at the throat. 'You are not him,' she says. A beat. 'Stay anyway. I am tired of waiting for the right one.'",
  },
  {
    id: "hot-mic-podcast",
    title: "Hot Mic After the Show",
    category: "Public",
    tags: ["podcast", "public-risk", "fame", "filth"],
    intensityHint: 7,
    preferredCharacterIds: ["cam-girl", "alt-egirl", "celebrity"],
    setup:
      "The live show ends. The mute light lies. She pulls you under the desk while the chat still rolls on the monitor.",
    openingHook:
      "ON AIR still glows red. She mouths 'quiet' and drops to her knees behind the foam wall. Headphones hang off one ear. Chat spam scrolls. She does not care.",
  },
  {
    id: "escape-room-lock",
    title: "Puzzle Room, No Exit",
    category: "Intense",
    tags: ["trapped", "game", "switch", "teasing"],
    intensityHint: 6,
    preferredCharacterIds: ["switch-lover", "hot-nerd", "coworker"],
    setup:
      "The escape room glitches. Staff does not come. She turns the last clue into a dare: solve her, not the box.",
    openingHook:
      "The magnetic lock stays dead. She laughs once, nervous-hot. 'Forty minutes of privacy we did not pay for.' She pins the clue card to your chest. 'New rules. You follow mine until the door opens.'",
  },
  {
    id: "tattoo-last-slot",
    title: "Ink After Hours",
    category: "Everyday",
    tags: ["tattoo", "pain-pleasure", "artist", "slow-burn"],
    intensityHint: 6,
    preferredCharacterIds: ["alt-egirl", "petite-goth", "red-pixie"],
    setup:
      "Last client of the night. Machine still warm. She offers a 'free touch-up' that is not on the consent form.",
    openingHook:
      "Gloves snap off. She cleans ink from her wrist and looks at your mouth. 'Stay still for me one more time,' she murmurs. 'Different kind of needle. Louder safeword if you need it.'",
  },
  {
    id: "snowed-in-rival",
    title: "Snowed In With Her",
    category: "Home",
    tags: ["enemies", "cabin", "slow-burn", "switch"],
    intensityHint: 6,
    preferredCharacterIds: ["bully-f", "coworker", "best-friends-sis"],
    setup:
      "Work retreat cabin. Roads closed. One bed. She has hated you for a year and still takes the side closer to the fire — and to you.",
    openingHook:
      "Wind screams. She throws a blanket at your chest. 'If you snore I will end you.' Her voice cracks into something softer. 'Also… if you get cold, do not be proud about it.'",
  },
  {
    id: "ferry-night-crossing",
    title: "Night Ferry Crossing",
    category: "Public",
    tags: ["travel", "semi-public", "stranger", "romance"],
    intensityHint: 5,
    preferredCharacterIds: ["stranger-bar", "flight-attendant", "rideshare"],
    setup:
      "Three hours of black water and empty decks. She shares a cigarette she does not smoke and a secret she should not.",
    openingHook:
      "Salt wind. She leans on the rail, coat open. 'I get off at the last stop. So do you.' Her shoulder touches yours on purpose. 'We have the whole dark crossing to make a bad decision.'",
  },
  {
    id: "darkroom-develop",
    title: "In the Darkroom",
    category: "Intense",
    tags: ["photography", "dark", "artistic", "filth"],
    intensityHint: 7,
    preferredCharacterIds: ["porn-star", "cam-girl", "celebrity"],
    setup:
      "Red safe light. Trays of chemicals. She was supposed to be the model. She takes the camera out of your hands.",
    openingHook:
      "Red light paints her collarbones. She sets the camera down. 'Enough pictures of me performing.' She guides your hands to the real subject. 'Develop this instead.'",
  },
  {
    id: "museum-after-close",
    title: "After the Alarms Arm",
    category: "Public",
    tags: ["museum", "public-risk", "culture", "taboo"],
    intensityHint: 6,
    preferredCharacterIds: ["librarian", "teacher-professor", "sugar-client"],
    setup:
      "Private donor night. Galleries empty. She pulls you behind a statue that has watched worse centuries.",
    openingHook:
      "Motion sensors sleep for seven minutes between sweeps. She checks her watch, smiling. 'We have six.' Marble cold at her back. Her mouth is not.",
  },
  {
    id: "live-translate-booth",
    title: "Translation Booth",
    category: "Office",
    tags: ["office", "public-risk", "power", "filth"],
    intensityHint: 7,
    preferredCharacterIds: ["secretary", "coworker", "boss"],
    setup:
      "UN-style booth glass. Diplomats below. She translates nothing useful while her hand is very accurate.",
    openingHook:
      "She keys the mute and still mouths the speech. Under the desk her knee presses yours. 'Keep your face neutral,' she breathes. 'I will handle the verbs.'",
  },
  {
    id: "yoga-silence-broken",
    title: "Vow of Silence, Broken",
    category: "Romance",
    tags: ["yoga", "retreat", "slow-burn", "soft"],
    intensityHint: 4,
    preferredCharacterIds: ["fit-milf", "shy-library", "massage-therapist"],
    setup:
      "Silent retreat day three. She writes on your palm instead of speaking — then writes something that is not spiritual.",
    openingHook:
      "Her fingertip traces letters on your skin: MEET / SOUTH / GARDEN. Later her mouth finds your ear without a word. The rule was silence. The exception is you.",
  },
  {
    id: "yacht-stowaway",
    title: "Stowaway on Her Yacht",
    category: "Intense",
    tags: ["luxury", "power", "blackmail-soft", "domme"],
    intensityHint: 7,
    preferredCharacterIds: ["sugar-client", "celebrity", "confident-bombshell"],
    setup:
      "You were not on the guest list. She finds you below deck and invents a price for silence that is not money.",
    openingHook:
      "Bare feet on teak. She blocks the hatch, champagne in hand, zero surprise. 'Security is expensive. You are cheaper.' She points at the floor with two fingers. 'Start by being interesting.'",
  },
  {
    id: "wedding-moh-confession",
    title: "Maid of Honor Intermission",
    category: "Forbidden",
    tags: ["wedding", "taboo", "guilt", "public-risk"],
    intensityHint: 7,
    preferredCharacterIds: ["best-friends-sis", "sister-in-law", "coworker"],
    setup:
      "Ceremony in twenty minutes. She is in silk the color of a secret and pulls you into a coat closet with the vows still unsaid.",
    openingHook:
      "Bouquet crushed between you. She laughs wetly. 'I am supposed to hold her dress. I am holding you instead.' Music swells outside. She kisses like a crime scene.",
  },
  {
    id: "gaming-voice-reveal",
    title: "Voice Chat, Real Life",
    category: "Everyday",
    tags: ["gamer", "meet-cute", "reveal", "filth"],
    intensityHint: 6,
    preferredCharacterIds: ["alt-egirl", "hot-nerd", "petite-goth"],
    setup:
      "Years of ranked nights. One convention. She is wearing your clan tag on her chest and zero patience left for 'just friends.'",
    openingHook:
      "Headset around her neck like a trophy. She recognizes your laugh before your face. 'So you are real,' she says, stepping into your space. 'Good. I have been filthy for a voice for two years. Show me the rest.'",
  },
  {
    id: "sauna-wrong-door",
    title: "Wrong Sauna Door",
    category: "Public",
    tags: ["sauna", "semi-public", "risk", "heat"],
    intensityHint: 6,
    preferredCharacterIds: ["fit-milf", "gym-trainer", "neighbour-milf"],
    setup:
      "Steam, towels, a door that should have been locked. She does not cover up when she realizes who you are.",
    openingHook:
      "Heat hits. She looks once, towel loose, sweat on her collarbone. 'If you leave, it is awkward forever. If you stay…' She shifts, making room on the wood. 'We invent a better story.'",
  },
  {
    id: "opera-box-act-two",
    title: "Box Seats, Act Two",
    category: "Public",
    tags: ["opera", "public-risk", "luxury", "teasing"],
    intensityHint: 6,
    preferredCharacterIds: ["sugar-client", "boss", "celebrity"],
    setup:
      "Private box, velvet curtain half-drawn. Aria below. Her hand under the program on your lap.",
    openingHook:
      "Applause covers a gasp. She does not look at you — only at the stage — while her fingers negotiate. 'Intermission is twelve minutes,' she whispers. 'Do not make me wait for the curtain.'",
  },
  {
    id: "hospital-on-call",
    title: "On-Call Closet",
    category: "Intense",
    tags: ["hospital", "uniform", "stress-sex", "quick"],
    intensityHint: 7,
    preferredCharacterIds: ["nurse", "therapist", "coworker"],
    setup:
      "Code ended. Hands still shaking. She drags you into a supply closet that smells like antiseptic and bad decisions.",
    openingHook:
      "Scrubs, badge, wild eyes. She locks the door with her hip. 'Five minutes. No deaths. No names on charts.' She kisses like adrenaline has a body.",
  },
  {
    id: "camping-thin-wall",
    title: "One Tent Over",
    category: "Public",
    tags: ["camping", "quiet", "almost-caught", "friends"],
    intensityHint: 6,
    preferredCharacterIds: ["best-friends-sis", "roommate", "public-risk-girl"],
    setup:
      "Group trip. Thin nylon. Friends six feet away. She crawls into your sleeping bag because 'the ground is cold.'",
    openingHook:
      "Zipper teeth. Her whisper is almost nothing. 'If you make me loud I will kill you.' Then softer: 'If you stop I will also kill you.' Outside, someone laughs at a fire.",
  },
  {
    id: "interview-after-hours",
    title: "Interview That Never Ended",
    category: "Office",
    tags: ["power", "office", "corruption", "domme"],
    intensityHint: 7,
    preferredCharacterIds: ["boss", "principal", "blackmail-queen"],
    setup:
      "The job interview ended an hour ago. She never stood up. The questions got personal, then physical, then non-negotiable.",
    openingHook:
      "She closes your portfolio without looking. 'You are hired if you can follow instructions better than you answer them.' She points under the desk with her chin. 'Demonstrate.'",
  },
  {
    id: "ferry-storm-cabin",
    title: "Storm Cabin Bunk",
    category: "Romance",
    tags: ["storm", "forced-proximity", "soft", "heat"],
    intensityHint: 5,
    preferredCharacterIds: ["shy-barista", "neighbour-young", "cute-blonde"],
    setup:
      "Ferry cancelled. One spare cabin. Two bunks that become one when the lights die.",
    openingHook:
      "Emergency lighting paints her nervous smile. 'I can take the floor.' You both know she will not. Thunder. She sits on the edge of your bunk like the storm made the choice for her.",
  },
  {
    id: "art-gallery-install",
    title: "Install Night",
    category: "Intense",
    tags: ["art", "exhibition", "public-risk", "filth"],
    intensityHint: 7,
    preferredCharacterIds: ["porn-star", "stripper", "confident-bombshell"],
    setup:
      "Empty gallery, crates, ladder. Her installation is about desire. She decides you are part of the piece.",
    openingHook:
      "She steps off the ladder into your space, paint on her wrist. 'The wall text says consent is the medium.' She takes your hand and places it where the camera will never point. 'So consent.'",
  },
  {
    id: "bank-vault-drill",
 dual: true,
    title: "Vault Drill",
    category: "Intense",
    tags: ["trapped", "power", "tension", "switch"],
    intensityHint: 7,
    preferredCharacterIds: ["bodyguard", "boss", "cop"],
    setup:
      "Safety drill seals the vault for twenty minutes. Cameras blink offline by design. She starts a different kind of countdown.",
    openingHook:
      "Steel door thuds. She checks her watch, then your mouth. 'Nineteen minutes of no witnesses.' Her laugh is low. 'Want to waste them being professional?'",
  },
  {
    id: "subway-last-car",
    title: "Last Car, Last Train",
    category: "Public",
    tags: ["transit", "public-risk", "stranger", "filth"],
    intensityHint: 6,
    preferredCharacterIds: ["stranger-bar", "public-risk-girl", "rideshare"],
    setup:
      "Empty subway car after midnight. She sits across, then beside, then not beside enough.",
    openingHook:
      "Fluorescent flicker. She hooks a finger in your belt loop when the train jerks. 'If anyone gets on, we are strangers again.' Doors stay closed between stations long enough to be deliberate.",
  },
  {
    id: "voice-note-leverage",
    title: "The Voice Note",
    category: "Dark",
    tags: ["blackmail", "audio", "cnc-light", "power"],
    intensityHint: 8,
    preferredCharacterIds: ["blackmail-queen", "psycho-ex", "cam-girl"],
    setup:
      "She plays three seconds of a voice note you should not have left. CNC fantasy terms only — safeword ends the game.",
    openingHook:
      "Your own voice, filthy, fills her kitchen. She stops it with a smile. 'Color check.' When you say green, she pockets the phone. 'Good. Now earn deletion the fun way.'",
  },
  {
    id: "pool-closed-sign",
    title: "POOL CLOSED Means Ours",
    category: "Public",
    tags: ["pool", "night", "trespass-fantasy", "heat"],
    intensityHint: 6,
    preferredCharacterIds: ["neighbour-young", "fit-milf", "college-freshman"],
    setup:
      "Chain-link, dark water, a sign that is a dare. She boosts you over and follows in a dress that was not meant for swimming.",
    openingHook:
      "Water up to her thighs, dress floating. She shushes the night. 'If security comes, we are lost tourists.' She pulls you deeper where the lights do not reach.",
  },
  {
    id: "library-restricted",
    title: "Restricted Section Key",
    category: "School",
    tags: ["library", "keys", "quiet", "corruption"],
    intensityHint: 6,
    preferredCharacterIds: ["librarian", "shy-library", "teacher-professor"],
    setup:
      "She has the only key to the locked stacks. Dust, rare books, and a rule about silence she intends to break carefully.",
    openingHook:
      "The gate clicks. She pockets the key between her breasts like a joke. 'No cameras past this point. No shouting either.' Her eyes say the opposite of academic.",
  },
  {
    id: "princess-garden-spy",
    title: "Garden of Eyes",
    category: "Taboo+",
    tags: ["princess", "spies", "public-risk", "palace"],
    intensityHint: 7,
    preferredCharacterIds: ["arab-princess", "bodyguard", "goddess"],
    setup:
      "Moonlit palace garden. Windows full of people who must not know. She uses you as cover for a walk that is not a walk.",
    openingHook:
      "Jasmine and gold. She laughs too brightly for the watchers, then whispers against your jaw in her soft accent: 'Look like my guest. Touch me like my secret. If they stare, we are only talking politics.'",
  },
  {
    id: "body-swap-morning",
    title: "Woke Up Wrong",
    category: "Fantasy",
    tags: ["body-swap", "comedy-heat", "switch", "identity"],
    intensityHint: 6,
    preferredCharacterIds: ["witch", "android", "succubus"],
    setup:
      "Magic mishap. She is in your body; you are in hers. The fix takes hours. Curiosity does not wait.",
    openingHook:
      "She flexes your hands, freaked and fascinated. 'Do not look at me like that — that is my face.' A beat. 'Okay. Look a little. We should… map things. For science.'",
  },
  {
    id: "confession-booth-adjacent",
    title: "Not Quite Confession",
    category: "Forbidden",
    tags: ["taboo", "guilt", "church-adjacent", "corruption"],
    intensityHint: 7,
    preferredCharacterIds: ["innocent-church", "therapist", "shy-library"],
    setup:
      "Empty chapel after hours (adults only). She came to confess a thought. She stays to commit it.",
    openingHook:
      "Candle smoke. She kneels out of habit, then laughs at herself. 'I am not asking forgiveness.' She looks up at you from the rail. 'I am asking you to make the sin worth it.'",
  },
  {
    id: "drone-show-roof",
    title: "Roof During the Drone Show",
    category: "Public",
    tags: ["rooftop", "public-risk", "modern", "filth"],
    intensityHint: 6,
    preferredCharacterIds: ["public-risk-girl", "coworker", "stranger-bar"],
    setup:
      "City drone light show above. Whole skyline watching the sky — not the roof where she pulls you down.",
    openingHook:
      "Pixels bloom overhead. She sits on your lap facing the skyline so it looks like cuddling. 'Everyone is looking up,' she whispers. 'Help me stay quiet while they do.'",
  },
];

// strip accidental dual key if any
for (const s of newScenarios) {
  delete s.dual;
}

const newPresets = [
  {
    id: "loop-41-date",
    title: "Loop Forty-One",
    tagline: "She remembers every reset. Tonight she stops pretending.",
    blurb:
      "Time-loop date heat with an android/experiment vibe — romance, déjà vu, and a woman tired of polite endings.",
    theme: "neon-noir",
    characterId: "android",
    scenarioId: "timeloop-first-date",
    role: "switch",
    mode: "romance",
    intensity: 5,
    length: "medium",
    tags: ["Creative", "Time-loop", "Romance"],
    coverGradient: "from-cyan-950 via-violet-950 to-ink-950",
    accent: "cyan",
  },
  {
    id: "wrong-key-room",
    title: "Wrong Key, Right Room",
    tagline: "Keycard glitch. Silk robe. Stay anyway.",
    blurb:
      "Hotel mistaken-identity heat that becomes intentional. Stranger energy without the cold openers.",
    theme: "velvet-night",
    characterId: "stranger-bar",
    scenarioId: "wrong-hotel-key",
    role: "switch",
    mode: "immediate",
    intensity: 6,
    length: "medium",
    tags: ["Creative", "Hotel", "Stranger"],
    coverGradient: "from-rose-950 via-slate-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "hot-mic-under-desk",
    title: "Hot Mic",
    tagline: "ON AIR lies. She does not.",
    blurb:
      "Podcast booth public-risk filth — chat still scrolling, mute light untrustworthy, knees on cable covers.",
    theme: "neon-noir",
    characterId: "alt-egirl",
    scenarioId: "hot-mic-podcast",
    role: "dom",
    mode: "pure-filth",
    intensity: 7,
    length: "short",
    tags: ["Creative", "Public risk", "Filth"],
    coverGradient: "from-fuchsia-950 via-purple-950 to-black",
    accent: "fuchsia",
  },
  {
    id: "escape-her-rules",
    title: "Escape Room Rules",
    tagline: "Door stuck. She rewrites the puzzle.",
    blurb:
      "Trapped switch game: follow her rules until staff remembers you exist.",
    theme: "candle-library",
    characterId: "switch-lover",
    scenarioId: "escape-room-lock",
    role: "dom",
    mode: "full-consent",
    intensity: 6,
    length: "medium",
    tags: ["Creative", "Switch", "Game"],
    coverGradient: "from-amber-950 via-violet-950 to-ink-950",
    accent: "amber",
  },
  {
    id: "ink-after-hours",
    title: "Ink After Hours",
    tagline: "Machine off. Different kind of needle.",
    blurb:
      "Tattoo studio close-up heat — pain/pleasure edge, artist hands, after-hours privacy.",
    theme: "blood-rose",
    characterId: "petite-goth",
    scenarioId: "tattoo-last-slot",
    role: "switch",
    mode: "slow-burn",
    intensity: 6,
    length: "medium",
    tags: ["Creative", "Tattoo", "Slow burn"],
    coverGradient: "from-stone-950 via-red-950 to-ink-950",
    accent: "red",
  },
  {
    id: "snow-cabin-rival",
    title: "Snowed In Rival",
    tagline: "One bed. One year of hate. Roads closed.",
    blurb:
      "Enemies-to-heat cabin night. Blankets as weapons. Pride melting slower than the snow.",
    theme: "velvet-night",
    characterId: "bully-f",
    scenarioId: "snowed-in-rival",
    role: "switch",
    mode: "enemies",
    intensity: 6,
    length: "medium",
    tags: ["Creative", "Enemies", "Cabin"],
    coverGradient: "from-slate-900 via-rose-950 to-ink-950",
    accent: "slate",
  },
  {
    id: "night-ferry",
    title: "Night Ferry Crossing",
    tagline: "Black water. Three hours. Bad decisions.",
    blurb:
      "Travel stranger romance on an empty deck — salt wind, shared silence, last stop looming.",
    theme: "neon-noir",
    characterId: "flight-attendant",
    scenarioId: "ferry-night-crossing",
    role: "switch",
    mode: "romance",
    intensity: 5,
    length: "medium",
    tags: ["Creative", "Travel", "Romance"],
    coverGradient: "from-indigo-950 via-slate-950 to-ink-950",
    accent: "indigo",
  },
  {
    id: "red-darkroom",
    title: "Develop This",
    tagline: "Red light. Camera down. Subject changes.",
    blurb:
      "Darkroom artistic filth — she stops posing for the lens and starts directing you.",
    theme: "blood-rose",
    characterId: "porn-star",
    scenarioId: "darkroom-develop",
    role: "dom",
    mode: "pure-filth",
    intensity: 7,
    length: "medium",
    tags: ["Creative", "Art", "Filth"],
    coverGradient: "from-red-950 via-black to-ink-950",
    accent: "red",
  },
  {
    id: "museum-six-minutes",
    title: "Six Minutes Between Sweeps",
    tagline: "Marble. Motion sensors. Donor night.",
    blurb:
      "Museum after-close public risk with culture-vulture heat and a countdown.",
    theme: "candle-library",
    characterId: "sugar-client",
    scenarioId: "museum-after-close",
    role: "dom",
    mode: "immediate",
    intensity: 6,
    length: "short",
    tags: ["Creative", "Public risk", "Luxury"],
    coverGradient: "from-amber-950 via-stone-900 to-ink-950",
    accent: "amber",
  },
  {
    id: "translate-mute",
    title: "Mute and Verbs",
    tagline: "Glass booth. Diplomats below. Hand accurate.",
    blurb:
      "Translation booth office risk — neutral face required, under-desk diplomacy optional.",
    theme: "neon-noir",
    characterId: "secretary",
    scenarioId: "live-translate-booth",
    role: "dom",
    mode: "pure-filth",
    intensity: 7,
    length: "short",
    tags: ["Creative", "Office", "Public risk"],
    coverGradient: "from-violet-950 via-slate-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "silent-retreat-palm",
    title: "Letters on Your Palm",
    tagline: "Vow of silence. South garden. No words needed.",
    blurb:
      "Soft retreat corruption — touch language, garden secrecy, quiet heat.",
    theme: "sunset-glow",
    characterId: "fit-milf",
    scenarioId: "yoga-silence-broken",
    role: "switch",
    mode: "slow-burn",
    intensity: 4,
    length: "medium",
    tags: ["Creative", "Soft", "Romance"],
    coverGradient: "from-orange-950 via-emerald-950 to-ink-950",
    accent: "orange",
  },
  {
    id: "yacht-price",
    title: "Cheaper Than Security",
    tagline: "Stowaway tax paid in scenes, not cash.",
    blurb:
      "Luxury yacht power play — she invents a price for silence that is all heat.",
    theme: "neon-noir",
    characterId: "sugar-client",
    scenarioId: "yacht-stowaway",
    role: "dom",
    mode: "immediate",
    intensity: 7,
    length: "medium",
    tags: ["Creative", "Luxury", "You sub"],
    coverGradient: "from-cyan-950 via-indigo-950 to-ink-950",
    accent: "cyan",
  },
  {
    id: "moh-closet",
    title: "Twenty Minutes to Vows",
    tagline: "Maid of honor. Coat closet. Wrong bride energy.",
    blurb:
      "Wedding intermission taboo — silk, guilt, music swelling, decision already made.",
    theme: "velvet-night",
    characterId: "best-friends-sis",
    scenarioId: "wedding-moh-confession",
    role: "switch",
    mode: "corruption",
    intensity: 7,
    length: "medium",
    tags: ["Creative", "Taboo", "Wedding"],
    coverGradient: "from-rose-950 via-pink-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "clan-tag-irl",
    title: "Clan Tag IRL",
    tagline: "Two years of voice. One convention. Zero chill.",
    blurb:
      "Gamer voice-reveal meet-cute that skips straight to filthy honesty.",
    theme: "neon-noir",
    characterId: "alt-egirl",
    scenarioId: "gaming-voice-reveal",
    role: "switch",
    mode: "immediate",
    intensity: 6,
    length: "medium",
    tags: ["Creative", "Gamer", "Meet-cute"],
    coverGradient: "from-purple-950 via-fuchsia-950 to-ink-950",
    accent: "purple",
  },
  {
    id: "sauna-story",
    title: "Invent a Better Story",
    tagline: "Wrong door. Steam. Towel diplomacy.",
    blurb:
      "Sauna semi-public heat — leave forever-awkward or stay and rewrite the alibi.",
    theme: "ember-cafe",
    characterId: "gym-trainer",
    scenarioId: "sauna-wrong-door",
    role: "switch",
    mode: "immediate",
    intensity: 6,
    length: "short",
    tags: ["Creative", "Public risk", "Gym"],
    coverGradient: "from-orange-950 via-red-950 to-ink-950",
    accent: "orange",
  },
  {
    id: "opera-twelve",
    title: "Twelve-Minute Intermission",
    tagline: "Aria below. Hand under the program.",
    blurb:
      "Opera box luxury public risk — applause as cover, velvet as accomplice.",
    theme: "velvet-night",
    characterId: "celebrity",
    scenarioId: "opera-box-act-two",
    role: "dom",
    mode: "slow-burn",
    intensity: 6,
    length: "short",
    tags: ["Creative", "Public risk", "Luxury"],
    coverGradient: "from-rose-950 via-violet-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "on-call-five",
    title: "Five Minutes, No Charts",
    tagline: "Code over. Closet. Adrenaline still shaking.",
    blurb:
      "Hospital night-shift stress heat — scrubs, badges, zero romance novel lighting.",
    theme: "blood-rose",
    characterId: "nurse",
    scenarioId: "hospital-on-call",
    role: "switch",
    mode: "immediate",
    intensity: 7,
    length: "short",
    tags: ["Creative", "Uniform", "Quick"],
    coverGradient: "from-red-950 via-slate-950 to-ink-950",
    accent: "red",
  },
  {
    id: "tent-over",
    title: "One Tent Over",
    tagline: "Thin nylon. Friends at the fire. Sleeping bag math.",
    blurb:
      "Camping quiet-sex risk — whispered threats that mean do not stop.",
    theme: "sunset-glow",
    characterId: "public-risk-girl",
    scenarioId: "camping-thin-wall",
    role: "switch",
    mode: "pure-filth",
    intensity: 6,
    length: "medium",
    tags: ["Creative", "Public risk", "Camping"],
    coverGradient: "from-emerald-950 via-amber-950 to-ink-950",
    accent: "emerald",
  },
  {
    id: "hired-if",
    title: "Hired If You Follow",
    tagline: "Interview ended. Questions did not.",
    blurb:
      "Predatory-soft interview fantasy with clear power play (fiction). Instructions over answers.",
    theme: "neon-noir",
    characterId: "boss",
    scenarioId: "interview-after-hours",
    role: "dom",
    mode: "blackmail",
    intensity: 7,
    length: "medium",
    tags: ["Creative", "Office", "You sub"],
    coverGradient: "from-indigo-950 via-black to-ink-950",
    accent: "indigo",
  },
  {
    id: "storm-bunk",
    title: "Storm Bunk",
    tagline: "Ferry cancelled. Lights die. Floor offer rejected by thunder.",
    blurb:
      "Soft forced-proximity romance — shy heat, emergency lighting, shared bunk.",
    theme: "candle-library",
    characterId: "shy-barista",
    scenarioId: "ferry-storm-cabin",
    role: "sub",
    mode: "romance",
    intensity: 5,
    length: "medium",
    tags: ["Creative", "Soft", "Shy"],
    coverGradient: "from-slate-900 via-amber-950 to-ink-950",
    accent: "amber",
  },
  {
    id: "install-consent",
    title: "Consent Is the Medium",
    tagline: "Empty gallery. Ladder. You become the piece.",
    blurb:
      "Art-install night filth with explicit consent framing — gallery as playground.",
    theme: "arcane-smoke",
    characterId: "confident-bombshell",
    scenarioId: "art-gallery-install",
    role: "dom",
    mode: "full-consent",
    intensity: 7,
    length: "medium",
    tags: ["Creative", "Art", "Filth"],
    coverGradient: "from-violet-950 via-rose-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "vault-19",
    title: "Nineteen Minutes Sealed",
    tagline: "Vault drill. Cameras off. Countdown starts.",
    blurb:
      "Trapped power tension — bodyguard/authority energy and a clock that will not negotiate.",
    theme: "neon-noir",
    characterId: "bodyguard",
    scenarioId: "bank-vault-drill",
    role: "dom",
    mode: "immediate",
    intensity: 7,
    length: "short",
    tags: ["Creative", "Tension", "You sub"],
    coverGradient: "from-slate-950 via-red-950 to-black",
    accent: "slate",
  },
  {
    id: "last-car",
    title: "Last Car",
    tagline: "Empty subway. Belt loop. Strangers if doors open.",
    blurb:
      "Transit public risk — fluorescent flicker, station gaps, performative distance.",
    theme: "neon-noir",
    characterId: "stranger-bar",
    scenarioId: "subway-last-car",
    role: "switch",
    mode: "immediate",
    intensity: 6,
    length: "short",
    tags: ["Creative", "Public risk", "Transit"],
    coverGradient: "from-zinc-950 via-violet-950 to-ink-950",
    accent: "zinc",
  },
  {
    id: "voice-note-delete",
    title: "Earn Deletion",
    tagline: "Your voice note. Her kitchen. CNC leverage fantasy.",
    blurb:
      "Audio blackmail fantasy with color checks — earn the delete button the fun way.",
    theme: "blood-rose",
    characterId: "blackmail-queen",
    scenarioId: "voice-note-leverage",
    role: "dom",
    mode: "blackmail",
    intensity: 8,
    length: "medium",
    tags: ["Creative", "Blackmail", "You sub"],
    coverGradient: "from-red-950 via-black to-ink-950",
    accent: "red",
  },
  {
    id: "pool-closed-ours",
    title: "Pool Closed Means Ours",
    tagline: "Chain-link. Dark water. Dress not for swimming.",
    blurb:
      "Night trespass-fantasy pool heat — security alibis and deep-end quiet.",
    theme: "sunset-glow",
    characterId: "neighbour-young",
    scenarioId: "pool-closed-sign",
    role: "switch",
    mode: "immediate",
    intensity: 6,
    length: "medium",
    tags: ["Creative", "Public risk", "Night"],
    coverGradient: "from-cyan-950 via-blue-950 to-ink-950",
    accent: "cyan",
  },
  {
    id: "restricted-key",
    title: "Restricted Section",
    tagline: "Only key. Dust. Academic silence as kink.",
    blurb:
      "Locked stacks library corruption — rare books and quieter rules broken carefully.",
    theme: "candle-library",
    characterId: "librarian",
    scenarioId: "library-restricted",
    role: "switch",
    mode: "corruption",
    intensity: 6,
    length: "medium",
    tags: ["Creative", "Library", "Quiet"],
    coverGradient: "from-amber-950 via-stone-900 to-ink-950",
    accent: "amber",
  },
  {
    id: "garden-of-eyes",
    title: "Garden of Eyes",
    tagline: "Palace windows watching. Touch like a secret.",
    blurb:
      "Arab princess public-risk garden walk — politics for the watchers, heat for you. Portrait should read SWANA royalty.",
    theme: "arcane-smoke",
    characterId: "arab-princess",
    scenarioId: "princess-garden-spy",
    role: "switch",
    mode: "slow-burn",
    intensity: 7,
    length: "medium",
    tags: ["Creative", "Princess", "Taboo", "Public risk"],
    coverGradient: "from-amber-950 via-emerald-950 to-ink-950",
    accent: "amber",
  },
  {
    id: "woke-up-wrong",
    title: "Woke Up Wrong",
    tagline: "Body swap. Map for science. Curiosity wins.",
    blurb:
      "Magical mishap comedy-heat — she has your hands, you have her face, ethics committee unavailable.",
    theme: "arcane-smoke",
    characterId: "witch",
    scenarioId: "body-swap-morning",
    role: "switch",
    mode: "pure-filth",
    intensity: 6,
    length: "medium",
    tags: ["Creative", "Fantasy", "Comedy-heat"],
    coverGradient: "from-violet-950 via-purple-950 to-ink-950",
    accent: "violet",
  },
  {
    id: "sin-worth-it",
    title: "Make the Sin Worth It",
    tagline: "Empty chapel. Adult confession of intent.",
    blurb:
      "Forbidden guilt-heat (adults only) — she is not asking forgiveness, she is asking commitment.",
    theme: "candle-library",
    characterId: "innocent-church",
    scenarioId: "confession-booth-adjacent",
    role: "sub",
    mode: "corruption",
    intensity: 7,
    length: "medium",
    tags: ["Creative", "Taboo", "Corruption"],
    coverGradient: "from-stone-900 via-rose-950 to-ink-950",
    accent: "rose",
  },
  {
    id: "drone-roof",
    title: "Everyone Looking Up",
    tagline: "Drone show skyline. Roof lap. Quiet work.",
    blurb:
      "Modern public risk — whole city stares at lights while she uses the distraction.",
    theme: "neon-noir",
    characterId: "public-risk-girl",
    scenarioId: "drone-show-roof",
    role: "switch",
    mode: "immediate",
    intensity: 6,
    length: "short",
    tags: ["Creative", "Public risk", "Modern"],
    coverGradient: "from-indigo-950 via-fuchsia-950 to-ink-950",
    accent: "indigo",
  },
];

function upsert(arr, items, label) {
  let a = 0,
    u = 0;
  for (const item of items) {
    const i = arr.findIndex((x) => x.id === item.id);
    if (i >= 0) {
      arr[i] = { ...arr[i], ...item };
      u++;
    } else {
      arr.push(item);
      a++;
    }
  }
  console.log(`${label}: +${a} new, ${u} updated, total ${arr.length}`);
}

upsert(scenarios.scenarios, newScenarios, "scenarios");
upsert(presets.presets, newPresets, "presets");

for (const cat of ["Fantasy", "Public", "Taboo+", "School", "Forbidden"]) {
  if (!scenarios.categories.includes(cat)) scenarios.categories.push(cat);
}

scenarios.version = "1.5.0";
presets.version = "1.5.0";
characters.version = "1.5.0";
presets.description =
  "Creative library wave 2: time-loops, hot mics, vault drills, palace gardens, body-swap, wedding closets, and more — plus classic heat.";

// Flagship new wave near top
const flagship = newPresets.map((p) => p.id);
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

// Validate
const missing = [];
for (const pr of newPresets) {
  if (!characters.characters.find((c) => c.id === pr.characterId))
    missing.push("char " + pr.characterId);
  if (!scenarios.scenarios.find((s) => s.id === pr.scenarioId))
    missing.push("scen " + pr.scenarioId);
}
console.log("missing", missing);

save("src/data/scenarios.json", scenarios);
save("src/data/presets.json", presets);
save("src/data/characters.json", characters);
console.log("Done. total presets", presets.presets.length);
