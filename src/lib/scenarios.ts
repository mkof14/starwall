export type RiskLevel = "NORMAL" | "ATTENTION" | "ELEVATED" | "CRITICAL";

export type PanelType = "radar" | "sonar" | "spectrum" | "perimeter";

export type ScenarioOption = {
  label: string;
  detail: string;
  recommended: boolean;
};

export type Scenario = {
  id: string;
  category: string;
  name: string;
  riskLevel: Exclude<RiskLevel, "NORMAL">;
  panelType: PanelType;
  logText: string;
  actionText: string;
  options?: ScenarioOption[];
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
      "Hold visual track. Keep it in sight and log the pass; challenge only if it enters the 100m exclusion zone.",
    options: [
      {
        label: "Hold visual track",
        detail:
          "Keep it in sight and log the pass; challenge only if it enters the 100m exclusion zone.",
        recommended: true,
      },
      {
        label: "Hail via loudspeaker now",
        detail:
          "Faster challenge if an operator is nearby, but you have announced that you noticed it.",
        recommended: false,
      },
      {
        label: "Ask Support Center to identify",
        detail: "Useful if it stays on station, slower than a local visual watch.",
        recommended: false,
      },
    ],
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
      "Log position and keep watch. Record bearing, altitude, and duration; reassess after 30 minutes or if it descends.",
    options: [
      {
        label: "Log position and keep watch",
        detail:
          "Record bearing, altitude, and duration; reassess after 30 minutes or if it descends.",
        recommended: true,
      },
      {
        label: "Challenge on loudspeaker",
        detail: "May end the loiter sooner, at the cost of revealing the watch.",
        recommended: false,
      },
      {
        label: "Widen RF and camera coverage",
        detail:
          "Better chance of finding a nearby operator, extra attention for a still contact.",
        recommended: false,
      },
    ],
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
      "Hail on VHF ch.16. Direct contact, fastest resolution if the vessel is monitoring radio.",
    options: [
      {
        label: "Hail on VHF ch.16",
        detail:
          "Direct contact, fastest resolution if the vessel is monitoring radio.",
        recommended: true,
      },
      {
        label: "Increase watch only",
        detail:
          "Lower disruption, but delays identification if the contact doesn't respond to other cues.",
        recommended: false,
      },
      {
        label: "Alter course preemptively",
        detail: "Removes the risk immediately, at the cost of the planned route.",
        recommended: false,
      },
    ],
  },
  {
    id: "vessel-no-ais",
    category: "Surface",
    name: "Vessel without AIS at anchor",
    riskLevel: "ATTENTION",
    panelType: "radar",
    logText: "Vessel in anchorage zone for 40 minutes, no AIS transponder detected.",
    actionText:
      "Continue monitoring. Static contacts without AIS are common in an anchorage; wait one hour before escalating.",
    options: [
      {
        label: "Continue monitoring",
        detail:
          "Static contacts without AIS are common in an anchorage; wait one hour before escalating.",
        recommended: true,
      },
      {
        label: "Hail via VHF now",
        detail:
          "Faster identification, but occupies the watch for a vessel that is not moving.",
        recommended: false,
      },
      {
        label: "Dispatch tender to investigate",
        detail: "Confirms identity at the cost of a boat, crew, and time.",
        recommended: false,
      },
    ],
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
      "Continue passive monitoring. Avoids lighting up the water column until the contact is confirmed.",
    options: [
      {
        label: "Continue passive monitoring",
        detail:
          "Avoids lighting up the water column until the contact is confirmed.",
        recommended: true,
      },
      {
        label: "Go active on sonar",
        detail:
          "Better classification, but announces your sensors and can mask other contacts.",
        recommended: false,
      },
      {
        label: "Stand by the security team",
        detail:
          "Ready if it closes the hull, pulls people from other duties for a weak contact.",
        recommended: false,
      },
    ],
  },
  {
    id: "diver-near-hull",
    category: "Underwater",
    name: "Diver near hull",
    riskLevel: "ELEVATED",
    panelType: "sonar",
    logText: "Sonar contact consistent with a swimmer, 15m from hull, depth 3m.",
    actionText:
      "Alert security and freeze thrusters. A swimmer this close can be killed by a prop — stop machinery until identified.",
    options: [
      {
        label: "Alert security and freeze thrusters",
        detail:
          "A swimmer this close can be killed by a prop — stop machinery until identified.",
        recommended: true,
      },
      {
        label: "Illuminate and hail from deck",
        detail:
          "May identify a known diver, but does not remove the machinery risk.",
        recommended: false,
      },
      {
        label: "Launch a tender to intercept",
        detail:
          "Puts eyes on the swimmer, takes time and puts a small boat in the water.",
        recommended: false,
      },
    ],
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
      "Cross-check radar and visual. Do not steer on GPS-only until the 340m offset is explained.",
    options: [
      {
        label: "Cross-check radar and visual",
        detail: "Do not steer on GPS-only until the 340m offset is explained.",
        recommended: true,
      },
      {
        label: "Switch to backup position source",
        detail:
          "Isolates a bad feed, and may drop some chart overlays until you switch back.",
        recommended: false,
      },
      {
        label: "Reduce speed until positions agree",
        detail: "Buys time to sort the fix, at the cost of the passage plan.",
        recommended: false,
      },
    ],
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
      "Log the emission and wait. A single intermittent burst is often benign; you have a record if it repeats.",
    options: [
      {
        label: "Log the emission and wait",
        detail:
          "A single intermittent burst is often benign; you have a record if it repeats.",
        recommended: true,
      },
      {
        label: "Widen the spectrum scan",
        detail:
          "Catches a second burst sooner, at the cost of operator attention.",
        recommended: false,
      },
      {
        label: "Compare with nearby traffic",
        detail: "May explain the burst as a known ship, or waste time on a one-off.",
        recommended: false,
      },
    ],
  },
  {
    id: "network-intrusion",
    category: "RF / Electronic Warfare",
    name: "Onboard network intrusion attempt",
    riskLevel: "ELEVATED",
    panelType: "spectrum",
    logText:
      "Unusual authentication attempts detected on the vessel network from an unrecognized device.",
    actionText:
      "Isolate the affected segment. Stops spread while IT / Support Center reviews the unrecognized device.",
    options: [
      {
        label: "Isolate the affected segment",
        detail:
          "Stops spread while IT / Support Center reviews the unrecognized device.",
        recommended: true,
      },
      {
        label: "Block all new device joins",
        detail: "Stops the attacker and also blocks a legitimate spare laptop.",
        recommended: false,
      },
      {
        label: "Remove only the suspect device",
        detail:
          "Smaller disruption if you already know which device — risky if you guess wrong.",
        recommended: false,
      },
    ],
  },
  {
    id: "perimeter-breach",
    category: "Perimeter & Access",
    name: "Perimeter breach",
    riskLevel: "ELEVATED",
    panelType: "perimeter",
    logText:
      "Motion sensor triggered, fence line sector 4, no authorized personnel logged in the area.",
    actionText:
      "Dispatch nearest patrol, open cameras. Get eyes on sector 4 before anyone walks the fence line blind.",
    options: [
      {
        label: "Dispatch nearest patrol, open cameras",
        detail: "Get eyes on sector 4 before anyone walks the fence line blind.",
        recommended: true,
      },
      {
        label: "Lock the adjacent gates only",
        detail:
          "Contains the sector, and may trap a legitimate worker on the wrong side.",
        recommended: false,
      },
      {
        label: "Hold all site movement",
        detail: "Maximum control for a single fence hit, high disruption to normal work.",
        recommended: false,
      },
    ],
  },
  {
    id: "unauthorized-vehicle",
    category: "Perimeter & Access",
    name: "Unauthorized vehicle at checkpoint",
    riskLevel: "ATTENTION",
    panelType: "perimeter",
    logText: "Vehicle at gate 2 without a registered access credential.",
    actionText:
      "Hold at the checkpoint and verify. No entry until the driver and vehicle are identified.",
    options: [
      {
        label: "Hold at the checkpoint and verify",
        detail: "No entry until the driver and vehicle are identified.",
        recommended: true,
      },
      {
        label: "Deny and turn the vehicle away",
        detail:
          "Fastest close-out if they have no business here, wrong if they are an expected guest.",
        recommended: false,
      },
      {
        label: "Call the listed sponsor first",
        detail: "Helps when they claim an appointment, adds a delay at the gate.",
        recommended: false,
      },
    ],
  },
  {
    id: "tailgating",
    category: "Perimeter & Access",
    name: "Tailgating at access point",
    riskLevel: "ATTENTION",
    panelType: "perimeter",
    logText: "Two persons detected passing a single-badge access point.",
    actionText:
      "Review camera, confirm the second person. Most tailgates are guests or colleagues — check before a hard stop.",
    options: [
      {
        label: "Review camera, confirm the second person",
        detail: "Most tailgates are guests or colleagues — check before a hard stop.",
        recommended: true,
      },
      {
        label: "Challenge both persons now",
        detail:
          "Immediate control, and can embarrass someone who was authorized.",
        recommended: false,
      },
      {
        label: "Hold the door cycle",
        detail: "Stops a third entry, but queues everyone behind that access point.",
        recommended: false,
      },
    ],
  },
  {
    id: "unattended-object",
    category: "Perimeter & Access",
    name: "Unattended object",
    riskLevel: "ATTENTION",
    panelType: "perimeter",
    logText: "Object detected in a controlled zone for over 20 minutes, no associated personnel.",
    actionText:
      "Notify the security lead, do not approach. Keep people clear until someone qualified looks at it.",
    options: [
      {
        label: "Notify the security lead, do not approach",
        detail: "Keep people clear until someone qualified looks at it.",
        recommended: true,
      },
      {
        label: "Isolate the zone and wait",
        detail:
          "Same caution with a wider cordon — more disruption if it is forgotten kit.",
        recommended: false,
      },
      {
        label: "Ask nearby staff if they left it",
        detail: "Fast resolution when it is theirs, wrong if it is not.",
        recommended: false,
      },
    ],
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
      "Review Attention contacts by hand. Sensitivity is already raised; a human check avoids a false move during the event.",
    options: [
      {
        label: "Review Attention contacts by hand",
        detail:
          "Sensitivity is already raised; a human check avoids a false move during the event.",
        recommended: true,
      },
      {
        label: "Tighten the exclusion zone",
        detail:
          "Safer for guests, more false alerts and more friction at the perimeter.",
        recommended: false,
      },
      {
        label: "Add a second watchstander",
        detail:
          "Better coverage for the event, at the cost of one more person on the watch.",
        recommended: false,
      },
    ],
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
