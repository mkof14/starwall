import { NextResponse } from "next/server";
import { requireActor, writeAudit } from "@/lib/authz";
import { prismaReady } from "@/lib/prisma";

export async function GET() {
  const ready = await requireActor();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const prisma = await prismaReady();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
  const rows = await prisma.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 200,
    include: { user: { select: { name: true, email: true, role: true } } },
  });
  return NextResponse.json({
    entries: rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      action: row.action,
      details: row.details,
      timestamp: row.timestamp.toISOString(),
      userName: row.user.name,
      userEmail: row.user.email,
      userRole: row.user.role,
    })),
  });
}

export async function POST(request: Request) {
  const ready = await requireActor();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }

  let body: { action?: unknown; details?: unknown } = {};
  try {
    body = (await request.json()) as { action?: unknown; details?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const action = typeof body.action === "string" ? body.action.trim() : "";
  const details = typeof body.details === "string" ? body.details.trim() : "";
  if (!action || !details) {
    return NextResponse.json({ error: "invalid_audit" }, { status: 400 });
  }

  const allowed = new Set(["mode_switch"]);
  if (!allowed.has(action)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const entry = await writeAudit(ready.actor, action, details);
  return NextResponse.json({ ok: true, id: entry?.id ?? null });
}
