"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CloudDownload, Loader2 } from "lucide-react";
import { claimStoryFromCloud, formatShareCode } from "@/lib/cloud-client";
import { useAppStore } from "@/store/useAppStore";

interface Props {
  compact?: boolean;
  className?: string;
}

/** Enter a 6-character code to load a story from this server onto any device. */
export function ClaimCode({ compact, className }: Props) {
  const router = useRouter();
  const startPresetStory = useAppStore((s) => s.startPresetStory);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claim = async () => {
    const raw = code.trim();
    if (raw.length < 4 || busy) return;
    setBusy(true);
    setError(null);
    const result = await claimStoryFromCloud(raw);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    startPresetStory(result.story);
    setCode("");
    router.push("/play");
  };

  return (
    <div className={className}>
      {!compact && (
        <div className="mb-2">
          <p className="label mb-0">Open with code</p>
          <p className="text-[11px] text-ink-500 mt-0.5 leading-relaxed">
            Enter a story code from another device (same Wi‑Fi / server).
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <input
          className="input flex-1 min-h-12 text-base tracking-[0.2em] uppercase font-medium"
          placeholder="ABC-123"
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          value={code}
          onChange={(e) =>
            setCode(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9-]/g, "")
                .slice(0, 8)
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") void claim();
          }}
          aria-label="Story share code"
        />
        <button
          type="button"
          className="btn-primary min-h-12 px-4 touch-manipulation shrink-0"
          disabled={busy || code.replace(/-/g, "").length < 4}
          onClick={() => void claim()}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <CloudDownload className="h-4 w-4" />
              {!compact && <span>Open</span>}
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-300 mt-2 leading-relaxed">{error}</p>
      )}
      {code.length >= 4 && !error && (
        <p className="text-[10px] text-ink-600 mt-1.5">
          Looking up {formatShareCode(code.replace(/-/g, ""))}
        </p>
      )}
    </div>
  );
}
