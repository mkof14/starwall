import { LICENSE_PRICES } from "@/lib/price-book/catalog";
import { QUOTE_STATUSES, STARWALL_PLANS } from "@/lib/price-book/types";

export type PlanLook = {
  label: string;
  hex: string;
  text: string;
  wash: string;
  solid: string;
  bar: string;
  ring: string;
};

/** Four plan colours — used on every desk surface. Not brand-orange only. */
export const PLAN_LOOK: Record<string, PlanLook> = {
  LIGHT: {
    label: "LIGHT",
    hex: "#0E8FA8",
    text: "text-[#0E8FA8]",
    wash: "bg-[#D3F1F6] dark:bg-[#10343B]",
    solid: "bg-[#0E8FA8] text-white",
    bar: "bg-[#0E8FA8]",
    ring: "ring-[#0E8FA8]",
  },
  ADVANCED: {
    label: "ADVANCED",
    hex: "#1B8F4E",
    text: "text-[#1B8F4E]",
    wash: "bg-[#D4F3E2] dark:bg-[#123424]",
    solid: "bg-[#1B8F4E] text-white",
    bar: "bg-[#1B8F4E]",
    ring: "ring-[#1B8F4E]",
  },
  INTELLIGENCE: {
    label: "INTELLIGENCE",
    hex: "#C98900",
    text: "text-[#C98900]",
    wash: "bg-[#F8E9C2] dark:bg-[#3A2C0C]",
    solid: "bg-[#C98900] text-white",
    bar: "bg-[#C98900]",
    ring: "ring-[#C98900]",
  },
  CUSTOM: {
    label: "CUSTOM",
    hex: "#7A3E8C",
    text: "text-[#7A3E8C] dark:text-[#C9A0D6]",
    wash: "bg-[#EEDCF4] dark:bg-[#2E1A36]",
    solid: "bg-[#7A3E8C] text-white",
    bar: "bg-[#7A3E8C]",
    ring: "ring-[#7A3E8C]",
  },
};

export const PLAN_ORDER = [...STARWALL_PLANS];

export const CATEGORY_LOOK: Record<string, { label: string; tone: string }> = {
  LICENSE: { label: "License", tone: "bg-[#F8E9C2] text-[#8A5F00]" },
  INTEGRATION: { label: "Integration", tone: "bg-[#D3F1F6] text-[#0E8FA8]" },
  HARDWARE: { label: "Hardware", tone: "bg-[#E8DDD2] text-[#6B4A2A]" },
  DEPLOYMENT: { label: "Deployment", tone: "bg-[#DDE8C8] text-[#4A5420]" },
  ENGINEERING: { label: "Engineering", tone: "bg-[#EEDCF4] text-[#7A3E8C]" },
  TRAINING: { label: "Training", tone: "bg-[#D4F3E2] text-[#1B8F4E]" },
  SUPPORT: { label: "Support", tone: "bg-[#F3E2C8] text-[#8A4B12]" },
  MONITORING: { label: "Monitoring", tone: "bg-[#D7E4F5] text-[#1D4A7A]" },
  MULTI_SITE: { label: "Multi-site", tone: "bg-[#E8D9D2] text-[#6B3320]" },
  OPTIONAL: { label: "Optional", tone: "bg-panel text-muted" },
};

export const BOARD_LANES = [
  { id: "open", title: "Working", hint: "Drafts you are building", statuses: ["DRAFT", "REVISED"] },
  {
    id: "review",
    title: "Checking",
    hint: "Needs a person inside",
    statuses: ["ENGINEERING REVIEW", "PRICING REVIEW", "APPROVAL REQUIRED"],
  },
  {
    id: "out",
    title: "Sent",
    hint: "With the customer",
    statuses: ["APPROVED", "SENT", "CUSTOMER REVIEW"],
  },
  {
    id: "closed",
    title: "Done",
    hint: "Won, lost, expired",
    statuses: ["ACCEPTED", "DECLINED", "EXPIRED"],
  },
] as const;

export function planLook(plan: string) {
  return PLAN_LOOK[plan] ?? PLAN_LOOK.CUSTOM;
}

export function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
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
  if (status === "ACCEPTED") return "bg-[#1B8F4E] text-white";
  if (status === "DECLINED" || status === "EXPIRED") return "bg-crit text-white";
  if (status === "SENT" || status === "CUSTOMER REVIEW") return "bg-[#0E8FA8] text-white";
  if (status === "APPROVED") return "bg-[#1B8F4E] text-white";
  if (status === "APPROVAL REQUIRED" || status === "BELOW MINIMUM") return "bg-[#C98900] text-navy";
  if (status === "ENGINEERING REVIEW" || status === "PRICING REVIEW") return "bg-[#7A3E8C] text-white";
  return "bg-navy text-sand";
}

export function plansFromList(value?: string) {
  if (!value) return [];
  return value
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter((item): item is (typeof STARWALL_PLANS)[number] =>
      (STARWALL_PLANS as readonly string[]).includes(item),
    );
}

export const MOVABLE_STATUSES = QUOTE_STATUSES;
