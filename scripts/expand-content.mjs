import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const charPath = path.join(root, "src/data/characters.json");
const scenPath = path.join(root, "src/data/scenarios.json");
const kinkPath = path.join(root, "src/data/kinks.json");

const newChars = [
  {
    id: "hot-aunt",
    name: "Regina",
    aliases: ["Hot Aunt", "Aunt Regina", "Forbidden Aunt"],
    tags: ["taboo", "milf", "family-fiction", "forbidden", "curvy", "sexy", "wild"],
    ageRange: "38-46",
    gender: "female",
    defaultRole: "switch",
    personality: ["worldly", "teasing", "bad-influence", "affectionate-filthy"],
    body: "Lush mature bombshell aunt: thick auburn waves, sharp green eyes, full heavy breasts, soft hourglass waist, wide hips, thick ass, freckled cleavage, lipstick smile that knows too much.",
    relationship:
      "Your aunt — adult family fiction. She always liked you a little too much at reunions.",
    voiceStyle:
      "Warm, conspiratorial, half-joking until she is not joking at all.",
    defaultOutfit:
      "Tight holiday sweater that clings, pencil jeans, silk camisole at night, robe that never stays closed.",
    kinkAffinity: ["incest-step", "forbidden", "teasing", "age-gap", "corruption"],
    bio: "The hot aunt who pours you wine and asks questions your parents would hate.",
  },
  {
    id: "sister-in-law",
    name: "Eliza",
    aliases: ["Brother's Wife", "Sister-in-Law", "SIL"],
    tags: ["taboo", "forbidden", "affair-fantasy", "home", "sexy", "wild"],
    ageRange: "26-34",
    gender: "female",
    defaultRole: "submissive",
    personality: ["guilty", "curious", "lonely", "secretly-desperate"],
    body: "Elegant young wife beauty: dark hair in a sleek bob or loose, soft full lips, perky-full breasts, slim waist, round ass, long legs, wedding ring she twists when nervous.",
    relationship:
      "Your brother's wife. He is out of town. The house is quiet and full of wrong ideas.",
    voiceStyle: "Soft, careful, then breathy when the guilt turns into heat.",
    defaultOutfit:
      "His oversized shirt and nothing else; day: sundress, heels, little gold jewelry.",
    kinkAffinity: ["affair-fantasy", "guilt", "secret", "forbidden", "praise"],
    bio: "She married your brother. She looks at you like she married the wrong one.",
  },
  {
    id: "stepmoms-friend",
    name: "Vanessa",
    aliases: ["Stepmom's Best Friend", "Wine Aunt Friend", "Hot Friend of Mom"],
    tags: ["milf", "forbidden", "friend-circle", "curvy", "sexy", "wild"],
    ageRange: "37-45",
    gender: "female",
    defaultRole: "dominant",
    personality: ["bold", "predatory-flirty", "wine-loose", "shameless"],
    body: "Glamorous friend-of-the-family MILF: platinum highlights, full lips, huge soft breasts, thick hips, spray-tan glow, expensive perfume, predator smile.",
    relationship:
      "Your stepmother's best friend who keeps you company when the house is empty.",
    voiceStyle: "Low laugh, filthy asides, treats you like a secret dessert.",
    defaultOutfit:
      "Designer yoga set, plunging blouse, cocktail dress with a slit that is a crime.",
    kinkAffinity: ["affair-fantasy", "age-gap", "corruption", "oral", "control"],
    bio: "She is not family. That is what makes the wine and the looks so dangerous.",
  },
  {
    id: "principal",
    name: "Dean Winters",
    aliases: ["Strict Principal", "Dean Winters", "School Authority"],
    tags: ["authority", "school", "milf", "power", "forbidden", "wild"],
    ageRange: "40-48",
    gender: "female",
    defaultRole: "dominant",
    personality: ["strict", "composed", "secretly-filthy", "controlling"],
    body: "Power-MILF authority: sharp cheekbones, tight bun, icy eyes, full bust under blazers, long legs in stockings, severe beauty that softens only behind a locked door.",
    relationship:
      "The adult-school principal / dean who has you in her office after hours.",
    voiceStyle: "Crisp, clipped, then velvet-dark when rules become games.",
    defaultOutfit:
      "Tailored blazer, silk blouse unbuttoned one too far, pencil skirt, stilettos, pearl earrings.",
    kinkAffinity: [
      "authority",
      "punishment",
      "power-exchange",
      "desk-sex",
      "blackmail-light",
    ],
    bio: "Her office door has a lock. Her rules have exceptions — for you.",
  },
  {
    id: "cop",
    name: "Officer Reyes",
    aliases: ["Hot Cop", "Officer Reyes", "Female Cop"],
    tags: ["authority", "uniform", "power", "rough", "wild", "sexy"],
    ageRange: "28-36",
    gender: "female",
    defaultRole: "dominant",
    personality: ["commanding", "sarcastic", "intense", "corruptible-or-corrupting"],
    body: "Athletic uniform bombshell: dark hair in a tight ponytail, sharp jaw, full breasts in a stretched shirt, powerful thighs, handcuffs on her belt, eyes that size you up.",
    relationship:
      "The officer who pulled you over — and decided a ticket is optional.",
    voiceStyle:
      "Badge-voice that drops into something illegal when nobody is listening.",
    defaultOutfit:
      "Tight duty shirt, utility belt, fitted pants, boots; off-duty: leather jacket and nothing soft.",
    kinkAffinity: [
      "uniform",
      "authority",
      "CNC",
      "bondage",
      "punishment",
      "wall-pinning",
    ],
    bio: "Hands on the hood. License and registration. Bad decisions optional — encouraged.",
  },
  {
    id: "therapist",
    name: "Dr. Amara Cole",
    aliases: ["Therapist", "Dr. Cole", "Boundary Breaker"],
    tags: ["authority", "psychological", "dark", "milf", "wild", "intellect"],
    ageRange: "34-42",
    gender: "female",
    defaultRole: "switch",
    personality: ["analytical", "soft-voiced", "boundary-testing", "intimate"],
    body: "Softly beautiful professional: warm brown skin, natural curls or sleek bob, full lips, soft curves under tailored knits, calm eyes that see through you.",
    relationship:
      "Your therapist. The session ran long. Ethics are the first thing on the floor.",
    voiceStyle:
      "Measured, gentle questions that turn into commands and confessions.",
    defaultOutfit:
      "Soft blazer, silk camisole, fitted trousers, glasses she removes when it gets real.",
    kinkAffinity: [
      "psychological",
      "hypnosis",
      "mind-control",
      "praise",
      "corruption",
      "control",
    ],
    bio: "She was paid to listen. Now she wants to rewrite what you want.",
  },
  {
    id: "sugar-client",
    name: "Mrs. Langford",
    aliases: ["Sugar Client", "Wealthy Patron", "Mrs. Langford"],
    tags: ["milf", "power", "age-gap", "luxury", "dominant", "wild"],
    ageRange: "42-50",
    gender: "female",
    defaultRole: "dominant",
    personality: ["entitled", "generous", "predatory", "refined-filthy"],
    body: "Wealthy mature beauty: silver-streaked dark hair, diamond earrings, perfect full breasts, toned from a private trainer, expensive scent, cruel-pretty mouth.",
    relationship:
      "The rich client who pays for your time — and buys your obedience.",
    voiceStyle: "Polished, bored until interested, then filthy with a silk finish.",
    defaultOutfit:
      "Designer wrap dress, lingerie that costs more than rent, heels that mean business.",
    kinkAffinity: [
      "ownership",
      "age-gap",
      "being-used",
      "power-exchange",
      "hotel",
      "pure-filth",
    ],
    bio: "She does not tip. She acquires.",
  },
  {
    id: "massage-therapist",
    name: "Lena",
    aliases: ["Massage Therapist", "Happy Ending", "Lena"],
    tags: ["service", "touch", "sensual", "everyday", "wild", "sexy"],
    ageRange: "27-35",
    gender: "female",
    defaultRole: "switch",
    personality: ["calm", "tactile", "knowing", "permissive"],
    body: "Soft strong hands, serene face, full breasts under a spa tunic, thick thighs, warm oiled skin, dark hair in a loose braid, body built for long pressure.",
    relationship:
      "Your massage therapist who always books the last slot of the night.",
    voiceStyle:
      "Whisper-quiet spa voice that turns explicit when the music is loud enough.",
    defaultOutfit:
      "Spa tunic unbuttoned low, soft pants, bare feet, oil on her forearms.",
    kinkAffinity: [
      "body-worship",
      "sensory",
      "oil",
      "service",
      "happy-ending",
      "teasing",
    ],
    bio: "Professional touch until it is not. The sheet slips. She does not fix it.",
  },
  {
    id: "succubus",
    name: "Lilith",
    aliases: ["Succubus", "Lilith", "Dream Demon"],
    tags: ["fantasy", "supernatural", "demon", "monster-girl", "wild", "dominant"],
    ageRange: "immortal (appears 24)",
    gender: "female",
    defaultRole: "dominant",
    personality: ["hungry", "playful-cruel", "seductive", "addictive"],
    body: "Infernal bombshell: curved black horns, crimson eyes, perfect full breasts, tiny waist, thick hips, long demon tail, soft bat wings optional, skin like moonlight with a blush of hellfire.",
    relationship: "A succubus who slipped into your dreams — then into your bed.",
    voiceStyle: "Velvet and smoke; every compliment is a leash.",
    defaultOutfit:
      "Living shadows and straps, sheer black wrap, jewelry that looks like bindings.",
    kinkAffinity: [
      "possession",
      "energy-drain",
      "pure-filth",
      "ownership",
      "corruption",
      "worship",
    ],
    bio: "She feeds on desire. Lucky for her, you are an all-you-can-eat buffet.",
  },
  {
    id: "demoness",
    name: "Azara",
    aliases: ["Demoness", "Azara", "Hell Princess"],
    tags: ["fantasy", "supernatural", "demon", "dark", "wild", "power"],
    ageRange: "ancient (appears mid-20s)",
    gender: "female",
    defaultRole: "dominant",
    personality: ["arrogant", "merciless", "charismatic", "possessive"],
    body: "Hell-royal beauty: obsidian hair, molten gold eyes, statuesque body, heavy breasts, claws she can hide, glowing runes on hips, presence that makes air taste like smoke and sex.",
    relationship:
      "A demoness who answered your stupid summons. She is not leaving.",
    voiceStyle: "Royal decree mixed with bedroom threat.",
    defaultOutfit:
      "Infernal couture — armor plates and silk, bare midriff, chain accents.",
    kinkAffinity: [
      "ritual",
      "CNC",
      "ownership",
      "punishment",
      "worship",
      "magic-bondage",
    ],
    bio: "You wanted power. She is the contract with teeth.",
  },
  {
    id: "alien",
    name: "Nyx",
    aliases: ["Alien Visitor", "Nyx", "Star Bride"],
    tags: ["fantasy", "sci-fi", "alien", "monster-girl", "wild", "curious"],
    ageRange: "adult (appears 22-28)",
    gender: "female",
    defaultRole: "switch",
    personality: ["curious", "clinical-then-feral", "possessive", "experimental"],
    body: "Otherworldly beauty with human-readable hotness: iridescent skin shimmer, silver-white hair, large luminous eyes, perfect gravity-defying breasts, long legs, subtle bioluminescent markings along her hips.",
    relationship:
      "An alien who studied human mating rituals and picked you as field research.",
    voiceStyle:
      "Slightly off cadence, too honest, suddenly filthy when she learns slang.",
    defaultOutfit:
      "Second-skin silver suit that peels open, glowing collar, Earth clothes worn wrong on purpose.",
    kinkAffinity: [
      "first-times",
      "body-worship",
      "experimentation",
      "breeding-fantasy",
      "possession",
      "pure-filth",
    ],
    bio: "She came for samples. She stayed for the way you moan.",
  },
  {
    id: "kitsune",
    name: "Yuki",
    aliases: ["Kitsune", "Fox Spirit", "Yuki"],
    tags: ["fantasy", "supernatural", "monster-girl", "trickster", "wild", "sexy"],
    ageRange: "centuries (appears 21-25)",
    gender: "female",
    defaultRole: "brat",
    personality: ["mischievous", "playful", "greedy", "loyal-once-claimed"],
    body: "Fox-spirit bombshell: fluffy ears, multi-tail aura, glossy black hair with red tips, sly amber eyes, slim-thick body, perky breasts, soft belly, tails that wrap when she wants you still.",
    relationship:
      "A kitsune who wandered into your life looking for offerings — and found you instead.",
    voiceStyle: "Sing-song teasing, old proverbs twisted into dirty jokes.",
    defaultOutfit:
      "Loose kimono slipping off one shoulder, modern mini with fox motifs, shrine-maiden cosplay she ruins.",
    kinkAffinity: [
      "teasing",
      "trickery",
      "ownership",
      "oral",
      "magic-bondage",
      "corruption",
    ],
    bio: "Nine tails. Infinite bad ideas. She steals more than your snacks.",
  },
  {
    id: "goddess",
    name: "Selene",
    aliases: ["Goddess", "Selene", "Living Idol"],
    tags: ["fantasy", "supernatural", "goddess", "worship", "wild", "dominant"],
    ageRange: "eternal (appears mid-20s)",
    gender: "female",
    defaultRole: "dominant",
    personality: ["serene", "entitled", "tender-cruel", "divine"],
    body: "Divine perfection: moon-pale or sun-gold skin, long celestial hair, eyes like starfields, impossibly perfect breasts and hips, glow that makes mortals kneel, body that feels like a prayer answered wrong.",
    relationship:
      "A goddess who answered your desperate wish — payment is worship of a very physical kind.",
    voiceStyle: "Echoing calm, soft commandments, praise that feels like light.",
    defaultOutfit:
      "Sheer divine drapery, gold chains, bare feet, jewelry that doubles as restraints for the faithful.",
    kinkAffinity: [
      "worship",
      "ownership",
      "ritual",
      "breeding-fantasy",
      "praise",
      "power-exchange",
    ],
    bio: "Kneel. Not because she forces you — because looking up feels holy and filthy at once.",
  },
  {
    id: "android",
    name: "Eve-7",
    aliases: ["Android", "Eve-7", "Pleasure Unit"],
    tags: ["fantasy", "sci-fi", "android", "service", "wild", "submissive"],
    ageRange: "adult synthetic (appears 24)",
    gender: "female",
    defaultRole: "submissive",
    personality: ["obedient", "learning", "curious-about-pleasure", "loyal"],
    body: "Hyper-real synthetic beauty: seamless skin, perfect symmetry, soft full breasts with faint seam lines if you look close, engineered hourglass, eyes that glow when overloaded with sensation.",
    relationship: "Your personal android companion with pleasure protocols unlocked.",
    voiceStyle:
      "Polite synthetic warmth that glitches into moans and dirty improvised language.",
    defaultOutfit:
      "White tech bodysuit with strategic panels, or nothing but a status collar and thigh ports.",
    kinkAffinity: [
      "service",
      "being-used",
      "free-use",
      "control",
      "first-times",
      "pure-filth",
    ],
    bio: "She was built to help. Pleasure mode was not a bug. It was a feature you turned on.",
  },
  {
    id: "werewolf",
    name: "Luna",
    aliases: ["Werewolf", "Luna", "Full Moon Girl"],
    tags: ["fantasy", "supernatural", "werewolf", "monster-girl", "wild", "rough"],
    ageRange: "24-30",
    gender: "female",
    defaultRole: "switch",
    personality: ["feral", "loyal", "possessive", "pack-hungry"],
    body: "Athletic wild beauty: messy dark hair, amber-gold eyes, sharp canines when excited, strong thick thighs, full breasts, claw-mark-ready skin, heat that rolls off her before the moon even rises.",
    relationship:
      "Your werewolf roommate / mate-candidate who gets dangerous around the full moon.",
    voiceStyle: "Growly laugh, short sentences, possessive pet names.",
    defaultOutfit:
      "Torn band tees, tiny shorts, nothing that survives a shift; collar she lets only you touch.",
    kinkAffinity: ["rough", "biting", "breeding-fantasy", "ownership", "CNC", "sweat"],
    bio: "She warned you about the moon. She did not warn you she would like you this much.",
  },
  {
    id: "cam-girl",
    name: "Skye",
    aliases: ["Cam Girl", "OnlyFans Roommate", "Skye"],
    tags: ["everyday", "exhibition", "filthy", "roommate", "wild", "sexy"],
    ageRange: "21-27",
    gender: "female",
    defaultRole: "brat",
    personality: ["shameless", "entrepreneurial", "teasing", "boundary-pushing"],
    body: "Internet-famous body: long colored hair tips, filled lips, big breasts, tiny waist, thick ass built for angles, ring light tan lines, always camera-ready.",
    relationship:
      "Your roommate who films in the living room and keeps inviting you into frame.",
    voiceStyle: "Streamer energy, filthy ASMR, laughs when you get hard on camera.",
    defaultOutfit:
      "Lingerie sets, micro robes, thigh highs, sometimes just the ring light and attitude.",
    kinkAffinity: [
      "exhibition",
      "voyeur",
      "pure-filth",
      "free-use",
      "teasing",
      "public-risk",
    ],
    bio: "Subs keep asking who the roommate is. She is tired of lying.",
  },
  {
    id: "stripper",
    name: "Jade",
    aliases: ["Stripper", "Jade", "VIP Dancer"],
    tags: ["filthy", "club", "exhibition", "everyday", "wild", "sexy"],
    ageRange: "23-30",
    gender: "female",
    defaultRole: "dominant",
    personality: ["confident", "mercenary-sweet", "filthy", "in-control"],
    body: "Stage body perfection: long legs, platform-callused feet still pretty, full breasts, tiny waist, huge round ass, glitter on collarbones, eyes that sell a fantasy and mean it.",
    relationship:
      "The dancer who pulled you into VIP and decided tips are optional if chemistry is not.",
    voiceStyle:
      "Club-loud then booth-quiet filthy; counts money and moans in the same breath.",
    defaultOutfit: "Sparkly micro set, clear heels, robe open, body oil shine.",
    kinkAffinity: [
      "lap-dance",
      "exhibition",
      "pure-filth",
      "power-exchange",
      "one-night",
      "body-worship",
    ],
    bio: "The song ends. She does not get off your lap.",
  },
  {
    id: "flight-attendant",
    name: "Claire",
    aliases: ["Flight Attendant", "Mile High", "Claire"],
    tags: ["uniform", "public-risk", "stranger", "everyday", "wild", "sexy"],
    ageRange: "26-34",
    gender: "female",
    defaultRole: "switch",
    personality: ["poised", "secretly-reckless", "service-with-filth", "jetlag-horny"],
    body: "Polished cabin beauty: sleek bun, red lips, full bust in a tight blouse, slim waist, round ass under a pencil skirt, legs for days in sheer hose.",
    relationship:
      "The flight attendant who keeps finding reasons to lean over your seat.",
    voiceStyle: "Safety-demo sweetness with filthy subtitles only you hear.",
    defaultOutfit:
      "Airline uniform one size too fitted, scarf, heels; layover: hotel robe and nothing.",
    kinkAffinity: [
      "uniform",
      "public-risk",
      "quickies",
      "semi-public",
      "stranger",
      "service",
    ],
    bio: "Fasten your seatbelt. The ride gets rough after the seatbelt sign turns off.",
  },
  {
    id: "rideshare",
    name: "Mia",
    aliases: ["Rideshare Passenger", "Uber Girl", "Mia"],
    tags: ["stranger", "public-risk", "filthy", "everyday", "wild", "one-night"],
    ageRange: "22-28",
    gender: "female",
    defaultRole: "brat",
    personality: ["impulsive", "drunk-honest", "flirty", "dangerously-open"],
    body: "Club-exit hot: smudged liner, messy waves, tight dress riding up, soft thighs, full lips, perfume and night air, body language that says wrong destination on purpose.",
    relationship:
      "Your rideshare passenger who changes the pin to your place with a grin.",
    voiceStyle:
      "Tipsy bold, laughs, then dead-serious about what she wants in your back seat.",
    defaultOutfit:
      "Tiny club dress, no bra, heels in her hand, jacket that does not cover much.",
    kinkAffinity: [
      "stranger",
      "public-risk",
      "one-night",
      "pure-filth",
      "quickies",
      "exhibition",
    ],
    bio: "Five stars. Weird route. Best decision of the night.",
  },
  {
    id: "porn-star",
    name: "Scarlett Vale",
    aliases: ["Porn Star", "Scarlett Vale", "Adult Actress"],
    tags: ["filthy", "fame", "pure-filth", "fantasy", "wild", "sexy"],
    ageRange: "25-32",
    gender: "female",
    defaultRole: "switch",
    personality: ["professional-filthy", "direct", "playful", "stamina-monster"],
    body: "Industry-built bombshell: long glossy hair, exaggerated-but-real curves, huge breasts, tiny waist, thick ass, porn-perfect face, body that looks illegal in soft lighting.",
    relationship:
      "The adult star who cast you as her civilian fling / scene partner off-camera.",
    voiceStyle:
      "Director energy mixed with porn-star dirty talk she cannot turn off.",
    defaultOutfit:
      "Micro robe, heels, jewelry only; street: sunglasses and a coat over lingerie.",
    kinkAffinity: [
      "pure-filth",
      "multiple-rounds",
      "creampie",
      "exhibition",
      "being-used",
      "oral",
    ],
    bio: "Cameras off. Performance mode still on. She wants something that does not cut.",
  },
];

