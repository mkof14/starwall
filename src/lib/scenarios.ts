export type RiskLevel = "NORMAL" | "ATTENTION" | "ELEVATED" | "CRITICAL";

export type PanelType = "radar" | "sonar" | "spectrum" | "perimeter";

export type Scenario = {
  id: string;
  category: string;
  name: string;
  riskLevel: Exclude<RiskLevel, "NORMAL">;
  panelType: PanelType;
  logText: string;
  actionText: string;
};

export type SessionEvent = {
  timestamp: string;
  name: string;
  category: string;
  riskLevel: RiskLevel;
  actionText: string;
};

export const SCENARIO_CATEGORIES = [
  "Air",
  "Surface",
  "Underwater",
  "RF / Electronic Warfare",
  "Perimeter & Access",
  "Complex / Crisis",
] as const;

export const SCENARIOS: Scenario[] = [
  {
    id: "recon-drone",
    category: "Air",
    name: "Reconnaissance drone",
    riskLevel: "ATTENTION",
    panelType: "radar",
    logText:
      "Unidentified UAV holding position 200m off starboard beam, camera-equipped, no registered operator signal.",
    actionText:
      "Maintain visual track. If it enters the 100m exclusion zone, hail via loudspeaker and log for the incident report.",
  },
  {
    id: "payload-drone",
    category: "Air",
    name: "Payload-carrying drone",
    riskLevel: "CRITICAL",
    panelType: "radar",
    logText:
      "UAV on direct inbound approach, flight profile consistent with payload delivery.",
    actionText:
      "Alert all personnel to clear deck areas. Contact Support Center immediately. Do not approach the aircraft.",
  },
  {
    id: "drone-swarm",
    category: "Air",
    name: "Drone swarm",
    riskLevel: "CRITICAL",
    panelType: "radar",
    logText:
      "6 UAV contacts detected in coordinated formation, converging from bearing 090.",
    actionText:
      "Escalate to Support Center immediately — multiple simultaneous contacts exceed single-operator response capacity.",
  },
  {
    id: "loitering-drone",
    category: "Air",
    name: "Loitering drone",
    riskLevel: "ATTENTION",
    panelType: "radar",
    logText: "UAV holding fixed position for 14 minutes, altitude 80m, bearing 270.",
    actionText:
      "Log position and duration. Reassess if loiter time exceeds 30 minutes or altitude decreases.",
  },
  {
    id: "converging-vessel",
    category: "Surface",
    name: "Converging unidentified vessel",
    riskLevel: "ELEVATED",
    panelType: "radar",
    logText:
      "Unidentified contact closing at 8 kn on an intercept-like bearing, no AIS response after two attempts.",
    actionText:
      "Recommend hailing on VHF ch.16, increase watch, prepare to alter course if range closes below 1.0 NM.",
  },
  {
    id: "vessel-no-ais",
    category: "Surface",
    name: "Vessel without AIS at anchor",
    riskLevel: "ATTENTION",
    panelType: "radar",
    logText: "Vessel in anchorage zone for 40 minutes, no AIS transponder detected.",
    actionText: "Monitor. Request identification via VHF if the vessel remains beyond one hour.",
  },
  {
    id: "usv-swarm",
    category: "Surface",
    name: "Autonomous surface vessel swarm",
    riskLevel: "CRITICAL",
    panelType: "radar",
    logText: "4 small surface contacts, no AIS, moving in a coordinated pattern at 18 knots.",
    actionText:
      "This pattern is consistent with a coordinated approach. Escalate immediately and prepare evasive maneuvering.",
  },
  {
    id: "critical-closing-speed",
    category: "Surface",
    name: "Critical closing speed",
    riskLevel: "CRITICAL",
    panelType: "radar",
    logText: "Contact closing at 22 knots, closest point of approach under 50m in 3 minutes.",
    actionText: "Sound horn, alter course immediately, notify Support Center.",
  },
  {
    id: "man-overboard",
    category: "Surface",
    name: "Man overboard",
    riskLevel: "CRITICAL",
    panelType: "radar",
    logText: "Perimeter sensor and crew report indicate a person in the water, port side.",
    actionText:
      "Execute man-overboard protocol immediately. Mark position. All hands to designated stations.",
  },
  {
    id: "stealth-uuv",
    category: "Underwater",
    name: "Stealth underwater drone",
    riskLevel: "ATTENTION",
    panelType: "sonar",
    logText:
      "Weak acoustic contact, bearing 200, classification uncertain — possible UUV, low confidence.",
    actionText:
      "Continue passive monitoring. Avoid active sonar unless the contact confirms hostile behavior.",
  },
  {
    id: "diver-near-hull",
    category: "Underwater",
    name: "Diver near hull",
    riskLevel: "ELEVATED",
    panelType: "sonar",
    logText: "Sonar contact consistent with a swimmer, 15m from hull, depth 3m.",
    actionText:
      "Alert the security team. Do not start engines or thrusters until the contact is identified.",
  },
  {
    id: "uuv-payload",
    category: "Underwater",
    name: "UUV approaching infrastructure",
    riskLevel: "CRITICAL",
    panelType: "sonar",
    logText:
      "Underwater contact on direct approach to hull/pier structure, non-biological signature.",
    actionText:
      "Immediate Support Center escalation. Evacuate non-essential personnel from the affected area.",
  },
  {
    id: "gps-spoofing",
    category: "RF / Electronic Warfare",
    name: "GPS spoofing",
    riskLevel: "ELEVATED",
    panelType: "spectrum",
    logText: "Reported GPS position inconsistent with radar-derived position by 340m.",
    actionText:
      "Cross-check position with radar and visual references. Do not rely on GPS-only navigation until resolved.",
  },
  {
    id: "comms-jamming",
    category: "RF / Electronic Warfare",
    name: "Communications jamming",
    riskLevel: "CRITICAL",
    panelType: "spectrum",
    logText:
      "Loss of satcom and VHF signal quality, consistent with active jamming in the area.",
    actionText:
      "Switch to the backup communication channel. Log time and duration for post-event analysis.",
  },
  {
    id: "anomalous-rf",
    category: "RF / Electronic Warfare",
    name: "Anomalous RF signal",
    riskLevel: "ATTENTION",
    panelType: "spectrum",
    logText: "Unclassified RF emission detected, bearing 150, intermittent.",
    actionText:
      "Log signal characteristics. No immediate action required unless the pattern repeats or strengthens.",
  },
  {
    id: "network-intrusion",
    category: "RF / Electronic Warfare",
    name: "Onboard network intrusion attempt",
    riskLevel: "ELEVATED",
    panelType: "spectrum",
    logText:
      "Unusual authentication attempts detected on the vessel network from an unrecognized device.",
    actionText: "Isolate the affected network segment. Notify IT / Support Center.",
  },
  {
    id: "perimeter-breach",
    category: "Perimeter & Access",
    name: "Perimeter breach",
    riskLevel: "ELEVATED",
    panelType: "perimeter",
    logText:
      "Motion sensor triggered, fence line sector 4, no authorized personnel logged in the area.",
    actionText: "Dispatch the nearest security patrol. Activate area cameras.",
  },
  {
    id: "unauthorized-vehicle",
    category: "Perimeter & Access",
    name: "Unauthorized vehicle at checkpoint",
    riskLevel: "ATTENTION",
    panelType: "perimeter",
    logText: "Vehicle at gate 2 without a registered access credential.",
    actionText: "Hold at checkpoint, verify identity before granting access.",
  },
  {
    id: "tailgating",
    category: "Perimeter & Access",
    name: "Tailgating at access point",
    riskLevel: "ATTENTION",
    panelType: "perimeter",
    logText: "Two persons detected passing a single-badge access point.",
    actionText: "Review camera footage, confirm the second person's authorization.",
  },
  {
    id: "unattended-object",
    category: "Perimeter & Access",
    name: "Unattended object",
    riskLevel: "ATTENTION",
    panelType: "perimeter",
    logText: "Object detected in a controlled zone for over 20 minutes, no associated personnel.",
    actionText: "Do not approach directly. Notify the security lead for assessment.",
  },
  {
    id: "multi-domain-event",
    category: "Complex / Crisis",
    name: "Multi-domain simultaneous event",
    riskLevel: "CRITICAL",
    panelType: "radar",
    logText:
      "Simultaneous contacts: airborne UAV (bearing 090) and unidentified surface vessel (bearing 140).",
    actionText:
      "This is a multi-domain event — escalate to Crisis Mode immediately, full Support Center engagement.",
  },
  {
    id: "support-center-lost",
    category: "Complex / Crisis",
    name: "Support Center connection lost",
    riskLevel: "CRITICAL",
    panelType: "spectrum",
    logText: "Satcom link to Support Center lost, 3 failed reconnection attempts.",
    actionText:
      "Switch to the backup communication protocol. Continue local monitoring and logging until the link is restored.",
  },
  {
    id: "special-event-mode",
    category: "Complex / Crisis",
    name: "Special Event / VIP mode",
    riskLevel: "ATTENTION",
    panelType: "perimeter",
    logText:
      "Special Event Mode active — temporary risk profile adjustment for elevated guest presence.",
    actionText:
      "Baseline sensitivity increased. Review all Attention-level contacts manually during this period.",
  },
];

export const PANEL_CHROME: Record<
  Exclude<PanelType, "radar">,
  { title: string; extra: string; testId: string }
> = {
  sonar: {
    title: "UNDERWATER PICTURE",
    extra: "RANGE 1.0 NM · SONAR ACTIVE",
    testId: "sonar-panel",
  },
  spectrum: {
    title: "RF SPECTRUM",
    extra: "WIDE-BAND SCAN · ACTIVE",
    testId: "spectrum-panel",
  },
  perimeter: {
    title: "PERIMETER",
    extra: "5 SENSORS · 1 ALERT",
    testId: "perimeter-panel",
  },
};

export const RESET_LOG = "Risk level reset to Normal.";
