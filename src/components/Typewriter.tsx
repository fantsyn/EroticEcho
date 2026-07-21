"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  enabled?: boolean;
  /** ms per character */
  speed?: number;
  className?: string;
  onDone?: () => void;
}

/**
 * Stable typewriter — does NOT restart when parent re-renders.
 * onDone is held in a ref so identity changes won't reset the animation.
 */
export function Typewriter({
  text,
  enabled = true,
  speed = 8,
  className,
  onDone,
}: Props) {
  const [shown, setShown] = useState(enabled ? "" : text);
  const [done, setDone] = useState(!enabled);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!enabled) {
      setShown(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    // Instant for very long text on slow devices
    if (text.length > 1200 || speed <= 0) {
      setShown(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    setShown("");
    setDone(false);
    let i = 0;
    let cancelled = false;

    const id = window.setInterval(() => {
      if (cancelled) return;
      // Jump by a few chars for snappier mobile feel
      i = Math.min(text.length, i + 2);
      setShown(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
        onDoneRef.current?.();
      }
    }, speed);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
    // Intentionally only re-run when text/enabled/speed change — NOT onDone
  }, [text, enabled, speed]);

  const skip = () => {
    setShown(text);
    setDone(true);
    onDoneRef.current?.();
  };

  return (
    <div className={className} onClick={!done ? skip : undefined} role="article">
      <span className={done ? "" : "caret-blink"}>{shown}</span>
      {!done && (
        <button
          type="button"
          className="ml-2 text-xs text-echo-400 underline touch-manipulation min-h-8 px-1"
          onClick={(e) => {
            e.stopPropagation();
            skip();
          }}
        >
          Skip
        </button>
      )}
    </div>
  );
}