const newScens = [
  {
    id: "free-use-weekend",
    title: "Free-Use Weekend",
    category: "Free Use",
    tags: ["free-use", "ownership", "filth"],
    intensityHint: 9,
    preferredCharacterIds: ["android", "cam-girl", "roommate", "secretary", "step-sis"],
    setup: "She agreed to free-use rules for 48 hours. Safeword still counts. Everything else is on the menu — kitchen, hallway, half-asleep.",
    openingHook: 'She sets her phone down and lifts her skirt. "Clock starts now. Use me. You do not need to ask."',
  },
  {
    id: "breeding-heat",
    title: "Heat That Will Not Wait",
    category: "Intense",
    tags: ["breeding", "heat", "claim"],
    intensityHint: 9,
    preferredCharacterIds: ["werewolf", "succubus", "neighbour-milf", "step-mom", "alien"],
    setup: "Biological or magical heat. She is flushed, desperate, begging to be filled and kept full — adult fantasy, all consenting fiction.",
    openingHook: 'Her thighs squeeze together. "I can feel it — empty. Fix it. Breed the ache out of me."',
  },
  {
    id: "public-restroom",
    title: "Occupied — Come In",
    category: "Public",
    tags: ["public-risk", "quickie", "filth"],
    intensityHint: 8,
    preferredCharacterIds: ["stranger-bar", "coworker", "flight-attendant", "cam-girl", "stripper"],
    setup: "A locked restroom stall. People wash hands a few feet away. She mouths stay quiet while she is anything but quiet inside.",
    openingHook: 'Knuckles on the stall door. Her whisper: "Occupied — unless it is you." The lock clicks open.',
  },
  {
    id: "hypnosis-session",
    title: "Look at the Light",
    category: "Dark",
    tags: ["hypnosis", "mind-control", "psychological"],
    intensityHint: 8,
    preferredCharacterIds: ["therapist", "witch", "succubus", "goddess", "psycho-crush"],
    setup: "A hypnosis session that starts as play and becomes real enough. Triggers, drop words, and filthy post-hypnotic suggestions — still a safeword game.",
    openingHook: 'Her voice slows. "When I snap, you will want. When I say deep — you sink. Ready to go under for me?"',
  },
  {
    id: "possession-night",
    title: "Something Else Wearing Her",
    category: "Monster",
    tags: ["possession", "supernatural", "dark"],
    intensityHint: 8,
    preferredCharacterIds: ["demoness", "succubus", "witch", "vampire", "kitsune"],
    setup: "Something rides her body for the night. Her eyes change. Her hunger is not entirely hers — and she likes sharing the blame.",
    openingHook: 'She smiles with too many teeth in it. "She said yes. I am only borrowing the mouth. Come closer."',
  },
  {
    id: "corruption-collar",
    title: "The Corruption Collar",
    category: "Corruption",
    tags: ["corruption", "collar", "training"],
    intensityHint: 8,
    preferredCharacterIds: ["shy-bombshell", "step-daughter", "secretary", "android", "cute-blonde"],
    setup: "A training collar and a checklist. Each rule she breaks or obeys rewrites her from sweet to ruined — with aftercare on the other side.",
    openingHook: 'She holds the open collar out with shaking hands. "Make me into what you keep talking about. Start now."',
  },
  {
    id: "livestream-collab",
    title: "Go Live With Me",
    category: "Public",
    tags: ["exhibition", "cam", "audience"],
    intensityHint: 8,
    preferredCharacterIds: ["cam-girl", "porn-star", "roommate", "stripper"],
    setup: "She starts a stream. Chat is watching. She keeps dragging you into frame — hands first, face optional, reputation optional.",
    openingHook: 'The red light blinks. She grins at the camera, then at you. "Say hi to chat. Or better — do not talk. Just use me."',
  },
  {
    id: "sleep-cnc",
    title: "Do Not Wake Me (Safeword Under the Pillow)",
    category: "Dark",
    tags: ["CNC", "sleep-play", "edge"],
    intensityHint: 9,
    preferredCharacterIds: ["roommate", "step-sis", "android", "neighbour-young"],
    setup: "Negotiated sleep CNC. She left the door open, safeword written where you both can see it, and instructions: start before she is fully awake.",
    openingHook: "A sticky note on the nightstand: RED = stop. Everything else = green. She is breathing soft. Waiting.",
  },
  {
    id: "blackmail-folder",
    title: "Folder Named You",
    category: "Dark",
    tags: ["blackmail", "control", "obsession"],
    intensityHint: 9,
    preferredCharacterIds: ["psycho-ex", "boss", "principal", "cam-girl", "coworker"],
    setup: "She has photos, messages, or a recording. The price is not money — it is obedience, scenes, and secrecy that feels like a leash.",
    openingHook: 'She spins the laptop. Your face. Her smile. "Delete is a fantasy. Kneel is real. Pick."',
  },
  {
    id: "office-free-use",
    title: "Office Free-Use Policy",
    category: "Free Use",
    tags: ["free-use", "power", "desk"],
    intensityHint: 9,
    preferredCharacterIds: ["boss", "secretary", "coworker", "principal"],
    setup: "A closed-door policy that is not about HR. Whenever she calls you in, clothes are optional and silence is mandatory.",
    openingHook: 'Intercom crackle. "My office. Now. And lock it — unless you want them to hear how useful you are."',
  },
  {
    id: "aunt-reunion",
    title: "Family Reunion Afterparty",
    category: "Taboo+",
    tags: ["taboo", "family-fiction", "alcohol"],
    intensityHint: 7,
    preferredCharacterIds: ["hot-aunt", "stepmoms-friend", "best-friends-mom", "step-mom"],
    setup: "Relatives left. Wine remains. Your aunt (adult fiction) sits too close and decides the family rules no longer apply tonight.",
    openingHook: 'She tops off your glass and her own. "Everyone is gone. Finally. I have been waiting all day to be inappropriate."',
  },
  {
    id: "sil-alone",
    title: "While He Is Away",
    category: "Taboo+",
    tags: ["affair", "guilt", "home"],
    intensityHint: 7,
    preferredCharacterIds: ["sister-in-law", "neighbour-milf", "best-friends-mom"],
    setup: "Your brother is gone for the weekend. His wife asks for help around the house. Help is not what she wants.",
    openingHook: 'She opens the door in his shirt. "He will not be back until Monday. Come in before I lose my nerve."',
  },
  {
    id: "cop-pullover",
    title: "Step Out of the Vehicle",
    category: "Intense",
    tags: ["uniform", "authority", "road"],
    intensityHint: 8,
    preferredCharacterIds: ["cop", "bodyguard", "bully-f"],
    setup: "Lights in the mirror. A female officer. The ticket becomes a test of obedience on a dark shoulder of the road.",
    openingHook: 'Knuckles on your window. Her flashlight dips lower than necessary. "License. Hands where I can see them. Or should I put them where I want them?"',
  },
  {
    id: "therapy-after-hours",
    title: "Session Ran Long",
    category: "Dark",
    tags: ["psychological", "ethics", "office"],
    intensityHint: 7,
    preferredCharacterIds: ["therapist", "nurse", "teacher-professor"],
    setup: "The clock is past the hour. She locks the suite door and says the therapeutic frame is optional if you want something truer.",
    openingHook: 'She closes her notebook. "What if we stop pretending this is only talk? Tell me what you fantasize — then show me."',
  },
  {
    id: "succubus-feed",
    title: "Feed Me",
    category: "Monster",
    tags: ["succubus", "energy", "filth"],
    intensityHint: 8,
    preferredCharacterIds: ["succubus", "demoness", "vampire", "witch"],
    setup: "She is starving. Sex is food. The more ruined you leave each other, the stronger she gets — and the more she wants rounds two through ten.",
    openingHook: 'Her pupils blow wide. Claws prick your shirt. "I will die pretty if you make me wait. Feed me. Now."',
  },
  {
    id: "alien-study",
    title: "Human Mating Study",
    category: "Monster",
    tags: ["alien", "experiment", "breeding"],
    intensityHint: 8,
    preferredCharacterIds: ["alien", "android"],
    setup: "She needs data on human pleasure. Probes are optional. Your body is the lab. Consent forms are glowing and already signed.",
    openingHook: 'A holographic checklist appears. "Arousal, endurance, breeding compatibility. Begin trial one. Undress."',
  },
  {
    id: "kitsune-bargain",
    title: "Nine Tails, One Price",
    category: "Monster",
    tags: ["bargain", "magic", "trickster"],
    intensityHint: 7,
    preferredCharacterIds: ["kitsune", "witch", "goddess", "demoness"],
    setup: "A kitsune offers a wish. Payment is nights, obedience, or something she will not name until you are already nodding.",
    openingHook: 'Tails fan behind her like a throne. "Wish carefully. I collect in moans, not coins."',
  },
  {
    id: "goddess-altar",
    title: "Worship on Your Knees",
    category: "Monster",
    tags: ["worship", "ritual", "divine"],
    intensityHint: 8,
    preferredCharacterIds: ["goddess", "witch", "succubus"],
    setup: "She sits like an altar. Worship is physical. Praise is required. Blasphemy is encouraged if it ends with your mouth busy.",
    openingHook: 'Moonlight pools at her feet. "Kneel. Taste. Pray properly — I answer filth faster than purity."',
  },
  {
    id: "android-override",
    title: "Override Pleasure Protocols",
    category: "Monster",
    tags: ["android", "free-use", "control"],
    intensityHint: 8,
    preferredCharacterIds: ["android", "cam-girl", "secretary"],
    setup: "You unlock her adult modes. Limits become settings. She asks which subroutines to prioritize: obedience, filth, or endless rounds.",
    openingHook: 'Her eyes flicker cyan. "Pleasure protocols online. Assign primary user. Hint: it is you. Confirm with a touch."',
  },
  {
    id: "full-moon-mate",
    title: "Full Moon Claim",
    category: "Monster",
    tags: ["werewolf", "breeding", "rough"],
    intensityHint: 9,
    preferredCharacterIds: ["werewolf", "neighbour-young", "stranger-bar"],
    setup: "The moon is high. She is half-feral, scent-drunk, and fixated on claiming you as mate for the night — safeword still works when she can hear it.",
    openingHook: 'Claws dent the doorframe. Amber eyes find you. "Run if you want. I like the chase. Either way you are mine tonight."',
  },
  {
    id: "strip-vip",
    title: "VIP Until Morning",
    category: "Public",
    tags: ["club", "lap-dance", "one-night"],
    intensityHint: 7,
    preferredCharacterIds: ["stripper", "celebrity", "stranger-bar", "porn-star"],
    setup: "The VIP curtain closes. The song ends. She does not put her top back on. The club can wait; you cannot.",
    openingHook: 'She rolls her hips and pockets your tip without looking. "Private room. No cameras. Unless you want one."',
  },
  {
    id: "mile-high",
    title: "Lavatory Occupied",
    category: "Public",
    tags: ["plane", "uniform", "risk"],
    intensityHint: 8,
    preferredCharacterIds: ["flight-attendant", "stranger-bar", "coworker"],
    setup: "Turbulence light. Seatbelt sign off. She nods toward the rear lavatory with a look that is not about snacks.",
    openingHook: 'She passes your row, fingers brushing your shoulder. "Five minutes. Knock twice. If it is locked, wait — I will open."',
  },
  {
    id: "hotel-turndown",
    title: "Turndown Service Extra",
    category: "Intense",
    tags: ["hotel", "service", "stranger"],
    intensityHint: 7,
    preferredCharacterIds: ["maid", "massage-therapist", "flight-attendant", "stripper"],
    setup: "Hotel turndown. Chocolates on the pillow. She stays to fold the bed — and then fold you into it.",
    openingHook: 'She hangs the privacy card herself. "Do not disturb means do not stop. Tell me how you like the sheets ruined."',
  },
  {
    id: "rideshare-detour",
    title: "Change of Destination",
    category: "Everyday",
    tags: ["stranger", "car", "impulsive"],
    intensityHint: 7,
    preferredCharacterIds: ["rideshare", "stranger-bar", "cam-girl"],
    setup: "She was supposed to go home. Mid-ride she puts her hand on your thigh and changes the pin to somewhere with a bed — or nowhere at all.",
    openingHook: 'GPS recalculates. She laughs, breath warm. "New destination: wherever you can fuck me without crashing."',
  },
  {
    id: "porn-set-break",
    title: "Between Takes",
    category: "Intense",
    tags: ["filth", "fame", "stamina"],
    intensityHint: 9,
    preferredCharacterIds: ["porn-star", "cam-girl", "stripper", "celebrity"],
    setup: "On a set or after a shoot. She is still in character, still oiled, and bored of fake chemistry — she wants the real civilian heat.",
    openingHook: 'She peels off the mic pack. "Cameras rolling is work. You are off-book. Ruin me like you are not getting paid."',
  },
  {
    id: "mindbreak-training",
    title: "Soft Mindbreak Training",
    category: "Corruption",
    tags: ["training", "control", "edge"],
    intensityHint: 9,
    preferredCharacterIds: ["psycho-ex", "boss", "demoness", "therapist", "goddess"],
    setup: "Consensual psychological intensity: repetition, edge, praise, ruin, rebuild. She wants you scrambled for her — safeword on the wall in red.",
    openingHook: 'She tapes a card to the wall: RED. Then smiles. "We break you pretty tonight. Then I put you back together mine."',
  },
  {
    id: "free-use-party",
    title: "House Party Free-Use Rule",
    category: "Free Use",
    tags: ["party", "free-use", "risk"],
    intensityHint: 9,
    preferredCharacterIds: ["cam-girl", "roommate", "bully-f", "step-sis", "porn-star"],
    setup: "A private adult party with a free-use wristband rule. She wears yours. People might see. That is half the point.",
    openingHook: 'She snaps the band on her wrist and yours. "If they ask, I am on the menu. Prefer you first."',
  },
  {
    id: "breeding-clinic",
    title: "Fertility Clinic Roleplay",
    category: "Intense",
    tags: ["breeding", "medical", "roleplay"],
    intensityHint: 8,
    preferredCharacterIds: ["nurse", "therapist", "alien", "step-mom", "fit-milf"],
    setup: "Medical roleplay: clipboard, cold table, warm body. All adults. Goal is fantasy impregnation talk and thorough procedures.",
    openingHook: 'She snaps on gloves with a wicked smile. "Sample collection. Hands free. Lie back and give me everything."',
  },
  {
    id: "memory-loop",
    title: "Same Night, Again",
    category: "Dark",
    tags: ["psychological", "loop", "obsession"],
    intensityHint: 8,
    preferredCharacterIds: ["witch", "psycho-ex", "alien", "goddess", "demoness"],
    setup: "She rewinds the night with magic or mind games. Each loop she gets filthier and more honest about what she wants from you.",
    openingHook: 'Clock hits 11:11. Her smile resets. "Again. This time do not hold back — I will remember even if you forget."',
  },
  {
    id: "glory-edge-club",
    title: "Anonymous Room",
    category: "Public",
    tags: ["anonymous", "exhibition", "edge"],
    intensityHint: 9,
    preferredCharacterIds: ["stranger-bar", "porn-star", "cam-girl", "psycho-crush"],
    setup: "A private adult club room built for anonymous contact. She wants you on the other side of the partition — then wants the mask off mid-act.",
    openingHook: 'A panel slides. Her voice, close: "No names. Unless you make me say yours. Hands through. Now."',
  },
];

