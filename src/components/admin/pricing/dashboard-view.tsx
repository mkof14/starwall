"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  DeskShell,
  FloorMark,
  Money,
  PlanMark,
  StatusStamp,
  moneyLabel,
} from "@/components/admin/pricing/desk-ui";
import { BOARD_LANES, laneForStatus } from "@/lib/price-book/desk-visual";
import { deskPaths } from "@/lib/price-book/paths";

type Ticket = {
  id: string;
  number: string;
  version: number;
  customer: string;
  company?: string;
  object: string;
  objectType?: string;
  location?: string;
  plan: string;
  year1: number | null;
  annualRecurring: number | null;
  status: string;
  approvalState: string;
  ownerId: string;
  modifiedAt?: string;
  lines?: number;
  margin?: number | null;
};

type Dash = {
  role: string;
  counts: { active: number; awaitingApproval: number; sent: number; accepted: number };
  pipeline: number;
  annualRecurring: number;
  recent: Ticket[];
  quotes?: Ticket[];
};

export function PricingDashboardView() {
  const [data, setData] = useState<Dash | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState("ALL");
  const [view, setView] = useState<"board" | "list">("board");

  useEffect(() => {
    fetch("/api/admin/starwall/pricing/quotes?view=dashboard")
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 403 ? "No commercial access." : "Could not load.");
        setData((await res.json()) as Dash);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const tickets = data?.quotes?.length ? data.quotes : data?.recent ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((row) => {
      if (plan !== "ALL" && row.plan !== plan) return false;
      if (!q) return true;
      return [row.number, row.customer, row.company, row.object, row.location, row.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [tickets, query, plan]);

  if (error) {
    return (
      <DeskShell title="Commercial desk">
        <p className="text-sm text-crit">{error}</p>
      </DeskShell>
    );
  }
  if (!data) {
    return (
      <DeskShell title="Commercial desk">
        <p className="text-sm text-muted">Opening the desk…</p>
      </DeskShell>
    );
  }

  const hot = filtered.filter(
    (row) => row.approvalState === "BELOW MINIMUM" || row.status === "APPROVAL REQUIRED",
  ).length;

  return (
    <DeskShell
      title="StarWall commercial desk"
      role={data.role}
      actions={
        <>
          <input
            data-testid="desk-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a customer, ticket, yacht, marina…"
            className="min-w-[16rem] flex-1 border-b border-sand/25 bg-transparent py-1 text-sm text-sand placeholder:text-sand/40 focus:border-orange focus:outline-none"
          />
          <select
            value={plan}
            onChange={(event) => setPlan(event.target.value)}
            className="border-b border-sand/25 bg-transparent py-1 text-sm text-sand"
          >
            <option value="ALL">All plans</option>
            <option>LIGHT</option>
            <option>ADVANCED</option>
            <option>INTELLIGENCE</option>
            <option>CUSTOM</option>
          </select>
          <div className="flex border border-sand/25">
            <button
              type="button"
              onClick={() => setView("board")}
              className={`px-3 py-1 font-ui text-[10px] uppercase ${view === "board" ? "bg-orange text-white" : "text-sand/70"}`}
            >
              Board
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`px-3 py-1 font-ui text-[10px] uppercase ${view === "list" ? "bg-orange text-white" : "text-sand/70"}`}
            >
              Ledger
            </button>
          </div>
          <Link
            href={deskPaths.newQuote}
            className="bg-orange px-3 py-1.5 font-ui text-[11px] uppercase tracking-wider text-white"
          >
            New ticket
          </Link>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="relative overflow-hidden bg-navy px-5 py-5 text-sand">
          <span className="absolute inset-y-0 start-0 w-1 bg-orange" />
          <p className="font-ui text-[11px] uppercase tracking-[0.18em] text-orange">Open year-1 book</p>
          <p className="mt-2 font-heading text-5xl font-bold">{moneyLabel(data.pipeline)}</p>
          <p className="mt-2 text-sm text-sand/70">
            Recurring if they stay: {moneyLabel(data.annualRecurring)}
          </p>
        </div>
        <HeroStat label="Live tickets" value={String(data.counts.active)} hint="Not closed" />
        <HeroStat label="In house" value={String(data.counts.awaitingApproval)} hint="Needs a person" tone="attn" />
        <HeroStat label="With customer" value={String(data.counts.sent)} hint={`${data.counts.accepted} accepted`} tone="ok" />
      </div>

      {hot ? (
        <p className="mt-4 border border-attn/40 bg-[#F8DFCC] px-4 py-2 text-sm text-navy">
          {hot} ticket{hot === 1 ? "" : "s"} sit below floor or wait for approval. Open them before a PDF goes out.
        </p>
      ) : null}

      {view === "board" ? (
        <div className="mt-8 grid gap-4 xl:grid-cols-4">
          {BOARD_LANES.map((lane) => {
            const rows = filtered.filter((row) => laneForStatus(row.status).id === lane.id);
            const sum = rows.reduce((acc, row) => acc + (row.year1 ?? 0), 0);
            return (
              <section key={lane.id} className="min-w-0">
                <header className="mb-3 flex items-end justify-between gap-2 border-b border-stroke pb-2">
                  <div>
                    <h2 className="font-heading text-xl font-bold">{lane.title}</h2>
                    <p className="text-xs text-muted">{lane.hint}</p>
                  </div>
                  <p className="font-mono text-[11px] text-muted">
                    {rows.length} · {moneyLabel(sum || null)}
                  </p>
                </header>
                <div className="space-y-3">
                  {rows.length === 0 ? (
                    <p className="text-sm text-muted">Empty lane.</p>
                  ) : (
                    rows.map((row) => <TicketCard key={row.id} row={row} admin={data.role === "admin"} />)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border-y border-stroke">
          <table className="w-full min-w-[64rem] text-start text-sm">
            <thead>
              <tr className="border-b border-stroke">
                <th className="py-3 pe-3 text-start font-ui text-[11px] uppercase tracking-wider text-muted">Ticket</th>
                <th className="py-3 pe-3 text-start font-ui text-[11px] uppercase tracking-wider text-muted">Customer</th>
                <th className="py-3 pe-3 text-start font-ui text-[11px] uppercase tracking-wider text-muted">Object</th>
                <th className="py-3 pe-3 text-start font-ui text-[11px] uppercase tracking-wider text-muted">Plan</th>
                <th className="py-3 pe-3 text-start font-ui text-[11px] uppercase tracking-wider text-muted">Year 1</th>
                <th className="py-3 pe-3 text-start font-ui text-[11px] uppercase tracking-wider text-muted">Recurring</th>
                {data.role === "admin" ? (
                  <th className="py-3 pe-3 text-start font-ui text-[11px] uppercase tracking-wider text-muted">Margin</th>
                ) : null}
                <th className="py-3 pe-3 text-start font-ui text-[11px] uppercase tracking-wider text-muted">State</th>
                <th className="py-3 text-start font-ui text-[11px] uppercase tracking-wider text-muted">Floor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-muted">
                    No tickets match. Open New ticket to start a commercial record.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="border-t border-stroke">
                    <td className="py-3 pe-3">
                      <Link href={deskPaths.quote(row.id)} className="font-medium text-orange">
                        {row.number}
                      </Link>
                      <span className="ms-2 text-xs text-muted">v{row.version}</span>
                    </td>
                    <td className="py-3 pe-3">{row.customer}</td>
                    <td className="py-3 pe-3">
                      {row.object}
                      {row.location ? <span className="block text-xs text-muted">{row.location}</span> : null}
                    </td>
                    <td className="py-3 pe-3">
                      <PlanMark plan={row.plan} />
                    </td>
                    <td className="py-3 pe-3">{moneyLabel(row.year1)}</td>
                    <td className="py-3 pe-3">{moneyLabel(row.annualRecurring)}</td>
                    {data.role === "admin" ? (
                      <td className="py-3 pe-3">
                        {row.margin === null || row.margin === undefined ? "—" : `${row.margin}%`}
                      </td>
                    ) : null}
                    <td className="py-3 pe-3">
                      <StatusStamp status={row.status} />
                    </td>
                    <td className="py-3">
                      <FloorMark state={row.approvalState} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </DeskShell>
  );
}

function HeroStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "attn" | "ok";
}) {
  return (
    <div className="border border-stroke bg-panel px-4 py-4">
      <p className="font-ui text-[11px] uppercase tracking-wider text-muted">{label}</p>
      <p
        className={`mt-1 font-heading text-4xl font-bold ${
          tone === "attn" ? "text-attn" : tone === "ok" ? "text-[#0F6B55]" : "text-ink"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

function TicketCard({ row, admin }: { row: Ticket; admin: boolean }) {
  return (
    <Link
      href={deskPaths.quote(row.id)}
      data-testid={`desk-ticket-${row.number}`}
      className="block border border-stroke bg-panel hover:border-orange"
    >
      <span className={`block h-1 ${row.plan === "INTELLIGENCE" ? "bg-orange" : row.plan === "ADVANCED" ? "bg-[#0F6B55]" : row.plan === "LIGHT" ? "bg-[#2F5C73]" : "bg-navy"}`} />
      <div className="space-y-2 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-[11px] text-orange">{row.number}</p>
          <StatusStamp status={row.status} />
        </div>
        <p className="font-heading text-lg font-bold leading-tight">{row.customer}</p>
        <p className="text-xs text-muted">
          {row.object}
          {row.location ? ` · ${row.location}` : ""}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <PlanMark plan={row.plan} />
          <FloorMark state={row.approvalState} />
        </div>
        <div className="flex items-baseline justify-between gap-2 pt-1">
          <Money value={row.year1} size="sm" />
          {admin && row.margin != null ? (
            <span className="font-mono text-[10px] text-muted">{row.margin}% mgn</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
