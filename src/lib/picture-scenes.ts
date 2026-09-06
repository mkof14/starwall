export type ContactTone = "ok" | "attn" | "crit";
export type ContactShape = "vessel" | "uav" | "usv" | "mob" | "sonar";
export type ContactMotion = "static" | "close" | "inbound" | "orbit" | "hold";

export type PictureContact = {
  id: string;
  label: string;
  name: string;
  type: string;
  dist: string;
  x: number;
  y: number;
  tone: ContactTone;
  shape?: ContactShape;
  motion?: ContactMotion;
};

export type RadarScene = {
  kind: "radar";
  extra: string;
  heading: string;
  contacts: PictureContact[];
};

export type SonarScene = {
  kind: "sonar";
  extra: string;
  contacts: PictureContact[];
  note: string;
};

export type SpectrumScene = {
  kind: "spectrum";
  extra: string;
  variant: "watch" | "anomaly" | "spoof" | "jam" | "intrusion" | "satcom";
  callout: string;
};

export type PerimeterScene = {
  kind: "perimeter";
  extra: string;
  variant: "watch" | "breach" | "vehicle" | "tailgate" | "object" | "vip";
  callout: string;
};

export type PictureScene = RadarScene | SonarScene | SpectrumScene | PerimeterScene;

const CX = 340;
const CY = 214;
const RING = 168;

