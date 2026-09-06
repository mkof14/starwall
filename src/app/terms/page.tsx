import type { Metadata } from "next";
import { PrivacyView } from "@/components/pages/privacy-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.terms.title,
  description: pageMeta.terms.description,
};

export default function TermsPage() {
  return <PrivacyView />;
}
