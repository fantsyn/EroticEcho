import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SCRYPT_KEYLEN = 64;

export function newSalt(): string {
  return randomBytes(16).toString("hex");
}

export function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
}

export function verifyPassword(
  password: string,
  salt: string,
  expectedHex: string
): boolean {
  try {
    const got = scryptSync(password, salt, SCRYPT_KEYLEN);
    const exp = Buffer.from(expectedHex, "hex");
    if (got.length !== exp.length) return false;
    return timingSafeEqual(got, exp);
  } catch {
    return false;
  }
}

export function sessionSecret(): string {
  const s = process.env.SESSION_SECRET?.trim();
  if (s && s.length >= 16) return s;
  // Dev fallback — always set SESSION_SECRET in production
  return "dev-only-eroticecho-session-secret-change-me";
}

export function signPayload(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", sessionSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

export function verifySigned<T extends object>(token: string): T | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expect = createHmac("sha256", sessionSecret())
    .update(body)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expect);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function newId(): string {
  return createHash("sha256")
    .update(randomBytes(24))
    .digest("hex")
    .slice(0, 24);
}

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
