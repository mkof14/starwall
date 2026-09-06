import { NextResponse } from "next/server";
import { requireActor, requireRole, writeAudit } from "@/lib/authz";
import { runEquipmentCheck } from "@/lib/equipment-check";
import { prismaReady } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: { id?: unknown; reason?: unknown } = {};
  try {
    body = (await request.json()) as { id?: unknown; reason?: unknown };
  } catch {
    body = {};
  }

  const equipmentId = typeof body.id === "string" && body.id.trim() ? body.id.trim() : undefined;
  const diagnostic = Boolean(equipmentId) && body.reason !== "interval";

  const ready = diagnostic ? await requireRole("Admin") : await requireActor();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }

  const prisma = await prismaReady();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }

  const result = await runEquipmentCheck(prisma, { equipmentId });

  if (diagnostic) {
    const unit = result.equipment.find((item) => item.id === equipmentId);
    await writeAudit(
      ready.actor,
      "equipment_diagnostic",
      unit ? `Diagnostic run: ${unit.name} (${unit.status})` : `Diagnostic run: ${equipmentId}`,
    );
  }

  for (const item of result.changed) {
    await writeAudit(
      ready.actor,
      "equipment_warning",
      `${item.name} status → ${item.status}`,
    );
  }

  return NextResponse.json({
    ok: true,
    equipment: result.equipment,
    changed: result.changed,
  });
}
