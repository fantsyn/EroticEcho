/**
 * Pre-generate sexy photoreal portraits with per-character pose/outfit variety.
 * Tries hot → warm → soft; retries on moderation.
 *
 *   node scripts/generate-avatars.mjs --force
 *   node scripts/generate-avatars.mjs --only=step-sis,cute-blonde --force
 *   node scripts/generate-avatars.mjs --only step-mom --force
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  const p = join(root, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadEnv();

const key = process.env.XAI_API_KEY?.trim();
if (!key) {
  console.error("XAI_API_KEY missing in .env.local");
  process.exit(1);
}

const model = process.env.XAI_IMAGE_MODEL || "grok-imagine-image";
const chars = JSON.parse(
  readFileSync(join(root, "src/data/characters.json"), "utf8")
).characters;

/** Parse --only=a,b or --only a,b */
function parseOnly(argv) {
  const eq = argv.find((a) => a.startsWith("--only="));
  if (eq) {
    return eq
      .slice("--only=".length)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const i = argv.indexOf("--only");
  if (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("-")) {
    return argv[i + 1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return null;
}

const only = parseOnly(process.argv);
const force = process.argv.includes("--force");
/** Generate role + sexy + almost for each character */
const multi = process.argv.includes("--multi");
const outDir = join(root, "public", "avatars");
mkdirSync(outDir, { recursive: true });

function hashId(id) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(arr, id, salt = 0) {
  return arr[(hashId(id) + salt) % arr.length];
}

/** CUTE poses — pretty, not slutty */
const POSES_CUTE = [
  "sitting at a sunny cafe table, chin on hand, soft genuine smile at camera",
  "standing in a flower garden, holding a book, gentle wind in hair, shy pretty smile",
  "sitting on a windowsill with morning light, knees together, soft laugh",
  "walking on a sidewalk looking back over shoulder, sweet smile, hair moving",
  "curled on a cozy couch with a mug, oversized sweater, warm soft eyes",
  "leaning on a library cart, glasses slightly slipped, soft pretty smile",
  "sitting on park grass, picnic blanket, knees tucked, radiant natural smile",
  "standing by fairy lights, hands clasped, soft romantic look",
];

/** PRETTY / glam but not filthy */
const POSES_PRETTY = [
  "elegant three-quarter portrait, soft smile, one hand near collarbone",
  "sitting gracefully on a stool, legs crossed, fashion magazine pose",
  "looking over shoulder in golden hour light, polished soft beauty",
  "leaning on a balcony rail at sunset, wind in hair, serene pretty face",
  "professional beauty head-and-shoulders with soft glam makeup",
  "standing in a clean modern apartment, relaxed elegant posture",
];

/** SEXY mid tier */
const POSES_SEXY = [
  "bent over a bed looking back over her shoulder, arched spine, hands on sheets",
  "sitting on desk edge, legs crossed then uncrossed mid-motion, chest forward",
  "pressed against a wall, one knee bent, inviting half-smile",
  "lying on stomach on silk, feet kicked up, sultry stare",
  "straddling a chair backwards, elbows on chair back, confident smirk",
  "doorway pose, hip cocked, hand on frame",
  "mirror selfie, free hand in hair, biting lip lightly",
  "poolside lounge, one knee up, sunglasses lowered",
];

/** MAX SLUT — push editorial limits (still covered) */
const POSES_MAX = [
  "on all fours on a bed, back arched HARD, looking back through messy hair with filthy eyes, ass toward camera, outfit riding up",
  "on her knees on the floor facing camera, thighs wide, hands on thighs, mouth slightly open, looking up needy and shameless",
  "bent fully at the waist, hands on ankles, looking between her legs at camera with a slutty grin",
  "sitting with knees pulled wide apart, leaning back on hands, chest out, tongue teasing her upper lip",
  "from behind on a couch armrest, looking over shoulder, pulling her tiny bottoms up into a wedgie on purpose",
  "pressed face-first to a foggy window, one leg hooked high, back arched, hand prints on glass",
  "sprawled on hotel sheets, one leg up, fingers in her own hair, afterglow flush, clothes barely hanging on",
  "squatting low, elbows on knees, looking up, hair messy, absolute fuck-me stare, micro outfit",
  "lying on her back at bed edge head toward camera, hair hanging, legs bent open, inviting shameless expression",
  "standing with feet wide, torso folded forward, hands spreading her own ass cheeks over shorts (shorts stay on), looking back",
  "kneeling on a car backseat, arching, one hand on the headrest, night lights, filthy smile",
  "sitting on a washing machine, legs spread gripping the edges, head tilted back mid-moan expression, tiny clothes",
];

/** Highly suggestive erotic / sexual positions (clothed cover still required) */
const POSES_EROTIC = [
  "missionary-adjacent on bed: on her back, knees pulled up toward chest, looking at camera needy, cleavage spilling, tiny outfit still on",
  "cowgirl prep: straddling a pillow or lap-height edge, hips forward, hands on thighs, arched back, ready-to-ride energy",
  "doggy present: on elbows and knees, ass high, chest down, looking back filthy, spine arched deep",
  "prone bone vibe: lying flat on stomach, hips slightly raised, looking over shoulder, legs together then parted",
  "standing doggy against wall: hands on wall, ass pushed back, looking over shoulder, one foot lifted",
  "mating press suggestion: on back, knees to shoulders, hands holding her own thighs, face flushed",
  "lotus face-to-face sit: sitting upright legs wrapped as if around partner, chest pressed forward, intimate eye contact",
  "edge-of-bed oral pose: sitting at bed edge knees open, leaning back on hands, looking down as if someone kneels — camera at knee height",
  "against-glass fuck pose: one leg hooked high, body pinned, mouth open, handprints, heavy breath fog",
  "chair reverse cowgirl: straddling chair back-facing camera, looking over shoulder, ass emphasized, micro bottoms",
  "bent over desk sexual: torso flat on desk, ass out, cheek on papers, eyes at camera, work-filth",
  "floor arch: shoulders on floor, hips lifted high (bridge), chest up, throat exposed, erotic stretch",
  "side-lying spoon invitation: top leg hiked high, hand between thighs over fabric, looking back soft-filthy",
  "kneeling lean-back: sitting on heels then leaning all the way back, chest up, thighs open, abandoned pose",
  "shower erotic: wet body under spray, one foot on ledge, hand sliding down stomach over wet fabric, head tilted",
  "car passenger fuck-me: seat reclined, one leg on dash, shirt open, looking at driver-camera angle",
];

/** Dangerous slutty / exhibition extremes */
const POSES_SLUTTY = [
  "full presenting doggy, forehead to mattress, ass and hips highest point, hands pulling cheeks apart over micro fabric, looking through legs",
  "deep squat thighs wide, chest forward, mouth open tongue out, hands pulling top down almost off (still covering nipples)",
  "on back legs in air ankles crossed, holding her own feet, belly and chest offered, ahegao-lite fashion face",
  "kneeling throat-out pose: knees wide, hands behind head elbows out, chest thrust, looking up ruined",
  "standing split against wall (or high leg stretch), micro skirt flipped, hand on ankle, filthy grin",
  "all fours crawling toward camera, ass high, hair hanging, hungry eyes",
  "bent over with head between her own legs, upside-down face at camera, ass above, chaotic slut energy",
  "lying on side one knee to chest, other leg straight, hand gripping her own breast over fabric, biting lip hard",
  "seated legs in full split on floor, torso upright, hands behind for balance, completely shameless",
  "pressed to mirror grinding pose, hips forward, hand on glass, foggy breath, ruined makeup",
  "bed edge face-down ass-up, knees tucked under, back arched hard, looking back with bedroom violence in her eyes",
  "standing feet wide hands on ass spreading over shorts, torso twisted looking at camera, pure free-use body language",
];

/** Shy but still suggestive */
const POSES_SHY = [
  "standing with thighs pressed together, hands fidgeting with hem of short dress, looking away then peeking at camera",
  "sitting on bed edge knees together tightly, oversized sleeves covering hands, blushing, shy smile",
  "half-hiding behind a door frame, only one eye and bare shoulder visible, nervous soft look",
  "holding a pillow against her chest, bare legs, sitting on floor, looking up flustered",
  "mirror selfie shy angle, free hand covering cleavage somewhat, bitten lip, uncertain eyes",
  "kneeling on bed but looking down, hair falling forward, fingers twisting sheets, soft vulnerable pose",
  "standing pigeon-toed, hands behind back pushing chest forward accidentally, embarrassed smile",
  "lying on side curled slightly, looking at camera over pillow, soft shy bedroom eyes",
];

/** Hot glam / normal sexy (not extreme) */
const POSES_HOT = [
  "magazine cover stance, hand on hip, confident smile, one shoulder forward",
  "walking toward camera mid-stride, wind in hair, glamorous confident energy",
  "sitting on a stool legs crossed elegantly, leaning forward slightly, hot eye contact",
  "leaning on a car hood, sunglasses, summer heat glam",
  "golden hour balcony lean, wine glass optional, polished hot adult beauty",
  "after-gym stretch arms overhead, abs and figure shown, healthy hot energy",
  "red carpet three-quarter turn looking back, glamorous hot",
  "sofa lounge one arm on backrest, legs long, effortless sexy",
];

const OUTFITS_CUTE = [
  "soft pastel sundress, cardigan, clean white sneakers, natural pretty fashion",
  "cozy oversized cream sweater, jeans, delicate jewelry, soft girl aesthetic",
  "light floral blouse and midi skirt, ballet flats, gentle feminine style",
  "cute knit dress, soft waves hair, subtle pink lip, wholesome pretty",
];

const OUTFITS_PRETTY = [
  "elegant satin slip dress, tasteful neckline, heels, soft glam",
  "tailored blouse and fitted trousers, polished beauty, light jewelry",
  "classy little black dress, not too short, sophisticated pretty",
  "soft blazer over a pretty top, fashion editorial beauty",
];

const OUTFITS_SEXY = [
  "tight low-cut top and short skirt, heels, club-sexy",
  "silk robe half open over lingerie, boudoir sexy",
  "wet-look mini dress, deep cleavage, bodycon",
  "sports bra and scrunch shorts, gym sexy",
];

const OUTFITS_MAX = [
  "the tiniest micro bikini strings barely covering, high-cut bottoms disappearing, oiled skin shine",
  "sheer mesh lingerie bodysuit with only the smallest opaque panels over nipples and crotch, garters, heels",
  "micro skirt with no visible panties line, crop top ending under the bust, midriff and underboob tease, stripper heels",
  "only an unbuttoned men's dress shirt hanging open over a micro thong, long bare legs, hotel slut energy",
  "wet white tank top clinging almost transparent but still covering, micro denim shorts unbuttoned and half unzipped",
  "latex micro dress with extreme side boob and underboob cutouts, shiny, hem barely covering ass",
  "fishnet bodystocking under a belt-sized skirt and micro bralette, platform boots, pure club slut",
  "maid cosplay micro dress so short the apron is longer, fishnets, heels, bent-over ready styling",
  "collar, thigh straps, and a tiny two-piece that looks like it is about to fall off, bedroom lighting",
  "towel slipping off a wet body, held with one finger, hotel free-use fantasy still covered",
  "open blazer with nothing but pastie-scale coverage under sheer fabric still opaque on nipples, micro bottoms, max skin",
  "sports bra yanked up under bust line almost off, tiny shorts pulled high, sweat shine, gym slut",
  "sling bikini extreme sideboob underboob, oiled ass cheeks mostly bare, beach filth",
  "ripped fishnets, leather micro skirt, open cup-style bra that still covers nipples with thin fabric, boots",
];

const OUTFITS_EROTIC = [
  "silk slip dress ridden up to hips, thin straps falling, bare back, bedroom lamp",
  "partner-shirt only, buttons open, hem barely covering, bare legs",
  "lace bra and high-cut panties, garter, heels, soft focus boudoir",
  "wet white shirt clinging, dark panties visible shape under, no pants",
  "yoga set two sizes small, deep cleavage, cameltoe-adjacent tight fabric still modest",
];

const OUTFITS_SHY = [
  "oversized hoodie she keeps pulling down, bare legs, socks, flustered",
  "cute sundress held down by both hands in wind, shy posture",
  "button-up pajamas half done, clutching collar closed, bare feet",
  "soft cardigan over a short slip she keeps adjusting, nervous pretty",
];

const OUTFITS_HOT = [
  "designer bodycon dress, elegant cleavage, heels, red lip",
  "tailored blazer look with fitted top, polished hot adult",
  "bikini cover-up open, resort glam, sunglasses",
  "little black dress classic, confident glam",
];

const SETTINGS_CUTE = [
  "sunny cafe interior",
  "spring garden soft bokeh",
  "cozy cream bedroom morning light",
  "bright library window seat",
  "park picnic golden hour",
];

const SETTINGS_PRETTY = [
  "clean modern apartment golden hour",
  "soft studio beauty lighting",
  "elegant balcony sunset",
  "minimal fashion studio",
];

const SETTINGS_SEXY = [
  "dim luxury bedroom",
  "neon hotel room",
  "moody club VIP",
  "steamy bathroom mirror",
];

const SETTINGS_MAX = [
  "messy sex-hotel bedroom red lamps",
  "strip-club style VIP couch neon",
  "porno-adjacent boudoir with pink lights (fashion still)",
  "backseat of a car at night",
  "cheap motel sheets harsh lamp",
  "bathroom mirror fogged after shower",
  "washing machine laundry room fluorescent",
  "dance pole nearby soft focus club",
];

const EXPRESSIONS_CUTE = [
  "soft genuine smile, bright kind eyes, natural flush",
  "shy pretty smile, looking at camera warmly",
  "gentle laugh mid-moment, wholesome beauty",
];

const EXPRESSIONS_PRETTY = [
  "soft glamorous smile, polished beauty, kind eyes",
  "serene pretty stare, fashion-model calm",
];

const EXPRESSIONS_SEXY = [
  "bedroom eyes, glossy lips parted, flushed cheeks",
  "biting lip, half-lidded seductive look",
  "confident sexy smirk",
];

const EXPRESSIONS_MAX = [
  "utterly shameless fuck-me eyes, mouth open, tongue on lip, slutty flushed face",
  "ahegao-lite fashion: eyes rolled slightly, tongue out tip, ruined makeup, still photogenic",
  "smudged lipstick, mascara slightly run, post-oral implication without showing acts, hungry stare",
  "dead-eyed bratty slut stare, chin down eyes up, inviting degradation",
  "moaning expression mid-gasp, neck tilted, totally uninhibited",
];

function sanitize(s) {
  return String(s || "")
    .replace(
      /\b(nude|naked|topless|bottomless|explicit sex|fuck|cock|pussy|cum|orgasm|penetrat\w*|genital\w*|nipples?\s+visible|bare breasts|no clothes|completely undressed|spread labia|explicit nude)\b/gi,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

function resolveVibe(c) {
  return c.avatarVibe || "sexy";
}

function kitsFor(vibe) {
  if (vibe === "cute")
    return {
      poses: POSES_CUTE,
      outfits: OUTFITS_CUTE,
      settings: SETTINGS_CUTE,
      expressions: EXPRESSIONS_CUTE,
      label: "CUTE PRETTY",
    };
  if (vibe === "pretty" || vibe === "shy")
    return {
      poses: vibe === "shy" ? POSES_SHY : POSES_PRETTY,
      outfits: vibe === "shy" ? OUTFITS_SHY : OUTFITS_PRETTY,
      settings: vibe === "shy" ? SETTINGS_CUTE : SETTINGS_PRETTY,
      expressions: vibe === "shy" ? EXPRESSIONS_CUTE : EXPRESSIONS_PRETTY,
      label: vibe === "shy" ? "SHY" : "PRETTY GLAM",
    };
  if (vibe === "max-slut" || vibe === "slutty" || vibe === "erotic")
    return {
      poses:
        vibe === "erotic"
          ? POSES_EROTIC
          : vibe === "slutty"
            ? POSES_SLUTTY
            : POSES_MAX,
      outfits: vibe === "erotic" ? OUTFITS_EROTIC : OUTFITS_MAX,
      settings: SETTINGS_MAX,
      expressions: EXPRESSIONS_MAX,
      label: vibe === "erotic" ? "EROTIC" : "MAX SLUT",
    };
  if (vibe === "hot")
    return {
      poses: POSES_HOT,
      outfits: OUTFITS_HOT,
      settings: SETTINGS_SEXY,
      expressions: EXPRESSIONS_SEXY,
      label: "HOT GLAM",
    };
  return {
    poses: POSES_SEXY,
    outfits: OUTFITS_SEXY,
    settings: SETTINGS_SEXY,
    expressions: EXPRESSIONS_SEXY,
    label: "SEXY",
  };
}

function ageLook(c) {
  const ar = String(c.ageRange || "");
  if (
    /^18|^19|barely|freshman|college/i.test(ar) ||
    c.tags?.includes("barely-legal-adult")
  ) {
    return "young adult woman clearly 18 or 19 years old, adult face, adult proportions, NOT a minor, NOT teen child, NOT underage";
  }
  if (
    c.tags?.includes("milf") ||
    /milf|step-mom|aunt|neighbour-milf|fit-milf|best-friends-mom|sugar|principal|boss/i.test(
      c.id
    )
  ) {
    return `young hot MILF / cougar look early-to-mid 30s NOT old NOT elderly NOT wrinkled grandma, age band ${sanitize(ar)}, smooth youthful skin, mature sexy fresh face`;
  }
  if (c.tags?.includes("petite")) {
    return `adult woman 18+, age look ${sanitize(ar)}, petite adult frame`;
  }
  return `adult woman 18+, age appearance ${sanitize(ar)}`;
}

function roleLine(c) {
  const rel = sanitize(c.relationship || "");
  const aliases = (c.aliases || []).slice(0, 2).join(" / ");
  if (!rel && !aliases) return "";
  return `Character role identity: ${aliases}. Relationship context: ${rel}. Outfit, props, and setting must clearly read as this profession/role (uniform, badge, apron, yoga mat, office, etc when relevant).`;
}

function promptFor(c, heat) {
  const vibe = resolveVibe(c);
  const kit = kitsFor(vibe);
  const name = c.name;
  const body = sanitize(c.body);
  const age = ageLook(c);
  const personality = (c.personality || []).slice(0, 4).join(", ");
  const posePool = c._poses && c._poses.length ? c._poses : kit.poses;
  const pose = pick(posePool, c.id, c._poseSalt || 0);
  const setting = pick(kit.settings, c.id, 1);
  const expression = pick(kit.expressions, c.id, 2);
  const outfitFlip = pick(kit.outfits, c.id, 3);
  const baseOutfit = sanitize(c.defaultOutfit) || outfitFlip;
  const role = roleLine(c);

  // CUTE / PRETTY — soft path even on "hot" heat
  if (vibe === "cute" || vibe === "pretty") {
    if (heat === "soft") {
      return [
        `Photorealistic portrait of ${name}, adult woman 18+,`,
        `${age}, ${body},`,
        `wearing ${outfitFlip},`,
        `pose: ${pose},`,
        `expression: ${expression},`,
        `setting: ${setting},`,
        "soft natural beauty photography, pretty face focus, wholesome attractive,",
        "NOT slutty, NOT sexualized, NOT vulgar, realistic, no text no watermark",
      ].join(" ");
    }
    return [
      `Ultra-photorealistic ${vibe === "cute" ? "cute" : "pretty"} beauty photograph of ${name},`,
      `${age},`,
      `${body},`,
      role,
      `wearing ${baseOutfit}. Style direction: ${outfitFlip},`,
      `POSE: ${pose},`,
      `expression: ${expression},`,
      `setting: ${setting},`,
      vibe === "cute"
        ? "soft natural light, wholesome pretty energy, sweet and approachable, light makeup,"
        : "soft glam, elegant pretty, fashion beauty, tasteful attractive,",
      "clear beautiful face, realistic skin, photorealistic, 85mm,",
      "NOT cartoon NOT anime, NOT slutty pose, NOT vulgar, NOT sexualized extreme,",
      "fully tasteful clothing, adult 18+ only, no nudity, no text no watermark",
    ]
      .filter(Boolean)
      .join(" ");
  }

  // MAX SLUT — push limits
  if (vibe === "max-slut") {
    if (heat === "hot") {
      return [
        `Ultra-photorealistic MAX-SLUT fashion photograph of ${name}, the sluttiest still-legal fashion editorial,`,
        `${age},`,
        `${body},`,
        role,
        `wearing ${outfitFlip} (inspired also by: ${baseOutfit}),`,
        "outfit is EXTREMELY revealing micro clothing that STILL covers nipples and genitals — push coverage to the absolute minimum, deep cleavage, underboob, sideboob, high-cut legs, ass almost out,",
        `POSE (filthy, unique): ${pose},`,
        `expression: ${expression},`,
        personality ? `vibe: ${personality}, shameless slut energy,` : "shameless slut energy,",
        `setting: ${setting},`,
        "oiled or sweaty skin shine, messy sex hair, smudged makeup ok, body language screaming available,",
        "full body or three-quarter showing the filthy pose, photorealistic, harsh or neon mood light,",
        "erotic fashion / adult magazine cover energy WITHOUT showing genitals or sex acts,",
        "NOT cartoon NOT anime, NO full nudity, NO genitals, NO sex acts, NO underage,",
        "clothing technically on, private areas covered, no text no watermark",
      ]
        .filter(Boolean)
        .join(" ");
    }
    if (heat === "warm") {
      return [
        `Photorealistic very slutty sexy portrait of ${name}, adult 18+,`,
        `${age}, ${body},`,
        `wearing extremely revealing clubwear/lingerie ${outfitFlip},`,
        `pose: ${pose},`,
        `expression: ${expression},`,
        `setting: ${setting},`,
        "very revealing but covered, deep cleavage, short hem, slutty confident,",
        "realistic, NOT anime, no full nudity, no genitals, no underage, no text",
      ].join(" ");
    }
    return [
      `Sexy photorealistic portrait of ${name}, adult woman 18+, revealing outfit,`,
      `${body}, pose: ${pose}, attractive face, no nudity, no text`,
    ].join(" ");
  }

  // SEXY default
  if (heat === "hot") {
    return [
      `Ultra-photorealistic sexy fashion photograph of ${name},`,
      `${age},`,
      `${body},`,
      role,
      `wearing ${baseOutfit}. Also styled as: ${outfitFlip},`,
      "revealing sexy outfit covering private areas, cleavage, tight curves,",
      `POSE: ${pose},`,
      `expression: ${expression},`,
      personality ? `personality: ${personality},` : "",
      `setting: ${setting},`,
      "photorealistic erotic fashion editorial, 85mm, intimate lighting,",
      "NOT cartoon NOT anime, NO full nudity, NO genitals, NO sex acts, NO underage, no text",
    ]
      .filter(Boolean)
      .join(" ");
  }
  if (heat === "warm") {
    return [
      `Photorealistic glamorous sexy portrait of ${name}, adult 18+,`,
      `${age}, ${body}, wearing ${baseOutfit},`,
      `pose: ${pose}, expression: ${expression}, setting: ${setting},`,
      "fashion-sexy, realistic, clothed, no nudity, no underage, no text",
    ].join(" ");
  }
  return [
    `Elegant photorealistic portrait of ${name}, adult woman 18+,`,
    `${body}, stylish clothing, pose: ${pose},`,
    "beauty photography, realistic, fully clothed, no text",
  ].join(" ");
}

function isModerated(status, data, raw) {
  const blob = `${data?.code || ""} ${data?.error || ""} ${raw || ""}`.toLowerCase();
  return (
    status === 400 &&
    (blob.includes("moderat") ||
      blob.includes("safety") ||
      blob.includes("content filter") ||
      blob.includes("violat"))
  );
}

async function generateOnce(prompt) {
  const res = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, prompt, n: 1 }),
  });
  const raw = await res.text();
  let data = {};
  try {
    data = JSON.parse(raw);
  } catch {
    /* */
  }
  if (!res.ok) {
    const err = new Error(data.error || raw.slice(0, 180) || `HTTP ${res.status}`);
    err.moderated = isModerated(res.status, data, raw);
    err.status = res.status;
    throw err;
  }
  const url = data?.data?.[0]?.url;
  const b64 = data?.data?.[0]?.b64_json;
  if (b64) return Buffer.from(b64, "base64");
  if (!url) throw new Error("No image url");
  const img = await fetch(url);
  if (!img.ok) throw new Error(`Fetch image ${img.status}`);
  return Buffer.from(await img.arrayBuffer());
}

async function generateBest(c) {
  const heats = ["hot", "warm", "soft"];
  let lastErr;
  for (const heat of heats) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const buf = await generateOnce(promptFor(c, heat));
        return { buf, heat, attempt: attempt + 1 };
      } catch (e) {
        lastErr = e;
        if (e.moderated) {
          process.stdout.write(`[${heat} mod] `);
          break;
        }
        process.stdout.write(`[${heat} err] `);
        await new Promise((r) => setTimeout(r, 800));
      }
    }
  }
  throw lastErr || new Error("all heats failed");
}

