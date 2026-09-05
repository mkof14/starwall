import type { Metadata } from "next";
import { ContainersTiersView } from "@/components/pages/containers-tiers-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containersTiers.title,
  description: pageMeta.containersTiers.description,
};

export default function ContainersTiersPage() {
  return <ContainersTiersView />;
}
