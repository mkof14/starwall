export type Messages = {
  nav: {
    home: string;
    howItWorks: string;
    interface: string;
    levels: string;
    pricing: string;
    technology: string;
    faq: string;
    containers: string;
    about: string;
    contact: string;
    backend: string;
    auth: string;
    tasks: string;
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
    privacy: string;
    terms: string;
    footerProduct: string;
    footerCompany: string;
    footerLegal: string;
    footerBlurb: string;
  };
  seo: {
    home: string;
    howItWorks: string;
    interface: string;
    levels: string;
    pricing: string;
    technology: string;
    faq: string;
    containers: string;
    containersDetection: string;
    containersSpecs: string;
    containersCountermeasures: string;
    containersTiers: string;
    containersDeployment: string;
    about: string;
    contact: string;
    backend: string;
    connections: string;
    login: string;
    tasks: string;
    signup: string;
    forgotPassword: string;
    privacy: string;
    terms: string;
  };
  legal: {
    privacyTitle: string;
    privacyUpdated: string;
    privacyIntro: string;
    privacySections: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
    termsTitle: string;
    termsUpdated: string;
    termsIntro: string;
    termsSections: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
  };
  surface: {
    connectionsKicker: string;
    connectionsTitle: string;
    connectionsLead: string;
    connectionsLeadLive: string;
    connectionsBack: string;
    connectionsIn: string;
    connectionsOut: string;
    connectionsOff: string;
    helmTitle: string;
    helmAdvisor: string;
    helmAsk: string;
    helmSend: string;
    helmHide: string;
    helmOpen: string;
    helmEmpty: string;
    helmLive: string;
    helmSpeakerOn: string;
    helmSpeakerOff: string;
    liveBanner: string;
  };
  backend: {
    kicker: string;
    title: string;
    lead: string;
    demoNotice: string;
    sectionsNav: string;
    health: string;
    equipment: string;
    access: string;
    blackbox: string;
    integrations: string;
    audit: string;
    healthTitle: string;
    internet: string;
    localNet: string;
    cloudBackup: string;
    localBackup: string;
    connected: string;
    offline: string;
    online: string;
    notReported: string;
    lastSynced: string;
    notConfigured: string;
    notConfiguredDeploy: string;
    noSensor: string;
    cloudPath: string;
    localPath: string;
    sensors: string;
    core: string;
    cloudStorage: string;
    localStorageLabel: string;
    mapLink: string;
    runCloudBackup: string;
    runLocalBackup: string;
    backingUp: string;
    backupDone: string;
    requestConfig: string;
    heartbeat: string;
    heartbeatOk: string;
    heartbeatFail: string;
    helmReady: string;
    helmMissing: string;
    equipmentTitle: string;
    colEquipment: string;
    colStatus: string;
    colCheck: string;
    colDiagnostic: string;
    notConnected: string;
    runDiagnostic: string;
    scanning: string;
    acknowledge: string;
    acknowledged: string;
    accessTitle: string;
    roleHierarchy: string;
    accounts: string;
    colName: string;
    colRole: string;
    colLast: string;
    colActions: string;
    addUser: string;
    userPlaceholder: string;
    disable: string;
    enable: string;
    disabled: string;
    noUsers: string;
    roleSuper: string;
    roleAdmin: string;
    roleOperator: string;
    roleViewer: string;
    roleSuperDetail: string;
    roleAdminDetail: string;
    roleOperatorDetail: string;
    roleViewerDetail: string;
    blackboxTitle: string;
    blackboxLead: string;
    blackboxLeadLive: string;
    blackboxEmpty: string;
    blackboxOpen: string;
    conversation: string;
    scenarioRun: string;
    integrationsTitle: string;
    colIntegration: string;
    colNotes: string;
    colLastData: string;
    testConnection: string;
    testing: string;
    enableInt: string;
    disableInt: string;
    notIntegrated: string;
    testOk: string;
    testFail: string;
    auditTitle: string;
    auditLead: string;
    noAudit: string;
    exportAudit: string;
    justNow: string;
    secondsAgo: string;
    minuteAgo: string;
    minutesAgo: string;
    plan: string;
    objects: string;
    notify: string;
    privacy: string;
    planTitle: string;
    planCurrent: string;
    planUpgrade: string;
    objectsTitle: string;
    objectsNote: string;
    objectsSwitch: string;
    notifyTitle: string;
    notifyNote: string;
    notifyAttention: string;
    notifyElevated: string;
    notifyCritical: string;
    notifyEmail: string;
    notifySms: string;
    notifyPhone: string;
    notifyChat: string;
    notifyRecipient: string;
    signedInRole: string;
    users: string;
    usersTitle: string;
    usersLead: string;
    usersLink: string;
    inviteUser: string;
    inviteName: string;
    invitePlaceholder: string;
    invitationCreated: string;
    colEmail: string;
    colLastSignIn: string;
    pendingInvite: string;
    neverSignedIn: string;
    saveNotify: string;
    savingNotify: string;
    notifySaved: string;
    notifySaveFailed: string;
    settingsLocked: string;
    diagnosticLocked: string;
    viewerLocked: string;
    feedConnected: string;
    feedStale: string;
    feedDisconnected: string;
    colVendor: string;
    roleChanged: string;
    forbidden: string;
  };
  auth: {
    kicker: string;
    title: string;
    lead: string;
    leadLive: string;
    nameLabel: string;
    emailLabel: string;
    roleLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    signIn: string;
    signOut: string;
    signedInAs: string;
    demoAccounts: string;
    liveEmptyAccounts: string;
    sessionNotice: string;
    sessionNoticeLive: string;
    nameRequired: string;
    emailInvalid: string;
    loading: string;
    error: string;
    retry: string;
    redirecting: string;
    gateTitle: string;
    gateLead: string;
    tasksKicker: string;
    tasksTitle: string;
    tasksLead: string;
    tasksLeadLive: string;
    tasksEmpty: string;
    groupBackend: string;
    groupSite: string;
    openTask: string;
    lockedHint: string;
    useAccount: string;
    bodies: {
      health: string;
      equipment: string;
      access: string;
      blackbox: string;
      integrations: string;
      audit: string;
      overview: string;
      how: string;
      bridge: string;
      connections: string;
      levels: string;
      pricing: string;
      technology: string;
      faq: string;
      containers: string;
      about: string;
      contact: string;
    };
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
    interfaceKicker: string;
    interfaceTitle: string;
    interfaceLead: string;
    interfaceCta: string;
    interfacePoints: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
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
  pricing: {
    kicker: string;
    title: string;
    lead: string;
    mostPopular: string;
    perMonth: string;
    equipmentPrefix: string;
    equipmentSuffix: string;
    contactUs: string;
    customNote: string;
    getStarted: string;
    contactAgron: string;
    disclaimer: string;
    salesNote: string;
    askSales: string;
    faqTitle: string;
    faq1q: string;
    faq1aBefore: string;
    faq1aLink: string;
    faq1aAfter: string;
    faq2q: string;
    faq2a: string;
    faq3q: string;
    faq3a: string;
    interestMessage: string;
    levelsCta: string;
    config: {
      stepObject: string;
      stepSoftware: string;
      stepContainer: string;
      stepAddons: string;
      yourConfig: string;
      monthlyLabel: string;
      oneTimeLabel: string;
      oneTimeShort: string;
      perMonth: string;
      contactPricing: string;
      customQuote: string;
      requestQuote: string;
      summaryNote: string;
      showSummary: string;
      hideSummary: string;
      quoteMessage: string;
      objects: {
        yacht: { name: string; detail: string };
        marina: { name: string; detail: string };
        port: { name: string; detail: string };
        island: { name: string; detail: string };
        event: { name: string; detail: string };
      };
      software: {
        LIGHT: { name: string; detail: string };
        ADVANCED: { name: string; detail: string };
        INTELLIGENCE: { name: string; detail: string };
        CUSTOM: { name: string; detail: string };
      };
      containers: {
        none: { name: string; detail: string };
        basic: { name: string; detail: string };
        business: { name: string; detail: string };
        premium: { name: string; detail: string };
        exclusive: { name: string; detail: string };
      };
      addons: {
        camera: { name: string };
        radar: { name: string };
        sonar: { name: string };
        rf: { name: string };
        seat: { name: string };
      };
    };
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
    deckTitle: string;
    deckLead: string;
    deckOpen: string;
    deckDownload: string;
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
  about: {
    kicker: string;
    title: string;
    lead: string;
    beliefsTitle: string;
    beliefs: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
    teamTitle: string;
    teamBody: string;
    teamField: string;
    teamPoints: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
    agronTitle: string;
    agronBefore: string;
    agronLink: string;
    agronAfter: string;
    agronTeam: string;
    todayCta: string;
    contactCta: string;
  };
};

export const en: Messages = {
  nav: {
    home: "Home",
    howItWorks: "How it works",
    interface: "Interface",
    levels: "Levels",
    pricing: "Plans",
    technology: "Technology",
    faq: "FAQ",
    containers: "AGRON Container",
    about: "About",
    contact: "Contact",
    backend: "Backend",
    auth: "Auth",
    tasks: "Tasks",
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
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    footerProduct: "Product",
    footerCompany: "Company",
    footerLegal: "Legal",
    footerBlurb:
      "StarWall reads the kit already on the yacht, marina or island. AGRON builds it.",
  },
  seo: {
    home: "StarWall by AGRON — Maritime Security Intelligence",
    howItWorks: "How StarWall Works — StarWall by AGRON",
    interface: "AGRON Bridge — Interactive Demo — StarWall by AGRON",
    levels: "Subscription Levels — StarWall by AGRON",
    pricing: "Plans — StarWall by AGRON",
    technology: "Equipment & Integration — StarWall by AGRON",
    faq: "FAQ — StarWall by AGRON",
    containers: "Containers — AGRON",
    containersDetection: "Detection Suite — AGRON Containers",
    containersSpecs: "Specifications — AGRON Containers",
    containersCountermeasures: "Countermeasures — AGRON Containers",
    containersTiers: "Tiers — AGRON Containers",
    containersDeployment: "Deployment — AGRON Containers",
    about: "Why StarWall — StarWall by AGRON",
    contact: "Contact — StarWall by AGRON",
    backend: "StarWall Backend — System administration — StarWall by AGRON",
    connections: "System Connections Map — StarWall by AGRON",
    login: "Sign in — StarWall by AGRON",
    tasks: "All tasks — StarWall by AGRON",
    signup: "Sign up — StarWall by AGRON",
    forgotPassword: "Forgot password — StarWall by AGRON",
    privacy: "Privacy — StarWall by AGRON",
    terms: "Terms of Service — StarWall by AGRON",
  },
  legal: {
    privacyTitle: "Privacy Policy",
    privacyUpdated: "Last updated: 7 September 2026",
    privacyIntro:
      "This policy explains how AGRON Inc. (“AGRON”, “we”) handles information when you use the StarWall website, the illustrative AGRON Bridge, Pilot, and related administration screens. It is written for this product as it exists today — including DEMO and LIVE — not as a promise of a future system.",
    privacySections: [
      {
        title: "Who is responsible",
        body: "AGRON Inc. is the organisation behind StarWall. For privacy questions use the contact form on this site or write via agron1.com. If we appoint a data-protection contact for a contracted deployment, that person is named in the written agreement.",
      },
      {
        title: "What this site is",
        body: "The public pages are a product site. The Bridge at /interface is an illustrative watch picture: DEMO uses simulated contacts, events, and equipment status so you can see how StarWall is meant to work. LIVE shows the real state of this deployment — empty until sensors are actually connected. Nothing on the public demo is a live feed from a yacht, marina, or port unless a written AGRON agreement says otherwise.",
      },
      {
        title: "Information we process",
        body: "If you create an account we store the email and password hash (or the identifier from a sign-in provider you choose) and the role assigned to you. The contact form sends the details you type so we can reply. The browser keeps language, theme, and DEMO/LIVE locally. Event logs, session reports, Black Box records, and Pilot conversations are written on the device first; they sync to the deployment database only when that database is configured. We do not use Bridge or Pilot content to train models.",
      },
      {
        title: "Cookies and similar storage",
        body: "We use a session cookie so you stay signed in, plus local storage for language, theme, and watch mode. These are needed to run the site. We do not drop advertising cookies and we do not sell personal data.",
      },
      {
        title: "Access and sharing",
        body: "Access follows the roles already on Backend: Super Admin, Admin, Operator, and Viewer each see only what that role allows. Hosting and database providers process data on our instructions when a deployment is connected. Sign-in providers receive only what you authorize. Anthropic receives the Pilot prompt you send, so the advisor can reply — not for AGRON marketing.",
      },
      {
        title: "Your rights and retention",
        body: "You may ask to access, correct, or delete account and Bridge records that we hold, using the contact page. If you are in the EU, EEA, UK, or Monaco, GDPR or equivalent law may add further rights, including complaint to a supervisory authority. We keep records for as long as the account or contracted deployment needs them, then delete or anonymise them. This policy is not a certification stamp; it describes our current practice.",
      },
    ],
    termsTitle: "Terms of Service",
    termsUpdated: "Last updated: 7 September 2026",
    termsIntro:
      "These terms govern use of the StarWall website and the illustrative Bridge, Pilot, and Backend screens published here. Use of StarWall as an operational system on a vessel or site requires a separate written agreement with AGRON.",
    termsSections: [
      {
        title: "Acceptance",
        body: "By using this website you agree to these terms. If you do not agree, do not use the site. AGRON may update these terms; the date at the top of this page is the version that applies. Continued use after an update means you accept the revised terms.",
      },
      {
        title: "Illustrative Bridge",
        body: "DEMO is a training and explanation picture. It is not a sensor feed and must not be treated as the real situation of any vessel or site. LIVE is honest about the current deployment: if no equipment is connected, the picture is empty. Recommended actions and Pilot replies are advice for the person on watch. They do not replace that person’s judgment.",
      },
      {
        title: "Accounts",
        body: "You are responsible for the credentials you use. Do not share an account that can change watch state or administration. Demo sign-in details, if shown on the login page, are for illustration of roles — change them before any real deployment. AGRON may suspend access that is abused or that puts others at risk.",
      },
      {
        title: "Acceptable use",
        body: "You may not attempt unauthorized access to the site, other accounts, or connected systems; you may not use StarWall to harm people or property; and you may not scrape or republish the service in a way that misrepresents it as a live operational feed.",
      },
      {
        title: "Human authorization and local law",
        body: "Specialized equipment and any response capability remain under human authorization and the law of the place where they are used. StarWall does not grant a licence to operate restricted systems. Dual-use or export rules may apply to a contracted deployment; those rules are addressed in the written agreement, not by this website.",
      },
      {
        title: "Intellectual property, liability, contact",
        body: "StarWall, AGRON, and the site logo are AGRON marks. Page content is provided “as is” for information. AGRON is not liable for decisions taken solely from the public demo picture or from Pilot advice on this site. Operational liability, if any, is set in a written agreement. Questions: use /contact or agron1.com. These website terms are governed by the laws applicable to AGRON Inc., without choosing a venue we have not agreed in writing.",
      },
    ],
  },
  surface: {
    connectionsKicker: "AGRON BRIDGE · TOPOLOGY",
    connectionsTitle: "System Connections Map",
    connectionsLead:
      "Live topology of the training picture: sensors feed StarWall Core; Core pushes the same picture to AGRON Bridge and Support Center.",
    connectionsLeadLive:
      "Same layout as the working picture — every unit is waiting for installation. No live sensors are connected yet.",
    connectionsBack: "← Back to Bridge",
    connectionsIn: "Data in (sensors → core)",
    connectionsOut: "Information out (core → Bridge / Support)",
    connectionsOff: "Not connected",
    helmTitle: "Pilot",
    helmAdvisor: "WATCH ADVISOR",
    helmAsk: "Ask Pilot…",
    helmSend: "Send",
    helmHide: "Hide",
    helmOpen: "Open Pilot",
    helmEmpty:
      "Pilot is on watch. Ask about the picture — speak or type. Advice only; you decide.",
    helmLive: "WATCH ADVISOR · LIVE · no sensors",
    helmSpeakerOn: "Speaker on",
    helmSpeakerOff: "Speaker off",
    liveBanner:
      "LIVE MODE — showing the real current state of this deployment. No equipment is connected yet. Switch to DEMO to see StarWall's full capability with simulated data.",
  },
  backend: {
    kicker: "STARWALL BACKEND",
    title: "System administration",
    lead:
      "Connectivity, equipment health, access control, and monitoring — including AGRON Container hardware. Denser than the Bridge: built for administrators, not a glance watch.",
    demoNotice:
      "Pre-pilot administration — roles, equipment checks, notification routing, and the audit log write to the local database. No physical sensors are connected yet.",
    sectionsNav: "Backend sections",
    health: "System Health",
    equipment: "Equipment",
    access: "Access Control",
    blackbox: "Black Box",
    integrations: "Integrations",
    audit: "Audit Log",
    healthTitle: "SYSTEM HEALTH & CONNECTIVITY",
    internet: "Internet / Satellite link",
    localNet: "Local network",
    cloudBackup: "Cloud backup sync",
    localBackup: "Local backup",
    connected: "Connected",
    offline: "Offline",
    online: "Online",
    notReported: "Not reported",
    lastSynced: "Last synced",
    notConfigured: "not yet configured",
    notConfiguredDeploy: "not yet configured for this deployment",
    noSensor: "No sensor path yet — waiting for equipment installation.",
    cloudPath: "CLOUD PATH",
    localPath: "LOCAL PATH",
    sensors: "Sensors",
    core: "StarWall Core",
    cloudStorage: "Cloud Storage",
    localStorageLabel: "Local Storage",
    mapLink: "View full connections map →",
    runCloudBackup: "Run cloud backup",
    runLocalBackup: "Run local backup",
    backingUp: "Backing up…",
    backupDone: "Backup complete",
    requestConfig: "Request configuration",
    heartbeat: "Admin service",
    heartbeatOk: "Reachable",
    heartbeatFail: "Unreachable",
    helmReady: "Pilot API configured",
    helmMissing: "Pilot API key not set",
    equipmentTitle: "EQUIPMENT MONITORING",
    colEquipment: "Equipment",
    colStatus: "Status",
    colCheck: "Last self-check",
    colDiagnostic: "Diagnostic",
    notConnected: "Not connected — awaiting installation",
    runDiagnostic: "Run diagnostic",
    scanning: "Scanning...",
    acknowledge: "Acknowledge",
    acknowledged: "Acknowledged",
    accessTitle: "ACCESS CONTROL",
    roleHierarchy: "ROLE HIERARCHY",
    accounts: "ACCOUNTS",
    colName: "Name",
    colRole: "Role",
    colLast: "Last active",
    colActions: "Actions",
    addUser: "Add account",
    userPlaceholder: "Name",
    disable: "Disable",
    enable: "Enable",
    disabled: "Disabled",
    noUsers: "No user accounts provisioned yet.",
    roleSuper: "Super Admin",
    roleAdmin: "Admin",
    roleOperator: "Operator",
    roleViewer: "Viewer",
    roleSuperDetail: "Full system plus user management.",
    roleAdminDetail: "Equipment diagnostics and notification routing, plus everything an Operator can do.",
    roleOperatorDetail: "View every surface, trigger scenarios, and use Pilot. Cannot change settings.",
    roleViewerDetail: "Reports and Black Box only — no scenario triggering, no settings.",
    blackboxTitle: "BLACK BOX",
    blackboxLead:
      "Session records from this browser — Pilot conversations and scenario runs — written on the Bridge and retained locally.",
    blackboxLeadLive: "No records yet from this deployment.",
    blackboxEmpty: "No records yet.",
    blackboxOpen: "Open recorder on the Bridge →",
    conversation: "Conversation",
    scenarioRun: "Scenario",
    integrationsTitle: "INTEGRATIONS REGISTRY",
    colIntegration: "Integration",
    colNotes: "Notes",
    colLastData: "Last data",
    testConnection: "Test connection",
    testing: "Testing…",
    enableInt: "Enable",
    disableInt: "Disable",
    notIntegrated: "Not integrated",
    testOk: "Handshake OK",
    testFail: "No feed",
    auditTitle: "AUDIT LOG",
    auditLead: "Administrative actions — distinct from the Bridge Event Log.",
    noAudit: "No administrative actions recorded yet.",
    exportAudit: "Export log",
    justNow: "just now",
    secondsAgo: "seconds ago",
    minuteAgo: "1 minute ago",
    minutesAgo: "minutes ago",
    plan: "Plan & Features",
    objects: "Multi-Object View",
    notify: "Notification Routing",
    privacy: "Data & Privacy",
    planTitle: "PLAN & FEATURES",
    planCurrent: "Current subscription",
    planUpgrade: "Upgrade to unlock",
    objectsTitle: "MULTI-OBJECT VIEW",
    objectsNote:
      "Illustrative only — full multi-object switching is available conceptually at Premium / Custom tier.",
    objectsSwitch:
      "Switching to {name}... (full multi-object switching available at Premium/Custom tier)",
    notifyTitle: "NOTIFICATION ROUTING",
    notifyNote:
      "Saved routes are stored in the database. Actual delivery still needs a provider (for example Twilio for calls/SMS) before going live.",
    notifyAttention: "Attention",
    notifyElevated: "Elevated",
    notifyCritical: "Critical",
    notifyEmail: "Email",
    notifySms: "SMS",
    notifyPhone: "Phone call",
    notifyChat: "WhatsApp / Messenger",
    notifyRecipient: "Recipient contact",
    signedInRole: "Signed in as {role}",
    users: "User Management",
    usersTitle: "USER MANAGEMENT",
    usersLead:
      "Live accounts from the user store. Role changes write immediately and appear in the audit log.",
    usersLink: "Open User Management →",
    inviteUser: "Invite by email",
    inviteName: "Name",
    invitePlaceholder: "officer@example.com",
    invitationCreated:
      "Invitation created — connect an email service to actually send it",
    colEmail: "Email",
    colLastSignIn: "Last sign-in",
    pendingInvite: "Pending invite",
    neverSignedIn: "Never",
    saveNotify: "Save routing",
    savingNotify: "Saving…",
    notifySaved: "Routing saved",
    notifySaveFailed: "Could not save routing",
    settingsLocked: "Your role cannot change these settings.",
    diagnosticLocked: "Diagnostics require Admin or Super Admin.",
    viewerLocked: "Viewer role — reports and Black Box only.",
    feedConnected: "Connected",
    feedStale: "Stale",
    feedDisconnected: "Disconnected",
    colVendor: "Vendor",
    roleChanged: "Role updated",
    forbidden: "This page is Super Admin only.",
  },
  auth: {
    kicker: "AUTHORIZATION",
    title: "Sign in to StarWall",
    lead:
      "Sign in with email and password, or Google. Pre-pilot role accounts are listed on the login page. New accounts start as Operator.",
    leadLive:
      "Sign in with the same accounts in LIVE. No sensors are connected yet; administration still uses this signed-in session.",
    nameLabel: "Name",
    emailLabel: "Email (optional)",
    roleLabel: "Role",
    namePlaceholder: "Your name",
    emailPlaceholder: "name@example.com",
    signIn: "Sign in",
    signOut: "Sign out",
    signedInAs: "Signed in as",
    demoAccounts: "Pre-pilot role accounts",
    liveEmptyAccounts: "No accounts on this deployment yet.",
    sessionNotice:
      "Signed-in session for Bridge and Backend. Roles are enforced on write actions.",
    sessionNoticeLive:
      "Same accounts as DEMO. LIVE still has no connected sensors.",
    nameRequired: "Enter a name to continue.",
    emailInvalid: "Enter a valid email, or leave it blank.",
    loading: "Loading session…",
    error: "The saved session could not be read.",
    retry: "Clear and retry",
    redirecting: "Opening the requested surface…",
    gateTitle: "Authorization required",
    gateLead: "Sign in first to open administration and the task list.",
    tasksKicker: "TASKS",
    tasksTitle: "All tasks",
    tasksLead:
      "Every administration surface and site workstream — open the working page from here.",
    tasksLeadLive:
      "Same task list. LIVE surfaces stay empty until equipment and accounts are connected.",
    tasksEmpty: "No tasks to show.",
    groupBackend: "Administration",
    groupSite: "Site workstreams",
    openTask: "Open",
    lockedHint: "Sign in to open this surface.",
    useAccount: "Use this account",
    bodies: {
      health: "Heartbeat, links, and backup paths for this deployment.",
      equipment: "Diagnostics and self-checks for connected equipment.",
      access: "Role hierarchy. Super Admin manages users.",
      blackbox: "Session records written on the Bridge and kept in this browser.",
      integrations: "Registry of feeds — radar, AIS, cameras, satcom.",
      audit: "Administrative actions, separate from the Bridge event log.",
      overview: "Marketing overview and entry cards for the public site.",
      how: "Connect, understand, decide — architecture and capabilities.",
      bridge: "AGRON Bridge — situational picture and scenario walkthrough.",
      connections: "Radial map of Core, sensors, Bridge, and Support Center.",
      levels: "LIGHT / ADVANCED / INTELLIGENCE / CUSTOM and what is available now.",
      pricing: "LIGHT, ADVANCED, INTELLIGENCE, CUSTOM — what each level includes, and how to request a configuration.",
      technology: "Equipment categories and how StarWall sits on existing systems.",
      faq: "Answers on responsibility, connectivity, data, and specialized modules.",
      containers: "Deployable AGRON container hardware running StarWall.",
      about: "Who builds StarWall, what we believe, and how to discuss deployment.",
      contact: "Request a briefing with AGRON Maritime.",
    },
  },
  home: {
    kicker: "StarWall, by AGRON",
    title: "The watch is still run by a person. The screens should stop arguing with each other.",
    lead: "Most yachts and sites already have radar, cameras, AIS, something on the perimeter. The mess is that none of it shares a clock. StarWall reads what is already paid for and puts it on one Bridge. Then it says what it would do next. You take that, or you don't.",
    points: [
      "Leave the existing set in place. We write adapters; we do not rip out a working helm.",
      "After a while it knows this yacht or this marina — the usual traffic, the usual night — and it gets nosier about what does not fit.",
      "If you want a second pair of eyes, the line is to AGRON's support desk. A person. Not another alarm tone.",
    ],
    contactCta: "Write to AGRON",
    pdfCta: "One-page PDF",
    cards: [
      { title: "How it is put together", body: "What gets plugged in, what the watch actually sees, who is still responsible." },
      { title: "The Bridge", body: "Open /interface. DEMO is a drill with invented traffic. LIVE is whatever is really wired — often nothing yet." },
      { title: "How it is sold", body: "LIGHT, ADVANCED, INTELLIGENCE, or a build we spec with you. What each plan includes is public. The figure comes from the person who writes the contract." },
      { title: "What it talks to", body: "A plain table of equipment classes. If your box is not on it, that is a conversation, not a slogan." },
    ],
    interfaceKicker: "The Interface",
    interfaceTitle: "What is on the Bridge today",
    interfaceLead:
      "This is /interface as it ships — the same page you open after sign-in. DEMO fills it so you can click. LIVE does not invent a contact because the page would look empty otherwise.",
    interfaceCta: "Go to the Interface",
    interfacePoints: [
      {
        title: "Situational Picture",
        body: "Contacts from the feeds that are in the picture, on one map. Radar, cameras, AIS, whatever else is actually attached.",
      },
      {
        title: "Risk",
        body: "Four words: Normal, Attention, Elevated, Critical. When the word changes, the reason sits next to it.",
      },
      {
        title: "Recommended action",
        body: "A next step, ranked. Pilot and the panel can suggest. The watch still owns the call.",
      },
      {
        title: "Event log",
        body: "What the picture reported, in order. Closing an alert does not throw the row away.",
      },
      {
        title: "Jump rail",
        body: "The strip on the left. Picture, risk, systems, log, learning, Black Box, Pilot, connections map.",
      },
      {
        title: "DEMO / LIVE",
        body: "DEMO is the full drill. LIVE is this install as it stands. Empty LIVE is not a bug.",
      },
      {
        title: "Adaptive learning",
        body: "A profile of an object that can thicken over days on that hull or that site. No fake score. No history in LIVE until there is history.",
      },
      {
        title: "Black Box, map, Pilot",
        body: "The session record, the wiring diagram from sensors through core to the Bridge, and Pilot — type or talk, advice only.",
      },
    ],
    containersLink: "There is also a steel box. StarWall runs inside AGRON's deployable containers →",
  },
  how: {
    kicker: "How it is put together",
    title: "Read the kit you already have. Make it usable on watch.",
    stepsLabel: "In practice",
    steps: [
      {
        title: "The adapters go on first",
        body: "Radar, cameras, AIS, whatever is already bolted down. StarWall listens. You do not buy a second radar to make this page work.",
      },
      {
        title: "Same map, same clock",
        body: "Those feeds share a timeline. When an alert is closed the row stays in the log. Nobody has to reconstruct the night from three recorders.",
      },
      {
        title: "A word for the risk, a line if you need it",
        body: "Normal through Critical, with the reason attached. If the watch wants a human at AGRON, that is a desk, not another banner on the screen.",
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
    does: "What that looks like on the watch",
    capabilities: [
      {
        title: "One map",
        body: "Radar paint, cameras, AIS, a drone if you have one, the fence if you have one. Same picture. The manufacturer on the label does not matter.",
      },
      {
        title: "The night stays written down",
        body: "Objects and events are kept. Closing the alert does not wipe the evidence.",
      },
      {
        title: "The risk word has a reason",
        body: "Normal, Attention, Elevated, Critical. If it jumps, you can see why without opening a second tool.",
      },
      {
        title: "It sits on top",
        body: "The helm stays the helm. StarWall is the layer that reads it.",
      },
      {
        title: "This hull, this basin",
        body: "After enough quiet nights it knows the usual. What is odd for this place gets a harder look.",
      },
      {
        title: "A person at AGRON",
        body: "When the watch wants escalation, it is a specialist on the other end — not only a louder beep.",
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
    title: "Four ways to buy it. The figure is not on this page.",
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
  pricing: {
    kicker: "Plans",
    title: "What you can buy. The number is not here.",
    lead: "LIGHT, ADVANCED, INTELLIGENCE, CUSTOM — names and what they include are open. Pick an object, a plan, a container if you need metal. The person who will write the contract names the price.",
    mostPopular: "Most popular",
    perMonth: "/mo",
    equipmentPrefix: "+",
    equipmentSuffix: "one-time equipment",
    contactUs: "Contact us",
    customNote: "Fully custom configuration",
    getStarted: "Get started",
    contactAgron: "Contact AGRON",
    disclaimer:
      "Nothing on this page is a quote. The person who will write the contract names the figure after they have seen the object.",
    salesNote:
      "Plan names and what they include are public. The number is not on this site. It comes from the salesperson who will handle the contract.",
    askSales: "Ask the person on the contract",
    faqTitle: "Questions about the plans",
    faq1q: "What does the one-time equipment cover?",
    faq1aBefore:
      "The AGRON Security Gateway and installation for your object. AGRON Container hardware is a separate conversation — see",
    faq1aLink: "/containers",
    faq1aAfter: ".",
    faq2q: "Can I change tiers later?",
    faq2a:
      "Yes — StarWall's architecture is designed so upgrading doesn't require reinstalling anything; the next tier unlocks on top of what's already collecting data.",
    faq3q: "Is there a contract length?",
    faq3a:
      "Standard terms are month-to-month after an initial onboarding period — ask us for specifics for your situation.",
    interestMessage: "I'm interested in the {tier} plan",
    levelsCta: "See the plans",
    config: {
      stepObject: "Object type",
      stepSoftware: "StarWall software",
      stepContainer: "AGRON Container hardware",
      stepAddons: "Additional equipment",
      yourConfig: "Your configuration",
      monthlyLabel: "Monthly",
      oneTimeLabel: "One-time equipment",
      oneTimeShort: "one-time",
      perMonth: "/mo",
      contactPricing: "Contact us for pricing",
      customQuote: "Contact AGRON for a custom quote",
      requestQuote: "Ask the person on the contract",
      summaryNote:
        "This is a brief, not a quote. The salesperson who will write the contract names the figure after a look at the object.",
      showSummary: "Details",
      hideSummary: "Hide",
      quoteMessage:
        "I'm interested in: {summary}. Please have the person who will handle the contract send pricing. Nothing on the public site is a quote.",
      objects: {
        yacht: {
          name: "Yacht / Superyacht",
          detail: "A single vessel — the baseline configuration.",
        },
        marina: {
          name: "Marina",
          detail: "Multiple berths and a shared shoreline picture.",
        },
        port: {
          name: "Port",
          detail: "High-throughput waterfront with overlapping sensors.",
        },
        island: {
          name: "Private Island / Estate",
          detail: "Perimeter plus approaches over water and land.",
        },
        event: {
          name: "Special Event",
          detail: "Temporary deployment for a defined window.",
        },
      },
      software: {
        LIGHT: {
          name: "LIGHT",
          detail:
            "Connect what is already on the hull or the site. One picture. Support in working hours. The watch stays the watch.",
        },
        ADVANCED: {
          name: "ADVANCED",
          detail:
            "Risk engine with four words. History that does not vanish when an alert closes. AGRON Support Center around the clock.",
        },
        INTELLIGENCE: {
          name: "INTELLIGENCE",
          detail:
            "The picture learns this yacht or this harbour. Anomaly detection. Scenario engine. A person on the AGRON desk who already knows the object.",
        },
        CUSTOM: {
          name: "CUSTOM",
          detail:
            "We spec it with you. Specialized modules, Crisis Mode, a dedicated security lead. The contract names the build.",
        },
      },
      containers: {
        none: {
          name: "None — software only",
          detail: "StarWall on equipment you already have.",
        },
        basic: {
          name: "Basic",
          detail: "Detection suite + StarWall analysis only",
        },
        business: {
          name: "Business",
          detail: "+ extended sensor range, Support Center connection",
        },
        premium: {
          name: "Premium",
          detail: "+ countermeasure bay (non-kinetic: electronic warfare)",
        },
        exclusive: {
          name: "Exclusive",
          detail:
            "Full custom build, authorized government/defense end-users only, subject to export control and end-user certification",
        },
      },
      addons: {
        camera: { name: "Extended camera set" },
        radar: { name: "Extended radar range" },
        sonar: { name: "Underwater sonar module" },
        rf: { name: "RF / electronic warfare detection" },
        seat: { name: "Additional monitoring seat for Support Center" },
      },
    },
  },
  tech: {
    kicker: "Technology",
    title: "A table, not a brand religion",
    lead: "We write adapters. The rows below are classes we already talk to. A new box usually means a new adapter, not a new helm. If your make is missing, say so on the contact page.",
    catalog: "Equipment catalog",
    category: "Category",
    connects: "What connects",
    legal:
      "Some equipment categories — for example RF/counter-drone detection or electronic warfare systems — require jurisdiction-specific export control and licensing review before deployment. StarWall's architecture supports these as optional modules; enabling any of them always goes through a separate legal review first, and any related response capability requires a licensed operator and human authorization. For details,",
    contactUs: "contact us",
    oem: "OEM partnership",
    deckTitle: "The briefing deck",
    deckLead:
      "The same slides we walk on a first call — what StarWall sits on, and how the watch picture is built.",
    deckOpen: "Open the presentation",
    deckDownload: "Download PDF",
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
    title: "The questions that come up on the first call",
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
    title: "Write to AGRON",
    lead: "Yacht, marina, island, something odd — say what you have on board and what you are trying to stop guessing at. Someone reads this. It is not a ticket robot.",
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
    kicker: "AGRON container",
    title: "The steel box, if you need hardware as well as software",
    lead: "Detection and the picture run on StarWall inside the container. Some tiers can carry a response bay. That bay does not fire itself. A person authorizes it, and local law still applies. How fast it can sit on a quay or a road depends on the site, not on a slogan.",
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
        body: "On-site or fully remote watch",
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
        body: "Full custom build, authorized government/defense end-users only, subject to export control and end-user certification",
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
  about: {
    kicker: "About",
    title: "Who is behind the Bridge",
    lead:
      "AGRON has been tying sensors and comms together for a long time. StarWall is the watch layer: whatever brand of radar or camera is already on the yacht, the marina, the port or the island, it should land on one picture. The next step is a suggestion. The person on watch still has to take it.",
    beliefsTitle: "How we refuse to sell it",
    beliefs: [
      {
        title: "The captain is not a passenger",
        body: "Faster judgment is the job. Replacing the captain is not a feature we will ever put on a slide.",
      },
      {
        title: "Do not dress up an empty LIVE",
        body: "If nothing is plugged in, the picture is empty. We would rather look unfinished than invent a contact.",
      },
      {
        title: "Do not rip out what already works",
        body: "If the set on board is trusted, StarWall reads it. A forklift upgrade of the helm is someone else's pitch.",
      },
    ],
    teamTitle: "Team",
    teamBody:
      "The same people who spent decades on networks, satcom, fibre and the ugly parts of data infrastructure. That habit — make the link hold when it is inconvenient — is what they brought to a watch picture.",
    teamField:
      "They have been in weather, on sites, in rooms where the next minute mattered. StarWall is built at that speed: enough picture to act, not a dashboard to admire.",
    teamPoints: [
      {
        title: "Ash and salt, not a lab bench",
        body: "Range, fog, a radio that drops. The product assumes the picture will be incomplete.",
      },
      {
        title: "When it is ugly",
        body: "Cut the noise. Leave one choice the watch can take. A wall of red is not help.",
      },
      {
        title: "Time-to-decision",
        body: "They have had to shrink the gap from a blip to a call. The Bridge is meant to match that, not to look busy.",
      },
    ],
    agronTitle: "AGRON",
    agronBefore:
      "StarWall is an AGRON product. The rest of the house — other integration and deployable work — is on ",
    agronLink: "agron1.com",
    agronAfter: ".",
    agronTeam:
      "Engineers and people who have had to decide on site. The tools came after the nights, not the other way around.",
    todayCta:
      "If you have a hull, a basin or a fence in mind, use the contact page. Say what is already installed.",
    contactCta: "Contact AGRON",
  },
};
