/**
 * Clone donor portrait files onto new character ids so each has a full look set.
 * Usage: node scripts/clone-avatar-assets.mjs
 */
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const av = join(root, "public", "avatars");
mkdirSync(av, { recursive: true });

const LOOKS = [
  "role",
  "sexy",
  "almost",
  "cute",
  "shy",
  "hot",
  "erotic",
  "slutty",
];

/** newId -> donor character id (files: donor.png, donor-role.png, …) */
const MAP = {
  "arab-princess": "goddess",
  "blackmail-queen": "boss",
  "public-risk-girl": "celebrity",
  "humiliation-brat": "bully-f",
  "switch-lover": "secretary",
  "taboo-roommate": "roommate",
  "shy-masseuse": "massage-therapist",
  "shy-barista": "barista",
  "confident-bombshell": "shy-bombshell",
  "soft-domme": "therapist",
};

function portraitLooks(characterId) {
  return [
    { id: "role", label: "On-role", file: `${characterId}-role.png`, vibe: "sexy" },
    { id: "sexy", label: "Sexy", file: `${characterId}-sexy.png`, vibe: "sexy" },
    { id: "almost", label: "Almost nude", file: `${characterId}-almost.png`, vibe: "almost" },
    { id: "cute", label: "Cute soft", file: `${characterId}-cute.png`, vibe: "cute" },
    { id: "shy", label: "Shy", file: `${characterId}-shy.png`, vibe: "shy" },
    { id: "hot", label: "Hot glam", file: `${characterId}-hot.png`, vibe: "hot" },
    { id: "erotic", label: "Erotic pose", file: `${characterId}-erotic.png`, vibe: "erotic" },
    { id: "slutty", label: "Danger slut", file: `${characterId}-slutty.png`, vibe: "slutty" },
  ];
}

let copied = 0;
let missing = 0;

for (const [dest, donor] of Object.entries(MAP)) {
  // base portrait
  const baseSrc = join(av, `${donor}.png`);
  const baseAlt = join(av, `${donor}-hot.png`);
  const baseDest = join(av, `${dest}.png`);
  const base =
    existsSync(baseSrc) ? baseSrc : existsSync(baseAlt) ? baseAlt : null;
  if (base) {
    copyFileSync(base, baseDest);
    copied++;
    console.log(`base ${dest}.png ← ${base.split(/[/\\]/).pop()}`);
  } else {
    missing++;
    console.warn(`MISSING base for ${dest} (donor ${donor})`);
  }

  for (const look of LOOKS) {
    const src = join(av, `${donor}-${look}.png`);
    const out = join(av, `${dest}-${look}.png`);
    if (existsSync(src)) {
      copyFileSync(src, out);
      copied++;
    } else {
      // fallback: use base or role
      const fallback = existsSync(join(av, `${donor}-role.png`))
        ? join(av, `${donor}-role.png`)
        : base;
      if (fallback && existsSync(fallback)) {
        copyFileSync(fallback, out);
        copied++;
        console.log(`  fallback ${dest}-${look}.png`);
      } else {
        missing++;
        console.warn(`  missing ${donor}-${look}.png`);
      }
    }
  }
}

// Update characters.json to point portraitLooks + avatarUrl at own files
const charsPath = join(root, "src/data/characters.json");
const data = JSON.parse(readFileSync(charsPath, "utf8"));
let updated = 0;
for (const ch of data.characters) {
  if (!MAP[ch.id]) continue;
  ch.avatarUrl = `/avatars/${ch.id}.png`;
  ch.selectedPortraitId = ch.selectedPortraitId || "role";
  ch.portraitLooks = portraitLooks(ch.id);
  // Ensure defaultOutfit styles don't break
  updated++;
}
writeFileSync(charsPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`Copied files ops: ${copied}, missing: ${missing}, chars updated: ${updated}`);
