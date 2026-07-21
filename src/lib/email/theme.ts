/** Themed HTML emails for EroticEcho */

export function welcomeEmailHtml(opts: {
  name: string;
  appUrl: string;
}): { subject: string; html: string; text: string } {
  const name = opts.name || "there";
  const url = opts.appUrl.replace(/\/$/, "");
  const subject = "Welcome to EroticEcho — your nights just got longer";
  const text = `Hi ${name},

Welcome to EroticEcho — immersive 18+ interactive fiction where she speaks in first person and you choose what happens next.

Your free plan includes a few AI story scenes each day, the full preset library, and pre-made portraits (no image API spend on free).

Start here: ${url}
Pricing (when you want more): ${url}/pricing

Stay curious. Stay 18+.
— EroticEcho`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0d0a12;color:#f8f7fa;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0d0a12;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:linear-gradient(160deg,#1a0f1c 0%,#120818 50%,#0d0a12 100%);border:1px solid rgba(236,72,153,0.25);border-radius:24px;overflow:hidden;">
          <tr>
            <td style="padding:36px 28px 12px;text-align:center;">
              <div style="display:inline-block;width:56px;height:56px;line-height:56px;border-radius:16px;background:linear-gradient(135deg,#db2777,#7c3aed);color:#fff;font-weight:700;font-family:system-ui,sans-serif;font-size:18px;">EE</div>
              <h1 style="margin:20px 0 8px;font-size:28px;font-weight:600;letter-spacing:0.02em;color:#fce7f3;">Welcome, ${escapeHtml(name)}.</h1>
              <p style="margin:0;font-size:15px;line-height:1.55;color:#c4b5c8;font-family:system-ui,sans-serif;">
                She speaks in first person. You choose what happens next.<br/>
                Soft nights, filthy ones — your call.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;font-family:system-ui,sans-serif;">
              <div style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px 18px;margin-bottom:20px;">
                <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#f9a8d4;">Your free echo includes</p>
                <ul style="margin:0;padding-left:18px;color:#e7e5e9;font-size:13px;line-height:1.7;">
                  <li>A few AI story scenes every day</li>
                  <li>The full preset library</li>
                  <li>Pre-made multi-look portraits (no image API on free)</li>
                  <li>Local saves, loadouts &amp; share codes</li>
                </ul>
              </div>
              <a href="${url}" style="display:block;text-align:center;background:linear-gradient(90deg,#db2777,#7c3aed);color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 20px;border-radius:999px;">
                Open EroticEcho
              </a>
              <p style="margin:18px 0 0;text-align:center;font-size:12px;color:#877a8a;line-height:1.5;">
                Want more scenes &amp; AI photos later?<br/>
                <a href="${url}/pricing" style="color:#f9a8d4;">See plans</a>
                · 18+ only · Private fantasy
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

export function upgradeEmailHtml(opts: {
  name: string;
  planLabel: string;
  appUrl: string;
  bullets: string[];
}): { subject: string; html: string; text: string } {
  const name = opts.name || "there";
  const url = opts.appUrl.replace(/\/$/, "");
  const subject = `You're on ${opts.planLabel} — doors unlocked`;
  const text = `Hi ${name},

You're now on ${opts.planLabel}.

${opts.bullets.map((b) => `• ${b}`).join("\n")}

Continue: ${url}/play
Account: ${url}/account

— EroticEcho`;

  const lis = opts.bullets
    .map(
      (b) =>
        `<li style="margin:0 0 6px;color:#e7e5e9;font-size:13px;">${escapeHtml(b)}</li>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#0d0a12;color:#f8f7fa;font-family:system-ui,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:28px;border-radius:20px;border:1px solid rgba(168,85,247,0.35);background:#140a18;">
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c4b5fd;">Unlocked</p>
    <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:26px;color:#f5f3ff;">Welcome to ${escapeHtml(opts.planLabel)}, ${escapeHtml(name)}.</h1>
    <ul style="padding-left:18px;margin:16px 0;">${lis}</ul>
    <a href="${url}/play" style="display:inline-block;margin-top:8px;padding:12px 20px;border-radius:999px;background:linear-gradient(90deg,#a855f7,#db2777);color:#fff;text-decoration:none;font-weight:600;font-size:14px;">Continue the heat</a>
  </div>
</body></html>`;

  return { subject, html, text };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
