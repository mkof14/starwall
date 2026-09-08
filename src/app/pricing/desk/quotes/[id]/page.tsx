import type { Metadata } from "next";
import { CommercialGate } from "@/components/auth/commercial-gate";
import { QuoteDeskView } from "@/components/admin/pricing/quote-view";
import { deskPaths } from "@/lib/price-book/paths";

export const metadata: Metadata = {
  title: "StarWall quote — closed Plans",
  robots: { index: false, follow: false },
};

export default function QuotePage({ params }: { params: { id: string } }) {
  return (
    <CommercialGate next={deskPaths.quote(params.id)}>
      <QuoteDeskView quoteId={params.id} />
    </CommercialGate>
  );
}
