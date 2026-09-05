import type { Metadata } from "next";
import { ContainersView } from "@/components/pages/containers-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containers.title,
  description: pageMeta.containers.description,
};

export default function ContainersPage() {
  return <ContainersView />;
}
