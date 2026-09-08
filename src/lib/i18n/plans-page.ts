import type { Locale } from "@/lib/i18n/locales";
import type {
  AssetKey,
  CompareKey,
  EnvironmentKey,
  HardwareKey,
  HowKey,
  PlanId,
  RequirementKey,
  SystemKey,
} from "@/lib/plans";

export type PlanCopy = {
  subtitle: string;
  description: string;
  includes: [string, string, string, string, string, string];
  bestFor: string;
  cta: string;
};

export type PlansPageCopy = {
  kicker: string;
  title: string;
  supporting: string;
  body: string;
  compareCta: string;
  requestCta: string;
  heroNote: string;
  mostPopular: string;
  includesLabel: string;
  bestForLabel: string;
  recommendedLabel: string;
  optional: string;
  plans: Record<PlanId, PlanCopy>;
  compare: {
    heading: string;
    subheading: string;
    capability: string;
    rows: Record<CompareKey, string>;
  };
  environments: {
    heading: string;
    body: string;
    items: Record<EnvironmentKey, { title: string; body: string; recommended: string }>;
  };
  hardware: {
    heading: string;
    subheading: string;
    body: string;
    cta: string;
    items: Record<HardwareKey, { title: string; body: string }>;
  };
  how: {
    heading: string;
    body: string;
    cta: string;
    items: Record<HowKey, { title: string; caption: string }>;
  };
  request: {
    heading: string;
    body: string;
    cta: string;
    assetLabel: string;
    assets: Record<AssetKey, string>;
    scaleLabel: string;
    scalePlaceholder: string;
    systemsLabel: string;
    systems: Record<SystemKey, string>;
    requirementLabel: string;
    requirements: Record<RequirementKey, string>;
    name: string;
    company: string;
    email: string;
    phone: string;
    optional: string;
    submit: string;
    success: string;
    required: string;
    invalidEmail: string;
  };
};

const en: PlansPageCopy = {
  kicker: "Plans",
  title: "StarWall Plans",
  supporting: "Choose the level of intelligence your operation needs.",
  body: "From a single yacht to a marina, private island, port, or multi-site operation, StarWall works with existing infrastructure and expands as requirements grow.",
  compareCta: "Compare Plans",
  requestCta: "Request Pricing",
  heroNote:
    "Pricing is based on configuration, integration requirements, deployment, and support level.",
  mostPopular: "Most popular",
  includesLabel: "Includes",
  bestForLabel: "Best for",
  recommendedLabel: "Often specified",
  optional: "Optional",
  plans: {
    LIGHT: {
      subtitle: "Essential Visibility",
      description: "A clear operational picture using the systems already around you.",
      includes: [
        "Existing equipment integration",
        "Cameras and sensors",
        "Unified live view",
        "Alerts",
        "Event history",
        "Standard support",
      ],
      bestFor: "Yacht · Smaller property",
      cta: "Explore Light",
    },
    ADVANCED: {
      subtitle: "Integrated Protection",
      description:
        "Continuous awareness with multiple data sources, risk detection, and operational support.",
      includes: [
        "Everything in Light",
        "Radar integration",
        "Multiple sensor sources",
        "Threat correlation",
        "Risk assessment",
        "24/7 support",
      ],
      bestFor: "Yacht · Superyacht · Marina",
      cta: "Explore Advanced",
    },
    INTELLIGENCE: {
      subtitle: "Adaptive Intelligence",
      description:
        "Deeper analysis for complex environments where context, behavior, and history matter.",
      includes: [
        "Everything in Advanced",
        "AI-assisted analysis",
        "Anomaly detection",
        "Adaptive learning",
        "Predictive intelligence",
        "Advanced operational history",
      ],
      bestFor: "Superyacht · Marina · Private island",
      cta: "Explore Intelligence",
    },
    CUSTOM: {
      subtitle: "Mission-Specific",
      description:
        "A StarWall architecture designed around the operation rather than a predefined package.",
      includes: [
        "Multi-site architecture",
        "Custom integrations",
        "Specialized modules",
        "Dedicated engineering",
        "Custom operating rules",
        "Dedicated support",
      ],
      bestFor: "Port · Fleet · Private island · Special deployment",
      cta: "Discuss Configuration",
    },
  },
  compare: {
    heading: "Compare StarWall Plans",
    subheading:
      "Start with the level of intelligence you need. The final configuration is adapted to the vessel or site.",
    capability: "Capability",
    rows: {
      liveView: "Unified live view",
      existing: "Existing equipment integration",
      cameras: "Cameras & sensors",
      radar: "Radar integration",
      correlation: "Threat correlation",
      risk: "Risk assessment",
      ai: "AI-assisted analysis",
      adaptive: "Adaptive learning",
      predictive: "Predictive intelligence",
      multisite: "Multi-site operation",
      engineering: "Custom engineering",
    },
  },
  environments: {
    heading: "Built for Different Environments",
    body: "The same StarWall intelligence architecture can be configured around very different operating environments.",
    items: {
      yacht: {
        title: "Yacht & Superyacht",
        body: "Onboard awareness and integrated protection.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      marina: {
        title: "Marina",
        body: "Shared intelligence across water, berths, approaches, and perimeter.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      island: {
        title: "Private Island & Estate",
        body: "Awareness across water and land approaches.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      port: {
        title: "Port",
        body: "Multi-zone intelligence for complex waterfront infrastructure.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      special: {
        title: "Special Deployment",
        body: "Temporary, mobile, or mission-specific configuration.",
        recommended: "CUSTOM",
      },
    },
  },
  hardware: {
    heading: "Hardware is Optional",
    subheading: "Use what you already have. Add what you need.",
    body: "StarWall can integrate with compatible onboard or site infrastructure already in place. Additional AGRON equipment and deployment modules can be added where required.",
    cta: "Explore Hardware",
    items: {
      existing: {
        title: "Existing Infrastructure",
        body: "Connect StarWall to compatible systems already installed on the vessel or site.",
      },
      modules: {
        title: "AGRON Modules",
        body: "Add dedicated detection, sensing, communications, or other required modules.",
      },
      mobile: {
        title: "Mobile Deployment",
        body: "Deploy a mobile configuration for temporary, changing, or remote operations.",
      },
      complete: {
        title: "Complete AGRON System",
        body: "Design a complete StarWall and hardware configuration around the site.",
      },
    },
  },
  how: {
    heading: "How StarWall Pricing Works",
    body: "Every vessel and site is different. StarWall pricing reflects the actual configuration rather than a generic package price.",
    cta: "Request Pricing",
    items: {
      plan: {
        title: "StarWall Plan",
        caption: "Software & intelligence level",
      },
      integration: {
        title: "Integration",
        caption: "Existing systems and data sources",
      },
      hardware: {
        title: "Hardware",
        caption: "Only when required",
      },
      support: {
        title: "Deployment & Support",
        caption: "Installation, operations, and support level",
      },
      result: {
        title: "Your Configuration",
        caption: "Built around the actual vessel or site",
      },
    },
  },
  request: {
    heading: "Not sure which StarWall plan fits your operation?",
    body: "Tell us what you are protecting and what equipment is already in place. AGRON can recommend the appropriate StarWall configuration.",
    cta: "Request StarWall Configuration",
    assetLabel: "What are you protecting?",
    assets: {
      yacht: "Yacht",
      superyacht: "Superyacht",
      marina: "Marina",
      island: "Private Island / Estate",
      port: "Port",
      special: "Special Deployment",
      other: "Other",
    },
    scaleLabel: "Approximate size / scale",
    scalePlaceholder: "Length, berths, hectares, or number of sites",
    systemsLabel: "Existing systems",
    systems: {
      radar: "Radar",
      cameras: "Cameras",
      ais: "AIS / Navigation",
      sonar: "Sonar",
      sensors: "Sensors",
      access: "Access Control",
      comms: "Communications",
      other: "Other",
      none: "None / New Installation",
    },
    requirementLabel: "Primary requirement",
    requirements: {
      visibility: "Operational Visibility",
      risk: "Risk Detection",
      protection: "Integrated Protection",
      intelligence: "Advanced Intelligence",
      complete: "Complete Configuration",
      unsure: "Not Sure",
    },
    name: "Name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    optional: "optional",
    submit: "Request Configuration",
    success:
      "Received. An AGRON specialist will review the note and follow up with a configuration discussion — not a public price list.",
    required: "Required",
    invalidEmail: "Enter a valid email",
  },
};

