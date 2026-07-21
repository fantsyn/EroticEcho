"use client";

import clsx from "clsx";
import type { Scenario } from "@/lib/types";

interface Props {
  scenario: Scenario;
  selected?: boolean;
  onSelect?: () => void;
}

export function ScenarioCard({ scenario, selected, onSelect }: Props) {
  return (
    <article
      className={clsx(
        "card p-4 cursor-pointer transition hover:border-velvet-500/40",
        selected && "border-velvet-500/60 ring-1 ring-velvet-500/40 bg-velvet-950/30"
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.()}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display text-base text-velvet-100">
          {scenario.title}
        </h3>
        <span className="chip text-[10px] shrink-0">{scenario.category}</span>
      </div>
      <p className="text-sm text-ink-300 mb-3 line-clamp-3">{scenario.setup}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {scenario.tags.slice(0, 3).map((t) => (
            <span key={t} className="chip text-[10px]">
              {t}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-ink-500">
          Heat ~{scenario.intensityHint}/10
        </span>
      </div>
    </article>
  );
}
