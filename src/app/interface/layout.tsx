import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Interface",
};

export default function InterfaceLayout({ children }: { children: ReactNode }) {
  return children;
}
