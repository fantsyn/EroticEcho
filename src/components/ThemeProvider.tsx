"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { resolveStoryThemeId } from "@/lib/presets";
import { getTheme } from "@/lib/themes";
import { AmbientOrbs } from "./AmbientOrbs";

/**
 * Applies immersive theme class to <html> based on active story / route.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeStory = useAppStore((s) => s.activeStory);
  const hydrated = useAppStore((s) => s.hydrated);
  const reduceMotion = useAppStore((s) => s.settings.reduceMotion);

  const themeId =
    pathname?.startsWith("/play") && activeStory
      ? resolveStoryThemeId(activeStory)
      : pathname === "/"
        ? "velvet-night"
        : "default";

  const theme = getTheme(themeId);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    // Remove old theme-* classes
    root.classList.forEach((c) => {
      if (c.startsWith("theme-")) root.classList.remove(c);
    });
    root.classList.add(theme.className);
    root.dataset.theme = theme.id;
    return () => {
      root.classList.remove(theme.className);
    };
  }, [theme.className, theme.id]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("reduce-motion", !!reduceMotion);
  }, [reduceMotion]);

  if (!hydrated) return <>{children}</>;

  return (
    <>
      <AmbientOrbs themeId={themeId as string} />
      <div className="relative z-10">{children}</div>
    </>
  );
}
