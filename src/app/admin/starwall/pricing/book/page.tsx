import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/auth-gate";
import { PriceBookView } from "@/components/admin/pricing/book-view";

export const metadata: Metadata = {
  title: "Master Price Book — AGRON internal",
  robots: { index: false, follow: false },
};

export default function PriceBookPage() {
  return (
    <AuthGate next="/admin/starwall/pricing/book">
      <PriceBookView />
    </AuthGate>
  );
}
