/**
 * Soft, procedural ambient beds via Web Audio API.
 * No external audio files — subtle, low-volume loops matched to scene tone.
 */

export type AmbientId =
  | "off"
  | "night"
  | "rain"
  | "cafe"
  | "spa"
  | "office"
  | "palace"
  | "club"
  | "library"
  | "tension"
  | "romance"
  | "public";

export interface AmbientPreset {
  id: AmbientId;
  label: string;
  /** Short description for UI */
  hint: string;
}

export const AMBIENT_PRESETS: AmbientPreset[] = [
  { id: "off", label: "Off", hint: "Silence" },
  { id: "night", label: "Night", hint: "Soft room hum" },
  { id: "rain", label: "Rain", hint: "Distant rain" },
  { id: "cafe", label: "Cafe", hint: "Warm murmur bed" },
  { id: "spa", label: "Spa", hint: "Soft water / calm" },
  { id: "office", label: "Office", hint: "Quiet AC hum" },
  { id: "palace", label: "Palace", hint: "Warm marble air" },
  { id: "club", label: "Club", hint: "Far bass pulse" },
  { id: "library", label: "Library", hint: "Hushed room" },
  { id: "tension", label: "Tension", hint: "Low pulse" },
  { id: "romance", label: "Romance", hint: "Warm pad" },
  { id: "public", label: "Public", hint: "Far crowd wash" },
];

type Nodes = {
  ctx: AudioContext;
  master: GainNode;
  stops: Array<() => void>;
};

let active: Nodes | null = null;
let currentId: AmbientId = "off";
let targetVolume = 0.07; // very subtle default
let unlocked = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!active) {
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    active = { ctx, master, stops: [] };
  }
  return active.ctx;
}

/** Call from a user gesture so browsers allow audio */
export async function unlockAmbient(): Promise<boolean> {
  const ctx = getCtx();
  if (!ctx) return false;
  try {
    if (ctx.state === "suspended") await ctx.resume();
    unlocked = true;
    return true;
  } catch {
    return false;
  }
}

export function isAmbientUnlocked(): boolean {
  return unlocked;
}

export function getAmbientId(): AmbientId {
  return currentId;
}

export function setAmbientVolume(v: number) {
  targetVolume = Math.max(0, Math.min(0.25, v));
  if (active && currentId !== "off") {
    const now = active.ctx.currentTime;
    active.master.gain.cancelScheduledValues(now);
    active.master.gain.linearRampToValueAtTime(targetVolume, now + 0.4);
  }
}

export function getAmbientVolume(): number {
  return targetVolume;
}

function stopAll() {
  if (!active) return;
  for (const s of active.stops) {
    try {
      s();
    } catch {
      /* */
    }
  }
  active.stops = [];
}

function noiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = ctx.createBuffer(1, len, rate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    // brown-ish noise (softer)
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
}

function startNoise(
  nodes: Nodes,
  opts: {
    filterType?: BiquadFilterType;
    freq?: number;
    q?: number;
    gain?: number;
    lfoHz?: number;
    lfoDepth?: number;
  }
) {
  const { ctx, master } = nodes;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 3);
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = opts.filterType || "lowpass";
  filter.frequency.value = opts.freq ?? 400;
  filter.Q.value = opts.q ?? 0.7;
  const g = ctx.createGain();
  g.gain.value = opts.gain ?? 0.15;
  src.connect(filter);
  filter.connect(g);
  g.connect(master);

  if (opts.lfoHz) {
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = opts.lfoHz;
    lfoG.gain.value = opts.lfoDepth ?? 0.03;
    lfo.connect(lfoG);
    lfoG.connect(g.gain);
    lfo.start();
    nodes.stops.push(() => {
      try {
        lfo.stop();
        lfo.disconnect();
      } catch {
        /* */
      }
    });
  }

  src.start();
  nodes.stops.push(() => {
    try {
      src.stop();
      src.disconnect();
      filter.disconnect();
      g.disconnect();
    } catch {
      /* */
    }
  });
}

