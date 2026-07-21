"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Character, CharacterLoadout } from "@/lib/types";
import {
  deleteLoadout,
  loadLoadouts,
  upsertLoadout,
} from "@/lib/storage";
import { getCharacterById } from "@/lib/data";
import { CharacterAvatar } from "./CharacterAvatar";
import { BookmarkPlus, Trash2, FolderOpen } from "lucide-react";

interface Props {
  character: Character | null;
  onApply: (character: Character) => void;
}

/**
 * Save / load customized character skins (outfits, looks, customs).
 */
export function LoadoutPanel({ character, onApply }: Props) {
  const [loadouts, setLoadouts] = useState<CharacterLoadout[]>([]);
  const [name, setName] = useState("");
  const [filterBase, setFilterBase] = useState(true);

  const refresh = () => setLoadouts(loadLoadouts());

  useEffect(() => {
    refresh();
  }, []);

  const visible = filterBase && character
    ? loadouts.filter((l) => l.baseCharacterId === character.id)
    : loadouts;

  const saveCurrent = () => {
    if (!character) return;
    const label =
      name.trim() ||
      `${character.customName || character.name} loadout`;
    const now = new Date().toISOString();
    const loadout: CharacterLoadout = {
      id: uuidv4(),
      name: label,
      baseCharacterId: character.id,
      character: { ...character },
      createdAt: now,
      updatedAt: now,
    };
    upsertLoadout(loadout);
    setName("");
    refresh();
  };

  const apply = (l: CharacterLoadout) => {
    const base = getCharacterById(l.baseCharacterId);
    // merge base data (in case library updated) with saved customs
    const merged: Character = {
      ...(base || l.character),
      ...l.character,
      id: l.baseCharacterId,
      outfitStyles: base?.outfitStyles || l.character.outfitStyles,
      portraitLooks: base?.portraitLooks || l.character.portraitLooks,
    };
    onApply(merged);
  };

  const remove = (id: string) => {
    deleteLoadout(id);
    refresh();
  };

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="panel-title text-base flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-echo-400" />
            Saved loadouts
          </h2>
          <p className="text-[11px] text-ink-500 mt-0.5">
            Save this customization (outfit, look, name, kinks) and reuse later.
          </p>
        </div>
        <label className="flex items-center gap-1.5 text-[11px] text-ink-400">
          <input
            type="checkbox"
            checked={filterBase}
            onChange={(e) => setFilterBase(e.target.checked)}
          />
          This character only
        </label>
      </div>

      {character && (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="input flex-1 text-sm"
            placeholder="Loadout name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="button"
            className="btn-primary text-xs min-h-10 shrink-0"
            onClick={saveCurrent}
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            Save loadout
          </button>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-xs text-ink-500 py-2">
          No loadouts yet. Customize a character, then save.
        </p>
      ) : (
        <ul className="space-y-2 max-h-56 overflow-y-auto">
          {visible.map((l) => (
            <li
              key={l.id}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-black/20 p-2"
            >
              <CharacterAvatar
                character={l.character}
                size="sm"
                shape="soft"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-100 truncate">{l.name}</p>
                <p className="text-[10px] text-ink-500 truncate">
                  {l.character.customName || l.character.name}
                  {l.character.selectedOutfitStyleId
                    ? ` · ${l.character.selectedOutfitStyleId}`
                    : ""}
                  {l.character.selectedPortraitId
                    ? ` · look:${l.character.selectedPortraitId}`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                className="btn-ghost text-[11px] min-h-9 px-2"
                onClick={() => apply(l)}
              >
                Load
              </button>
              <button
                type="button"
                className="p-2 text-ink-500 hover:text-rose-300"
                title="Delete"
                onClick={() => remove(l.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
