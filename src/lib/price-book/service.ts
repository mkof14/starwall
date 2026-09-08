import type { PrismaClient } from "@prisma/client";
import type { CommercialActor } from "@/lib/commercial-rbac";
import {
  canApprovePricing,
  canApplyDiscount,
  canEditEngineering,
  canEditPriceBook,
  canEditQuoteCommercial,
  canOverrideListPrice,
  canSeeInternalCost,
} from "@/lib/commercial-rbac";
import { asMoney, landedCost, listFromLanded } from "@/lib/price-book/calc";
import { computeLineCustomer, computeQuoteTotals, nextQuoteNumber, persistQuoteTotals, snapshotQuote } from "@/lib/price-book/quote";
import { getActivePriceBook } from "@/lib/price-book/seed";
import { serializePriceItem, serializeQuoteLine } from "@/lib/price-book/serialize";
import { writeAudit } from "@/lib/authz";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/price-book/types";

function money(value: unknown) {
  return asMoney(value);
}

const LOCKED_STATUSES = new Set(["APPROVED", "SENT", "CUSTOMER REVIEW", "ACCEPTED"]);

export async function listBook(prisma: PrismaClient, actor: CommercialActor) {
  const book = await getActivePriceBook(prisma);
  if (!book) return null;
  const items = await prisma.priceItem.findMany({
    where: { priceBookId: book.id },
    orderBy: [{ category: "asc" }, { itemCode: "asc" }],
  });
  return {
    book: {
      id: book.id,
      version: book.version,
      name: book.name,
      status: book.status,
    },
    items: items.map((item) => serializePriceItem(item, actor.commercialRole)),
  };
}

export async function updateItem(
  prisma: PrismaClient,
  actor: CommercialActor,
  id: string,
  patch: Record<string, unknown>,
) {
  if (!canEditPriceBook(actor.commercialRole)) {
    return { ok: false as const, status: 403, error: "forbidden" };
  }
  const item = await prisma.priceItem.findUnique({ where: { id } });
  if (!item) return { ok: false as const, status: 404, error: "not_found" };

  const vendorCost = money(patch.vendorCost ?? item.vendorCost);
  const shippingCost = money(patch.shippingCost ?? item.shippingCost);
  const otherAcquisition = money(patch.otherAcquisition ?? item.otherAcquisition);
  const markupPercent = money(patch.markupPercent ?? item.markupPercent);
  const nextLanded = landedCost({ vendorCost, shippingCost, otherAcquisition });
  const override = Boolean(patch.listPriceOverride ?? item.listPriceOverride);
  if (override && !canOverrideListPrice(actor.commercialRole)) {
    return { ok: false as const, status: 403, error: "forbidden" };
  }
  const computedList = listFromLanded(nextLanded, markupPercent);
  const listPrice = override ? money(patch.listPrice ?? item.listPrice) : (computedList ?? money(patch.listPrice ?? item.listPrice));

  const updated = await prisma.priceItem.update({
    where: { id },
    data: {
      name: typeof patch.name === "string" ? patch.name : item.name,
      description: typeof patch.description === "string" ? patch.description : item.description,
      unit: typeof patch.unit === "string" ? patch.unit : item.unit,
      billingType: typeof patch.billingType === "string" ? patch.billingType : item.billingType,
      applicablePlans:
        typeof patch.applicablePlans === "string" ? patch.applicablePlans : item.applicablePlans,
      active: typeof patch.active === "boolean" ? patch.active : item.active,
      internalNotes: typeof patch.internalNotes === "string" ? patch.internalNotes : item.internalNotes,
      internalCost: money(patch.internalCost ?? item.internalCost),
      listPrice,
      minimumPrice: money(patch.minimumPrice ?? item.minimumPrice),
      manufacturer: typeof patch.manufacturer === "string" ? patch.manufacturer : item.manufacturer,
      model: typeof patch.model === "string" ? patch.model : item.model,
      sku: typeof patch.sku === "string" ? patch.sku : item.sku,
      vendorCost,
      shippingCost,
      otherAcquisition,
      landedCost: nextLanded,
      markupPercent,
      listPriceOverride: override,
      hourlyCost: money(patch.hourlyCost ?? item.hourlyCost),
      customerHourly: money(patch.customerHourly ?? item.customerHourly),
      customerDaily: money(patch.customerDaily ?? item.customerDaily),
      minIncrementHours: money(patch.minIncrementHours ?? item.minIncrementHours),
      coverageHours: typeof patch.coverageHours === "string" ? patch.coverageHours : item.coverageHours,
      responseTarget:
        typeof patch.responseTarget === "string" ? patch.responseTarget : item.responseTarget,
      slaApproved: typeof patch.slaApproved === "boolean" ? patch.slaApproved : item.slaApproved,
      slaNotes: typeof patch.slaNotes === "string" ? patch.slaNotes : item.slaNotes,
      includedInPlans:
        typeof patch.includedInPlans === "string" ? patch.includedInPlans : item.includedInPlans,
      updatedBy: actor.userId,
    },
  });
  await writeAudit(actor, "price-item.update", `${updated.itemCode} ${updated.name}`);
  return { ok: true as const, item: serializePriceItem(updated, actor.commercialRole) };
}

