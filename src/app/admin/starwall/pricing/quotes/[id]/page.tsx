import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/auth-gate";
import { QuoteDeskView } from "@/components/admin/pricing/quote-view";

export const metadata: Metadata = {
  title: "StarWall quote — AGRON internal",
  robots: { index: false, follow: false },
};

export default function QuotePage({ params }: { params: { id: string } }) {
  return (
    <AuthGate next={`/admin/starwall/pricing/quotes/${params.id}`}>
      <QuoteDeskView quoteId={params.id} />
    </AuthGate>
  );
}
