import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/auth-gate";
import { ProposalView } from "@/components/admin/pricing/proposal-view";

export const metadata: Metadata = {
  title: "Customer proposal preview — AGRON internal",
  robots: { index: false, follow: false },
};

export default function ProposalPage({ params }: { params: { id: string } }) {
  return (
    <AuthGate next={`/admin/starwall/pricing/quotes/${params.id}/proposal`}>
      <ProposalView quoteId={params.id} />
    </AuthGate>
  );
}
