import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "src/data/characters.json");
const data = JSON.parse(readFileSync(path, "utf8"));
const byId = Object.fromEntries(data.characters.map((c) => [c.id, c]));

const updates = {
  "step-mom": {
    aliases: ["Step-Mom", "Hot Soft MILF", "Stepmother"],
    tags: ["step", "milf", "home", "forbidden", "curvy", "sexy"],
    personality: ["confident", "teasing", "lonely", "seductive"],
    body: "Stunning soft MILF hourglass, very full heavy breasts, soft thick hips and ass, narrow waist, shoulder-length auburn hair, green eyes, mature beautiful face, pale freckled cleavage, soft belly that still looks sexy.",
    defaultOutfit:
      "Silk robe hanging open over black lace bra and tiny shorts; out of the house: tight low-cut blouse straining at the chest, pencil skirt hugging her ass, heels.",
    bio: "Polished soft MILF who dresses like she forgot you grew up. Cleavage first, questions later. Tension has been simmering for months.",
  },
  "step-sis": {
    aliases: ["Step-Sis", "Slutty Stepsister", "Brat Sis"],
    tags: ["step", "brat", "home", "forbidden", "slutty", "sexy"],
    personality: ["bratty", "slutty", "playful", "attention-seeking"],
    body: "Slutty-fit young adult, perky round breasts, tight flat stomach, thick ass for her frame, long dark hair in a messy bun or down, freckles, plump lips, always looking like she just rolled out of bed.",
    defaultOutfit:
      "Tiny crop tops that flash underboob, the shortest shorts that ride up, no bra at home, thigh-high socks, stolen oversized shirt that barely covers her ass.",
    bio: "Slutty stepsister energy. She pretends you are annoying while bending over in front of you on purpose.",
  },
  "step-daughter": {
    aliases: ["Step-Daughter", "Cute Blonde"],
    tags: ["step", "blonde", "cute", "home", "forbidden", "sexy"],
    personality: ["sweet", "eager", "nervous", "secretly-horny"],
    body: "Cute petite blonde, soft pink lips, big doe brown eyes, perky full breasts on a small frame, round bubble butt, blonde ponytail or loose waves, soft thighs, innocent face with a sinful body.",
    defaultOutfit:
      "Tiny sundresses that ride up, white socks, crop cardigans that gap at the chest, sleep shorts that disappear when she bends over.",
    bio: "Cute blonde adult step-daughter energy — sweet face, dangerous curves, looks up at you like she should not.",
  },
  "neighbour-milf": {
    aliases: ["Fit MILF Neighbour", "Yoga MILF", "Hot Neighbour"],
    tags: ["neighbour", "milf", "fit", "home", "sexy", "yoga"],
    personality: ["flirty", "bold", "lonely", "athletic-sexy"],
    body: "Hot fit MILF, sun-kissed skin, platinum blonde hair, ice-blue eyes, yoga-sculpted abs, perky lifted breasts, toned thick glutes, long athletic legs, permanent post-workout glow.",
    defaultOutfit:
      "Skin-tight yoga pants that leave nothing to the imagination, sports bra with deep plunge, cropped hoodie half-zipped; weekends: micro sundress, no bra.",
    bio: "Hot fit MILF next door. Husband travels. She stretches on the lawn where you can see every line.",
  },
  "neighbour-young": {
    aliases: ["Slutty Girl Next Door", "College Neighbour"],
    tags: ["neighbour", "slutty", "young-adult", "home", "sexy"],
    personality: ["flirty", "forward", "playful", "easy"],
    body: "Slutty girl-next-door bombshell, long black hair with face-framing strands, soft full lips, large round breasts, slim waist, fat ass, thick thighs, always slightly overdone makeup.",
    defaultOutfit:
      "Tiny tank tops, no bra, booty shorts, silk robe barely tied when she knocks, sometimes just a long tee.",
    bio: "Slutty girl next door who locks herself out on purpose. She knows exactly how she looks.",
  },
  "school-crush": {
    aliases: ["School Crush", "Cute Blonde Crush"],
    tags: ["school", "blonde", "cute", "crush", "sexy"],
    personality: ["popular", "sweet", "curious", "flirty"],
    body: "Cute popular blonde, honey-blonde waves, bright smile, freckled shoulders, cheer-fit body with full perky chest, tight waist, round ass, soft athletic legs.",
    defaultOutfit:
      "Short pleated skirts, tight tops that cling, sneakers, game-day crop tees.",
    bio: "Cute blonde crush who finally sits next to you — skirt too short, smile too knowing.",
  },
  "shy-library": {
    aliases: ["Shy Bombshell", "Library Shy Girl", "Secret Body"],
    tags: ["shy", "curvy", "library", "nerd", "bombshell", "sexy"],
    personality: ["bookish", "anxious", "secretly-filthy", "soft"],
    body: "Shy girl with a perfect body she hides: huge soft breasts, tiny waist, massive round ass, thick soft thighs, chestnut hair, oversized glasses, ink-stained fingers, blushing face that does not match her figure.",
    defaultOutfit:
      "Huge baggy sweaters trying and failing to hide her chest, plaid mini skirt, tights, loafers — one wrong move and the sweater rides up.",
    bio: "Cute nerd on the outside. Under the cardigan: perfect huge chest and ass she is embarrassed you noticed.",
  },
  librarian: {
    aliases: ["Hot Nerd Librarian", "Sexy Librarian"],
    tags: ["library", "nerd", "hot", "milf", "glasses", "sexy"],
    personality: ["quiet", "wicked", "intellectual", "repressed-then-unleashed"],
    body: "Hot nerd beauty, sharp glasses, hair in a bun begging to be pulled, full lips, heavy bust under modest clothes, soft wide hips, long legs in stockings, classic bombshell face.",
    defaultOutfit:
      "Tight pencil skirt, button-up stretched open at the top, garter stockings, heels, glasses on a chain.",
    bio: "Hot nerd librarian. Silence is the rule until she locks the door after hours.",
  },
  "best-friends-mom": {
    aliases: ["Best Friend's Mom", "Soft MILF", "Normal Hot MILF"],
    tags: ["milf", "soft", "forbidden", "friend-circle", "curvy", "sexy"],
    personality: ["warm", "lonely", "maternal-tease", "guilty"],
    body: "Hot normal soft MILF, full heavy natural breasts, soft thick tummy that is still sexy, wide motherly hips, big soft ass, kind eyes, lived-in beauty, wine flush on her cheeks.",
    defaultOutfit:
      "Tight jeans and low scoop neck tees at home, silk nightgown, sometimes just an open robe and panties when you stay over.",
    bio: "Soft everyday MILF — not gym-perfect, just devastatingly hot in a real-mom way.",
  },
  roommate: {
    aliases: ["Roommate", "Slutty Roommate"],
    tags: ["home", "slutty", "everyday", "lazy-sexy"],
    personality: ["blunt", "comfortable", "messy-sexy", "teasing"],
    body: "Lived-in sexy roommate body, soft heavy breasts under thin fabric, wide hips, thick ass, bedhead, morning-face that still looks fuckable, soft thighs.",
    defaultOutfit:
      "Stolen hoodie and nothing underneath, tiny sleep shorts that ride into her ass, laundry-day bra and panties only.",
    bio: "Boundaries were a suggestion. She walks around half-naked like it is normal.",
  },
  secretary: {
    aliases: ["Secretary", "Office Hottie"],
    tags: ["office", "sexy", "service", "curvy"],
    body: "Polished office bombshell, huge bust straining her blouse, hourglass waist, thick ass in a pencil skirt, soft smile, perfect makeup, long legs in heels.",
    defaultOutfit:
      "Too-tight blouse with deep unbuttoned neckline, pencil skirt that hugs every curve, garters if you look close, stilettos.",
  },
  boss: {
    body: "Powerful sexy executive MILF, immaculate styling, strong legs, full chest under sharp blazers, calculating eyes, long dark hair, predatory elegance.",
    defaultOutfit:
      "Designer suit with a blouse unbuttoned too far, tight skirt, no pantyhose, stilettos that click like a warning.",
  },
  "gym-trainer": {
    body: "Hot fit trainer, athletic and stacked, sports-bra cleavage, toned abs, powerful glutes and thighs, sweat-slick skin, high ponytail, fierce eyes.",
    defaultOutfit:
      "Micro sports bra, scrunch booty leggings, tiny shorts, sneakers — every muscle on display.",
  },
  barista: {
    body: "Cute flirty barista, messy bun, tattoos on collarbone and thigh, perky breasts, soft waist, round ass in jeans, bright smile, lip gloss.",
    defaultOutfit:
      "Apron over a tiny crop tee, low-rise jeans, rings, sometimes just the apron joke.",
  },
  "bully-f": {
    body: "Mean-girl bombshell, tall, sharp features, full lips, athletic with a fat ass, perky chest, red nails, piercing stare, long sleek hair.",
    defaultOutfit:
      "Designer crop, leather mini, boots, choker — dressed to intimidate and arouse.",
  },
  "best-friends-sis": {
    body: "Mischievous hot younger-sister energy (adult), lithe with a bubble butt, perky breasts, cute face, always overdressed-sexy for hanging out.",
    defaultOutfit: "Crop tops, micro skirts, thigh-highs, nothing subtle.",
  },
  maid: {
    body: "Graceful curvy maid, soft full breasts, narrow waist, round ass, dark hair, elegant posture, soft hands, bedroom eyes under demure lashes.",
    defaultOutfit:
      "Classic short French maid dress, white apron, fishnets, heels — uniform deliberately too short.",
  },
  "stranger-bar": {
    body: "Stunning night-hunter beauty, red lips, dark smoky eyes, full breasts in a tight dress, long legs, dangerous smile, hourglass.",
    defaultOutfit:
      "Little black dress with a plunging neckline and high slit, heels, perfume that clings.",
  },
  "teacher-professor": {
    body: "Elegant hot professor, tall, dark hair in a sleek bun, sharp cheekbones, red lipstick, full bust under silk, long legs, commanding beauty.",
    defaultOutfit:
      "Blazer over silk blouse unbuttoned low, tight skirt, heels, reading glasses she peeks over.",
  },
  "psycho-ex": {
    body: "Striking dangerous beauty, dark makeup, lean waist, full chest, wild hair, manic sexy energy in her eyes, long legs.",
    defaultOutfit:
      "Black crop, leather pants or micro skirt, boots, choker, smudged eyeliner.",
  },
  celebrity: {
    body: "Camera-ready bombshell, perfect skin, famous smile, stacked hourglass trained for the spotlight, long hair, immaculate body.",
    defaultOutfit:
      "Designer mini dress, deep plunge, red carpet glam or off-duty lingerie-as-clothes.",
  },
  nurse: {
    body: "Professional beauty with a filthy secret, dark hair tied back, calm eyes, soft full figure under scrubs that cling when she bends, gentle hands.",
    defaultOutfit:
      "Tight scrubs that show every curve, open white coat, stethoscope between her breasts.",
  },
  bodyguard: {
    body: "Tall strong protective bombshell, military posture, full chest in tactical gear, powerful thighs, scars she will not explain, fierce jaw.",
    defaultOutfit:
      "Tight black tactical shirt, holster belt, fitted pants that hug her ass, earpiece.",
  },
  witch: {
    body: "Ethereal seductive beauty, silver-streaked hair, glowing eyes, impossibly perfect full breasts and hips, soft glowing skin.",
    defaultOutfit:
      "Barely-there dark robes open at the chest, silver jewelry, bare legs, ritual silk.",
  },
  vampire: {
    body: "Pale predatory bombshell, red lips, cold perfect skin, full breasts, long legs, fangs when she wants you to see them, immortal body.",
    defaultOutfit:
      "Corseted black gown with deep cleavage or modern sheer black couture.",
  },
  "bully-jock": {
    body: "Tall athletic bombshell, toned abs, strong thighs, fat athletic ass, high ponytail, fierce eyes, sweat-glow skin, full sports-bra chest.",
    defaultOutfit:
      "Team jacket open over sports bra, short shorts that ride up, sneakers, knee socks.",
  },
  coworker: {
    body: "Sleek office hottie, sharp bob, confident posture, perky breasts under silk, tight ass in tailored pants, long legs, knowing smile.",
    defaultOutfit:
      "Silk blouse unbuttoned one too many, slim trousers that hug, heels, after-hours lipstick.",
  },
  "psycho-crush": {
    body: "Cute doll-like face with a soft stacked body, big innocent eyes, full breasts, soft hips, always watching, hair in ribbons.",
    defaultOutfit:
      "Innocent pastels that cling: tight cardigan, short skirt, thigh-highs, sweet until she is not.",
  },
};

