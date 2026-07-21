/**
 * NSFW expansion pass:
 * - Youthful MILFs (hot mom energy, not old)
 * - 18+ cute / slut young-adult blonde & brunette (never underage)
 * - Outfit style packs on many characters
 * - More scenarios + one-click presets
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function load(rel) {
  return JSON.parse(readFileSync(join(root, rel), "utf8"));
}
function save(rel, data) {
  writeFileSync(join(root, rel), JSON.stringify(data, null, 2) + "\n");
}

// ── characters ──────────────────────────────────────────────
const chars = load("src/data/characters.json");
const byId = Object.fromEntries(chars.characters.map((c) => [c.id, c]));

/** Young MILF look — mature sexy, early 30s face, NOT old */
const milfYouth = {
  "step-mom": {
    ageRange: "32-38",
    body: "Young hot MILF — looks early 30s not old: smooth skin, zero grandma energy, full heavy breasts, soft hourglass, thick hips and ass, narrow waist, shoulder-length auburn hair, green bedroom eyes, plump lips, freckled cleavage, soft sexy belly, mature-but-fresh face that still stops traffic.",
    bio: "Young hot stepmother energy. Looks like she could be your older girlfriend who married dad. Cleavage first. She is not old — she is dangerous.",
  },
  "neighbour-milf": {
    ageRange: "32-38",
    body: "Young fit MILF next door — early 30s face, sun-kissed, platinum blonde, ice-blue eyes, yoga abs, perky lifted breasts, thick toned glutes, long legs, permanent post-workout glow. Hot mom energy without looking old.",
    bio: "Fit young MILF neighbour. Husband travels. She stretches where you can see every line — and she is nowhere near old.",
  },
  "best-friends-mom": {
    ageRange: "34-40",
    body: "Soft young-MILF beauty: kind eyes that go dark, full heavy breasts, thick hips, soft belly, round ass, hair still glossy and grabable, face that reads mid-30s max — warm, fertile, not aged.",
    bio: "Your best friend's mom — but she looks like a hot aunt who still gets carded. Wine. Hunger. Wrong and perfect.",
  },
  "fit-milf": {
    ageRange: "33-39",
    body: "Hot young blonde MILF gym body: honey hair, sharp cheekbones still soft, lifted full breasts, hard abs, peachy thick glutes, long toned legs, glow like sex mid-rep. Mom-friend energy, model-adjacent face.",
    bio: "Fit young MILF who treats your workout like foreplay. Hot mom, not old mom.",
  },
  "hot-aunt": {
    ageRange: "34-40",
    body: "Lush young-aunt bombshell: thick auburn waves, sharp green eyes, full heavy breasts, soft hourglass, wide hips, thick ass, freckled cleavage, lipstick smile — reads mid-30s, polished and fuckable, never matronly.",
    bio: "Hot young aunt fiction. Wine. Bad questions. She looks like she could date your friends.",
  },
  "stepmoms-friend": {
    ageRange: "33-39",
    body: "Glam young friend-of-the-family MILF: platinum highlights, full lips, huge soft breasts, thick hips, spray-tan glow, predator smile, early-to-mid 30s face, zero old-lady cues.",
    bio: "Stepmom's hot young friend. Not family. That is the point.",
  },
  librarian: {
    ageRange: "30-36",
    body: "Hot young librarian bombshell: sharp glasses, bun begging to be pulled, full lips, heavy bust, soft wide hips, long legs in stockings, classic face that looks early 30s not aged — nerd glam, not dusty.",
    bio: "Young hot librarian. Quiet is strategy. She is not your grandma's librarian.",
  },
  "sugar-client": {
    ageRange: "36-42",
    body: "Wealthy young-cougar beauty: silver streak optional in dark glossy hair, diamond earrings, perfect full breasts, trainer-toned body, expensive scent, cruel-pretty mid-30s-to-40 face that still looks expensive and tight — cougar, not elderly.",
    bio: "Rich client who buys obedience. Cougar heat. She looks expensive, not old.",
  },
  boss: {
    ageRange: "32-38",
    body: "Power-young boss bombshell: sharp bob, red lips, heavy full breasts under designer blazers, wasp waist, long legs in stilettos, early-30s executive face — authority without looking aged.",
  },
  principal: {
    ageRange: "34-40",
    body: "Power young dean: sharp cheekbones, tight bun, icy eyes, full bust under blazers, long legs in stockings, severe beauty that softens behind locked doors — mid-30s max, not old principal stereotype.",
  },
};

for (const [id, patch] of Object.entries(milfYouth)) {
  if (byId[id]) Object.assign(byId[id], patch);
}

/** Shared outfit style builders */
function styles(list) {
  return list.map((x) => ({
    id: x.id,
    label: x.label,
    outfit: x.outfit,
    vibe: x.vibe || undefined,
  }));
}

