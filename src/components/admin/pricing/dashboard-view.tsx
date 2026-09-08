"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DeskShell, Warning, moneyLabel } from "@/components/admin/pricing/desk-shell";

type Dash = {
  role: string;
  counts: { active: number; awaitingApproval: number; sent: number; accepted: number };
  pipeline: number;
  annualRecurring: number;
  recent: Array<{
    id: string;
    number: string;
    version: number;
    customer: string;
    object: string;
    plan: string;
    year1: number | null;
    annualRecurring: number | null;
    status: string;
    approvalState: string;
    ownerId: string;
    margin?: number | null;
  }>;
};

export function PricingDashboardView() {
  const [data, setData] = useState<Dash | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/starwall/pricing/quotes?view=dashboard")
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 403 ? "No commercial access." : "Could not load.");
        setData((await res.json()) as Dash);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <DeskShell title="Price Book">
        <p className="text-sm text-crit">{error}</p>
      </DeskShell>
    );
  }
  if (!data) {
    return (
      <DeskShell title="Price Book">
        <p className="text-sm text-muted">Loading commercial desk…</p>
      </DeskShell>
    );
  }

  const cards = [
    { label: "Active quotes", value: String(data.counts.active) },
    { label: "Awaiting approval", value: String(data.counts.awaitingApproval) },
    { label: "Sent", value: String(data.counts.sent) },
    { label: "Accepted", value: String(data.counts.accepted) },
    { label: "Pipeline Year 1", value: moneyLabel(data.pipeline) },
    { label: "Annual recurring", value: moneyLabel(data.annualRecurring) },
  ];

  return (
    <DeskShell title="StarWall commercial desk" role={data.role}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="border border-stroke px-4 py-3">
            <p className="font-ui text-[11px] text-muted">{card.label}</p>
            <p className="mt-1 font-heading text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 overflow-x-auto border-y border-stroke">
        <table className="w-full min-w-[52rem] text-start text-sm">
          <thead>
            <tr className="border-b border-stroke">
              <th className="py-2 pe-3 text-start">Quote</th>
              <th className="py-2 pe-3 text-start">Customer</th>
              <th className="py-2 pe-3 text-start">Object</th>
              <th className="py-2 pe-3 text-start">Plan</th>
              <th className="py-2 pe-3 text-start">Year 1</th>
              <th className="py-2 pe-3 text-start">Recurring</th>
              {data.role === "admin" ? <th className="py-2 pe-3 text-start">Margin</th> : null}
              <th className="py-2 pe-3 text-start">Status</th>
              <th className="py-2 text-start">Floor</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-muted">
                  No quotes yet. Open New Quote to start a commercial record.
                </td>
              </tr>
            ) : (
              data.recent.map((row) => (
                <tr key={row.id} className="border-t border-stroke">
                  <td className="py-2 pe-3">
                    <Link href={`/admin/starwall/pricing/quotes/${row.id}`} className="text-orange">
                      {row.number} v{row.version}
                    </Link>
                  </td>
                  <td className="py-2 pe-3">{row.customer}</td>
                  <td className="py-2 pe-3">{row.object}</td>
                  <td className="py-2 pe-3">{row.plan}</td>
                  <td className="py-2 pe-3">{moneyLabel(row.year1)}</td>
                  <td className="py-2 pe-3">{moneyLabel(row.annualRecurring)}</td>
                  {data.role === "admin" ? (
                    <td className="py-2 pe-3">
                      {row.margin === null || row.margin === undefined ? "—" : `${row.margin}%`}
                    </td>
                  ) : null}
                  <td className="py-2 pe-3">{row.status}</td>
                  <td className="py-2">
                    <Warning state={row.approvalState} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DeskShell>
  );
}
