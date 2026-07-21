"use client";

import { useCallback, useState } from "react";
import { Check, CloudUpload, Copy, Loader2, RefreshCw } from "lucide-react";
import type { ActiveStory } from "@/lib/types";
import {
  formatShareCode,
  publishStoryToCloud,
} from "@/lib/cloud-client";
import { useAppStore } from "@/store/useAppStore";

interface Props {
  story: ActiveStory;
  /** Compact chip for play header */
  compact?: boolean;
}

export function ShareCodePanel({ story, compact }: Props) {
  const updateActiveStory = useAppStore((s) => s.updateActiveStory);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const code = story.shareCode;

  const publish = useCallback(async () => {
    setBusy(true);
    setMsg(null);
    // Always send freshest story from store
    const latest =
      useAppStore.getState().activeStory?.id === story.id
        ? useAppStore.getState().activeStory!
        : story;
    const result = await publishStoryToCloud(latest);
    setBusy(false);
    if (!result.ok) {
      setMsg(result.error);
      return;
    }
    updateActiveStory((s) => ({
      ...s,
      shareCode: result.code,
    }));
    setMsg("Synced to cloud");
    setTimeout(() => setMsg(null), 2000);
  }, [story, updateActiveStory]);

  const readUrl =
    typeof window !== "undefined" && code
      ? `${window.location.origin}/read/${code}`
      : code
        ? `/read/${code}`
        : "";

  const copy = async (asLink = false) => {
    if (!code) {
      await publish();
      return;
    }
    const display = formatShareCode(code);
    const value =
      asLink && typeof window !== "undefined"
        ? `${window.location.origin}/read/${code}`
        : code;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
    setMsg(asLink ? "Read link copied" : `Code ${display} copied`);
  };

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {code ? (
          <button
            type="button"
            className="btn-ghost min-h-11 text-xs tracking-widest font-semibold touch-manipulation"
            onClick={() => void copy()}
            title="Copy share code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-echo-300" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="tabular-nums">{formatShareCode(code)}</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn-ghost min-h-11 text-xs touch-manipulation"
            disabled={busy}
            onClick={() => void publish()}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CloudUpload className="h-3.5 w-3.5" />
            )}
            Get code
          </button>
        )}
        {code && (
          <>
            <button
              type="button"
              className="btn-ghost min-h-11 text-xs touch-manipulation"
              onClick={() => void copy(true)}
              title="Copy read-only link"
            >
              Link
            </button>
            <button
              type="button"
              className="btn-ghost min-h-11 text-xs touch-manipulation"
              disabled={busy}
              onClick={() => void publish()}
              title="Sync latest progress to this code"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Sync
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="card p-4 space-y-3">
      <div>
        <h2 className="label mb-0">Share &amp; sync</h2>
        <p className="text-[11px] text-ink-500 mt-1 leading-relaxed">
          Code works across devices on this server. Read-only link: anyone can
          open the story without playing AI.
        </p>
      </div>
      {code ? (
        <div className="flex flex-col gap-2">
          <div className="rounded-xl border border-echo-500/30 bg-black/40 px-4 py-3 text-center font-display text-2xl tracking-[0.35em] text-echo-100">
            {formatShareCode(code)}
          </div>
          {readUrl && (
            <p className="text-[10px] text-ink-500 break-all px-1">
              Read: <span className="text-ink-300">{readUrl}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary flex-1 min-h-12 touch-manipulation"
              onClick={() => void copy()}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy code
            </button>
            <button
              type="button"
              className="btn-ghost flex-1 min-h-12 touch-manipulation"
              onClick={() => void copy(true)}
            >
              <Copy className="h-4 w-4" />
              Copy read link
            </button>
            <button
              type="button"
              className="btn-ghost flex-1 min-h-12 touch-manipulation"
              disabled={busy}
              onClick={() => void publish()}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Sync
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn-primary w-full min-h-12 touch-manipulation"
          disabled={busy}
          onClick={() => void publish()}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CloudUpload className="h-4 w-4" />
          )}
          Create share code
        </button>
      )}
      {msg && <p className="text-xs text-echo-200">{msg}</p>}
    </div>
  );
}