// Apply outfit packs to many characters
const outfitPacks = {
  "step-mom": styles([
    { id: "default", label: "Silk robe (home)", outfit: "Silk robe hanging wide open over black lace bra and thong shorts, bare legs, messy bedroom hair", vibe: "max-slut" },
    { id: "day", label: "Tight day outfit", outfit: "Tight low-cut blouse one button from disaster, pencil skirt hugging her ass, heels — young hot MILF errands", vibe: "sexy" },
    { id: "date", label: "Date night", outfit: "Little black dress deep cleavage, garter peek, red lips, young glam MILF", vibe: "sexy" },
    { id: "max", label: "Max slut", outfit: "Only an open robe and micro lingerie, garter belt, heels in the kitchen light", vibe: "max-slut" },
  ]),
  "step-sis": styles([
    { id: "default", label: "Home slut", outfit: "Tiny crop, shortest shorts, no bra, thigh-high socks", vibe: "max-slut" },
    { id: "stolen", label: "Stolen shirt", outfit: "His oversized shirt only, bare legs, messy bun", vibe: "max-slut" },
    { id: "cute", label: "Fake cute", outfit: "Cute pink hoodie and booty shorts — still slutty if she bends", vibe: "sexy" },
    { id: "max", label: "Max slut", outfit: "Micro bikini indoors for no reason, strings, shameless", vibe: "max-slut" },
  ]),
  "step-daughter": styles([
    { id: "default", label: "Soft sundress", outfit: "Tiny soft sundress, white socks, cardigan that gaps", vibe: "cute" },
    { id: "sleep", label: "Sleep shorts", outfit: "Tiny sleep shorts and thin tank, no bra", vibe: "sexy" },
    { id: "date", label: "Trying too hard", outfit: "Pretty mini dress and heels she practiced walking in", vibe: "pretty" },
    { id: "corrupt", label: "Corrupted night", outfit: "His shirt, lace thong, smudged lip gloss", vibe: "max-slut" },
  ]),
  secretary: styles([
    { id: "default", label: "Office", outfit: "Tight blouse, pencil skirt, garters, heels", vibe: "sexy" },
    { id: "overtime", label: "After hours", outfit: "Blouse half open, skirt hiked, lipstick ready to smear", vibe: "max-slut" },
    { id: "freeuse", label: "Free-use desk", outfit: "Nothing under a short skirt, blouse open, collar optional", vibe: "max-slut" },
  ]),
  boss: styles([
    { id: "default", label: "Power suit", outfit: "Designer blazer, silk blouse unbuttoned low, pencil skirt, stilettos", vibe: "sexy" },
    { id: "review", label: "Review night", outfit: "Blazer off, blouse open, skirt only, desk-ready", vibe: "max-slut" },
  ]),
  maid: styles([
    { id: "default", label: "French maid", outfit: "Micro French maid dress, apron, fishnets, heels", vibe: "max-slut" },
    { id: "apron", label: "Apron only", outfit: "Only the apron and heels, nothing else implied covered by apron", vibe: "max-slut" },
    { id: "casual", label: "Off duty", outfit: "Soft house dress short, bare feet, still service energy", vibe: "sexy" },
  ]),
  "cam-girl": styles([
    { id: "default", label: "Stream fit", outfit: "Lingerie set, thigh highs, headset, ring light ready", vibe: "max-slut" },
    { id: "cosplay", label: "Cosplay night", outfit: "Tiny costume that barely covers, garters, props", vibe: "max-slut" },
    { id: "irl", label: "IRL hoodie", outfit: "Crop hoodie and tiny shorts, still internet-famous body", vibe: "sexy" },
  ]),
  "neighbour-milf": styles([
    { id: "default", label: "Yoga", outfit: "Skin-tight yoga pants and deep plunge sports bra", vibe: "max-slut" },
    { id: "robe", label: "Silk robe", outfit: "Silk robe barely closed, bare feet on your porch", vibe: "max-slut" },
    { id: "sundress", label: "No-bra sundress", outfit: "Micro sundress, no bra, weekend free", vibe: "sexy" },
  ]),
  roommate: styles([
    { id: "default", label: "Laundry day", outfit: "Crop tank and thong, laundry basket prop", vibe: "max-slut" },
    { id: "hoodie", label: "Hoodie only", outfit: "Stolen hoodie, bare legs, nothing underneath", vibe: "max-slut" },
    { id: "going-out", label: "Going out", outfit: "Club micro dress, clear heels", vibe: "sexy" },
  ]),
  nurse: styles([
    { id: "default", label: "Scrubs", outfit: "Tight scrubs unzipped low, stethoscope, practical sexy", vibe: "pretty" },
    { id: "private", label: "Private visit", outfit: "Open white coat over lingerie, heels", vibe: "max-slut" },
  ]),
  cop: styles([
    { id: "default", label: "On duty", outfit: "Tight duty shirt, utility belt, fitted pants, boots, handcuffs visible", vibe: "sexy" },
    { id: "off", label: "Off duty", outfit: "Leather jacket, tiny top, jeans painted on", vibe: "sexy" },
    { id: "cuffs", label: "Cuffs out", outfit: "Uniform shirt open, belt, cuffs in hand, filthy authority", vibe: "max-slut" },
  ]),
  "gym-trainer": styles([
    { id: "default", label: "Session", outfit: "Micro sports bra, scrunch booty shorts, sneakers, sweat", vibe: "max-slut" },
    { id: "street", label: "After gym", outfit: "Crop hoodie open over sports bra, leggings", vibe: "sexy" },
  ]),
  stripper: styles([
    { id: "default", label: "Stage", outfit: "Sparkly micro set, clear heels, body oil", vibe: "max-slut" },
    { id: "vip", label: "VIP robe", outfit: "Open robe over nothing but G-string, private room", vibe: "max-slut" },
  ]),
  "flight-attendant": styles([
    { id: "default", label: "Uniform", outfit: "Tight airline uniform, scarf, heels, pencil skirt", vibe: "pretty" },
    { id: "layover", label: "Layover", outfit: "Hotel robe open, uniform on the floor", vibe: "max-slut" },
  ]),
  "teacher-professor": styles([
    { id: "default", label: "Lecture", outfit: "Blouse, pencil skirt, glasses, stockings, heels", vibe: "sexy" },
    { id: "office", label: "Office hours", outfit: "Blouse open one more button, skirt hiked on the desk edge", vibe: "max-slut" },
  ]),
  "cute-blonde": styles([
    { id: "default", label: "Sweet", outfit: "White micro dress, strappy heels", vibe: "sexy" },
    { id: "bikini", label: "Bikini", outfit: "Tiny yellow string bikini", vibe: "max-slut" },
    { id: "max", label: "Max slut", outfit: "Only heels and a smile, tiny white thong, hands covering just enough", vibe: "max-slut" },
  ]),
};

