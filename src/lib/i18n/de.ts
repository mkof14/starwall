import type { Messages } from "@/lib/i18n/messages";

export const de: Messages = {
  nav: {
    home: "Start",
    howItWorks: "So funktioniert es",
    interface: "Oberfläche",
    levels: "Stufen",
    technology: "Technik",
    faq: "FAQ",
    containers: "Container",
    contact: "Kontakt",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    primary: "Hauptnavigation",
    mobile: "Mobile Navigation",
    footer: "Fußzeile",
  },
  chrome: {
    rights: "© AGRON Inc. 2026 · Alle Rechte vorbehalten",
    themeToLight: "Zum hellen Thema wechseln",
    themeToDark: "Zum dunklen Thema wechseln",
    language: "Sprache",
  },
  seo: {
    home: "StarWall by AGRON — maritime Sicherheitslage",
    howItWorks: "So funktioniert StarWall — StarWall by AGRON",
    interface: "AGRON Bridge — interaktive Demonstration — StarWall by AGRON",
    levels: "Abonnementstufen — StarWall by AGRON",
    technology: "Ausrüstung und Integration — StarWall by AGRON",
    faq: "FAQ — StarWall by AGRON",
    containers: "Container — AGRON",
    containersDetection: "Erfassungsmodul — AGRON Containers",
    containersSpecs: "Technische Daten — AGRON Containers",
    containersCountermeasures: "Gegenmaßnahmen — AGRON Containers",
    containersTiers: "Stufen — AGRON Containers",
    containersDeployment: "Einsatz — AGRON Containers",
    contact: "Kontakt — StarWall by AGRON",
  },
  home: {
    kicker: "AGRON MARITIME · STARWALL BY AGRON",
    title: "Ein Lagebild. Alle Quellen. Eine Entscheidung, der Sie vertrauen können.",
    lead: "StarWall verbindet die Ausrüstung, die bereits auf Ihrer Yacht, in der Marina, im Hafen oder auf einer privaten Insel steht, zu einem einzigen, fortlaufend aktualisierten Lagebild — und gibt der wachhabenden Person in Sekunden eine klare Grundlage für jede Entscheidung.",
    points: [
      "Arbeitet mit der vorhandenen Ausrüstung — kein Austausch nötig",
      "Lernt Ihr Schiff oder Objekt und wird mit der Laufzeit präziser",
      "Geht bei Bedarf direkt auf das Security Support Center von AGRON",
    ],
    contactCta: "AGRON Maritime kontaktieren",
    pdfCta: "Überblick herunterladen (PDF)",
    cards: [
      { title: "So funktioniert es", body: "Verbinden, verstehen, entscheiden — in drei Schritten" },
      { title: "Im Einsatz sehen", body: "Ein interaktiver Blick auf die Bridge-Oberfläche" },
      { title: "Stufen", body: "Von der wesentlichen Überwachung bis zum vollständig maßgeschneiderten Aufbau" },
      { title: "Ausrüstung", body: "Womit es sich verbindet — und wie" },
    ],
    containersLink: "StarWall läuft auch in der verlegbaren Container-Hardware von AGRON →",
  },
  how: {
    kicker: "So funktioniert es",
    title: "Verbinden, verstehen, entscheiden",
    stepsLabel: "Ablauf in drei Schritten",
    steps: [
      {
        title: "Verbinden",
        body: "StarWall liest Radar, Kameras, AIS und andere bereits installierte Systeme — ein Austausch der Ausrüstung ist nicht nötig.",
      },
      {
        title: "Verstehen",
        body: "Signale laufen in einer Zeitachse und einer Karte zusammen; der Verlauf bleibt nach dem Schließen jeder Meldung erhalten.",
      },
      {
        title: "Entscheiden",
        body: "Ein klares, nachvollziehbares Risikoniveau und bei Bedarf eine direkte Leitung zum Security Support Center von AGRON.",
      },
    ],
    architecture: "Architektur",
    architectureLabel:
      "Architekturfluss von StarWall: Datenquellen, Integration, einheitliche Daten, Intelligenz / KI, Risiko und Szenario, Entscheidung, Support Center",
    stages: [
      { name: "Datenquellen", lines: ["Radar, AIS,", "Kameras, Sensoren"] },
      { name: "Integration", lines: ["Adapter, Protokolle, API"] },
      { name: "Einheitliche Daten", lines: ["ein gemeinsames Datenmodell"] },
      { name: "Intelligenz / KI", lines: ["Korrelation, Lernen"] },
      { name: "Risiko und Szenario", lines: ["nachvollziehbare Risikoniveaus"] },
      { name: "Entscheidung", lines: ["empfohlener nächster Schritt"] },
      { name: "Support Center", lines: ["Fachkraft, live"] },
    ],
    does: "Was StarWall leistet",
    capabilities: [
      {
        title: "Einheitliches Lagebild",
        body: "Radar, Video, AIS, Drohnen und Perimetersensoren als ein Lagebild, nicht als getrennte Bildschirme.",
      },
      {
        title: "Fortlaufender Verlauf",
        body: "Jedes Objekt und jedes Ereignis bleibt erhalten und wird nach dem Schließen einer Meldung nicht verworfen.",
      },
      {
        title: "Nachvollziehbare Risikoniveaus",
        body: "Eine festgelegte Skala — Normal, Attention, Elevated, Critical — mit stets sichtbaren Gründen für jede Änderung.",
      },
      {
        title: "Arbeitet mit vorhandener Ausrüstung",
        body: "Sitzt auf den Systemen, die bereits an Bord oder am Objekt stehen, unabhängig vom Hersteller.",
      },
      {
        title: "Lernt das konkrete Schiff oder Objekt",
        body: "Bildet ein Profil der normalen Aktivität dieser Yacht, Marina oder Liegenschaft und markiert Abweichungen.",
      },
      {
        title: "Angebunden an das Support Center von AGRON",
        body: "Eskalation an eine ausgebildete Fachkraft, wenn die Lage es verlangt — nicht nur eine automatische Meldung.",
      },
    ],
  },
  walkthrough: {
    kicker: "SZENARIO",
    title: "Ablauf",
    note: "Illustratives Szenario. Probieren Sie es selbst in der Live-Demo darunter.",
    steps: [
      "02:14 — ein Kontakt tritt in den 6-NM-Bereich ohne AIS-Signal ein, auf einem Peilstrahl, der den Kurs von M/Y Aurelia schneiden könnte.",
      "StarWall korreliert Radar- und AIS-Zulauf in Sekunden und hebt das Risikoniveau auf Elevated.",
      "Bridge zeigt eine klare Empfehlung: auf VHF ch.16 rufen, Wache verstärken, bereit sein, den Kurs zu ändern, wenn die Distanz unter 1.0 NM fällt.",
      "Das Ereignis wird automatisch protokolliert, mit Zeitstempel, bereit für den Morgenbericht — nichts muss von Hand geschrieben werden.",
    ],
  },
  bridge: {
    title: "AGRON Bridge",
    subtitle: "OBERFLÄCHE KAPITÄN / SICHERHEITSOFFIZIER",
    mobileNotice: "Diese Oberfläche ist auf einem größeren Bildschirm besser zu sehen.",
    riskLevel: "RISIKONIVEAU",
    situational: "LAGEBILD",
    contacts4: "REICHWEITE 6.0 NM · 4 KONTAKTE",
    contacts5: "REICHWEITE 6.0 NM · 5 KONTAKTE",
    connected: "VERBUNDENE SYSTEME",
    recommended: "EMPFOHLENE MASSNAHME",
    eventLog: "EREIGNISPROTOKOLL",
    live: "LIVE",
    simulate: "Alarm simulieren",
    resolve: "Abschließen und zurücksetzen",
    disclaimer: "© AGRON Inc. · StarWall — Demonstrationsoberfläche, illustrative Daten, kein reales Schiff.",
    risks: ["Normal", "Attention", "Elevated", "Critical"],
    systems: [
      "Radar",
      "AIS",
      "CCTV · 6 Kameras",
      "Perimetersensoren",
      "Sonar",
      "Satellitenverbindung",
    ],
    online: "Verbunden",
    standby: "Bereitschaft",
    telemetry: ["SCHIFF", "POSITION", "KURS", "FAHRT", "WIND", "TIEFE"],
    log: [
      "Kontakt SIRENA neu eingestuft — bekanntes Schiff, Nachbar in der Marina",
      "Perimetersensor 3 — Routineprüfung, keine Auffälligkeit",
      "Unidentifizierter Kontakt im 6-NM-Bereich, kein AIS-Signal",
      "Routenaktualisierung übernommen — nächster Wegpunkt 41°19'N 002°05'E",
      "Wachübergabe — Support Center hat bestätigt",
    ],
    normalAdvice:
      "Das Lagebild ist stabil. Bekannter Verkehr hält Kurs. Standardwache beibehalten und den unidentifizierten Kontakt auf der Karte halten.",
    elevatedAdvice:
      "Unidentifizierter Kontakt schließt mit 8 kn auf einem abfangähnlichen Peilstrahl, nach zwei Versuchen keine AIS-Antwort. Empfehlung: auf VHF ch.16 rufen, Wache verstärken, Kursänderung vorbereiten, wenn die Distanz unter 1.0 NM fällt.",
    resolveLog:
      "Kontakt gerufen und identifiziert — örtliches Fischereifahrzeug, ohne AIS. Risikoniveau zurückgesetzt.",
  },
  levels: {
    kicker: "Stufen",
    title: "Von der wesentlichen Überwachung bis zum vollständig maßgeschneiderten Aufbau",
    tiersLabel: "Servicestufen",
    honestySr: "Jetzt verfügbar und in Entwicklung",
    mapNote:
      "Diese Stufen entsprechen der bestehenden Servicestruktur von AGRON Maritime: LIGHT und ADVANCED liegen in Protect, INTELLIGENCE und CUSTOM erweitern Intelligence + Support.",
    honesty: "Wir sagen lieber genau, was gebaut ist, als alles auf einmal zu versprechen.",
    available: "Jetzt verfügbar",
    developing: "In Entwicklung",
    tiers: [
      {
        name: "LIGHT",
        subtitle: "Wesentlich",
        points: [
          "Anbindung der Ausrüstung, die der Kunde bereits hat",
          "Einheitliches Lagebild in einer Oberfläche",
          "Unterstützung während der Geschäftszeiten",
        ],
      },
      {
        name: "ADVANCED",
        subtitle: "Standardschutz",
        points: [
          "Risk Engine, 4 Bedrohungsstufen",
          "Ereignis- und Objektverlauf",
          "Support Center 24/7",
        ],
      },
      {
        name: "INTELLIGENCE",
        subtitle: "Adaptiv",
        points: [
          "Adaptive KI und Anomalieerkennung",
          "Scenario Engine",
          "Proaktive Überwachungsunterstützung",
        ],
      },
      {
        name: "CUSTOM",
        subtitle: "Maßgeschneiderte Lösungen",
        points: [
          "Individuelle Konfiguration",
          "Spezialausrüstung, Crisis Mode",
          "Eigene Sicherheitsleitung",
        ],
      },
    ],
    availableNow: [
      "Ausrüstungsintegration (Gateway)",
      "Einheitliches Lagebild",
      "Regelbasierte Risikoniveaus",
      "Bridge-Oberfläche",
      "Manuelle Eskalation an das Support Center",
    ],
    inDevelopment: [
      "Adaptive KI / Anomalieerkennung",
      "Scenario Engine",
      "Family-Office-Ansicht mehrerer Objekte",
      "Special Event / Crisis Mode",
      "Automatische Berichtserstellung",
    ],
  },
  tech: {
    kicker: "Technik",
    title: "Womit es sich verbindet — und wie",
    lead: "StarWall ist an keinen Hersteller gebunden. Die Integrationsschicht verbindet über Adapter jede moderne Ausrüstung am Markt — einschließlich neuer und spezialisierter Geräteklassen.",
    catalog: "Ausrüstungskatalog",
    category: "Kategorie",
    connects: "Was angebunden wird",
    legal:
      "Einige Ausrüstungskategorien — etwa RF-/Drohnenabwehr-Erfassung oder elektronische Kampfführung — erfordern vor dem Einsatz eine länderspezifische Prüfung von Exportkontrolle und Genehmigungen. Die Architektur von StarWall unterstützt sie als optionale Module; die Freischaltung jedes Moduls durchläuft stets zuerst eine gesonderte rechtliche Prüfung, und jede zugehörige Reaktionsfähigkeit erfordert eine lizenzierte Bedienung und menschliche Freigabe. Einzelheiten:",
    contactUs: "kontaktieren Sie uns",
    oem: "OEM-Partnerschaft",
    rows: [
      {
        name: "Schiff- / Objektplattform",
        connects:
          "Bordnetze, NMEA-Gateways, Infrastrukturbus von Marina oder Anwesen",
      },
      {
        name: "Navigation und Marineelektronik",
        connects: "NMEA0183/2000, AIS, GPS/GNSS, Radar",
      },
      {
        name: "Video und Optik",
        connects: "ONVIF, RTSP, PTZ, Wärmebildkameras, EO/IR-Module",
      },
      {
        name: "Perimeter und IoT",
        connects: "Modbus, MQTT, CAN, SNMP, Perimeter- und Infrastruktursensoren",
      },
      {
        name: "Drohnen und Gegen-UAS",
        connects: "RF-Drohnenerfassung, Klassifikation, Geozonen",
      },
      {
        name: "Unterwasser",
        connects: "Sonar, Erfassung unter Wasser von Objekten und Schwimmern",
      },
      {
        name: "Satellitenkommunikation",
        connects: "Starlink, VSAT — als Datenkanal und als überwachtes System",
      },
    ],
    partners: [
      { name: "Compatibility", body: "Jedes Marktgerät über offene Protokolle" },
      {
        name: "StarWall Certified",
        body: "Technische Validierung, Vorrang in Kundenempfehlungen",
      },
      {
        name: "Technology Partner",
        body: "Gemeinsame Entwicklung von Integrationen für neue Geräteklassen",
      },
      {
        name: "Exclusive / OEM",
        body: "Gemeinsames Produkt nach der Konfiguration von StarWall",
      },
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Fragen, die zuerst kommen",
    items: [
      {
        q: "Ersetzt StarWall den Kapitän?",
        a: "Nein. StarWall liefert schnellere, klarere Informationen und einen empfohlenen nächsten Schritt — Entscheidung und Verantwortung bleiben jederzeit beim Kapitän oder Sicherheitsoffizier.",
      },
      {
        q: "Was geschieht, wenn die Verbindung ausfällt?",
        a: "StarWall arbeitet weiter vor Ort und puffert Daten, bis die Verbindung zurückkehrt. Der Ausfall einer Leitung schaltet den Schutz des Objekts nicht ab.",
      },
      {
        q: "Wer hat Zugriff auf unsere Daten?",
        a: "Der Zugriff folgt der Rolle: Eigentümer, Kapitän, Marina und Support Center sehen nur das, was sie betrifft. Identifizierbare Objektdaten werden nicht außerhalb Ihres Kontos für irgendwelches KI-Training geteilt.",
      },
      {
        q: "Wir haben gehört, StarWall könne spezialisierte Erfassungsausrüstung einbinden — ist das legal?",
        a: "Einige Kategorien (etwa RF-/Drohnenabwehr-Erfassung) erfordern vor dem Einsatz länderspezifische Export- und Genehmigungsprüfungen. Die Architektur von StarWall unterstützt das als optionales Modul; die Freischaltung durchläuft stets zuerst eine gesonderte rechtliche Prüfung.",
      },
      {
        q: "Müssen wir unsere vorhandene Ausrüstung ersetzen?",
        a: "Nein. StarWall ist dafür gebaut, sich über Adapter an das bereits Installierte anzubinden — Radar, Kameras, Navigation — nicht es zu ersetzen.",
      },
    ],
  },
  contact: {
    kicker: "Kontakt",
    title: "Einweisung anfragen",
    lead: "Für Eigner, Kapitäne, Makler und Teams, die einen Pilotbetrieb prüfen. Ein ausgehender E-Mail-Dienst ist noch nicht angebunden — Einsendungen werden lokal entgegengenommen, bis AGRON den Kanal bestätigt.",
    name: "Name",
    email: "E-Mail",
    message: "Nachricht",
    send: "Senden",
    sending: "Wird gesendet…",
    success: "Lokal empfangen. Ein ausgehender E-Mail-Dienst ist noch nicht angebunden.",
    error: "Etwas ist schiefgelaufen.",
    unable: "Senden nicht möglich.",
  },
  containers: {
    kicker: "AGRON · VERLEGBARER SICHERHEITSCONTAINER",
    title: "Ein Container. Volle spektrale Lagekenntnis.",
    lead: "Eine in sich geschlossene Plattform für Erfassung, Analyse und Reaktion — zu Lande, zu Wasser oder an einem festen Standort in Stunden statt Wochen verlegbar. Erfassung und Analyse laufen auf StarWall; Reaktionsausrüstung ist auf ausgewählten Stufen verfügbar, stets unter menschlicher Freigabe.",
    contact: "AGRON kontaktieren",
    back: "← Zurück zur Container-Übersicht",
    eyebrow: "AGRON Containers",
    howLink: "so funktioniert es →",
    detectionLink:
      "Erfassung und Analyse auf diesem Container laufen auf StarWall —",
    zones: [
      {
        title: "Erfassungsmodul",
        body: "Radar, akustische Sensoren, EO/IR- und Multispektrum-Kameras, Sonar",
      },
      {
        title: "Gegenmaßnahmen-Bucht",
        body: "Auf ausgewählten Stufen verfügbar — siehe Seite Gegenmaßnahmen",
      },
      {
        title: "Lebensunterstützung und IT",
        body: "Energie, Kommunikation, Server- und Datenracks, Umgebungssteuerung",
      },
      {
        title: "Arbeitsplatz der Bedienung",
        body: "Vor Ort oder vollständig ferngesteuerte Leitung",
      },
    ],
    subpages: ["Stufen", "Technische Daten", "Gegenmaßnahmen", "Einsatz"],
    detectionTitle: "Erfassungsmodul",
    equipment: "Ausrüstung",
    spec: "Angabe",
    detectionRows: [
      { name: "3D AESA Radar", spec: "360°-Erfassung Luft und Oberfläche bis 15 km" },
      {
        name: "Acoustic Radar",
        spec: "Erfasst tiefe, langsame, kleine Ziele und Oberflächenstörungen",
      },
      {
        name: "Spectral Analyzer",
        spec: "RF- und Signalaufklärung, breitbandige Spektrumüberwachung",
      },
      {
        name: "Multi-Spectrum Cameras",
        spec: "Tag, Nacht, Wärmebild, SWIR bis 10 km",
      },
      { name: "Acoustic Sonar", spec: "Unterwasserbedrohungserfassung bis 1 km" },
    ],
    detectionNote: "Sämtliche Erfassung und Analyse dieses Moduls läuft auf StarWall —",
    specsTitle: "Technische Daten des Containers",
    specs: [
      { label: "Länge", value: "6.058 m (19.9 ft)" },
      { label: "Breite", value: "2.438 m (8.0 ft)" },
      { label: "Höhe", value: "2.896 m (9.5 ft)" },
      { label: "Gewicht", value: "~9,500 kg" },
      { label: "Leistung", value: "10–15 kW" },
      { label: "Betriebstemperatur", value: "−30°C to +50°C" },
      { label: "Durchhaltefähigkeit", value: "72+ Stunden (missionsabhängig)" },
    ],
    rapid: "Schneller Einsatz: unter 2 Stunden von der Ankunft bis zur Betriebsbereitschaft.",
    cmTitle: "Gegenmaßnahmen",
    cmLegal:
      "Gegenmaßnahmen-Ausrüstung ist auf ausgewählten Containerstufen verfügbar. Freischaltung oder Betrieb erfordern stets eine länderspezifische Genehmigung und eine lizenzierte Bedienung. Die Erfassungs- und Analyseschicht von AGRON Container (StarWall) löst diese Systeme niemals von selbst aus — die Aktivierung ist jedes Mal eine menschliche Entscheidung einer berechtigten Bedienung.",
    cmItems: [
      {
        name: "Abfangdrohnensystem",
        body: "Schnelle Mehrzweck-UAVs, ferngesteuert. Höchstgeschwindigkeit 200+ km/h, Reichweite bis 20 km, Flugdauer bis 25 min.",
      },
      { name: "Elektronische Kampfführung", body: "Stören, täuschen, Signalverweigerung" },
      { name: "Mikrowellensystem", body: "Nichtkinetische gerichtete Energie, gegen Schwärme" },
    ],
    tiersTitle: "Containerstufen",
    customBadge: "Maßgeschneidert",
    tiers: [
      { name: "Basic", body: "Erfassungsmodul + StarWall-Analyse ohne weiteres" },
      { name: "Business", body: "+ erweiterte Sensorreichweite, Anbindung an das Support Center" },
      {
        name: "Premium",
        body: "+ Gegenmaßnahmen-Bucht (nichtkinetisch: elektronische Kampfführung)",
      },
      {
        name: "Exclusive",
        body: "Vollständig maßgeschneiderter Aufbau, bis zu genehmigten Regierungs- und Verteidigungskonfigurationen, vorbehaltlich der Exportkontrolle und der Endnutzerzertifizierung",
      },
    ],
    deployTitle: "Einsatz",
    photo: "Foto —",
    cases: [
      {
        name: "See",
        body: "Durchgehender Schutz an Bord oder an Land, eingebunden in vorhandene Navigations- und Sicherheitssysteme.",
      },
      {
        name: "Hafen und Reede",
        body: "Großräumige Überwachung über Wasser, Luft und landseitige Annäherungen.",
      },
      {
        name: "Kritische Infrastruktur",
        body: "Perimeter- und Luftraumlage für feststehende Anlagen.",
      },
      {
        name: "Private Anwesen und Inseln",
        body: "Entfernter, autarker Schutz dort, wo ständige Besetzung unpraktisch ist.",
      },
      {
        name: "Besondere Anlässe",
        body: "Zeitweiliger Einsatz für Veranstaltungen mit hohem Profil, mit schnellem Auf- und Abbau.",
      },
    ],
  },
};
