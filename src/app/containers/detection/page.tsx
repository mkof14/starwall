import type { Metadata } from "next";
import { ContainersDetectionView } from "@/components/pages/containers-detection-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containersDetection.title,
  description: pageMeta.containersDetection.description,
};

export default function ContainersDetectionPage() {
  return <ContainersDetectionView />;
}
