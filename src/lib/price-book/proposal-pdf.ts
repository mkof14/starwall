import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { ISSUER } from "@/lib/price-book/issuer";

export type ProposalPdfInput = {
  quoteNumber: string;
  version: number;
  plan: string;
  issuedAt?: string;
  customer: { name: string; company?: string; email?: string; country?: string };
  object: {
    type: string;
    name?: string;
    size?: string;
    location?: string;
    sites?: number;
    vessels?: number;
  };
  configuration: Array<{
    name: string;
    category: string;
    inclusion: string;
    quantity: number;
    customerPrice: number | null;
    billingType: string;
  }>;
  commercial: {
    year1: number | null;
    annualRecurring: number | null;
    oneTime?: number | null;
  };
  terms?: string;
  caveat?: string;
  validity?: string;
};

const NAVY = rgb(15 / 255, 25 / 255, 34 / 255);
const ORANGE = rgb(241 / 255, 90 / 255, 0);
const SAND = rgb(233 / 255, 228 / 255, 218 / 255);
const INK = rgb(27 / 255, 42 / 255, 58 / 255);
const MUTED = rgb(85 / 255, 104 / 255, 122 / 255);
const RULE = rgb(183 / 255, 201 / 255, 216 / 255);
const PAGE = rgb(1, 1, 1);