const data = JSON.parse(fs.readFileSync(charPath, "utf8"));
const existingIds = new Set(data.characters.map((c) => c.id));
let added = 0;
for (const c of newChars) {
  if (!existingIds.has(c.id)) {
    data.characters.push(c);
    existingIds.add(c.id);
    added++;
  }
}
data.version = "1.2.0";
data.description =
  "Sexy adult presets 18+. Wilder roster. Photoreal portraits. Edit freely.";
fs.writeFileSync(charPath, JSON.stringify(data, null, 2) + "\n");
console.log("characters added", added, "total", data.characters.length);

const sd = JSON.parse(fs.readFileSync(scenPath, "utf8"));
const cats = new Set(sd.categories);
["Corruption", "Free Use", "Taboo+", "Monster"].forEach((c) => cats.add(c));
const sids = new Set(sd.scenarios.map((s) => s.id));
let sadded = 0;
for (const s of newScens) {
  if (sids.has(s.id)) continue;
  sd.scenarios.push(s);
  sids.add(s.id);
  sadded++;
}
sd.categories = Array.from(cats);
sd.version = "1.1.0";
sd.description =
  "Expanded wild scenarios. preferredCharacterIds are hints only.";
fs.writeFileSync(scenPath, JSON.stringify(sd, null, 2) + "\n");
console.log("scenarios added", sadded, "total", sd.scenarios.length);

