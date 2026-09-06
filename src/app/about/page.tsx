import type { Metadata } from "next";
import { AboutView } from "@/components/pages/about-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.about.title,
  description: pageMeta.about.description,
};

export default function AboutPage() {
  return <AboutView />;
}
