import { promises as fs } from "fs";
import path from "path";
import { getDataDir } from "@/lib/auth/data-path";

/**
 * Send themed email via Resend if RESEND_API_KEY is set.
 * Otherwise writes to data/outbox/ (dev-friendly, no credits).
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ ok: boolean; mode: "resend" | "outbox" | "skipped"; error?: string }> {
  const to = opts.to.trim().toLowerCase();
  if (!to || !to.includes("@")) {
    return { ok: false, mode: "skipped", error: "Invalid to" };
  }

  // Don't try to mail the synthetic god address externally
  if (to.endsWith("@eroticecho.local")) {
    await writeOutbox(opts);
    return { ok: true, mode: "outbox" };
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.EMAIL_FROM?.trim() || "EroticEcho <onboarding@resend.dev>";

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: opts.subject,
          html: opts.html,
          text: opts.text,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        await writeOutbox(opts, err);
        return { ok: false, mode: "resend", error: err.slice(0, 200) };
      }
      return { ok: true, mode: "resend" };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "send failed";
      await writeOutbox(opts, msg);
      return { ok: false, mode: "resend", error: msg };
    }
  }

  await writeOutbox(opts);
  return { ok: true, mode: "outbox" };
}

async function writeOutbox(
  opts: { to: string; subject: string; html: string; text: string },
  note?: string
) {
  try {
    const dir = path.join(getDataDir(), "outbox");
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(
      dir,
      `${Date.now()}-${opts.to.replace(/[^a-z0-9@._-]/gi, "_")}.json`
    );
    await fs.writeFile(
      file,
      JSON.stringify(
        {
          ...opts,
          note,
          at: new Date().toISOString(),
        },
        null,
        2
      ),
      "utf8"
    );
    if (process.env.NODE_ENV !== "production") {
      console.info("[email outbox]", opts.to, opts.subject, file);
    }
  } catch {
    // Serverless may not allow disk writes — skip silently
  }
}
