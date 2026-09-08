import type {
  ApprovalState,
  ExpenseInput,
  Money,
  QuoteLineInput,
} from "@/lib/price-book/types";

export function asMoney(value: unknown): Money {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

export function grossMarginPct(listPrice: Money, internalCost: Money): Money {
  if (listPrice === null || listPrice === 0 || internalCost === null) return null;
  return Math.round(((listPrice - internalCost) / listPrice) * 10000) / 100;
}

export function landedCost(input: {
  vendorCost: Money;
  shippingCost: Money;
  otherAcquisition: Money;
}): Money {
  const parts = [input.vendorCost, input.shippingCost, input.otherAcquisition];
  if (parts.every((part) => part === null)) return null;
  return Math.round(parts.reduce<number>((sum, part) => sum + (part ?? 0), 0) * 100) / 100;
}

export function listFromLanded(landed: Money, markupPercent: Money): Money {
  if (landed === null) return null;
  const markup = markupPercent ?? 0;
  return Math.round(landed * (1 + markup / 100) * 100) / 100;
}

export function lineCustomerPrice(line: QuoteLineInput): Money {
  if (line.inclusion === "INCLUDED") return 0;
  if (line.inclusion === "OPTIONAL") return 0;
  const unit = line.unitPrice ?? line.listPrice;
  if (unit === null) return null;
  const discounted = unit * (1 - (line.discountPct || 0) / 100);
  return Math.round(discounted * line.quantity * 100) / 100;
}

export function isRecurring(billingType: string) {
  return billingType === "ANNUAL" || billingType === "MONTHLY";
}

export function annualize(billingType: string, amount: Money): Money {
  if (amount === null) return null;
  if (billingType === "MONTHLY") return Math.round(amount * 12 * 100) / 100;
  return amount;
}

export function lineBelowMinimum(line: QuoteLineInput): boolean {
  if (line.inclusion === "INCLUDED" || line.inclusion === "OPTIONAL") return false;
  if (line.minimumPrice === null) return false;
  const unit = line.unitPrice ?? line.listPrice;
  if (unit === null) return false;
  const customerUnit = unit * (1 - (line.discountPct || 0) / 100);
  return customerUnit + 1e-9 < line.minimumPrice;
}

export type QuoteTotals = {
  softwareAnnual: number;
  oneTime: number;
  recurringAnnual: number;
  year1: number;
  annualRecurring: number;
  expenses: number;
  missingPrices: number;
  belowMinimum: boolean;
  hasDiscount: boolean;
  approvalState: ApprovalState;
  revenue: {
    software: number;
    hardware: number;
    services: number;
    support: number;
  };
  cost: {
    software: number;
    hardware: number;
    labor: number;
    travel: number;
    support: number;
    other: number;
  };
  year1Revenue: number;
  year1Cost: number;
  year1Profit: number;
  year1Margin: Money;
  recurringRevenue: number;
  recurringCost: number;
  recurringProfit: number;
  recurringMargin: Money;
};

function addCost(line: QuoteLineInput): number {
  if (line.internalCost === null) return 0;
  return line.internalCost * line.quantity;
}

export function calculateQuote(
  lines: QuoteLineInput[],
  expenses: ExpenseInput,
  overallDiscountPct = 0,
): QuoteTotals {
  const expenseTotal =
    (expenses.travel || 0) +
    (expenses.hotel || 0) +
    (expenses.airfare || 0) +
    (expenses.ground || 0) +
    (expenses.shipping || 0) +
    (expenses.other || 0);

  let softwareAnnual = 0;
  let oneTime = 0;
  let recurringAnnual = 0;
  let missingPrices = 0;
  let belowMinimum = false;
  let hasDiscount = overallDiscountPct > 0;
  const revenue = { software: 0, hardware: 0, services: 0, support: 0 };
  const cost = { software: 0, hardware: 0, labor: 0, travel: expenseTotal, support: 0, other: 0 };
  let recurringCost = 0;

  for (const line of lines) {
    if (line.discountPct > 0) hasDiscount = true;
    if (lineBelowMinimum(line)) belowMinimum = true;
    const customer = lineCustomerPrice(line);
    if (customer === null) {
      missingPrices += 1;
      continue;
    }
    const afterOverall =
      line.inclusion === "ADDITIONAL"
        ? Math.round(customer * (1 - overallDiscountPct / 100) * 100) / 100
        : customer;
    const annual = annualize(line.billingType, afterOverall) ?? 0;
    if (isRecurring(line.billingType)) {
      recurringAnnual += annual;
      if (line.category === "LICENSE") softwareAnnual += annual;
    } else {
      oneTime += afterOverall;
    }

    if (line.category === "LICENSE") revenue.software += annual;
    else if (line.category === "HARDWARE") revenue.hardware += afterOverall;
    else if (line.category === "SUPPORT" || line.category === "MONITORING") {
      revenue.support += annual || afterOverall;
    } else {
      revenue.services += isRecurring(line.billingType) ? annual : afterOverall;
    }

    const lineCost = addCost(line);
    if (line.category === "LICENSE") cost.software += lineCost;
    else if (line.category === "HARDWARE") cost.hardware += lineCost;
    else if (line.category === "ENGINEERING" || line.category === "DEPLOYMENT") {
      cost.labor += lineCost;
    } else if (line.category === "SUPPORT" || line.category === "MONITORING") {
      cost.support += lineCost;
    } else {
      cost.other += lineCost;
    }
    if (isRecurring(line.billingType)) {
      recurringCost += line.billingType === "MONTHLY" ? lineCost * 12 : lineCost;
    }
  }

  const year1 = Math.round((oneTime + recurringAnnual + expenseTotal) * 100) / 100;
  const year1Revenue = Math.round((oneTime + recurringAnnual + expenseTotal) * 100) / 100;
  const year1Cost =
    Math.round(
      (cost.software +
        cost.hardware +
        cost.labor +
        cost.travel +
        cost.support +
        cost.other) *
        100,
    ) / 100;
  const year1Profit = Math.round((year1Revenue - year1Cost) * 100) / 100;
  const recurringRevenue = Math.round(recurringAnnual * 100) / 100;
  const recurringProfit = Math.round((recurringRevenue - recurringCost) * 100) / 100;

  let approvalState: ApprovalState = "NORMAL";
  if (belowMinimum) approvalState = "BELOW MINIMUM";
  else if (hasDiscount) approvalState = "REVIEW REQUIRED";

  return {
    softwareAnnual: Math.round(softwareAnnual * 100) / 100,
    oneTime: Math.round(oneTime * 100) / 100,
    recurringAnnual: Math.round(recurringAnnual * 100) / 100,
    year1,
    annualRecurring: Math.round(recurringAnnual * 100) / 100,
    expenses: Math.round(expenseTotal * 100) / 100,
    missingPrices,
    belowMinimum,
    hasDiscount,
    approvalState,
    revenue,
    cost,
    year1Revenue,
    year1Cost,
    year1Profit,
    year1Margin: grossMarginPct(year1Revenue, year1Cost),
    recurringRevenue,
    recurringCost: Math.round(recurringCost * 100) / 100,
    recurringProfit,
    recurringMargin: grossMarginPct(recurringRevenue, recurringCost),
  };
}