export async function duplicateItem(prisma: PrismaClient, actor: CommercialActor, id: string) {
  if (!canEditPriceBook(actor.commercialRole)) {
    return { ok: false as const, status: 403, error: "forbidden" };
  }
  const item = await prisma.priceItem.findUnique({ where: { id } });
  if (!item) return { ok: false as const, status: 404, error: "not_found" };
  const copy = await prisma.priceItem.create({
    data: {
      priceBookId: item.priceBookId,
      itemCode: `${item.itemCode}-COPY`,
      category: item.category,
      subcategory: item.subcategory,
      name: `${item.name} (copy)`,
      description: item.description,
      unit: item.unit,
      billingType: item.billingType,
      applicablePlans: item.applicablePlans,
      active: false,
      updatedBy: actor.userId,
    },
  });
  await writeAudit(actor, "price-item.duplicate", `${item.itemCode} -> ${copy.itemCode}`);
  return { ok: true as const, item: serializePriceItem(copy, actor.commercialRole) };
}

export async function deactivateItem(prisma: PrismaClient, actor: CommercialActor, id: string) {
  if (!canEditPriceBook(actor.commercialRole)) {
    return { ok: false as const, status: 403, error: "forbidden" };
  }
  const updated = await prisma.priceItem.update({
    where: { id },
    data: { active: false, updatedBy: actor.userId },
  });
  await writeAudit(actor, "price-item.deactivate", updated.itemCode);
  return { ok: true as const, item: serializePriceItem(updated, actor.commercialRole) };
}

export async function listQuotes(prisma: PrismaClient, actor: CommercialActor) {
  const quotes = await prisma.quote.findMany({
    include: { customer: true },
    orderBy: { modifiedAt: "desc" },
    take: 80,
  });
  return quotes.map((quote) => ({
    id: quote.id,
    number: quote.number,
    version: quote.version,
    status: quote.status,
    plan: quote.plan,
    objectType: quote.objectType,
    objectName: quote.objectName,
    customer: quote.customer.name,
    company: quote.customer.company,
    year1: money(quote.year1Total),
    annualRecurring: money(quote.annualRecurring),
    approvalState: quote.approvalState,
    ownerId: quote.salesOwnerId,
    modifiedAt: quote.modifiedAt.toISOString(),
    margin: canSeeInternalCost(actor.commercialRole) ? null : undefined,
  }));
}

