import type { Metadata } from "next";
import { ContainersDeploymentView } from "@/components/pages/containers-deployment-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containersDeployment.title,
  description: pageMeta.containersDeployment.description,
};

export default function ContainersDeploymentPage() {
  return <ContainersDeploymentView />;
}
