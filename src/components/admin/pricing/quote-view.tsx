"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { DeskShell, Warning, moneyLabel } from "@/components/admin/pricing/desk-shell";
import { deskPaths } from "@/lib/price-book/paths";
import { INFRA_KEYS, INFRA_STATUSES, QUOTE_STATUSES } from "@/lib/price-book/types";

type Line = {
  id: string;
  priceItemId: string | null;
  category: string;
  name: string;
  billingType: string;
  quantity: number;
  unit: string;
  listPrice: number | null;
  unitPrice: number | null;
  discountPct: number;
  customerPrice: number | null;
  inclusion: string;
  engineeringHours: number | null;
  notes: string;
  internalCost?: number | null;
};

type BookItem = {
  id: string;
  name: string;
  category: string;
  listPrice: number | null;
  priceStatus: string;
  active: boolean;
};

type QuotePayload = {
  quote: {
    id: string;
    number: string;
    version: number;
    status: string;
    plan: string;
    objectType: string;
    objectName: string;
    objectSize: string;
    location: string;
    siteCount: number;
    vesselCount: number;
    objectNotes: string;
    infrastructure: string;
    opportunityId: string;
    approvalState: string;
    overallDiscount: number | null;
    expenses: Record<string, number>;
    rfp: {
      number: string;
      reference: string;
      deadline: string;
      requirements: string;
    };
    customer: { name: string; company: string; email: string; phone: string; country: string; contact: string };
    items: Line[];
    versions: Array<{ id: string; version: number; note: string; createdAt: string }>;
    priceBook: { version: string };
  };
  totals: {
    softwareAnnual?: number;
    oneTime?: number;
    year1?: number;
    annualRecurring?: number;
    expenses?: number;
    missingPrices?: number;
    approvalState?: string;
    year1Cost?: number;
    year1Profit?: number;
    year1Margin?: number | null;
    recurringRevenue?: number;
    recurringCost?: number;
    recurringMargin?: number | null;
    revenue?: { software: number; hardware: number; services: number; support: number };
    cost?: { software: number; hardware: number; labor: number; travel: number; support: number; other: number };
  };
};

