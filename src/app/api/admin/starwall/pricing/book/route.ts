import { NextResponse } from "next/server";
import { requireCommercial } from "@/lib/commercial-auth";
import { prismaReady } from "@/lib/prisma";
import { listBook } from "@/lib/price-book/service";

export async function GET() {
  const ready = await requireCommercial();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const prisma = await prismaReady();
  if (!prisma) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const data = await listBook(prisma, ready.actor);
  if (!data) return NextResponse.json({ error: "no_price_book" }, { status: 404 });
  return NextResponse.json({ role: ready.actor.commercialRole, ...data });
}
