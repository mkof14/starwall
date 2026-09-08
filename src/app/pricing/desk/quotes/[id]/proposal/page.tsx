import type { Metadata } from "next";
import { CommercialGate } from "@/components/auth/commercial-gate";
import { ProposalView } from "@/components/admin/pricing/proposal-view";
import { deskPaths } from "@/lib/price-book/paths";

export const metadata: Metadata = {
  title: "Customer proposal preview — closed Plans",
  robots: { index: false, follow: false },
};

export default function ProposalPage({ params }: { params: { id: string } }) {
  return (
    <CommercialGate next={deskPaths.proposal(params.id)}>
      <ProposalView quoteId={params.id} />
    </CommercialGate>
  );
}
