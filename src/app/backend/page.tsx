import type { Metadata } from "next";
import { BackendView } from "@/components/backend/backend-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.backend.title,
  description: pageMeta.backend.description,
};

export default function BackendPage() {
  return <BackendView />;
}
