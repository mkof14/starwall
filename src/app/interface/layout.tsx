import type { Metadata } from "next";
import type { ReactNode } from "react";

import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.interface.title,
  description: pageMeta.interface.description,
};

export default function InterfaceLayout({ children }: { children: ReactNode }) {
  return children;
}