const ru: PlansPageCopy = {
  kicker: "Планы",
  title: "Планы StarWall",
  supporting: "Выберите уровень интеллекта, который нужен вашей операции.",
  body: "От одной яхты до марины, частного острова, порта или нескольких площадок StarWall работает с уже стоящей инфраструктурой и расширяется по мере роста задач.",
  compareCta: "Сравнить планы",
  requestCta: "Запросить цену",
  heroNote:
    "Цена складывается из конфигурации, интеграции, развёртывания и уровня поддержки.",
  mostPopular: "Чаще всего выбирают",
  includesLabel: "Входит",
  bestForLabel: "Для кого",
  recommendedLabel: "Часто указывают",
  optional: "По запросу",
  plans: {
    LIGHT: {
      subtitle: "Базовая картина",
      description: "Понятная оперативная картина из систем, которые уже стоят вокруг вас.",
      includes: [
        "Интеграция существующего оборудования",
        "Камеры и датчики",
        "Единый живой вид",
        "Оповещения",
        "История событий",
        "Стандартная поддержка",
      ],
      bestFor: "Яхта · Небольшой объект",
      cta: "Смотреть Light",
    },
    ADVANCED: {
      subtitle: "Связанная защита",
      description:
        "Постоянная осведомлённость: несколько источников данных, оценка риска и оперативная поддержка.",
      includes: [
        "Всё из Light",
        "Интеграция радара",
        "Несколько источников датчиков",
        "Сопоставление угроз",
        "Оценка риска",
        "Поддержка 24/7",
      ],
      bestFor: "Яхта · Суперяхта · Марина",
      cta: "Смотреть Advanced",
    },
    INTELLIGENCE: {
      subtitle: "Адаптивный интеллект",
      description:
        "Более глубокий разбор для сложных сред, где важны контекст, поведение и история.",
      includes: [
        "Всё из Advanced",
        "Анализ с помощью ИИ",
        "Поиск аномалий",
        "Адаптивное обучение",
        "Прогностический интеллект",
        "Расширенная оперативная история",
      ],
      bestFor: "Суперяхта · Марина · Частный остров",
      cta: "Смотреть Intelligence",
    },
    CUSTOM: {
      subtitle: "Под задачу",
      description:
        "Архитектура StarWall вокруг операции, а не готовый пакет.",
      includes: [
        "Архитектура на несколько площадок",
        "Индивидуальные интеграции",
        "Специальные модули",
        "Выделенная инженерия",
        "Свои правила работы",
        "Выделенная поддержка",
      ],
      bestFor: "Порт · Флот · Частный остров · Специальное развёртывание",
      cta: "Обсудить конфигурацию",
    },
  },
  compare: {
    heading: "Сравнение планов StarWall",
    subheading:
      "Начните с нужного уровня интеллекта. Итоговая конфигурация подгоняется под судно или объект.",
    capability: "Возможность",
    rows: {
      liveView: "Единый живой вид",
      existing: "Интеграция существующего оборудования",
      cameras: "Камеры и датчики",
      radar: "Интеграция радара",
      correlation: "Сопоставление угроз",
      risk: "Оценка риска",
      ai: "Анализ с помощью ИИ",
      adaptive: "Адаптивное обучение",
      predictive: "Прогностический интеллект",
      multisite: "Несколько площадок",
      engineering: "Индивидуальная инженерия",
    },
  },
  environments: {
    heading: "Для разных сред",
    body: "Одна и та же архитектура интеллекта StarWall собирается вокруг очень разных операций.",
    items: {
      yacht: {
        title: "Яхта и суперяхта",
        body: "Осведомлённость на борту и связанная защита.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      marina: {
        title: "Марина",
        body: "Общая картина по воде, причалам, подходам и периметру.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      island: {
        title: "Частный остров и имение",
        body: "Осведомлённость по водным и сухопутным подходам.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      port: {
        title: "Порт",
        body: "Интеллект по зонам для сложной береговой инфраструктуры.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      special: {
        title: "Специальное развёртывание",
        body: "Временная, мобильная или узкая под задачу конфигурация.",
        recommended: "CUSTOM",
      },
    },
  },
  hardware: {
    heading: "Оборудование по необходимости",
    subheading: "Используйте то, что уже есть. Добавляйте то, чего не хватает.",
    body: "StarWall стыкуется с совместимой бортовой или объектовой инфраструктурой. Модули AGRON добавляются только там, где это нужно.",
    cta: "Смотреть оборудование",
    items: {
      existing: {
        title: "Существующая инфраструктура",
        body: "Подключить StarWall к совместимым системам, уже стоящим на судне или объекте.",
      },
      modules: {
        title: "Модули AGRON",
        body: "Добавить обнаружение, сенсорику, связь или другие нужные модули.",
      },
      mobile: {
        title: "Мобильное развёртывание",
        body: "Мобильная конфигурация для временных, меняющихся или удалённых операций.",
      },
      complete: {
        title: "Полная система AGRON",
        body: "Собрать StarWall и оборудование вокруг конкретного объекта.",
      },
    },
  },
  how: {
    heading: "Как складывается цена StarWall",
    body: "Каждое судно и каждый объект другие. Цена отражает фактическую конфигурацию, а не пакет с витрины.",
    cta: "Запросить цену",
    items: {
      plan: {
        title: "План StarWall",
        caption: "Уровень ПО и интеллекта",
      },
      integration: {
        title: "Интеграция",
        caption: "Уже стоящие системы и источники данных",
      },
      hardware: {
        title: "Оборудование",
        caption: "Только если нужно",
      },
      support: {
        title: "Развёртывание и поддержка",
        caption: "Установка, эксплуатация и уровень поддержки",
      },
      result: {
        title: "Ваша конфигурация",
        caption: "Под конкретное судно или объект",
      },
    },
  },
  request: {
    heading: "Не уверены, какой план StarWall подходит?",
    body: "Напишите, что вы защищаете и какое оборудование уже стоит. AGRON предложит подходящую конфигурацию StarWall.",
    cta: "Запросить конфигурацию StarWall",
    assetLabel: "Что вы защищаете?",
    assets: {
      yacht: "Яхта",
      superyacht: "Суперяхта",
      marina: "Марина",
      island: "Частный остров / имение",
      port: "Порт",
      special: "Специальное развёртывание",
      other: "Другое",
    },
    scaleLabel: "Примерный масштаб",
    scalePlaceholder: "Длина, число причалов, гектары или число площадок",
    systemsLabel: "Уже стоящие системы",
    systems: {
      radar: "Радар",
      cameras: "Камеры",
      ais: "AIS / навигация",
      sonar: "Сонар",
      sensors: "Датчики",
      access: "Контроль доступа",
      comms: "Связь",
      other: "Другое",
      none: "Нет / новая установка",
    },
    requirementLabel: "Главная задача",
    requirements: {
      visibility: "Оперативная видимость",
      risk: "Обнаружение риска",
      protection: "Связанная защита",
      intelligence: "Продвинутый интеллект",
      complete: "Полная конфигурация",
      unsure: "Пока не ясно",
    },
    name: "Имя",
    company: "Компания",
    email: "Email",
    phone: "Телефон",
    optional: "необязательно",
    submit: "Запросить конфигурацию",
    success:
      "Заявка получена. Специалист AGRON разберёт её и вернётся с разговором о конфигурации — не с публичным прайсом.",
    required: "Обязательное поле",
    invalidEmail: "Укажите корректный email",
  },
};

