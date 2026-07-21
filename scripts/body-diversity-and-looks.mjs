/**
 * 1) Rebalance bodies: slim/fit/petite/hot-chubby — fewer heavy/fat frames
 * 2) Attach portraitLooks (role / sexy / almost) to every character
 * 3) Fix nurse + role-forward outfits
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "src/data/characters.json");
const data = JSON.parse(readFileSync(path, "utf8"));

/** bodyType forced per id when we care */
const BODY = {
  // Petite / slim young
  "cute-teen-blonde":
    "Petite slim young-adult blonde 18+: small perky breasts, narrow waist, slim hips, light muscle tone, delicate collarbones, pretty adult face — not chubby, not heavy.",
  "slut-teen-blonde":
    "Slim-fit young-adult blonde 18+: perky medium breasts, tiny waist, toned bubble butt (not fat), slim athletic thighs, flat stomach, cute face with slut energy.",
  "slut-teen-brunette":
    "Fit slim-thick young-adult brunette 18+: full but firm breasts, slim waist, toned ass, athletic legs — curvy in a fit way, not soft-fat.",
  "petite-blonde":
    "Petite slim adult blonde: small frame, small-to-medium perky breasts, slim waist, proportionate cute ass, slim legs, delicate build.",
  "petite-brunette":
    "Petite slim-athletic brunette: small frame, perky B-cups, tight waist, firm little ass, toned legs — pocket-sized fit, not soft.",
  "petite-goth":
    "Petite slim goth adult: pale slim frame, small perky breasts, narrow waist, slight curve to hips, lean legs — never heavy.",
  "tiny-asian":
    "Petite slim East Asian adult: delicate frame, small perky breasts, tiny waist, light soft curve to hips, slim legs — elegant slim, not chubby.",
  "red-pixie":
    "Petite slim redhead: freckled slim body, small breasts, narrow waist, peachy firm butt, slim legs.",
  "college-freshman":
    "Slim young-adult coed 18+: natural perky breasts, flat-to-soft stomach, slim-fit hips, long slim legs — healthy normal college body.",
  "innocent-church":
    "Slim soft young-adult: modest-looking slim frame, natural medium breasts, soft slim waist, gentle hips — pretty normal, not thick.",
  "step-daughter":
    "Slim petite-to-average young adult: perky medium breasts, narrow waist, round but firm butt, slim thighs — cute slim, not heavy.",
  "step-sis":
    "Fit slim-athletic young adult: perky breasts, flat stomach, firm thick-for-slim ass (athletic not fat), toned legs.",
  "neighbour-young":
    "Slim-fit young neighbour: perky breasts, flat stomach, toned glutes, long legs — Instagram-fit, not chubby.",
  "cute-blonde":
    "Slim hourglass young adult: full perky breasts, tiny waist, firm round butt, slim toned legs — stacked but slim, not fat.",
  "shy-library":
    "Soft slim-average nerd beauty: medium full breasts, soft slim waist (not thick), gentle hips, pretty face — cute soft-normal, not plus-size.",
  "shy-bombshell":
    "Slim stacked bombshell: large firm breasts, tiny waist, round firm ass, slim thighs — classic slim hourglass, NOT heavy belly or thick-fat.",
  "hot-nerd":
    "Slim-average hot nerd: medium breasts, soft flat stomach, slim hips with slight curve, long legs — normal cute, not chubby.",
  "school-crush":
    "Fit slim campus beauty: perky breasts, toned stomach, firm athletic ass, long legs — sporty slim.",
  barista:
    "Slim-average flirty barista: perky breasts, soft slim waist, normal hips, cute legs — everyday attractive, not thick.",
  coworker:
    "Slim professional: medium breasts, slim waist, office-fit figure, long legs — normal slim adult.",
  secretary:
    "Slim hourglass office: full firm breasts, narrow waist, round firm hips — curvy-slim, not fat.",
  roommate:
    "Slim-lazy-fit: perky breasts, soft flat stomach, firm ass from stairs, slim thighs — normal young body.",
  "best-friends-sis":
    "Slim young adult: perky breasts, slim waist, light curve hips, long legs.",
  "filth-freeuse":
    "Slim free-use blonde doll: full perky breasts, tiny waist, firm round ass, slim legs — porn-slim not chubby.",
  "alt-egirl":
    "Petite slim alt: small chest, tiny waist, firm butt, slim tattooed thighs.",
  android:
    "Engineered slim hourglass: perfect medium breasts, tiny waist, firm hips, long legs — synthetic slim.",
  kitsune:
    "Slim-mythic fox beauty: perky breasts, narrow waist, soft slim belly optional, firm hips, long legs — lithe not heavy.",
  succubus:
    "Slim demonic hourglass: full firm breasts, tiny waist, thick-for-slim hips that are firm not fat, long legs.",
  demoness:
    "Tall slim-powerful: full breasts, wasp waist, long powerful legs, athletic glutes — statuesque fit.",
  goddess:
    "Ideal slim divine: perfect medium-full breasts, narrow waist, balanced hips, long elegant legs — classical slim beauty.",
  alien:
    "Lithe otherworldly slim: high firm breasts, narrow waist, long slim legs, light muscle.",
  vampire:
    "Pale slim predatory: full firm breasts, narrow waist, long legs — elegant thin, never soft-fat.",
  witch:
    "Slim mystical: medium breasts, narrow waist, soft slim hips, long legs — lithe.",
  werewolf:
    "Athletic fit: strong toned body, full firm breasts, tight abs, powerful glutes and thighs — fit athlete not chubby.",
  "gym-trainer":
    "Very fit athletic: sports-bra cleavage, visible abs, powerful but lean glutes and thighs, low body fat, trainer body.",
  "fit-milf":
    "Young fit MILF: lifted firm breasts, defined abs, peachy firm glutes, long toned legs — gym-fit early 30s, zero soft-fat.",
  "neighbour-milf":
    "Young yoga-fit MILF: perky lifted breasts, toned abs, firm thick glutes (muscle not fat), long athletic legs.",
  "step-mom":
    "Young soft-hourglass MILF: full firm breasts, soft narrow waist, gentle hips, smooth skin early 30s — soft-sexy not heavy or matronly thick.",
  "best-friends-mom":
    "Young soft-average MILF: full breasts, soft slim-normal waist, gentle curve hips — warm normal-hot, not plus-size.",
  "hot-aunt":
    "Young polished hourglass: full firm breasts, cinched waist, balanced hips, long legs — glam slim-curvy early 30s.",
  "stepmoms-friend":
    "Young glam fit-curvy: full breasts, tight waist, firm hips, trainer legs — expensive fit, not soft-fat.",
  boss: "Slim power figure: full firm breasts, wasp waist, long legs, executive slim — not thick.",
  principal:
    "Slim severe beauty: full bust firm, narrow waist, long legs in stockings — mid-30s slim authority.",
  "sugar-client":
    "Sculpted cougar-fit: full firm breasts, trainer-flat stomach, toned legs, expensive slim — not soft old weight.",
  "teacher-professor":
    "Slim intellectual beauty: full firm bust, narrow waist, long legs — academic slim-glam.",
  librarian:
    "Slim hot librarian: full firm bust, narrow waist, long legs in stockings — slim nerd-glam not thick.",
  nurse:
    "Slim-fit nurse beauty: full firm breasts, narrow waist, toned legs, soft professional face early 30s — healthy slim, medical-sexy, not thick or matronly.",
  cop: "Athletic fit cop: full firm chest, strong lean core, powerful lean thighs — tactical fit, not bulky soft.",
  bodyguard:
    "Tall athletic lean-strong: full firm chest, defined arms, powerful lean legs — security fit.",
  stripper:
    "Stage-fit slim stacked: full firm breasts, tiny waist, firm round ass, long dancer legs — performer slim.",
  "porn-star":
    "Industry slim-stacked: enhanced-or-natural full firm breasts, tiny waist, firm thick ass that is toned, long legs — camera-fit not soft-fat.",
  "cam-girl":
    "Slim internet body: full perky breasts, tiny waist, firm ass, slim legs — content-creator fit.",
  "flight-attendant":
    "Slim polished cabin figure: full firm bust, narrow waist, long legs — uniform-fit slim.",
  celebrity:
    "Celebrity slim-glam: perfect firm breasts, tiny waist, sculpted legs — red-carpet slim.",
  "stranger-bar":
    "Slim dangerous night body: full firm breasts, narrow waist, long legs — club-slim.",
  "massage-therapist":
    "Soft-fit strong: medium-full firm breasts, toned arms, slim waist, strong but lean thighs — healthy fit.",
  "psycho-ex":
    "Slim dark beauty: full firm breasts, narrow waist, long legs — sharp slim.",
  "psycho-crush":
    "Slim soft yandere: medium breasts, narrow waist, slim legs — delicate slim.",
  "bully-f":
    "Fit mean-girl athletic: firm breasts, tight stomach, strong glutes, toned legs.",
  "bully-jock":
    "Female athletic fit: firm chest, abs, powerful lean legs and glutes — jock fit.",
  maid: "Slim service hourglass: full firm breasts, tiny waist, firm hips, long legs — classic slim maid fantasy.",
  rideshare:
    "Slim party body: perky breasts, flat stomach, firm ass, long legs — club-exit slim.",
  therapist:
    "Slim soft professional: medium breasts, slim waist, normal pretty figure — calm slim.",
};