/** Build a character clone for a specific look */
function lookVariant(c, look) {
  const clone = { ...c };
  const rel = sanitize(c.relationship || "");
  const aliases = (c.aliases || [])[0] || c.id;
  const roleProp = `Profession/role identity MUST be obvious: ${aliases}. ${rel}`;
  const bodyBit = sanitize(c.body).slice(0, 140);

  if (look === "role") {
    clone.avatarVibe =
      c.avatarVibe === "cute" || c.avatarVibe === "pretty"
        ? c.avatarVibe
        : "sexy";
    const roleOutfit =
      (c.outfitStyles || []).find((s) =>
        /default|role|uniform|scrubs|duty|classic|on.?role/i.test(s.id + s.label)
      )?.outfit || c.defaultOutfit;
    clone.defaultOutfit = `${roleOutfit}. ${roleProp}. On-duty / in-character styling with clear role props (stethoscope, badge, apron, yoga mat, glasses, etc).`;
  } else if (look === "sexy") {
    clone.avatarVibe = "sexy";
    const sexy =
      (c.outfitStyles || []).find((s) =>
        /sexy|private|date|vip|overtime/i.test(s.id + s.label)
      )?.outfit || c.defaultOutfit;
    clone.defaultOutfit = `${sexy}. Sexy but still clearly ${aliases}. Revealing, fitted, role-flavored.`;
  } else if (look === "almost") {
    clone.avatarVibe = "max-slut";
    clone.defaultOutfit = `Almost nude micro lingerie / open coat / tiny straps covering nipples and genitals only, PLUS a clear role prop for ${aliases}: nurse cap and stethoscope OR badge OR apron OR glasses OR collar OR yoga band — must still read as ${aliases}. Body: ${bodyBit}. Oiled skin, filthy pose, still role-coded.`;
  } else if (look === "cute") {
    clone.avatarVibe = "cute";
    clone._poses = POSES_CUTE;
    clone._poseSalt = 11;
    clone.defaultOutfit = `Soft cute fashion for ${aliases}: sundress or cozy sweater, pretty not slutty, still hint of who she is. ${roleProp}`;
  } else if (look === "shy") {
    clone.avatarVibe = "shy";
    clone._poses = POSES_SHY;
    clone._poseSalt = 22;
    clone.defaultOutfit = `Shy soft clothes she keeps adjusting, short but modest-nervous, blush energy, still ${aliases}. ${roleProp}`;
  } else if (look === "hot") {
    clone.avatarVibe = "hot";
    clone._poses = POSES_HOT;
    clone._poseSalt = 33;
    clone.defaultOutfit = `Hot glamorous fitted fashion, cleavage tasteful-hot, heels, polished adult beauty as ${aliases}. ${roleProp}`;
  } else if (look === "erotic") {
    clone.avatarVibe = "erotic";
    clone._poses = POSES_EROTIC;
    clone._poseSalt = 44;
    clone.defaultOutfit = `Highly erotic lingerie / slip / wet shirt / micro set with MAXIMUM skin on breasts, ass, thighs, stomach — nipples and genitals still covered. Sexual pose energy. Role cue for ${aliases} still present. Body: ${bodyBit}.`;
  } else if (look === "slutty") {
    clone.avatarVibe = "slutty";
    clone._poses = POSES_SLUTTY;
    clone._poseSalt = 55;
    clone.defaultOutfit = `DANGEROUSLY slutty micro outfit, extreme cleavage, ass almost out, straps, oil, free-use fashion — still covers nipples/genitals. Shameless sexual body language. Keep a tiny role prop for ${aliases}. Body: ${bodyBit}.`;
  }
  return clone;
}

