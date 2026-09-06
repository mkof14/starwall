import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { databaseConfigured, getPrisma } from "@/lib/prisma";

export type CloudUser = {
  userId: string;
  email: string;
  name: string;
};

export type CloudActor = CloudUser & {
  sessionId: string;
};

function cleanId(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export async function requireCloudUser(): Promise<
  | { ok: true; user: CloudUser }
  | { ok: false; status: number; error: string }
> {
  if (!databaseConfigured()) {
    return { ok: false, status: 503, error: "cloud_unavailable" };
  }
  const prisma = getPrisma();
  if (!prisma) {
    return { ok: false, status: 503, error: "cloud_unavailable" };
  }
  const auth = await getServerSession(authOptions);
  const email = auth?.user?.email?.trim().toLowerCase() ?? "";
  const name = auth?.user?.name?.trim() || email.split("@")[0] || "Officer";
  const userId = cleanId(auth?.user?.id) || email;
  if (!email || !userId) {
    return { ok: false, status: 401, error: "signed_out" };
  }

  try {
    await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { id: userId, email, name },
    });
    const existing = await prisma.user.findUnique({ where: { email } });
    return {
      ok: true,
      user: {
        userId: existing?.id ?? userId,
        email,
        name,
      },
    };
  } catch {
    return { ok: false, status: 503, error: "cloud_unavailable" };
  }
}

export async function requireCloudActor(sessionId: string): Promise<
  | { ok: true; actor: CloudActor }
  | { ok: false; status: number; error: string }
> {
  const ready = await requireCloudUser();
  if (!ready.ok) return ready;
  const watchId = cleanId(sessionId);
  if (!watchId) {
    return { ok: false, status: 400, error: "missing_session" };
  }
  return {
    ok: true,
    actor: { ...ready.user, sessionId: watchId },
  };
}

export async function ensureWatchSession(actor: CloudActor, vesselName: string) {
  const prisma = getPrisma();
  if (!prisma) return null;
  return prisma.session.upsert({
    where: { id: actor.sessionId },
    update: { vesselName },
    create: {
      id: actor.sessionId,
      userId: actor.userId,
      vesselName,
    },
  });
}
