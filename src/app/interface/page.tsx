import type { Metadata } from "next";
import { BridgeConsole } from "@/components/bridge/bridge-console";

export const metadata: Metadata = {
  title: "Interface",
};

export default function InterfacePage() {
  return <BridgeConsole />;
}
