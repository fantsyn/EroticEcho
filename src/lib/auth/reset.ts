import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { findByEmail, setPassword } from "./users";
import { getDataDir } from "./data-path";

function resetFile(): string {
  return path.join(getDataDir(), "password-resets.json");
}

type ResetRow = {
  email: string;
  token: string;
  exp: number;
};

async function load(): Promise<ResetRow[]> {
  try {
    const raw = await fs.readFile(resetFile(), "utf8");
    return JSON.parse(raw) as ResetRow[];
  } catch {
    return [];
  }
}

async function save(rows: ResetRow[]) {
  try {
    const file = resetFile();
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(rows, null, 2), "utf8");
  } catch {
    // Serverless read-only /tmp full — tokens stay request-local only
  }
}

/** Create a reset token (valid 1 hour). Returns token for email or admin display. */
export async function createResetToken(
  email: string
): Promise<{ token: string } | { error: string }> {
  const user = await findByEmail(email);
  if (!user) {
    // Don't reveal whether email exists
    return { token: randomBytes(16).toString("hex") };
  }
  const token = randomBytes(24).toString("hex");
  const rows = (await load()).filter(
    (r) => r.email !== user.email && r.exp > Date.now()
  );
  rows.push({
    email: user.email,
    token,
    exp: Date.now() + 60 * 60 * 1000,
  });
  await save(rows);
  return { token };
}

export async function consumeResetToken(
  token: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const rows = await load();
  const hit = rows.find((r) => r.token === token && r.exp > Date.now());
  if (!hit) return { ok: false, error: "Invalid or expired token" };
  const user = await findByEmail(hit.email);
  if (!user) return { ok: false, error: "User not found" };
  try {
    await setPassword(user.id, newPassword);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not set password",
    };
  }
  await save(rows.filter((r) => r.token !== token));
  return { ok: true };
}
