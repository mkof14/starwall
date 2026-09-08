import { NextResponse } from "next/server";
import { requireCommercial } from "@/lib/commercial-rbac";
import { prismaReady } from "@/lib/prisma";
import {
  addQuoteItem,
  approveQuote,
  customerProposal,
  getQuote,
  patchQuote,
  patchQuoteItem,
  removeQuoteItem,
  reviseQuote,
} from "@/lib/price-book/service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const ready = await requireCommercial();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const prisma = await prismaReady();
  if (!prisma) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const data = await getQuote(prisma, ready.actor, params.id);
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (new URL(request.url).searchParams.get("view") === "proposal") {
    return NextResponse.json(customerProposal(data));
  }
  return NextResponse.json(data);
}

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
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (body.action === "add-item") {
    const result = await addQuoteItem(prisma, ready.actor, params.id, {
      priceItemId: typeof body.priceItemId === "string" ? body.priceItemId : undefined,
      name: typeof body.name === "string" ? body.name : undefined,
      category: typeof body.category === "string" ? body.category : undefined,
      quantity: typeof body.quantity === "number" ? body.quantity : 1,
      unitPrice: typeof body.unitPrice === "number" ? body.unitPrice : null,
      discountPct: typeof body.discountPct === "number" ? body.discountPct : 0,
      inclusion: typeof body.inclusion === "string" ? body.inclusion : undefined,
      engineeringHours: typeof body.engineeringHours === "number" ? body.engineeringHours : null,
      notes: typeof body.notes === "string" ? body.notes : "",
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  }
  if (body.action === "patch-item" && typeof body.itemId === "string") {
    const result = await patchQuoteItem(prisma, ready.actor, body.itemId, body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  }
  if (body.action === "remove-item" && typeof body.itemId === "string") {
    const result = await removeQuoteItem(prisma, ready.actor, body.itemId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  }
  if (body.action === "approve" || body.action === "reject") {
    const result = await approveQuote(
      prisma,
      ready.actor,
      params.id,
      body.action === "approve" ? "APPROVED" : "REJECTED",
      typeof body.reason === "string" ? body.reason : "",
    );
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  }
  if (body.action === "revise") {
    const result = await reviseQuote(
      prisma,
      ready.actor,
      params.id,
      typeof body.note === "string" ? body.note : "Revision",
    );
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  }

  const result = await patchQuote(prisma, ready.actor, params.id, body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