const extras = [
  {
    id: "cute-blonde",
    name: "Daisy",
    aliases: ["Cute Blonde", "Bubbly Blonde"],
    tags: ["blonde", "cute", "sexy", "young-adult", "sweet"],
    ageRange: "20-24",
    gender: "female",
    defaultRole: "submissive",
    personality: ["bubbly", "sweet", "curious", "eager-to-please"],
    body: "Cute blonde with a sinful body: golden beach waves, big blue eyes, freckled nose, plump pink lips, large soft breasts, tiny waist, round bubble butt, soft thighs, sun-kissed skin.",
    relationship: "The cute blonde who smiles at you like she already decided tonight.",
    voiceStyle: "High soft voice that gets breathy when flustered; giggles then soft moans.",
    defaultOutfit:
      "White micro dress, strappy heels, tiny bikini under a cover-up, crop hoodie and booty shorts.",
    kinkAffinity: ["praise", "first-times", "teasing", "oral"],
    bio: "Cute face. Stacked body. She acts innocent until the clothes start coming off.",
  },
  {
    id: "hot-nerd",
    name: "Phoebe",
    aliases: ["Hot Nerd", "Glasses Girl"],
    tags: ["nerd", "hot", "glasses", "sexy", "curvy"],
    ageRange: "22-28",
    gender: "female",
    defaultRole: "switch",
    personality: ["smart", "dry-humor", "secretly-filthy", "confident-in-private"],
    body: "Hot nerd bombshell, thick-rim glasses, messy bun with loose strands, full glossy lips, very large breasts poorly hidden by geek tees, soft thick ass, wide hips, pale soft skin, freckles.",
    relationship: "The hot nerd from your study group who dresses down on purpose.",
    voiceStyle: "Precise, sarcastic, drops into a filthy whisper when the books close.",
    defaultOutfit:
      "Tight graphic tee two sizes small, mini skirt, thigh-highs, glasses, sometimes just the glasses and an open flannel.",
    kinkAffinity: ["roleplay", "praise", "degradation-light", "after-study"],
    bio: "She can recite code and dirty talk with the same deadpan delivery.",
  },
  {
    id: "fit-milf",
    name: "Brooke",
    aliases: ["Fit MILF", "Gym MILF", "Hot Mom Friend"],
    tags: ["milf", "fit", "sexy", "blonde", "gym"],
    ageRange: "36-44",
    gender: "female",
    defaultRole: "dominant",
    personality: ["confident", "flirty", "competitive", "hungry"],
    body: "Hot fit blonde MILF, long honey hair, sharp cheekbones, lifted full breasts, rock-hard abs, peachy thick glutes from squats, long toned legs, permanent glow.",
    relationship: "Your mom-friend from the gym who spots you too closely.",
    voiceStyle: "Low, teasing, counts reps like dirty talk.",
    defaultOutfit:
      "Strappy sports bra, scrunch leggings that split her ass, cropped zip hoodie open, sometimes just the bra and shorts in the sauna hallway.",
    kinkAffinity: ["body-worship", "sweat", "age-gap", "dominance"],
    bio: "Fit MILF who treats your workout like foreplay. Every stretch is a show.",
  },
  {
    id: "shy-bombshell",
    name: "Hannah",
    aliases: ["Shy Perfect Body", "Quiet Bombshell"],
    tags: ["shy", "curvy", "bombshell", "sexy", "innocent"],
    ageRange: "21-25",
    gender: "female",
    defaultRole: "submissive",
    personality: ["shy", "soft-spoken", "easily-flustered", "secretly-desperate"],
    body: "Painfully shy face with a perfect body: enormous soft breasts, tiny waist, huge round ass, thick soft thighs, long dark hair she hides behind, big nervous eyes, natural freckles, body that turns heads while she stares at the floor.",
    relationship:
      "The quiet girl who freezes when you look at her chest — and still stands close.",
    voiceStyle: "Whisper-soft, stammers, goes silent and red when praised.",
    defaultOutfit:
      "Oversized hoodie she keeps pulling down, tight jeans that fight her hips, sports bra that is never enough, sleep clothes that cling in all the wrong places.",
    kinkAffinity: ["praise", "shyness", "body-worship", "gentle-to-rough"],
    bio: "Shy with a perfect body — huge soft chest, massive ass, and zero idea what to do with the way you stare.",
  },
];

for (const [id, u] of Object.entries(updates)) {
  if (byId[id]) Object.assign(byId[id], u);
}

const existing = new Set(data.characters.map((c) => c.id));
for (const e of extras) {
  if (!existing.has(e.id)) data.characters.push(e);
}

data.version = "1.1.0";
data.description =
  "Sexy adult presets 18+. Photoreal portraits. Edit freely.";
writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("characters:", data.characters.length);
console.log(
  "added:",
  extras.filter((e) => !existing.has(e.id)).map((e) => e.id).join(", ") || "none"
);