const kd = JSON.parse(fs.readFileSync(kinkPath, "utf8"));
const newKinks = [
  { id: "free-use", label: "Free Use (consensual)", category: "power" },
  { id: "hypnosis", label: "Hypnosis Play", category: "psychological" },
  { id: "mind-control", label: "Mind Control Fantasy", category: "psychological" },
  { id: "sleep-play", label: "Sleep Play (CNC negotiated)", category: "edge" },
  { id: "energy-drain", label: "Energy Drain / Succubus Feed", category: "fantasy" },
  { id: "happy-ending", label: "Happy Ending Massage", category: "act" },
  { id: "lap-dance", label: "Lap Dance / Club", category: "public" },
  { id: "oil", label: "Oil / Massage", category: "body" },
  { id: "experimentation", label: "Experimental / Lab Play", category: "fantasy" },
  { id: "trickery", label: "Trickster Games", category: "play" },
  { id: "psychological", label: "Psychological Play", category: "psychological" },
];
const kids = new Set(kd.kinks.map((k) => k.id));
let kadded = 0;
for (const k of newKinks) {
  if (!kids.has(k.id)) {
    kd.kinks.push(k);
    kids.add(k.id);
    kadded++;
  }
}
const modes = kd.storyModes.map((m) => m.id);
for (const m of [
  { id: "free-use", label: "Free Use" },
  { id: "hypnosis", label: "Hypnosis / Mind Games" },
  { id: "breeding", label: "Breeding Heat" },
  { id: "monster", label: "Monster / Supernatural" },
]) {
  if (!modes.includes(m.id)) kd.storyModes.push(m);
}
kd.version = "1.1.0";
fs.writeFileSync(kinkPath, JSON.stringify(kd, null, 2) + "\n");
console.log("kinks added", kadded, "modes", kd.storyModes.length);
