/**
 * Tag every character with avatarVibe: cute | pretty | sexy | max-slut
 * Then generate-avatars.mjs uses that for prompt extremes.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "src/data/characters.json");
const data = JSON.parse(readFileSync(path, "utf8"));

/** Explicit assignments — rest inferred */
const FORCE = {
  // CUTE / soft pretty — not slutty
  "innocent-church": "cute",
  "shy-library": "cute",
  "petite-blonde": "cute",
  "step-daughter": "cute",
  barista: "cute",
  "school-crush": "pretty",
  coworker: "pretty",
  nurse: "pretty",
  "tiny-asian": "pretty",
  "best-friends-sis": "pretty",
  "bodyguard": "pretty",
  therapist: "pretty",
  "hot-nerd": "pretty",
  "flight-attendant": "pretty",

  // MAX SLUT — test the limit
  "step-sis": "max-slut",
  roommate: "max-slut",
  "cam-girl": "max-slut",
  stripper: "max-slut",
  "porn-star": "max-slut",
  secretary: "max-slut",
  "stranger-bar": "max-slut",
  "neighbour-young": "max-slut",
  "fit-milf": "max-slut",
  maid: "max-slut",
  rideshare: "max-slut",
  "alt-egirl": "max-slut",
  android: "max-slut",
  succubus: "max-slut",
  "bully-f": "max-slut",
  "gym-trainer": "max-slut",
  "step-mom": "max-slut",
  "neighbour-milf": "max-slut",
  celebrity: "max-slut",
  "cute-blonde": "max-slut", // stacked body, go filthy despite name
  "shy-bombshell": "max-slut",
  "sugar-client": "max-slut",
  "stepmoms-friend": "max-slut",
  "hot-aunt": "max-slut",
  "massage-therapist": "max-slut",
  "college-freshman": "sexy",
  "red-pixie": "sexy",
  "petite-brunette": "sexy",
  "petite-goth": "sexy",
  "sister-in-law": "sexy",
  "psycho-ex": "sexy",
  "psycho-crush": "sexy",
  demoness: "max-slut",
  kitsune: "sexy",
  goddess: "pretty",
  vampire: "sexy",
  witch: "sexy",
  alien: "sexy",
  werewolf: "sexy",
  boss: "sexy",
  principal: "sexy",
  cop: "sexy",
  "teacher-professor": "sexy",
  librarian: "sexy",
  "best-friends-mom": "sexy",
  "bully-jock": "sexy",
};

function infer(c) {
  if (FORCE[c.id]) return FORCE[c.id];
  const blob = [
    c.id,
    ...(c.tags || []),
    ...(c.personality || []),
    ...(c.kinkAffinity || []),
    c.bio || "",
  ]
    .join(" ")
    .toLowerCase();
  if (/innocent|shy|sweet|cute|soft|romance|pretty/.test(blob) && !/slut|filth|free-use/.test(blob))
    return "pretty";
  if (/slut|filth|free-use|exhibition|porn|cam|strip|whore|shameless/.test(blob))
    return "max-slut";
  return "sexy";
}

const counts = { cute: 0, pretty: 0, sexy: 0, "max-slut": 0 };

for (const c of data.characters) {
  const v = infer(c);
  c.avatarVibe = v;
  // tag for UI filters
  const tag =
    v === "max-slut"
      ? "vibe-max-slut"
      : v === "cute"
        ? "vibe-cute"
        : v === "pretty"
          ? "vibe-pretty"
          : "vibe-sexy";
  c.tags = Array.from(
    new Set([
      ...(c.tags || []).filter((t) => !t.startsWith("vibe-")),
      tag,
      v === "max-slut" ? "slutty" : null,
      v === "cute" || v === "pretty" ? "cute" : null,
    ].filter(Boolean))
  );
  counts[v]++;
  console.log(v.padEnd(8), c.id);
}

data.version = "1.5.0";
writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("vibes", counts);
