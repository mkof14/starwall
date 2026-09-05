import type { Metadata } from "next";
import { LevelsView } from "@/components/pages/levels-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.levels.title,
  description: pageMeta.levels.description,
};

export default function LevelsPage() {
  return <LevelsView />;
}