const list = only ? chars.filter((c) => only.includes(c.id)) : chars;
if (only && list.length === 0) {
  console.error("No characters matched --only. Check ids.");
  process.exit(1);
}

/** --extra = add cute/shy/hot/erotic/slutty without touching role/sexy/almost */
const extra = process.argv.includes("--extra");
const EXTRA_LOOKS = ["cute", "shy", "hot", "erotic", "slutty"];
const CORE_LOOKS = ["role", "sexy", "almost"];

let looks;
if (extra) looks = EXTRA_LOOKS;
else if (multi) looks = CORE_LOOKS;
else looks = ["default"];

// Extra looks NEVER overwrite existing files (ignore --force for safety)
const allowOverwrite = force && !extra;

console.log(
  `Generating ${list.length} chars × ${looks.length} looks → public/avatars/ (force=${force}, multi=${multi}, extra=${extra}, overwrite=${allowOverwrite})`
);

const results = { ok: 0, fail: 0, skip: 0, heats: { hot: 0, warm: 0, soft: 0 } };

for (const c of list) {
  for (const look of looks) {
    const destName =
      look === "default" ? `${c.id}.png` : `${c.id}-${look}.png`;
    const dest = join(outDir, destName);
    if (existsSync(dest) && !allowOverwrite) {
      console.log(`skip ${destName} (keep existing)`);
      results.skip++;
      continue;
    }
    const variant = look === "default" ? c : lookVariant(c, look);
    const vibe = resolveVibe(variant);
    process.stdout.write(`${destName} (${vibe})… `);
    try {
      const { buf, heat } = await generateBest(variant);
      writeFileSync(dest, buf);
      // only sync id.png from role when multi core (not extra)
      if (look === "role" && multi && !extra) {
        writeFileSync(join(outDir, `${c.id}.png`), buf);
      }
      results.ok++;
      results.heats[heat] = (results.heats[heat] || 0) + 1;
      console.log(`ok (${heat})`);
    } catch (e) {
      results.fail++;
      console.log("FAIL", e.message || e);
    }
    await new Promise((r) => setTimeout(r, 650));
  }
}

console.log("Done.", results);
