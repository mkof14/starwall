import { NextResponse } from "next/server";
import { requireRole } from "@/lib/authz";
import { listUsers } from "@/lib/user-store";

export async function GET() {
  const ready = await requireRole("Super Admin");
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const users = await listUsers();
  return NextResponse.json({
    users: users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      pending: user.pending,
      lastSignInAt: user.lastSignInAt,
      organization: user.organization,
    })),
  });
}