const es: PlansPageCopy = {
  ...en,
  kicker: "Planes",
  title: "Planes StarWall",
  supporting: "Elija el nivel de inteligencia que necesita su operación.",
  body: "Desde un yate hasta una marina, una isla privada, un puerto o varias sedes, StarWall trabaja con la infraestructura existente y crece con los requisitos.",
  compareCta: "Comparar planes",
  requestCta: "Solicitar precio",
  heroNote:
    "El precio depende de la configuración, la integración, el despliegue y el nivel de soporte.",
  mostPopular: "El más elegido",
  includesLabel: "Incluye",
  bestForLabel: "Pensado para",
  recommendedLabel: "Suele especificarse",
  optional: "Opcional",
  plans: {
    LIGHT: {
      subtitle: "Visibilidad esencial",
      description: "Una imagen operativa clara con los sistemas que ya tiene alrededor.",
      includes: [
        "Integración del equipo existente",
        "Cámaras y sensores",
        "Vista en vivo unificada",
        "Alertas",
        "Historial de eventos",
        "Soporte estándar",
      ],
      bestFor: "Yate · Propiedad menor",
      cta: "Ver Light",
    },
    ADVANCED: {
      subtitle: "Protección integrada",
      description:
        "Conciencia continua con varias fuentes de datos, detección de riesgo y apoyo operativo.",
      includes: [
        "Todo lo de Light",
        "Integración de radar",
        "Varias fuentes de sensores",
        "Correlación de amenazas",
        "Evaluación de riesgo",
        "Soporte 24/7",
      ],
      bestFor: "Yate · Superyate · Marina",
      cta: "Ver Advanced",
    },
    INTELLIGENCE: {
      subtitle: "Inteligencia adaptativa",
      description:
        "Análisis más profundo para entornos complejos donde importan el contexto, la conducta y la historia.",
      includes: [
        "Todo lo de Advanced",
        "Análisis asistido por IA",
        "Detección de anomalías",
        "Aprendizaje adaptativo",
        "Inteligencia predictiva",
        "Historial operativo avanzado",
      ],
      bestFor: "Superyate · Marina · Isla privada",
      cta: "Ver Intelligence",
    },
    CUSTOM: {
      subtitle: "Específico de la misión",
      description:
        "Una arquitectura StarWall diseñada alrededor de la operación, no de un paquete prefijado.",
      includes: [
        "Arquitectura multi-sede",
        "Integraciones a medida",
        "Módulos especializados",
        "Ingeniería dedicada",
        "Reglas de operación propias",
        "Soporte dedicado",
      ],
      bestFor: "Puerto · Flota · Isla privada · Despliegue especial",
      cta: "Hablar de configuración",
    },
  },
  compare: {
    heading: "Comparar planes StarWall",
    subheading:
      "Empiece por el nivel de inteligencia que necesita. La configuración final se adapta al buque o al sitio.",
    capability: "Capacidad",
    rows: {
      liveView: "Vista en vivo unificada",
      existing: "Integración del equipo existente",
      cameras: "Cámaras y sensores",
      radar: "Integración de radar",
      correlation: "Correlación de amenazas",
      risk: "Evaluación de riesgo",
      ai: "Análisis asistido por IA",
      adaptive: "Aprendizaje adaptativo",
      predictive: "Inteligencia predictiva",
      multisite: "Operación multi-sede",
      engineering: "Ingeniería a medida",
    },
  },
  environments: {
    heading: "Para entornos distintos",
    body: "La misma arquitectura de inteligencia StarWall puede configurarse alrededor de operaciones muy diferentes.",
    items: {
      yacht: {
        title: "Yate y superyate",
        body: "Conciencia a bordo y protección integrada.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      marina: {
        title: "Marina",
        body: "Inteligencia compartida sobre agua, amarres, aproximaciones y perímetro.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      island: {
        title: "Isla privada y finca",
        body: "Conciencia en aproximaciones por agua y por tierra.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      port: {
        title: "Puerto",
        body: "Inteligencia por zonas para infraestructura costera compleja.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      special: {
        title: "Despliegue especial",
        body: "Configuración temporal, móvil o específica de la misión.",
        recommended: "CUSTOM",
      },
    },
  },
  hardware: {
    heading: "El hardware es opcional",
    subheading: "Use lo que ya tiene. Añada lo que haga falta.",
    body: "StarWall puede integrarse con infraestructura compatible ya instalada a bordo o en el sitio. El equipo AGRON se añade solo donde se requiere.",
    cta: "Ver hardware",
    items: {
      existing: {
        title: "Infraestructura existente",
        body: "Conectar StarWall a sistemas compatibles ya instalados en el buque o el sitio.",
      },
      modules: {
        title: "Módulos AGRON",
        body: "Añadir detección, sensores, comunicaciones u otros módulos necesarios.",
      },
      mobile: {
        title: "Despliegue móvil",
        body: "Una configuración móvil para operaciones temporales, cambiantes o remotas.",
      },
      complete: {
        title: "Sistema AGRON completo",
        body: "Diseñar StarWall y el hardware alrededor del sitio.",
      },
    },
  },
  how: {
    heading: "Cómo se calcula el precio StarWall",
    body: "Cada buque y cada sitio son distintos. El precio refleja la configuración real, no un paquete genérico.",
    cta: "Solicitar precio",
    items: {
      plan: { title: "Plan StarWall", caption: "Nivel de software e inteligencia" },
      integration: { title: "Integración", caption: "Sistemas y fuentes de datos existentes" },
      hardware: { title: "Hardware", caption: "Solo cuando hace falta" },
      support: {
        title: "Despliegue y soporte",
        caption: "Instalación, operación y nivel de soporte",
      },
      result: {
        title: "Su configuración",
        caption: "Construida alrededor del buque o del sitio reales",
      },
    },
  },
  request: {
    ...en.request,
    heading: "¿No está seguro de qué plan StarWall encaja?",
    body: "Díganos qué protege y qué equipo ya está instalado. AGRON puede recomendar la configuración StarWall adecuada.",
    cta: "Solicitar configuración StarWall",
    assetLabel: "¿Qué está protegiendo?",
    assets: {
      yacht: "Yate",
      superyacht: "Superyate",
      marina: "Marina",
      island: "Isla privada / finca",
      port: "Puerto",
      special: "Despliegue especial",
      other: "Otro",
    },
    scaleLabel: "Tamaño / escala aproximados",
    scalePlaceholder: "Eslora, amarres, hectáreas o número de sedes",
    systemsLabel: "Sistemas existentes",
    systems: {
      radar: "Radar",
      cameras: "Cámaras",
      ais: "AIS / navegación",
      sonar: "Sonar",
      sensors: "Sensores",
      access: "Control de acceso",
      comms: "Comunicaciones",
      other: "Otro",
      none: "Ninguno / instalación nueva",
    },
    requirementLabel: "Requisito principal",
    requirements: {
      visibility: "Visibilidad operativa",
      risk: "Detección de riesgo",
      protection: "Protección integrada",
      intelligence: "Inteligencia avanzada",
      complete: "Configuración completa",
      unsure: "No estoy seguro",
    },
    name: "Nombre",
    company: "Empresa",
    email: "Correo",
    phone: "Teléfono",
    optional: "opcional",
    submit: "Solicitar configuración",
    success:
      "Recibido. Un especialista de AGRON revisará la nota y continuará con una conversación de configuración, no con una lista pública de precios.",
    required: "Obligatorio",
    invalidEmail: "Introduzca un correo válido",
  },
};

