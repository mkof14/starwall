export type Messages = {
  nav: {
    home: string;
    howItWorks: string;
    interface: string;
    levels: string;
    technology: string;
    faq: string;
    containers: string;
    contact: string;
    backend: string;
    openMenu: string;
    closeMenu: string;
    primary: string;
    mobile: string;
    footer: string;
  };
  chrome: {
    rights: string;
    themeToLight: string;
    themeToDark: string;
    language: string;
  };
  seo: {
    home: string;
    howItWorks: string;
    interface: string;
    levels: string;
    technology: string;
    faq: string;
    containers: string;
    containersDetection: string;
    containersSpecs: string;
    containersCountermeasures: string;
    containersTiers: string;
    containersDeployment: string;
    contact: string;
    backend: string;
  };
  home: {
    kicker: string;
    title: string;
    lead: string;
    points: [string, string, string];
    contactCta: string;
    pdfCta: string;
    cards: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
    containersLink: string;
  };
  how: {
    kicker: string;
    title: string;
    stepsLabel: string;
    steps: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
    architecture: string;
    architectureLabel: string;
    stages: [
      { name: string; lines: [string, string] },
      { name: string; lines: [string] },
      { name: string; lines: [string] },
      { name: string; lines: [string] },
      { name: string; lines: [string] },
      { name: string; lines: [string] },
      { name: string; lines: [string] },
    ];
    does: string;
    capabilities: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
  };
  walkthrough: {
    kicker: string;
    title: string;
    note: string;
    steps: [string, string, string, string];
  };
  bridge: {
    title: string;
    subtitle: string;
    mobileNotice: string;
    riskLevel: string;
    situational: string;
    contacts4: string;
    contacts5: string;
    connected: string;
    recommended: string;
    eventLog: string;
    live: string;
    simulate: string;
    resolve: string;
    disclaimer: string;
    risks: [string, string, string, string];
    systems: [string, string, string, string, string, string];
    online: string;
    standby: string;
    telemetry: [string, string, string, string, string, string];
    log: [string, string, string, string, string];
    normalAdvice: string;
    elevatedAdvice: string;
    resolveLog: string;
  };
  levels: {
    kicker: string;
    title: string;
    tiersLabel: string;
    honestySr: string;
    mapNote: string;
    honesty: string;
    available: string;
    developing: string;
    tiers: [
      { name: string; subtitle: string; points: [string, string, string] },
      { name: string; subtitle: string; points: [string, string, string] },
      { name: string; subtitle: string; points: [string, string, string] },
      { name: string; subtitle: string; points: [string, string, string] },
    ];
    availableNow: [string, string, string, string, string];
    inDevelopment: [string, string, string, string, string];
  };
  tech: {
    kicker: string;
    title: string;
    lead: string;
    catalog: string;
    category: string;
    connects: string;
    legal: string;
    contactUs: string;
    oem: string;
    rows: [
      { name: string; connects: string },
      { name: string; connects: string },
      { name: string; connects: string },
      { name: string; connects: string },
      { name: string; connects: string },
      { name: string; connects: string },
      { name: string; connects: string },
    ];
    partners: [
      { name: string; body: string },
      { name: string; body: string },
      { name: string; body: string },
      { name: string; body: string },
    ];
  };
  faq: {
    kicker: string;
    title: string;
    items: [
      { q: string; a: string },
      { q: string; a: string },
      { q: string; a: string },
      { q: string; a: string },
      { q: string; a: string },
    ];
  };
  contact: {
    kicker: string;
    title: string;
    lead: string;
    name: string;
    organization: string;
    optional: string;
    email: string;
    assetType: string;
    assetSelect: string;
    assets: [string, string, string, string, string, string, string];
    message: string;
    messagePlaceholder: string;
    send: string;
    success: string;
    required: string;
    invalidEmail: string;
  };
  containers: {
    kicker: string;
    title: string;
    lead: string;
    contact: string;
    back: string;
    eyebrow: string;
    howLink: string;
    detectionLink: string;
    zones: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
    subpages: [string, string, string, string];
    detectionTitle: string;
    equipment: string;
    spec: string;
    detectionRows: [
      { name: string; spec: string },
      { name: string; spec: string },
      { name: string; spec: string },
      { name: string; spec: string },
      { name: string; spec: string },
    ];
    detectionNote: string;
    specsTitle: string;
    specs: [
      { label: string; value: string },
      { label: string; value: string },
      { label: string; value: string },
      { label: string; value: string },
      { label: string; value: string },
      { label: string; value: string },
      { label: string; value: string },
    ];
    rapid: string;
    cmTitle: string;
    cmLegal: string;
    cmItems: [
      { name: string; body: string },
      { name: string; body: string },
      { name: string; body: string },
    ];
    tiersTitle: string;
    customBadge: string;
    tiers: [
      { name: string; body: string },
      { name: string; body: string },
      { name: string; body: string },
      { name: string; body: string },
    ];
    deployTitle: string;
    photo: string;
    cases: [
      { name: string; body: string },
      { name: string; body: string },
      { name: string; body: string },
      { name: string; body: string },
      { name: string; body: string },
    ];
  };
};

