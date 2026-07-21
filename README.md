# EroticEcho

**Interactive, personalized erotic story generator** — modular characters & scenarios, Dom/Sub roles, choose-your-own-adventure + AI continuation, local saves, and optional Grok (xAI) generation.

> **18+ only.** All characters are consenting adults. Fiction for private enjoyment.

---

## Stack

| Layer | Tech |
|--------|------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| State | Zustand + LocalStorage |
| AI | SpaceXAI / xAI Grok (`XAI_API_KEY`) with offline fallback |
| Images | Grok Imagine API + SVG placeholders |
| Deploy | Vercel / Netlify |

---

## Quick start

```bash
cd EroticEcho
cp .env.example .env.local
# Optional: add XAI_API_KEY=... for live AI

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without an API key the app still runs: offline story templates + image placeholders.

### Environment

```env
XAI_API_KEY=your_key_from_console.x.ai
XAI_MODEL=grok-4.5
XAI_IMAGE_MODEL=grok-imagine-image
FORCE_OFFLINE_STORY=false
```

Get a key: [https://console.x.ai](https://console.x.ai)

---

## Project structure

```
EroticEcho/
├── src/
│   ├── app/                    # Next.js routes + API
│   │   ├── api/story/          # Story generation (Grok or offline)
│   │   ├── api/image/          # Image generation (Imagine or placeholder)
│   │   ├── create/             # Character + scenario + settings wizard
│   │   ├── play/               # Interactive reader
│   │   ├── library/            # Saved stories, export JSON/PDF
│   │   ├── gallery/            # Generated images
│   │   ├── profile/            # Kinks, limits, writing style
│   │   └── settings/           # Backup import/export
│   ├── components/             # UI (AgeGate, StoryReader, cards, …)
│   ├── data/                   # ★ JSON libraries (edit to expand)
│   │   ├── characters.json     # 28+ presets
│   │   ├── scenarios.json      # 55+ starters
│   │   └── kinks.json          # Kinks, hard nos, modes, styles
│   ├── lib/                    # Types, storage, prompts, offline engine
│   └── store/                  # Zustand app store
├── .env.example
└── package.json
```

---

## Features

1. **Personalization dashboard** — name, gender, age, pronouns, multi-select kinks + custom tags, hard limits, writing style, explicitness.
2. **Modular libraries** — characters & scenarios in JSON; Dom/Sub/Switch/Brat/Yandere/Random per character.
3. **Story engine** — 3–5 choices + free-text actions; memory summary for continuity; modes (slow-burn, CNC, dubcon, pure filth, …); intensity 1–10; length control.
4. **Infinite modifications** mid-story — appearance, personality, location, extra characters, freeform notes.
5. **UX** — dark seductive UI, typewriter, gallery, quick-save, bookmarks, history rewind, browser TTS placeholder, mobile-responsive.
6. **Safety** — age gate, hard-no injection into prompts, CNC safeword field, content warnings toggle.
7. **Offline** — playable without API keys for demos and local use.

---

## Adding content (trivial)

### New character

Edit `src/data/characters.json` and append:

```json
{
  "id": "unique-slug",
  "name": "Name",
  "aliases": ["Display Label"],
  "tags": ["office", "milf"],
  "ageRange": "30-40",
  "gender": "female",
  "defaultRole": "switch",
  "personality": ["confident", "teasing"],
  "body": "Description…",
  "relationship": "How they relate to the user.",
  "voiceStyle": "How they speak.",
  "defaultOutfit": "…",
  "kinkAffinity": ["teasing", "power-exchange"],
  "bio": "Short pitch."
}
```

### New scenario

Edit `src/data/scenarios.json`:

```json
{
  "id": "unique-slug",
  "title": "Short Title",
  "category": "Home",
  "tags": ["caught", "teasing"],
  "intensityHint": 6,
  "preferredCharacterIds": ["step-mom", "roommate"],
  "setup": "One-line premise for the player.",
  "openingHook": "First lines of atmosphere."
}
```

### New kink / mode / style

Edit `src/data/kinks.json` arrays (`kinks`, `hardNoPresets`, `writingStyles`, `storyModes`, `domSubRoles`).

No TypeScript changes required for standard additions.

---

## API routes

### `POST /api/story`

Body: `{ story, userProfile, action, isOpening? }`  
Returns: `{ narrative, choices[], memoryUpdate?, imagePromptSuggestion?, offline? }`

### `POST /api/image`

Body: `{ prompt, characterName?, style? }`  
Returns: `{ url, prompt, offline?, error? }`

---

## Deploy

### Vercel

```bash
npx vercel
# Set XAI_API_KEY in project Environment Variables
```

### Netlify

Use the Next.js runtime plugin or export as needed; set the same env vars.

---

## Optional cloud saves (Supabase / Firebase)

LocalStorage is the default so deployment is zero-config. To add accounts later:

1. Create a `saves` table/collection with columns matching `ActiveStory` + `user_id`.
2. Mirror `src/lib/storage.ts` functions (`loadStories`, `upsertStory`, …) to call your backend when a session exists.
3. Keep LocalStorage as offline cache.

The JSON shapes in `src/lib/types.ts` are the contract.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |

---

## Safety & content policy (app-level)

- Age gate on first visit  
- All character ages are adult ranges  
- Hard nos (including minors) injected into every system prompt  
- CNC is framed as negotiated fantasy with a user-defined safeword  
- Robots metadata discourages public indexing  

You are responsible for how you use and host the app and for complying with local laws and platform policies.

---

## License

Private / personal project template. Modify freely for your own use.
