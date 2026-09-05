import type { Metadata } from "next";
import { FaqView } from "@/components/pages/faq-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.faq.title,
  description: pageMeta.faq.description,
};

export default function FaqPage() {
  return <FaqView />;
}
