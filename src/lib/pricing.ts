export const OBJECT_TYPES = [
  {
    id: "yacht",
    multiplier: 1,
  },
  {
    id: "marina",
    multiplier: 1.3,
  },
  {
    id: "port",
    multiplier: 1.8,
  },
  {
    id: "island",
    multiplier: 1.5,
  },
  {
    id: "event",
    multiplier: 0.6,
  },
] as const;

export const SOFTWARE_TIERS = [
  { id: "LIGHT", monthly: 1500, custom: false },
  { id: "ADVANCED", monthly: 3500, custom: false, popular: true },
  { id: "INTELLIGENCE", monthly: 7000, custom: false },
  { id: "CUSTOM", monthly: null, custom: true },
] as const;

export const CONTAINER_TIERS = [
  { id: "none", oneTime: 0, exclusive: false },
  { id: "basic", oneTime: 80_000, exclusive: false },
  { id: "business", oneTime: 150_000, exclusive: false },
  { id: "premium", oneTime: 280_000, exclusive: false },
  { id: "exclusive", oneTime: null, exclusive: true },
] as const;

export const ADDONS = [
  { id: "camera", oneTime: 2_000, monthly: 0 },
  { id: "radar", oneTime: 5_000, monthly: 0 },
  { id: "sonar", oneTime: 8_000, monthly: 0 },
  { id: "rf", oneTime: 12_000, monthly: 0 },
  { id: "seat", oneTime: 0, monthly: 500 },
] as const;

export type ObjectId = (typeof OBJECT_TYPES)[number]["id"];
export type SoftwareId = (typeof SOFTWARE_TIERS)[number]["id"];
export type ContainerId = (typeof CONTAINER_TIERS)[number]["id"];
export type AddonId = (typeof ADDONS)[number]["id"];

export type PricingSelection = {
  objectId: ObjectId;
  softwareId: SoftwareId;
  containerId: ContainerId;
  addonIds: AddonId[];
};

export const DEFAULT_SELECTION: PricingSelection = {
  objectId: "yacht",
  softwareId: "ADVANCED",
  containerId: "none",
  addonIds: [],
};

export function isObjectId(value: string | null | undefined): value is ObjectId {
  return OBJECT_TYPES.some((item) => item.id === value);
}

export function isSoftwareId(value: string | null | undefined): value is SoftwareId {
  return SOFTWARE_TIERS.some((item) => item.id === value);
}

export function isContainerId(value: string | null | undefined): value is ContainerId {
  return CONTAINER_TIERS.some((item) => item.id === value);
}

export function isAddonId(value: string | null | undefined): value is AddonId {
  return ADDONS.some((item) => item.id === value);
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getObject(id: ObjectId) {
  return OBJECT_TYPES.find((item) => item.id === id) ?? OBJECT_TYPES[0];
}

export function getSoftware(id: SoftwareId) {
  return SOFTWARE_TIERS.find((item) => item.id === id) ?? SOFTWARE_TIERS[1];
}

export function getContainer(id: ContainerId) {
  return CONTAINER_TIERS.find((item) => item.id === id) ?? CONTAINER_TIERS[0];
}

export function quoteFromSearch(params: {
  object?: string;
  software?: string;
  container?: string;
  addons?: string;
}): PricingSelection | null {
  if (!isObjectId(params.object) || !isSoftwareId(params.software) || !isContainerId(params.container)) {
    return null;
  }
  const addonIds = (params.addons ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(isAddonId);
  return {
    objectId: params.object,
    softwareId: params.software,
    containerId: params.container,
    addonIds,
  };
}

export function selectionToQuery(selection: PricingSelection) {
  const params = new URLSearchParams({
    object: selection.objectId,
    software: selection.softwareId,
    container: selection.containerId,
  });
  if (selection.addonIds.length) {
    params.set("addons", selection.addonIds.join(","));
  }
  return params.toString();
}

export type QuoteBreakdown = {
  multiplier: number;
  customSoftware: boolean;
  exclusiveContainer: boolean;
  softwareMonthly: number | null;
  containerOneTime: number | null;
  addonMonthly: number;
  addonOneTime: number;
  monthly: number | null;
  oneTime: number | null;
};

export function calculateQuote(selection: PricingSelection): QuoteBreakdown {
  const object = getObject(selection.objectId);
  const software = getSoftware(selection.softwareId);
  const container = getContainer(selection.containerId);
  const addons = ADDONS.filter((item) => selection.addonIds.includes(item.id));
  const addonMonthly = addons.reduce((sum, item) => sum + item.monthly, 0);
  const addonOneTime = addons.reduce((sum, item) => sum + item.oneTime, 0);
  const customSoftware = software.custom;
  const exclusiveContainer = container.exclusive;

  const softwareMonthly =
    software.monthly === null ? null : Math.round(software.monthly * object.multiplier);
  const containerOneTime =
    customSoftware || container.oneTime === null
      ? null
      : Math.round(container.oneTime * object.multiplier);

  return {
    multiplier: object.multiplier,
    customSoftware,
    exclusiveContainer,
    softwareMonthly,
    containerOneTime,
    addonMonthly: customSoftware ? 0 : addonMonthly,
    addonOneTime: customSoftware || exclusiveContainer ? 0 : addonOneTime,
    monthly: softwareMonthly === null ? null : softwareMonthly + (customSoftware ? 0 : addonMonthly),
    oneTime:
      customSoftware || exclusiveContainer
        ? null
        : (containerOneTime ?? 0) + addonOneTime,
  };
}
