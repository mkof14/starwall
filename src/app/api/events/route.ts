import { NextResponse } from "next/server";
import { getPrisma, prismaReady } from "@/lib/prisma";
import { ensureWatchSession, requireCloudActor, requireCloudUser } from "@/lib/watch-session";

type EventBody = {
  sessionId?: string;
  vesselName?: string;
  event?: {
    id?: string;
    timestamp?: string;
    scenarioId?: string | null;
    category?: string | null;
    riskLevel?: string;
    logText?: string;
    actionText?: string | null;
  };
};

export async function GET() {
  const ready = await requireCloudUser();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const prisma = await prismaReady();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
  try {
    const events = await prisma.event.findMany({
      where: { session: { userId: ready.user.userId } },
      orderBy: { timestamp: "desc" },
      take: 200,
    });
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as EventBody;
  const ready = await requireCloudActor(body.sessionId ?? "");
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const event = body.event;
  if (!event?.id || !event.timestamp || !event.riskLevel || !event.logText) {
    return NextResponse.json({ error: "invalid_event" }, { status: 400 });
  }
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
  try {
  await ensureWatchSession(ready.actor, body.vesselName?.trim() || "M/Y AURELIA");
  await prisma.event.upsert({
    where: { id: event.id },
    update: {
      timestamp: new Date(event.timestamp),
      scenarioId: event.scenarioId ?? null,
      category: event.category ?? null,
      riskLevel: event.riskLevel,
      logText: event.logText,
      actionText: event.actionText ?? null,
    },
    create: {
      id: event.id,
      sessionId: ready.actor.sessionId,
      timestamp: new Date(event.timestamp),
      scenarioId: event.scenarioId ?? null,
      category: event.category ?? null,
      riskLevel: event.riskLevel,
      logText: event.logText,
      actionText: event.actionText ?? null,
    },
  });
  return NextResponse.json({ ok: true, storageLocation: "both" });
  } catch {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
}