// Soft global cleanup for remaining: strip extreme fat language
function slimBody(text, id) {
  if (BODY[id]) return BODY[id];
  let t = String(text || "");
  t = t
    .replace(/\b(huge soft|enormous soft|massive soft|very full heavy|heavy soft|thick soft|soft thick|wide hips,?\s*thick ass|soft belly that still looks|soft wide hips)\b/gi, (m) => {
      // lighter replacements
      if (/enormous|massive|huge soft/i.test(m)) return "full firm";
      if (/very full heavy|heavy soft/i.test(m)) return "full firm";
      if (/thick soft|soft thick/i.test(m)) return "firm toned";
      if (/soft belly/i.test(m)) return "soft flat stomach";
      if (/soft wide hips/i.test(m)) return "balanced hips";
      return "firm";
    })
    .replace(/\bplus-?size\b/gi, "curvy-slim")
    .replace(/\bbbw\b/gi, "hot soft-curvy");
  return t;
}

const nurseStyles = [
  {
    id: "default",
    label: "Scrubs tight",
    outfit:
      "Skin-tight modern nurse scrubs top zipped halfway showing cleavage, fitted scrub pants hugging hips, stethoscope, ID badge, white sneakers — clearly a nurse on shift, sexy professional",
    vibe: "sexy",
  },
  {
    id: "classic",
    label: "Classic nurse",
    outfit:
      "Short white nurse dress uniform with red cross pin, white thigh-high stockings, nurse cap, heels — classic medical fantasy, still on-role",
    vibe: "sexy",
  },
  {
    id: "private",
    label: "Private exam",
    outfit:
      "Open white lab coat over white lace bra and garter belt, stethoscope only, heels — private house-call nurse energy",
    vibe: "max-slut",
  },
  {
    id: "almost",
    label: "Almost nude nurse",
    outfit:
      "Only a nurse cap, open stethoscope around neck, micro white thong, open short lab coat not closed — almost nude but still reads NURSE",
    vibe: "max-slut",
  },
];

