/**
 * Export helpers — JSON download and simple print-friendly "PDF" via browser print.
 */
import type { ActiveStory, UserProfile } from "./types";

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportStoryJson(story: ActiveStory): void {
  const safe = (story.title || "story")
    .replace(/[^a-z0-9-_]+/gi, "-")
    .toLowerCase();
  downloadJson(`eroticecho-${safe}.json`, story);
}

/** Opens a print window styled for saving as PDF */
export function exportStoryPdf(story: ActiveStory, profile?: UserProfile): void {
  const name = story.character.customName || story.character.name;
  const scenesHtml = story.scenes
    .map(
      (s, i) => `
      <section style="margin-bottom:2rem;page-break-inside:avoid">
        <h2 style="color:#be185d;font-size:1.1rem">Scene ${i + 1}</h2>
        ${s.chosenAction ? `<p style="opacity:.7;font-style:italic">Action: ${escapeHtml(s.chosenAction)}</p>` : ""}
        <div style="white-space:pre-wrap;line-height:1.7">${escapeHtml(s.narrative)}</div>
      </section>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>${escapeHtml(story.title)}</title>
<style>
  body{font-family:Georgia,serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#1a121f;background:#fff}
  h1{color:#9d174d} .meta{color:#666;font-size:.9rem;margin-bottom:2rem}
  @media print{body{margin:0}}
</style></head><body>
  <h1>${escapeHtml(story.title)}</h1>
  <p class="meta">
    Character: ${escapeHtml(name)} · Scenario: ${escapeHtml(story.scenario.title)}<br/>
    ${profile?.name ? `Protagonist: ${escapeHtml(profile.name)} · ` : ""}
    Mode: ${escapeHtml(String(story.settings.mode))} · Intensity: ${story.settings.intensity}/10<br/>
    Exported from EroticEcho · 18+ fiction
  </p>
  <hr/>
  ${scenesHtml || "<p>No scenes yet.</p>"}
  <script>window.onload=()=>window.print()</script>
</body></html>`;

  const w = window.open("", "_blank");
  if (!w) {
    alert("Pop-up blocked — allow pop-ups to export PDF.");
    return;
  }
  w.document.write(html);
  w.document.close();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function storyTranscript(story: ActiveStory): string {
  const name = story.character.customName || story.character.name;
  const lines = [
    `# ${story.title}`,
    `Character: ${name}`,
    `Scenario: ${story.scenario.title}`,
    `Mode: ${story.settings.mode} | Intensity: ${story.settings.intensity}`,
    "",
    ...story.scenes.flatMap((s, i) => [
      `## Scene ${i + 1}`,
      s.chosenAction ? `> Action: ${s.chosenAction}` : "",
      s.narrative,
      "",
    ]),
  ];
  return lines.filter((l) => l !== undefined).join("\n");
}