export const en: Messages = {
  nav: {
    home: "Home",
    howItWorks: "How it works",
    interface: "Interface",
    levels: "Levels",
    technology: "Technology",
    faq: "FAQ",
    containers: "Containers",
    contact: "Contact",
    backend: "Backend",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primary: "Primary",
    mobile: "Mobile",
    footer: "Footer",
  },
  chrome: {
    rights: "© AGRON Inc. 2026 · All rights reserved",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    language: "Language",
  },
  seo: {
    home: "StarWall by AGRON — Maritime Security Intelligence",
    howItWorks: "How StarWall Works — StarWall by AGRON",
    interface: "AGRON Bridge — Interactive Demo — StarWall by AGRON",
    levels: "Subscription Levels — StarWall by AGRON",
    technology: "Equipment & Integration — StarWall by AGRON",
    faq: "FAQ — StarWall by AGRON",
    containers: "Containers — AGRON",
    containersDetection: "Detection Suite — AGRON Containers",
    containersSpecs: "Specifications — AGRON Containers",
    containersCountermeasures: "Countermeasures — AGRON Containers",
    containersTiers: "Tiers — AGRON Containers",
    containersDeployment: "Deployment — AGRON Containers",
    contact: "Contact — StarWall by AGRON",
    backend: "StarWall Backend — System administration — StarWall by AGRON",
  },
  home: {
    kicker: "AGRON MARITIME · STARWALL BY AGRON",
    title: "One picture. Every source. A decision you can trust.",
    lead: "StarWall connects the equipment already on your yacht, marina, port, or private island into a single, continuously updated picture — and gives the person in command a clear basis for every decision, in seconds.",
    points: [
      "Works with the equipment you already have — no replacement required",
      "Learns your vessel or site, and gets sharper the longer it runs",
      "Connects straight to AGRON's Security Support Center when it matters",
    ],
    contactCta: "Contact AGRON Maritime",
    pdfCta: "Download overview (PDF)",
    cards: [
      { title: "How it works", body: "Connect, understand, decide — in three steps" },
      { title: "See it in action", body: "An interactive look at the Bridge interface" },
      { title: "Levels", body: "From essential monitoring to a fully custom build" },
      { title: "Equipment", body: "What it connects to, and how" },
    ],
    containersLink: "StarWall also runs inside AGRON's deployable container hardware →",
  },
  how: {
    kicker: "How it works",
    title: "Connect, understand, decide",
    stepsLabel: "Three-step flow",
    steps: [
      {
        title: "Connect",
        body: "StarWall reads from the radar, cameras, AIS, and other systems already installed — no replacement equipment required.",
      },
      {
        title: "Understand",
        body: "Signals are brought into a single timeline and map, with history retained after each alert is closed.",
      },
      {
        title: "Decide",
        body: "A clear, explainable risk level and, where needed, a direct line to AGRON's Security Support Center.",
      },
    ],
    architecture: "Architecture",
    architectureLabel:
      "StarWall architecture flow: Data Sources, Integration, Unified Data, Intelligence / AI, Risk and Scenario, Decision, Support Center",
    stages: [
      { name: "Data Sources", lines: ["radar, AIS,", "cameras, sensors"] },
      { name: "Integration", lines: ["adapters, protocols, APIs"] },
      { name: "Unified Data", lines: ["one shared data model"] },
      { name: "Intelligence / AI", lines: ["correlation, learning"] },
      { name: "Risk & Scenario", lines: ["explainable risk levels"] },
      { name: "Decision", lines: ["recommended next step"] },
      { name: "Support Center", lines: ["human specialist, live"] },
    ],
    does: "What StarWall does",
    capabilities: [
      {
        title: "Unified picture",
        body: "Radar, video, AIS, drones and perimeter sensors shown as one situational picture, not separate screens.",
      },
      {
        title: "Continuous history",
        body: "Every object and event is retained, not discarded once an alert is closed.",
      },
      {
        title: "Explainable risk levels",
        body: "A defined scale — Normal, Attention, Elevated, Critical — with the reasons behind each change always visible.",
      },
      {
        title: "Works with existing equipment",
        body: "Built to sit on top of the systems already on board or on site, regardless of manufacturer.",
      },
      {
        title: "Learns the specific vessel or site",
        body: "Builds a profile of normal activity for that yacht, marina or property, and flags what falls outside it.",
      },
      {
        title: "Connected to AGRON's Support Center",
        body: "Escalation to a trained specialist when a situation calls for it, not only an automated alert.",
      },
    ],
  },
  walkthrough: {
    kicker: "SCENARIO",
    title: "Walkthrough",
    note: "Illustrative scenario. Try it yourself in the live demo below.",
    steps: [
      "02:14 — a contact enters the 6 NM range with no AIS signal, on a bearing that could intercept M/Y Aurelia's course.",
      "StarWall correlates the radar and AIS feed within seconds and moves the risk level to Elevated.",
      "The Bridge shows one clear recommendation: hail on VHF ch.16, increase watch, be ready to alter course if range closes under 1.0 NM.",
      "The event is logged automatically, timestamped, ready for the morning report — nothing has to be written up by hand.",
    ],
  },
  bridge: {
    title: "AGRON Bridge",
    subtitle: "CAPTAIN / SECURITY OFFICER INTERFACE",
    mobileNotice: "This interface is best viewed on a larger screen.",
    riskLevel: "RISK LEVEL",
    situational: "SITUATIONAL PICTURE",
    contacts4: "RANGE 6.0 NM · 4 CONTACTS",
    contacts5: "RANGE 6.0 NM · 5 CONTACTS",
    connected: "CONNECTED SYSTEMS",
    recommended: "RECOMMENDED ACTION",
    eventLog: "EVENT LOG",
    live: "LIVE",
    simulate: "Simulate alert",
    resolve: "Resolve & reset",
    disclaimer: "© AGRON Inc. · StarWall — demo interface, illustrative data, not a live vessel.",
    risks: ["Normal", "Attention", "Elevated", "Critical"],
    systems: [
      "Radar",
      "AIS",
      "CCTV · 6 cameras",
      "Perimeter sensors",
      "Sonar",
      "Satcom link",
    ],
    online: "Online",
    standby: "Standby",
    telemetry: ["VESSEL", "POSITION", "HEADING", "SPEED", "WIND", "DEPTH"],
    log: [
      "Contact SIRENA reclassified — known vessel, marina neighbor",
      "Perimeter sensor 3 — routine check, no anomaly",
      "Unidentified contact entered 6 NM range, no AIS signal",
      "Route update accepted — next waypoint 41°19'N 002°05'E",
      "Shift handover — Support Center acknowledged",
    ],
    normalAdvice:
      "Picture is stable. Known traffic holding. Maintain standard watch and keep the unidentified contact on the plot.",
    elevatedAdvice:
      "Unidentified contact closing at 8 kn on an intercept-like bearing, no AIS response after two attempts. Recommend: hail on VHF ch.16, increase watch, prepare to alter course if range closes below 1.0 NM.",
    resolveLog:
      "Contact hailed and identified — local fishing vessel, no AIS fitted. Risk level reset.",
  },
  levels: {
    kicker: "Levels",
    title: "From essential monitoring to a fully custom build",
    tiersLabel: "Service tiers",
    honestySr: "Available now and in development",
    mapNote:
      "These levels map to AGRON Maritime's existing service structure: LIGHT and ADVANCED sit within Protect, INTELLIGENCE and CUSTOM extend into Intelligence + Support.",
    honesty: "We'd rather tell you exactly what's built than promise everything at once.",
    available: "Available now",
    developing: "In development",
    tiers: [
      {
        name: "LIGHT",
        subtitle: "Essential",
        points: [
          "Equipment connection for what the client already has",
          "Unified picture in one interface",
          "Support during business hours",
        ],
      },
      {
        name: "ADVANCED",
        subtitle: "Standard Protection",
        points: [
          "Risk Engine, 4 threat levels",
          "Event and object history",
          "Support Center 24/7",
        ],
      },
      {
        name: "INTELLIGENCE",
        subtitle: "Adaptive",
        points: [
          "Adaptive AI and anomaly detection",
          "Scenario Engine",
          "Proactive monitoring support",
        ],
      },
      {
        name: "CUSTOM",
        subtitle: "Bespoke Solutions",
        points: [
          "Individual configuration",
          "Specialized equipment, Crisis Mode",
          "Dedicated security lead",
        ],
      },
    ],
    availableNow: [
      "Equipment integration (Gateway)",
      "Unified situational picture",
      "Rule-based risk levels",
      "Bridge interface",
      "Manual escalation to Support Center",
    ],
    inDevelopment: [
      "Adaptive AI / anomaly detection",
      "Scenario Engine",
      "Multi-object Family Office view",
      "Special Event / Crisis Mode",
      "Automated report generation",
    ],
  },
  tech: {
    kicker: "Technology",
    title: "What it connects to, and how",
    lead: "StarWall is not tied to one manufacturer. Its integration layer connects any modern equipment on the market through adapters — including newly released and specialized device classes.",
    catalog: "Equipment catalog",
    category: "Category",
    connects: "What connects",
    legal:
      "Some equipment categories — for example RF/counter-drone detection or electronic warfare systems — require jurisdiction-specific export control and licensing review before deployment. StarWall's architecture supports these as optional modules; enabling any of them always goes through a separate legal review first, and any related response capability requires a licensed operator and human authorization. For details,",
    contactUs: "contact us",
    oem: "OEM partnership",
    rows: [
      {
        name: "Vessel / site platform",
        connects:
          "Onboard networks, NMEA gateways, marina/estate infrastructure bus",
      },
      {
        name: "Navigation & marine electronics",
        connects: "NMEA0183/2000, AIS, GPS/GNSS, radar",
      },
      {
        name: "Video & optics",
        connects: "ONVIF, RTSP, PTZ, thermal cameras, EO/IR modules",
      },
      {
        name: "Perimeter & IoT",
        connects: "Modbus, MQTT, CAN, SNMP, perimeter and infrastructure sensors",
      },
      {
        name: "Drones & counter-UAS",
        connects: "RF drone detection, classification, geofencing",
      },
      {
        name: "Underwater",
        connects: "Sonar, underwater object and swimmer detection",
      },
      {
        name: "Satellite communications",
        connects: "Starlink, VSAT — both as a data channel and a monitored system",
      },
    ],
    partners: [
      { name: "Compatibility", body: "Any market device via open protocols" },
      {
        name: "StarWall Certified",
        body: "Technical validation, priority in client recommendations",
      },
      {
        name: "Technology Partner",
        body: "Joint development of integrations for new device classes",
      },
      {
        name: "Exclusive / OEM",
        body: "Joint product built to StarWall's configuration",
      },
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Questions we expect first",
    items: [
      {
        q: "Does StarWall replace the captain?",
        a: "No. StarWall gives faster, clearer information and a recommended next step — the decision and the responsibility stay with the captain or security officer at all times.",
      },
      {
        q: "What happens if we lose connectivity?",
        a: "StarWall keeps working locally and buffers data until the connection returns. Losing one link doesn't shut down protection for the object.",
      },
      {
        q: "Who has access to our data?",
        a: "Access follows role — owner, captain, marina, Support Center each see only what's relevant to them. Object data isn't shared outside your account, identifiable, for any AI training.",
      },
      {
        q: "We've heard StarWall can integrate specialized detection equipment — is that legal?",
        a: "Some equipment categories (for example RF/counter-drone detection) require jurisdiction-specific export and licensing checks before deployment. StarWall's architecture supports this as an optional module; enabling it always goes through a separate legal review first.",
      },
      {
        q: "Do we need to replace our existing equipment?",
        a: "No. StarWall is built to connect to what's already installed — radar, cameras, navigation — through adapters, not to replace it.",
      },
    ],
  },
  contact: {
    kicker: "Contact",
    title: "Let's talk",
    lead: "Whether it's a yacht, a marina, an island, or a special case — tell us about your situation and we'll get back to you.",
    name: "Name",
    organization: "Organization",
    optional: "optional",
    email: "Email",
    assetType: "Asset type",
    assetSelect: "Select…",
    assets: [
      "Yacht / Superyacht",
      "Marina",
      "Port",
      "Private Island",
      "Special Object",
      "Family Office / Multi-Asset",
      "Other",
    ],
    message: "Message",
    messagePlaceholder: "Tell us about your object and what you're looking for",
    send: "Send",
    success: "Thanks — we'll be in touch shortly.",
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
  },
  containers: {
    kicker: "AGRON · DEPLOYABLE SECURITY CONTAINER",
    title: "One container. Full-spectrum awareness.",
    lead: "A self-contained detection, analysis, and response platform — deployable by land, sea, or fixed site in hours, not weeks. Detection and analysis run on StarWall; response equipment is available on select tiers, always under human authorization.",
    contact: "Contact AGRON",
    back: "← Back to Containers overview",
    eyebrow: "AGRON Containers",
    howLink: "see how it works →",
    detectionLink:
      "Detection and analysis on this container run on StarWall —",
    zones: [
      {
        title: "Detection suite",
        body: "Radar, acoustic sensors, EO/IR & multi-spectrum cameras, sonar",
      },
      {
        title: "Countermeasure bay",
        body: "Available on select tiers — see Countermeasures page",
      },
      {
        title: "Life support & IT",
        body: "Power, communications, server & data racks, environmental control",
      },
      {
        title: "Operator workspace",
        body: "On-site or fully remote command",
      },
    ],
    subpages: ["Tiers", "Specifications", "Countermeasures", "Deployment"],
    detectionTitle: "Detection Suite",
    equipment: "Equipment",
    spec: "Spec",
    detectionRows: [
      { name: "3D AESA Radar", spec: "360° air & surface detection up to 15 km" },
      {
        name: "Acoustic Radar",
        spec: "Detects low, slow, small targets and surface disturbances",
      },
      {
        name: "Spectral Analyzer",
        spec: "RF & signal intelligence, wide spectrum monitoring",
      },
      {
        name: "Multi-Spectrum Cameras",
        spec: "Day, night, thermal, SWIR up to 10 km",
      },
      { name: "Acoustic Sonar", spec: "Underwater threat detection up to 1 km" },
    ],
    detectionNote: "All detection and analysis on this suite runs on StarWall —",
    specsTitle: "Container Specifications",
    specs: [
      { label: "Length", value: "6.058 m (19.9 ft)" },
      { label: "Width", value: "2.438 m (8.0 ft)" },
      { label: "Height", value: "2.896 m (9.5 ft)" },
      { label: "Weight", value: "~9,500 kg" },
      { label: "Power", value: "10–15 kW" },
      { label: "Operating temperature", value: "−30°C to +50°C" },
      { label: "Autonomy", value: "72+ hours (mission-dependent)" },
    ],
    rapid: "Rapid deployment: under 2 hours from arrival to operational.",
    cmTitle: "Countermeasures",
    cmLegal:
      "Countermeasure equipment is available on select container tiers. Enabling or operating it always requires jurisdiction-specific authorization and a licensed operator. AGRON Container's detection and analysis layer (StarWall) never triggers these systems autonomously — activation is a human decision, made by an authorized operator, every time.",
    cmItems: [
      {
        name: "Interceptor drone system",
        body: "High-speed, multi-role UAVs, remote controlled. Max speed 200+ km/h, range up to 20 km, endurance up to 25 min.",
      },
      { name: "Electronic warfare", body: "Jamming, spoofing, signal denial" },
      { name: "Microwave system", body: "Non-kinetic directed energy, anti-swarm" },
    ],
    tiersTitle: "Container Tiers",
    customBadge: "Custom",
    tiers: [
      { name: "Basic", body: "Detection suite + StarWall analysis only" },
      { name: "Business", body: "+ extended sensor range, Support Center connection" },
      {
        name: "Premium",
        body: "+ countermeasure bay (non-kinetic: electronic warfare)",
      },
      {
        name: "Exclusive",
        body: "Full custom build, up to authorized government/defense configurations, subject to export control and end-user certification",
      },
    ],
    deployTitle: "Deployment",
    photo: "Photo —",
    cases: [
      {
        name: "Maritime",
        body: "Continuous protection on board or ashore, integrated with existing navigation and security systems.",
      },
      {
        name: "Port & Harbor",
        body: "Large-area surveillance across water, air, and shore approaches.",
      },
      {
        name: "Critical Infrastructure",
        body: "Perimeter and airspace awareness for fixed-site facilities.",
      },
      {
        name: "Private Estates & Islands",
        body: "Remote, self-sufficient protection where continuous staffing isn't practical.",
      },
      {
        name: "Special Events",
        body: "Temporary deployment for high-profile gatherings, with rapid setup and teardown.",
      },
    ],
  },
};
