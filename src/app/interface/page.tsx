"use client";

import { BridgeConsole } from "@/components/bridge/bridge-console";
import { ScenarioWalkthrough } from "@/components/bridge/scenario-walkthrough";

export default function InterfacePage() {
  return (
    <div className="bg-bridge-bg">
      <ScenarioWalkthrough />
      <BridgeConsole />
    </div>
  );
}
