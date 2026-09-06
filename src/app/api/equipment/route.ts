import { NextResponse } from "next/server";
import { requireActor } from "@/lib/authz";
import { serializeEquipment } from "@/lib/equipment-check";
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
  const rows = await prisma.equipment.findMany({ orderBy: { addedAt: "asc" } });
  return NextResponse.json({ equipment: rows.map(serializeEquipment) });
}
