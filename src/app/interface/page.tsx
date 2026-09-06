"use client";

import { AdaptiveLearningPanel } from "@/components/bridge/adaptive-learning-panel";
import { BlackBoxPanel } from "@/components/bridge/black-box-panel";
import { BridgeConsole } from "@/components/bridge/bridge-console";
import { ScenarioWalkthrough } from "@/components/bridge/scenario-walkthrough";
import { LiveModeBanner } from "@/components/live-mode-banner";
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
    </div>
  );
}

export default function InterfacePage() {
  return (
    <CrisisModeProvider>
      <InterfaceBody />
    </CrisisModeProvider>
  );
}
