import type { PrismaClient } from "@prisma/client";
import type { EquipmentStatus } from "@/lib/equipment";
import { isEquipmentStatus } from "@/lib/equipment";

export type EquipmentRow = {
  id: string;
  name: string;
  category: string;
  lastCheckAt: string | null;
  status: EquipmentStatus;
  addedAt: string;
};

export function serializeEquipment(row: {
  id: string;
  name: string;
  category: string;
  lastCheckAt: Date | null;
  status: string;
  addedAt: Date;
}): EquipmentRow {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    lastCheckAt: row.lastCheckAt ? row.lastCheckAt.toISOString() : null,
    status: isEquipmentStatus(row.status) ? row.status : "ok",
    addedAt: row.addedAt.toISOString(),
  };
}

function pickWarningTarget<T extends { id: string; status: string }>(rows: T[]) {
  const healthy = rows.filter((row) => row.status === "ok");
  if (healthy.length === 0) return null;
  return healthy[Math.floor(Math.random() * healthy.length)] ?? null;
}

export async function runEquipmentCheck(
  prisma: PrismaClient,
  options: { equipmentId?: string } = {},
) {
  // TODO: replace random status with real hardware ping/heartbeat once physical equipment is connected.
  const now = new Date();
  const where = options.equipmentId ? { id: options.equipmentId } : undefined;
  const rows = await prisma.equipment.findMany({ where, orderBy: { addedAt: "asc" } });
  if (rows.length === 0) {
    return { equipment: [] as EquipmentRow[], changed: [] as EquipmentRow[] };
  }

  await prisma.equipment.updateMany({
    where: options.equipmentId ? { id: options.equipmentId } : undefined,
    data: { lastCheckAt: now },
  });

  const changed: EquipmentRow[] = [];
  if (Math.random() < 0.05) {
    const target = options.equipmentId
      ? rows.find((row) => row.id === options.equipmentId && row.status === "ok")
      : pickWarningTarget(rows);
    if (target) {
      const updated = await prisma.equipment.update({
        where: { id: target.id },
        data: { status: "warning", lastCheckAt: now },
      });
      changed.push(serializeEquipment(updated));
    }
  }

  const equipment = (await prisma.equipment.findMany({ orderBy: { addedAt: "asc" } })).map(
    serializeEquipment,
  );
  return { equipment, changed };
}
