"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  categoryLook,
  planLook,
  statusTone,
} from "@/lib/price-book/desk-visual";
import { deskPaths } from "@/lib/price-book/paths";
import { ISSUER } from "@/lib/price-book/issuer";

const LINKS = [
  { href: deskPaths.root, label: "Board", hint: "Pipeline" },
  { href: deskPaths.book, label: "Catalog", hint: "Price book" },
  { href: deskPaths.newQuote, label: "New ticket", hint: "Quote" },
];

export function DeskShell({
  title,
  children,
  role,
  actions,
}: {
  title: string;
  children: ReactNode;
  role?: string;
  actions?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="desk-surface bg-page text-ink">
      <div className="border-b border-stroke bg-navy text-sand">
        <div className="h-[3px] bg-orange" />
        <div className="mx-auto flex max-w-[88rem] flex-wrap items-end justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-orange">
              {ISSUER.mark} · closed desk
            </p>
            <h1 className="mt-1 font-heading text-3xl font-bold text-sand">{title}</h1>
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
                  className={`border px-3 py-1.5 font-ui text-[11px] uppercase tracking-wider ${
                    active
                      ? "border-orange bg-orange text-white"
                      : "border-sand/25 text-sand/80 hover:border-orange hover:text-sand"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href={deskPaths.catalog}
              className="border border-sand/25 px-3 py-1.5 font-ui text-[11px] uppercase tracking-wider text-sand/70 hover:text-sand"
            >
              Public Plans
            </Link>
            {role ? (
              <span className="ms-1 border border-orange/50 px-2 py-1 font-mono text-[10px] uppercase text-orange">
                {role}
              </span>
            ) : null}
          </nav>
        </div>
        {actions ? (
          <div className="border-t border-sand/15 bg-[#0A1016]">
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

export function moneyLabel(value: number | null | undefined) {
  if (value === null || value === undefined) return "PRICE REQUIRED";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PlanMark({ plan }: { plan: string }) {
  const look = planLook(plan);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 font-ui text-[10px] uppercase tracking-wider ${look.wash} ${look.ink}`}>
      <span className={`h-1.5 w-1.5 ${look.bar}`} />
      {look.label}
    </span>
  );
}

export function StatusStamp({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 font-ui text-[10px] uppercase tracking-wider ${statusTone(status)}`}>
      {status}
    </span>
  );
}

export function CategoryChip({ category }: { category: string }) {
  const look = categoryLook(category);
  return (
    <span className={`inline-block px-2 py-0.5 font-ui text-[10px] uppercase tracking-wider ${look.tone}`}>
      {look.label}
    </span>
  );
}

export function FloorMark({ state }: { state?: string }) {
  if (!state || state === "NORMAL") {
    return <span className="font-ui text-[10px] uppercase tracking-wider text-[#0F6B55]">Floor clear</span>;
  }
  if (state === "BELOW MINIMUM") {
    return <span className="font-ui text-[10px] uppercase tracking-wider text-crit">Below floor</span>;
  }
  return <span className="font-ui text-[10px] uppercase tracking-wider text-attn">Needs review</span>;
}

export function Money({
  value,
  size = "md",
}: {
  value: number | null | undefined;
  size?: "sm" | "md" | "lg";
}) {
  const missing = value === null || value === undefined;
  const cls =
    size === "lg"
      ? "font-heading text-3xl font-bold"
      : size === "sm"
        ? "font-mono text-sm"
        : "font-heading text-2xl font-bold";
  return (
    <span className={`${cls} ${missing ? "text-attn" : "text-ink"}`}>
      {moneyLabel(value)}
    </span>
  );
}

export function Warning({ state }: { state?: string }) {
  return <FloorMark state={state} />;
}
