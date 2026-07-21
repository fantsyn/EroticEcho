"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";

export default function GalleryPage() {
  const stories = useAppStore((s) => s.stories);

  const images = useMemo(
    () =>
      stories.flatMap((s) =>
        s.gallery.map((g) => ({
          ...g,
          storyTitle: s.title,
          storyId: s.id,
        }))
      ),
    [stories]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="panel-title text-2xl">Gallery</h1>
        <p className="text-sm text-ink-500 mt-1">
          Generated character & scene visuals ({images.length})
        </p>
      </div>

      {images.length === 0 ? (
        <div className="card p-10 text-center text-ink-400">
          No images yet. Open a story and use{" "}
          <strong className="text-echo-300">Generate Image</strong> in the
          reader.{" "}
          <Link href="/play" className="text-echo-400 underline">
            Go to Play
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img) => (
            <figure key={img.id} className="card overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.prompt}
                className="aspect-[3/4] w-full object-cover"
              />
              <figcaption className="p-3">
                <p className="text-xs text-echo-200 truncate">{img.storyTitle}</p>
                <p className="text-[10px] text-ink-500 line-clamp-2 mt-1">
                  {img.prompt}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
