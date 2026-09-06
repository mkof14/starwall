import { NextResponse } from "next/server";
import { requireRole, writeAudit } from "@/lib/authz";
import { defaultSignupRole, isUserRole } from "@/lib/rbac";
import { createUser } from "@/lib/user-store";

export async function POST(request: Request) {
  const ready = await requireRole("Super Admin");
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const role = isUserRole(body.role) ? body.role : defaultSignupRole();
  const result = await createUser({
    name: name || email.split("@")[0] || "Officer",
    email,
    password: "",
    role,
    pending: true,
  });

  if (!result.ok) {
    if (result.error === "exists") {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  await writeAudit(ready.actor, "user_invite", `Invited ${result.user.email} as ${result.user.role}`);

  // TODO: connect an email service to actually send the invitation (same as forgot-password).
  return NextResponse.json({
    ok: true,
    message: "Invitation created — connect an email service to actually send it",
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      pending: result.user.pending,
      lastSignInAt: result.user.lastSignInAt,
    },
  });
}
