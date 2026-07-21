import { promises as fs } from "fs";
import path from "path";
import { hashPassword, newId, newSalt, todayKey, verifyPassword } from "./crypto";
import type { PlanId, PublicUser, UserRecord } from "./types";
import { getPlan } from "./plans";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

type Store = { users: UserRecord[] };

async function ensureStore(): Promise<Store> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!Array.isArray(parsed.users)) return { users: [] };
    return parsed;
  } catch {
    const empty: Store = { users: [] };
    await fs.writeFile(USERS_FILE, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
}

async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(store, null, 2), "utf8");
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

export async function findByEmail(email: string): Promise<UserRecord | null> {
  const store = await ensureStore();
  const e = email.trim().toLowerCase();
  const u = store.users.find((x) => x.email === e);
  return u ? resetUsageIfNeeded(u) : null;
}

export async function findById(id: string): Promise<UserRecord | null> {
  const store = await ensureStore();
  const u = store.users.find((x) => x.id === id);
  return u ? resetUsageIfNeeded(u) : null;
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
  // God account from env — always available
  const godUser = (process.env.GOD_USER || "god").trim().toLowerCase();
  const godPass = process.env.GOD_PASSWORD?.trim();
  const emailNorm = email.trim().toLowerCase();
  if (
    godPass &&
    (emailNorm === godUser || emailNorm === `${godUser}@eroticecho.local`)
  ) {
    if (password === godPass) {
      return ensureGodUser();
    }
    return null;
  }

  const u = await findByEmail(emailNorm);
  if (!u || u.banned) return null;
  if (!verifyPassword(password, u.salt, u.passwordHash)) return null;
  return resetUsageIfNeeded(u);
}

/** Ensure god owner account exists; sync password from env */
export async function ensureGodUser(): Promise<UserRecord> {
  const godEmail = `${(process.env.GOD_USER || "god").trim().toLowerCase()}@eroticecho.local`;
  const godPass =
    process.env.GOD_PASSWORD?.trim() || "change-me-immediately-please";
  const existing = await findByEmail(godEmail);
  if (existing) {
    const salt = newSalt();
    const store = await ensureStore();
    const i = store.users.findIndex((u) => u.id === existing.id);
    store.users[i] = {
      ...resetUsageIfNeeded(store.users[i]),
      plan: "god",
      name: "God",
      passwordHash: hashPassword(godPass, salt),
      salt,
      updatedAt: new Date().toISOString(),
    };
    await writeStore(store);
    return store.users[i];
  }
  return createUser({
    email: godEmail,
    password: godPass,
    name: "God",
    plan: "god",
  });
}

export async function setPassword(
  userId: string,
  newPassword: string
): Promise<UserRecord | null> {
  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters");
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

  if (plan.canBypassLimits || user.plan === "god") {
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
  return store.users.map(resetUsageIfNeeded);
}

export async function setPlanByEmail(
  email: string,
  plan: PlanId
): Promise<UserRecord | null> {
  const u = await findByEmail(email);
  if (!u) return null;
  return updateUser(u.id, { plan });
}
