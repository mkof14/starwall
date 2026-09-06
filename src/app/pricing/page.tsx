import type { Metadata } from "next";
import { PricingView } from "@/components/pages/pricing-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.pricing.title,
  description: pageMeta.pricing.description,
};

export default function PricingPage() {
  return <PricingView />;
}
