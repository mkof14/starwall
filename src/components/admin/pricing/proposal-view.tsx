"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DeskShell, PlanMark, moneyLabel } from "@/components/admin/pricing/desk-ui";
import { planLook } from "@/lib/price-book/desk-visual";
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
        <p className="text-lg text-muted">{error || "Loading…"}</p>
      </DeskShell>
    );
  }

  const look = planLook(data.plan);
  const issued = data.issuedAt
    ? new Date(data.issuedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "";

  return (
    <DeskShell title={data.customer.name} plan={data.plan}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <p className="font-mono text-lg text-muted">
          {data.quoteNumber} v{data.version}
        </p>
        <p className="text-base text-muted">Customer face — no cost, no margin.</p>
        <button
          type="button"
          data-testid="download-proposal-pdf"
          onClick={() => void downloadPdf()}
          className={`ms-auto px-4 py-2 font-heading text-lg font-bold text-white ${look.bar}`}
        >
          Download PDF
        </button>
      </div>

      <article className="mx-auto max-w-3xl border border-stroke bg-[#F7F1E8] text-[#1B2A3A] shadow-[0_12px_40px_rgb(15_25_34/0.12)]">
        <header className="bg-[#0F1922] px-8 py-7 text-[#E9E4DA]">
          <div className={`h-[4px] ${look.bar}`} />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-heading text-5xl font-bold leading-none">
                Star<span className="text-orange">Wall</span>
              </p>
              <p className="mt-2 text-base text-sand/70">{ISSUER.legalName}</p>
              <p className="text-base text-sand/70">
                {ISSUER.line} · {ISSUER.webLabel}
              </p>
            </div>
            <div className="text-end">
              <p className="font-heading text-xl font-bold" style={{ color: look.hex }}>
                Commercial proposal
              </p>
              <p className="mt-1 font-mono text-lg">
                {data.quoteNumber} · v{data.version}
              </p>
              {issued ? <p className="text-base text-sand/60">{issued}</p> : null}
            </div>
          </div>
        </header>

        <div className="space-y-8 px-8 py-8 text-lg leading-relaxed">
          <section className={`${look.wash} px-5 py-5`}>
            <p className="text-base text-muted">Prepared for</p>
            <p className="mt-1 font-heading text-4xl font-bold leading-tight">
              {data.customer.name}
              {data.customer.company ? ` · ${data.customer.company}` : ""}
            </p>
            <p className="mt-2 text-base text-muted">
              {[data.object.type, data.object.name, data.object.location, data.object.size]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div className="mt-4">
              <PlanMark plan={data.plan} size="lg" />
            </div>
          </section>

          <section>
            <p className={`font-heading text-2xl font-bold ${look.text}`}>Included</p>
            <ul className="mt-2 list-disc ps-5">
              {data.included.length ? data.included.map((item) => <li key={item}>{item}</li>) : <li>None marked included</li>}
            </ul>
          </section>

          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="border-b border-[#B7C9D8]">
                  <th className="py-3 text-start text-base text-muted">Component</th>
                  <th className="py-3 text-start text-base text-muted">Kind</th>
                  <th className="py-3 text-end text-base text-muted">Customer figure</th>
                </tr>
              </thead>
              <tbody>
                {data.configuration.map((row) => (
                  <tr key={`${row.name}-${row.category}`} className="border-t border-[#B7C9D8]/70">
                    <td className="py-3 font-heading text-xl font-bold">{row.name}</td>
                    <td className="py-3 text-base text-muted">
                      {row.inclusion} · {row.billingType}
                    </td>
                    <td className="py-3 text-end font-heading text-2xl font-bold">
                      {row.inclusion === "INCLUDED" ? "Included" : moneyLabel(row.customerPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className={`grid gap-4 px-5 py-6 text-white sm:grid-cols-2 ${look.solid}`}>
            <p>
              <span className="block text-base opacity-80">Year 1</span>
              <span className="font-heading text-5xl font-bold leading-none">{moneyLabel(data.commercial.year1)}</span>
            </p>
            <p>
              <span className="block text-base opacity-80">Each year after</span>
              <span className="font-heading text-5xl font-bold leading-none">
                {moneyLabel(data.commercial.annualRecurring)}
              </span>
            </p>
          </section>

          <p>{data.terms}</p>
          {data.caveat ? <p className="text-base text-muted">{data.caveat}</p> : null}
          <p className="text-base text-muted">
            {ISSUER.correspondence}. Validity: {data.validity}.
          </p>
        </div>
      </article>

      {pdfState ? <p className="mt-4 text-center text-base text-muted">{pdfState}</p> : null}
      <div className="mt-8 text-center">
        <Link href={deskPaths.quote(quoteId)} className={`font-heading text-xl font-bold ${look.text}`}>
          Back to the quote
        </Link>
      </div>
    </DeskShell>
  );
}
