"use client";

import { getTheme } from "@/lib/themes";

export function AmbientOrbs({ themeId }: { themeId?: string | null }) {
  const theme = getTheme(themeId || "default");

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden
    >
      {theme.orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute h-[40vmax] w-[40vmax] rounded-full blur-3xl animate-float-slow ${orb.color} ${orb.position}`}
          style={{ animationDelay: `${i * 2.5}s` }}
        />
      ))}
      {/* subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
      {/* film grain */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay bg-noise" />
    </div>
  );
}