export async function dashboard(prisma: PrismaClient, actor: CommercialActor) {
  const quotes = await prisma.quote.findMany({
    include: { customer: true, items: true },
    orderBy: { modifiedAt: "desc" },
  });
  const active = quotes.filter((q) => !["DECLINED", "EXPIRED", "ACCEPTED"].includes(q.status));
  const awaiting = quotes.filter((q) =>
    ["APPROVAL REQUIRED", "PRICING REVIEW", "ENGINEERING REVIEW"].includes(q.status),
  );
  const sent = quotes.filter((q) => ["SENT", "CUSTOMER REVIEW"].includes(q.status));
  const accepted = quotes.filter((q) => q.status === "ACCEPTED");
  const pipeline = active.reduce((sum, q) => sum + (money(q.year1Total) ?? 0), 0);
  const arr = active.reduce((sum, q) => sum + (money(q.annualRecurring) ?? 0), 0);
  const recent = quotes.slice(0, 12).map((quote) => ({
    id: quote.id,
    number: quote.number,
    version: quote.version,
    customer: quote.customer.name,
    object: quote.objectName || quote.objectType,
    plan: quote.plan,
    year1: money(quote.year1Total),
    annualRecurring: money(quote.annualRecurring),
    status: quote.status,
    approvalState: quote.approvalState,
    ownerId: quote.salesOwnerId,
    margin: canSeeInternalCost(actor.commercialRole)
      ? computeQuoteTotals(quote.items ?? [], quote).year1Margin
      : undefined,
  }));
  return {
    counts: {
      active: active.length,
      awaitingApproval: awaiting.length,
      sent: sent.length,
      accepted: accepted.length,
    },
    pipeline,
    annualRecurring: arr,
    recent,
  };
}

export async function createQuote(
  prisma: PrismaClient,
  actor: CommercialActor,
  input: {
    customerName: string;
    company?: string;
    contact?: string;
    email?: string;
    phone?: string;
    country?: string;
    opportunityId?: string;
    objectType: string;
    objectName?: string;
    objectSize?: string;
    location?: string;
    siteCount?: number;
    vesselCount?: number;
    objectNotes?: string;
    plan: string;
  },
) {
  if (!canEditQuoteCommercial(actor.commercialRole) && !canEditEngineering(actor.commercialRole)) {
    return { ok: false as const, status: 403, error: "forbidden" };
  }
  const book = await getActivePriceBook(prisma);
  if (!book) return { ok: false as const, status: 500, error: "no_price_book" };
  const customer = await prisma.commercialCustomer.create({
    data: {
      name: input.customerName.trim(),
      company: input.company?.trim() ?? "",
      contact: input.contact?.trim() ?? "",
      email: input.email?.trim() ?? "",
      phone: input.phone?.trim() ?? "",
      country: input.country?.trim() ?? "",
    },
  });
  const number = await nextQuoteNumber(prisma);
  const license = await prisma.priceItem.findFirst({
    where: {
      priceBookId: book.id,
      category: "LICENSE",
      applicablePlans: { contains: input.plan },
      active: true,
    },
  });
  const quote = await prisma.quote.create({
    data: {
      number,
      version: 1,
      status: "DRAFT",
      priceBookId: book.id,
      customerId: customer.id,
      salesOwnerId: actor.userId,
      opportunityId: input.opportunityId ?? "",
      objectType: input.objectType,
      objectName: input.objectName ?? "",
      objectSize: input.objectSize ?? "",
      location: input.location ?? "",
      siteCount: input.siteCount ?? 1,
      vesselCount: input.vesselCount ?? 1,
      objectNotes: input.objectNotes ?? "",
      plan: input.plan,
      createdBy: actor.userId,
      modifiedBy: actor.userId,
    },
  });
  if (license) {
    const included = (license.includedInPlans || "").split(",").includes(input.plan);
    await addQuoteItem(prisma, actor, quote.id, { priceItemId: license.id, inclusion: included ? "INCLUDED" : "ADDITIONAL" });
  }
  await writeAudit(actor, "quote.create", number);
  const loaded = await persistQuoteTotals(prisma, quote.id);
  return { ok: true as const, quote: loaded?.quote ?? quote };
}

