import { NextResponse } from "next/server";
import { requireRole, writeAudit } from "@/lib/authz";
import { isUserRole } from "@/lib/rbac";
import { findUserById, setUserRole } from "@/lib/user-store";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const ready = await requireRole("Super Admin");
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }

  if (params.id === ready.actor.userId) {
    return NextResponse.json({ error: "cannot_change_self" }, { status: 400 });
  }

  let body: { role?: unknown } = {};
  try {
    body = (await request.json()) as { role?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (!isUserRole(body.role)) {
    return NextResponse.json({ error: "invalid_role" }, { status: 400 });
  }

  const previous = await findUserById(params.id);
  if (!previous) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const updated = await setUserRole(params.id, body.role);
  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await writeAudit(
    ready.actor,
    "role_change",
    `${updated.email}: ${previous.role} → ${updated.role}`,
  );
  return NextResponse.json({
    ok: true,
    user: {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      pending: updated.pending,
      lastSignInAt: updated.lastSignInAt,
    },
  });
}
