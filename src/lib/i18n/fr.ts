import type { Messages } from "@/lib/i18n/messages";

export const fr: Messages = {
  nav: {
    home: "Accueil",
    howItWorks: "Fonctionnement",
    interface: "Interface",
    levels: "Niveaux",
    technology: "Technologie",
    faq: "FAQ",
    containers: "Conteneurs",
    contact: "Contact",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    primary: "Navigation principale",
    mobile: "Navigation mobile",
    footer: "Pied de page",
  },
  chrome: {
    rights: "© AGRON Inc. 2026 · Tous droits réservés",
    themeToLight: "Passer au thème clair",
    themeToDark: "Passer au thème sombre",
    language: "Langue",
  },
  seo: {
    home: "StarWall by AGRON — renseignement de sécurité maritime",
    howItWorks: "Comment fonctionne StarWall — StarWall by AGRON",
    interface: "AGRON Bridge — démonstration interactive — StarWall by AGRON",
    levels: "Niveaux d'abonnement — StarWall by AGRON",
    technology: "Équipements et intégration — StarWall by AGRON",
    faq: "FAQ — StarWall by AGRON",
    containers: "Conteneurs — AGRON",
    containersDetection: "Suite de détection — AGRON Containers",
    containersSpecs: "Spécifications — AGRON Containers",
    containersCountermeasures: "Contre-mesures — AGRON Containers",
    containersTiers: "Niveaux — AGRON Containers",
    containersDeployment: "Déploiement — AGRON Containers",
    contact: "Contact — StarWall by AGRON",
  },
  home: {
    kicker: "AGRON MARITIME · STARWALL BY AGRON",
    title: "Une image. Toutes les sources. Une décision à laquelle on peut se fier.",
    lead: "StarWall relie les équipements déjà présents sur votre yacht, marina, port ou île privée en une seule image actualisée en continu — et donne à la personne aux commandes une base claire pour chaque décision, en quelques secondes.",
    points: [
      "Fonctionne avec l'équipement que vous avez déjà — aucun remplacement requis",
      "Apprend votre navire ou votre site, et gagne en précision avec le temps",
      "Se connecte directement au Security Support Center d'AGRON lorsque c'est nécessaire",
    ],
    contactCta: "Contacter AGRON Maritime",
    pdfCta: "Télécharger la présentation (PDF)",
    cards: [
      { title: "Fonctionnement", body: "Connecter, comprendre, décider — en trois étapes" },
      { title: "Voir en action", body: "Un aperçu interactif de l'interface Bridge" },
      { title: "Niveaux", body: "Du suivi essentiel à une construction entièrement sur mesure" },
      { title: "Équipements", body: "À quoi cela se connecte, et comment" },
    ],
    containersLink: "StarWall fonctionne aussi dans le matériel conteneur déployable d'AGRON →",
  },
  how: {
    kicker: "Fonctionnement",
    title: "Connecter, comprendre, décider",
    stepsLabel: "Flux en trois étapes",
    steps: [
      {
        title: "Connecter",
        body: "StarWall lit le radar, les caméras, l'AIS et les autres systèmes déjà installés — aucun remplacement d'équipement n'est requis.",
      },
      {
        title: "Comprendre",
        body: "Les signaux sont réunis sur une seule frise et une carte ; l'historique est conservé après la clôture de chaque alerte.",
      },
      {
        title: "Décider",
        body: "Un niveau de risque clair et explicable et, si besoin, une ligne directe vers le Security Support Center d'AGRON.",
      },
    ],
    architecture: "Architecture",
    architectureLabel:
      "Flux d'architecture StarWall : sources de données, intégration, données unifiées, intelligence / IA, risque et scénario, décision, Support Center",
    stages: [
      { name: "Sources de données", lines: ["radar, AIS,", "caméras, capteurs"] },
      { name: "Intégration", lines: ["adaptateurs, protocoles, API"] },
      { name: "Données unifiées", lines: ["un modèle de données partagé"] },
      { name: "Intelligence / IA", lines: ["corrélation, apprentissage"] },
      { name: "Risque et scénario", lines: ["niveaux de risque explicables"] },
      { name: "Décision", lines: ["prochaine étape recommandée"] },
      { name: "Support Center", lines: ["spécialiste humain, en direct"] },
    ],
    does: "Ce que fait StarWall",
    capabilities: [
      {
        title: "Image unifiée",
        body: "Radar, vidéo, AIS, drones et capteurs périmétriques présentés comme une seule image situationnelle, et non des écrans séparés.",
      },
      {
        title: "Historique continu",
        body: "Chaque objet et chaque événement est conservé, et non écarté une fois l'alerte close.",
      },
      {
        title: "Niveaux de risque explicables",
        body: "Une échelle définie — Normal, Attention, Elevated, Critical — avec les raisons de chaque changement toujours visibles.",
      },
      {
        title: "Fonctionne avec l'équipement existant",
        body: "Conçu pour s'ajouter aux systèmes déjà à bord ou sur site, quel que soit le fabricant.",
      },
      {
        title: "Apprend le navire ou le site précis",
        body: "Établit un profil d'activité normale pour ce yacht, cette marina ou cette propriété, et signale ce qui s'en écarte.",
      },
      {
        title: "Relié au Support Center d'AGRON",
        body: "Montée vers un spécialiste formé lorsque la situation l'exige, et non seulement une alerte automatique.",
      },
    ],
  },
  walkthrough: {
    kicker: "SCÉNARIO",
    title: "Parcours",
    note: "Scénario illustratif. Essayez par vous-même dans la démonstration en direct ci-dessous.",
    steps: [
      "02:14 — un contact entre dans la portée de 6 NM sans signal AIS, sur un relèvement qui pourrait couper la route de M/Y Aurelia.",
      "StarWall corrèle le radar et l'AIS en quelques secondes et fait passer le niveau de risque à Elevated.",
      "Bridge affiche une recommandation claire : appeler sur VHF ch.16, renforcer la veille, être prêt à modifier la route si la distance passe sous 1.0 NM.",
      "L'événement est consigné automatiquement, horodaté, prêt pour le rapport du matin — rien n'a à être rédigé à la main.",
    ],
  },
  bridge: {
    title: "AGRON Bridge",
    subtitle: "INTERFACE CAPITAINE / OFFICIER DE SÉCURITÉ",
    mobileNotice: "Cette interface se consulte mieux sur un grand écran.",
    riskLevel: "NIVEAU DE RISQUE",
    situational: "IMAGE SITUATIONNELLE",
    contacts4: "PORTÉE 6.0 NM · 4 CONTACTS",
    contacts5: "PORTÉE 6.0 NM · 5 CONTACTS",
    connected: "SYSTÈMES CONNECTÉS",
    recommended: "ACTION RECOMMANDÉE",
    eventLog: "JOURNAL DES ÉVÉNEMENTS",
    live: "LIVE",
    simulate: "Simuler une alerte",
    resolve: "Résoudre et réinitialiser",
    disclaimer: "© AGRON Inc. · StarWall — interface de démonstration, données illustratives, pas un navire réel.",
    risks: ["Normal", "Attention", "Elevated", "Critical"],
    systems: [
      "Radar",
      "AIS",
      "CCTV · 6 caméras",
      "Capteurs périmétriques",
      "Sonar",
      "Liaison satellite",
    ],
    online: "En ligne",
    standby: "En attente",
    telemetry: ["NAVIRE", "POSITION", "CAP", "VITESSE", "VENT", "SONDE"],
    log: [
      "Contact SIRENA reclassé — navire connu, voisin de marina",
      "Capteur périmétrique 3 — contrôle de routine, aucune anomalie",
      "Contact non identifié entré dans la portée de 6 NM, aucun signal AIS",
      "Mise à jour de route acceptée — prochain point de route 41°19'N 002°05'E",
      "Passation de quart — Support Center a accusé réception",
    ],
    normalAdvice:
      "L'image est stable. Le trafic connu tient sa route. Maintenez la veille standard et gardez le contact non identifié sur le tableau.",
    elevatedAdvice:
      "Contact non identifié se rapprochant à 8 kn sur un relèvement de type interception, aucune réponse AIS après deux tentatives. Recommandation : appeler sur VHF ch.16, renforcer la veille, se préparer à modifier la route si la distance passe sous 1.0 NM.",
    resolveLog:
      "Contact appelé et identifié — navire de pêche local, sans AIS. Niveau de risque réinitialisé.",
  },
  levels: {
    kicker: "Niveaux",
    title: "Du suivi essentiel à une construction entièrement sur mesure",
    tiersLabel: "Niveaux de service",
    honestySr: "Disponible maintenant et en développement",
    mapNote:
      "Ces niveaux correspondent à la structure de service actuelle d'AGRON Maritime : LIGHT et ADVANCED s'inscrivent dans Protect ; INTELLIGENCE et CUSTOM s'étendent à Intelligence + Support.",
    honesty: "Nous préférons dire exactement ce qui est construit plutôt que de tout promettre d'un coup.",
    available: "Disponible maintenant",
    developing: "En développement",
    tiers: [
      {
        name: "LIGHT",
        subtitle: "Essentiel",
        points: [
          "Connexion de l'équipement déjà détenu par le client",
          "Image unifiée dans une seule interface",
          "Assistance pendant les heures ouvrables",
        ],
      },
      {
        name: "ADVANCED",
        subtitle: "Protection standard",
        points: [
          "Risk Engine, 4 niveaux de menace",
          "Historique des événements et des objets",
          "Support Center 24/7",
        ],
      },
      {
        name: "INTELLIGENCE",
        subtitle: "Adaptatif",
        points: [
          "IA adaptative et détection d'anomalies",
          "Scenario Engine",
          "Assistance de surveillance proactive",
        ],
      },
      {
        name: "CUSTOM",
        subtitle: "Solutions sur mesure",
        points: [
          "Configuration individuelle",
          "Équipement spécialisé, Crisis Mode",
          "Responsable sécurité dédié",
        ],
      },
    ],
    availableNow: [
      "Intégration d'équipements (Gateway)",
      "Image situationnelle unifiée",
      "Niveaux de risque fondés sur des règles",
      "Interface Bridge",
      "Montée manuelle vers le Support Center",
    ],
    inDevelopment: [
      "IA adaptative / détection d'anomalies",
      "Scenario Engine",
      "Vue Family Office multi-objets",
      "Special Event / Crisis Mode",
      "Génération automatique de rapports",
    ],
  },
  tech: {
    kicker: "Technologie",
    title: "À quoi cela se connecte, et comment",
    lead: "StarWall n'est lié à aucun fabricant. Sa couche d'intégration relie tout équipement moderne du marché via des adaptateurs — y compris les classes d'appareils nouvelles et spécialisées.",
    catalog: "Catalogue d'équipements",
    category: "Catégorie",
    connects: "Ce qui se connecte",
    legal:
      "Certaines catégories d'équipements — par exemple la détection RF/anti-drones ou les systèmes de guerre électronique — exigent un contrôle des exportations et un examen des licences propres à la juridiction avant déploiement. L'architecture de StarWall les prend en charge comme modules optionnels ; l'activation de l'un d'eux passe toujours d'abord par un examen juridique distinct, et toute capacité de réponse associée exige un opérateur agréé et une autorisation humaine. Pour plus de détails,",
    contactUs: "contactez-nous",
    oem: "Partenariat OEM",
    rows: [
      {
        name: "Plateforme navire / site",
        connects:
          "Réseaux de bord, passerelles NMEA, bus d'infrastructure marina / domaine",
      },
      {
        name: "Navigation et électronique marine",
        connects: "NMEA0183/2000, AIS, GPS/GNSS, radar",
      },
      {
        name: "Vidéo et optique",
        connects: "ONVIF, RTSP, PTZ, caméras thermiques, modules EO/IR",
      },
      {
        name: "Périmètre et IoT",
        connects: "Modbus, MQTT, CAN, SNMP, capteurs périmétriques et d'infrastructure",
      },
      {
        name: "Drones et contre-UAS",
        connects: "Détection RF de drones, classification, géorepérage",
      },
      {
        name: "Sous-marin",
        connects: "Sonar, détection d'objets et de nageurs sous l'eau",
      },
      {
        name: "Communications par satellite",
        connects: "Starlink, VSAT — à la fois canal de données et système surveillé",
      },
    ],
    partners: [
      { name: "Compatibility", body: "Tout appareil du marché via des protocoles ouverts" },
      {
        name: "StarWall Certified",
        body: "Validation technique, priorité dans les recommandations clients",
      },
      {
        name: "Technology Partner",
        body: "Développement conjoint d'intégrations pour de nouvelles classes d'appareils",
      },
      {
        name: "Exclusive / OEM",
        body: "Produit conjoint construit selon la configuration StarWall",
      },
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Les questions que l'on nous pose d'abord",
    items: [
      {
        q: "StarWall remplace-t-il le capitaine ?",
        a: "Non. StarWall fournit une information plus rapide et plus claire, ainsi qu'une prochaine étape recommandée — la décision et la responsabilité restent en tout temps au capitaine ou à l'officier de sécurité.",
      },
      {
        q: "Que se passe-t-il si nous perdons la connectivité ?",
        a: "StarWall continue de fonctionner en local et met les données en mémoire tampon jusqu'au retour de la connexion. Perdre une liaison n'arrête pas la protection de l'objet.",
      },
      {
        q: "Qui a accès à nos données ?",
        a: "L'accès suit le rôle : propriétaire, capitaine, marina, Support Center ne voient que ce qui les concerne. Les données identifiables de l'objet ne sont pas partagées hors de votre compte pour aucun entraînement d'IA.",
      },
      {
        q: "On nous a dit que StarWall peut intégrer des équipements de détection spécialisés — est-ce légal ?",
        a: "Certaines catégories d'équipements (par exemple la détection RF/anti-drones) exigent des contrôles d'exportation et de licences propres à la juridiction avant déploiement. L'architecture de StarWall le prend en charge comme module optionnel ; l'activation passe toujours d'abord par un examen juridique distinct.",
      },
      {
        q: "Faut-il remplacer notre équipement existant ?",
        a: "Non. StarWall est conçu pour se connecter à ce qui est déjà installé — radar, caméras, navigation — via des adaptateurs, non pour le remplacer.",
      },
    ],
  },
  contact: {
    kicker: "Contact",
    title: "Demander une séance d'information",
    lead: "Pour les propriétaires, capitaines, courtiers et équipes qui évaluent un pilote. Le service de courrier sortant n'est pas encore connecté — les envois sont reçus en local jusqu'à ce qu'AGRON confirme le canal.",
    name: "Nom",
    email: "Courriel",
    message: "Message",
    send: "Envoyer",
    sending: "Envoi…",
    success: "Reçu en local. Le service de courrier sortant n'est pas encore connecté.",
    error: "Une erreur s'est produite.",
    unable: "Impossible d'envoyer.",
  },
  containers: {
    kicker: "AGRON · CONTENEUR DE SÉCURITÉ DÉPLOYABLE",
    title: "Un conteneur. Une conscience à spectre complet.",
    lead: "Une plateforme autonome de détection, d'analyse et de réponse — déployable par terre, mer ou site fixe en heures, pas en semaines. La détection et l'analyse s'exécutent sur StarWall ; l'équipement de réponse est disponible sur certains niveaux, toujours sous autorisation humaine.",
    contact: "Contacter AGRON",
    back: "← Retour à l'aperçu des conteneurs",
    eyebrow: "AGRON Containers",
    howLink: "voir le fonctionnement →",
    detectionLink:
      "La détection et l'analyse de ce conteneur s'exécutent sur StarWall —",
    zones: [
      {
        title: "Suite de détection",
        body: "Radar, capteurs acoustiques, caméras EO/IR et multi-spectre, sonar",
      },
      {
        title: "Baie de contre-mesures",
        body: "Disponible sur certains niveaux — voir la page des contre-mesures",
      },
      {
        title: "Soutien de vie et IT",
        body: "Énergie, communications, baies serveurs et données, contrôle environnemental",
      },
      {
        title: "Poste opérateur",
        body: "Sur site ou conduite entièrement à distance",
      },
    ],
    subpages: ["Niveaux", "Spécifications", "Contre-mesures", "Déploiement"],
    detectionTitle: "Suite de détection",
    equipment: "Équipement",
    spec: "Spécification",
    detectionRows: [
      { name: "3D AESA Radar", spec: "Détection air et surface 360° jusqu'à 15 km" },
      {
        name: "Acoustic Radar",
        spec: "Détecte les cibles basses, lentes et petites, et les perturbations de surface",
      },
      {
        name: "Spectral Analyzer",
        spec: "Renseignement RF et signaux, surveillance large spectre",
      },
      {
        name: "Multi-Spectrum Cameras",
        spec: "Jour, nuit, thermique, SWIR jusqu'à 10 km",
      },
      { name: "Acoustic Sonar", spec: "Détection de menaces sous-marines jusqu'à 1 km" },
    ],
    detectionNote: "Toute la détection et l'analyse de cette suite s'exécutent sur StarWall —",
    specsTitle: "Spécifications du conteneur",
    specs: [
      { label: "Longueur", value: "6.058 m (19.9 ft)" },
      { label: "Largeur", value: "2.438 m (8.0 ft)" },
      { label: "Hauteur", value: "2.896 m (9.5 ft)" },
      { label: "Poids", value: "~9,500 kg" },
      { label: "Puissance", value: "10–15 kW" },
      { label: "Température de fonctionnement", value: "−30°C to +50°C" },
      { label: "Autonomie", value: "72+ heures (selon la mission)" },
    ],
    rapid: "Déploiement rapide : moins de 2 heures entre l'arrivée et l'état opérationnel.",
    cmTitle: "Contre-mesures",
    cmLegal:
      "L'équipement de contre-mesures est disponible sur certains niveaux de conteneur. L'activer ou l'exploiter exige toujours une autorisation propre à la juridiction et un opérateur agréé. La couche de détection et d'analyse d'AGRON Container (StarWall) ne déclenche jamais ces systèmes d'elle-même — l'activation est une décision humaine, prise par un opérateur autorisé, à chaque fois.",
    cmItems: [
      {
        name: "Système de drones intercepteurs",
        body: "UAV multi-rôles à haute vitesse, télécommandés. Vitesse max. 200+ km/h, portée jusqu'à 20 km, autonomie jusqu'à 25 min.",
      },
      { name: "Guerre électronique", body: "Brouillage, usurpation, déni de signal" },
      { name: "Système hyperfréquence", body: "Énergie dirigée non cinétique, anti-essaim" },
    ],
    tiersTitle: "Niveaux de conteneur",
    customBadge: "Sur mesure",
    tiers: [
      { name: "Basic", body: "Suite de détection + analyse StarWall uniquement" },
      { name: "Business", body: "+ portée capteurs étendue, connexion Support Center" },
      {
        name: "Premium",
        body: "+ baie de contre-mesures (non cinétique : guerre électronique)",
      },
      {
        name: "Exclusive",
        body: "Construction entièrement sur mesure, jusqu'aux configurations gouvernementales/défense autorisées, soumise au contrôle des exportations et à la certification de l'utilisateur final",
      },
    ],
    deployTitle: "Déploiement",
    photo: "Photo —",
    cases: [
      {
        name: "Maritime",
        body: "Protection continue à bord ou à terre, intégrée aux systèmes de navigation et de sécurité existants.",
      },
      {
        name: "Port et rade",
        body: "Surveillance de grande étendue sur l'eau, l'air et les approches terrestres.",
      },
      {
        name: "Infrastructures critiques",
        body: "Conscience du périmètre et de l'espace aérien pour les sites fixes.",
      },
      {
        name: "Domaines privés et îles",
        body: "Protection distante et autosuffisante là où une présence permanente n'est pas pratique.",
      },
      {
        name: "Événements spéciaux",
        body: "Déploiement temporaire pour des rassemblements de haut profil, avec montage et démontage rapides.",
      },
    ],
  },
};
