"use client";

import { AdaptiveLearningPanel } from "@/components/bridge/adaptive-learning-panel";
import { BlackBoxPanel } from "@/components/bridge/black-box-panel";
import { BridgeConsole } from "@/components/bridge/bridge-console";
import { ScenarioWalkthrough } from "@/components/bridge/scenario-walkthrough";
import { StarWallAssistant } from "@/components/bridge/starwall-assistant";
import { BlackBoxProvider } from "@/lib/black-box";
import { BridgeSessionProvider } from "@/lib/bridge-session";
import { CrisisModeProvider } from "@/lib/crisis-mode";

export default function InterfacePage() {
  return (
    <CrisisModeProvider>
      <BridgeSessionProvider>
        <BlackBoxProvider>
          <div id="bridge-root" className="min-h-screen bg-bridge-bg">
            <ScenarioWalkthrough />
            <BridgeConsole />
            <AdaptiveLearningPanel />
            <BlackBoxPanel />
            <StarWallAssistant />
          </div>
        </BlackBoxProvider>
      </BridgeSessionProvider>
    </CrisisModeProvider>
  );
}
