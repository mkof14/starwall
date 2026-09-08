import Link from "next/link";
import type { ReactNode } from "react";

const LINKS = [
  { href: "/admin/starwall/pricing", label: "Dashboard" },
  { href: "/admin/starwall/pricing/book", label: "Price Book" },
  { href: "/admin/starwall/pricing/quotes/new", label: "New Quote" },
];

export function DeskShell({
  title,
  children,
  role,
}: {
  title: string;
  children: ReactNode;
  role?: string;
}) {
  return (
    <div className="bg-page text-ink">
      <div className="border-b border-stroke">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div>
            <p className="font-ui text-[11px] tracking-wide text-orange">
              Internal · StarWall commercial
            </p>
            <h1 className="font-heading text-2xl font-bold">{title}</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted hover:text-ink">
                {link.label}
              </Link>
            ))}
            {role ? <span className="font-mono text-[11px] text-muted">{role}</span> : null}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</div>
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

export function Warning({ state }: { state?: string }) {
  if (!state || state === "NORMAL") return <span className="text-muted">NORMAL</span>;
  if (state === "BELOW MINIMUM") return <span className="text-crit">BELOW MINIMUM</span>;
  return <span className="text-attn">REVIEW REQUIRED</span>;
}