export async function addQuoteItem(
  prisma: PrismaClient,
  actor: CommercialActor,
  quoteId: string,
  input: {
    priceItemId?: string;
    name?: string;
    category?: string;
    billingType?: string;
    quantity?: number;
    unitPrice?: number | null;
    discountPct?: number;
    inclusion?: string;
    engineeringHours?: number | null;
    notes?: string;
  },
) {
  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  if (!quote) return { ok: false as const, status: 404, error: "not_found" };
  if (LOCKED_STATUSES.has(quote.status) && quote.status !== "DRAFT") {
    return { ok: false as const, status: 409, error: "locked" };
  }
  if (input.discountPct && !canApplyDiscount(actor.commercialRole)) {
    return { ok: false as const, status: 403, error: "forbidden" };
  }
  let priceItem = null;
  if (input.priceItemId) {
    priceItem = await prisma.priceItem.findUnique({ where: { id: input.priceItemId } });
  }
  const listPrice = money(priceItem?.listPrice);
  const unitPrice = money(input.unitPrice ?? listPrice);
  const inclusion =
    input.inclusion ||
    (priceItem?.includedInPlans.split(",").includes(quote.plan) ? "INCLUDED" : "ADDITIONAL");
  const created = await prisma.quoteItem.create({
    data: {
      quoteId,
      priceItemId: priceItem?.id,
      category: priceItem?.category ?? input.category ?? "OPTIONAL",
      name: priceItem?.name ?? input.name ?? "Custom line",
      description: priceItem?.description ?? "",
      billingType: priceItem?.billingType ?? input.billingType ?? "ONE-TIME",
      quantity: input.quantity ?? 1,
      unit: priceItem?.unit ?? "each",
      listPrice,
      internalCost: money(priceItem?.internalCost),
      minimumPrice: money(priceItem?.minimumPrice),
      unitPrice,
      discountPct: canApplyDiscount(actor.commercialRole) ? input.discountPct ?? 0 : 0,
      inclusion,
      engineeringHours: canEditEngineering(actor.commercialRole)
        ? input.engineeringHours ?? money(priceItem?.installationHours)
        : null,
      notes: input.notes ?? "",
      customerPrice: computeLineCustomer({
        category: priceItem?.category ?? input.category ?? "OPTIONAL",
        name: priceItem?.name ?? input.name ?? "Custom line",
        billingType: priceItem?.billingType ?? input.billingType ?? "ONE-TIME",
        quantity: input.quantity ?? 1,
        listPrice,
        internalCost: money(priceItem?.internalCost),
        minimumPrice: money(priceItem?.minimumPrice),
        unitPrice,
        discountPct: input.discountPct ?? 0,
        inclusion,
      }),
      sortOrder: Date.now() % 100000,
    },
  });
  const loaded = await persistQuoteTotals(prisma, quoteId);
  if (loaded && loaded.totals.belowMinimum) {
    await prisma.quoteApproval.create({
      data: {
        quoteId,
        kind: "PRICE_FLOOR",
        status: "PENDING",
        reason: "Customer price is below the minimum approved price.",
        requestedBy: actor.userId,
      },
    });
    await writeAudit(actor, "quote.below-minimum", quote.number);
  }
  return { ok: true as const, item: created, totals: loaded?.totals };
}