export function QuoteDeskView({ quoteId }: { quoteId: string }) {
  const [role, setRole] = useState("");
  const [data, setData] = useState<QuotePayload | null>(null);
  const [book, setBook] = useState<BookItem[]>([]);
  const [error, setError] = useState("");
  const [addId, setAddId] = useState("");
  const [infra, setInfra] = useState<Record<string, string>>({});

  const load = useCallback(async function load() {
    const [quoteRes, bookRes] = await Promise.all([
      fetch(`/api/admin/starwall/pricing/quotes/${quoteId}`),
      fetch("/api/admin/starwall/pricing/book"),
    ]);
    if (quoteRes.status === 403 || bookRes.status === 403) {
      setError("No commercial access.");
      return;
    }
    if (!quoteRes.ok) {
      setError("Quote not found.");
      return;
    }
    const quoteJson = (await quoteRes.json()) as QuotePayload;
    setData(quoteJson);
    try {
      const parsed = JSON.parse(quoteJson.quote.infrastructure) as Record<string, string>;
      setInfra(parsed && typeof parsed === "object" ? parsed : {});
    } catch {
      setInfra({});
    }
    if (bookRes.ok) {
      const bookJson = (await bookRes.json()) as { role: string; items: BookItem[] };
      setRole(bookJson.role);
      setBook(bookJson.items.filter((item) => item.active));
    }
  }, [quoteId]);

  useEffect(() => {
    void load();
  }, [load]);

  const addable = useMemo(() => book.filter((item) => item.category !== "LICENSE" || item.name.includes(data?.quote.plan ?? "")), [book, data]);

  async function patchQuote(body: Record<string, unknown>) {
    await fetch(`/api/admin/starwall/pricing/quotes/${quoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await load();
  }

  async function addItem() {
    if (!addId) return;
    await patchQuote({ action: "add-item", priceItemId: addId });
    setAddId("");
  }

  if (error) {
    return (
      <DeskShell title="Quote">
        <p className="text-sm text-crit">{error}</p>
      </DeskShell>
    );
  }
  if (!data) {
    return (
      <DeskShell title="Quote">
        <p className="text-sm text-muted">Loading…</p>
      </DeskShell>
    );
  }

  const { quote, totals } = data;
  const admin = role === "admin";
  const sales = role === "admin" || role === "sales";

  return (
    <DeskShell title={`${quote.number} · v${quote.version}`} role={role}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {quote.customer.name} · {quote.objectType} · {quote.plan} · book {quote.priceBook.version}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={deskPaths.proposal(quote.id)} className="text-orange">
            Preview customer proposal
          </Link>
          <select
            className="border-b border-stroke bg-transparent"
            value={quote.status}
            onChange={(event) => void patchQuote({ status: event.target.value })}
          >
            {QUOTE_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          {admin && quote.approvalState === "BELOW MINIMUM" ? (
            <button
              type="button"
              className="bg-orange px-3 py-1 text-white"
              onClick={() => void patchQuote({ action: "approve" })}
            >
              Approve floor
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Year 1" value={moneyLabel(totals.year1)} />
        <Summary label="Annual recurring" value={moneyLabel(totals.annualRecurring)} />
        <Summary label="One-time" value={moneyLabel(totals.oneTime)} />
        <Summary label="Floor" value={<Warning state={quote.approvalState} />} />
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold">Existing infrastructure</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INFRA_KEYS.map((key) => (
            <label key={key} className="text-sm">
              {key}
              <select
                className="mt-1 w-full border-b border-stroke bg-transparent py-1"
                value={infra[key] ?? "unknown"}
                onChange={(event) => {
                  const next = { ...infra, [key]: event.target.value };
                  setInfra(next);
                  void patchQuote({ infrastructure: JSON.stringify(next) });
                }}
              >
                {INFRA_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold">Configuration lines</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            className="min-w-[16rem] border-b border-stroke bg-transparent py-1 text-sm"
            value={addId}
            onChange={(event) => setAddId(event.target.value)}
          >
            <option value="">Add from price book…</option>
            {addable.map((item) => (
              <option key={item.id} value={item.id}>
                {item.category} · {item.name} · {item.priceStatus === "PRICED" ? moneyLabel(item.listPrice) : "PRICE REQUIRED"}
              </option>
            ))}
          </select>
          <button type="button" className="border border-stroke px-3 py-1 text-sm" onClick={() => void addItem()}>
            Add line
          </button>
        </div>
        <div className="mt-4 overflow-x-auto border-y border-stroke">
          <table className="w-full min-w-[60rem] text-start text-sm">
            <thead>
              <tr className="border-b border-stroke">
                <th className="py-2 pe-3 text-start">Line</th>
                <th className="py-2 pe-3 text-start">Incl.</th>
                <th className="py-2 pe-3 text-start">Qty</th>
                <th className="py-2 pe-3 text-start">List</th>
                {sales ? <th className="py-2 pe-3 text-start">Disc %</th> : null}
                <th className="py-2 pe-3 text-start">Customer</th>
                {admin ? <th className="py-2 pe-3 text-start">Cost</th> : null}
                <th className="py-2 text-start"> </th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((line) => (
                <tr key={line.id} className="border-t border-stroke align-top">
                  <td className="py-2 pe-3">
                    <p className="font-medium">{line.name}</p>
                    <p className="text-xs text-muted">
                      {line.category} · {line.billingType}
                    </p>
                  </td>
                  <td className="py-2 pe-3">{line.inclusion}</td>
                  <td className="py-2 pe-3">
                    <input
                      className="w-16 border-b border-stroke bg-transparent"
                      type="number"
                      defaultValue={line.quantity}
                      onBlur={(event) =>
                        void patchQuote({
                          action: "patch-item",
                          itemId: line.id,
                          quantity: Number(event.target.value),
                        })
                      }
                    />
                  </td>
                  <td className="py-2 pe-3">{moneyLabel(line.listPrice)}</td>
                  {sales ? (
                    <td className="py-2 pe-3">
                      <input
                        className="w-16 border-b border-stroke bg-transparent"
                        type="number"
                        defaultValue={line.discountPct}
                        onBlur={(event) =>
                          void patchQuote({
                            action: "patch-item",
                            itemId: line.id,
                            discountPct: Number(event.target.value),
                          })
                        }
                      />
                    </td>
                  ) : null}
                  <td className="py-2 pe-3">{moneyLabel(line.customerPrice)}</td>
                  {admin ? <td className="py-2 pe-3">{moneyLabel(line.internalCost)}</td> : null}
                  <td className="py-2">
                    <button
                      type="button"
                      className="text-xs text-muted"
                      onClick={() => void patchQuote({ action: "remove-item", itemId: line.id })}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-xl font-bold">Travel and expenses</h2>
          <p className="mt-1 text-xs text-muted">Not included in professional service rates.</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {Object.entries(quote.expenses).map(([key, value]) => (
              <label key={key} className="text-sm capitalize">
                {key}
                <input
                  className="mt-1 w-full border-b border-stroke bg-transparent py-1"
                  type="number"
                  defaultValue={value}
                  onBlur={(event) =>
                    void patchQuote({
                      [`${key}Expense`]: Number(event.target.value),
                    })
                  }
                />
              </label>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold">Discounts</h2>
          <label className="mt-3 block text-sm">
            Overall quote discount %
            <input
              className="mt-1 w-full border-b border-stroke bg-transparent py-1"
              type="number"
              defaultValue={quote.overallDiscount ?? 0}
              disabled={!sales}
              onBlur={(event) => void patchQuote({ overallDiscount: Number(event.target.value) })}
            />
          </label>
          <p className="mt-3 text-sm">
            Floor: <Warning state={quote.approvalState} />
          </p>
          {totals.missingPrices ? (
            <p className="mt-2 text-sm text-attn">{totals.missingPrices} line(s) still PRICE REQUIRED.</p>
          ) : null}
        </div>
      </section>

      {admin && totals.year1Cost !== undefined ? (
        <section className="mt-10 border-t border-stroke pt-8">
          <h2 className="font-heading text-xl font-bold">Internal profitability</h2>
          <p className="text-xs text-muted">Never shown on the customer proposal.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Summary label="Year 1 revenue" value={moneyLabel(totals.year1)} />
            <Summary label="Year 1 cost" value={moneyLabel(totals.year1Cost)} />
            <Summary label="Year 1 profit" value={moneyLabel(totals.year1Profit)} />
            <Summary label="Year 1 margin" value={totals.year1Margin == null ? "—" : `${totals.year1Margin}%`} />
            <Summary label="Recurring revenue" value={moneyLabel(totals.recurringRevenue)} />
            <Summary label="Recurring margin" value={totals.recurringMargin == null ? "—" : `${totals.recurringMargin}%`} />
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold">RFP (structure only)</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            RFP number
            <input
              className="mt-1 w-full border-b border-stroke bg-transparent py-1"
              defaultValue={quote.rfp.number}
              onBlur={(event) => void patchQuote({ rfpNumber: event.target.value })}
            />
          </label>
          <label className="text-sm">
            Customer RFP reference
            <input
              className="mt-1 w-full border-b border-stroke bg-transparent py-1"
              defaultValue={quote.rfp.reference}
              onBlur={(event) => void patchQuote({ rfpReference: event.target.value })}
            />
          </label>
        </div>
      </section>
    </DeskShell>
  );
}

function Summary({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border border-stroke px-4 py-3">
      <p className="font-ui text-[11px] text-muted">{label}</p>
      <div className="mt-1 font-heading text-2xl font-bold">{value}</div>
    </div>
  );
}
