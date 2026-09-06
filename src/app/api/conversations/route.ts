import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { ensureWatchSession, requireCloudActor, requireCloudUser } from "@/lib/watch-session";

type ConversationBody = {
  sessionId?: string;
  vesselName?: string;
  conversation?: {
    id?: string;
    timestamp?: string;
    role?: string;
    content?: string;
    langCode?: string | null;
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
    const conversations = await prisma.conversation.findMany({
      where: { session: { userId: ready.user.userId } },
      orderBy: { timestamp: "asc" },
      take: 400,
    });
    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as ConversationBody;
  const ready = await requireCloudActor(body.sessionId ?? "");
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const row = body.conversation;
  if (!row?.id || !row.timestamp || !row.role || !row.content) {
    return NextResponse.json({ error: "invalid_conversation" }, { status: 400 });
  }
  if (row.role !== "user" && row.role !== "assistant") {
    return NextResponse.json({ error: "invalid_role" }, { status: 400 });
  }
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
  try {
  await ensureWatchSession(ready.actor, body.vesselName?.trim() || "M/Y AURELIA");
  await prisma.conversation.upsert({
    where: { id: row.id },
    update: {
      timestamp: new Date(row.timestamp),
      role: row.role,
      content: row.content,
      langCode: row.langCode ?? null,
    },
    create: {
      id: row.id,
      sessionId: ready.actor.sessionId,
      timestamp: new Date(row.timestamp),
      role: row.role,
      content: row.content,
      langCode: row.langCode ?? null,
    },
  });
  return NextResponse.json({ ok: true, storageLocation: "both" });
  } catch {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
}