export async function patchQuote(
  prisma: PrismaClient,
  actor: CommercialActor,
  quoteId: string,
  patch: Record<string, unknown>,
) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { items: true, customer: true },
  });
  if (!quote) return { ok: false as const, status: 404, error: "not_found" };

  if (typeof patch.status === "string" && QUOTE_STATUSES.includes(patch.status as QuoteStatus)) {
    if (patch.status === "APPROVED" && !canApprovePricing(actor.commercialRole)) {
      return { ok: false as const, status: 403, error: "forbidden" };
    }
    if (quote.status === "APPROVED" && patch.status !== "APPROVED") {
      return reviseQuote(prisma, actor, quoteId, `Status change to ${patch.status}`);
    }
  }
  if (typeof patch.overallDiscount === "number" && !canApplyDiscount(actor.commercialRole)) {
    return { ok: false as const, status: 403, error: "forbidden" };
  }

  if (LOCKED_STATUSES.has(quote.status) && canEditQuoteCommercial(actor.commercialRole)) {
    const commercialChange = [
      "overallDiscount",
      "plan",
      "travelExpense",
      "hotelExpense",
      "airfareExpense",
      "groundExpense",
      "shippingExpense",
      "otherExpense",
    ].some((key) => patch[key] !== undefined);
    if (commercialChange && quote.status === "APPROVED") {
      return reviseQuote(prisma, actor, quoteId, "Commercial terms changed after approval");
    }
  }

  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      objectType: typeof patch.objectType === "string" ? patch.objectType : undefined,
      objectName: typeof patch.objectName === "string" ? patch.objectName : undefined,
      objectSize: typeof patch.objectSize === "string" ? patch.objectSize : undefined,
      location: typeof patch.location === "string" ? patch.location : undefined,
      siteCount: typeof patch.siteCount === "number" ? patch.siteCount : undefined,
      vesselCount: typeof patch.vesselCount === "number" ? patch.vesselCount : undefined,
      objectNotes: typeof patch.objectNotes === "string" ? patch.objectNotes : undefined,
      plan: typeof patch.plan === "string" ? patch.plan : undefined,
      infrastructure: typeof patch.infrastructure === "string" ? patch.infrastructure : undefined,
      opportunityId: typeof patch.opportunityId === "string" ? patch.opportunityId : undefined,
      travelExpense: money(patch.travelExpense ?? quote.travelExpense) ?? 0,
      hotelExpense: money(patch.hotelExpense ?? quote.hotelExpense) ?? 0,
      airfareExpense: money(patch.airfareExpense ?? quote.airfareExpense) ?? 0,
      groundExpense: money(patch.groundExpense ?? quote.groundExpense) ?? 0,
      shippingExpense: money(patch.shippingExpense ?? quote.shippingExpense) ?? 0,
      otherExpense: money(patch.otherExpense ?? quote.otherExpense) ?? 0,
      overallDiscount: canApplyDiscount(actor.commercialRole)
        ? money(patch.overallDiscount ?? quote.overallDiscount) ?? 0
        : quote.overallDiscount,
      discountNote: typeof patch.discountNote === "string" ? patch.discountNote : undefined,
      status: typeof patch.status === "string" ? patch.status : undefined,
      rfpNumber: typeof patch.rfpNumber === "string" ? patch.rfpNumber : undefined,
      rfpReference: typeof patch.rfpReference === "string" ? patch.rfpReference : undefined,
      rfpRequirements: typeof patch.rfpRequirements === "string" ? patch.rfpRequirements : undefined,
      rfpClarifications:
        typeof patch.rfpClarifications === "string" ? patch.rfpClarifications : undefined,
      rfpCompliance: typeof patch.rfpCompliance === "string" ? patch.rfpCompliance : undefined,
      rfpCommercial: typeof patch.rfpCommercial === "string" ? patch.rfpCommercial : undefined,
      rfpDeadline:
        typeof patch.rfpDeadline === "string" && patch.rfpDeadline
          ? new Date(patch.rfpDeadline)
          : undefined,
      modifiedBy: actor.userId,
    },
  });
  if (patch.customer && typeof patch.customer === "object") {
    const customer = patch.customer as Record<string, string>;
    await prisma.commercialCustomer.update({
      where: { id: quote.customerId },
      data: {
        name: customer.name ?? undefined,
        company: customer.company ?? undefined,
        contact: customer.contact ?? undefined,
        email: customer.email ?? undefined,
        phone: customer.phone ?? undefined,
        country: customer.country ?? undefined,
      },
    });
  }
  const loaded = await persistQuoteTotals(prisma, quoteId);
  await writeAudit(actor, "quote.update", quote.number);
  return { ok: true as const, quote: loaded?.quote, totals: loaded?.totals };
}

