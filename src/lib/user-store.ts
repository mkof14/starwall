import { randomBytes } from "crypto";
import { parseStoredRole } from "@/lib/ensure-seed";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prismaReady } from "@/lib/prisma";
import { defaultSignupRole, isUserRole, type UserRole } from "@/lib/rbac";

export type StoredUser = {
  id: string;
  name: string;
  organization: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  pending: boolean;
  lastSignInAt: string | null;
};

function newUserId() {
  return `usr-${Date.now()}-${randomBytes(3).toString("hex")}`;
}

function toStored(user: {
  id: string;
  name: string;
  organization: string;
  email: string;
  passwordHash: string;
  role: string;
  pending: boolean;
  lastSignInAt: Date | null;
}): StoredUser {
  return {
    id: user.id,
    name: user.name,
    organization: user.organization,
    email: user.email,
    passwordHash: user.passwordHash,
    role: parseStoredRole(user.role),
    pending: user.pending,
    lastSignInAt: user.lastSignInAt ? user.lastSignInAt.toISOString() : null,
  };
}

export async function listUsers() {
  const prisma = await prismaReady();
  if (!prisma) return [];
  const rows = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toStored);
}

export async function findUserByEmail(email: string) {
  const prisma = await prismaReady();
  if (!prisma) return null;
  const row = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  return row ? toStored(row) : null;
}

export async function findUserById(id: string) {
  const prisma = await prismaReady();
  if (!prisma) return null;
  const row = await prisma.user.findUnique({ where: { id } });
  return row ? toStored(row) : null;
}

export async function createUser(input: {
  name: string;
  organization?: string;
  email: string;
  password: string;
  role?: UserRole;
  pending?: boolean;
}) {
  const prisma = await prismaReady();
  if (!prisma) return { ok: false as const, error: "unavailable" };
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false as const, error: "exists" };
  }
  const user = await prisma.user.create({
    data: {
      id: newUserId(),
      name: input.name.trim(),
      organization: (input.organization ?? "").trim(),
      email,
      passwordHash: input.password ? hashPassword(input.password) : "",
      role: input.role ?? defaultSignupRole(),
      pending: Boolean(input.pending),
    },
  });
  return { ok: true as const, user: toStored(user) };
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user || user.pending || !user.passwordHash) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export async function markSignIn(userId: string) {
  const prisma = await prismaReady();
  if (!prisma) return;
  await prisma.user.update({
    where: { id: userId },
    data: { lastSignInAt: new Date(), pending: false },
  });
}

export async function setUserRole(userId: string, role: UserRole) {
  if (!isUserRole(role)) return null;
  const prisma = await prismaReady();
  if (!prisma) return null;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  return toStored(user);
}

export async function upsertGoogleUser(input: {
  id?: string;
  email: string;
  name?: string | null;
}) {
  const prisma = await prismaReady();
  if (!prisma) return null;
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() || email.split("@")[0] || "Officer";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: { name, lastSignInAt: new Date(), pending: false },
    });
    return toStored(updated);
  }
  const created = await prisma.user.create({
    data: {
      id: input.id?.trim() || newUserId(),
      email,
      name,
      role: defaultSignupRole(),
      lastSignInAt: new Date(),
      pending: false,
    },
  });
  return toStored(created);
}
