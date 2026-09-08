import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { requireCommercial } from "@/lib/commercial-auth";
import { prismaReady } from "@/lib/prisma";
import { customerProposal, getQuote } from "@/lib/price-book/service";
import { buildProposalPdf } from "@/lib/price-book/proposal-pdf";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const ready = await requireCommercial();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.error }, { status: ready.status });
  }
  const prisma = await prismaReady();
  if (!prisma) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const data = await getQuote(prisma, ready.actor, params.id);
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const proposal = customerProposal(data);
  let logo: Uint8Array | undefined;
  try {
    logo = await readFile(join(process.cwd(), "public", "SW3.png"));
  } catch {
    logo = undefined;
  }
  const bytes = await buildProposalPdf(proposal, logo);
  const filename = `StarWall-Proposal-${proposal.quoteNumber}-v${proposal.version}.pdf`;
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
