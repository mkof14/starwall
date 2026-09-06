"use client";

import { AdaptiveLearningPanel } from "@/components/bridge/adaptive-learning-panel";
import { BlackBoxPanel } from "@/components/bridge/black-box-panel";
import { BridgeConsole } from "@/components/bridge/bridge-console";
import { ScenarioWalkthrough } from "@/components/bridge/scenario-walkthrough";
import { StarWallAssistant } from "@/components/bridge/starwall-assistant";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { BlackBoxProvider } from "@/lib/black-box";
import { BridgeSessionProvider } from "@/lib/bridge-session";
import { CrisisModeProvider } from "@/lib/crisis-mode";
import { useAppMode } from "@/lib/mode";

function InterfaceBody() {
  const { live } = useAppMode();
  return (
    <div id="bridge-root" className="min-h-screen bg-bridge-bg" dir="ltr" lang="en">
      {live ? <LiveModeBanner /> : null}
      {live ? null : <ScenarioWalkthrough />}
      <BridgeConsole />
      <AdaptiveLearningPanel />
      <BlackBoxPanel />
      <StarWallAssistant />
    </div>
  );
}

export default function InterfacePage() {
  return (
    <CrisisModeProvider>
      <BridgeSessionProvider>
        <BlackBoxProvider>
          <InterfaceBody />
        </BlackBoxProvider>
      </BridgeSessionProvider>
    </CrisisModeProvider>
  );
}
