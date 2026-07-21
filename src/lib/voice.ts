/**
 * Narration with mobile-safe unlock.
 *
 * iOS/Safari will not play audio that starts after an await (TTS fetch)
 * unless the same <audio> element is already playing from a user gesture.
 * We keep a tiny silent loop running through the fetch, then swap src.
 */
import {
  DEFAULT_COMPANION_ID,
  getCompanionById,
} from "./companion-voices";

let preferredBrowserVoice: SpeechSynthesisVoice | null = null;
let sharedAudio: HTMLAudioElement | null = null;
let objectUrl: string | null = null;
let paused = false;
let audioUnlocked = false;
let playSession = 0;
let browserChainActive = false;
let ttsAbort: AbortController | null = null;
let audioCtx: AudioContext | null = null;

/** Build a valid near-silent WAV data-URI (iOS rejects empty/broken clips). */
function makeSilentWavDataUri(durationSec = 1.5, sampleRate = 22050): string {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  // tiny amplitude so some WebViews don't treat it as "silent autoplay"
  for (let i = 0; i < numSamples; i++) {
    const sample = i % 200 < 2 ? 80 : 0;
    view.setInt16(44 + i * 2, sample, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

let silentWavUri: string | null = null;
function getSilentWav(): string {
  if (!silentWavUri) silentWavUri = makeSilentWavDataUri();
  return silentWavUri;
}

export type NarrateOptions = {
  companionId?: string;
  forceBrowser?: boolean;
  onEnd?: () => void;
  onStart?: () => void;
  onError?: (msg: string) => void;
};

export function isMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function ensureAudio(): HTMLAudioElement {
  if (typeof window === "undefined") throw new Error("No window");
  if (!sharedAudio) {
    sharedAudio = document.createElement("audio");
    sharedAudio.setAttribute("playsinline", "true");
    sharedAudio.setAttribute("webkit-playsinline", "true");
    sharedAudio.setAttribute("x-webkit-airplay", "allow");
    (sharedAudio as HTMLAudioElement & { playsInline?: boolean }).playsInline =
      true;
    sharedAudio.preload = "auto";
    // Keep in DOM — some mobile browsers require it
    sharedAudio.style.display = "none";
    document.body.appendChild(sharedAudio);
  }
  return sharedAudio;
}

async function resumeAudioContext(): Promise<void> {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
  } catch {
    /* optional */
  }
}

/**
 * Call from a real user tap. Starts a near-silent loop so later src swaps can play.
 * IMPORTANT: never use muted=true — iOS won't unlock unmuted playback from that.
 */
export async function unlockAudio(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    await resumeAudioContext();
    const a = ensureAudio();

    // Already playing / unlocked
    if (audioUnlocked && a.src && !a.paused) {
      return true;
    }

    a.loop = true;
    a.muted = false; // never mute — iOS won't unlock unmuted play from muted unlock
    a.volume = 0.05;
    a.src = getSilentWav();

    const p = a.play();
    if (p !== undefined) await p;

    // Leave the loop running — keeps the media session alive until TTS swaps in
    audioUnlocked = true;
    warmVoices();
    return true;
  } catch (e) {
    console.warn("[voice] unlock failed", e);
    audioUnlocked = false;
    return false;
  }
}

export function isAudioUnlocked(): boolean {
  return audioUnlocked;
}

function scoreBrowserVoice(v: SpeechSynthesisVoice): number {
  const n = `${v.name} ${v.lang}`.toLowerCase();
  let score = 0;
  if (v.lang.toLowerCase().startsWith("en")) score += 10;
  if (
    /(female|woman|zira|samantha|victoria|karen|moira|fiona|tessa|susan|hazel|serena|aria|jenny)/i.test(
      n
    )
  )
    score += 22;
  if (/(male|david|mark|daniel|james|george|thomas)/i.test(n)) score -= 20;
  return score;
}

export function pickBrowserVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return preferredBrowserVoice;
  preferredBrowserVoice = [...voices].sort(
    (a, b) => scoreBrowserVoice(b) - scoreBrowserVoice(a)
  )[0];
  return preferredBrowserVoice;
}

export function warmVoices(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  pickBrowserVoice();
  window.speechSynthesis.onvoiceschanged = () => pickBrowserVoice();
}

