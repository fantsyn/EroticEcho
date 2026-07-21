"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cloud,
  Copy,
  Download,
  FileText,
  Play,
  Search,
  Trash2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { exportStoryJson, exportStoryPdf } from "@/lib/export";
import { storyToMeta } from "@/lib/storage";
import { ClaimCode } from "@/components/ClaimCode";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { formatShareCode, publishStoryToCloud } from "@/lib/cloud-client";

export default function LibraryPage() {
  const stories = useAppStore((s) => s.stories);
  const loadStoryById = useAppStore((s) => s.loadStoryById);
  const removeStory = useAppStore((s) => s.removeStory);
  const router = useRouter();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "title" | "scenes">("recent");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...stories];
    if (q) {
      list = list.filter((s) => {
        const blob = [
          s.title,
          s.character.customName || s.character.name,
          s.scenario.title,
          s.memorySummary,
        ]
          .join(" ")
          .toLowerCase();
        return blob.includes(q);
      });
    }
    list.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "scenes") return b.scenes.length - a.scenes.length;
      return (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });
    return list;
  }, [stories, query, sort]);

  const continueStory = (id: string) => {
    loadStoryById(id);
    router.push("/play");
  };

  const syncCode = async (id: string) => {
    const story = stories.find((s) => s.id === id);
    if (!story) return;
    setSyncingId(id);
    const result = await publishStoryToCloud(story);
    setSyncingId(null);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    loadStoryById(id);
    const cur = useAppStore.getState().stories.find((s) => s.id === id);
    if (cur) {
      const next = { ...cur, shareCode: result.code };
      const { upsertStory } = await import("@/lib/storage");
      upsertStory(next);
      useAppStore.setState((state) => ({
        stories: state.stories.map((s) => (s.id === id ? next : s)),
        activeStory:
          state.activeStory?.id === id ? next : state.activeStory,
      }));
    }
    try {
      await navigator.clipboard.writeText(result.code!);
      alert(`Code ${formatShareCode(result.code!)} copied`);
    } catch {
      alert(`Code: ${formatShareCode(result.code!)}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="panel-title text-2xl">Library</h1>
          <p className="text-sm text-ink-500 mt-1">
            {stories.length} saved {stories.length === 1 ? "story" : "stories"}
          </p>
        </div>
        <Link href="/create" className="btn-primary min-h-11 text-sm">
          New story
        </Link>
      </div>

      <section className="card p-4 sm:p-5">
        <ClaimCode />
      </section>

      {stories.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
            <input
              className="input pl-9 min-h-11 text-sm"
              placeholder="Search title, character…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="input min-h-11 text-sm sm:max-w-[10rem]"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
          >
            <option value="recent">Recent</option>
            <option value="title">Title</option>
            <option value="scenes">Most scenes</option>
          </select>
        </div>
      )}

      {stories.length === 0 ? (
        <div className="card-immersive p-10 text-center space-y-4">
          <p className="font-display text-xl text-echo-100">No stories yet</p>
          <p className="text-sm text-ink-500 max-w-sm mx-auto">
            Jump into a preset or create your own — saves land here.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/" className="btn-primary min-h-11">
              Browse presets
            </Link>
            <Link href="/create" className="btn-ghost min-h-11">
              Create
            </Link>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-ink-500 text-center py-8">No matches.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((s) => {
            const meta = storyToMeta(s);
            return (
              <li
                key={s.id}
                className="card-immersive p-4 flex flex-col sm:flex-row gap-3 sm:items-center"
              >
                <CharacterAvatar
                  character={s.character}
                  size="md"
                  shape="soft"
                  className="shrink-0 self-start"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium text-echo-100 truncate">
                    {meta.title}
                  </h2>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {meta.characterName} · {meta.scenarioTitle} ·{" "}
                    {meta.sceneCount} scenes
                  </p>
                  <p className="text-xs text-ink-400 mt-2 line-clamp-2">
                    {meta.preview}
                  </p>
                  {s.shareCode && (
                    <p className="text-[10px] text-echo-300/80 mt-1 font-mono">
                      Code {formatShareCode(s.shareCode)}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 sm:flex-col sm:items-stretch shrink-0">
                  <button
                    type="button"
                    className="btn-primary min-h-11 text-xs px-3"
                    onClick={() => continueStory(s.id)}
                  >
                    <Play className="h-3.5 w-3.5" /> Play
                  </button>
                  <button
                    type="button"
                    className="btn-ghost min-h-10 text-xs px-3"
                    disabled={syncingId === s.id}
                    onClick={() => void syncCode(s.id)}
                  >
                    <Cloud className="h-3.5 w-3.5" />
                    {syncingId === s.id ? "…" : "Code"}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost min-h-10 text-xs px-3"
                    onClick={() => exportStoryJson(s)}
                  >
                    <Download className="h-3.5 w-3.5" /> JSON
                  </button>
                  <button
                    type="button"
                    className="btn-ghost min-h-10 text-xs px-3"
                    onClick={() => exportStoryPdf(s)}
                  >
                    <FileText className="h-3.5 w-3.5" /> PDF
                  </button>
                  {s.shareCode && (
                    <button
                      type="button"
                      className="btn-ghost min-h-10 text-xs px-3"
                      onClick={() =>
                        navigator.clipboard.writeText(s.shareCode!)
                      }
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-ghost min-h-10 text-xs px-3 text-rose-300/80"
                    onClick={() => {
                      if (confirm("Delete this story?")) removeStory(s.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
