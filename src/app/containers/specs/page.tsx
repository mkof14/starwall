import type { Metadata } from "next";
import { ContainersSpecsView } from "@/components/pages/containers-specs-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containersSpecs.title,
  description: pageMeta.containersSpecs.description,
};

export default function ContainersSpecsPage() {
  return <ContainersSpecsView />;
}
