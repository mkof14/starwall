"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  PLAN_ORDER,
  categoryLook,
  planLook,
  plansFromList,
  statusTone,
} from "@/lib/price-book/desk-visual";
import { deskPaths } from "@/lib/price-book/paths";

const LINKS = [
  { href: deskPaths.root, label: "Deals" },
  { href: deskPaths.book, label: "Prices" },
  { href: deskPaths.newQuote, label: "New quote" },
];

export function DeskShell({
  title,
  children,
  role,
  actions,
  plan,
}: {
  title: string;
  children: ReactNode;
  role?: string;
  actions?: ReactNode;
  plan?: string;
}) {
  const pathname = usePathname();
  const look = plan ? planLook(plan) : null;

  return (
    <div className="bg-page text-ink">
      <PlanRibbon />
      <div className="border-b border-stroke bg-panel">
        <div className="mx-auto flex max-w-[88rem] flex-wrap items-end justify-between gap-4 px-4 py-5 md:px-6">
          <div className="min-w-0">
            <p className="font-ui text-[12px] uppercase tracking-[0.18em] text-muted">
              Closed Plans · commercial desk
            </p>
            <h1 className="mt-1 font-heading text-5xl font-bold leading-none sm:text-6xl">{title}</h1>
            {look ? (
              <p className={`mt-3 font-heading text-3xl font-bold ${look.text}`}>{look.label}</p>
            ) : null}
          </div>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Commercial desk">
            {LINKS.map((link) => {
              const active =
                link.href === deskPaths.root
                  ? pathname === deskPaths.root
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 font-heading text-lg font-bold ${
                    active ? "bg-navy text-sand" : "bg-page text-ink hover:bg-stroke/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href={deskPaths.catalog} className="px-3 py-2 text-sm text-muted hover:text-ink">
              Public Plans
            </Link>
            {role ? (
              <span className="font-mono text-[11px] uppercase text-muted">{role}</span>
            ) : null}
          </nav>
        </div>
        {actions ? (
          <div className="border-t border-stroke">
            <div className="mx-auto flex max-w-[88rem] flex-wrap items-center gap-3 px-4 py-3 md:px-6">
              {actions}
            </div>
          </div>
        ) : null}
      </div>
      <div className="mx-auto max-w-[88rem] px-4 py-8 md:px-6">{children}</div>
    </div>
  );
}

export function PlanRibbon() {
  return (
    <div className="flex h-3 w-full" aria-hidden>
      {PLAN_ORDER.map((plan) => (
        <span key={plan} className={`block min-w-0 flex-1 ${planLook(plan).bar}`} title={plan} />
      ))}
    </div>
  );
}

export function moneyLabel(value: number | null | undefined) {
  if (value === null || value === undefined) return "PRICE REQUIRED";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PlanMark({ plan, size = "md" }: { plan: string; size?: "md" | "lg" }) {
  const look = planLook(plan);
  return (
    <span
      className={`inline-flex items-center gap-2 font-heading font-bold uppercase tracking-wide ${look.solid} ${
        size === "lg" ? "px-3 py-1 text-xl" : "px-2 py-0.5 text-base"
      }`}
    >
      {look.label}
    </span>
  );
}

export function PlanWord({ plan, className = "" }: { plan: string; className?: string }) {
  const look = planLook(plan);
  return <span className={`font-heading font-bold ${look.text} ${className}`}>{look.label}</span>;
}

export function PlanDots({ plans }: { plans?: string }) {
  const list = plansFromList(plans);
  if (!list.length) return null;
  return (
    <span className="inline-flex items-center gap-1">
      {list.map((plan) => (
        <span key={plan} className={`h-3 w-3 ${planLook(plan).bar}`} title={plan} />
      ))}
    </span>
  );
}

export function StatusStamp({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-1 font-ui text-sm uppercase tracking-wider ${statusTone(status)}`}>
      {status}
    </span>
  );
}

export function CategoryChip({ category }: { category: string }) {
  const look = categoryLook(category);
  return (
    <span className={`inline-block px-2 py-1 font-ui text-sm uppercase tracking-wider ${look.tone}`}>
      {look.label}
    </span>
  );
}

export function FloorMark({ state }: { state?: string }) {
  if (!state || state === "NORMAL") {
    return <span className="font-ui text-xs uppercase tracking-wider text-[#1B8F4E]">Floor clear</span>;
  }
  if (state === "BELOW MINIMUM") {
    return <span className="font-ui text-xs uppercase tracking-wider text-crit">Below floor</span>;
  }
  return <span className="font-ui text-xs uppercase tracking-wider text-[#C98900]">Needs review</span>;
}

export function Money({
  value,
  size = "md",
}: {
  value: number | null | undefined;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const missing = value === null || value === undefined;
  const cls =
    size === "xl"
      ? "font-heading text-6xl font-bold leading-none sm:text-7xl"
      : size === "lg"
        ? "font-heading text-4xl font-bold leading-none sm:text-5xl"
        : size === "sm"
          ? "font-heading text-2xl font-bold"
          : "font-heading text-3xl font-bold";
  return <span className={`${cls} ${missing ? "text-[#C98900]" : "text-ink"}`}>{moneyLabel(value)}</span>;
}

export function Warning({ state }: { state?: string }) {
  return <FloorMark state={state} />;
}

export function PlanFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (plan: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("ALL")}
        className={`px-3 py-1.5 font-heading text-base font-bold ${
          value === "ALL" ? "bg-navy text-sand" : "bg-panel text-muted"
        }`}
      >
        All
      </button>
      {PLAN_ORDER.map((plan) => {
        const look = planLook(plan);
        return (
          <button
            key={plan}
            type="button"
            onClick={() => onChange(plan)}
            className={`px-3 py-1.5 font-heading text-base font-bold ${
              value === plan ? look.solid : `${look.wash} ${look.text}`
            }`}
          >
            {look.label}
          </button>
        );
      })}
    </div>
  );
}
