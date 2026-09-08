import type { Prisma, PrismaClient } from "@prisma/client";
import { asMoney, calculateQuote, lineCustomerPrice } from "@/lib/price-book/calc";
import type { Inclusion, QuoteLineInput } from "@/lib/price-book/types";

function dec(value: unknown): number | null {
  return asMoney(value);
}

export function toLineInput(item: {
  category: string;
  name: string;
  billingType: string;
  quantity: unknown;
  listPrice: unknown;
  internalCost: unknown;
  minimumPrice: unknown;
  unitPrice: unknown;
  discountPct: unknown;
  inclusion: string;
}): QuoteLineInput {
  return {
    category: item.category,
    name: item.name,
    billingType: item.billingType,
    quantity: dec(item.quantity) ?? 1,
    listPrice: dec(item.listPrice),
    internalCost: dec(item.internalCost),
    minimumPrice: dec(item.minimumPrice),
    unitPrice: dec(item.unitPrice),
    discountPct: dec(item.discountPct) ?? 0,
    inclusion: item.inclusion as Inclusion,
  };
}

export function computeLineCustomer(item: Parameters<typeof toLineInput>[0]) {
  return lineCustomerPrice(toLineInput(item));
}

export function computeQuoteTotals(
  items: Array<Parameters<typeof toLineInput>[0]>,
  quote: {
    travelExpense: unknown;
    hotelExpense: unknown;
    airfareExpense: unknown;
    groundExpense: unknown;
    shippingExpense: unknown;
    otherExpense: unknown;
    overallDiscount: unknown;
  },
) {
  return calculateQuote(
    items.map(toLineInput),
    {
      travel: dec(quote.travelExpense) ?? 0,
      hotel: dec(quote.hotelExpense) ?? 0,
      airfare: dec(quote.airfareExpense) ?? 0,
      ground: dec(quote.groundExpense) ?? 0,
      shipping: dec(quote.shippingExpense) ?? 0,
      other: dec(quote.otherExpense) ?? 0,
    },
    dec(quote.overallDiscount) ?? 0,
  );
}

export async function persistQuoteTotals(prisma: PrismaClient, quoteId: string) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { items: true },
  });
  if (!quote) return null;
  const totals = computeQuoteTotals(quote.items, quote);
  const nextStatus =
    totals.belowMinimum && quote.status === "DRAFT" ? "APPROVAL REQUIRED" : quote.status;
  const updated = await prisma.quote.update({
    where: { id: quoteId },
    data: {
      year1Total: totals.year1,
      annualRecurring: totals.annualRecurring,
      approvalState: totals.approvalState,
      status: nextStatus,
    },
    include: { items: { orderBy: { sortOrder: "asc" } }, customer: true },
  });
  return { quote: updated, totals };
}

export async function nextQuoteNumber(prisma: PrismaClient, year = new Date().getFullYear()) {
  const prefix = `SW-${year}-`;
  const latest = await prisma.quote.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: "desc" },
  });
  const last = latest ? Number(latest.number.slice(prefix.length)) : 0;
  const next = Number.isFinite(last) ? last + 1 : 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}

export function snapshotQuote(quote: Prisma.QuoteGetPayload<{
  include: { items: true; customer: true };
}>) {
  return JSON.stringify({
    number: quote.number,
    version: quote.version,
    status: quote.status,
    plan: quote.plan,
    year1Total: dec(quote.year1Total),
    annualRecurring: dec(quote.annualRecurring),
    items: quote.items.map((item) => ({
      name: item.name,
      category: item.category,
      listPrice: dec(item.listPrice),
      unitPrice: dec(item.unitPrice),
      customerPrice: dec(item.customerPrice),
      internalCost: dec(item.internalCost),
      quantity: dec(item.quantity),
    })),
  });
}
