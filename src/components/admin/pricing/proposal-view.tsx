"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DeskShell, moneyLabel } from "@/components/admin/pricing/desk-ui";
import { ISSUER } from "@/lib/price-book/issuer";
import { deskPaths } from "@/lib/price-book/paths";

type Proposal = {
  quoteNumber: string;
  version: number;
  plan: string;
  issuedAt?: string;
  customer: { name: string; company: string; email?: string; country?: string };
  object: { type: string; name: string; location: string; size?: string; sites?: number; vessels?: number };
  configuration: Array<{
    name: string;
    category: string;
    inclusion: string;
    quantity: number;
    customerPrice: number | null;
    billingType: string;
  }>;
  included: string[];
  optional: string[];
  additional: string[];
  commercial: { year1: number | null; annualRecurring: number | null; oneTime?: number | null };
  terms: string;
  caveat?: string;
  validity: string;
};

export function ProposalView({ quoteId }: { quoteId: string }) {
  const [data, setData] = useState<Proposal | null>(null);
  const [error, setError] = useState("");
  const [pdfState, setPdfState] = useState("");

  useEffect(() => {
    fetch(`/api/admin/starwall/pricing/quotes/${quoteId}?view=proposal`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load proposal.");
        setData((await res.json()) as Proposal);
      })
      .catch((err: Error) => setError(err.message));
  }, [quoteId]);

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
    a.download = `StarWall-Proposal-${data?.quoteNumber ?? quoteId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setPdfState("PDF downloaded.");
  }

  if (error || !data) {
    return (
      <DeskShell title="Customer proposal">
        <p className="text-sm text-muted">{error || "Loading…"}</p>
      </DeskShell>
    );
  }

  const issued = data.issuedAt
    ? new Date(data.issuedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "";

  return (
    <DeskShell
      title={`Proposal ${data.quoteNumber} v${data.version}`}
      actions={
        <>
          <span className="text-sm text-sand/70">Customer face — no cost, no margin.</span>
          <button
            type="button"
            data-testid="download-proposal-pdf"
            onClick={() => void downloadPdf()}
            className="ms-auto bg-orange px-3 py-1.5 font-ui text-[11px] uppercase tracking-wider text-white"
          >
            Download PDF
          </button>
        </>
      }
    >
      <article className="mx-auto max-w-3xl border border-stroke bg-[#F7F1E8] text-[#1B2A3A] shadow-[0_12px_40px_rgb(15_25_34/0.12)]">
        <header className="bg-[#0F1922] px-8 py-7 text-[#E9E4DA]">
          <div className="h-[3px] bg-orange" />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-heading text-4xl font-bold">
                Star<span className="text-orange">Wall</span>
              </p>
              <p className="mt-1 text-sm text-sand/70">{ISSUER.legalName}</p>
              <p className="text-sm text-sand/70">
                {ISSUER.line} · {ISSUER.webLabel}
              </p>
            </div>
            <div className="text-end">
              <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-orange">Commercial proposal</p>
              <p className="mt-1 font-mono text-sm">
                {data.quoteNumber} · v{data.version}
              </p>
              {issued ? <p className="text-xs text-sand/60">{issued}</p> : null}
            </div>
          </div>
        </header>

        <div className="space-y-8 px-8 py-8 text-sm leading-relaxed">
          <section className="border-s-4 border-orange bg-white/70 px-4 py-3">
            <p className="font-ui text-[10px] uppercase tracking-wider text-orange">Prepared for</p>
            <p className="font-heading text-2xl font-bold">
              {data.customer.name}
              {data.customer.company ? ` · ${data.customer.company}` : ""}
            </p>
            <p className="mt-1 text-muted">
              {[data.object.type, data.object.name, data.object.location, data.object.size]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <p className="mt-2 font-heading text-lg text-orange">StarWall {data.plan}</p>
          </section>

          <section>
            <p className="font-ui text-[10px] uppercase tracking-wider text-orange">Included</p>
            <ul className="mt-2 list-disc ps-5">
              {data.included.length ? data.included.map((item) => <li key={item}>{item}</li>) : <li>None marked included</li>}
            </ul>
          </section>

          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="border-b border-[#B7C9D8]">
                  <th className="py-2 text-start font-ui text-[10px] uppercase tracking-wider">Component</th>
                  <th className="py-2 text-start font-ui text-[10px] uppercase tracking-wider">Kind</th>
                  <th className="py-2 text-end font-ui text-[10px] uppercase tracking-wider">Customer figure</th>
                </tr>
              </thead>
              <tbody>
                {data.configuration.map((row) => (
                  <tr key={`${row.name}-${row.category}`} className="border-t border-[#B7C9D8]/70">
                    <td className="py-2">{row.name}</td>
                    <td className="py-2 text-muted">
                      {row.inclusion} · {row.billingType}
                    </td>
                    <td className="py-2 text-end">
                      {row.inclusion === "INCLUDED" ? "Included" : moneyLabel(row.customerPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="grid gap-3 bg-[#0F1922] px-4 py-4 text-[#E9E4DA] sm:grid-cols-2">
            <p>
              <span className="block font-ui text-[10px] uppercase tracking-wider text-orange">Year 1</span>
              <span className="font-heading text-3xl font-bold">{moneyLabel(data.commercial.year1)}</span>
            </p>
            <p>
              <span className="block font-ui text-[10px] uppercase tracking-wider text-orange">Annual recurring</span>
              <span className="font-heading text-3xl font-bold">{moneyLabel(data.commercial.annualRecurring)}</span>
            </p>
          </section>

          <p>{data.terms}</p>
          {data.caveat ? <p className="text-xs text-muted">{data.caveat}</p> : null}
          <p className="text-xs text-muted">
            {ISSUER.correspondence}. Validity: {data.validity}.
          </p>
        </div>
      </article>

      {pdfState ? <p className="mt-4 text-center text-xs text-muted">{pdfState}</p> : null}
      <div className="mt-8 text-center">
        <Link href={deskPaths.quote(quoteId)} className="text-sm text-orange">
          Back to the ticket
        </Link>
      </div>
    </DeskShell>
  );
}
