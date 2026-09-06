import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";

// TODO: replace with a real database (e.g. Postgres via Prisma) before production use.

export type StoredUser = {
  id: string;
  name: string;
  organization: string;
  email: string;
  passwordHash: string;
};

function storePath() {
  if (process.env.VERCEL) {
    return join("/tmp", "starwall-users.json");
  }
  return join(process.cwd(), "data", "users.json");
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

function readUsers(): StoredUser[] {
  try {
    const raw = readFileSync(storePath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  const path = storePath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

export function listUsers() {
  return readUsers();
}

export function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return readUsers().find((user) => user.email === normalized) ?? null;
}

export function createUser(input: {
  name: string;
  organization?: string;
  email: string;
  password: string;
}) {
  const email = input.email.trim().toLowerCase();
  if (findUserByEmail(email)) {
    return { ok: false as const, error: "exists" };
  }
  const user: StoredUser = {
    id: `usr-${Date.now()}-${randomBytes(3).toString("hex")}`,
    name: input.name.trim(),
    organization: (input.organization ?? "").trim(),
    email,
    passwordHash: hashPassword(input.password),
  };
  writeUsers([...readUsers(), user]);
  return { ok: true as const, user };
}

export function authenticateUser(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return user;
}
