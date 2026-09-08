"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  DeskShell,
  FloorMark,
  Money,
  PlanFilter,
  PlanMark,
  PlanWord,
  StatusStamp,
  moneyLabel,
} from "@/components/admin/pricing/desk-ui";
import { BOARD_LANES, PLAN_ORDER, laneForStatus, planLook } from "@/lib/price-book/desk-visual";
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

  const filtered = useMemo(() => {
    const tickets = data?.quotes?.length ? data.quotes : data?.recent ?? [];
    const q = query.trim().toLowerCase();
    return tickets.filter((row) => {
      if (plan !== "ALL" && row.plan !== plan) return false;
      if (!q) return true;
      return [row.number, row.customer, row.company, row.object, row.location, row.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [data, query, plan]);

  if (error) {
    return (
      <DeskShell title="Deals">
        <p className="text-lg text-crit">{error}</p>
      </DeskShell>
    );
  }
  if (!data) {
    return (
      <DeskShell title="Deals">
        <p className="text-lg text-muted">Opening deals…</p>
      </DeskShell>
    );
  }

  const all = data.quotes?.length ? data.quotes : data.recent;
  const byPlan = PLAN_ORDER.map((id) => {
    const rows = all.filter((row) => row.plan === id && !["DECLINED", "EXPIRED"].includes(row.status));
    return {
      id,
      count: rows.length,
      year1: rows.reduce((sum, row) => sum + (row.year1 ?? 0), 0),
    };
  });

  return (
    <DeskShell title="Deals">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          data-testid="desk-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, yacht, marina, ticket number…"
          className="min-w-0 flex-1 border-b-2 border-stroke bg-transparent py-2 text-lg focus:border-navy focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("board")}
            className={`px-4 py-2 font-heading text-lg font-bold ${view === "board" ? "bg-navy text-sand" : "bg-panel"}`}
          >
            Board
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`px-4 py-2 font-heading text-lg font-bold ${view === "list" ? "bg-navy text-sand" : "bg-panel"}`}
          >
            List
          </button>
          <Link href={deskPaths.newQuote} className="bg-navy px-4 py-2 font-heading text-lg font-bold text-sand">
            New quote
          </Link>
        </div>
      </div>

      <PlanFilter value={plan} onChange={setPlan} />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {byPlan.map((row) => {
          const look = planLook(row.id);
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => setPlan(plan === row.id ? "ALL" : row.id)}
              className={`text-start ${look.wash} p-5`}
            >
              <p className={`font-heading text-2xl font-bold ${look.text}`}>{row.id}</p>
              <p className="mt-3 font-heading text-5xl font-bold leading-none">{moneyLabel(row.year1 || null)}</p>
              <p className="mt-2 text-base text-muted">{row.count} open</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="bg-panel p-5">
          <p className="text-base text-muted">All open Year 1</p>
          <Money value={data.pipeline} size="lg" />
        </div>
        <div className="bg-panel p-5">
          <p className="text-base text-muted">If they stay, each year</p>
          <Money value={data.annualRecurring} size="lg" />
        </div>
        <div className="bg-panel p-5">
          <p className="text-base text-muted">Live / checking / sent</p>
          <p className="font-heading text-5xl font-bold leading-none">
            {data.counts.active}
            <span className="text-2xl text-muted">
              {" "}
              / {data.counts.awaitingApproval} / {data.counts.sent}
            </span>
          </p>
        </div>
      </div>

      {view === "board" ? (
        <div className="mt-10 grid gap-6 xl:grid-cols-4">
          {BOARD_LANES.map((lane) => {
            const rows = filtered.filter((row) => laneForStatus(row.status).id === lane.id);
            const sum = rows.reduce((acc, row) => acc + (row.year1 ?? 0), 0);
            return (
              <section key={lane.id} className="min-w-0">
                <header className="mb-4">
                  <h2 className="font-heading text-3xl font-bold">{lane.title}</h2>
                  <p className="text-base text-muted">
                    {lane.hint} · {moneyLabel(sum || null)}
                  </p>
                </header>
                <div className="space-y-4">
                  {rows.length === 0 ? (
                    <p className="text-base text-muted">Nothing here.</p>
                  ) : (
                    rows.map((row) => <TicketCard key={row.id} row={row} admin={data.role === "admin"} />)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-lg text-muted">No deals match. Open New quote.</p>
          ) : (
            filtered.map((row) => (
              <Link
                key={row.id}
                href={deskPaths.quote(row.id)}
                className="flex flex-wrap items-center gap-4 bg-panel p-4 hover:ring-2 hover:ring-navy"
              >
                <span className={`h-14 w-1.5 ${planLook(row.plan).bar}`} />
                <div className="min-w-[12rem] flex-1">
                  <p className="font-heading text-3xl font-bold leading-tight">{row.customer}</p>
                  <p className="text-base text-muted">
                    {row.number} · {row.object}
                    {row.location ? ` · ${row.location}` : ""}
                  </p>
                </div>
                <PlanWord plan={row.plan} className="text-2xl" />
                <Money value={row.year1} size="sm" />
                <StatusStamp status={row.status} />
              </Link>
            ))
          )}
        </div>
      )}
    </DeskShell>
  );
}

function TicketCard({ row, admin }: { row: Ticket; admin: boolean }) {
  const look = planLook(row.plan);
  return (
    <Link
      href={deskPaths.quote(row.id)}
      data-testid={`desk-ticket-${row.number}`}
      className={`block ${look.wash} p-4 hover:ring-2 ${look.ring}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-sm text-muted">{row.number}</p>
        <StatusStamp status={row.status} />
      </div>
      <p className="mt-2 font-heading text-3xl font-bold leading-tight">{row.customer}</p>
      <p className="mt-1 text-base text-muted">
        {row.object}
        {row.location ? ` · ${row.location}` : ""}
      </p>
      <PlanMark plan={row.plan} size="lg" />
      <div className="mt-3 flex items-end justify-between gap-2">
        <Money value={row.year1} size="sm" />
        {admin && row.margin != null ? (
          <span className="text-sm text-muted">{row.margin}%</span>
        ) : (
          <FloorMark state={row.approvalState} />
        )}
      </div>
    </Link>
  );
}