function startTone(
  nodes: Nodes,
  opts: {
    type?: OscillatorType;
    freq: number;
    gain?: number;
    detune?: number;
    lfoHz?: number;
    lfoDepth?: number;
  }
) {
  const { ctx, master } = nodes;
  const osc = ctx.createOscillator();
  osc.type = opts.type || "sine";
  osc.frequency.value = opts.freq;
  if (opts.detune) osc.detune.value = opts.detune;
  const g = ctx.createGain();
  g.gain.value = opts.gain ?? 0.02;
  osc.connect(g);
  g.connect(master);
  if (opts.lfoHz) {
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = opts.lfoHz;
    lfoG.gain.value = opts.lfoDepth ?? 0.008;
    lfo.connect(lfoG);
    lfoG.connect(g.gain);
    lfo.start();
    nodes.stops.push(() => {
      try {
        lfo.stop();
        lfo.disconnect();
      } catch {
        /* */
      }
    });
  }
  osc.start();
  nodes.stops.push(() => {
    try {
      osc.stop();
      osc.disconnect();
      g.disconnect();
    } catch {
      /* */
    }
  });
}

function buildBed(id: AmbientId, nodes: Nodes) {
  switch (id) {
    case "night":
      startNoise(nodes, { filterType: "lowpass", freq: 280, gain: 0.12 });
      startTone(nodes, { freq: 55, gain: 0.018, lfoHz: 0.08, lfoDepth: 0.006 });
      startTone(nodes, { freq: 82, gain: 0.01, detune: 8 });
      break;
    case "rain":
      startNoise(nodes, {
        filterType: "bandpass",
        freq: 1200,
        q: 0.5,
        gain: 0.14,
        lfoHz: 0.15,
        lfoDepth: 0.04,
      });
      startNoise(nodes, { filterType: "highpass", freq: 2200, gain: 0.05 });
      break;
    case "cafe":
      startNoise(nodes, { filterType: "lowpass", freq: 600, gain: 0.1 });
      startNoise(nodes, {
        filterType: "bandpass",
        freq: 900,
        q: 0.4,
        gain: 0.06,
        lfoHz: 0.25,
        lfoDepth: 0.03,
      });
      startTone(nodes, { freq: 110, gain: 0.008 });
      break;
    case "spa":
      startNoise(nodes, { filterType: "lowpass", freq: 500, gain: 0.08 });
      startTone(nodes, { freq: 174, gain: 0.012, lfoHz: 0.05, lfoDepth: 0.005 });
      startTone(nodes, { freq: 220, gain: 0.008, detune: -6 });
      break;
    case "office":
      startNoise(nodes, { filterType: "lowpass", freq: 350, gain: 0.09 });
      startTone(nodes, { freq: 60, type: "triangle", gain: 0.01 });
      break;
    case "palace":
      startNoise(nodes, { filterType: "lowpass", freq: 400, gain: 0.09 });
      startTone(nodes, { freq: 98, gain: 0.014, lfoHz: 0.06, lfoDepth: 0.005 });
      startTone(nodes, { freq: 147, gain: 0.009, detune: 5 });
      startTone(nodes, { freq: 196, gain: 0.006 });
      break;
    case "club":
      startNoise(nodes, { filterType: "lowpass", freq: 200, gain: 0.1 });
      startTone(nodes, {
        freq: 48,
        type: "sine",
        gain: 0.03,
        lfoHz: 1.05,
        lfoDepth: 0.02,
      });
      break;
    case "library":
      startNoise(nodes, { filterType: "lowpass", freq: 250, gain: 0.07 });
      startTone(nodes, { freq: 90, gain: 0.008 });
      break;
    case "tension":
      startNoise(nodes, { filterType: "lowpass", freq: 180, gain: 0.1 });
      startTone(nodes, {
        freq: 42,
        gain: 0.022,
        lfoHz: 0.9,
        lfoDepth: 0.012,
      });
      startTone(nodes, { freq: 63, gain: 0.01, detune: 15 });
      break;
    case "romance":
      startNoise(nodes, { filterType: "lowpass", freq: 320, gain: 0.07 });
      startTone(nodes, { freq: 130, gain: 0.012, lfoHz: 0.07, lfoDepth: 0.005 });
      startTone(nodes, { freq: 196, gain: 0.008, detune: 4 });
      startTone(nodes, { freq: 261, gain: 0.005 });
      break;
    case "public":
      startNoise(nodes, {
        filterType: "bandpass",
        freq: 700,
        q: 0.35,
        gain: 0.11,
        lfoHz: 0.2,
        lfoDepth: 0.04,
      });
      startNoise(nodes, { filterType: "lowpass", freq: 400, gain: 0.07 });
      break;
    default:
      break;
  }
}

