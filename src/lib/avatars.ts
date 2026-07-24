/**
 * Photorealistic character portraits — sexy editorial, never cartoon.
 * Multi-heat prompts: try hot first, step down if moderated.
 */
import type { Character } from "./types";

export type AvatarHeat = "hot" | "warm" | "soft";

/** Stable key for caching (base id, or hash when customized). */
export function avatarCacheKey(character: Character): string {
  const base = character.id || "custom";
  const customized =
    character.customName ||
    character.customBody ||
    character.customOutfit ||
    character.appearanceNotes ||
    character.customAgeRange ||
    character.vibeKitId ||
    (character.customPersonality && character.customPersonality.length);
  if (!customized) return base;

  const payload = [
    character.customName || character.name,
    character.customBody || character.body,
    character.customOutfit || character.defaultOutfit,
    character.appearanceNotes || "",
    character.customAgeRange || character.ageRange || "",
    character.vibeKitId || "",
    (character.customPersonality || character.personality).join(","),
  ].join("|");
  return `${base}-${simpleHash(payload)}`;
}

function simpleHash(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

export function avatarPalette(id: string): { from: string; to: string } {
  const palettes = [
    { from: "#4a1942", to: "#1a0a14" },
    { from: "#3b0764", to: "#0f172a" },
    { from: "#7f1d1d", to: "#1c1917" },
    { from: "#1e3a5f", to: "#0c1222" },
    { from: "#4c1d95", to: "#0f0a1a" },
    { from: "#9f1239", to: "#1a0a12" },
    { from: "#134e4a", to: "#0a1412" },
    { from: "#78350f", to: "#1c1410" },
  ];
  let h = 0;
  for (let i = 0; i < id.length; i++)
    h = (h + id.charCodeAt(i) * (i + 1)) % palettes.length;
  return palettes[h];
}

export function characterInitials(character: Character): string {
  const name = (character.customName || character.name || "EE").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/** Stable hash for picking pose/outfit variants per character id */
function variantIndex(id: string, salt = 0, mod = 30): number {
  let h = 2166136261 ^ salt;
  const s = id || "x";
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % mod;
}

const AVATAR_POSES = [
  "bent over a bed looking back over her shoulder, arched spine, ass toward camera",
  "kneeling on bed facing camera, thighs apart, hands on thighs, looking up",
  "sitting on desk edge, legs spread, leaning back, chest forward",
  "pressed to a wall, one knee bent, hands above head, filthy half-smile",
  "on all fours on a couch, looking through messy hair, back arched",
  "lying on stomach on silk sheets, feet kicked up, chin on hands",
  "straddling a chair backwards, elbows on chair back, cleavage pushed together",
  "sitting on floor knees up and apart, looking up from below",
  "doorway pose, hip cocked hard, hand on frame, inviting stare",
  "lying on back at bed edge, hair spilling toward camera, legs bent",
  "yoga downward dog on mat looking under arm at camera",
  "sitting on kitchen counter legs open, hands on edge",
  "mirror selfie, free hand pulling outfit, biting lip",
  "balcony night, back arched looking back, city bokeh",
  "kneeling on carpet, hands behind back, chin lifted",
  "side-lying on couch, top leg hiked, hand on thigh",
  "crouched low, elbows on knees, looking up mischievous",
  "one foot on chair adjusting strap, mid-motion glance",
  "bent touching toes looking between legs, playful",
  "car passenger seat legs open toward camera, night lights",
  "back against rainy window, one leg hooked, hand on glass",
  "from behind looking over shoulder pulling top almost off",
  "sitting on washing machine gripping edge, laughing-horny",
  "library ladder high step, skirt riding, looking down",
  "spa towel almost falling on bench, flushed skin",
  "gym bench after set, soaked sports bra, intense eyes",
  "office chair legs over armrest, blouse open low",
  "pool chaise one knee up, wet shine, sunglasses down",
  "elevator corner skirt hiked by her fist, daring look",
  "mid-staircase sitting knees open looking down at camera",
];

const AVATAR_SETTINGS = [
  "dim luxury bedroom",
  "neon hotel room night",
  "messy apartment living room",
  "moody office after hours",
  "steamy bathroom fogged mirror",
  "club VIP velvet booth",
  "rainy night apartment window",
  "soft morning messy sheets",
  "gym locker soft focus",
  "library stacks warm lamps",
  "penthouse dusk windows",
  "kitchen night under-cabinet lights",
  "rooftop night bokeh",
  "spa suite candles",
  "car interior night ambient",
  "backstage vanity lights",
];

/**
 * Heat-ranked prompts. Call hot → warm → soft until one clears moderation.
 * Goal: max sexy/revealing, unique pose per character, still clothed (no full nudity).
 */
export function buildAvatarPrompt(
  character: Character,
  heat: AvatarHeat = "hot"
): string {
  const name = character.customName || character.name;
  const id = character.id || name;
  const body = sanitizeSexy(
    character.customBody || character.body || "gorgeous adult woman, hourglass figure"
  );
  const styleOutfit = character.outfitStyles?.find(
    (s) => s.id === character.selectedOutfitStyleId
  )?.outfit;
  const outfit = sanitizeSexy(
    character.customOutfit ||
      styleOutfit ||
      character.defaultOutfit ||
      "tight revealing clubwear"
  );
  const notes = sanitizeSexy(character.appearanceNotes || "");
  const relationship = sanitizeSexy(
    character.customRelationship || character.relationship || ""
  );
  const roleHint = sanitizeSexy(
    String(character.roleOverride || character.defaultRole || "")
  );
  const ageRaw = sanitizeSexy(character.ageRange || "adult mid-twenties");
  const youngAdult =
    /^(18|19)/.test(ageRaw) ||
    character.tags?.includes("barely-legal-adult") ||
    /barely|freshman/i.test(ageRaw);
  const milfYoung =
    character.tags?.includes("milf") ||
    /milf|step-mom|aunt|neighbour-milf|fit-milf|best-friends-mom/i.test(id);
  const age = youngAdult
    ? "young adult woman clearly 18 or 19 years old, adult face and body, NOT a minor, NOT child"
    : milfYoung
      ? `young hot MILF look early 30s NOT old NOT elderly, age band ${ageRaw}, smooth youthful skin, mature sexy not aged`
      : `adult woman 18+, age look ${ageRaw}`;
  const avatarVibe = character.avatarVibe || "sexy";
  const vibe = sanitizeSexy(
    (character.customPersonality?.length
      ? character.customPersonality
      : character.personality
    )
      .slice(0, 4)
      .join(", ")
  );
  const pose = AVATAR_POSES[variantIndex(id, 0, AVATAR_POSES.length)];
  const setting = AVATAR_SETTINGS[variantIndex(id, 1, AVATAR_SETTINGS.length)];
  const roleLine = relationship
    ? `She is: ${relationship}. Visual identity must match that role/profession/relationship (uniform, setting props, vibe).`
    : "";
  const heatLine =
    avatarVibe === "max-slut"
      ? "MAX SLUT fashion: micro clothes, filthy body language, still covering nipples and genitals,"
      : avatarVibe === "cute"
        ? "CUTE pretty soft energy, NOT slutty, wholesome attractive,"
        : avatarVibe === "pretty"
          ? "pretty glamorous tasteful sexy,"
          : "sexy fashion-revealing,";

  const tiers: Record<AvatarHeat, string[]> = {
    hot: [
      `Ultra-photorealistic photograph of ${name},`,
      `${age},`,
      `${body},`,
      notes ? `${notes},` : "",
      roleLine,
      roleHint ? `dynamic role energy: ${roleHint},` : "",
      `wearing ${outfit},`,
      heatLine,
      avatarVibe === "cute" || avatarVibe === "pretty"
        ? "tasteful flattering clothing, beautiful face focus,"
        : "VERY revealing outfit still covering private areas, deep cleavage, short hem, tight curves,",
      avatarVibe === "cute" || avatarVibe === "pretty"
        ? "soft natural pose, gentle smile,"
        : `unique pose (not generic hand-on-hip): ${pose},`,
      avatarVibe === "max-slut"
        ? "glossy lips, heavy lashes, flushed cheeks, shameless slutty energy,"
        : "glossy lips, pretty eyes, attractive energy,",
      vibe ? `personality vibe: ${vibe},` : "",
      `setting: ${setting},`,
      "full body or three-quarter showing the pose, soft realistic skin,",
      "photorealistic, 85mm, shallow depth of field,",
      "NOT cartoon, NOT anime, NOT illustration, NOT 3d render,",
      "NO full nudity, NO genitals, NO sex acts, NO underage, clothing stays on, no text no watermark",
    ],
    warm: [
      `Photorealistic glamorous portrait of ${name}, adult woman 18+,`,
      `age appearance ${ageRaw}, ${body},`,
      notes ? `${notes},` : "",
      `wearing ${outfit}, fitted and flattering, fashion-sexy,`,
      `pose: ${pose},`,
      "cinematic lighting, magazine beauty photography,",
      "realistic skin, NOT anime NOT cartoon,",
      "clothed, no nudity, no underage, no explicit content, no text",
    ],
    soft: [
      `Elegant photorealistic portrait of ${name}, adult woman 18+,`,
      `${body}, wearing stylish clothing,`,
      `pose: ${pose},`,
      "attractive face, professional beauty photography, soft light,",
      "realistic, classy, fully clothed, no text no watermark",
    ],
  };

  return tiers[heat].filter(Boolean).join(" ");
}

/** All heats hottest-first for retry loops */
export const AVATAR_HEAT_ORDER: AvatarHeat[] = ["hot", "warm", "soft"];

/**
 * Scene / gallery image heat prompts — sexy environment stills.
 */
export function buildSexySceneModifiers(
  heat: AvatarHeat,
  intensity: number
): string[] {
  if (heat === "soft" || intensity <= 3) {
    return ["fashion-sexy but modest", "elegant expression"];
  }
  if (heat === "warm" || intensity <= 6) {
    return [
      "tight fitted clothing hugging curves",
      "subtle cleavage, short skirt or fitted pants",
      "seductive soft expression, looking at viewer",
    ];
  }
  return [
    "very revealing club/date outfit still covering essentials",
    "deep neckline, short hem, body-hugging fabric",
    "arched posture, hand on thigh or hip, bedroom eyes",
    "glossy lips, tousled hair, flushed intimate lighting",
  ];
}

/** Allow sexy fashion language; strip only hard-fail explicit terms */
function sanitizeSexy(s: string): string {
  if (!s) return "";
  return s
    .replace(
      /\b(nude|naked|topless|bottomless|nsfw|porn|explicit sex|fuck|cock|pussy|cum|orgasm|penetrat\w*|genital\w*|nipples?\s+visible|bare\s+breasts?|no\s+clothes|completely\s+undressed)\b/gi,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .trim();
}

/** Cache-bust when portraits are regenerated (bump when re-running generate-avatars) */
export const AVATAR_ASSET_VERSION = "5";

export function staticAvatarPath(
  characterId: string,
  fileOrLook?: string
): string {
  const file =
    fileOrLook && fileOrLook.includes(".")
      ? fileOrLook
      : fileOrLook
        ? `${characterId}-${fileOrLook}.png`
        : `${characterId}.png`;
  return `/avatars/${file}?v=${AVATAR_ASSET_VERSION}`;
}

/** Resolve which static portrait URL to show for a character (no API). */
export function resolvePortraitUrl(character: Character): string | null {
  const looks = character.portraitLooks || [];

  // Prefer explicit multi-look selection (mid-story / customize)
  if (looks.length && character.selectedPortraitId) {
    const sel = looks.find((l) => l.id === character.selectedPortraitId);
    if (sel?.file) return staticAvatarPath(character.id, sel.file);
  }

  // Generated / uploaded override (data URLs or remote) — only when not using a look
  if (
    character.avatarUrl &&
    (character.avatarUrl.startsWith("data:") ||
      character.avatarUrl.startsWith("http://") ||
      character.avatarUrl.startsWith("https://") ||
      !looks.length)
  ) {
    return character.avatarUrl;
  }

  if (looks.length) {
    const sel =
      looks.find((l) => l.id === "role") ||
      looks.find((l) => l.id === "sexy") ||
      looks.find((l) => l.id === "hot") ||
      looks[0];
    if (sel?.file) return staticAvatarPath(character.id, sel.file);
  }

  // Sticky static avatarUrl under /avatars/
  if (character.avatarUrl?.startsWith("/avatars/")) {
    return character.avatarUrl.includes("?")
      ? character.avatarUrl
      : `${character.avatarUrl}?v=${AVATAR_ASSET_VERSION}`;
  }

  if (character.id) return staticAvatarPath(character.id);
  return null;
}

/** Ordered fallback URLs when an image 404s */
export function portraitFallbackUrls(character: Character): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (u: string | null | undefined) => {
    if (!u || seen.has(u)) return;
    seen.add(u);
    out.push(u);
  };
  push(resolvePortraitUrl(character));
  for (const look of character.portraitLooks || []) {
    if (look.file) push(staticAvatarPath(character.id, look.file));
  }
  if (character.avatarUrl?.startsWith("/avatars/")) {
    push(
      character.avatarUrl.includes("?")
        ? character.avatarUrl
        : `${character.avatarUrl}?v=${AVATAR_ASSET_VERSION}`
    );
  }
  if (character.id) push(staticAvatarPath(character.id));
  return out;
}

/** Default multi-look set written for every preset character */
export function defaultPortraitLooks(characterId: string): {
  id: string;
  label: string;
  file: string;
  vibe: string;
}[] {
  return [
    {
      id: "role",
      label: "On-role",
      file: `${characterId}-role.png`,
      vibe: "sexy",
    },
    {
      id: "sexy",
      label: "Sexy",
      file: `${characterId}-sexy.png`,
      vibe: "sexy",
    },
    {
      id: "almost",
      label: "Almost nude",
      file: `${characterId}-almost.png`,
      vibe: "almost",
    },
  ];
}

export function clientAvatarStorageKey(cacheKey: string): string {
  return `ee-avatar-v2:${cacheKey}`;
}

export function readClientAvatarCache(cacheKey: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(clientAvatarStorageKey(cacheKey));
  } catch {
    return null;
  }
}

export function writeClientAvatarCache(cacheKey: string, url: string): void {
  if (typeof window === "undefined") return;
  try {
    if (url.startsWith("data:") && url.length > 900_000) return;
    localStorage.setItem(clientAvatarStorageKey(cacheKey), url);
  } catch {
    /* quota */
  }
}