function money(value: number | null | undefined) {
  if (value === null || value === undefined) return "To be confirmed";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function dateLabel(iso?: string) {
  if (!iso) return new Date().toISOString().slice(0, 10);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export async function buildProposalPdf(
  input: ProposalPdfInput,
  logoPng?: Uint8Array,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);
  let logo = null;
  if (logoPng && logoPng.length > 0) {
    try {
      logo = await doc.embedPng(logoPng);
    } catch {
      logo = null;
    }
  }

  const page = doc.addPage([612, 792]);
  drawLetterhead(page, { serif, serifBold, sans, sansBold, logo, input });
  let y = logo ? 668 : 650;
  y = drawPartyBlock(page, y, { serifBold, sans, sansBold, input });
  y = drawLines(doc, page, y, { sans, sansBold, serifBold, input });
  drawFooter(page, { sans, input });

  doc.setTitle(`${ISSUER.product} proposal ${input.quoteNumber}`);
  doc.setAuthor(ISSUER.legalName);
  doc.setSubject(`${ISSUER.product} commercial proposal`);
  doc.setCreator(ISSUER.mark);
  return doc.save();
}

function drawLetterhead(
  page: PDFPage,
  ctx: {
    serif: PDFFont;
    serifBold: PDFFont;
    sans: PDFFont;
    sansBold: PDFFont;
    logo: PDFImage | null;
    input: ProposalPdfInput;
  },
) {
  const { width, height } = page.getSize();
  page.drawRectangle({ x: 0, y: height - 92, width, height: 92, color: NAVY });
  page.drawRectangle({ x: 0, y: height - 96, width, height: 4, color: ORANGE });
  if (ctx.logo) {
    const fit = ctx.logo.scaleToFit(168, 36);
    page.drawImage(ctx.logo, {
      x: 36,
      y: height - 28 - fit.height,
      width: fit.width,
      height: fit.height,
    });
  } else {
    page.drawText("Star", { x: 36, y: height - 42, size: 22, font: ctx.serifBold, color: SAND });
    page.drawText("Wall", { x: 78, y: height - 42, size: 22, font: ctx.serifBold, color: ORANGE });
  }
  page.drawText("COMMERCIAL PROPOSAL", {
    x: 360,
    y: height - 38,
    size: 9,
    font: ctx.sansBold,
    color: ORANGE,
  });
  page.drawText(`${ctx.input.quoteNumber}  ·  v${ctx.input.version}`, {
    x: 360,
    y: height - 54,
    size: 11,
    font: ctx.sans,
    color: SAND,
  });
  page.drawText(dateLabel(ctx.input.issuedAt), {
    x: 360,
    y: height - 70,
    size: 9,
    font: ctx.sans,
    color: SAND,
  });

  page.drawText(ISSUER.legalName, { x: 36, y: height - 118, size: 10, font: ctx.sansBold, color: INK });
  page.drawText(`${ISSUER.line}  ·  ${ISSUER.webLabel}`, {
    x: 36,
    y: height - 132,
    size: 9,
    font: ctx.sans,
    color: MUTED,
  });
  page.drawText(ISSUER.correspondence, {
    x: 36,
    y: height - 146,
    size: 9,
    font: ctx.sans,
    color: MUTED,
  });
}

function drawPartyBlock(
  page: PDFPage,
  y: number,
  ctx: { serifBold: PDFFont; sans: PDFFont; sansBold: PDFFont; input: ProposalPdfInput },
) {
  const { input } = ctx;
  page.drawRectangle({ x: 36, y: y - 78, width: 540, height: 86, color: rgb(0.97, 0.94, 0.9) });
  page.drawRectangle({ x: 36, y: y - 78, width: 4, height: 86, color: ORANGE });
  page.drawText("PREPARED FOR", { x: 50, y: y - 8, size: 8, font: ctx.sansBold, color: ORANGE });
  page.drawText(input.customer.name || "Customer", {
    x: 50,
    y: y - 26,
    size: 14,
    font: ctx.serifBold,
    color: INK,
  });
  const company = [input.customer.company, input.customer.country].filter(Boolean).join("  ·  ");
  if (company) {
    page.drawText(company, { x: 50, y: y - 42, size: 9, font: ctx.sans, color: MUTED });
  }
  const object = [
    input.object.type,
    input.object.name,
    input.object.location,
    input.object.size,
  ]
    .filter(Boolean)
    .join("  ·  ");
  page.drawText(object || "Object to be confirmed", {
    x: 50,
    y: y - 58,
    size: 9,
    font: ctx.sans,
    color: INK,
  });
  page.drawText(`StarWall ${input.plan}`, {
    x: 400,
    y: y - 26,
    size: 12,
    font: ctx.serifBold,
    color: ORANGE,
  });
  const scale = [
    input.object.sites ? `${input.object.sites} site(s)` : "",
    input.object.vessels ? `${input.object.vessels} vessel(s)` : "",
  ]
    .filter(Boolean)
    .join("  ·  ");
  if (scale) page.drawText(scale, { x: 400, y: y - 42, size: 8, font: ctx.sans, color: MUTED });
  return y - 100;
}

function drawLines(
  doc: PDFDocument,
  startPage: PDFPage,
  startY: number,
  ctx: { sans: PDFFont; sansBold: PDFFont; serifBold: PDFFont; input: ProposalPdfInput },
) {
  let page = startPage;
  let y = startY;
  page.drawText("CONFIGURATION", { x: 36, y, size: 8, font: ctx.sansBold, color: ORANGE });
  y -= 16;
  const header = [
    { x: 36, t: "Item" },
    { x: 300, t: "Kind" },
    { x: 380, t: "Qty" },
    { x: 430, t: "Customer figure" },
  ];
  for (const col of header) {
    page.drawText(col.t, { x: col.x, y, size: 8, font: ctx.sansBold, color: MUTED });
  }
  y -= 6;
  page.drawLine({ start: { x: 36, y }, end: { x: 576, y }, thickness: 0.6, color: RULE });
  y -= 14;

  for (const row of ctx.input.configuration) {
    if (y < 160) {
      page = doc.addPage([612, 792]);
      page.drawRectangle({ x: 0, y: 0, width: 612, height: 792, color: PAGE });
      y = 740;
    }
    const figure =
      row.inclusion === "INCLUDED" ? "Included" : money(row.customerPrice);
    page.drawText(clip(row.name, 46), { x: 36, y, size: 9, font: ctx.sans, color: INK });
    page.drawText(clip(`${row.inclusion} · ${row.billingType}`, 22), {
      x: 300,
      y,
      size: 8,
      font: ctx.sans,
      color: MUTED,
    });
    page.drawText(String(row.quantity), { x: 380, y, size: 9, font: ctx.sans, color: INK });
    page.drawText(figure, { x: 430, y, size: 9, font: ctx.sansBold, color: INK });
    y -= 16;
  }

  y -= 10;
  page.drawRectangle({ x: 300, y: y - 70, width: 276, height: 78, color: NAVY });
  page.drawRectangle({ x: 300, y: y - 70, width: 276, height: 3, color: ORANGE });
  page.drawText("YEAR 1", { x: 316, y: y - 16, size: 8, font: ctx.sansBold, color: ORANGE });
  page.drawText(money(ctx.input.commercial.year1), {
    x: 316,
    y: y - 36,
    size: 16,
    font: ctx.serifBold,
    color: SAND,
  });
  page.drawText(`Annual recurring  ${money(ctx.input.commercial.annualRecurring)}`, {
    x: 316,
    y: y - 54,
    size: 8,
    font: ctx.sans,
    color: SAND,
  });
  return y - 90;
}

function drawFooter(
  page: PDFPage,
  ctx: { sans: PDFFont; input: ProposalPdfInput },
) {
  const terms = ctx.input.terms || ISSUER.terms;
  const caveat = ctx.input.caveat || ISSUER.caveat;
  page.drawLine({ start: { x: 36, y: 108 }, end: { x: 576, y: 108 }, thickness: 0.6, color: RULE });
  page.drawText("Validity: 30 days from issue.", {
    x: 36,
    y: 90,
    size: 8,
    font: ctx.sans,
    color: MUTED,
  });
  wrap(page, terms, 36, 76, 540, ctx.sans, 8, MUTED);
  wrap(page, caveat, 36, 48, 540, ctx.sans, 8, MUTED);
  page.drawText(`${ISSUER.legalName}  ·  ${ISSUER.webLabel}  ·  ${ISSUER.product}`, {
    x: 36,
    y: 24,
    size: 8,
    font: ctx.sans,
    color: MUTED,
  });
}

function clip(value: string, max: number) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function wrap(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
) {
  const words = text.split(/\s+/);
  let line = "";
  let cursor = y;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth) {
      page.drawText(line, { x, y: cursor, size, font, color });
      line = word;
      cursor -= 11;
    } else {
      line = next;
    }
  }
  if (line) page.drawText(line, { x, y: cursor, size, font, color });
}
