import type { EquipmentId } from "@/lib/equipment";
import type { PanelType, RiskLevel, Scenario, ScenarioOption } from "@/lib/scenarios";

export type WatchState = {
  selectedId: string;
  selectedName: string;
  riskLevel: RiskLevel;
  panelType: PanelType;
  actionText: string | null;
  actionOptions: ScenarioOption[] | null;
  crisis: boolean;
  training: boolean;
  faultId: EquipmentId | null;
};

export const IDLE_WATCH: WatchState = {
  selectedId: "",
  selectedName: "",
  riskLevel: "NORMAL",
  panelType: "radar",
  actionText: null,
  actionOptions: null,
  crisis: false,
  training: false,
  faultId: null,
};

export function applyScenarioToWatch(
  scenario: Scenario,
  current: Pick<WatchState, "training" | "faultId">,
): WatchState {
  const crisis = scenario.riskLevel === "CRITICAL";
  return {
    selectedId: scenario.id,
    selectedName: scenario.name,
    riskLevel: scenario.riskLevel,
    panelType: scenario.panelType,
    actionText: scenario.actionText,
    actionOptions: crisis ? null : scenario.options ?? null,
    crisis,
    training: crisis ? false : current.training,
    faultId: current.faultId,
  };
}

export function resetWatchToNormal(): WatchState {
  return { ...IDLE_WATCH };
}

export function liveWatchBaseline(): WatchState {
  return { ...IDLE_WATCH };
}
