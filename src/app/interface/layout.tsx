import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.interface.title,
  description: pageMeta.interface.description,
};

export default function InterfaceLayout({ children }: { children: ReactNode }) {
  return <AuthGate next="/interface">{children}</AuthGate>;
}
