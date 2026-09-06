import type { Metadata } from "next";

import { ConnectionsView } from "@/components/connections/connections-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.connections.title,
  description: pageMeta.connections.description,
};

export default function ConnectionsPage() {
  return <ConnectionsView />;
}
