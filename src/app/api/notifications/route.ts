import { NextResponse } from "next/server";
import { requireActor, requireRole, writeAudit } from "@/lib/authz";
import { prismaReady } from "@/lib/prisma";

const LEVELS = ["attention", "elevated", "critical"] as const;
const METHODS = ["email", "sms", "call", "messenger"] as const;

type LevelId = (typeof LEVELS)[number];
type MethodId = (typeof METHODS)[number];

function isLevel(value: unknown): value is LevelId {
  return typeof value === "string" && (LEVELS as readonly string[]).includes(value);
}

function isMethod(value: unknown): value is MethodId {
  return typeof value === "string" && (METHODS as readonly string[]).includes(value);
}

export async function GET() {
  const ready = await requireActor();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const prisma = await prismaReady();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }
  const routes = await prisma.notificationRoute.findMany({
    orderBy: [{ riskLevel: "asc" }, { method: "asc" }],
  });
  return NextResponse.json({ routes });
}

export async function PUT(request: Request) {
  const ready = await requireRole("Admin");
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const routes = (body as { routes?: unknown }).routes;
  if (!Array.isArray(routes)) {
    return NextResponse.json({ error: "invalid_routes" }, { status: 400 });
  }

  const next: { riskLevel: LevelId; method: MethodId; contact: string; enabled: boolean }[] = [];
  for (const row of routes) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    if (!isLevel(item.riskLevel) || !isMethod(item.method)) continue;
    next.push({
      riskLevel: item.riskLevel,
      method: item.method,
      contact: typeof item.contact === "string" ? item.contact.trim() : "",
      enabled: Boolean(item.enabled),
    });
  }

  const prisma = await prismaReady();
  if (!prisma) {
    return NextResponse.json({ error: "cloud_unavailable" }, { status: 503 });
  }

  await prisma.$transaction([
    prisma.notificationRoute.deleteMany(),
    prisma.notificationRoute.createMany({
      data: next.map((row) => ({
        id: `route-${row.riskLevel}-${row.method}`,
        riskLevel: row.riskLevel,
        method: row.method,
        contact: row.contact,
        enabled: row.enabled,
      })),
    }),
  ]);

  const saved = await prisma.notificationRoute.findMany({
    orderBy: [{ riskLevel: "asc" }, { method: "asc" }],
  });
  await writeAudit(
    ready.actor,
    "notify_save",
    `Saved ${saved.length} notification route${saved.length === 1 ? "" : "s"}`,
  );
  return NextResponse.json({ ok: true, routes: saved });
}