export async function setAmbient(id: AmbientId): Promise<void> {
  const ctx = getCtx();
  if (!ctx || !active) return;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
      unlocked = true;
    } catch {
      return;
    }
  }

  if (id === currentId && id !== "off") {
    // re-apply volume only
    const now = ctx.currentTime;
    active.master.gain.cancelScheduledValues(now);
    active.master.gain.linearRampToValueAtTime(targetVolume, now + 0.3);
    return;
  }

  // fade out
  const now = ctx.currentTime;
  active.master.gain.cancelScheduledValues(now);
  active.master.gain.linearRampToValueAtTime(0, now + 0.35);
  await new Promise((r) => setTimeout(r, 380));
  stopAll();
  currentId = id;

  if (id === "off") return;

  buildBed(id, active);
  const t = active.ctx.currentTime;
  active.master.gain.cancelScheduledValues(t);
  active.master.gain.setValueAtTime(0, t);
  active.master.gain.linearRampToValueAtTime(targetVolume, t + 1.2);
}

/** Infer ambient from story theme + scenario tags/category/setup text */
export function inferAmbient(input: {
  themeId?: string;
  category?: string;
  tags?: string[];
  setup?: string;
  title?: string;
  location?: string;
}): AmbientId {
  const blob = [
    input.themeId,
    input.category,
    ...(input.tags || []),
    input.setup,
    input.title,
    input.location,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/rain|storm|power.?out|thunder/.test(blob)) return "rain";
  if (/spa|massage|oil|bath|steam/.test(blob)) return "spa";
  if (/cafe|coffee|barista|bakery/.test(blob)) return "cafe";
  if (/office|desk|boss|after.?hours|cubicle/.test(blob)) return "office";
  if (/palace|princess|royal|throne|marble|harem|silk/.test(blob))
    return "palace";
  if (/club|bar|party|bass|dance|strip/.test(blob)) return "club";
  if (/library|stacks|books|quiet/.test(blob)) return "library";
  if (/public|risk|elevator|train|alley|balcony|almost.?caught/.test(blob))
    return "public";
  if (/blackmail|cnc|threat|hostage|dark|yandere|psycho|edge/.test(blob))
    return "tension";
  if (/romance|melt|soft|kiss|slow.?burn|aftercare/.test(blob)) return "romance";
  if (/night|hotel|bedroom|midnight|velvet/.test(blob)) return "night";
  if (input.themeId === "blood-rose" || input.themeId === "neon-noir")
    return "tension";
  if (input.themeId === "candle-library") return "library";
  if (input.themeId === "ember-cafe" || input.themeId === "sunset-glow")
    return "romance";
  if (input.themeId === "arcane-smoke") return "night";
  return "night";
}

const LS_KEY = "eroticecho:ambient";
const LS_VOL = "eroticecho:ambientVol";

export function loadAmbientPreference(): {
  enabled: boolean;
  volume: number;
  lockedId: AmbientId | null;
} {
  if (typeof window === "undefined")
    return { enabled: true, volume: 0.07, lockedId: null };
  try {
    const raw = localStorage.getItem(LS_KEY);
    const vol = Number(localStorage.getItem(LS_VOL));
    const parsed = raw ? (JSON.parse(raw) as { enabled?: boolean; lockedId?: AmbientId }) : {};
    return {
      enabled: parsed.enabled !== false,
      volume: Number.isFinite(vol) ? Math.min(0.25, Math.max(0, vol)) : 0.07,
      lockedId: parsed.lockedId && parsed.lockedId !== "off" ? parsed.lockedId : null,
    };
  } catch {
    return { enabled: true, volume: 0.07, lockedId: null };
  }
}

export function saveAmbientPreference(p: {
  enabled: boolean;
  volume: number;
  lockedId?: AmbientId | null;
}) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    LS_KEY,
    JSON.stringify({ enabled: p.enabled, lockedId: p.lockedId ?? null })
  );
  localStorage.setItem(LS_VOL, String(p.volume));
}
