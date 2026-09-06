import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prismaReady } from "@/lib/prisma";
import {
  hasMinRole,
  isUserRole,
  type UserRole,
} from "@/lib/rbac";
import { findUserByEmail } from "@/lib/user-store";

export type AuthActor = {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
};

export function denyUnlessSignedIn(
  session: { user?: { email?: string | null } | null } | null | undefined,
): { ok: true; email: string } | { ok: false; status: 401; error: "signed_out" } {
  const email = session?.user?.email?.trim().toLowerCase() ?? "";
  if (!email || !session?.user) {
    return { ok: false, status: 401, error: "signed_out" };
  }
  return { ok: true, email };
}

export async function requireActor(): Promise<
  | { ok: true; actor: AuthActor }
  | { ok: false; status: number; error: string }
> {
  const auth = await getServerSession(authOptions);
  const signedIn = denyUnlessSignedIn(auth);
  if (!signedIn.ok) return signedIn;
  const user = auth!.user!;
  const email = signedIn.email;
  const stored = await findUserByEmail(email);
  const role = stored?.role ?? (isUserRole(user.role) ? user.role : "Operator");
  const userId = stored?.id || user.id || email;
  const name = stored?.name || user.name?.trim() || email.split("@")[0] || "Officer";
  return {
    ok: true,
    actor: { userId, email, name, role },
  };
}

export async function requireRole(minimum: UserRole): Promise<
  | { ok: true; actor: AuthActor }
  | { ok: false; status: number; error: string }
> {
  const ready = await requireActor();
  if (!ready.ok) return ready;
  if (!hasMinRole(ready.actor.role, minimum)) {
    return { ok: false, status: 403, error: "forbidden" };
  }
  return ready;
}

export async function writeAudit(actor: AuthActor, action: string, details: string) {
  const prisma = await prismaReady();
  if (!prisma) return null;
  return prisma.auditLog.create({
    data: {
      userId: actor.userId,
      action,
      details,
    },
  });
}
