import type { Metadata } from "next";
import { HomeView } from "@/components/pages/home-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.home.title,
  description: pageMeta.home.description,
};

export default function OverviewPage() {
  return <HomeView />;
}
