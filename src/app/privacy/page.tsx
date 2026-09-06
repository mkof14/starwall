import type { Metadata } from "next";
import { PrivacyView } from "@/components/pages/privacy-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.privacy.title,
  description: pageMeta.privacy.description,
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
