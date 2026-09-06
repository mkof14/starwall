import { describe, expect, it } from "vitest";
import { SCENARIOS } from "@/lib/scenarios";
import {
  applyScenarioToWatch,
  IDLE_WATCH,
  liveWatchBaseline,
  resetWatchToNormal,
} from "@/lib/watch-state";

const idle = { ...IDLE_WATCH };

describe("applyScenarioToWatch", () => {
  it("sets the catalog risk level and panel type", () => {
    const recon = SCENARIOS.find((item) => item.id === "recon-drone");
    expect(recon).toBeDefined();
    const next = applyScenarioToWatch(recon!, idle);
    expect(next.riskLevel).toBe(recon!.riskLevel);
    expect(next.panelType).toBe(recon!.panelType);
    expect(next.selectedId).toBe("recon-drone");
    expect(next.crisis).toBe(false);
    expect(next.actionOptions?.some((option) => option.recommended)).toBe(true);
  });

  it("activates crisis and drops ranked options on CRITICAL scenarios", () => {
    const swarm = SCENARIOS.find((item) => item.id === "usv-swarm");
    expect(swarm?.riskLevel).toBe("CRITICAL");
    const next = applyScenarioToWatch(swarm!, { training: true, faultId: null });
    expect(next.crisis).toBe(true);
    expect(next.training).toBe(false);
    expect(next.actionOptions).toBeNull();
    expect(next.actionText).toBe(swarm!.actionText);
  });
});

describe("resetWatchToNormal", () => {
  it("returns the idle baseline after a scenario", () => {
    const recon = SCENARIOS.find((item) => item.id === "recon-drone")!;
    const raised = applyScenarioToWatch(recon, idle);
    expect(raised.riskLevel).not.toBe("NORMAL");
    expect(resetWatchToNormal()).toEqual(IDLE_WATCH);
  });
});

describe("liveWatchBaseline", () => {
  it("clears the simulated watch picture", () => {
    expect(liveWatchBaseline()).toEqual(IDLE_WATCH);
  });
});
