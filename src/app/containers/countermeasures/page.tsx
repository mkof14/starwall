import type { Metadata } from "next";
import { ContainersCountermeasuresView } from "@/components/pages/containers-countermeasures-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containersCountermeasures.title,
  description: pageMeta.containersCountermeasures.description,
};

export default function ContainersCountermeasuresPage() {
  return <ContainersCountermeasuresView />;
}
