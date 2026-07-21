"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  exportAllData,
  importAllData,
  loadStories,
} from "@/lib/storage";
import { downloadJson } from "@/lib/export";
import { storyModes } from "@/lib/data";
import type { StoryModeId } from "@/lib/types";

export default function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);
  const hydrate = useAppStore((s) => s.hydrate);
  const fileRef = useRef<HTMLInputElement>(null);
  const [phoneUrl, setPhoneUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { protocol, hostname, port } = window.location;
    const p = port ? `:${port}` : "";
    // Prefer current host so phones that already opened via LAN keep that URL
    setPhoneUrl(`${protocol}//${hostname}${p}`);
  }, []);

  async function copyUrl() {
    if (!phoneUrl) return;
    try {
      await navigator.clipboard.writeText(phoneUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older mobile browsers
      const ta = document.createElement("textarea");
      ta.value = phoneUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-xl">
      <div>
        <h1 className="panel-title text-2xl">Settings</h1>
        <p className="text-sm text-ink-500 mt-1">App preferences & data</p>
      </div>

      <section className="card p-5 space-y-3">
        <h2 className="label">Open on phone</h2>
        <p className="text-xs text-ink-500 leading-relaxed">
          Same Wi‑Fi as this computer. On your phone, open the address below (or
          scan if you share it). For install: Safari → Share → Add to Home Screen,
          or Chrome → menu → Install app / Add to Home screen.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <code className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-echo-100 break-all">
            {phoneUrl || "…"}
          </code>
          <button type="button" className="btn-primary shrink-0" onClick={copyUrl}>
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <p className="text-[11px] text-ink-600 leading-relaxed">
          From this PC&apos;s LAN, phones usually use{" "}
          <span className="text-ink-400">http://192.168.1.29:3000</span> while the
          dev server is running. If it fails, check Windows Firewall allows Node
          on private networks.
        </p>
      </section>

      <section className="card p-5 space-y-4">
        <h2 className="label">Preferences</h2>
        <label className="flex items-center justify-between gap-4 cursor-pointer min-h-11">
          <span className="text-sm text-ink-200">Auto-save stories</span>
          <input
            type="checkbox"
            className="accent-echo-500 h-5 w-5"
            checked={settings.autoSave}
            onChange={(e) => setSettings({ autoSave: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-4 cursor-pointer min-h-11">
          <span className="text-sm text-ink-200">Show content warnings</span>
          <input
            type="checkbox"
            className="accent-echo-500 h-5 w-5"
            checked={settings.showContentWarnings}
            onChange={(e) =>
              setSettings({ showContentWarnings: e.target.checked })
            }
          />
        </label>
        <label className="flex items-center justify-between gap-4 cursor-pointer min-h-11">
          <span className="text-sm text-ink-200">Reduce motion</span>
          <input
            type="checkbox"
            className="accent-echo-500 h-5 w-5"
            checked={settings.reduceMotion}
            onChange={(e) => setSettings({ reduceMotion: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-4 cursor-pointer min-h-11">
          <span className="text-sm text-ink-200">Typewriter by default</span>
          <input
            type="checkbox"
            className="accent-echo-500 h-5 w-5"
            checked={settings.defaultTypewriter !== false}
            onChange={(e) =>
              setSettings({ defaultTypewriter: e.target.checked })
            }
          />
        </label>
      </section>

      <section className="card p-5 space-y-4">
        <h2 className="label">New story defaults</h2>
        <div>
          <label className="label">
            Default intensity: {settings.defaultIntensity ?? 7}/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            className="w-full accent-echo-500"
            value={settings.defaultIntensity ?? 7}
            onChange={(e) =>
              setSettings({ defaultIntensity: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="label">Default mode</label>
          <select
            className="input min-h-11 text-sm"
            value={settings.defaultMode || "slow-burn"}
            onChange={(e) =>
              setSettings({ defaultMode: e.target.value as StoryModeId })
            }
          >
            {storyModes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="card p-5 space-y-3">
        <h2 className="label">Data export / import</h2>
        <p className="text-xs text-ink-500">
          Full backup of profile, stories, loadouts & favorites as JSON.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              downloadJson(
                `eroticecho-backup-${Date.now()}.json`,
                JSON.parse(exportAllData())
              )
            }
          >
            Export all data
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => fileRef.current?.click()}
          >
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              const result = importAllData(text);
              if (result.ok) {
                hydrate();
                alert(`Imported. ${loadStories().length} stories loaded.`);
              } else {
                alert(result.error || "Import failed");
              }
            }}
          />
        </div>
      </section>

      <section className="card p-5 space-y-2 text-xs text-ink-500">
        <h2 className="label">Voice</h2>
        <p>
          Scenes use a natural Grok conversation voice (Eve). In Play, use{" "}
          <strong className="text-ink-300">Narrate</strong> or{" "}
          <strong className="text-ink-300">Pause</strong> only.
        </p>
      </section>
    </div>
  );
}
