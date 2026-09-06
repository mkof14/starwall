export type EndpointKind = "sensor" | "human" | "console";
export type FlowDirection = "in" | "out";

export type MapEndpoint = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: EndpointKind;
  group?: "container";
  flow: FlowDirection;
  tip: string;
};

export const MAP_W = 1600;
export const MAP_H = 980;
export const CORE = { x: 820, y: 500, r: 58 };

export const CONTAINER_BOX = {
  id: "container",
  x: 70,
  y: 250,
  w: 460,
  h: 500,
  tip: "Deployable hardware unit — see /containers for details",
  href: "/containers",
};

export const ENDPOINTS: MapEndpoint[] = [
  {
    id: "radar",
    label: "Radar",
    x: 190,
    y: 370,
    kind: "sensor",
    group: "container",
    flow: "in",
    tip: "360° detection, feeds the Situational Picture panel.",
  },
  {
    id: "sonar",
    label: "Sonar",
    x: 400,
    y: 370,
    kind: "sensor",
    group: "container",
    flow: "in",
    tip: "Underwater contacts, shown on the sonar picture.",
  },
  {
    id: "rf",
    label: "RF / EW Sensors",
    x: 190,
    y: 520,
    kind: "sensor",
    group: "container",
    flow: "in",
    tip: "Spectrum watch for jamming, spoofing, and drone RF.",
  },
  {
    id: "cameras",
    label: "Cameras",
    x: 400,
    y: 520,
    kind: "sensor",
    group: "container",
    flow: "in",
    tip: "EO/IR and CCTV, correlated with the same picture.",
  },
  {
    id: "power",
    label: "Power System",
    x: 295,
    y: 660,
    kind: "sensor",
    group: "container",
    flow: "in",
    tip: "Container power health, reported as a watched system.",
  },
  {
    id: "ais",
    label: "AIS",
    x: 820,
    y: 150,
    kind: "sensor",
    flow: "in",
    tip: "Vessel identity and tracks from the AIS feed.",
  },
  {
    id: "satcom",
    label: "Satcom Link",
    x: 1220,
    y: 250,
    kind: "sensor",
    flow: "in",
    tip: "Uplink path — watched both as a channel and a system.",
  },
  {
    id: "perimeter",
    label: "Perimeter Sensors",
    x: 820,
    y: 860,
    kind: "sensor",
    flow: "in",
    tip: "Site and deck sensors around the protected object.",
  },
  {
    id: "support",
    label: "Support Center",
    x: 1340,
    y: 500,
    kind: "human",
    flow: "out",
    tip: "Human specialists — escalation is always authorized.",
  },
  {
    id: "bridge",
    label: "AGRON Bridge",
    x: 1200,
    y: 780,
    kind: "console",
    flow: "out",
    tip: "The operator screen — where the captain sees one picture.",
  },
];

export function pointOnLine(
  from: { x: number; y: number },
  to: { x: number; y: number },
  inset: number,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: from.x + (dx / len) * inset,
    y: from.y + (dy / len) * inset,
  };
}
