import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { ensureWatchSession, requireCloudActor, requireCloudUser } from "@/lib/watch-session";

type BlackBoxBody = {
  sessionId?: string;
  vesselName?: string;
  record?: {
    id?: string;
    type?: string;
    timestamp?: string;
    summary?: string;
    fullContent?: string;
    storageLocation?: string;
  };
};

export async function GET() {
  const ready = await requireCloudUser();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
  try {
    const rows = await prisma.blackBoxRecord.findMany({
      where: { session: { userId: ready.user.userId } },
      orderBy: { timestamp: "desc" },
      take: 200,
    });
    return NextResponse.json({
      records: rows.map((row) => ({
        id: row.id,
        timestamp: row.timestamp.toISOString(),
        type: row.type,
        summary: row.summary,
        fullContent: row.fullContent,
        storageLocation: "both",
        pdfEnabled: true,
      })),
    });
  } catch {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as BlackBoxBody;
  const ready = await requireCloudActor(body.sessionId ?? "");
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const record = body.record;
  if (!record?.id || !record.type || !record.timestamp || !record.summary) {
    return NextResponse.json({ error: "invalid_record" }, { status: 400 });
  }
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
  try {
  await ensureWatchSession(ready.actor, body.vesselName?.trim() || "M/Y AURELIA");
  await prisma.blackBoxRecord.upsert({
    where: { id: record.id },
    update: {
      type: record.type,
      timestamp: new Date(record.timestamp),
      summary: record.summary,
      fullContent: record.fullContent ?? "",
      storageLocation: "both",
    },
    create: {
      id: record.id,
      sessionId: ready.actor.sessionId,
      type: record.type,
      timestamp: new Date(record.timestamp),
      summary: record.summary,
      fullContent: record.fullContent ?? "",
      storageLocation: "both",
    },
  });
  return NextResponse.json({ ok: true, storageLocation: "both" });
  } catch {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
}
