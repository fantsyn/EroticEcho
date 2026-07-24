/**
 * Optional durable key-value via Upstash Redis REST (Vercel-friendly).
 * Set:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 * If missing, callers fall back to /tmp or memory.
 */

function creds(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

export function hasRemoteKv(): boolean {
  return !!creds();
}

async function cmd<T = unknown>(
  ...parts: (string | number)[]
): Promise<T | null> {
  const c = creds();
  if (!c) return null;
  try {
    const res = await fetch(`${c.url}/${parts.map(encodeURIComponent).join("/")}`, {
      headers: { Authorization: `Bearer ${c.token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: T };
    return (data.result ?? null) as T | null;
  } catch {
    return null;
  }
}

/** POST pipeline for multi-arg SET with long values */
async function postCmd(body: unknown[]): Promise<unknown> {
  const c = creds();
  if (!c) return null;
  try {
    const res = await fetch(c.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${c.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown };
    return data.result ?? null;
  } catch {
    return null;
  }
}

export async function kvGet(key: string): Promise<string | null> {
  const r = await cmd<string | null>("GET", key);
  return r == null ? null : String(r);
}

export async function kvSet(key: string, value: string): Promise<boolean> {
  // Use POST body so large JSON (stories) is safe
  const r = await postCmd(["SET", key, value]);
  return r === "OK" || r === true;
}

export async function kvDel(key: string): Promise<boolean> {
  const r = await cmd("DEL", key);
  return typeof r === "number" ? r > 0 : !!r;
}

export async function kvKeys(pattern: string): Promise<string[]> {
  const r = await cmd<string[]>("KEYS", pattern);
  return Array.isArray(r) ? r.map(String) : [];
}
