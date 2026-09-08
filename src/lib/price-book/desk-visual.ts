import { LICENSE_PRICES } from "@/lib/price-book/catalog";
import { QUOTE_STATUSES } from "@/lib/price-book/types";

export const PLAN_LOOK: Record<
  string,
  { label: string; ink: string; wash: string; bar: string }
> = {
  LIGHT: {
    label: "LIGHT",
    ink: "text-[#2F5C73] dark:text-[#8EC4D8]",
    wash: "bg-[#D5E6EE] dark:bg-[#1A303C]",
    bar: "bg-[#2F5C73]",
  },
  ADVANCED: {
    label: "ADVANCED",
    ink: "text-[#0F6B55] dark:text-[#7ED9BE]",
    wash: "bg-[#D4F0E6] dark:bg-[#14362C]",
    bar: "bg-[#0F6B55]",
  },
  INTELLIGENCE: {
    label: "INTELLIGENCE",
    ink: "text-orange",
    wash: "bg-[#F8DFCC] dark:bg-[#3A2214]",
    bar: "bg-orange",
  },
  CUSTOM: {
    label: "CUSTOM",
    ink: "text-navy dark:text-sand",
    wash: "bg-[#E4DDD0] dark:bg-[#2A261E]",
    bar: "bg-navy dark:bg-sand",
  },
};

export const CATEGORY_LOOK: Record<string, { label: string; tone: string }> = {
  LICENSE: { label: "License", tone: "bg-[#F8DFCC] text-orange" },
  INTEGRATION: { label: "Integration", tone: "bg-[#D5E6EE] text-[#2F5C73]" },
  HARDWARE: { label: "Hardware", tone: "bg-[#E4DDD0] text-navy" },
  DEPLOYMENT: { label: "Deployment", tone: "bg-[#DDE3C8] text-[#4A5420]" },
  ENGINEERING: { label: "Engineering", tone: "bg-[#E4D8F0] text-[#4A2F6B]" },
  TRAINING: { label: "Training", tone: "bg-[#D4F0E6] text-[#0F6B55]" },
  SUPPORT: { label: "Support", tone: "bg-[#F3E2C8] text-[#8A4B12]" },
  MONITORING: { label: "Monitoring", tone: "bg-[#D7E4F5] text-[#1D4A7A]" },
  MULTI_SITE: { label: "Multi-site", tone: "bg-[#E8D9D2] text-[#6B3320]" },
  OPTIONAL: { label: "Optional", tone: "bg-panel text-muted" },
};

export const BOARD_LANES = [
  { id: "open", title: "Open", hint: "Being built", statuses: ["DRAFT", "REVISED"] },
  {
    id: "review",
    title: "In house",
    hint: "Engineering / pricing / floor",
    statuses: ["ENGINEERING REVIEW", "PRICING REVIEW", "APPROVAL REQUIRED"],
  },
  {
    id: "out",
    title: "With customer",
    hint: "Approved, sent, under review",
    statuses: ["APPROVED", "SENT", "CUSTOMER REVIEW"],
  },
  {
    id: "closed",
    title: "Closed",
    hint: "Won, lost, expired",
    statuses: ["ACCEPTED", "DECLINED", "EXPIRED"],
  },
] as const;

export function planLook(plan: string) {
  return PLAN_LOOK[plan] ?? PLAN_LOOK.CUSTOM;
}

export function categoryLook(category: string) {
  return CATEGORY_LOOK[category] ?? { label: category, tone: "bg-panel text-muted" };
}

export function licenseList(plan: string) {
  return LICENSE_PRICES[plan as keyof typeof LICENSE_PRICES] ?? null;
}

export function laneForStatus(status: string) {
  return BOARD_LANES.find((lane) => (lane.statuses as readonly string[]).includes(status)) ?? BOARD_LANES[0];
}

export function statusTone(status: string) {
  if (status === "ACCEPTED") return "bg-[#0F6B55] text-white";
  if (status === "DECLINED" || status === "EXPIRED") return "bg-crit text-white";
  if (status === "SENT" || status === "CUSTOMER REVIEW") return "bg-orange text-white";
  if (status === "APPROVED") return "bg-[#2F5C73] text-white";
  if (status === "APPROVAL REQUIRED" || status === "BELOW MINIMUM") return "bg-attn text-navy";
  if (status === "ENGINEERING REVIEW" || status === "PRICING REVIEW") return "bg-[#4A2F6B] text-white";
  return "bg-navy text-sand";
}

export const MOVABLE_STATUSES = QUOTE_STATUSES;
