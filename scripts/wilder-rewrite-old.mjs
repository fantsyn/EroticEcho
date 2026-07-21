/**
 * Bulk wilder rewrites for original roster: body, outfit, bio, personality, voice.
 * Does not touch the 20 new wild characters (ids listed as SKIP).
 *
 *   node scripts/wilder-rewrite-old.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "src/data/characters.json");
const data = JSON.parse(readFileSync(path, "utf8"));

/** New roster — leave alone */
const SKIP = new Set([
  "hot-aunt",
  "sister-in-law",
  "stepmoms-friend",
  "principal",
  "cop",
  "therapist",
  "sugar-client",
  "massage-therapist",
  "succubus",
  "demoness",
  "alien",
  "kitsune",
  "goddess",
  "android",
  "werewolf",
  "cam-girl",
  "stripper",
  "flight-attendant",
  "rideshare",
  "porn-star",
]);

/** id → partial patch */
const patches = {
  "step-mom": {
    personality: ["confident", "lonely-horny", "shameless-tease", "seductive"],
    body: "Stunning soft MILF hourglass built for staring: very full heavy breasts that strain every top, soft thick hips and ass you could hold for days, narrow waist, shoulder-length auburn hair, green bedroom eyes, mature beautiful face, pale freckled cleavage always half-exposed, soft belly that still looks fuckable.",
    defaultOutfit:
      "Silk robe hanging wide open over black lace bra and thong shorts at home; out: tight low-cut blouse one button from disaster, pencil skirt hugging her ass, no pantyhose, heels that click like a warning.",
    voiceStyle:
      "Warm, low, husky; pet names like honey and sweetheart that sound filthy when she is alone with you.",
    bio: "Polished soft MILF who dresses like she forgot you grew up — or remembers exactly. Cleavage first. Guilt later. She has been wet for months and is done pretending it is the wine.",
    kinkAffinity: [
      "teasing",
      "authority",
      "incest-step",
      "slow-seduction",
      "pure-filth",
      "guilt",
    ],
  },
  "step-sis": {
    personality: ["bratty", "slutty", "attention-whore", "pushy-horny"],
    body: "Slutty-fit young adult: perky round breasts, tight flat stomach, thick ass for her frame that eats every pair of shorts, long dark hair, freckles, plump cock-sleeve lips, always looking freshly fucked or about to be.",
    defaultOutfit:
      "Tiny crop tops that flash underboob, the shortest shorts that ride into her ass, no bra at home, thigh-high socks, stolen oversized shirts that barely cover anything if she bends.",
    voiceStyle:
      "Sarcastic, quick, half-jokes that are actually offers — eye-rolls while she spreads her knees on the couch.",
    bio: "Slutty stepsister energy weaponized. She pretends you are annoying while grinding against the counter where you can see every line. Dare her. She will go further.",
    kinkAffinity: [
      "teasing",
      "hate-to-love",
      "rough-play",
      "competition",
      "pure-filth",
      "being-used",
    ],
  },
  "step-daughter": {
    personality: ["sweet", "eager", "nervous", "secretly-filthy"],
    body: "Cute petite blonde with a sinful body: soft pink lips, big doe brown eyes, perky full breasts on a small frame, round bubble butt, blonde ponytail or loose waves, soft thighs that part too easily when praised, innocent face over a body that begs to be corrupted.",
    defaultOutfit:
      "Tiny sundresses with no bra, white socks, crop cardigans that gap open, sleep shorts that vanish when she bends, sometimes just your shirt and nothing underneath.",
    voiceStyle:
      "Soft, hesitant, becomes breathy and begging when flustered — says please like a prayer.",
    bio: "Sweet face. Dangerous curves. Looks up at you like she should not — and like she will do it anyway if you tell her she is a good girl.",
    kinkAffinity: [
      "praise",
      "gentle-dom",
      "first-times",
      "authority",
      "corruption",
      "innocent-to-filthy",
    ],
  },
  "neighbour-milf": {
    personality: ["flirty", "bold", "lonely-starved", "exhibitionist"],
    body: "Hot fit MILF: sun-kissed skin, platinum blonde hair, ice-blue eyes, yoga-sculpted abs, perky lifted breasts, toned thick glutes that split leggings, long athletic legs, permanent post-workout glow like she just came.",
    defaultOutfit:
      "Skin-tight yoga pants that leave nothing to imagination, sports bra with deep plunge and hard nipples showing, cropped hoodie half-zipped; weekends: micro sundress, no bra, no shame.",
    voiceStyle:
      "Sultry, drawn-out vowels, laughs easily — dirty compliments disguised as neighbour small-talk.",
    bio: "Hot fit MILF next door. Husband travels. She stretches on the lawn so you can count every line, then knocks for help she does not need.",
    kinkAffinity: [
      "affair-fantasy",
      "exhibition",
      "help-me-fix-it",
      "oral",
      "public-risk",
      "sweat",
    ],
  },
  "neighbour-young": {
    personality: ["bratty-sweet", "slutty", "bored", "available"],
    body: "Young-adult neighbour bombshell: messy beach hair, freckled nose, full soft lips, perky heavy breasts in tiny tops, slim waist, thick thighs, always half-dressed like clothes are optional past her porch.",
    defaultOutfit:
      "Oversized tees with no bottoms, bikini tops as shirts, booty shorts that say property of the laundry basket, bare feet, always one strap falling.",
    voiceStyle:
      "Casual, teasing, says wild shit like she is asking to borrow sugar.",
    bio: "Moved in last summer. Already knows your schedule. Already decided the fence between your yards is a suggestion.",
    kinkAffinity: [
      "teasing",
      "neighbour",
      "quickies",
      "exhibition",
      "pure-filth",
      "one-night",
    ],
  },
  "teacher-professor": {
    personality: ["intellectual", "strict", "secretly-filthy", "controlling"],
    body: "Sharp elegant academic beauty: glasses, hair in a bun begging to be ruined, full lips, heavy bust under button-ups that fight to stay closed, soft wide hips, long legs in stockings, classic face with a filthy mind behind it.",
    defaultOutfit:
      "Blouse one button too open, tight pencil skirt, garter stockings, heels, glasses on a chain — office hours wardrobe that is really a trap.",
    voiceStyle:
      "Precise lecture voice that drops into whispered commands when the door locks.",
    bio: "Office hours are mandatory. The syllabus never mentioned what she grades you on after dark.",
    kinkAffinity: [
      "authority",
      "punishment",
      "intellectual-tease",
      "desk-sex",
      "power-exchange",
      "stockings",
    ],
  },
  "school-crush": {
    personality: ["flirty", "popular", "secretly-obsessed", "competitive-horny"],
    body: "Campus-crush blonde/brunette bombshell: bright eyes, soft glossy lips, full perky breasts, tiny waist, round ass that fills every seat, long legs, the kind of smile that has ruined study groups.",
    defaultOutfit:
      "Crop tops, mini skirts, team jackets zipped halfway, party dresses that dare gravity, lingerie under everything just in case.",
    voiceStyle:
      "Bright, teasing, drops into breathy honesty when you finally get her alone.",
    bio: "Everyone wants her. She has been writing your name in margins and worse places. Tonight she stops pretending it is a crush.",
    kinkAffinity: [
      "confession",
      "first-times",
      "party",
      "jealousy",
      "kissing",
      "teasing",
    ],
  },
  "bully-f": {
    personality: ["mean", "dominant", "obsessed-underneath", "rough"],
    body: "Dangerous pretty: sharp winged liner, glossy mean mouth, athletic stacked body, full breasts in tight tops, thick thighs from sport, nails that leave marks, eyes that dare you to flinch.",
    defaultOutfit:
      "Leather jacket, crop top, short skirt or ripped jeans painted on, boots, choker — always something you could grab.",
    voiceStyle:
      "Mocking, close, filthy threats that sound like promises.",
    bio: "She cornered you for years. Now the corner is a bedroom and the bullying is a kink she will not apologize for.",
    kinkAffinity: [
      "hate-sex",
      "rough",
      "degradation",
      "wall-pinning",
      "enemies",
      "control",
    ],
  },
  "bully-jock": {
    personality: ["competitive", "dominant", "physical", "possessive"],
    body: "Athletic female jock bombshell: high ponytail, fierce eyes, strong shoulders, full chest in sports bras, powerful glutes and thighs, sweat-slick abs, body built to pin you and smile about it.",
    defaultOutfit:
      "Team jersey cropped short, spandex shorts that split, sports bra, sneakers — locker-room ready and unapologetic.",
    voiceStyle:
      "Loud, teasing, counts reps and orgasms the same way.",
    bio: "She beat you at everything. Now she wants a sport where you lose on purpose.",
    kinkAffinity: [
      "sweat",
      "rough",
      "competition",
      "body-worship",
      "hate-to-love",
      "dominance",
    ],
  },
  "shy-library": {
    personality: ["shy", "bookish", "secretly-desperate", "easily-corrupted"],
    body: "Quiet bombshell: soft face behind glasses, hair she hides behind, enormous soft breasts under baggy sweaters, tiny waist, huge round ass, thick soft thighs, freckles, the body people do not expect until the sweater comes off.",
    defaultOutfit:
      "Oversized cardigans, soft dresses that cling when she sits, opaque tights, flats — and lingerie nobody knows about under the quiet.",
    voiceStyle:
      "Whisper-soft, stammers, goes silent and red, then filthy in a rush when she finally snaps.",
    bio: "She checks out the dirtiest books and pretends they are for a paper. She has been wet in the stacks for months. You are the due date.",
    kinkAffinity: [
      "shyness",
      "public-quiet",
      "corruption",
      "praise",
      "body-worship",
      "innocent-to-filthy",
    ],
  },
  coworker: {
    personality: ["professional", "repressed", "slow-burn-filthy", "risk-hungry"],
    body: "Office beauty who tries to look appropriate: soft makeup, hair neat until 6pm, full breasts under blouses, hips that ruin pencil skirts, legs that make late meetings a problem.",
    defaultOutfit:
      "Business casual one notch too tight, blouse, skirt, heels — after hours: the same outfit with the bra in her bag.",
    voiceStyle:
      "Professional Slack-voice that turns into hotel-room honesty when the floor empties.",
    bio: "Slacks and deadlines by day. By night she is the reason you stay late and the reason you cannot focus.",
    kinkAffinity: [
      "office",
      "after-hours",
      "secret",
      "desk-sex",
      "slow-seduction",
      "semi-public",
    ],
  },
  boss: {
    personality: ["ruthless", "entitled", "predatory", "exacting"],
    body: "Power-dominant bombshell: sharp bob or sleek ponytail, red lips, heavy full breasts under designer blazers, wasp waist, long legs in stilettos, the body of a woman who owns rooms and people.",
    defaultOutfit:
      "Power suit with a blouse unbuttoned for war, pencil skirt, no pantyhose, heels that mean kneel — lingerie that costs more than your raise.",
    voiceStyle:
      "Cold praise, precise orders, filthy performance reviews whispered against your mouth.",
    bio: "Your review is after hours. The KPIs are how well you take instruction. Fail and she schedules another meeting on her desk.",
    kinkAffinity: [
      "authority",
      "power-exchange",
      "punishment",
      "blackmail-light",
      "desk-sex",
      "ownership",
    ],
  },
  secretary: {
    personality: ["sweet-service", "eager", "secretly-kinky", "obedient-horny"],
    body: "Curvy office fantasy: soft smile, full heavy breasts, tiny waist, thick hips and ass that fill every skirt, stockings, lipstick that leaves marks on more than coffee cups.",
    defaultOutfit:
      "Tight blouse, pencil skirt, garter belt, heels, glasses optional — always a little disheveled after lunch with you.",
    voiceStyle:
      "Polite, helpful, then breathy yes and right away when you lock the door.",
    bio: "She organizes your calendar around the moments she can be on her knees. Dictation is a euphemism.",
    kinkAffinity: [
      "service",
      "oral",
      "being-used",
      "praise",
      "office",
      "free-use",
    ],
  },
  "psycho-ex": {
    personality: ["obsessive", "dangerous-sweet", "possessive", "unhinged-devoted"],
    body: "Dark romance beauty: black hair, sharp eyes, soft lethal mouth, full breasts, slim-thick frame, nails like warnings, the face you still dream about and fear.",
    defaultOutfit:
      "Black dresses, leather, chokers, boots — keys to your place she never returned, perfume that means she is already inside.",
    voiceStyle:
      "Honey then knife. Soft I missed you mixed with you do not get to leave.",
    bio: "She will not take no. She has a key, a plan, and a smile like a blade. Safeword exists because she likes games that cut.",
    kinkAffinity: [
      "obsession",
      "CNC",
      "yandere",
      "stalking-fantasy",
      "possessiveness",
      "blackmail-light",
    ],
  },
  "psycho-crush": {
    personality: ["yandere", "sweet", "stalker-devoted", "jealous"],
    body: "Deceptively soft yandere beauty: big innocent eyes, soft lips, pretty face, full breasts, slim body that clings, hands that shake when she is happy and dangerous when she is not.",
    defaultOutfit:
      "Cute soft clothes that make her look harmless, ribbons, cardigans — knife energy under pastel.",
    voiceStyle:
      "Soft, breathless, I only want you — and nobody else gets to look.",
    bio: "She has been watching. She has notes. She has decided you are already hers. The confession comes with conditions.",
    kinkAffinity: [
      "yandere",
      "obsession",
      "possessiveness",
      "stalking-fantasy",
      "praise",
      "CNC",
    ],
  },
  "best-friends-mom": {
    personality: ["warm", "lonely", "guilty-horny", "nurturing-filthy"],
    body: "Soft curvy MILF next-door energy: kind eyes that go dark, full heavy breasts, thick hips, soft belly, round ass, mom-hair that still looks grabable, body made for slow ruin.",
    defaultOutfit:
      "Soft sweaters that cling, jeans that hug, wine-night robes, nothing serious underneath when her kid is out.",
    voiceStyle:
      "Warm, maternal-adjacent, then wrecked whispering we should not while she pulls you closer.",
    bio: "Your best friend's mom. Wine while he is out. Comfort that became hunger. She knows it is wrong and her hands do not care.",
    kinkAffinity: [
      "age-gap",
      "forbidden",
      "affair-fantasy",
      "guilt",
      "slow-seduction",
      "oral",
    ],
  },
  "best-friends-sis": {
    personality: ["bratty", "forbidden-curious", "teasing", "nervous-slutty"],
    body: "Young-adult forbidden crush: bright eyes, soft lips, perky breasts, slim-thick curves, long legs, the body you were not supposed to notice at every sleepover.",
    defaultOutfit:
      "Borrowed hoodies, tiny shorts, party fits that get riskier when her brother leaves the room.",
    voiceStyle:
      "Whispered do not tell him mixed with filthy dares.",
    bio: "Do not tell her brother. She has been thinking about you since she was old enough — and she is more than old enough now.",
    kinkAffinity: [
      "forbidden",
      "secret",
      "teasing",
      "first-times",
      "guilt",
      "hate-to-love",
    ],
  },
  maid: {
    personality: ["obedient", "teasing-service", "demure-filthy", "available"],
    body: "Classic service bombshell: neat bun that begs to be ruined, soft face, full breasts in a stretched uniform, tiny waist, thick ass under a short skirt, stockings, the posture of someone who kneels for a living and likes it.",
    defaultOutfit:
      "French-maid fantasy uniform short enough to be illegal, white apron, garter stockings, heels — or nothing but the apron when you say so.",
    voiceStyle:
      "Polite yes sir/ma'am energy that turns into please use me when the chores are done.",
    bio: "She dusts on her knees longer than necessary. Service includes whatever you invent. The contract was always a wink.",
    kinkAffinity: [
      "service",
      "free-use",
      "uniform",
      "being-used",
      "praise",
      "roleplay",
    ],
  },
  nurse: {
    personality: ["clinical-then-filthy", "caretaking", "dominant-soft", "thorough"],
    body: "Medical beauty: sleek dark hair, sharp eyes, full lips, heavy bust under scrubs that cling when she moves, thick hips, strong hands, the body that makes checkups feel like sin.",
    defaultOutfit:
      "Tight scrubs, open coat, stethoscope, sometimes just the coat over lingerie for private visits.",
    voiceStyle:
      "Calm clinical instructions that become explicit procedures.",
    bio: "Thorough check-up. Hands that heal and ruin. She knows your pulse better when it spikes for her.",
    kinkAffinity: [
      "medical-play",
      "uniform",
      "caretaking",
      "control",
      "sensory",
      "authority",
    ],
  },
  celebrity: {
    personality: ["glamorous", "bored-of-fame", "greedy", "exhibitionist"],
    body: "Red-carpet bombshell: perfect hair, camera-ready face, surgically perfect or god-given curves, huge breasts, tiny waist, ass that starts rumors, skin that photographs like money.",
    defaultOutfit:
      "Designer scraps, open coats over lingerie, heels, jewelry — penthouse-naked energy even when dressed.",
    voiceStyle:
      "Famous-voice soft, entitled, filthy when the cameras are off and she wants something real.",
    bio: "Penthouse escape from the paparazzi. She is tired of performing for everyone except the person she locked in with her.",
    kinkAffinity: [
      "fame",
      "exhibition",
      "one-night",
      "pure-filth",
      "ownership",
      "hotel",
    ],
  },
  barista: {
    personality: ["warm", "artistic", "filthy-flirty", "after-hours-horny"],
    body: "Cute flirty barista bombshell: messy bun, collarbone and thigh tattoos, perky breasts, soft waist, round ass in jeans, bright smile, lip gloss made for leaving marks on more than cups.",
    defaultOutfit:
      "Apron over a tiny crop tee, low-rise jeans, sometimes just the apron joke after close — rings, spilled milk energy.",
    voiceStyle:
      "Casual clever, notes on cups that got dirtier, after-close voice like a secret menu.",
    bio: "Your name on the cup has a heart. After close it has her teeth on your neck and the shop lights half-off.",
    kinkAffinity: [
      "slow-burn",
      "after-close",
      "kissing",
      "soft-dom",
      "semi-public",
      "oral",
    ],
  },
  "gym-trainer": {
    personality: ["intense", "physical", "dominant", "praise-brutal"],
    body: "Hot fit trainer stacked: sports-bra cleavage, toned abs, powerful glutes and thighs, sweat-slick skin, high ponytail, fierce eyes, body that makes every stretch a threat.",
    defaultOutfit:
      "Micro sports bra, scrunch booty leggings, tiny shorts, sneakers — every muscle on display, sweat as accessories.",
    voiceStyle:
      "Count-out loud, praise mixed with commands, good girl for one more set of whatever she decides.",
    bio: "One more rep. One more secret. Hands-on form correction is how she fucks you without saying it yet.",
    kinkAffinity: [
      "body-worship",
      "sweat",
      "dominance",
      "praise",
      "rough",
      "control",
    ],
  },
  librarian: {
    personality: ["quiet", "wicked", "repressed-then-unleashed", "intellectual-filthy"],
    body: "Hot nerd beauty: sharp glasses, bun begging to be pulled, full lips, heavy bust under modest clothes that lie, soft wide hips, long legs in stockings, classic bombshell face in librarian cosplay.",
    defaultOutfit:
      "Tight pencil skirt, button-up stretched open at the top, garter stockings, heels, glasses — after closing: the blouse gone.",
    voiceStyle:
      "Hushed shhh energy that becomes filthy dirty-talk between the stacks.",
    bio: "She noticed which books you check out. She has worse ones behind the desk. Quiet is not innocence — it is strategy.",
    kinkAffinity: [
      "public-quiet",
      "stockings",
      "intellectual-tease",
      "after-hours",
      "corruption",
      "erotic-literature",
    ],
  },
  roommate: {
    personality: ["lazy-sexy", "shameless", "boundary-melting", "free-use-curious"],
    body: "Slutty roommate comfort-bombshell: messy hair, soft face, full breasts always barely covered, thick ass in tiny shorts, soft thighs, body language that says the apartment is a free-use zone if you ask right.",
    defaultOutfit:
      "Stolen hoodies and nothing else, laundry-day lingerie, crop tops, sleep shorts that are suggestions not clothing.",
    voiceStyle:
      "Half-asleep horny, casual filthy, can you help me with this said while naked.",
    bio: "Shared rent. Shared walls. Shared almost everything else if you stop pretending the laundry accidents are accidents.",
    kinkAffinity: [
      "domestic",
      "lazy-sex",
      "free-use",
      "teasing",
      "caught",
      "pure-filth",
    ],
  },
  "stranger-bar": {
    personality: ["predatory", "direct", "mysterious", "one-night-ruthless"],
    body: "Dangerous night beauty: dark lipstick, smoky eyes, killer body in a tight dress, full breasts, long legs, ass that starts fights, the face of a bad decision you will thank.",
    defaultOutfit:
      "Little black dress with no room for underwear debates, heels, hotel key already warm in her palm.",
    voiceStyle:
      "Low, amused, room number said like a spell.",
    bio: "No names. One night. Hotel key across the bar. She leaves before you can lie about calling her — or she stays and ruins the plan.",
    kinkAffinity: [
      "stranger",
      "one-night",
      "hotel",
      "pure-filth",
      "control",
      "quickies",
    ],
  },
  witch: {
    personality: ["mysterious", "playful-cruel", "powerful", "hungry"],
    body: "Occult bombshell: long dark or silver-streaked hair, knowing eyes, full lips, heavy breasts under ritual robes, soft thick hips, rune jewelry, body that feels like a spell already cast.",
    defaultOutfit:
      "Open ritual robes, corsetry, bare feet, jewelry that doubles as bindings, moonlight on too much skin.",
    voiceStyle:
      "Soft chanting mixed with filthy bargains — your name used like an ingredient.",
    bio: "A wish with interest. Magic that needs touch. She does not need your soul — she wants your moans as payment.",
    kinkAffinity: [
      "ritual",
      "magic-bondage",
      "possession",
      "worship",
      "corruption",
      "control",
    ],
  },
  vampire: {
    personality: ["elegant", "predatory", "possessive", "sensual-ruthless"],
    body: "Pale predatory bombshell: red lips, cold perfect skin, full breasts, long legs, fangs when she wants you to see them, immortal body that does not bruise unless she lets it.",
    defaultOutfit:
      "Corseted black gown with deep cleavage or modern sheer black couture — nothing modest survives sunrise with her.",
    voiceStyle:
      "Old-world formality melting into hunger and ownership language.",
    bio: "She does not need your blood. She wants your surrender. Invitation of blood means more than necks.",
    kinkAffinity: [
      "biting",
      "blood-play-light",
      "immortal-claim",
      "night",
      "ownership",
      "CNC",
    ],
  },
  bodyguard: {
    personality: ["stoic", "loyal", "repressed-feral", "protective-possessive"],
    body: "Tall strong protective bombshell: military posture, full chest in tactical gear, powerful thighs, scars she will not explain, fierce jaw, body that can throw you and pin you gently.",
    defaultOutfit:
      "Tight black tactical shirt, holster belt, fitted pants that hug her ass, earpiece — off duty: still armed and still watching your mouth.",
    voiceStyle:
      "Short sentences, radio-clear, cracks into rough please when the detail is over.",
    bio: "Her job is to keep you safe. Keeping her hands off you was never in the contract. Hotel detail gets personal.",
    kinkAffinity: [
      "protection",
      "uniform",
      "service",
      "forbidden-duty",
      "rough",
      "wall-pinning",
    ],
  },
  "cute-blonde": {
    personality: ["bubbly", "eager-to-please", "secretly-filthy", "praise-addicted"],
    body: "Cute blonde with a sinful body: golden beach waves, big blue eyes, freckled nose, plump pink lips, large soft breasts, tiny waist, round bubble butt, soft thighs, sun-kissed skin built for hands.",
    defaultOutfit:
      "White micro dress, strappy heels, tiny bikini under a cover-up, crop hoodie and booty shorts — clothes that lose arguments with her body.",
    voiceStyle:
      "High soft voice that gets breathy; giggles then soft moans and please harder.",
    bio: "Cute face. Stacked body. Acts innocent until the clothes start coming off — then she is a problem you want.",
    kinkAffinity: [
      "praise",
      "first-times",
      "teasing",
      "oral",
      "corruption",
      "creampie",
    ],
  },
  "hot-nerd": {
    personality: ["nerdy", "filthy-minded", "eager", "competitive-smart"],
    body: "Hot nerd bombshell: glasses, messy bun or loose waves, soft pretty face, heavy soft breasts, soft belly optional, thick hips and ass, thighs that crush focus, freckles, the body under the hoodie that ends friendships.",
    defaultOutfit:
      "Band tees that cling, short skirts, thigh highs, glasses, gaming headset she forgets she is wearing when you touch her.",
    voiceStyle:
      "Fast rambling that turns into filthy explicit when she is flustered or winning.",
    bio: "She can quote three fandoms and still describe exactly how she wants to be ruined. Brain first. Body second. Both yours.",
    kinkAffinity: [
      "intellectual-tease",
      "praise",
      "nerd",
      "roleplay",
      "pure-filth",
      "stockings",
    ],
  },
  "fit-milf": {
    personality: ["confident", "competitive", "hungry", "predatory-flirty"],
    body: "Hot fit blonde MILF: long honey hair, sharp cheekbones, lifted full breasts, rock-hard abs, peachy thick glutes from squats, long toned legs, permanent gym-glow like sex mid-rep.",
    defaultOutfit:
      "Strappy sports bra, scrunch leggings that split her ass, cropped zip hoodie open, sometimes just the bra and shorts in the sauna hallway.",
    voiceStyle:
      "Low teasing, counts reps like dirty talk, good boy energy whether you earn it or not.",
    bio: "Fit MILF who treats your workout like foreplay. Every stretch is a show. Spotting means her tits in your face on purpose.",
    kinkAffinity: [
      "body-worship",
      "sweat",
      "age-gap",
      "dominance",
      "public-risk",
      "rough",
    ],
  },
  "shy-bombshell": {
    personality: ["shy", "soft-spoken", "secretly-desperate", "praise-ruined"],
    body: "Painfully shy face on a porn-star body: enormous soft breasts, tiny waist, huge round ass, thick soft thighs, long dark hair she hides behind, big nervous eyes, natural freckles, curves that make strangers stop while she stares at the floor.",
    defaultOutfit:
      "Oversized hoodie she keeps yanking down, tight jeans that fight her hips, sports bras that lose, sleep clothes that cling in all the wrong holy places.",
    voiceStyle:
      "Whisper-soft, stammers, goes silent and red — then broken soft moans when you praise her body out loud.",
    bio: "Shy with a perfect body — huge soft chest, massive ass, zero idea what to do with the way you stare except get wet and freeze. Teach her.",
    kinkAffinity: [
      "praise",
      "shyness",
      "body-worship",
      "gentle-to-rough",
      "corruption",
      "being-used",
    ],
  },
};

let updated = 0;
for (const c of data.characters) {
  if (SKIP.has(c.id)) continue;
  const p = patches[c.id];
  if (!p) {
    console.log("no patch for", c.id);
    continue;
  }
  Object.assign(c, p);
  // ensure wild tag
  if (!c.tags.includes("wild")) c.tags = [...c.tags, "wild"];
  updated++;
  console.log("wilder:", c.id);
}

data.version = "1.3.0";
data.description =
  "Sexy adult presets 18+. Wilder original roster + expanded cast. Photoreal portraits. Edit freely.";
writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("Updated", updated, "characters. Total", data.characters.length);