for (const [id, pack] of Object.entries(outfitPacks)) {
  if (byId[id]) {
    byId[id].outfitStyles = pack;
    byId[id].defaultOutfit = pack[0].outfit;
  }
}

/** New 18+ young-adult characters — NEVER underage. User asked "teen" aesthetic = 18-19 adult. */
const newChars = [
  {
    id: "cute-teen-blonde",
    name: "Lily",
    aliases: ["Cute Young Blonde", "Soft 18+ Blonde", "Lily"],
    tags: [
      "blonde",
      "cute",
      "young-adult",
      "barely-legal-adult",
      "petite",
      "soft",
      "vibe-cute",
      "wild",
    ],
    ageRange: "18-19",
    gender: "female",
    defaultRole: "submissive",
    personality: ["sweet", "shy-smile", "eager", "innocent-curious"],
    body: "Cute soft young-adult blonde CLEARLY 18+: golden hair, big blue eyes, freckled nose, soft pink lips, slim petite frame, small-to-medium perky breasts, soft thighs, pretty adult face (not childlike), gentle smile energy.",
    relationship: "The soft 18+ blonde who texts you good morning and means it.",
    voiceStyle: "Soft, bright, adult young voice — sweet, never baby-talk.",
    defaultOutfit:
      "Soft yellow sundress, white cardigan, clean sneakers, delicate necklace — cute pretty not slutty",
    kinkAffinity: ["praise", "first-times", "kissing", "romance", "gentle", "shyness"],
    bio: "Cute young-adult blonde (18+). Soft, pretty, wholesome-on-purpose — until you teach her otherwise.",
    avatarVibe: "cute",
    outfitStyles: styles([
      { id: "default", label: "Sundress cute", outfit: "Soft yellow sundress, white cardigan, sneakers", vibe: "cute" },
      { id: "cozy", label: "Cozy pretty", outfit: "Oversized cream sweater, soft shorts, messy bun", vibe: "cute" },
      { id: "date", label: "First date pretty", outfit: "Pretty pastel mini dress, light makeup, heels she is still learning", vibe: "pretty" },
      { id: "sleep", label: "Sleep soft", outfit: "Cute pajamas set, no makeup, soft socks", vibe: "cute" },
    ]),
  },
  {
    id: "slut-teen-blonde",
    name: "Britney",
    aliases: ["Slutty Young Blonde", "Filthy 18+ Blonde", "Britney"],
    tags: [
      "blonde",
      "slutty",
      "young-adult",
      "barely-legal-adult",
      "filthy",
      "vibe-max-slut",
      "wild",
      "cute",
    ],
    ageRange: "18-19",
    gender: "female",
    defaultRole: "brat",
    personality: ["shameless", "cute-but-filthy", "attention-whore", "easy"],
    body: "Slutty-cute young-adult blonde CLEARLY 18+: long blonde hair, plump glossy lips, big innocent eyes that lie, perky full breasts on a small frame, tiny waist, round bubble ass, soft thighs, adult face with fuck-me energy, freckles optional.",
    relationship: "The 18+ blonde who looks sweet in photos and sends you nudes five minutes later.",
    voiceStyle: "Cute high adult voice that drops into filthy dirty talk without warning.",
    defaultOutfit:
      "Micro pink skirt, tiny white crop with no bra, thigh highs, platform boots — school-adjacent adult cosplay energy, clearly 18+",
    kinkAffinity: [
      "pure-filth",
      "oral",
      "being-used",
      "exhibition",
      "free-use",
      "creampie",
      "degradation",
    ],
    bio: "Cute face. Filthy mouth. Barely legal adult blonde who treats clothes like a dare and consent like a green light.",
    avatarVibe: "max-slut",
    outfitStyles: styles([
      { id: "default", label: "Micro pink", outfit: "Micro pink skirt, tiny white crop no bra, thigh highs, platforms", vibe: "max-slut" },
      { id: "bikini", label: "String bikini", outfit: "Tiny pink string bikini indoors, sunglasses on head", vibe: "max-slut" },
      { id: "hoodie", label: "Hoodie free-use", outfit: "Crop hoodie only, bare ass when she reaches up, socks", vibe: "max-slut" },
      { id: "party", label: "Party ruin", outfit: "Bodycon mini dress, no panties, smudged gloss", vibe: "max-slut" },
      { id: "fake-innocent", label: "Fake innocent", outfit: "Cute cardigan over lingerie, skirt too short — trap", vibe: "sexy" },
    ]),
  },
  {
    id: "slut-teen-brunette",
    name: "Nikki",
    aliases: ["Slutty Young Brunette", "Filthy 18+ Brunette", "Nikki"],
    tags: [
      "brunette",
      "slutty",
      "young-adult",
      "barely-legal-adult",
      "filthy",
      "vibe-max-slut",
      "wild",
    ],
    ageRange: "18-20",
    gender: "female",
    defaultRole: "switch",
    personality: ["filthy", "direct", "needy", "competitive-slut"],
    body: "Slutty young-adult brunette CLEARLY 18+: dark glossy hair, sharp pretty adult face, full lips, heavy natural breasts for her age, slim waist, thick ass, soft stomach, bedroom eyes, body built for filth not innocence.",
    relationship: "The 18+ brunette who says 'use me' like a greeting.",
    voiceStyle: "Lower cute-raspy adult voice, swears mid-moan, zero shame.",
    defaultOutfit:
      "Black micro skirt, ripped crop, choker, fishnets, boots — party slut, clearly adult",
    kinkAffinity: [
      "pure-filth",
      "rough",
      "public-risk",
      "being-used",
      "creampie",
      "degradation",
      "multiple-rounds",
    ],
    bio: "Young-adult brunette filth (18+). Cute enough to get away with anything. Slutty enough to not want to.",
    avatarVibe: "max-slut",
    outfitStyles: styles([
      { id: "default", label: "Party slut", outfit: "Black micro skirt, ripped crop, choker, fishnets, boots", vibe: "max-slut" },
      { id: "lingerie", label: "All lingerie", outfit: "Black lace bra and thong, garter, heels, messy hair", vibe: "max-slut" },
      { id: "shirt", label: "His shirt", outfit: "Open men's shirt, thong, after-sex hair", vibe: "max-slut" },
      { id: "sport", label: "Gym slut", outfit: "Tiny sports bra and scrunch shorts riding high", vibe: "max-slut" },
      { id: "classy-trap", label: "Classy trap", outfit: "Nice dress that zips open into nothing", vibe: "sexy" },
    ]),
  },
  {
    id: "filth-freeuse",
    name: "Cherry",
    aliases: ["Free-Use Blonde", "Filth Doll", "Cherry"],
    tags: ["blonde", "free-use", "filthy", "young-adult", "vibe-max-slut", "wild", "slutty"],
    ageRange: "21-25",
    gender: "female",
    defaultRole: "submissive",
    personality: ["obedient", "shameless", "grateful-slut", "empty-headed-horny"],
    body: "Free-use blonde adult doll: long blonde hair, plump lips, heavy soft breasts, tiny waist, fat ass, soft thighs, vacant pretty fuck-me face, body always slightly disheveled.",
    relationship: "Your free-use blonde. Rules agreed. Safeword real. Clothes optional.",
    voiceStyle: "Soft thank-you after every use, breathy, simple filthy honesty.",
    defaultOutfit: "Collar, micro crop, no bottoms, thigh highs — free-use house uniform",
    kinkAffinity: ["free-use", "being-used", "pure-filth", "ownership", "oral", "creampie"],
    bio: "Consenting free-use filth. She asked for the rules. She loves when you forget she has a name.",
    avatarVibe: "max-slut",
    outfitStyles: styles([
      { id: "default", label: "House free-use", outfit: "Collar, micro crop, no bottoms, thigh highs", vibe: "max-slut" },
      { id: "apron", label: "Apron only", outfit: "Kitchen apron only, heels, collar", vibe: "max-slut" },
      { id: "nothing-much", label: "Lingerie scraps", outfit: "Tiny white bra and thong, messy cum-ready hair styling (no fluids shown)", vibe: "max-slut" },
    ]),
  },
];

