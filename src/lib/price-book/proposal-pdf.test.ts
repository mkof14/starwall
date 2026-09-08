import { PDFDocument } from "pdf-lib";
import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { ISSUER } from "@/lib/price-book/issuer";
import { buildProposalPdf } from "@/lib/price-book/proposal-pdf";

function pdfPlain(bytes: Uint8Array) {
  const raw = Buffer.from(bytes).toString("binary");
  const parts = [raw];
  const re = /stream\r?\n([\s\S]*?)endstream/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw))) {
    try {
      parts.push(inflateSync(Buffer.from(match[1], "binary")).toString("utf8"));
    } catch {
      /* not a deflate stream */
    }
  }
  return parts.join("\n");
}

describe("proposal PDF", () => {
  it("builds a branded PDF without internal cost language", async () => {
    const bytes = await buildProposalPdf({
      quoteNumber: "SW-2026-0001",
      version: 1,
      plan: "INTELLIGENCE",
      issuedAt: "2026-09-08T00:00:00.000Z",
      customer: { name: "Northwind Yacht", company: "Northwind", country: "ES" },
      object: { type: "Superyacht", name: "Aurora", location: "Palma" },
      configuration: [
        {
          name: "StarWall INTELLIGENCE — Annual License",
          category: "LICENSE",
          inclusion: "INCLUDED",
          quantity: 1,
          customerPrice: 42000,
          billingType: "ANNUAL",
        },
      ],
      commercial: { year1: 42000, annualRecurring: 42000, oneTime: 0 },
    });
    const doc = await PDFDocument.load(bytes);
    const plain = pdfPlain(bytes).replace(/<([0-9A-Fa-f]+)>/g, (_all, hex: string) =>
      Buffer.from(hex, "hex").toString("latin1"),
    );
    expect(Buffer.from(bytes).toString("latin1").startsWith("%PDF")).toBe(true);
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(doc.getTitle()).toContain("SW-2026-0001");
    expect(doc.getAuthor()).toBe(ISSUER.legalName);
    expect(plain).toContain(ISSUER.legalName);
    expect(plain).toContain("COMMERCIAL PROPOSAL");
    expect(plain).toContain("StarWall INTELLIGENCE");
    expect(plain).not.toMatch(/internal cost/i);
    expect(plain).not.toMatch(/margin/i);
    expect(plain).not.toMatch(/\bCommand\b/);
  });
});