const fr: PlansPageCopy = {
  ...en,
  kicker: "Plans",
  title: "Plans StarWall",
  supporting: "Choisissez le niveau d'intelligence dont votre opération a besoin.",
  body: "D'un yacht unique à une marina, une île privée, un port ou plusieurs sites, StarWall s'appuie sur l'infrastructure existante et s'étend avec les besoins.",
  compareCta: "Comparer les plans",
  requestCta: "Demander un tarif",
  heroNote:
    "Le tarif dépend de la configuration, de l'intégration, du déploiement et du niveau de support.",
  mostPopular: "Le plus choisi",
  includesLabel: "Inclut",
  bestForLabel: "Conçu pour",
  recommendedLabel: "Souvent spécifié",
  optional: "En option",
  plans: {
    LIGHT: {
      subtitle: "Visibilité essentielle",
      description: "Une image opérationnelle claire à partir des systèmes déjà en place.",
      includes: [
        "Intégration de l'équipement existant",
        "Caméras et capteurs",
        "Vue live unifiée",
        "Alertes",
        "Historique des événements",
        "Support standard",
      ],
      bestFor: "Yacht · Site plus petit",
      cta: "Voir Light",
    },
    ADVANCED: {
      subtitle: "Protection intégrée",
      description:
        "Conscience continue : plusieurs sources de données, détection du risque et soutien opérationnel.",
      includes: [
        "Tout Light",
        "Intégration radar",
        "Plusieurs sources de capteurs",
        "Corrélation des menaces",
        "Évaluation du risque",
        "Support 24/7",
      ],
      bestFor: "Yacht · Superyacht · Marina",
      cta: "Voir Advanced",
    },
    INTELLIGENCE: {
      subtitle: "Intelligence adaptative",
      description:
        "Une analyse plus profonde pour les environnements complexes où le contexte, le comportement et l'historique comptent.",
      includes: [
        "Tout Advanced",
        "Analyse assistée par IA",
        "Détection d'anomalies",
        "Apprentissage adaptatif",
        "Intelligence prédictive",
        "Historique opérationnel avancé",
      ],
      bestFor: "Superyacht · Marina · Île privée",
      cta: "Voir Intelligence",
    },
    CUSTOM: {
      subtitle: "Spécifique à la mission",
      description:
        "Une architecture StarWall conçue autour de l'opération, pas d'un package prédéfini.",
      includes: [
        "Architecture multi-sites",
        "Intégrations sur mesure",
        "Modules spécialisés",
        "Ingénierie dédiée",
        "Règles d'exploitation propres",
        "Support dédié",
      ],
      bestFor: "Port · Flotte · Île privée · Déploiement spécial",
      cta: "Discuter la configuration",
    },
  },
  compare: {
    heading: "Comparer les plans StarWall",
    subheading:
      "Partez du niveau d'intelligence dont vous avez besoin. La configuration finale s'adapte au navire ou au site.",
    capability: "Capacité",
    rows: {
      liveView: "Vue live unifiée",
      existing: "Intégration de l'équipement existant",
      cameras: "Caméras et capteurs",
      radar: "Intégration radar",
      correlation: "Corrélation des menaces",
      risk: "Évaluation du risque",
      ai: "Analyse assistée par IA",
      adaptive: "Apprentissage adaptatif",
      predictive: "Intelligence prédictive",
      multisite: "Exploitation multi-sites",
      engineering: "Ingénierie sur mesure",
    },
  },
  environments: {
    heading: "Pour des environnements différents",
    body: "La même architecture d'intelligence StarWall peut être configurée autour d'opérations très différentes.",
    items: {
      yacht: {
        title: "Yacht et superyacht",
        body: "Conscience à bord et protection intégrée.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      marina: {
        title: "Marina",
        body: "Intelligence partagée sur l'eau, les pontons, les approches et le périmètre.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      island: {
        title: "Île privée et domaine",
        body: "Conscience des approches par mer et par terre.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      port: {
        title: "Port",
        body: "Intelligence multi-zones pour une infrastructure littorale complexe.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      special: {
        title: "Déploiement spécial",
        body: "Configuration temporaire, mobile ou spécifique à la mission.",
        recommended: "CUSTOM",
      },
    },
  },
  hardware: {
    heading: "Le matériel est optionnel",
    subheading: "Utilisez ce que vous avez. Ajoutez ce qu'il faut.",
    body: "StarWall s'intègre à l'infrastructure compatible déjà en place à bord ou sur site. Le matériel AGRON s'ajoute seulement si nécessaire.",
    cta: "Voir le matériel",
    items: {
      existing: {
        title: "Infrastructure existante",
        body: "Connecter StarWall aux systèmes compatibles déjà installés.",
      },
      modules: {
        title: "Modules AGRON",
        body: "Ajouter la détection, les capteurs, les communications ou d'autres modules requis.",
      },
      mobile: {
        title: "Déploiement mobile",
        body: "Une configuration mobile pour des opérations temporaires, changeantes ou isolées.",
      },
      complete: {
        title: "Système AGRON complet",
        body: "Concevoir StarWall et le matériel autour du site.",
      },
    },
  },
  how: {
    heading: "Comment se construit le tarif StarWall",
    body: "Chaque navire et chaque site sont différents. Le tarif reflète la configuration réelle, pas un forfait générique.",
    cta: "Demander un tarif",
    items: {
      plan: { title: "Plan StarWall", caption: "Niveau logiciel et d'intelligence" },
      integration: { title: "Intégration", caption: "Systèmes et sources de données existants" },
      hardware: { title: "Matériel", caption: "Uniquement si nécessaire" },
      support: {
        title: "Déploiement et support",
        caption: "Installation, exploitation et niveau de support",
      },
      result: {
        title: "Votre configuration",
        caption: "Autour du navire ou du site réel",
      },
    },
  },
  request: {
    ...en.request,
    heading: "Pas sûr du plan StarWall adapté à votre opération ?",
    body: "Indiquez ce que vous protégez et quel équipement est déjà en place. AGRON peut recommander la configuration StarWall appropriée.",
    cta: "Demander une configuration StarWall",
    assetLabel: "Que protégez-vous ?",
    assets: {
      yacht: "Yacht",
      superyacht: "Superyacht",
      marina: "Marina",
      island: "Île privée / domaine",
      port: "Port",
      special: "Déploiement spécial",
      other: "Autre",
    },
    scaleLabel: "Taille / échelle approximative",
    scalePlaceholder: "Longueur, pontons, hectares ou nombre de sites",
    systemsLabel: "Systèmes existants",
    systems: {
      radar: "Radar",
      cameras: "Caméras",
      ais: "AIS / navigation",
      sonar: "Sonar",
      sensors: "Capteurs",
      access: "Contrôle d'accès",
      comms: "Communications",
      other: "Autre",
      none: "Aucun / nouvelle installation",
    },
    requirementLabel: "Besoin principal",
    requirements: {
      visibility: "Visibilité opérationnelle",
      risk: "Détection du risque",
      protection: "Protection intégrée",
      intelligence: "Intelligence avancée",
      complete: "Configuration complète",
      unsure: "Pas encore sûr",
    },
    name: "Nom",
    company: "Société",
    email: "E-mail",
    phone: "Téléphone",
    optional: "facultatif",
    submit: "Demander une configuration",
    success:
      "Reçu. Un spécialiste AGRON relira la note et reviendra pour une discussion de configuration — pas une grille tarifaire publique.",
    required: "Obligatoire",
    invalidEmail: "Indiquez un e-mail valide",
  },
};