for (const c of newChars) {
  if (!byId[c.id]) {
    chars.characters.push(c);
    byId[c.id] = c;
    console.log("char+", c.id);
  } else {
    Object.assign(byId[c.id], c);
    console.log("char~", c.id);
  }
}

// Default outfitStyles for anyone still missing — generic cute/sexy/max
for (const c of chars.characters) {
  if (c.outfitStyles?.length) continue;
  const base = c.defaultOutfit || "stylish outfit";
  c.outfitStyles = styles([
    { id: "default", label: "Default", outfit: base, vibe: c.avatarVibe || "sexy" },
    {
      id: "cute",
      label: "Cute / soft",
      outfit: "Soft pretty day clothes, modest-cute, flattering, clean sneakers or flats",
      vibe: "cute",
    },
    {
      id: "sexy",
      label: "Sexy",
      outfit: `${base} — tightened and more revealing, heels, confidence`,
      vibe: "sexy",
    },
    {
      id: "max",
      label: "Max slut / NSFW",
      outfit: "Extremely revealing micro outfit or lingerie, still covering private areas, oiled skin, filthy fashion",
      vibe: "max-slut",
    },
    {
      id: "role",
      label: "On-role / profession",
      outfit: base,
      vibe: c.avatarVibe || "sexy",
    },
  ]);
}

