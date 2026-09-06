import { PrismaClient } from "@prisma/client";
import { ensureBackendSeed } from "@/lib/ensure-seed";

const SQLITE_FALLBACK = "file:./dev.db";

function resolveDatabaseUrl() {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;
  process.env.DATABASE_URL = SQLITE_FALLBACK;
  return SQLITE_FALLBACK;
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  starwallSeed?: Promise<void>;
};

export function databaseConfigured() {
  return Boolean(resolveDatabaseUrl());
}

export function getPrisma() {
  if (!databaseConfigured()) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

export async function prismaReady() {
  const prisma = getPrisma();
  if (!prisma) return null;
  if (!globalForPrisma.starwallSeed) {
    globalForPrisma.starwallSeed = ensureBackendSeed(prisma).catch((error) => {
      globalForPrisma.starwallSeed = undefined;
      throw error;
    });
  }
  try {
    await globalForPrisma.starwallSeed;
  } catch {
    return prisma;
  }
  return prisma;
}
