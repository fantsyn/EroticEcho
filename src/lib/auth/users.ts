import { promises as fs } from "fs";
import path from "path";
import { hashPassword, newId, newSalt, todayKey, verifyPassword } from "./crypto";
import type { PlanId, PublicUser, UserRecord } from "./types";
import { getPlan } from "./plans";
import { getDataDir, isServerlessRuntime } from "./data-path";

/** Stable id so god sessions survive cold starts without a shared DB */
export const GOD_USER_ID = "god-owner";

type Store = { users: UserRecord[] };

/** Process-local fallback when disk is unavailable (Vercel /tmp full, etc.) */
const g = globalThis as unknown as {
  __eeUserStore?: Store;
  __eeFsWritable?: boolean | null;
};

function memoryStore(): Store {
  if (!g.__eeUserStore) g.__eeUserStore = { users: [] };
  return g.__eeUserStore;
}

function usersFile(): string {
  return path.join(getDataDir(), "users.json");
}

function isFsError(e: unknown): boolean {
  const code = (e as NodeJS.ErrnoException)?.code;
  return (
    code === "EROFS" ||
    code === "EACCES" ||
    code === "EPERM" ||
    code === "ENOENT" ||
    code === "ENOTSUP" ||
    code === "EROFS"
  );
}

async function canWriteFs(): Promise<boolean> {
  if (g.__eeFsWritable === true) return true;
  if (g.__eeFsWritable === false) return false;
  try {
    const dir = getDataDir();
    await fs.mkdir(dir, { recursive: true });
    const probe = path.join(dir, ".write-probe");
    await fs.writeFile(probe, "ok", "utf8");
    await fs.unlink(probe).catch(() => undefined);
    g.__eeFsWritable = true;
    return true;
  } catch {
    g.__eeFsWritable = false;
    return false;
  }
}

async function ensureStore(): Promise<Store> {
  const writable = await canWriteFs();
  if (!writable) {
    return memoryStore();
  }
  try {
    const raw = await fs.readFile(usersFile(), "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!Array.isArray(parsed.users)) {
      const empty: Store = { users: [] };
      memoryStore().users = empty.users;
      return empty;
    }
    // Keep memory mirror for fast path / partial FS failures
    memoryStore().users = parsed.users;
    return parsed;
  } catch {
    // Seed from memory if we already have users there
    const mem = memoryStore();
    if (mem.users.length) return { users: [...mem.users] };
    const empty: Store = { users: [] };
    try {
      await writeStore(empty);
    } catch {
      /* memory only */
    }
    return empty;
  }
}

async function writeStore(store: Store): Promise<void> {
  // Always update memory so god / register work even if disk fails
  memoryStore().users = store.users;

  if (g.__eeFsWritable === false) return;

  try {
    const dir = getDataDir();
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(usersFile(), JSON.stringify(store, null, 2), "utf8");
    g.__eeFsWritable = true;
  } catch (e) {
    g.__eeFsWritable = false;
    if (!isServerlessRuntime() && !isFsError(e)) {
      // Local unexpected errors — surface
      throw e;
    }
    // Serverless / read-only: silent memory fallback
  }
}

function resetUsageIfNeeded(u: UserRecord): UserRecord {
  const today = todayKey();
  if (u.usageDate === today) return u;
  return {
    ...u,
    usageDate: today,
    storyUses: 0,
    imageUses: 0,
    avatarUses: 0,
  };
}

export function toPublic(u: UserRecord): PublicUser {
  const user = resetUsageIfNeeded(u);
  const plan = getPlan(user.plan);
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    isGod: user.plan === "god",
    usage: {
      storyUses: user.storyUses,
      imageUses: user.imageUses,
      avatarUses: user.avatarUses,
      storyLimit: plan.storyPerDay,
      imageLimit: plan.imagePerDay,
      avatarLimit: plan.avatarPerDay,
      resetsAt: tomorrow.toISOString(),
    },
    features: plan,
  };
}

