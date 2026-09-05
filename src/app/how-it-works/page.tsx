import type { Metadata } from "next";
import { HowItWorksView } from "@/components/pages/how-it-works-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.howItWorks.title,
  description: pageMeta.howItWorks.description,
};

export default function HowItWorksPage() {
  return <HowItWorksView />;
}