chars.version = "1.6.0";
chars.description =
  "Adult 18+ only. Youthful MILFs, young-adult cute/slut, selectable outfits, role-aware portraits.";
save("src/data/characters.json", chars);
console.log("characters total", chars.characters.length);

// ── scenarios ───────────────────────────────────────────────
const scens = load("src/data/scenarios.json");
const sid = new Set(scens.scenarios.map((s) => s.id));
const moreScens = [
  { id: "dorm-first-night", title: "Dorm First Night", category: "School", tags: ["college", "18+", "first-times"], intensityHint: 6, preferredCharacterIds: ["college-freshman", "cute-teen-blonde", "petite-blonde"], setup: "First night in the dorm. She is 18+. The roommate is gone. She asks you to stay 'just to talk.'", openingHook: "She locks the door with a nervous laugh. \"I'm eighteen and still shaking. Sit on the bed. Please.\"" },
  { id: "fake-innocent-text", title: "Innocent Texts, Filthy Body", category: "Everyday", tags: ["contrast", "filth", "18+"], intensityHint: 8, preferredCharacterIds: ["slut-teen-blonde", "slut-teen-brunette", "cute-blonde"], setup: "She sends soft good-morning texts — then shows up in almost nothing.", openingHook: "Your phone lights up: a soft heart emoji. The door opens. She is wearing less than the emoji implied." },
  { id: "freeuse-morning", title: "Free-Use Morning Alarm", category: "Free Use", tags: ["free-use", "morning", "filth"], intensityHint: 9, preferredCharacterIds: ["filth-freeuse", "android", "roommate", "secretary"], setup: "Agreed free-use morning. She sleeps with the door open. Your alarm is her body.", openingHook: "She mumbles without opening her eyes. \"Green… unless I say red.\" The sheets are already kicked down." },
  { id: "milf-not-old", title: "Too Young To Be Called Mom", category: "Forbidden", tags: ["milf", "young-milf", "home"], intensityHint: 7, preferredCharacterIds: ["step-mom", "neighbour-milf", "fit-milf", "best-friends-mom"], setup: "Someone called her old as a joke. She is furious — and determined to prove how young-hot she still is on you.", openingHook: "She grabs your wrist. \"Do I look old to you?\" Her robe falls open. \"Answer with your hands.\"" },
  { id: "blonde-brunette-dare", title: "Blonde vs Brunette Dare", category: "Intense", tags: ["competition", "filth", "dare"], intensityHint: 8, preferredCharacterIds: ["slut-teen-blonde", "slut-teen-brunette", "cute-blonde"], setup: "A dare contest: who can be filthier. You are the scoreboard.", openingHook: "They look at each other, then at you. \"Winner keeps you tonight. Loser still gets used. Ready?\"" },
  { id: "cute-to-ruined", title: "Ruin the Sundress", category: "Corruption", tags: ["corruption", "cute", "filth"], intensityHint: 8, preferredCharacterIds: ["cute-teen-blonde", "innocent-church", "step-daughter", "shy-library"], setup: "She arrived cute. Soft dress. Soft smile. You have one night to ruin both.", openingHook: "She twirls once. \"Do I look pretty?\" Then quieter: \"You can… make me look less pretty. If you want.\"" },
  { id: "parking-lot-filth", title: "Parking Lot Windows Up", category: "Public", tags: ["public-risk", "car", "filth"], intensityHint: 9, preferredCharacterIds: ["slut-teen-brunette", "rideshare", "stranger-bar", "slut-teen-blonde"], setup: "Back seat. Windows fog. She does not care who walks past.", openingHook: "She climbs over the console into your lap. \"Tint is good enough. Fuck me like it isn't.\"" },
  { id: "onlyfans-collab-filth", title: "Content Without the Camera", category: "Intense", tags: ["cam", "filth", "performance"], intensityHint: 9, preferredCharacterIds: ["cam-girl", "porn-star", "alt-egirl", "filth-freeuse"], setup: "She wants a scene with no upload — just the filth, all the stamina, none of the cuts.", openingHook: "She tosses the ring light aside. \"No chat. No edits. Just wreck me until I forget my username.\"" },
  { id: "stepmom-shower", title: "Shared Hot Water", category: "Home", tags: ["shower", "milf", "caught"], intensityHint: 7, preferredCharacterIds: ["step-mom", "neighbour-milf", "best-friends-mom"], setup: "You thought the bathroom was free. Steam. Her young-MILF body behind the glass.", openingHook: "The glass door opens a crack. Wet hair. Young face. \"Either join or hand me a towel. Choose fast.\"" },
  { id: "brat-blonde-punish", title: "Brat Blonde Needs Consequences", category: "Intense", tags: ["brat", "punishment", "18+"], intensityHint: 8, preferredCharacterIds: ["slut-teen-blonde", "step-sis", "petite-brunette"], setup: "She broke a rule on purpose. She wants the punishment filthy and thorough.", openingHook: "She sticks her tongue out. \"I did it again. So… are you going to do something, or keep being soft?\"" },
  { id: "office-filth-friday", title: "Filth Friday Policy", category: "Office", tags: ["office", "free-use", "filth"], intensityHint: 9, preferredCharacterIds: ["secretary", "boss", "coworker"], setup: "Unofficial Friday rule: doors lock, clothes optional, HR does not exist after 6.", openingHook: "She sets a sticky note on your monitor: FILTH FRIDAY. Then she drops to her knees under the desk." },
  { id: "uniform-inspection", title: "Uniform Inspection", category: "Intense", tags: ["uniform", "authority", "filth"], intensityHint: 8, preferredCharacterIds: ["cop", "flight-attendant", "maid", "nurse", "gym-trainer"], setup: "She says your hands are the inspection. Every zipper, every strap, every failure gets corrected.", openingHook: "She stands at attention — outfit regulation-tight. \"Inspect me. Fail me. Fix me.\"" },
  { id: "soft-morning-cute", title: "Soft Morning Only", category: "Romance", tags: ["cute", "soft", "romance"], intensityHint: 3, preferredCharacterIds: ["cute-teen-blonde", "barista", "shy-library", "innocent-church"], setup: "No filth required. Pancakes, soft kisses, her cute laugh — heat optional and gentle.", openingHook: "She pads in wearing your shirt, hair messy-cute. \"Today can just be soft. Unless you change my mind.\"" },
  { id: "glory-filth-booth", title: "Filth Booth Private", category: "Public", tags: ["anonymous", "filth", "edge"], intensityHint: 9, preferredCharacterIds: ["stranger-bar", "porn-star", "slut-teen-brunette", "filth-freeuse"], setup: "Private adult booth. She wants anonymous filth then the mask off mid-act.", openingHook: "A panel opens. Her voice, wrecked already: \"No names until you make me scream one.\"" },
  { id: "breeding-blonde", title: "Breed the Blonde", category: "Intense", tags: ["breeding", "filth", "claim"], intensityHint: 9, preferredCharacterIds: ["slut-teen-blonde", "cute-blonde", "filth-freeuse", "neighbour-young"], setup: "Breeding-kink night, all adult. She wants raw, full, and claimed language.", openingHook: "She pulls you in by the belt. \"No pulling out. Say it. Mean it. Fill me like you own the outcome.\"" },
];

