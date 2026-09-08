"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CategoryChip,
  DeskShell,
  FloorMark,
  PlanMark,
  StatusStamp,
  moneyLabel,
} from "@/components/admin/pricing/desk-ui";
import { deskPaths } from "@/lib/price-book/paths";
import { INCLUSIONS, INFRA_KEYS, INFRA_STATUSES, QUOTE_STATUSES } from "@/lib/price-book/types";

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
  };
};

export function QuoteDeskView({ quoteId }: { quoteId: string }) {
  const [role, setRole] = useState("");
  const [data, setData] = useState<QuotePayload | null>(null);
  const [book, setBook] = useState<BookItem[]>([]);
  const [error, setError] = useState("");
  const [addQuery, setAddQuery] = useState("");
  const [pdfState, setPdfState] = useState("");
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

  const addable = useMemo(() => {
    const plan = data?.quote.plan ?? "";
    return book
      .filter((item) => item.category !== "LICENSE" || item.name.includes(plan))
      .filter((item) => {
        if (!addQuery.trim()) return true;
        return item.name.toLowerCase().includes(addQuery.toLowerCase());
      })
      .slice(0, 8);
  }, [book, data, addQuery]);

  async function patchQuote(body: Record<string, unknown>) {
    await fetch(`/api/admin/starwall/pricing/quotes/${quoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await load();
  }

  async function downloadPdf() {
    setPdfState("Building PDF…");
    const res = await fetch(deskPaths.pdf(quoteId));
    if (!res.ok) {
      setPdfState("Could not build the proposal PDF.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `StarWall-Proposal-${data?.quote.number ?? quoteId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setPdfState("PDF downloaded.");
  }

  if (error) {
    return (
      <DeskShell title="Ticket">
        <p className="text-sm text-crit">{error}</p>
      </DeskShell>
    );
  }
  if (!data) {
    return (
      <DeskShell title="Ticket">
        <p className="text-sm text-muted">Loading ticket…</p>
      </DeskShell>
    );
  }

  const { quote, totals } = data;
  const admin = role === "admin";
  const sales = role === "admin" || role === "sales";
  const unknownInfra = INFRA_KEYS.filter((key) => !infra[key] || infra[key] === "unknown").length;
  const checks = [
    { ok: !totals.missingPrices, label: totals.missingPrices ? `${totals.missingPrices} line(s) PRICE REQUIRED` : "Every line has a figure" },
    { ok: Boolean(quote.customer.email), label: quote.customer.email ? "Customer email on file" : "Add a customer email before send" },
    { ok: quote.approvalState !== "BELOW MINIMUM", label: quote.approvalState === "BELOW MINIMUM" ? "Floor is below minimum" : "Floor is clear" },
    { ok: quote.items.length > 0, label: quote.items.length ? `${quote.items.length} configuration lines` : "Add catalog lines" },
    { ok: unknownInfra < 4, label: unknownInfra ? `${unknownInfra} infrastructure fields unknown` : "Infrastructure mapped" },
  ];
  const next =
    totals.missingPrices
      ? "Price the open lines before a PDF leaves the desk."
      : quote.approvalState === "BELOW MINIMUM"
        ? "An admin must approve the floor."
        : quote.status === "DRAFT"
          ? "Review the cart, then mark Approved and send the PDF."
          : quote.status === "SENT" || quote.status === "CUSTOMER REVIEW"
            ? "Wait for the customer, or open a revision if the scope moved."
            : "Keep the ticket moving — status is on the right.";

  return (
    <DeskShell
      title={`${quote.number} · v${quote.version}`}
      role={role}
      actions={
        <>
          <PlanMark plan={quote.plan} />
          <StatusStamp status={quote.status} />
          <FloorMark state={quote.approvalState} />
          <span className="text-sm text-sand/70">
            {quote.customer.name}
            {quote.location ? ` · ${quote.location}` : ""}
          </span>
          <span className="ms-auto flex flex-wrap gap-2">
            <Link
              href={deskPaths.proposal(quote.id)}
              className="border border-sand/25 px-3 py-1.5 font-ui text-[11px] uppercase tracking-wider text-sand hover:border-orange"
            >
              Preview
            </Link>
            <button
              type="button"
              data-testid="download-proposal-pdf"
              onClick={() => void downloadPdf()}
              className="bg-orange px-3 py-1.5 font-ui text-[11px] uppercase tracking-wider text-white"
            >
              Download PDF
            </button>
          </span>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-10">
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="border border-stroke bg-panel px-4 py-4">
              <p className="font-ui text-[11px] uppercase tracking-wider text-orange">Customer</p>
              <p className="mt-1 font-heading text-2xl font-bold">{quote.customer.name}</p>
              <p className="mt-1 text-sm text-muted">
                {[quote.customer.company, quote.customer.contact, quote.customer.email, quote.customer.country]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <div className="border border-stroke bg-panel px-4 py-4">
              <p className="font-ui text-[11px] uppercase tracking-wider text-orange">Object</p>
              <p className="mt-1 font-heading text-2xl font-bold">{quote.objectName || quote.objectType}</p>
              <p className="mt-1 text-sm text-muted">
                {[quote.objectType, quote.objectSize, quote.location, `${quote.siteCount} site(s)`, `${quote.vesselCount} vessel(s)`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-heading text-2xl font-bold">Configuration cart</h2>
                <p className="text-xs text-muted">Book {quote.priceBook.version}. Add from the catalog like a shelf.</p>
              </div>
              <select
                className="border-b border-stroke bg-transparent py-1 text-sm"
                value={quote.status}
                onChange={(event) => void patchQuote({ status: event.target.value })}
              >
                {QUOTE_STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="border border-stroke bg-panel p-3">
              <input
                value={addQuery}
                onChange={(event) => setAddQuery(event.target.value)}
                placeholder="Search catalog to add a line…"
                className="w-full border-b border-stroke bg-transparent py-1 text-sm"
              />
              <ul className="mt-2 divide-y divide-stroke">
                {addable.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span>
                      <CategoryChip category={item.category} />
                      <span className="ms-2">{item.name}</span>
                    </span>
                    <button
                      type="button"
                      className="text-xs text-orange"
                      onClick={() => void patchQuote({ action: "add-item", priceItemId: item.id })}
                    >
                      Add · {item.priceStatus === "PRICED" ? moneyLabel(item.listPrice) : "TBD"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 space-y-3">
              {quote.items.map((line) => (
                <article key={line.id} className="border border-stroke bg-panel">
                  <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="font-heading text-lg font-bold">{line.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <CategoryChip category={line.category} />
                        <span className="text-xs text-muted">{line.billingType}</span>
                      </div>
                    </div>
                    <p className="font-heading text-xl font-bold">{moneyLabel(line.customerPrice)}</p>
                  </div>
                  <div className="grid gap-3 border-t border-stroke px-4 py-3 sm:grid-cols-4">
                    <label className="text-xs text-muted">
                      Qty
                      <input
                        className="mt-1 w-full border-b border-stroke bg-transparent py-1 text-sm text-ink"
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
                    </label>
                    {sales ? (
                      <label className="text-xs text-muted">
                        Disc %
                        <input
                          className="mt-1 w-full border-b border-stroke bg-transparent py-1 text-sm text-ink"
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
                      </label>
                    ) : (
                      <p className="text-xs text-muted">List {moneyLabel(line.listPrice)}</p>
                    )}
                    <label className="text-xs text-muted">
                      Inclusion
                      <select
                        className="mt-1 w-full border-b border-stroke bg-transparent py-1 text-sm text-ink"
                        defaultValue={line.inclusion}
                        onChange={(event) =>
                          void patchQuote({
                            action: "patch-item",
                            itemId: line.id,
                            inclusion: event.target.value,
                          })
                        }
                      >
                        {INCLUSIONS.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </label>
                    <div className="flex items-end justify-between gap-2">
                      {admin ? <p className="text-xs text-muted">Cost {moneyLabel(line.internalCost)}</p> : <span />}
                      <button
                        type="button"
                        className="text-xs text-muted hover:text-crit"
                        onClick={() => void patchQuote({ action: "remove-item", itemId: line.id })}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold">What is already on site</h2>
            <p className="mt-1 text-xs text-muted">Project map — existing, integrate, replace, or new.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INFRA_KEYS.map((key) => (
                <label key={key} className="border border-stroke bg-panel px-3 py-2 text-sm capitalize">
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

          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-bold">Travel and expenses</h2>
              <p className="mt-1 text-xs text-muted">Kept off professional-service rates.</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {Object.entries(quote.expenses).map(([key, value]) => (
                  <label key={key} className="border border-stroke bg-panel px-3 py-2 text-sm capitalize">
                    {key}
                    <input
                      className="mt-1 w-full border-b border-stroke bg-transparent py-1"
                      type="number"
                      defaultValue={value}
                      onBlur={(event) => void patchQuote({ [`${key}Expense`]: Number(event.target.value) })}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold">Ticket discount</h2>
              <label className="mt-3 block border border-stroke bg-panel px-3 py-2 text-sm">
                Overall %
                <input
                  className="mt-1 w-full border-b border-stroke bg-transparent py-1"
                  type="number"
                  defaultValue={quote.overallDiscount ?? 0}
                  disabled={!sales}
                  onBlur={(event) => void patchQuote({ overallDiscount: Number(event.target.value) })}
                />
              </label>
              <label className="mt-3 block text-sm">
                RFP number
                <input
                  className="mt-1 w-full border-b border-stroke bg-transparent py-1"
                  defaultValue={quote.rfp.number}
                  onBlur={(event) => void patchQuote({ rfpNumber: event.target.value })}
                />
              </label>
            </div>
          </section>

          {admin && totals.year1Cost !== undefined ? (
            <section className="border border-stroke bg-navy px-4 py-5 text-sand">
              <p className="font-ui text-[11px] uppercase tracking-wider text-orange">Internal only</p>
              <h2 className="mt-1 font-heading text-2xl font-bold">Profitability</h2>
              <p className="text-xs text-sand/60">Never printed on the customer PDF.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <p>
                  <span className="block text-xs text-sand/60">Year 1 cost</span>
                  {moneyLabel(totals.year1Cost)}
                </p>
                <p>
                  <span className="block text-xs text-sand/60">Year 1 profit</span>
                  {moneyLabel(totals.year1Profit)}
                </p>
                <p>
                  <span className="block text-xs text-sand/60">Year 1 margin</span>
                  {totals.year1Margin == null ? "—" : `${totals.year1Margin}%`}
                </p>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="bg-navy px-4 py-5 text-sand">
            <p className="font-ui text-[11px] uppercase tracking-[0.18em] text-orange">Year 1</p>
            <p className="mt-2 font-heading text-4xl font-bold">{moneyLabel(totals.year1)}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-sand/60">Recurring</dt>
                <dd>{moneyLabel(totals.annualRecurring)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-sand/60">One-time</dt>
                <dd>{moneyLabel(totals.oneTime)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-sand/60">Expenses</dt>
                <dd>{moneyLabel(totals.expenses)}</dd>
              </div>
            </dl>
          </div>
          <div className="border border-stroke bg-panel px-4 py-4">
            <p className="font-heading text-lg font-bold">Ready to send?</p>
            <ul className="mt-3 space-y-2 text-sm">
              {checks.map((item) => (
                <li key={item.label} className="flex gap-2">
                  <span className={item.ok ? "text-[#0F6B55]" : "text-attn"}>{item.ok ? "●" : "○"}</span>
                  <span className={item.ok ? "text-ink" : "text-muted"}>{item.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink">{next}</p>
            {admin && quote.approvalState === "BELOW MINIMUM" ? (
              <button
                type="button"
                className="mt-4 w-full bg-orange py-2 text-sm text-white"
                onClick={() => void patchQuote({ action: "approve" })}
              >
                Approve floor
              </button>
            ) : null}
            {pdfState ? <p className="mt-3 text-xs text-muted">{pdfState}</p> : null}
          </div>
        </aside>
      </div>
    </DeskShell>
  );
}
