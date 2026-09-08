"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DeskShell, moneyLabel } from "@/components/admin/pricing/desk-shell";
import { deskPaths } from "@/lib/price-book/paths";

type Proposal = {
  quoteNumber: string;
  version: number;
  plan: string;
  customer: { name: string; company: string };
  object: { type: string; name: string; location: string };
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
  commercial: { year1: number | null; annualRecurring: number | null };
  terms: string;
  validity: string;
};

export function ProposalView({ quoteId }: { quoteId: string }) {
  const [data, setData] = useState<Proposal | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/starwall/pricing/quotes/${quoteId}?view=proposal`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load proposal.");
        setData((await res.json()) as Proposal);
      })
      .catch((err: Error) => setError(err.message));
  }, [quoteId]);

  if (error || !data) {
    return (
      <DeskShell title="Customer proposal">
        <p className="text-sm text-muted">{error || "Loading…"}</p>
      </DeskShell>
    );
  }

  return (
    <DeskShell title={`Proposal ${data.quoteNumber} v${data.version}`}>
      <p className="text-sm text-muted">
        Customer-facing view. Internal cost, markup, margin, and floor are not included.
      </p>
      <div className="mt-6 max-w-3xl space-y-6 text-sm leading-relaxed">
        <p>
          <strong>{data.customer.name}</strong>
          {data.customer.company ? ` · ${data.customer.company}` : ""}
        </p>
        <p>
          {data.object.type}
          {data.object.name ? ` · ${data.object.name}` : ""}
          {data.object.location ? ` · ${data.object.location}` : ""}
        </p>
        <p>StarWall plan: {data.plan}</p>
        <div>
          <p className="font-medium">Included</p>
          <ul className="mt-1 list-disc ps-5">
            {data.included.length ? data.included.map((item) => <li key={item}>{item}</li>) : <li>None marked included</li>}
          </ul>
        </div>
        <div>
          <p className="font-medium">Optional</p>
          <ul className="mt-1 list-disc ps-5">
            {data.optional.length ? data.optional.map((item) => <li key={item}>{item}</li>) : <li>None</li>}
          </ul>
        </div>
        <div className="overflow-x-auto border-y border-stroke">
          <table className="w-full text-start">
            <thead>
              <tr className="border-b border-stroke">
                <th className="py-2 text-start">Component</th>
                <th className="py-2 text-start">Type</th>
                <th className="py-2 text-start">Customer price</th>
              </tr>
            </thead>
            <tbody>
              {data.configuration.map((row) => (
                <tr key={row.name} className="border-t border-stroke">
                  <td className="py-2">{row.name}</td>
                  <td className="py-2">{row.inclusion}</td>
                  <td className="py-2">
                    {row.inclusion === "INCLUDED" ? "Included" : moneyLabel(row.customerPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <p>Year 1 total: {moneyLabel(data.commercial.year1)}</p>
          <p>Annual recurring: {moneyLabel(data.commercial.annualRecurring)}</p>
        </div>
        <p>{data.terms}</p>
        <p>Validity: {data.validity}</p>
      </div>
      <Link href={deskPaths.quote(quoteId)} className="mt-8 inline-block text-sm text-orange">
        Back to internal quote
      </Link>
    </DeskShell>
  );
}
