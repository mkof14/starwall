import type { Metadata } from "next";
import { TechnologyView } from "@/components/pages/technology-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.technology.title,
  description: pageMeta.technology.description,
};

export default function TechnologyPage() {
  return <TechnologyView />;
}
