export const PLAN_ORDER = ["LIGHT", "ADVANCED", "INTELLIGENCE", "CUSTOM"] as const;
export type PlanId = (typeof PLAN_ORDER)[number];

export const POPULAR_PLAN: PlanId = "ADVANCED";

export type CompareCell = "yes" | "no" | "optional";

export const COMPARE_KEYS = [
  "liveView",
  "existing",
  "cameras",
  "radar",
  "correlation",
  "risk",
  "ai",
  "adaptive",
  "predictive",
  "multisite",
  "engineering",
] as const;

export type CompareKey = (typeof COMPARE_KEYS)[number];

export const COMPARE_ROWS: Record<CompareKey, [CompareCell, CompareCell, CompareCell, CompareCell]> =
  {
    liveView: ["yes", "yes", "yes", "yes"],
    existing: ["yes", "yes", "yes", "yes"],
    cameras: ["yes", "yes", "yes", "yes"],
    radar: ["no", "yes", "yes", "yes"],
    correlation: ["no", "yes", "yes", "yes"],
    risk: ["no", "yes", "yes", "yes"],
    ai: ["no", "no", "yes", "yes"],
    adaptive: ["no", "no", "yes", "yes"],
    predictive: ["no", "no", "yes", "yes"],
    multisite: ["no", "no", "optional", "yes"],
    engineering: ["no", "no", "optional", "yes"],
  };

export const ASSET_KEYS = [
  "yacht",
  "superyacht",
  "marina",
  "island",
  "port",
  "special",
  "other",
] as const;
export type AssetKey = (typeof ASSET_KEYS)[number];

export const SYSTEM_KEYS = [
  "radar",
  "cameras",
  "ais",
  "sonar",
  "sensors",
  "access",
  "comms",
  "other",
  "none",
] as const;
export type SystemKey = (typeof SYSTEM_KEYS)[number];

export const REQUIREMENT_KEYS = [
  "visibility",
  "risk",
  "protection",
  "intelligence",
  "complete",
  "unsure",
] as const;
export type RequirementKey = (typeof REQUIREMENT_KEYS)[number];

export const REQUIREMENT_BY_PLAN: Record<PlanId, RequirementKey> = {
  LIGHT: "visibility",
  ADVANCED: "protection",
  INTELLIGENCE: "intelligence",
  CUSTOM: "complete",
};

export const ENVIRONMENT_KEYS = [
  "yacht",
  "marina",
  "island",
  "port",
  "special",
] as const;
export type EnvironmentKey = (typeof ENVIRONMENT_KEYS)[number];

export const HARDWARE_KEYS = [
  "existing",
  "modules",
  "mobile",
  "complete",
] as const;
export type HardwareKey = (typeof HARDWARE_KEYS)[number];

export const HOW_KEYS = ["plan", "integration", "hardware", "support", "result"] as const;
export type HowKey = (typeof HOW_KEYS)[number];
