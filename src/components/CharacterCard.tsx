"use client";

import clsx from "clsx";
import type { Character, DomSubRole } from "@/lib/types";
import { domSubRoles } from "@/lib/data";
import { CharacterAvatar } from "./CharacterAvatar";

interface Props {
  character: Character;
  selected?: boolean;
  role?: DomSubRole;
  onSelect?: () => void;
  onRoleChange?: (role: DomSubRole) => void;
  compact?: boolean;
}

export function CharacterCard({
  character,
  selected,
  role,
  onSelect,
  onRoleChange,
  compact,
}: Props) {
  const displayRole = role || character.roleOverride || character.defaultRole;
  const body = character.customBody || character.body;

  return (
    <article
      className={clsx(
        "card p-4 cursor-pointer transition hover:border-echo-500/40 touch-manipulation",
        selected && "border-echo-500/60 ring-1 ring-echo-500/40 bg-echo-950/40",
        compact && "p-3"
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.()}
    >
      <div className="flex items-start gap-3 mb-2">
        <CharacterAvatar
          character={character}
          size={compact ? "sm" : "md"}
          shape="soft"
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-lg text-echo-100 truncate">
                {character.customName || character.name}
              </h3>
              <p className="text-xs text-ink-400">
                {character.aliases[0]} · {character.ageRange}
              </p>
            </div>
            <span className="chip chip-active capitalize text-[10px] shrink-0">
              {displayRole}
            </span>
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <p className="text-sm text-ink-300 line-clamp-3 mb-2">{character.bio}</p>
          <p className="text-xs text-ink-500 line-clamp-2 mb-3 leading-relaxed">
            <span className="text-ink-400">Look: </span>
            {body}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {character.tags.slice(0, 5).map((t) => (
              <span key={t} className="chip text-[10px]">
                {t}
              </span>
            ))}
          </div>
        </>
      )}

      {onRoleChange && (
        <div onClick={(e) => e.stopPropagation()}>
          <label className="label">Dom / Sub</label>
          <select
            className="input text-xs"
            value={displayRole}
            onChange={(e) => onRoleChange(e.target.value as DomSubRole)}
          >
            {domSubRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </article>
  );
}
