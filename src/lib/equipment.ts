export const EQUIPMENT = [
  { id: "radar", name: "Radar" },
  { id: "ais", name: "AIS" },
  { id: "cctv", name: "CCTV" },
  { id: "perimeter", name: "Perimeter sensors" },
  { id: "sonar", name: "Sonar" },
  { id: "satcom", name: "Satcom link" },
] as const;

export type EquipmentId = (typeof EQUIPMENT)[number]["id"];

export function equipmentName(id: EquipmentId) {
  return EQUIPMENT.find((item) => item.id === id)?.name ?? id;
}
