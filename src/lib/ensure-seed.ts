import { readFileSync } from "fs";
import { join } from "path";
import type { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "@/lib/password";
import { EQUIPMENT_CATALOG } from "@/lib/equipment";
import { INTEGRATION_CATALOG } from "@/lib/integrations";
import { isUserRole, type UserRole } from "@/lib/rbac";

export const DEMO_ACCOUNTS: {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: UserRole;
  password: string;
}[] = [
  {
    id: "usr-super",
    email: "super@starwall.demo",
    name: "Super Admin",
    organization: "AGRON",
    role: "Super Admin",
    password: "SuperAdmin!23",
  },
  {
    id: "usr-admin",
    email: "admin@starwall.demo",
    name: "Admin",
    organization: "AGRON",
    role: "Admin",
    password: "AdminPass!23",
  },
  {
    id: "usr-operator",
    email: "operator@starwall.demo",
    name: "Operator",
    organization: "AGRON",
    role: "Operator",
    password: "Operator!23",
  },
  {
    id: "usr-viewer",
    email: "viewer@starwall.demo",
    name: "Viewer",
    organization: "AGRON",
    role: "Viewer",
    password: "ViewerPass!23",
  },
];

type JsonUser = {
  id?: string;
  email?: string;
  name?: string;
  organization?: string;
  passwordHash?: string;
};

function readLegacyUsers(): JsonUser[] {
  const paths = [
    join(process.cwd(), "data", "users.json"),
    join("/tmp", "starwall-users.json"),
  ];
  for (const path of paths) {
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
      if (Array.isArray(parsed)) return parsed as JsonUser[];
    } catch {
      // try the next path
    }
  }
  return [];
}

export function ownerAccount() {
  const email = (
    process.env.STARWALL_OWNER_EMAIL?.trim() || "dnainform@gmail.com"
  ).toLowerCase();
  const password = process.env.STARWALL_OWNER_PASSWORD?.trim() || "Mkof1@3@5";
  return {
    id: "usr-owner",
    email,
    name: "DNA Inform",
    organization: "AGRON",
    role: "Super Admin" as const,
    password,
  };
}

async function ensureOwnerAccount(prisma: PrismaClient) {
  const account = ownerAccount();
  const existing = await prisma.user.findUnique({ where: { email: account.email } });
  const passwordOk = Boolean(
    existing?.passwordHash && verifyPassword(account.password, existing.passwordHash),
  );
  if (existing && existing.role === account.role && passwordOk && !existing.pending) {
    return;
  }
  const data = {
    name: existing?.name || account.name,
    organization: existing?.organization || account.organization,
    role: account.role,
    passwordHash: passwordOk && existing?.passwordHash
      ? existing.passwordHash
      : hashPassword(account.password),
    pending: false,
  };
  if (existing) {
    await prisma.user.update({ where: { email: account.email }, data });
    return;
  }
  await prisma.user.create({
    data: {
      id: account.id,
      email: account.email,
      ...data,
    },
  });
}

export async function ensureBackendSeed(prisma: PrismaClient) {
  await ensureOwnerAccount(prisma);

  for (const account of DEMO_ACCOUNTS) {
    const existing = await prisma.user.findUnique({ where: { email: account.email } });
    if (existing) {
      if (existing.role !== account.role || !existing.passwordHash) {
        await prisma.user.update({
          where: { email: account.email },
          data: {
            role: account.role,
            passwordHash: existing.passwordHash || hashPassword(account.password),
            pending: false,
          },
        });
      }
      continue;
    }
    await prisma.user.create({
      data: {
        id: account.id,
        email: account.email,
        name: account.name,
        organization: account.organization,
        role: account.role,
        passwordHash: hashPassword(account.password),
        pending: false,
      },
    });
  }

  for (const legacy of readLegacyUsers()) {
    const email = legacy.email?.trim().toLowerCase() ?? "";
    if (!email || !legacy.passwordHash) continue;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) continue;
    await prisma.user.create({
      data: {
        id: legacy.id?.trim() || `usr-legacy-${email}`,
        email,
        name: legacy.name?.trim() || email.split("@")[0] || "Officer",
        organization: legacy.organization?.trim() || "",
        passwordHash: legacy.passwordHash,
        role: "Operator",
        pending: false,
      },
    });
  }

  for (const item of EQUIPMENT_CATALOG) {
    await prisma.equipment.upsert({
      where: { id: item.id },
      update: { name: item.name, category: item.category },
      create: {
        id: item.id,
        name: item.name,
        category: item.category,
        status: "ok",
      },
    });
  }

  for (const item of INTEGRATION_CATALOG) {
    await prisma.integration.upsert({
      where: { id: item.id },
      update: { name: item.name, vendor: item.vendor },
      create: {
        id: item.id,
        name: item.name,
        vendor: item.vendor,
        lastPingAt: new Date(),
      },
    });
  }

  const routeCount = await prisma.notificationRoute.count();
  if (routeCount === 0) {
    const defaults: { riskLevel: string; method: string; enabled: boolean }[] = [
      { riskLevel: "attention", method: "email", enabled: true },
      { riskLevel: "elevated", method: "email", enabled: true },
      { riskLevel: "elevated", method: "sms", enabled: true },
      { riskLevel: "critical", method: "email", enabled: true },
      { riskLevel: "critical", method: "sms", enabled: true },
      { riskLevel: "critical", method: "call", enabled: true },
      { riskLevel: "critical", method: "messenger", enabled: true },
    ];
    await prisma.notificationRoute.createMany({
      data: defaults.map((row, index) => ({
        id: `route-${row.riskLevel}-${row.method}-${index}`,
        riskLevel: row.riskLevel,
        method: row.method,
        contact: "",
        enabled: row.enabled,
      })),
    });
  }
}

export function parseStoredRole(value: string | null | undefined): UserRole {
  return isUserRole(value) ? value : "Operator";
}