function godEmail(): string {
  return `${(process.env.GOD_USER || "god").trim().toLowerCase()}@eroticecho.local`;
}

function godPassword(): string {
  return process.env.GOD_PASSWORD?.trim() || "change-me-immediately-please";
}

/** Pure god record — no disk required */
export function buildGodUser(): UserRecord {
  const salt = "god-stable-salt";
  const pass = godPassword();
  const now = new Date().toISOString();
  return {
    id: GOD_USER_ID,
    email: godEmail(),
    name: "God",
    passwordHash: hashPassword(pass, salt),
    salt,
    plan: "god",
    createdAt: now,
    updatedAt: now,
    usageDate: todayKey(),
    storyUses: 0,
    imageUses: 0,
    avatarUses: 0,
  };
}

function isGodEmail(email: string): boolean {
  const godUser = (process.env.GOD_USER || "god").trim().toLowerCase();
  const e = email.trim().toLowerCase();
  return e === godUser || e === `${godUser}@eroticecho.local` || e === godEmail();
}

export async function findByEmail(email: string): Promise<UserRecord | null> {
  const e = email.trim().toLowerCase();
  if (isGodEmail(e)) {
    return ensureGodUser();
  }
  const store = await ensureStore();
  const u = store.users.find((x) => x.email === e);
  return u ? resetUsageIfNeeded(u) : null;
}

export async function findById(id: string): Promise<UserRecord | null> {
  if (id === GOD_USER_ID) {
    return ensureGodUser();
  }
  const store = await ensureStore();
  const u = store.users.find((x) => x.id === id);
  if (u) return resetUsageIfNeeded(u);
  // Session might have been issued for god under an older random id while still god plan
  // handled only via GOD_USER_ID after this fix
  return null;
}

export async function createUser(opts: {
  email: string;
  password: string;
  name?: string;
  plan?: PlanId;
}): Promise<UserRecord> {
  const email = opts.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email");
  }
  if (opts.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  if (isGodEmail(email)) {
    throw new Error("This email is reserved");
  }
  const existing = await findByEmail(email);
  if (existing) throw new Error("Email already registered");

  const salt = newSalt();
  const now = new Date().toISOString();
  const user: UserRecord = {
    id: newId(),
    email,
    name: (opts.name || email.split("@")[0]).slice(0, 40),
    passwordHash: hashPassword(opts.password, salt),
    salt,
    plan: opts.plan || "free",
    createdAt: now,
    updatedAt: now,
    usageDate: todayKey(),
    storyUses: 0,
    imageUses: 0,
    avatarUses: 0,
  };

  const store = await ensureStore();
  store.users.push(user);
  await writeStore(store);
  return user;
}

export async function authenticate(
  email: string,
  password: string
): Promise<UserRecord | null> {
  const emailNorm = email.trim().toLowerCase();
  const godPass = process.env.GOD_PASSWORD?.trim();

  // God account from env — never requires a writable filesystem
  if (godPass && isGodEmail(emailNorm)) {
    if (password === godPass) {
      return ensureGodUser();
    }
    return null;
  }

  // Also accept god login if GOD_PASSWORD unset but matches default (dev only)
  if (!godPass && isGodEmail(emailNorm)) {
    if (password === godPassword()) {
      return ensureGodUser();
    }
    return null;
  }

  const u = await findByEmail(emailNorm);
  if (!u || u.banned) return null;
  if (u.id === GOD_USER_ID) {
    // Password already checked above when env set
    if (password === godPassword()) return ensureGodUser();
    return null;
  }
  if (!verifyPassword(password, u.salt, u.passwordHash)) return null;
  return resetUsageIfNeeded(u);
}

/**
 * Ensure god owner account is available.
 * On Vercel this is in-memory (+ /tmp when writable) — no project-dir writes.
 */
