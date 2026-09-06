export const EQUIPMENT = [
  { id: "radar", name: "Radar" },
  { id: "ais", name: "AIS" },
  { id: "cctv", name: "CCTV" },
  { id: "perimeter", name: "Perimeter sensors" },
  { id: "sonar", name: "Sonar" },
  { id: "satcom", name: "Satcom link" },
] as const;

export const EQUIPMENT_CATALOG = [
  { id: "radar", name: "Radar", category: "sensor" },
  { id: "ais", name: "AIS", category: "sensor" },
  { id: "cctv", name: "CCTV", category: "sensor" },
  { id: "perimeter", name: "Perimeter sensors", category: "sensor" },
  { id: "sonar", name: "Sonar", category: "sensor" },
  { id: "satcom", name: "Satcom", category: "comms" },
  {
    id: "hull",
    name: "AGRON Container — Hull Sensor Array",
    category: "container",
  },
  {
    id: "power",
    name: "AGRON Container — Power System",
    category: "container",
  },
] as const;

export type EquipmentId = (typeof EQUIPMENT)[number]["id"];
export type EquipmentStatus = "ok" | "warning" | "fail";

export function equipmentName(id: EquipmentId) {
  return EQUIPMENT.find((item) => item.id === id)?.name ?? id;
}

export function isEquipmentStatus(value: unknown): value is EquipmentStatus {
  return value === "ok" || value === "warning" || value === "fail";
}
