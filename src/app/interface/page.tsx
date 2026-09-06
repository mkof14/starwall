"use client";

import { AdaptiveLearningPanel } from "@/components/bridge/adaptive-learning-panel";
import { BridgeConsole } from "@/components/bridge/bridge-console";
import { ScenarioWalkthrough } from "@/components/bridge/scenario-walkthrough";
import { CrisisModeProvider } from "@/lib/crisis-mode";

export default function InterfacePage() {
  return (
    <CrisisModeProvider>
      <div id="bridge-root" className="min-h-screen bg-bridge-bg">
        <ScenarioWalkthrough />
        <BridgeConsole />
        <AdaptiveLearningPanel />
      </div>
    </CrisisModeProvider>
  );
}