const de: PlansPageCopy = {
  ...en,
  kicker: "Pläne",
  title: "StarWall-Pläne",
  supporting: "Wählen Sie die Intelligenzstufe, die Ihr Betrieb braucht.",
  body: "Von einer einzelnen Yacht bis zu Marina, Privatinsel, Hafen oder mehreren Standorten arbeitet StarWall mit vorhandener Infrastruktur und wächst mit den Anforderungen.",
  compareCta: "Pläne vergleichen",
  requestCta: "Preis anfragen",
  heroNote:
    "Der Preis ergibt sich aus Konfiguration, Integration, Einsatz und Supportniveau.",
  mostPopular: "Am häufigsten gewählt",
  includesLabel: "Enthält",
  bestForLabel: "Geeignet für",
  recommendedLabel: "Häufig spezifiziert",
  optional: "Optional",
  plans: {
    LIGHT: {
      subtitle: "Wesentliche Sicht",
      description: "Ein klares Lagebild aus den Systemen, die bereits vor Ort sind.",
      includes: [
        "Anbindung vorhandener Anlagen",
        "Kameras und Sensoren",
        "Vereinheitlichte Live-Ansicht",
        "Meldungen",
        "Ereignisverlauf",
        "Standard-Support",
      ],
      bestFor: "Yacht · Kleineres Objekt",
      cta: "Light ansehen",
    },
    ADVANCED: {
      subtitle: "Integrierter Schutz",
      description:
        "Dauerhafte Lageübersicht mit mehreren Datenquellen, Risikoerkennung und operativer Unterstützung.",
      includes: [
        "Alles aus Light",
        "Radar-Anbindung",
        "Mehrere Sensorquellen",
        "Bedrohungskorrelation",
        "Risikobewertung",
        "Support rund um die Uhr",
      ],
      bestFor: "Yacht · Superyacht · Marina",
      cta: "Advanced ansehen",
    },
    INTELLIGENCE: {
      subtitle: "Adaptive Intelligenz",
      description:
        "Tiefere Analyse für komplexe Umgebungen, in denen Kontext, Verhalten und Verlauf zählen.",
      includes: [
        "Alles aus Advanced",
        "KI-unterstützte Analyse",
        "Anomalieerkennung",
        "Adaptives Lernen",
        "Prognostische Intelligenz",
        "Erweiterter Betriebsverlauf",
      ],
      bestFor: "Superyacht · Marina · Privatinsel",
      cta: "Intelligence ansehen",
    },
    CUSTOM: {
      subtitle: "Auftragsspezifisch",
      description:
        "Eine StarWall-Architektur um den Betrieb herum, nicht um ein festes Paket.",
      includes: [
        "Architektur für mehrere Standorte",
        "Individuelle Integrationen",
        "Spezialmodule",
        "Eigene Entwicklung",
        "Eigene Betriebsregeln",
        "Dedizierter Support",
      ],
      bestFor: "Hafen · Flotte · Privatinsel · Sondereinsatz",
      cta: "Konfiguration besprechen",
    },
  },
  compare: {
    heading: "StarWall-Pläne vergleichen",
    subheading:
      "Beginnen Sie mit der benötigten Intelligenzstufe. Die endgültige Konfiguration wird an Schiff oder Standort angepasst.",
    capability: "Fähigkeit",
    rows: {
      liveView: "Vereinheitlichte Live-Ansicht",
      existing: "Anbindung vorhandener Anlagen",
      cameras: "Kameras und Sensoren",
      radar: "Radar-Anbindung",
      correlation: "Bedrohungskorrelation",
      risk: "Risikobewertung",
      ai: "KI-unterstützte Analyse",
      adaptive: "Adaptives Lernen",
      predictive: "Prognostische Intelligenz",
      multisite: "Mehrere Standorte",
      engineering: "Individuelle Entwicklung",
    },
  },
  environments: {
    heading: "Für unterschiedliche Umgebungen",
    body: "Dieselbe StarWall-Intelligenzarchitektur lässt sich um sehr unterschiedliche Betriebe herum konfigurieren.",
    items: {
      yacht: {
        title: "Yacht und Superyacht",
        body: "Lagebild an Bord und integrierter Schutz.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      marina: {
        title: "Marina",
        body: "Gemeinsames Lagebild über Wasser, Liegeplätze, Ansteuerungen und Perimeter.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      island: {
        title: "Privatinsel und Anwesen",
        body: "Lagebild über Wasser- und Landansteuerungen.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      port: {
        title: "Hafen",
        body: "Zonenweise Intelligenz für komplexe Hafeninfrastruktur.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      special: {
        title: "Sondereinsatz",
        body: "Zeitlich begrenzte, mobile oder auftragsspezifische Konfiguration.",
        recommended: "CUSTOM",
      },
    },
  },
  hardware: {
    heading: "Hardware ist optional",
    subheading: "Nutzen Sie, was schon da ist. Ergänzen Sie, was fehlt.",
    body: "StarWall lässt sich an kompatible Bord- oder Standorttechnik anbinden. AGRON-Module kommen nur dazu, wo sie gebraucht werden.",
    cta: "Hardware ansehen",
    items: {
      existing: {
        title: "Vorhandene Infrastruktur",
        body: "StarWall an kompatible Systeme anschließen, die schon an Bord oder am Standort stehen.",
      },
      modules: {
        title: "AGRON-Module",
        body: "Detektion, Sensorik, Kommunikation oder andere erforderliche Module ergänzen.",
      },
      mobile: {
        title: "Mobiler Einsatz",
        body: "Eine mobile Konfiguration für zeitlich begrenzte, wechselnde oder abgelegene Einsätze.",
      },
      complete: {
        title: "Vollständiges AGRON-System",
        body: "StarWall und Hardware um den Standort herum auslegen.",
      },
    },
  },
  how: {
    heading: "Wie sich der StarWall-Preis ergibt",
    body: "Jedes Schiff und jeder Standort ist anders. Der Preis folgt der tatsächlichen Konfiguration, keinem Schaufensterpaket.",
    cta: "Preis anfragen",
    items: {
      plan: { title: "StarWall-Plan", caption: "Software- und Intelligenzstufe" },
      integration: { title: "Integration", caption: "Vorhandene Systeme und Datenquellen" },
      hardware: { title: "Hardware", caption: "Nur wenn nötig" },
      support: {
        title: "Einsatz und Support",
        caption: "Installation, Betrieb und Supportniveau",
      },
      result: {
        title: "Ihre Konfiguration",
        caption: "Um das tatsächliche Schiff oder den Standort",
      },
    },
  },
  request: {
    ...en.request,
    heading: "Unsicher, welcher StarWall-Plan zu Ihrem Betrieb passt?",
    body: "Sagen Sie uns, was Sie schützen und welche Technik schon steht. AGRON kann die passende StarWall-Konfiguration vorschlagen.",
    cta: "StarWall-Konfiguration anfragen",
    assetLabel: "Was schützen Sie?",
    assets: {
      yacht: "Yacht",
      superyacht: "Superyacht",
      marina: "Marina",
      island: "Privatinsel / Anwesen",
      port: "Hafen",
      special: "Sondereinsatz",
      other: "Sonstiges",
    },
    scaleLabel: "Ungefähre Größe / Maßstab",
    scalePlaceholder: "Länge, Liegeplätze, Hektar oder Anzahl Standorte",
    systemsLabel: "Vorhandene Systeme",
    systems: {
      radar: "Radar",
      cameras: "Kameras",
      ais: "AIS / Navigation",
      sonar: "Sonar",
      sensors: "Sensoren",
      access: "Zutrittskontrolle",
      comms: "Kommunikation",
      other: "Sonstiges",
      none: "Keine / Neuinstallation",
    },
    requirementLabel: "Hauptbedarf",
    requirements: {
      visibility: "Operative Sicht",
      risk: "Risikoerkennung",
      protection: "Integrierter Schutz",
      intelligence: "Erweiterte Intelligenz",
      complete: "Vollständige Konfiguration",
      unsure: "Noch unklar",
    },
    name: "Name",
    company: "Unternehmen",
    email: "E-Mail",
    phone: "Telefon",
    optional: "optional",
    submit: "Konfiguration anfragen",
    success:
      "Eingegangen. Ein AGRON-Spezialist liest die Notiz und kommt mit einem Konfigurationsgespräch zurück — nicht mit einer öffentlichen Preisliste.",
    required: "Pflichtfeld",
    invalidEmail: "Gültige E-Mail angeben",
  },
};

