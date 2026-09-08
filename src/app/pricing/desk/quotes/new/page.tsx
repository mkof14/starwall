import type { Metadata } from "next";
import { CommercialGate } from "@/components/auth/commercial-gate";
import { NewQuoteView } from "@/components/admin/pricing/new-quote-view";
import { deskPaths } from "@/lib/price-book/paths";

export const metadata: Metadata = {
  title: "New StarWall quote — closed Plans",
  robots: { index: false, follow: false },
};

export default function NewQuotePage() {
  return (
    <CommercialGate next={deskPaths.newQuote}>
      <NewQuoteView />
    </CommercialGate>
  );
}
