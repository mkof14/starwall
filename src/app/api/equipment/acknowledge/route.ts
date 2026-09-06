import { NextResponse } from "next/server";
import { requireRole, writeAudit } from "@/lib/authz";
import { serializeEquipment } from "@/lib/equipment-check";
import { prismaReady } from "@/lib/prisma";

export async function POST(request: Request) {
  const ready = await requireRole("Admin");
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }

  let body: { id?: unknown } = {};
  try {
    body = (await request.json()) as { id?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const prisma = await prismaReady();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }

  const existing = await prisma.equipment.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const updated = await prisma.equipment.update({
    where: { id },
    data: { status: "ok", lastCheckAt: new Date() },
  });
  await writeAudit(ready.actor, "equipment_acknowledge", `Acknowledged: ${updated.name}`);
  return NextResponse.json({ ok: true, equipment: serializeEquipment(updated) });
}