/** Soft stop — keep element & unlock; stop speech queue */
export function stopNarration(): void {
  if (typeof window === "undefined") return;
  playSession += 1;
  paused = false;
  browserChainActive = false;

  if (ttsAbort) {
    try {
      ttsAbort.abort();
    } catch {
      /* */
    }
    ttsAbort = null;
  }

  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* */
    }
  }

  if (sharedAudio) {
    try {
      sharedAudio.onended = null;
      sharedAudio.onerror = null;
      sharedAudio.loop = false;
      sharedAudio.pause();
      try {
        sharedAudio.currentTime = 0;
      } catch {
        /* */
      }
    } catch {
      /* */
    }
  }

  if (objectUrl) {
    try {
      URL.revokeObjectURL(objectUrl);
    } catch {
      /* */
    }
    objectUrl = null;
  }
}

export function pauseNarration(): boolean {
  if (typeof window === "undefined") return false;
  if (sharedAudio && !sharedAudio.paused && sharedAudio.src) {
    sharedAudio.pause();
    paused = true;
    return true;
  }
  if (window.speechSynthesis?.speaking && !window.speechSynthesis.paused) {
    try {
      window.speechSynthesis.pause();
      paused = true;
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function resumeNarration(): boolean {
  if (typeof window === "undefined") return false;
  if (sharedAudio && sharedAudio.paused && paused && sharedAudio.src) {
    void sharedAudio.play().then(() => {
      paused = false;
    }).catch(() => {
      paused = false;
    });
    return true;
  }
  if (window.speechSynthesis?.paused) {
    try {
      window.speechSynthesis.resume();
      paused = false;
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function isPaused(): boolean {
  return paused;
}

export function isPlaying(): boolean {
  if (
    sharedAudio &&
    sharedAudio.src &&
    !sharedAudio.paused &&
    !sharedAudio.ended &&
    !sharedAudio.loop
  )
    return true;
  if (
    typeof window !== "undefined" &&
    window.speechSynthesis?.speaking &&
    !window.speechSynthesis.paused
  )
    return true;
  return false;
}

function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e || "");
  const low = msg.toLowerCase();
  if (
    low.includes("notallowed") ||
    low.includes("user didn't interact") ||
    low.includes("not allowed") ||
    low.includes("play()")
  ) {
    return "Tap Narrate again — mobile needs a direct tap to start sound.";
  }
  if (low.includes("abort")) return "";
  return msg.slice(0, 140) || "Voice unavailable";
}

/**
 * @param alreadyUnlocked - pass true if unlockAudio() just ran in this tap
 */
export async function narrateText(
  text: string,
  opts?: NarrateOptions & { alreadyUnlocked?: boolean }
): Promise<void> {
  if (typeof window === "undefined") return;

  if (paused && (sharedAudio?.src || window.speechSynthesis?.paused)) {
    if (resumeNarration()) {
      opts?.onStart?.();
      return;
    }
  }

  // Soft cancel previous (bumps session) but re-prime unlock for mobile
  const prevUnlocked = audioUnlocked;
  stopNarration();
  const session = playSession;

  const cleaned = text
    .replace(/\*+|_+/g, "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);

  if (!cleaned) {
    opts?.onEnd?.();
    return;
  }

  // Re-establish silent loop after stop (critical on iOS)
  if (opts?.alreadyUnlocked || prevUnlocked || isMobileBrowser()) {
    const ok = await unlockAudio();
    if (!ok && isMobileBrowser()) {
      // Last resort: browser TTS may still work on Android
      narrateWithBrowser(cleaned, opts, session);
      return;
    }
  }

  if (session !== playSession) {
    opts?.onEnd?.();
    return;
  }

  if (!opts?.forceBrowser) {
    try {
      await narrateWithGrok(cleaned, opts, session);
      return;
    } catch (e) {
      if (session !== playSession) {
        opts?.onEnd?.();
        return;
      }
      console.warn("[voice] Grok TTS → browser fallback", e);
    }
  }

  if (session !== playSession) {
    opts?.onEnd?.();
    return;
  }
  narrateWithBrowser(cleaned, opts, session);
}

async function narrateWithGrok(
  text: string,
  opts: NarrateOptions | undefined,
  session: number
): Promise<void> {
  const companionId = opts?.companionId || DEFAULT_COMPANION_ID;
  const companion = getCompanionById(companionId);

  // Ensure silent loop is running during fetch (iOS media session)
  const a = ensureAudio();
  if (a.paused || !a.src) {
    const ok = await unlockAudio();
    if (!ok && isMobileBrowser()) {
      throw new Error("Audio unlock failed");
    }
  }

  ttsAbort = new AbortController();
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: ttsAbort.signal,
    body: JSON.stringify({
      text,
      companionId,
      voiceId: companion?.voiceId || "eve",
      speed: companion?.speed ?? 0.96,
      naturalEnhance: true,
    }),
  });

  if (session !== playSession) {
    opts?.onEnd?.();
    return;
  }
  if (!res.ok) {
    let detail = `Voice ${res.status}`;
    try {
      const j = await res.json();
      detail = j.error || detail;
    } catch {
      /* */
    }
    throw new Error(detail);
  }

  const buf = await res.arrayBuffer();
  if (session !== playSession) {
    opts?.onEnd?.();
    return;
  }
  if (!buf.byteLength) throw new Error("Empty audio");

  // Prefer mp3 type for mobile
  const blob = new Blob([buf], { type: "audio/mpeg" });
  if (objectUrl) {
    try {
      URL.revokeObjectURL(objectUrl);
    } catch {
      /* */
    }
  }
  objectUrl = URL.createObjectURL(blob);

  const audio = ensureAudio();
  audio.onended = null;
  audio.onerror = null;
  audio.loop = false;
  audio.muted = false;
  audio.volume = 1;

  // Swap source while element is "warm"
  audio.src = objectUrl;
  audio.load();

  await new Promise<void>((resolve, reject) => {
    const t = window.setTimeout(() => resolve(), 4000);
    const done = () => {
      window.clearTimeout(t);
      resolve();
    };
    audio.oncanplay = done;
    audio.onloadeddata = done;
    audio.onerror = () => {
      window.clearTimeout(t);
      reject(new Error("Audio load error"));
    };
  });

  if (session !== playSession) {
    opts?.onEnd?.();
    return;
  }

  paused = false;
  audio.onended = () => {
    if (session !== playSession) return;
    paused = false;
    opts?.onEnd?.();
  };
  audio.onerror = () => {
    if (session !== playSession) return;
    paused = false;
    opts?.onError?.("Audio playback error");
    opts?.onEnd?.();
  };

  opts?.onStart?.();

  try {
    const playPromise = audio.play();
    if (playPromise !== undefined) await playPromise;
    audioUnlocked = true;
  } catch (e) {
    if (session !== playSession) {
      opts?.onEnd?.();
      return;
    }
    paused = false;
    // One retry after re-unlock
    try {
      await unlockAudio();
      if (session !== playSession) {
        opts?.onEnd?.();
        return;
      }
      audio.src = objectUrl!;
      audio.loop = false;
      audio.volume = 1;
      await audio.play();
      audioUnlocked = true;
    } catch (e2) {
      const msg = friendlyError(e2);
      if (msg) opts?.onError?.(msg);
      throw e2;
    }
  }
}

function narrateWithBrowser(
  text: string,
  opts: NarrateOptions | undefined,
  session: number
): void {
  if (!window.speechSynthesis) {
    opts?.onError?.("No speech engine on this browser.");
    opts?.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
  } catch {
    /* */
  }

  // iOS: speak must be kicked soon after gesture — speak a blank first
  try {
    const kick = new SpeechSynthesisUtterance(" ");
    kick.volume = 0.01;
    window.speechSynthesis.speak(kick);
    window.speechSynthesis.cancel();
  } catch {
    /* */
  }

  const chunks = chunkText(text, 80);
  let i = 0;
  paused = false;
  browserChainActive = true;

  const finish = () => {
    if (session !== playSession) return;
    browserChainActive = false;
    opts?.onEnd?.();
  };

  const speakNext = () => {
    if (session !== playSession || !browserChainActive) return;
    if (i >= chunks.length) {
      finish();
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks[i++]);
    const voice = pickBrowserVoice();
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.pitch = 1;
    u.volume = 1;

    u.onend = () => {
      if (session !== playSession || !browserChainActive) return;
      window.setTimeout(speakNext, 20);
    };

    u.onerror = (ev) => {
      const type = String((ev as SpeechSynthesisErrorEvent).error || "");
      if (
        type === "canceled" ||
        type === "interrupted" ||
        type === "not-allowed" ||
        session !== playSession
      ) {
        browserChainActive = false;
        if (type === "not-allowed") {
          opts?.onError?.(
            "Tap Narrate again — mobile needs a direct tap to start sound."
          );
        }
        opts?.onEnd?.();
        return;
      }
      window.setTimeout(speakNext, 20);
    };

    try {
      window.speechSynthesis.speak(u);
    } catch {
      finish();
    }
  };

  opts?.onStart?.();
  speakNext();
}

function chunkText(text: string, maxWords: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let buf = "";
  for (const s of sentences) {
    const next = (buf + " " + s).trim();
    if (next.split(/\s+/).length > maxWords && buf) {
      chunks.push(buf.trim());
      buf = s;
    } else {
      buf = next;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks.length ? chunks : [text];
}
