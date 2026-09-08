import type { Metadata } from "next";
import { CommercialGate } from "@/components/auth/commercial-gate";
import { PriceBookView } from "@/components/admin/pricing/book-view";
import { deskPaths } from "@/lib/price-book/paths";

export const metadata: Metadata = {
  title: "Master Price Book — closed Plans",
  robots: { index: false, follow: false },
};

export default function PriceBookPage() {
  return (
    <CommercialGate next={deskPaths.book}>
      <PriceBookView />
    </CommercialGate>
  );
}
