export const PRICE_CATEGORIES = [
  "LICENSE",
  "INTEGRATION",
  "HARDWARE",
  "DEPLOYMENT",
  "ENGINEERING",
  "TRAINING",
  "SUPPORT",
  "MONITORING",
  "MULTI_SITE",
  "OPTIONAL",
] as const;

export type PriceCategory = (typeof PRICE_CATEGORIES)[number];

export const BILLING_TYPES = [
  "ONE-TIME",
  "ANNUAL",
  "MONTHLY",
  "PER-DAY",
  "PER-HOUR",
  "PER-UNIT",
  "PER-SITE",
  "PER-VESSEL",
  "CUSTOM",
] as const;

export type BillingType = (typeof BILLING_TYPES)[number];

export const STARWALL_PLANS = ["LIGHT", "ADVANCED", "INTELLIGENCE", "CUSTOM"] as const;
export type StarwallPlan = (typeof STARWALL_PLANS)[number];

export const QUOTE_STATUSES = [
  "DRAFT",
  "ENGINEERING REVIEW",
  "PRICING REVIEW",
  "APPROVAL REQUIRED",
  "APPROVED",
  "SENT",
  "CUSTOMER REVIEW",
  "REVISED",
  "ACCEPTED",
  "DECLINED",
  "EXPIRED",
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const APPROVAL_STATES = ["NORMAL", "REVIEW REQUIRED", "BELOW MINIMUM"] as const;
export type ApprovalState = (typeof APPROVAL_STATES)[number];

export const INCLUSIONS = ["INCLUDED", "OPTIONAL", "ADDITIONAL"] as const;
export type Inclusion = (typeof INCLUSIONS)[number];

export const OBJECT_TYPES = [
  "Yacht",
  "Superyacht",
  "Marina",
  "Private Island / Estate",
  "Port",
  "Fleet",
  "Special Deployment",
  "Other",
] as const;

export const INFRA_KEYS = [
  "radar",
  "cameras",
  "ais",
  "sonar",
  "sensors",
  "access",
  "comms",
  "network",
  "other",
] as const;

export const INFRA_STATUSES = [
  "existing",
  "integrate",
  "replace",
  "new",
  "unknown",
] as const;

export type Money = number | null;

export type QuoteLineInput = {
  category: string;
  name: string;
  billingType: string;
  quantity: number;
  listPrice: Money;
  internalCost: Money;
  minimumPrice: Money;
  unitPrice: Money;
  discountPct: number;
  inclusion: Inclusion | string;
};

export type ExpenseInput = {
  travel: number;
  hotel: number;
  airfare: number;
  ground: number;
  shipping: number;
  other: number;
};
