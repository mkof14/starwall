import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/auth-gate";
import { NewQuoteView } from "@/components/admin/pricing/new-quote-view";

export const metadata: Metadata = {
  title: "New StarWall quote — AGRON internal",
  robots: { index: false, follow: false },
};

export default function NewQuotePage() {
  return (
    <AuthGate next="/admin/starwall/pricing/quotes/new">
      <NewQuoteView />
    </AuthGate>
  );
}
