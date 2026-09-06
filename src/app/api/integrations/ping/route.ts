import { NextResponse } from "next/server";
import { requireActor } from "@/lib/authz";
import { integrationStatus } from "@/lib/integrations";
import { prismaReady } from "@/lib/prisma";

export async function POST(request: Request) {
  const ready = await requireActor();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }

  let body: { id?: unknown } = {};
  try {
    body = (await request.json()) as { id?: unknown };
  } catch {
    body = {};
  }
  const id = typeof body.id === "string" && body.id.trim() ? body.id.trim() : undefined;

  const prisma = await prismaReady();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }

  const now = new Date();
  if (id) {
    await prisma.integration.update({
      where: { id },
      data: { lastPingAt: now },
    });
  } else {
    await prisma.integration.updateMany({ data: { lastPingAt: now } });
  }

  const rows = await prisma.integration.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({
    ok: true,
    integrations: rows.map((row) => ({
      id: row.id,
      name: row.name,
      vendor: row.vendor,
      lastPingAt: row.lastPingAt ? row.lastPingAt.toISOString() : null,
      status: integrationStatus(row.lastPingAt),
    })),
  });
}
