import { NextResponse } from "next/server";
import { requireActor } from "@/lib/authz";
import { integrationStatus } from "@/lib/integrations";
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
  const rows = await prisma.integration.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({
    integrations: rows.map((row) => ({
      id: row.id,
      name: row.name,
      vendor: row.vendor,
      lastPingAt: row.lastPingAt ? row.lastPingAt.toISOString() : null,
      status: integrationStatus(row.lastPingAt),
    })),
  });
}