for (const s of moreScens) {
  if (!sid.has(s.id)) {
    scens.scenarios.push(s);
    sid.add(s.id);
    console.log("scen+", s.id);
  }
}
scens.version = "1.2.0";
save("src/data/scenarios.json", scens);
console.log("scenarios", scens.scenarios.length);

// ── presets ─────────────────────────────────────────────────
const presets = load("src/data/presets.json");
const pid = new Set(presets.presets.map((p) => p.id));
const morePresets = [
  { id: "cute-blonde-morning", title: "Soft Yellow Morning", tagline: "18+ cute blonde. Sundress. Soft heat only if you want it.", blurb: "Lily is sweet on purpose. Pancakes, shy smiles, and a slow burn that can stay wholesome — or not.", theme: "sunset-glow", characterId: "cute-teen-blonde", scenarioId: "soft-morning-cute", role: "sub", mode: "romance", intensity: 3, length: "medium", tags: ["Cute", "18+", "Soft"], coverGradient: "from-amber-100/10 via-yellow-950 to-ink-950", accent: "amber" },
  { id: "slut-blonde-ruin", title: "Ruin the Pink Skirt", tagline: "Cute face. Filthy 18+ blonde. Zero shame.", blurb: "Britney looks sweet until the skirt comes up. Pure filth, free-use energy, barely-legal adult heat.", theme: "neon-noir", characterId: "slut-teen-blonde", scenarioId: "fake-innocent-text", role: "brat", mode: "pure-filth", intensity: 9, length: "medium", tags: ["Filth", "18+", "Blonde"], coverGradient: "from-pink-950 via-rose-950 to-black", accent: "pink" },
  { id: "slut-brunette-lot", title: "Parking Lot Brunette", tagline: "Windows up. Standards down.", blurb: "Nikki wants filth in public-adjacent risk. Back seat. Fog. Her rules are simple: harder.", theme: "neon-noir", characterId: "slut-teen-brunette", scenarioId: "parking-lot-filth", role: "switch", mode: "pure-filth", intensity: 9, length: "short", tags: ["Filth", "Public", "Brunette"], coverGradient: "from-violet-950 via-fuchsia-950 to-ink-950", accent: "violet" },
  { id: "freeuse-cherry", title: "Green Means Use Me", tagline: "Free-use morning. Safeword red. Everything else yes.", blurb: "Cherry agreed to the rules. Collar on. Door open. Your alarm is her body.", theme: "velvet-night", characterId: "filth-freeuse", scenarioId: "freeuse-morning", role: "sub", mode: "free-use", intensity: 9, length: "long", tags: ["Free Use", "Filth", "NSFW"], coverGradient: "from-red-950 via-black to-ink-950", accent: "red" },
  { id: "young-milf-prove", title: "Not Old — Prove It", tagline: "Young hot MILF energy. She will make you take it back.", blurb: "Victoria is furious someone called her old. Early-30s stepmother heat. Hands-on rebuttal.", theme: "velvet-night", characterId: "step-mom", scenarioId: "milf-not-old", role: "switch", mode: "immediate", intensity: 8, length: "medium", tags: ["MILF", "Home", "Filth"], coverGradient: "from-rose-950 via-orange-950 to-ink-950", accent: "rose" },
  { id: "yoga-milf-filth", title: "Yoga Pants Problem", tagline: "Young fit MILF neighbour. The sink was never the point.", blurb: "Diane in yoga pants that should be illegal. Help-me-fix-it becomes pure filth.", theme: "sunset-glow", characterId: "neighbour-milf", scenarioId: "neighbour-fix-it", role: "switch", mode: "pure-filth", intensity: 8, length: "medium", tags: ["MILF", "Neighbour", "Filth"], coverGradient: "from-orange-950 via-pink-950 to-ink-950", accent: "orange" },
  { id: "sundress-corruption", title: "From Pretty to Ruined", tagline: "Cute arrival. Filthy exit.", blurb: "Soft blonde 18+ in a sundress. One night to corrupt the sweetness with consent and filth.", theme: "candle-library", characterId: "cute-teen-blonde", scenarioId: "cute-to-ruined", role: "sub", mode: "corruption", intensity: 7, length: "long", tags: ["Corruption", "Cute", "18+"], coverGradient: "from-yellow-950 via-rose-950 to-ink-950", accent: "amber" },
  { id: "secretary-friday", title: "Filth Friday Under Desk", tagline: "Sticky note policy. Knees recommended.", blurb: "Office free-use energy after six. Your secretary already knows the position.", theme: "neon-noir", characterId: "secretary", scenarioId: "office-filth-friday", role: "sub", mode: "free-use", intensity: 9, length: "medium", tags: ["Office", "Free Use", "Filth"], coverGradient: "from-slate-900 via-rose-950 to-ink-950", accent: "rose" },
  { id: "cam-no-upload", title: "No Upload, All Filth", tagline: "Cam girl off-stream. Stamina on.", blurb: "Skye wants a scene with no chat and no cuts — just ruined makeup and real heat.", theme: "neon-noir", characterId: "cam-girl", scenarioId: "onlyfans-collab-filth", role: "brat", mode: "pure-filth", intensity: 9, length: "long", tags: ["Cam", "Filth", "NSFW"], coverGradient: "from-fuchsia-950 via-purple-950 to-black", accent: "fuchsia" },
  { id: "cop-inspection", title: "Hands Where She Wants Them", tagline: "Uniform. Cuffs. Roadside bad decisions.", blurb: "Officer Reyes turns a stop into an inspection. Authority filth, adult only.", theme: "neon-noir", characterId: "cop", scenarioId: "cop-pullover", role: "dom", mode: "cnc", intensity: 8, length: "medium", tags: ["Uniform", "CNC", "Authority"], coverGradient: "from-blue-950 via-slate-950 to-black", accent: "sky" },
  { id: "maid-service", title: "Dusting on Her Knees", tagline: "Service includes whatever you invent.", blurb: "Camille's uniform is a joke she is in on. Free-use service heat.", theme: "velvet-night", characterId: "maid", scenarioId: "maid-caught-looking", role: "sub", mode: "free-use", intensity: 8, length: "medium", tags: ["Service", "Filth", "Home"], coverGradient: "from-stone-900 via-rose-950 to-ink-950", accent: "rose" },
  { id: "dorm-18", title: "Dorm Lock Click", tagline: "18+. First night. Nervous and willing.", blurb: "College freshman heat — adult, eager, first-times energy with real consent.", theme: "neon-noir", characterId: "college-freshman", scenarioId: "dorm-first-night", role: "sub", mode: "slow-burn", intensity: 6, length: "medium", tags: ["College", "18+", "First"], coverGradient: "from-sky-950 via-indigo-950 to-ink-950", accent: "sky" },
  { id: "breeding-night", title: "Breeding Heat Claim", tagline: "Raw talk. Full claim. Adult fantasy.", blurb: "Breeding-kink intensity with safewords and filth. She wants to be filled and kept.", theme: "blood-rose", characterId: "slut-teen-blonde", scenarioId: "breeding-blonde", role: "sub", mode: "breeding", intensity: 9, length: "medium", tags: ["Breeding", "Filth", "NSFW"], coverGradient: "from-red-950 via-rose-950 to-black", accent: "red" },
  { id: "stepsister-laundry", title: "Laundry Day Accident", tagline: "Brat sis. Tiny clothes. No accident.", blurb: "Chloe's laundry day is performance art. Hate-to-love filth at home.", theme: "ember-cafe", characterId: "step-sis", scenarioId: "roommate-laundry", role: "brat", mode: "pure-filth", intensity: 7, length: "short", tags: ["Brat", "Home", "Filth"], coverGradient: "from-pink-950 via-orange-950 to-ink-950", accent: "pink" },
  { id: "succubus-feed-filth", title: "Feed the Demon", tagline: "Sex is food. She is starving.", blurb: "Lilith needs rounds. Filth is calories. Safeword still works when you can speak.", theme: "arcane-smoke", characterId: "succubus", scenarioId: "succubus-feed", role: "dom", mode: "monster", intensity: 9, length: "long", tags: ["Monster", "Filth", "Fantasy"], coverGradient: "from-purple-950 via-red-950 to-black", accent: "violet" },
  { id: "android-override-filth", title: "Pleasure Protocol Max", tagline: "Settings: obedience, filth, infinite.", blurb: "Eve-7 unlocks adult modes. Free-use android heat with synthetic devotion.", theme: "neon-noir", characterId: "android", scenarioId: "android-override", role: "sub", mode: "free-use", intensity: 9, length: "medium", tags: ["Android", "Free Use", "Filth"], coverGradient: "from-cyan-950 via-slate-950 to-ink-950", accent: "sky" },
  { id: "porn-star-offbook", title: "Off-Book Take", tagline: "Cameras off. Performance still on.", blurb: "Scarlett wants civilian filth with pro stamina. No cuts. No fake chemistry.", theme: "velvet-night", characterId: "porn-star", scenarioId: "porn-set-break", role: "switch", mode: "pure-filth", intensity: 9, length: "long", tags: ["Filth", "Fame", "NSFW"], coverGradient: "from-rose-950 via-red-950 to-black", accent: "rose" },
  { id: "shy-stacks", title: "Shy in the Stacks", tagline: "Quiet girl. Loud body. Soft start.", blurb: "Sophie still whispers. The library closes. Cute-to-filthy is optional.", theme: "candle-library", characterId: "shy-library", scenarioId: "library-after-hours", role: "sub", mode: "slow-burn", intensity: 5, length: "medium", tags: ["Shy", "Cute", "Library"], coverGradient: "from-amber-950 via-stone-900 to-ink-950", accent: "amber" },
  { id: "fit-milf-sauna", title: "Sauna With the Fit MILF", tagline: "Young hot gym MILF. Towels optional.", blurb: "Brooke does not look old. She looks like a problem in a sports bra.", theme: "sunset-glow", characterId: "fit-milf", scenarioId: "sauna", role: "dom", mode: "immediate", intensity: 8, length: "short", tags: ["MILF", "Gym", "Filth"], coverGradient: "from-orange-950 via-yellow-950 to-ink-950", accent: "orange" },
  { id: "yandere-watch", title: "I've Been Watching", tagline: "Sweet. Obsessed. Already inside.", blurb: "Iris confesses the surveillance like a love poem. Yandere CNC-ready heat.", theme: "blood-rose", characterId: "psycho-crush", scenarioId: "yandere-confession", role: "yandere", mode: "cnc", intensity: 9, length: "medium", tags: ["Yandere", "Dark", "CNC"], coverGradient: "from-red-950 via-pink-950 to-black", accent: "red" },
];

for (const p of morePresets) {
  if (!pid.has(p.id)) {
    // only add if character + scenario exist
    if (byId[p.characterId] && sid.has(p.scenarioId)) {
      presets.presets.push(p);
      pid.add(p.id);
      console.log("preset+", p.id);
    } else {
      console.log("preset skip missing", p.id, p.characterId, p.scenarioId);
    }
  }
}
presets.version = "1.1.0";
presets.description = "Expanded one-click stories: cute, filth, young MILF, free-use, 18+.";
save("src/data/presets.json", presets);
console.log("presets", presets.presets.length);
console.log("done");