const uk: PlansPageCopy = {
  kicker: "Плани",
  title: "Плани StarWall",
  supporting: "Оберіть рівень інтелекту, який потрібен вашій операції.",
  body: "Від однієї яхти до марини, приватного острова, порту чи кількох майданчиків StarWall працює з наявною інфраструктурою і розширюється разом із завданнями.",
  compareCta: "Порівняти плани",
  requestCta: "Запитати ціну",
  heroNote:
    "Ціна складається з конфігурації, інтеграції, розгортання та рівня підтримки.",
  mostPopular: "Обирають найчастіше",
  includesLabel: "Входить",
  bestForLabel: "Для кого",
  recommendedLabel: "Часто зазначають",
  optional: "За запитом",
  plans: {
    LIGHT: {
      subtitle: "Базова картина",
      description: "Зрозуміла оперативна картина із систем, які вже стоять навколо вас.",
      includes: [
        "Інтеграція наявного обладнання",
        "Камери та датчики",
        "Єдиний живий вигляд",
        "Сповіщення",
        "Історія подій",
        "Стандартна підтримка",
      ],
      bestFor: "Яхта · Невеликий об’єкт",
      cta: "Дивитися Light",
    },
    ADVANCED: {
      subtitle: "Пов’язаний захист",
      description:
        "Постійна обізнаність: кілька джерел даних, оцінка ризику та оперативна підтримка.",
      includes: [
        "Усе з Light",
        "Інтеграція радара",
        "Кілька джерел датчиків",
        "Співставлення загроз",
        "Оцінка ризику",
        "Підтримка 24/7",
      ],
      bestFor: "Яхта · Суперяхта · Марина",
      cta: "Дивитися Advanced",
    },
    INTELLIGENCE: {
      subtitle: "Адаптивний інтелект",
      description:
        "Глибший розбір для складних середовищ, де важливі контекст, поведінка та історія.",
      includes: [
        "Усе з Advanced",
        "Аналіз за допомогою ШІ",
        "Пошук аномалій",
        "Адаптивне навчання",
        "Прогностичний інтелект",
        "Розширена оперативна історія",
      ],
      bestFor: "Суперяхта · Марина · Приватний острів",
      cta: "Дивитися Intelligence",
    },
    CUSTOM: {
      subtitle: "Під завдання",
      description: "Архітектура StarWall навколо операції, а не готовий пакет.",
      includes: [
        "Архітектура на кілька майданчиків",
        "Індивідуальні інтеграції",
        "Спеціальні модулі",
        "Виділена інженерія",
        "Власні правила роботи",
        "Виділена підтримка",
      ],
      bestFor: "Порт · Флот · Приватний острів · Спеціальне розгортання",
      cta: "Обговорити конфігурацію",
    },
  },
  compare: {
    heading: "Порівняння планів StarWall",
    subheading:
      "Почніть із потрібного рівня інтелекту. Підсумкову конфігурацію підганяють під судно або об’єкт.",
    capability: "Можливість",
    rows: {
      liveView: "Єдиний живий вигляд",
      existing: "Інтеграція наявного обладнання",
      cameras: "Камери та датчики",
      radar: "Інтеграція радара",
      correlation: "Співставлення загроз",
      risk: "Оцінка ризику",
      ai: "Аналіз за допомогою ШІ",
      adaptive: "Адаптивне навчання",
      predictive: "Прогностичний інтелект",
      multisite: "Кілька майданчиків",
      engineering: "Індивідуальна інженерія",
    },
  },
  environments: {
    heading: "Для різних середовищ",
    body: "Ту саму архітектуру інтелекту StarWall можна зібрати навколо дуже різних операцій.",
    items: {
      yacht: {
        title: "Яхта і суперяхта",
        body: "Обізнаність на борту та пов’язаний захист.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      marina: {
        title: "Марина",
        body: "Спільна картина по воді, причалах, підходах і периметру.",
        recommended: "ADVANCED / INTELLIGENCE",
      },
      island: {
        title: "Приватний острів і маєток",
        body: "Обізнаність по водних і сухопутних підходах.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      port: {
        title: "Порт",
        body: "Інтелект по зонах для складної берегової інфраструктури.",
        recommended: "INTELLIGENCE / CUSTOM",
      },
      special: {
        title: "Спеціальне розгортання",
        body: "Тимчасова, мобільна або вузька під завдання конфігурація.",
        recommended: "CUSTOM",
      },
    },
  },
  hardware: {
    heading: "Обладнання за потреби",
    subheading: "Використовуйте те, що вже є. Додавайте те, чого бракує.",
    body: "StarWall стикується із сумісною бортовою або об’єктовою інфраструктурою. Модулі AGRON додають лише там, де це потрібно.",
    cta: "Дивитися обладнання",
    items: {
      existing: {
        title: "Наявна інфраструктура",
        body: "Підключити StarWall до сумісних систем, які вже стоять на судні або об’єкті.",
      },
      modules: {
        title: "Модулі AGRON",
        body: "Додати виявлення, сенсорику, зв’язок або інші потрібні модулі.",
      },
      mobile: {
        title: "Мобільне розгортання",
        body: "Мобільна конфігурація для тимчасових, змінних або віддалених операцій.",
      },
      complete: {
        title: "Повна система AGRON",
        body: "Зібрати StarWall і обладнання навколо конкретного об’єкта.",
      },
    },
  },
  how: {
    heading: "Як складається ціна StarWall",
    body: "Кожне судно і кожен об’єкт інші. Ціна відбиває фактичну конфігурацію, а не вітринний пакет.",
    cta: "Запитати ціну",
    items: {
      plan: { title: "План StarWall", caption: "Рівень ПЗ та інтелекту" },
      integration: { title: "Інтеграція", caption: "Наявні системи та джерела даних" },
      hardware: { title: "Обладнання", caption: "Лише якщо потрібно" },
      support: {
        title: "Розгортання і підтримка",
        caption: "Встановлення, експлуатація та рівень підтримки",
      },
      result: {
        title: "Ваша конфігурація",
        caption: "Під конкретне судно або об’єкт",
      },
    },
  },
  request: {
    heading: "Не впевнені, який план StarWall пасує?",
    body: "Напишіть, що ви захищаєте і яке обладнання вже стоїть. AGRON запропонує відповідну конфігурацію StarWall.",
    cta: "Запитати конфігурацію StarWall",
    assetLabel: "Що ви захищаєте?",
    assets: {
      yacht: "Яхта",
      superyacht: "Суперяхта",
      marina: "Марина",
      island: "Приватний острів / маєток",
      port: "Порт",
      special: "Спеціальне розгортання",
      other: "Інше",
    },
    scaleLabel: "Орієнтовний масштаб",
    scalePlaceholder: "Довжина, кількість причалів, гектари або число майданчиків",
    systemsLabel: "Наявні системи",
    systems: {
      radar: "Радар",
      cameras: "Камери",
      ais: "AIS / навігація",
      sonar: "Сонар",
      sensors: "Датчики",
      access: "Контроль доступу",
      comms: "Зв’язок",
      other: "Інше",
      none: "Немає / нова установка",
    },
    requirementLabel: "Головне завдання",
    requirements: {
      visibility: "Оперативна видимість",
      risk: "Виявлення ризику",
      protection: "Пов’язаний захист",
      intelligence: "Поглиблений інтелект",
      complete: "Повна конфігурація",
      unsure: "Поки не ясно",
    },
    name: "Ім’я",
    company: "Компанія",
    email: "Email",
    phone: "Телефон",
    optional: "необов’язково",
    submit: "Запитати конфігурацію",
    success:
      "Заявку отримано. Фахівець AGRON розбере її і повернеться з розмовою про конфігурацію — не з публічним прайсом.",
    required: "Обов’язкове поле",
    invalidEmail: "Вкажіть коректний email",
  },
};

export const plansPage: Record<Locale, PlansPageCopy> = {
  en,
  es,
  fr,
  de,
  ru,
  uk,
  ar: en,
  zh: en,
  ja: en,
  he: en,
};

export function getPlansPage(locale: Locale): PlansPageCopy {
  return plansPage[locale] ?? en;
}
