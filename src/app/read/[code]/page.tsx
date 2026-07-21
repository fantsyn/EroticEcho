"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { ActiveStory } from "@/lib/types";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { Loader2 } from "lucide-react";
import { formatShareCode } from "@/lib/cloud-client";

/**
 * Public read-only story view by share code — no play controls, no AI.
 */
export default function ReadStoryPage() {
  const params = useParams();
  const code = String(params?.code || "").toUpperCase();
  const [story, setStory] = useState<ActiveStory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/cloud?code=${encodeURIComponent(code)}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Story not found");
          setStory(null);
        } else {
          setStory(data.story as ActiveStory);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Could not load story");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-ink-400">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h1 className="font-display text-2xl text-echo-50">Not found</h1>
        <p className="text-sm text-ink-400">{error || "Invalid code"}</p>
        <Link href="/" className="btn-primary inline-flex">
          Home
        </Link>
      </div>
    );
  }

  const her =
    story.character.customName || story.character.name || "Her";

  return (
    <article className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-16">
      <header className="card-immersive p-5 sm:p-7">
        <p className="section-kicker mb-2">
          Shared story · {formatShareCode(code)}
        </p>
        <div className="flex gap-4 items-start">
          <CharacterAvatar
            character={story.character}
            size="lg"
            shape="soft"
          />
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl text-echo-50">
              {story.title}
            </h1>
            <p className="text-sm text-ink-400 mt-1">
              {her} · {story.scenario.title} · {story.scenes.length} scenes
            </p>
            <p className="text-xs text-ink-500 mt-2 leading-relaxed">
              Read-only. 18+ fiction. No generation on this page.
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-5">
        {story.scenes.length === 0 ? (
          <p className="text-sm text-ink-500 text-center py-8">
            No scenes published yet.
          </p>
        ) : (
          story.scenes.map((sc, i) => (
            <section key={sc.id} className="card p-4 sm:p-6">
              <p className="text-[10px] uppercase tracking-widest text-ink-500 mb-2">
                Scene {i + 1}
                {sc.chosenAction ? ` · You: ${sc.chosenAction}` : ""}
              </p>
              {sc.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sc.imageUrl}
                  alt=""
                  className="mb-4 max-h-64 w-full rounded-xl object-cover object-top border border-white/10"
                />
              )}
              <div className="story-prose text-sm sm:text-[15px] leading-relaxed text-ink-100 whitespace-pre-wrap">
                {sc.narrative}
              </div>
            </section>
          ))
        )}
      </div>

      <footer className="text-center space-y-3 pt-4">
        <Link href="/" className="btn-primary inline-flex min-h-11">
          Start your own story
        </Link>
        <p className="text-[11px] text-ink-600">
          <Link href="/login" className="underline">
            Sign in
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>
        </p>
      </footer>
    </article>
  );
}
