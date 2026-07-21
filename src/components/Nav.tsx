"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  BookOpen,
  Crown,
  Home,
  Images,
  Library,
  LogIn,
  Settings2,
  Sparkles,
  User,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const desktopLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/create", label: "Create", icon: Sparkles },
  { href: "/play", label: "Play", icon: BookOpen },
  { href: "/library", label: "Library", icon: Library },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/pricing", label: "Pricing", icon: Crown },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Nav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const mobilePrimary = [
    { href: "/", label: "Home", icon: Home },
    { href: "/create", label: "Create", icon: Sparkles },
    { href: "/play", label: "Play", icon: BookOpen },
    { href: "/library", label: "Library", icon: Library },
    {
      href: user ? "/account" : "/login",
      label: user ? "Account" : "Login",
      icon: user ? User : LogIn,
    },
  ];

  const moreLinks = [
    { href: "/pricing", label: "Pricing", icon: Crown },
    { href: "/gallery", label: "Gallery", icon: Images },
    { href: "/settings", label: "Settings", icon: Settings2 },
  ];

  const hideMobileChrome = pathname.startsWith("/play");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl pt-[env(safe-area-inset-top)] hidden md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-echo-500 to-velvet-600 text-sm font-bold shadow-lg shadow-echo-900/50 group-hover:scale-105 transition ring-1 ring-white/10">
              EE
            </span>
            <span className="font-display text-lg text-echo-100 tracking-wide">
              EroticEcho
            </span>
          </Link>
          <nav className="flex items-center gap-0.5">
            {desktopLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition whitespace-nowrap",
                    active
                      ? "bg-white/10 text-white shadow-inner ring-1 ring-white/10"
                      : "text-ink-400 hover:text-ink-100 hover:bg-white/5"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{label}</span>
                </Link>
              );
            })}
            <Link
              href={user ? "/account" : "/login"}
              className={clsx(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition ml-1",
                user
                  ? "bg-echo-500/15 text-echo-100 ring-1 ring-echo-400/30"
                  : "bg-white/10 text-white"
              )}
            >
              {user ? (
                <>
                  <User className="h-3.5 w-3.5" />
                  <span className="max-w-[6rem] truncate">
                    {user.isGod ? "God" : user.name}
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="h-3.5 w-3.5" />
                  Sign in
                </>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <header
        className={clsx(
          "sticky top-0 z-40 border-b border-white/5 bg-black/70 backdrop-blur-2xl pt-[env(safe-area-inset-top)] md:hidden",
          hideMobileChrome && "border-white/5"
        )}
      >
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-echo-500 to-velvet-600 text-xs font-bold ring-1 ring-white/10">
              EE
            </span>
            {!hideMobileChrome && (
              <span className="font-display text-base text-echo-100 tracking-wide truncate">
                EroticEcho
              </span>
            )}
            {hideMobileChrome && (
              <span className="font-display text-sm text-echo-100 truncate">
                Play
              </span>
            )}
          </Link>
          <div className="flex items-center gap-0.5 shrink-0">
            {hideMobileChrome ? (
              <>
                <Link
                  href="/library"
                  className="flex h-11 items-center rounded-full px-3 text-xs text-ink-300 active:bg-white/10"
                >
                  Library
                </Link>
                <Link
                  href="/"
                  className="flex h-11 items-center rounded-full px-3 text-xs text-ink-300 active:bg-white/10"
                >
                  Home
                </Link>
              </>
            ) : (
              moreLinks.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-label={label}
                    className={clsx(
                      "flex h-11 w-11 items-center justify-center rounded-full",
                      active
                        ? "bg-white/10 text-white"
                        : "text-ink-400 active:bg-white/10"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </header>

      {!hideMobileChrome && (
        <nav
          className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-black/85 backdrop-blur-2xl md:hidden pb-[env(safe-area-inset-bottom)]"
          aria-label="Primary"
        >
          <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
            {mobilePrimary.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href + label}
                  href={href}
                  className={clsx(
                    "flex min-h-[56px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium touch-manipulation",
                    active ? "text-echo-200" : "text-ink-500 active:text-ink-200"
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      active && "bg-echo-500/20 ring-1 ring-echo-400/30"
                    )}
                  >
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={active ? 2.25 : 1.75}
                    />
                  </span>
                  <span className="truncate max-w-full">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
