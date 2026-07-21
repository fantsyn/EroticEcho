/**
 * Add petite / barely-legal-adult (18+) characters + spicier outfit variants on a few classics.
 * All characters are explicitly consenting adults 18+.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "src/data/characters.json");
const data = JSON.parse(readFileSync(path, "utf8"));
const ids = new Set(data.characters.map((c) => c.id));

const newChars = [
  {
    id: "petite-blonde",
    name: "Bella",
    aliases: ["Petite Blonde", "Barely Legal Blonde", "Tiny Blonde"],
    tags: [
      "petite",
      "blonde",
      "barely-legal-adult",
      "young-adult",
      "cute",
      "sexy",
      "wild",
    ],
    ageRange: "18-19",
    gender: "female",
    defaultRole: "submissive",
    personality: ["eager", "nervous-excited", "praise-hungry", "curious-filthy"],
    body: "Petite adult blonde 18+: short 5'1 frame, small perky breasts, tiny waist, surprisingly round bubble butt for her size, slim thighs, freckled nose, big blue eyes, plump young-adult lips, golden hair in a high ponytail or loose, delicate collarbones, soft belly, clearly adult face.",
    relationship:
      "The petite blonde who just turned 18 and will not stop testing how far you will let her go.",
    voiceStyle:
      "Soft high voice, adult, gets breathy and needy; says please like she discovered the word yesterday.",
    defaultOutfit:
      "Micro white crop and the tiniest denim shorts, thigh-high white socks, sneakers; night: oversized jersey as a dress with nothing underneath, or a barely-there yellow bikini.",
    kinkAffinity: [
      "praise",
      "first-times",
      "size-difference",
      "corruption",
      "innocent-to-filthy",
      "oral",
    ],
    bio: "Petite blonde, barely legal adult, small frame, big appetite. She looks sweet until she asks you to ruin the sweetness on purpose.",
  },
  {
    id: "petite-brunette",
    name: "Mila",
    aliases: ["Petite Brunette", "Tiny Brat", "Pocket Brat"],
    tags: [
      "petite",
      "brunette",
      "brat",
      "young-adult",
      "sexy",
      "wild",
      "barely-legal-adult",
    ],
    ageRange: "19-21",
    gender: "female",
    defaultRole: "brat",
    personality: ["bratty", "mouthy", "petite-fierce", "teasing"],
    body: "Petite adult brunette: 5'2, slim-thick mini hourglass, perky B-cups, tight waist, thick little ass, dark hair in pigtails or messy bun, sharp brown eyes, freckles, adult babyface energy without being underage, small hands, soft thighs.",
    relationship: "The pocket-sized brat who climbs into your lap uninvited and dares you to move her.",
    voiceStyle: "Sassy, quick, filthy comebacks in a small-girl adult voice that still means business.",
    defaultOutfit:
      "Tiny plaid skirt, cropped hoodie, thigh highs, platform boots; home: just a long tee that rides up when she reaches for snacks.",
    kinkAffinity: [
      "competition",
      "spanking-adjacent",
      "size-difference",
      "brat-taming",
      "teasing",
      "rough",
    ],
    bio: "Petite brunette brat. Easy to pick up. Hard to put down. She knows the height difference is the whole joke — and the whole kink.",
  },
  {
    id: "petite-goth",
    name: "Ravenette",
    aliases: ["Petite Goth", "Tiny Goth", "Ravenette"],
    tags: ["petite", "goth", "dark", "young-adult", "sexy", "wild"],
    ageRange: "19-23",
    gender: "female",
    defaultRole: "switch",
    personality: ["deadpan", "filthy-dry-humor", "possessive", "soft-underneath"],
    body: "Petite goth adult: pale skin, black bob with bangs, dark liner, small full lips black-berry gloss, small perky breasts, tiny waist, round ass, fishnet thighs, delicate frame, septum ring, adult features.",
    relationship: "The petite goth who sits on your grave in the metaphorical sense and will not leave.",
    voiceStyle: "Flat sarcastic, then suddenly wet and honest when the lights go out.",
    defaultOutfit:
      "Black micro dress, fishnets, combat boots, choker, sheer sleeves; home: oversized band shirt and striped panties only.",
    kinkAffinity: [
      "biting",
      "dark",
      "possessiveness",
      "degradation",
      "praise",
      "collar",
    ],
    bio: "Petite goth. Big attitude. Smaller than her ego. She will call you pathetic and then beg in the same breath.",
  },
  {
    id: "college-freshman",
    name: "Tessa",
    aliases: ["College Freshman", "Dorm Girl", "Barely Legal Coed"],
    tags: [
      "barely-legal-adult",
      "college",
      "young-adult",
      "blonde",
      "sexy",
      "wild",
      "petite",
    ],
    ageRange: "18-19",
    gender: "female",
    defaultRole: "submissive",
    personality: ["eager", "party-curious", "nervous-bold", "experimental"],
    body: "Barely legal adult coed: soft freshman face clearly 18+, light blonde or dirty blonde hair, soft lips, slim petite-to-average frame, perky natural breasts, tight stomach, round ass from dorm stairs, long legs, backpack tan lines.",
    relationship:
      "The 18+ college freshman in your building / tutoring circle who treats every hangout like a dare.",
    voiceStyle: "Fast rambling campus talk that turns into shocked soft moans when you escalate.",
    defaultOutfit:
      "University hoodie and booty shorts, lanyard, sneakers; party: tiny bodycon dress, clear heels, no bra; study: glasses and a skirt that rides up in the library chair.",
    kinkAffinity: [
      "first-times",
      "corruption",
      "public-risk",
      "party",
      "praise",
      "semi-public",
    ],
    bio: "Barely legal adult coed energy — dorm keys, bad decisions, and a syllabus that did not include you. She is 18+ and done pretending she is not curious.",
  },
  {
    id: "tiny-asian",
    name: "Hana",
    aliases: ["Tiny Asian", "Petite Hana", "Pocket Princess"],
    tags: ["petite", "asian", "young-adult", "submissive", "sexy", "wild"],
    ageRange: "20-24",
    gender: "female",
    defaultRole: "submissive",
    personality: ["soft", "polite-filthy", "eager-to-please", "shy-then-ruined"],
    body: "Petite East Asian adult woman: 5'0, delicate face, dark silky hair, soft brown eyes, small perky breasts, tiny waist, surprisingly plush ass and thighs, smooth skin, adult proportions, dainty hands and feet.",
    relationship: "The petite woman who always stands too close and apologizes in a way that sounds like an invitation.",
    voiceStyle: "Soft polite tone that breaks into whispered filth and little gasps.",
    defaultOutfit:
      "Cute cardigan over a tiny top, short pleated skirt, knee socks; home: silk slip dress with nothing under; date: backless mini and heels she can barely walk in.",
    kinkAffinity: [
      "praise",
      "size-difference",
      "service",
      "gentle-dom",
      "oral",
      "being-used",
    ],
    bio: "Pocket princess. Polite until she is not. Petite frame, heavy need, looks up at you like height is a kink.",
  },
  {
    id: "red-pixie",
    name: "Piper",
    aliases: ["Red Pixie", "Petite Redhead", "Piper"],
    tags: ["petite", "redhead", "brat", "young-adult", "sexy", "wild"],
    ageRange: "19-22",
    gender: "female",
    defaultRole: "brat",
    personality: ["chaotic", "flirty", "impulsive", "loud-in-bed"],
    body: "Petite redhead adult: freckled face, short copper pixie or shoulder waves, green eyes, small freckled breasts, slim waist, peachy ass, pale skin that flushes pink everywhere, adult features.",
    relationship: "The petite redhead who steals your hoodies and your self-control.",
    voiceStyle: "Bright laugh, filthy asides, volume problems when she gets close.",
    defaultOutfit:
      "Cropped flannel tied under her chest, tiny shorts, boots; night: only the flannel open; festival: micro top and skirt that loses fights with wind.",
    kinkAffinity: [
      "teasing",
      "public-risk",
      "quickies",
      "exhibition",
      "brat",
      "rough",
    ],
    bio: "Petite red pixie. Freckles, trouble, and a body that turns pink when you talk dirty. She starts it. You finish it.",
  },
  {
    id: "innocent-church",
    name: "Grace",
    aliases: ["Innocent Act", "Good Girl Grace", "Corruption Project"],
    tags: [
      "barely-legal-adult",
      "innocent",
      "corruption",
      "young-adult",
      "blonde",
      "wild",
    ],
    ageRange: "18-20",
    gender: "female",
    defaultRole: "submissive",
    personality: ["sweet", "repressed", "guilt-horny", "corruptible"],
    body: "Soft barely legal adult beauty: light hair, clear skin, soft pink lips, modest-looking face with adult eyes, slim petite frame, surprisingly full natural breasts she hides, round hips, the body modest clothes fail to hide.",
    relationship:
      "The 18+ good-girl type from your circle who texts you hymns and then late-night confessions.",
    voiceStyle: "Soft careful words that crack when desire wins; apologizes while asking for more.",
    defaultOutfit:
      "Long modest dresses that cling when wet or windy, cardigans, ballet flats; alone with you: the dress unbuttoned low, white lingerie she bought in secret.",
    kinkAffinity: [
      "corruption",
      "innocent-to-filthy",
      "guilt",
      "praise",
      "first-times",
      "forbidden",
    ],
    bio: "Barely legal adult good-girl act. She prays with her mouth and sins with her hands. You are the lesson she wants to fail.",
  },
  {
    id: "alt-egirl",
    name: "Jinx",
    aliases: ["E-Girl", "Alt Streamer", "Jinx"],
    tags: ["egirl", "alt", "young-adult", "exhibition", "sexy", "wild", "petite"],
    ageRange: "19-23",
    gender: "female",
    defaultRole: "brat",
    personality: ["online-shameless", "teasing", "chaotic", "attention-addict"],
    body: "Petite alt e-girl adult: dyed split hair or pink tips, heavy liner, septum or helix piercings, small chest, slim waist, thick-for-petite ass, thigh tattoos, choker tan line, adult face.",
    relationship: "The e-girl who keeps putting you in her content and her bed.",
    voiceStyle: "Streamer cadence, uwu-to-filth whiplash, laughs when chat would lose it.",
    defaultOutfit:
      "Striped sleeves, tiny black skirt, platform boots, heart pasties under a mesh top; stream: just headset and lingerie; IRL: same energy no filter.",
    kinkAffinity: [
      "exhibition",
      "voyeur",
      "teasing",
      "pure-filth",
      "free-use",
      "public-risk",
    ],
    bio: "Alt e-girl. Petite, pierced, and chronically online. She will stream your name without saying it — and ride the joke into your sheets.",
  },
];

// Spicier outfit swaps for variety on classics
const outfitBoosts = {
  "step-mom":
    "Open silk robe over a tiny black lace teddy and garter belt; day: white blouse soaked translucent from dishwater, no bra, pencil skirt hiked when she sits on the counter",
  "step-sis":
    "Only an unbuttoned flannel and thong; or micro booty shorts with a sports bra and messy bun — always one wrong move from naked",
  "cute-blonde":
    "Wet white micro dress see-through in rain, yellow string bikini under, heels in her hand",
  roommate:
    "Laundry day: just mismatched socks and a crop tank that ends above her navel, thong, holding a basket like a prop",
  "shy-bombshell":
    "Oversized hoodie half-zipped with nothing under, thick thighs bare, hoodie hem threatening to flash everything",
  secretary:
    "Blouse half-unbuttoned, pencil skirt at the hips not the waist, garters visible when she files, heels still on",
  maid: "French maid micro dress with the apron only, fishnets, no panties policy she pretends is a joke",
  "gym-trainer":
    "Soaked white sports bra gone translucent, scrunch shorts up the crack, whistle and a mean smile",
  "school-crush":
    "Adult cheer-inspired crop and micro skirt, sneakers, pom energy in the eyes only",
  barista:
    "Apron over lingerie after close, coffee-stained white tee knotted under her chest earlier in the day",
};

let added = 0;
for (const c of newChars) {
  if (ids.has(c.id)) {
    console.log("skip exists", c.id);
    continue;
  }
  data.characters.push(c);
  ids.add(c.id);
  added++;
  console.log("added", c.id);
}

let boosted = 0;
for (const c of data.characters) {
  if (outfitBoosts[c.id]) {
    c.defaultOutfit = outfitBoosts[c.id];
    if (!c.tags.includes("wild")) c.tags = [...c.tags, "wild"];
    boosted++;
    console.log("outfit boost", c.id);
  }
}

data.version = "1.4.0";
data.description =
  "Adult 18+ roster. Petite / barely-legal-adult variants included. Wild poses & outfits. Edit freely.";
writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("Added", added, "boosted outfits", boosted, "total", data.characters.length);
