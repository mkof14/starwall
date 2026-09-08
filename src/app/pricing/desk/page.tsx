import type { Metadata } from "next";
import { CommercialGate } from "@/components/auth/commercial-gate";
import { PricingDashboardView } from "@/components/admin/pricing/dashboard-view";
import { deskPaths } from "@/lib/price-book/paths";

export const metadata: Metadata = {
  title: "StarWall Price Book — closed Plans",
  description: "Internal StarWall commercial desk under Plans. Not a public pricing page.",
  robots: { index: false, follow: false },
};

export default function PricingDeskPage() {
  return (
    <CommercialGate next={deskPaths.root}>
      <PricingDashboardView />
    </CommercialGate>
  );
}
