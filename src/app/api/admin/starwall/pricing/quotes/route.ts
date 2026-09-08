import { NextResponse } from "next/server";
import { requireCommercial } from "@/lib/commercial-auth";
import { prismaReady } from "@/lib/prisma";
import { createQuote, dashboard, listQuotes } from "@/lib/price-book/service";

export async function GET(request: Request) {
  const ready = await requireCommercial();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const prisma = await prismaReady();
  if (!prisma) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const view = new URL(request.url).searchParams.get("view");
  if (view === "dashboard") {
    return NextResponse.json({
      role: ready.actor.commercialRole,
      ...(await dashboard(prisma, ready.actor)),
    });
  }
  return NextResponse.json({
    role: ready.actor.commercialRole,
    quotes: await listQuotes(prisma, ready.actor),
  });
}

export async function POST(request: Request) {
  const ready = await requireCommercial();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const prisma = await prismaReady();
  if (!prisma) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (typeof body.customerName !== "string" || !body.customerName.trim()) {
    return NextResponse.json({ error: "customer_required" }, { status: 400 });
  }
  if (typeof body.objectType !== "string" || typeof body.plan !== "string") {
    return NextResponse.json({ error: "object_and_plan_required" }, { status: 400 });
  }
  const result = await createQuote(prisma, ready.actor, {
    customerName: body.customerName,
    company: typeof body.company === "string" ? body.company : "",
    contact: typeof body.contact === "string" ? body.contact : "",
    email: typeof body.email === "string" ? body.email : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    country: typeof body.country === "string" ? body.country : "",
    opportunityId: typeof body.opportunityId === "string" ? body.opportunityId : "",
    objectType: body.objectType,
    objectName: typeof body.objectName === "string" ? body.objectName : "",
    objectSize: typeof body.objectSize === "string" ? body.objectSize : "",
    location: typeof body.location === "string" ? body.location : "",
    siteCount: typeof body.siteCount === "number" ? body.siteCount : 1,
    vesselCount: typeof body.vesselCount === "number" ? body.vesselCount : 1,
    objectNotes: typeof body.objectNotes === "string" ? body.objectNotes : "",
    plan: body.plan,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ id: result.quote.id, number: "number" in result.quote ? result.quote.number : null });
}