export async function ensureGodUser(): Promise<UserRecord> {
  const god = buildGodUser();
  try {
    const store = await ensureStore();
    // Drop legacy god rows with random ids so sessions stay on GOD_USER_ID
    store.users = store.users.filter(
      (u) => u.id !== GOD_USER_ID && !isGodEmail(u.email)
    );
    store.users.push(god);
    await writeStore(store);
  } catch {
    const mem = memoryStore();
    mem.users = mem.users.filter(
      (u) => u.id !== GOD_USER_ID && !isGodEmail(u.email)
    );
    mem.users.push(god);
  }
  return god;
}

export async function setPassword(
  userId: string,
  newPassword: string
): Promise<UserRecord | null> {
  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters");
  if (userId === GOD_USER_ID) {
    throw new Error("Change GOD_PASSWORD env var for the owner account");
  }
  const store = await ensureStore();
  const i = store.users.findIndex((u) => u.id === userId);
  if (i < 0) return null;
  const salt = newSalt();
  store.users[i] = {
    ...store.users[i],
    salt,
    passwordHash: hashPassword(newPassword, salt),
    updatedAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store.users[i];
}

export async function updateUser(
  id: string,
  patch: Partial<
    Pick<
      UserRecord,
      | "name"
      | "plan"
      | "storyUses"
      | "imageUses"
      | "avatarUses"
      | "usageDate"
      | "stripeCustomerId"
      | "banned"
    >
  >
): Promise<UserRecord | null> {
  if (id === GOD_USER_ID) {
    const god = buildGodUser();
    // God plan/usage not persisted; return patched view for response only
    return {
      ...god,
      ...patch,
      plan: "god",
      id: GOD_USER_ID,
      updatedAt: new Date().toISOString(),
    };
  }
  const store = await ensureStore();
  const i = store.users.findIndex((u) => u.id === id);
  if (i < 0) return null;
  store.users[i] = {
    ...resetUsageIfNeeded(store.users[i]),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store.users[i];
}

export async function consumeUsage(
  userId: string,
  kind: "story" | "image" | "avatar"
): Promise<{ ok: true; user: UserRecord } | { ok: false; error: string; user: UserRecord }> {
  let user = await findById(userId);
  if (!user) return { ok: false, error: "Not signed in", user: null as never };
  user = resetUsageIfNeeded(user);
  const plan = getPlan(user.plan);

  if (plan.canBypassLimits || user.plan === "god" || userId === GOD_USER_ID) {
    return { ok: true, user };
  }

  const limit =
    kind === "story"
      ? plan.storyPerDay
      : kind === "image"
        ? plan.imagePerDay
        : plan.avatarPerDay;
  const used =
    kind === "story"
      ? user.storyUses
      : kind === "image"
        ? user.imageUses
        : user.avatarUses;

  if (limit !== null && used >= limit) {
    return {
      ok: false,
      error: `Daily ${kind} limit reached (${limit}). Upgrade for more.`,
      user,
    };
  }

  const patch: Partial<UserRecord> = { usageDate: todayKey() };
  if (kind === "story") patch.storyUses = used + 1;
  if (kind === "image") patch.imageUses = used + 1;
  if (kind === "avatar") patch.avatarUses = used + 1;

  const next = await updateUser(userId, patch);
  return { ok: true, user: next! };
}

export async function listUsers(): Promise<UserRecord[]> {
  const store = await ensureStore();
  const users = store.users.map(resetUsageIfNeeded);
  // Always surface god in admin lists
  if (!users.some((u) => u.id === GOD_USER_ID)) {
    users.unshift(buildGodUser());
  }
  return users;
}

export async function setPlanByEmail(
  email: string,
  plan: PlanId
): Promise<UserRecord | null> {
  if (isGodEmail(email)) {
    return ensureGodUser();
  }
  const u = await findByEmail(email);
  if (!u) return null;
  return updateUser(u.id, { plan });
}
