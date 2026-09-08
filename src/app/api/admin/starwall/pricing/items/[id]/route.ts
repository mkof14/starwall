import { NextResponse } from "next/server";
import { requireCommercial } from "@/lib/commercial-auth";
import { prismaReady } from "@/lib/prisma";
import { deactivateItem, duplicateItem, updateItem } from "@/lib/price-book/service";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const ready = await requireCommercial();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const prisma = await prismaReady();
  if (!prisma) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (body.action === "duplicate") {
    const result = await duplicateItem(prisma, ready.actor, params.id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  }
  if (body.action === "deactivate") {
    const result = await deactivateItem(prisma, ready.actor, params.id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  }
  const result = await updateItem(prisma, ready.actor, params.id, body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
