import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="bg-page text-ink">{children}</div>;
}

export function PageHero({
  kicker,
  title,
  lead,
  preface,
  children,
  aside,
}: {
  kicker: string;
  title: string;
  lead?: ReactNode;
  preface?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="chart-grid pointer-events-none absolute inset-0" />
      <div
        className={cn(
          "relative mx-auto max-w-6xl px-4 py-14 md:px-6 lg:py-20",
          aside
            ? "grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
            : undefined,
        )}
      >
        <div className="space-y-5">
          {preface}
          <p className="font-ui text-[12px] tracking-wide text-orange">{kicker}</p>
          <h1 className="max-w-[14ch] font-heading text-[5rem] font-bold leading-[0.95] text-ink sm:text-[6rem]">
            {title}
          </h1>
          {lead ? (
            <div className="max-w-xl text-[1.05rem] leading-[1.7] text-ink/80">{lead}</div>
          ) : null}
          {children}
        </div>
        {aside ? <div className="relative lg:pt-4">{aside}</div> : null}
      </div>
    </section>
  );
}

export function PageBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-6xl space-y-14 px-4 pb-16 md:px-6", className)}>
      {children}
    </div>
  );
}

export function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-ui text-[12px] tracking-wide text-orange">{children}</p>
  );
}

export function SectionTitle({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mt-2 max-w-[22ch] font-heading text-3xl font-bold text-ink sm:text-4xl"
    >
      {children}
    </h2>
  );
}

export function NumberedGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-10 gap-y-8 border-t border-stroke pt-10 sm:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function NumberedItem({
  index,
  title,
  body,
  href,
  meta,
}: {
  index: number;
  title: ReactNode;
  body?: ReactNode;
  href?: string;
  meta?: ReactNode;
}) {
  const inner = (
    <>
      <p className="font-mono text-[11px] text-orange">
        {String(index).padStart(2, "0")}
        {meta ? <span className="ms-3 text-muted">{meta}</span> : null}
      </p>
      <h3 className="mt-1 font-heading text-2xl font-bold text-ink group-hover:text-orange">
        {title}
      </h3>
      {body ? (
        <div className="mt-2 max-w-md text-sm leading-relaxed text-muted">{body}</div>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group block">
        {inner}
      </Link>
    );
  }

  return <article>{inner}</article>;
}

export function RuleList({ children }: { children: ReactNode }) {
  return (
    <div className="divide-y divide-stroke border-y border-stroke">{children}</div>
  );
}

export function RuleRow({
  title,
  body,
}: {
  title: ReactNode;
  body: ReactNode;
}) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8">
      <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
      <div className="text-sm leading-relaxed text-muted">{body}</div>
    </div>
  );
}

export function OrangeRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-xl space-y-3 border-s-2 border-orange ps-4 text-sm leading-relaxed text-muted sm:text-[15px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LogTable({
  columns,
  rows,
}: {
  columns: [string, string];
  rows: Array<{ name: string; value: string }>;
}) {
  return (
    <div className="overflow-x-auto border-y border-stroke">
      <table className="w-full min-w-[32rem] text-start text-sm">
        <thead className="bg-navy text-sand">
          <tr>
            <th className="px-0 py-3 pe-6 font-heading text-base font-bold">
              {columns[0]}
            </th>
            <th className="px-0 py-3 font-heading text-base font-bold">
              {columns[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-stroke align-top">
              <th className="py-3 pe-6 font-heading text-base font-semibold text-ink">
                {row.name}
              </th>
              <td className="py-3 text-muted">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