for (const c of data.characters) {
  c.body = slimBody(c.body, c.id);

  // portrait looks always
  c.portraitLooks = [
    {
      id: "role",
      label: "On-role",
      file: `${c.id}-role.png`,
      vibe: c.avatarVibe === "cute" ? "cute" : "sexy",
    },
    {
      id: "sexy",
      label: "Sexy",
      file: `${c.id}-sexy.png`,
      vibe: "sexy",
    },
    {
      id: "almost",
      label: "Almost nude",
      file: `${c.id}-almost.png`,
      vibe: "almost",
    },
  ];
  if (!c.selectedPortraitId) c.selectedPortraitId = "role";

  if (c.id === "nurse") {
    c.ageRange = "28-34";
    c.body = BODY.nurse;
    c.defaultOutfit = nurseStyles[0].outfit;
    c.outfitStyles = nurseStyles;
    c.avatarVibe = "sexy";
    c.bio =
      "Slim-fit nurse who makes checkups feel illegal. Real scrubs energy, then private-visit filth — never boring matron energy.";
    c.relationship =
      "Your nurse / clinic contact who keeps finding reasons for another visit.";
    c.voiceStyle =
      "Calm clinical that turns explicit during 'procedures' — still sounds like a nurse.";
    console.log("nurse upgraded");
  }
}

// Tag body types lightly for filters
const petiteIds = new Set(
  data.characters
    .filter((c) => /petite|tiny|slim petite|small frame/i.test(c.body + c.id))
    .map((c) => c.id)
);
for (const c of data.characters) {
  const tags = new Set(c.tags || []);
  if (petiteIds.has(c.id) || /petite/.test(c.id)) tags.add("body-petite");
  else if (/fit|athletic|abs|toned|gym/i.test(c.body)) tags.add("body-fit");
  else if (/hourglass|stacked|slim-thick|firm round/i.test(c.body))
    tags.add("body-hourglass");
  else tags.add("body-slim");
  // hot chubby only if we explicitly want a few
  c.tags = Array.from(tags);
}

// A couple intentional hot-chubby (soft curvy) — not fat
const chubby = {
  "hot-chubby-blonde": null, // may not exist
};
// Ensure shy-library is soft-normal not thick - already set

data.version = "1.7.0";
data.description =
  "Adult 18+. Slim/fit/petite body mix. Multi-look portraits. Selectable outfits. No auto images.";
writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("updated", data.characters.length, "characters with looks + bodies");
