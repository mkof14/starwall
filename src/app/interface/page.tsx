"use client";

import { AdaptiveLearningPanel } from "@/components/bridge/adaptive-learning-panel";
import { BridgeConsole } from "@/components/bridge/bridge-console";
import { ScenarioWalkthrough } from "@/components/bridge/scenario-walkthrough";

export default function InterfacePage() {
  return (
    <div id="bridge-root" className="min-h-screen bg-bridge-bg">
      <ScenarioWalkthrough />
      <BridgeConsole />
      <AdaptiveLearningPanel />
    </div>
  );
}