export function polar(bearingDeg: number, nm: number, maxNm = 6) {
  const r = Math.min(nm / maxNm, 1) * RING;
  const rad = ((bearingDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

const TRAFFIC: PictureContact[] = [
  {
    id: "kestrel",
    label: "KESTREL 2",
    name: "M/V KESTREL 2",
    type: "Cargo · 4200t · AIS ok",
    dist: "3.1 NM · brg 318°",
    ...polar(318, 3.1),
    tone: "ok",
    shape: "vessel",
  },
  {
    id: "sirena",
    label: "SIRENA",
    name: "M/Y SIRENA",
    type: "Yacht · 38m · known",
    dist: "2.0 NM · brg 048°",
    ...polar(48, 2.0),
    tone: "ok",
    shape: "vessel",
  },
];

function uav(
  id: string,
  label: string,
  bearing: number,
  nm: number,
  tone: ContactTone,
  motion: ContactMotion,
  extra: Partial<PictureContact> = {},
): PictureContact {
  return {
    id,
    label,
    name: extra.name ?? label,
    type: extra.type ?? "UAV · no remote ID",
    dist: extra.dist ?? `${nm.toFixed(1)} NM · brg ${bearing}°`,
    ...polar(bearing, nm),
    tone,
    shape: "uav",
    motion,
    ...extra,
  };
}

const RADAR: Record<string, RadarScene> = {
  watch: {
    kind: "radar",
    extra: "RANGE 6.0 NM · 3 CONTACTS",
    heading: "HDG 247° · 11.4KN",
    contacts: [
      ...TRAFFIC,
      {
        id: "unident",
        label: "UNIDENT.",
        name: "Fishing vessel (unident.)",
        type: "No AIS signal",
        dist: "4.6 NM · brg 142°",
        ...polar(142, 4.6),
        tone: "ok",
        shape: "vessel",
      },
    ],
  },
  "recon-drone": {
    kind: "radar",
    extra: "RANGE 6.0 NM · UAV TRACK",
    heading: "HDG 247° · 11.4KN",
    contacts: [
      ...TRAFFIC,
      uav("recon", "UAV", 90, 1.15, "attn", "orbit", {
        name: "Reconnaissance UAV",
        type: "Camera-equipped · no operator signal",
        dist: "200 m · starboard beam",
      }),
    ],
  },
  "payload-drone": {
    kind: "radar",
    extra: "RANGE 6.0 NM · INBOUND UAV",
    heading: "HDG 247° · 11.4KN",
    contacts: [
      ...TRAFFIC,
      uav("payload", "UAV INBOUND", 45, 1.4, "crit", "inbound", {
        name: "Payload-carrying UAV",
        type: "Direct inbound · payload profile",
        dist: "1.4 NM · closing",
      }),
    ],
  },
  "drone-swarm": {
    kind: "radar",
    extra: "RANGE 6.0 NM · 6 UAV CONTACTS",
    heading: "HDG 247° · 11.4KN",
    contacts: [
      uav("s1", "UAV-1", 78, 2.4, "crit", "inbound"),
      uav("s2", "UAV-2", 86, 2.1, "crit", "inbound"),
      uav("s3", "UAV-3", 94, 1.8, "crit", "close"),
      uav("s4", "UAV-4", 102, 2.2, "crit", "inbound"),
      uav("s5", "UAV-5", 90, 2.8, "crit", "hold"),
      uav("s6", "UAV-6", 110, 2.6, "crit", "close"),
    ],
  },
  "loitering-drone": {
    kind: "radar",
    extra: "RANGE 6.0 NM · LOITER 14 MIN",
    heading: "HDG 247° · 11.4KN",
    contacts: [
      ...TRAFFIC,
      uav("loiter", "UAV HOLD", 270, 1.05, "attn", "hold", {
        name: "Loitering UAV",
        type: "Fixed station · alt 80 m",
        dist: "80 m · brg 270° · 14 min",
      }),
    ],
  },
  "converging-vessel": {
    kind: "radar",
    extra: "RANGE 6.0 NM · 4 CONTACTS",
    heading: "HDG 247° · 11.4KN",
    contacts: [
      ...TRAFFIC,
      {
        id: "unident",
        label: "UNIDENT.",
        name: "Fishing vessel (unident.)",
        type: "No AIS signal",
        dist: "4.6 NM · brg 142°",
        ...polar(142, 4.6),
        tone: "ok",
        shape: "vessel",
      },
      {
        id: "closing",
        label: "NEW CONTACT",
        name: "NEW CONTACT",
        type: "Unidentified · no AIS",
        dist: "4.2 NM · closing 8 kn",
        ...polar(130, 4.2),
        tone: "crit",
        shape: "vessel",
        motion: "close",
      },
    ],
  },
  "vessel-no-ais": {
    kind: "radar",
    extra: "RANGE 6.0 NM · ANCHORAGE",
    heading: "HDG 000° · 0.0KN",
    contacts: [
      TRAFFIC[1],
      {
        id: "anchor",
        label: "NO AIS",
        name: "Vessel without AIS",
        type: "At anchor · no transponder",
        dist: "0.8 NM · 40 min stationary",
        ...polar(210, 0.8),
        tone: "attn",
        shape: "vessel",
        motion: "static",
      },
    ],
  },
  "usv-swarm": {
    kind: "radar",
    extra: "RANGE 6.0 NM · 4 SURFACE CONTACTS",
    heading: "HDG 247° · 11.4KN",
    contacts: [
      {
        id: "u1",
        label: "USV-1",
        name: "Small surface contact",
        type: "No AIS · coordinated",
        dist: "1.6 NM · 18 kn",
        ...polar(118, 1.6),
        tone: "crit",
        shape: "usv",
        motion: "inbound",
      },
      {
        id: "u2",
        label: "USV-2",
        name: "Small surface contact",
        type: "No AIS · coordinated",
        dist: "1.8 NM · 18 kn",
        ...polar(128, 1.8),
        tone: "crit",
        shape: "usv",
        motion: "inbound",
      },
      {
        id: "u3",
        label: "USV-3",
        name: "Small surface contact",
        type: "No AIS · coordinated",
        dist: "2.0 NM · 18 kn",
        ...polar(138, 2.0),
        tone: "crit",
        shape: "usv",
        motion: "close",
      },
      {
        id: "u4",
        label: "USV-4",
        name: "Small surface contact",
        type: "No AIS · coordinated",
        dist: "2.2 NM · 18 kn",
        ...polar(148, 2.2),
        tone: "crit",
        shape: "usv",
        motion: "inbound",
      },
    ],
  },
  "critical-closing-speed": {
    kind: "radar",
    extra: "RANGE 6.0 NM · CPA < 50 M",
    heading: "HDG 247° · 11.4KN",
    contacts: [
      ...TRAFFIC,
      {
        id: "fast",
        label: "CLOSING 22KN",
        name: "High-speed contact",
        type: "CPA under 50 m · 3 min",
        dist: "1.1 NM · closing 22 kn",
        ...polar(155, 1.1),
        tone: "crit",
        shape: "vessel",
        motion: "inbound",
      },
    ],
  },
  "man-overboard": {
    kind: "radar",
    extra: "RANGE 0.5 NM · MOB PORT",
    heading: "HDG 247° · 4.0KN",
    contacts: [
      {
        id: "mob",
        label: "MOB",
        name: "Person in the water",
        type: "Port side · crew report",
        dist: "40 m · mark position",
        ...polar(270, 0.55),
        tone: "crit",
        shape: "mob",
        motion: "hold",
      },
    ],
  },
  "multi-domain-event": {
    kind: "radar",
    extra: "RANGE 6.0 NM · AIR + SURFACE",
    heading: "HDG 247° · 11.4KN",
    contacts: [
      uav("md-uav", "UAV", 90, 1.6, "crit", "inbound", {
        name: "Airborne UAV",
        type: "Bearing 090 · simultaneous",
        dist: "1.6 NM · brg 090°",
      }),
      {
        id: "md-surf",
        label: "NEW CONTACT",
        name: "Unidentified surface vessel",
        type: "No AIS · bearing 140",
        dist: "2.4 NM · brg 140°",
        ...polar(140, 2.4),
        tone: "crit",
        shape: "vessel",
        motion: "close",
      },
      TRAFFIC[0],
    ],
  },
};

const SONAR: Record<string, SonarScene> = {
  watch: {
    kind: "sonar",
    extra: "RANGE 1.0 NM · SONAR ACTIVE",
    note: "PASSIVE WATCH",
    contacts: [
      {
        id: "bio",
        label: "CONTACT — 15M DEPTH",
        name: "Acoustic contact",
        type: "Classification uncertain",
        dist: "Bearing 040",
        x: 468,
        y: 118,
        tone: "ok",
        shape: "sonar",
        motion: "hold",
      },
    ],
  },
  "stealth-uuv": {
    kind: "sonar",
    extra: "RANGE 1.0 NM · LOW CONFIDENCE",
    note: "WEAK RETURN · BRG 200",
    contacts: [
      {
        id: "uuv",
        label: "WEAK · UUV?",
        name: "Stealth underwater drone",
        type: "Low confidence · possible UUV",
        dist: "Bearing 200 · faint",
        ...polar(200, 3.2),
        tone: "attn",
        shape: "sonar",
        motion: "hold",
      },
    ],
  },
  "diver-near-hull": {
    kind: "sonar",
    extra: "RANGE 1.0 NM · 15 M FROM HULL",
    note: "SWIMMER · DEPTH 3 M",
    contacts: [
      {
        id: "diver",
        label: "SWIMMER",
        name: "Diver near hull",
        type: "Swimmer signature · 15 m",
        dist: "Depth 3 m · port",
        ...polar(250, 1.05),
        tone: "attn",
        shape: "sonar",
        motion: "close",
      },
    ],
  },
  "uuv-payload": {
    kind: "sonar",
    extra: "RANGE 1.0 NM · HULL APPROACH",
    note: "NON-BIOLOGICAL · INBOUND",
    contacts: [
      {
        id: "payload-uuv",
        label: "UUV INBOUND",
        name: "UUV approaching infrastructure",
        type: "Non-biological · hull/pier",
        dist: "Direct approach",
        ...polar(175, 1.8),
        tone: "crit",
        shape: "sonar",
        motion: "inbound",
      },
    ],
  },
};

const SPECTRUM: Record<string, SpectrumScene> = {
  watch: {
    kind: "spectrum",
    extra: "WIDE-BAND SCAN · ACTIVE",
    variant: "watch",
    callout: "SCAN STABLE",
  },
  "anomalous-rf": {
    kind: "spectrum",
    extra: "WIDE-BAND SCAN · BURST",
    variant: "anomaly",
    callout: "ANOMALY — 5.8GHz",
  },
  "gps-spoofing": {
    kind: "spectrum",
    extra: "PNT CHECK · OFFSET 340 M",
    variant: "spoof",
    callout: "GPS ≠ RADAR · 340 M",
  },
  "comms-jamming": {
    kind: "spectrum",
    extra: "SATCOM / VHF · DEGRADED",
    variant: "jam",
    callout: "JAMMING — LINK QUALITY DOWN",
  },
  "network-intrusion": {
    kind: "spectrum",
    extra: "ONBOARD NET · AUTH WATCH",
    variant: "intrusion",
    callout: "UNRECOGNIZED DEVICE",
  },
  "support-center-lost": {
    kind: "spectrum",
    extra: "SATCOM · 3 FAILED RETRIES",
    variant: "satcom",
    callout: "SUPPORT LINK LOST",
  },
};

const PERIMETER: Record<string, PerimeterScene> = {
  watch: {
    kind: "perimeter",
    extra: "5 SENSORS · QUIET",
    variant: "watch",
    callout: "ALL SECTORS CLEAR",
  },
  "perimeter-breach": {
    kind: "perimeter",
    extra: "5 SENSORS · 1 ALERT",
    variant: "breach",
    callout: "SECTOR 4 — TRIGGERED",
  },
  "unauthorized-vehicle": {
    kind: "perimeter",
    extra: "GATE 2 · HOLD",
    variant: "vehicle",
    callout: "VEHICLE — NO CREDENTIAL",
  },
  tailgating: {
    kind: "perimeter",
    extra: "ACCESS POINT · TWO PERSONS",
    variant: "tailgate",
    callout: "TAILGATE — SINGLE BADGE",
  },
  "unattended-object": {
    kind: "perimeter",
    extra: "ZONE B · 20 MIN",
    variant: "object",
    callout: "UNATTENDED OBJECT",
  },
  "special-event-mode": {
    kind: "perimeter",
    extra: "VIP PROFILE · RAISED SENSITIVITY",
    variant: "vip",
    callout: "SPECIAL EVENT MODE",
  },
};

export function radarScene(scenarioId: string): RadarScene {
  return RADAR[scenarioId] ?? RADAR.watch;
}

export function sonarScene(scenarioId: string): SonarScene {
  return SONAR[scenarioId] ?? SONAR.watch;
}

export function spectrumScene(scenarioId: string): SpectrumScene {
  return SPECTRUM[scenarioId] ?? SPECTRUM.watch;
}

export function perimeterScene(scenarioId: string): PerimeterScene {
  return PERIMETER[scenarioId] ?? PERIMETER.watch;
}

export function toneColor(tone: ContactTone) {
  if (tone === "attn") return "#E8B23D";
  if (tone === "crit") return "#F15A00";
  return "#33D3A6";
}

export function motionTowardOwnShip(x: number, y: number, px: number) {
  const dx = CX - x;
  const dy = CY - y;
  const len = Math.hypot(dx, dy) || 1;
  return { mx: (dx / len) * px, my: (dy / len) * px };
}