export async function patchQuoteItem(
  prisma: PrismaClient,
  actor: CommercialActor,
  itemId: string,
  patch: Record<string, unknown>,
) {
  const item = await prisma.quoteItem.findUnique({ include: { quote: true }, where: { id: itemId } });
  if (!item) return { ok: false as const, status: 404, error: "not_found" };
  if (LOCKED_STATUSES.has(item.quote.status)) {
    return { ok: false as const, status: 409, error: "locked" };
  }
  if (patch.discountPct !== undefined && !canApplyDiscount(actor.commercialRole)) {
    return { ok: false as const, status: 403, error: "forbidden" };
  }
  const next = {
    quantity: money(patch.quantity ?? item.quantity) ?? 1,
    unitPrice: money(patch.unitPrice ?? item.unitPrice),
    discountPct: canApplyDiscount(actor.commercialRole)
      ? money(patch.discountPct ?? item.discountPct) ?? 0
      : money(item.discountPct) ?? 0,
    inclusion: typeof patch.inclusion === "string" ? patch.inclusion : item.inclusion,
    engineeringHours: canEditEngineering(actor.commercialRole)
      ? money(patch.engineeringHours ?? item.engineeringHours)
      : money(item.engineeringHours),
    notes: typeof patch.notes === "string" ? patch.notes : item.notes,
  };
  const customerPrice = computeLineCustomer({
    category: item.category,
    name: item.name,
    billingType: item.billingType,
    quantity: next.quantity,
    listPrice: money(item.listPrice),
    internalCost: money(item.internalCost),
    minimumPrice: money(item.minimumPrice),
    unitPrice: next.unitPrice,
    discountPct: next.discountPct,
    inclusion: next.inclusion,
  });
  await prisma.quoteItem.update({
    where: { id: itemId },
    data: { ...next, customerPrice },
  });
  const loaded = await persistQuoteTotals(prisma, item.quoteId);
  if (loaded?.totals.belowMinimum) {
    await prisma.quoteApproval.create({
      data: {
        quoteId: item.quoteId,
        kind: "PRICE_FLOOR",
        status: "PENDING",
        reason: "Customer price is below the minimum approved price.",
        requestedBy: actor.userId,
      },
    });
  }
  return { ok: true as const, totals: loaded?.totals };
}

export async function removeQuoteItem(prisma: PrismaClient, actor: CommercialActor, itemId: string) {
  const item = await prisma.quoteItem.findUnique({ include: { quote: true }, where: { id: itemId } });
  if (!item) return { ok: false as const, status: 404, error: "not_found" };
  if (LOCKED_STATUSES.has(item.quote.status)) {
    return { ok: false as const, status: 409, error: "locked" };
  }
  await prisma.quoteItem.delete({ where: { id: itemId } });
  await persistQuoteTotals(prisma, item.quoteId);
  await writeAudit(actor, "quote.item-remove", `${item.quote.number} ${item.name}`);
  return { ok: true as const };
}

export async function approveQuote(
  prisma: PrismaClient,
  actor: CommercialActor,
  quoteId: string,
  decision: "APPROVED" | "REJECTED",
  reason = "",
) {
  if (!canApprovePricing(actor.commercialRole)) {
    return { ok: false as const, status: 403, error: "forbidden" };
  }
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { items: true, customer: true, approvals: true },
  });
  if (!quote) return { ok: false as const, status: 404, error: "not_found" };
  await prisma.quoteApproval.updateMany({
    where: { quoteId, status: "PENDING" },
    data: { status: decision, decidedBy: actor.userId, decidedAt: new Date(), reason },
  });
  const nextStatus = decision === "APPROVED" ? "APPROVED" : "PRICING REVIEW";
  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: nextStatus, approvalState: decision === "APPROVED" ? "NORMAL" : quote.approvalState, modifiedBy: actor.userId },
  });
  await prisma.quoteVersion.create({
    data: {
      quoteId,
      version: quote.version,
      snapshot: snapshotQuote(quote),
      createdBy: actor.userId,
      note: decision === "APPROVED" ? "Approved snapshot" : reason,
    },
  });
  await writeAudit(actor, "quote.approval", `${quote.number} ${decision}`);
  return { ok: true as const };
}

export async function reviseQuote(
  prisma: PrismaClient,
  actor: CommercialActor,
  quoteId: string,
  note: string,
) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { items: true, customer: true },
  });
  if (!quote) return { ok: false as const, status: 404, error: "not_found" };
  await prisma.quoteVersion.create({
    data: {
      quoteId,
      version: quote.version,
      snapshot: snapshotQuote(quote),
      createdBy: actor.userId,
      note,
    },
  });
  const updated = await prisma.quote.update({
    where: { id: quoteId },
    data: {
      version: quote.version + 1,
      status: "REVISED",
      modifiedBy: actor.userId,
    },
    include: { items: { orderBy: { sortOrder: "asc" } }, customer: true },
  });
  await writeAudit(actor, "quote.revise", `${quote.number} v${updated.version}`);
  return { ok: true as const, quote: updated };
}

