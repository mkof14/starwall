import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/auth-gate";
import { PricingDashboardView } from "@/components/admin/pricing/dashboard-view";

export const metadata: Metadata = {
  title: "StarWall Price Book — AGRON internal",
  description: "Internal StarWall commercial desk. Not a public pricing page.",
  robots: { index: false, follow: false },
};

export default function PricingDeskPage() {
  return (
    <AuthGate next="/admin/starwall/pricing">
      <PricingDashboardView />
    </AuthGate>
  );
}