export async function getQuote(prisma: PrismaClient, actor: CommercialActor, id: string) {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
      customer: true,
      versions: { orderBy: { version: "desc" } },
      approvals: { orderBy: { createdAt: "desc" } },
      priceBook: true,
    },
  });
  if (!quote) return null;
  const totals = computeQuoteTotals(quote.items, quote);
  return {
    quote: {
      id: quote.id,
      number: quote.number,
      version: quote.version,
      status: quote.status,
      plan: quote.plan,
      objectType: quote.objectType,
      objectName: quote.objectName,
      objectSize: quote.objectSize,
      location: quote.location,
      siteCount: quote.siteCount,
      vesselCount: quote.vesselCount,
      objectNotes: quote.objectNotes,
      infrastructure: quote.infrastructure,
      opportunityId: quote.opportunityId,
      salesOwnerId: quote.salesOwnerId,
      approvalState: quote.approvalState,
      overallDiscount: money(quote.overallDiscount),
      discountNote: quote.discountNote,
      expenses: {
        travel: money(quote.travelExpense) ?? 0,
        hotel: money(quote.hotelExpense) ?? 0,
        airfare: money(quote.airfareExpense) ?? 0,
        ground: money(quote.groundExpense) ?? 0,
        shipping: money(quote.shippingExpense) ?? 0,
        other: money(quote.otherExpense) ?? 0,
      },
      rfp: {
        number: quote.rfpNumber,
        reference: quote.rfpReference,
        deadline: quote.rfpDeadline?.toISOString() ?? "",
        requirements: quote.rfpRequirements,
        clarifications: quote.rfpClarifications,
        compliance: quote.rfpCompliance,
        commercial: quote.rfpCommercial,
      },
      createdAt: quote.createdAt.toISOString(),
      modifiedAt: quote.modifiedAt.toISOString(),
      createdBy: quote.createdBy,
      modifiedBy: quote.modifiedBy,
      priceBook: { version: quote.priceBook.version, name: quote.priceBook.name },
      customer: quote.customer,
      items: quote.items.map((item) => serializeQuoteLine(item, actor.commercialRole)),
      versions: quote.versions.map((row) => ({
        id: row.id,
        version: row.version,
        createdAt: row.createdAt.toISOString(),
        createdBy: row.createdBy,
        note: row.note,
      })),
      approvals: canSeeInternalCost(actor.commercialRole)
        ? quote.approvals
        : quote.approvals.map((row) => ({
            id: row.id,
            kind: row.kind,
            status: row.status,
            createdAt: row.createdAt,
          })),
    },
    totals: canSeeInternalCost(actor.commercialRole)
      ? totals
      : {
          softwareAnnual: totals.softwareAnnual,
          oneTime: totals.oneTime,
          year1: totals.year1,
          annualRecurring: totals.annualRecurring,
          expenses: totals.expenses,
          missingPrices: totals.missingPrices,
          approvalState: totals.approvalState,
        },
  };
}

export function customerProposal(data: NonNullable<Awaited<ReturnType<typeof getQuote>>>) {
  return {
    customer: data.quote.customer,
    object: {
      type: data.quote.objectType,
      name: data.quote.objectName,
      size: data.quote.objectSize,
      location: data.quote.location,
      sites: data.quote.siteCount,
      vessels: data.quote.vesselCount,
    },
    plan: data.quote.plan,
    configuration: data.quote.items.map((item) => ({
      name: item.name,
      category: item.category,
      inclusion: item.inclusion,
      quantity: item.quantity,
      customerPrice: item.customerPrice,
      billingType: item.billingType,
    })),
    included: data.quote.items.filter((item) => item.inclusion === "INCLUDED").map((item) => item.name),
    optional: data.quote.items.filter((item) => item.inclusion === "OPTIONAL").map((item) => item.name),
    additional: data.quote.items.filter((item) => item.inclusion === "ADDITIONAL").map((item) => item.name),
    commercial: {
      year1: "year1" in data.totals ? data.totals.year1 : null,
      annualRecurring: "annualRecurring" in data.totals ? data.totals.annualRecurring : null,
    },
    terms: "Valid 30 days from issue. Final figure follows site survey and signed scope.",
    validity: "30 days",
    quoteNumber: data.quote.number,
    version: data.quote.version,
  };
}
