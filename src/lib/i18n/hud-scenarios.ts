import { AUTOMATED_ACTIONS } from "@/lib/automated-actions";
import {
  CRISIS_PROTOCOLS,
  FALLBACK_CRISIS_STEPS,
} from "@/lib/crisis-protocols";
import type { Locale } from "@/lib/i18n/locales";
import { SCENARIOS, SCENARIO_CATEGORIES, type Scenario } from "@/lib/scenarios";

export type ScenarioCopy = {
  name: string;
  log: string;
  action: string;
  options?: { label: string; detail: string }[];
};

const SCENARIO_IDS = [
  "recon-drone",
  "payload-drone",
  "drone-swarm",
  "loitering-drone",
  "converging-vessel",
  "vessel-no-ais",
  "usv-swarm",
  "critical-closing-speed",
  "man-overboard",
  "stealth-uuv",
  "diver-near-hull",
  "uuv-payload",
  "gps-spoofing",
  "comms-jamming",
  "anomalous-rf",
  "network-intrusion",
  "perimeter-breach",
  "unauthorized-vehicle",
  "tailgating",
  "unattended-object",
  "multi-domain-event",
  "support-center-lost",
  "special-event-mode",
] as const;

type ScenarioId = (typeof SCENARIO_IDS)[number];
type CategoryKey = (typeof SCENARIO_CATEGORIES)[number];

const CRISIS_IDS = [
  "man-overboard",
  "payload-drone",
  "drone-swarm",
  "usv-swarm",
  "critical-closing-speed",
  "uuv-payload",
  "comms-jamming",
  "multi-domain-event",
  "support-center-lost",
] as const;

type CrisisId = (typeof CRISIS_IDS)[number];

const AUTO_IDS = [
  "perimeter-breach",
  "unattended-object",
  "recon-drone",
  "tailgating",
] as const;

type AutoId = (typeof AUTO_IDS)[number];

function isScenarioId(id: string): id is ScenarioId {
  return (SCENARIO_IDS as readonly string[]).includes(id);
}

function isCrisisId(id: string): id is CrisisId {
  return (CRISIS_IDS as readonly string[]).includes(id);
}

function isAutoId(id: string): id is AutoId {
  return (AUTO_IDS as readonly string[]).includes(id);
}

function isCategoryKey(value: string): value is CategoryKey {
  return (SCENARIO_CATEGORIES as readonly string[]).includes(value);
}

function sameSteps(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((step, index) => step === b[index]);
}

function englishScenarioCopy(): Record<ScenarioId, ScenarioCopy> {
  const out = {} as Record<ScenarioId, ScenarioCopy>;
  for (const scenario of SCENARIOS) {
    if (!isScenarioId(scenario.id)) continue;
    out[scenario.id] = {
      name: scenario.name,
      log: scenario.logText,
      action: scenario.actionText,
      options: scenario.options?.map(({ label, detail }) => ({ label, detail })),
    };
  }
  return out;
}

function englishCrisisCopy(): Record<CrisisId, string[]> {
  const out = {} as Record<CrisisId, string[]>;
  for (const id of CRISIS_IDS) {
    out[id] = [...CRISIS_PROTOCOLS[id]];
  }
  return out;
}

function englishAutoCopy(): Record<AutoId, string[]> {
  const out = {} as Record<AutoId, string[]>;
  for (const id of AUTO_IDS) {
    out[id] = [...AUTOMATED_ACTIONS[id]];
  }
  return out;
}

const CATEGORIES: Record<Locale, Record<CategoryKey, string>> = {
  en: {
    Air: "Air",
    Surface: "Surface",
    Underwater: "Underwater",
    "RF / Electronic Warfare": "RF / Electronic Warfare",
    "Perimeter & Access": "Perimeter & Access",
    "Complex / Crisis": "Complex / Crisis",
  },
  es: {
    Air: "Aire",
    Surface: "Superficie",
    Underwater: "Submarino",
    "RF / Electronic Warfare": "RF / Guerra electrónica",
    "Perimeter & Access": "Perímetro y acceso",
    "Complex / Crisis": "Complejo / Crisis",
  },
  fr: {
    Air: "Aérien",
    Surface: "Surface",
    Underwater: "Sous-marin",
    "RF / Electronic Warfare": "RF / Guerre électronique",
    "Perimeter & Access": "Périmètre et accès",
    "Complex / Crisis": "Complexe / Crise",
  },
  de: {
    Air: "Luft",
    Surface: "Überwasser",
    Underwater: "Unterwasser",
    "RF / Electronic Warfare": "RF / Elektronische Kampfführung",
    "Perimeter & Access": "Perimeter und Zugang",
    "Complex / Crisis": "Komplex / Krise",
  },
  ru: {
    Air: "Воздух",
    Surface: "Поверхность",
    Underwater: "Под водой",
    "RF / Electronic Warfare": "РЧ / РЭБ",
    "Perimeter & Access": "Периметр и доступ",
    "Complex / Crisis": "Сложный / кризис",
  },
  uk: {
    Air: "Повітря",
    Surface: "Поверхня",
    Underwater: "Під водою",
    "RF / Electronic Warfare": "РЧ / РЕБ",
    "Perimeter & Access": "Периметр і доступ",
    "Complex / Crisis": "Складний / криза",
  },
  ar: {
    Air: "الجو",
    Surface: "السطح",
    Underwater: "تحت الماء",
    "RF / Electronic Warfare": "الترددات الراديوية / الحرب الإلكترونية",
    "Perimeter & Access": "المحيط والوصول",
    "Complex / Crisis": "معقّد / أزمة",
  },
  zh: {
    Air: "空中",
    Surface: "水面",
    Underwater: "水下",
    "RF / Electronic Warfare": "射频 / 电子战",
    "Perimeter & Access": "周界与准入",
    "Complex / Crisis": "复合 / 危机",
  },
  ja: {
    Air: "空中",
    Surface: "水面",
    Underwater: "水中",
    "RF / Electronic Warfare": "RF / 電子戦",
    "Perimeter & Access": "周辺と入場",
    "Complex / Crisis": "複合 / 危機",
  },
  he: {
    Air: "אוויר",
    Surface: "פני השטח",
    Underwater: "מתחת למים",
    "RF / Electronic Warfare": "RF / לוחמה אלקטרונית",
    "Perimeter & Access": "היקף וגישה",
    "Complex / Crisis": "מורכב / משבר",
  },
};

const es: Record<ScenarioId, ScenarioCopy> = {
  "recon-drone": {
    name: "Dron de reconocimiento",
    log: "UAV no identificado en posición fija a 200 m del través de estribor, con cámara, sin señal de operador registrada.",
    action:
      "Mantenga el seguimiento visual. No lo pierda de vista y registre el paso; interpólelo solo si entra en la zona de exclusión de 100 m.",
    options: [
      {
        label: "Mantener el seguimiento visual",
        detail:
          "No lo pierda de vista y registre el paso; interpólelo solo si entra en la zona de exclusión de 100 m.",
      },
      {
        label: "Avisar ahora por megáfono",
        detail:
          "Interpelación más rápida si hay un operador cerca, pero habrá anunciado que lo ha visto.",
      },
      {
        label: "Pedir a Support Center que lo identifique",
        detail:
          "Útil si permanece en estación; más lento que una vigilancia visual local.",
      },
    ],
  },
  "payload-drone": {
    name: "Dron con carga",
    log: "UAV en aproximación directa de entrada; el perfil de vuelo es coherente con una entrega de carga.",
    action:
      "Avise a todo el personal para despejar las zonas de cubierta. Contacte con Support Center de inmediato. No se acerque a la aeronave.",
  },
  "drone-swarm": {
    name: "Enjambre de drones",
    log: "6 contactos UAV detectados en formación coordinada, convergiendo desde el rumbo 090.",
    action:
      "Escale a Support Center de inmediato — varios contactos simultáneos superan la capacidad de respuesta de un solo operador.",
  },
  "loitering-drone": {
    name: "Dron en espera",
    log: "UAV en posición fija durante 14 minutos, altitud 80 m, rumbo 270.",
    action:
      "Registre la posición y mantenga la vigilancia. Anote rumbo, altitud y duración; reevalúe a los 30 minutos o si desciende.",
    options: [
      {
        label: "Registrar la posición y mantener la vigilancia",
        detail:
          "Anote rumbo, altitud y duración; reevalúe a los 30 minutos o si desciende.",
      },
      {
        label: "Interpelar por megáfono",
        detail:
          "Puede acortar la espera, a costa de revelar que hay vigilancia.",
      },
      {
        label: "Ampliar la cobertura RF y de cámaras",
        detail:
          "Más posibilidades de hallar un operador cercano; más atención para un contacto quieto.",
      },
    ],
  },
  "converging-vessel": {
    name: "Buque no identificado que converge",
    log: "Contacto no identificado que cierra a 8 kn con un rumbo de interceptación; sin respuesta AIS tras dos intentos.",
    action:
      "Llame en VHF ch.16. Contacto directo; la resolución más rápida si el buque vigila la radio.",
    options: [
      {
        label: "Llamar en VHF ch.16",
        detail:
          "Contacto directo; la resolución más rápida si el buque vigila la radio.",
      },
      {
        label: "Solo aumentar la vigilancia",
        detail:
          "Menos interrupción, pero retrasa la identificación si el contacto no responde a otras señales.",
      },
      {
        label: "Alterar el rumbo de forma preventiva",
        detail: "Elimina el riesgo de inmediato, a costa de la ruta prevista.",
      },
    ],
  },
  "vessel-no-ais": {
    name: "Buque sin AIS fondeado",
    log: "Buque en zona de fondeo desde hace 40 minutos; no se detecta transpondedor AIS.",
    action:
      "Siga vigilando. Los contactos estáticos sin AIS son habituales en un fondeadero; espere una hora antes de escalar.",
    options: [
      {
        label: "Seguir vigilando",
        detail:
          "Los contactos estáticos sin AIS son habituales en un fondeadero; espere una hora antes de escalar.",
      },
      {
        label: "Llamar ahora por VHF",
        detail:
          "Identificación más rápida, pero ocupa la guardia con un buque que no se mueve.",
      },
      {
        label: "Enviar una lancha a investigar",
        detail: "Confirma la identidad a costa de una embarcación, tripulación y tiempo.",
      },
    ],
  },
  "usv-swarm": {
    name: "Enjambre de embarcaciones de superficie no tripuladas",
    log: "4 contactos de superficie pequeños, sin AIS, que se mueven en un patrón coordinado a 18 nudos.",
    action:
      "Este patrón es coherente con una aproximación coordinada. Escale de inmediato y prepare una maniobra evasiva.",
  },
  "critical-closing-speed": {
    name: "Velocidad de cierre crítica",
    log: "Contacto que cierra a 22 nudos; el punto de máxima aproximación queda por debajo de 50 m en 3 minutos.",
    action: "Toque la sirena, altere el rumbo de inmediato, avise a Support Center.",
  },
  "man-overboard": {
    name: "Hombre al agua",
    log: "El sensor de perímetro y el parte de la tripulación indican una persona en el agua, banda de babor.",
    action:
      "Ejecute de inmediato el protocolo de hombre al agua. Marque la posición. Todo el personal a las estaciones asignadas.",
  },
  "stealth-uuv": {
    name: "Dron submarino furtivo",
    log: "Contacto acústico débil, rumbo 200, clasificación incierta — posible UUV, baja confianza.",
    action:
      "Siga con la vigilancia pasiva. Evita iluminar la columna de agua hasta confirmar el contacto.",
    options: [
      {
        label: "Seguir con la vigilancia pasiva",
        detail: "Evita iluminar la columna de agua hasta confirmar el contacto.",
      },
      {
        label: "Pasar el sónar a activo",
        detail:
          "Mejor clasificación, pero anuncia sus sensores y puede enmascarar otros contactos.",
      },
      {
        label: "Poner en espera al equipo de seguridad",
        detail:
          "Listos si se acerca al casco; retira gente de otras tareas por un contacto débil.",
      },
    ],
  },
  "diver-near-hull": {
    name: "Buzo cerca del casco",
    log: "Contacto de sónar coherente con un nadador, a 15 m del casco, profundidad 3 m.",
    action:
      "Avise a seguridad y congele los propulsores. Un nadador tan cerca puede morir por una hélice: detenga la maquinaria hasta identificarlo.",
    options: [
      {
        label: "Avisar a seguridad y congelar los propulsores",
        detail:
          "Un nadador tan cerca puede morir por una hélice: detenga la maquinaria hasta identificarlo.",
      },
      {
        label: "Iluminar y llamar desde cubierta",
        detail:
          "Puede identificar a un buzo conocido, pero no elimina el riesgo de la maquinaria.",
      },
      {
        label: "Botar una lancha para interceptar",
        detail:
          "Pone ojos sobre el nadador; lleva tiempo y mete una embarcación pequeña en el agua.",
      },
    ],
  },
  "uuv-payload": {
    name: "UUV que se acerca a la infraestructura",
    log: "Contacto submarino en aproximación directa al casco o al muelle; firma no biológica.",
    action:
      "Escalada inmediata a Support Center. Evacue al personal no esencial de la zona afectada.",
  },
  "gps-spoofing": {
    name: "Suplantación de GPS",
    log: "La posición GPS comunicada discrepa 340 m de la posición derivada del radar.",
    action:
      "Cruce radar y visual. No gobierne solo con GPS hasta explicar el desvío de 340 m.",
    options: [
      {
        label: "Cruzar radar y visual",
        detail: "No gobierne solo con GPS hasta explicar el desvío de 340 m.",
      },
      {
        label: "Cambiar a la fuente de posición de reserva",
        detail:
          "Aísla una alimentación errónea y puede perder algunas superposiciones de carta hasta volver atrás.",
      },
      {
        label: "Reducir la velocidad hasta que coincidan las posiciones",
        detail: "Gana tiempo para aclarar la situación, a costa del plan de derrota.",
      },
    ],
  },
  "comms-jamming": {
    name: "Interferencia de comunicaciones",
    log: "Pérdida de calidad de satcom y VHF, coherente con interferencia activa en la zona.",
    action:
      "Pase al canal de comunicación de reserva. Registre hora y duración para el análisis posterior.",
  },
  "anomalous-rf": {
    name: "Señal RF anómala",
    log: "Emisión RF no clasificada detectada, rumbo 150, intermitente.",
    action:
      "Registre la emisión y espere. Un solo pulso intermitente suele ser inocuo; tendrá constancia si se repite.",
    options: [
      {
        label: "Registrar la emisión y esperar",
        detail:
          "Un solo pulso intermitente suele ser inocuo; tendrá constancia si se repite.",
      },
      {
        label: "Ampliar el barrido de espectro",
        detail:
          "Detecta antes un segundo pulso, a costa de la atención del operador.",
      },
      {
        label: "Comparar con el tráfico cercano",
        detail:
          "Puede explicar el pulso como un buque conocido, o hacer perder tiempo con un caso aislado.",
      },
    ],
  },
  "network-intrusion": {
    name: "Intento de intrusión en la red de a bordo",
    log: "Intentos de autenticación inusuales en la red del buque desde un dispositivo no reconocido.",
    action:
      "Aísle el segmento afectado. Detiene la propagación mientras TI / Support Center revisan el dispositivo no reconocido.",
    options: [
      {
        label: "Aislar el segmento afectado",
        detail:
          "Detiene la propagación mientras TI / Support Center revisan el dispositivo no reconocido.",
      },
      {
        label: "Bloquear todas las altas de dispositivos nuevos",
        detail:
          "Detiene al atacante y también bloquea un portátil de reserva legítimo.",
      },
      {
        label: "Retirar solo el dispositivo sospechoso",
        detail:
          "Menos interrupción si ya sabe cuál es — arriesgado si se equivoca.",
      },
    ],
  },
  "perimeter-breach": {
    name: "Rotura de perímetro",
    log: "Sensor de movimiento activado, sector 4 de la valla; no hay personal autorizado registrado en la zona.",
    action:
      "Envíe la patrulla más cercana, abra las cámaras. Ponga ojos en el sector 4 antes de recorrer la valla a ciegas.",
    options: [
      {
        label: "Enviar la patrulla más cercana, abrir las cámaras",
        detail: "Ponga ojos en el sector 4 antes de recorrer la valla a ciegas.",
      },
      {
        label: "Cerrar solo las puertas adyacentes",
        detail:
          "Contiene el sector y puede dejar a un trabajador legítimo al otro lado.",
      },
      {
        label: "Detener todo el movimiento en el recinto",
        detail:
          "Máximo control para un solo impacto en la valla; alta interrupción del trabajo habitual.",
      },
    ],
  },
  "unauthorized-vehicle": {
    name: "Vehículo no autorizado en el control",
    log: "Vehículo en la puerta 2 sin credencial de acceso registrada.",
    action:
      "Reténgalo en el control y verifique. Sin entrada hasta identificar al conductor y al vehículo.",
    options: [
      {
        label: "Retener en el control y verificar",
        detail: "Sin entrada hasta identificar al conductor y al vehículo.",
      },
      {
        label: "Denegar y hacer dar la vuelta al vehículo",
        detail:
          "Cierre más rápido si no tienen nada que hacer aquí; incorrecto si son un invitado esperado.",
      },
      {
        label: "Llamar primero al patrocinador indicado",
        detail: "Ayuda cuando alegan una cita; añade demora en la puerta.",
      },
    ],
  },
  tailgating: {
    name: "Colarse en un punto de acceso",
    log: "Dos personas detectadas al pasar por un punto de acceso de una sola credencial.",
    action:
      "Revise la cámara, confirme a la segunda persona. La mayoría de colados son invitados o colegas: compruebe antes de un corte brusco.",
    options: [
      {
        label: "Revisar la cámara, confirmar a la segunda persona",
        detail:
          "La mayoría de colados son invitados o colegas: compruebe antes de un corte brusco.",
      },
      {
        label: "Interpelar ahora a ambas personas",
        detail:
          "Control inmediato, y puede poner en evidencia a alguien autorizado.",
      },
      {
        label: "Detener el ciclo de la puerta",
        detail:
          "Impide una tercera entrada, pero forma cola detrás de ese punto de acceso.",
      },
    ],
  },
  "unattended-object": {
    name: "Objeto sin vigilancia",
    log: "Objeto detectado en una zona controlada durante más de 20 minutos, sin personal asociado.",
    action:
      "Avise al responsable de seguridad, no se acerque. Mantenga a la gente alejada hasta que alguien cualificado lo examine.",
    options: [
      {
        label: "Avisar al responsable de seguridad, no acercarse",
        detail: "Mantenga a la gente alejada hasta que alguien cualificado lo examine.",
      },
      {
        label: "Aislar la zona y esperar",
        detail:
          "La misma cautela con un cordón más amplio — más interrupción si es material olvidado.",
      },
      {
        label: "Preguntar al personal cercano si lo dejó",
        detail: "Resolución rápida cuando es suyo; incorrecto si no lo es.",
      },
    ],
  },
  "multi-domain-event": {
    name: "Evento simultáneo multidominio",
    log: "Contactos simultáneos: UAV aéreo (rumbo 090) y buque de superficie no identificado (rumbo 140).",
    action:
      "Esto es un evento multidominio — escale de inmediato al modo crisis, con plena implicación de Support Center.",
  },
  "support-center-lost": {
    name: "Conexión con Support Center perdida",
    log: "Enlace satcom con Support Center perdido; 3 intentos de reconexión fallidos.",
    action:
      "Pase al protocolo de comunicación de reserva. Siga con la vigilancia y el registro locales hasta restablecer el enlace.",
  },
  "special-event-mode": {
    name: "Modo evento especial / VIP",
    log: "Modo evento especial activo — ajuste temporal del perfil de riesgo por una presencia elevada de invitados.",
    action:
      "Revise a mano los contactos de Attention. La sensibilidad ya está alta; una comprobación humana evita un movimiento en falso durante el evento.",
    options: [
      {
        label: "Revisar a mano los contactos de Attention",
        detail:
          "La sensibilidad ya está alta; una comprobación humana evita un movimiento en falso durante el evento.",
      },
      {
        label: "Apretar la zona de exclusión",
        detail:
          "Más seguro para los invitados; más falsas alertas y más fricción en el perímetro.",
      },
      {
        label: "Añadir un segundo vigilante de guardia",
        detail:
          "Mejor cobertura para el evento, a costa de una persona más en la guardia.",
      },
    ],
  },
};

const fr: Record<ScenarioId, ScenarioCopy> = {
  "recon-drone": {
    name: "Drone de reconnaissance",
    log: "UAV non identifié en station à 200 m du travers tribord, équipé d'une caméra, aucun signal d'opérateur enregistré.",
    action:
      "Gardez le suivi visuel. Ne le perdez pas de vue et consignez le passage ; interpellez seulement s'il entre dans la zone d'exclusion de 100 m.",
    options: [
      {
        label: "Garder le suivi visuel",
        detail:
          "Ne le perdez pas de vue et consignez le passage ; interpellez seulement s'il entre dans la zone d'exclusion de 100 m.",
      },
      {
        label: "Héler maintenant au haut-parleur",
        detail:
          "Interpellation plus rapide si un opérateur est proche, mais vous aurez annoncé que vous l'avez vu.",
      },
      {
        label: "Demander à Support Center d'identifier",
        detail:
          "Utile s'il reste en station ; plus lent qu'une veille visuelle locale.",
      },
    ],
  },
  "payload-drone": {
    name: "Drone porteur de charge",
    log: "UAV en approche directe ; profil de vol cohérent avec une livraison de charge.",
    action:
      "Alertez tout le personnel pour dégager les zones de pont. Contactez Support Center immédiatement. Ne vous approchez pas de l'aéronef.",
  },
  "drone-swarm": {
    name: "Essaim de drones",
    log: "6 contacts UAV détectés en formation coordonnée, convergeant depuis le relèvement 090.",
    action:
      "Escaladez vers Support Center immédiatement — plusieurs contacts simultanés dépassent la capacité de réponse d'un seul opérateur.",
  },
  "loitering-drone": {
    name: "Drone en stationnaire",
    log: "UAV en position fixe depuis 14 minutes, altitude 80 m, relèvement 270.",
    action:
      "Consignez la position et restez en veille. Notez relèvement, altitude et durée ; réévaluez après 30 minutes ou s'il descend.",
    options: [
      {
        label: "Consigner la position et rester en veille",
        detail:
          "Notez relèvement, altitude et durée ; réévaluez après 30 minutes ou s'il descend.",
      },
      {
        label: "Interpeller au haut-parleur",
        detail:
          "Peut abréger le stationnaire, au prix de révéler la veille.",
      },
      {
        label: "Élargir la couverture RF et caméras",
        detail:
          "Meilleure chance de trouver un opérateur proche ; attention supplémentaire pour un contact immobile.",
      },
    ],
  },
  "converging-vessel": {
    name: "Navire non identifié en convergence",
    log: "Contact non identifié se rapprochant à 8 kn sur un relèvement d'interception ; pas de réponse AIS après deux tentatives.",
    action:
      "Appelez sur VHF ch.16. Contact direct, résolution la plus rapide si le navire écoute la radio.",
    options: [
      {
        label: "Appeler sur VHF ch.16",
        detail:
          "Contact direct, résolution la plus rapide si le navire écoute la radio.",
      },
      {
        label: "Renforcer seulement la veille",
        detail:
          "Moins de perturbation, mais retarde l'identification si le contact ne réagit pas aux autres indices.",
      },
      {
        label: "Modifier le cap par prévention",
        detail: "Supprime le risque immédiatement, au prix de la route prévue.",
      },
    ],
  },
  "vessel-no-ais": {
    name: "Navire sans AIS au mouillage",
    log: "Navire en zone de mouillage depuis 40 minutes ; aucun transpondeur AIS détecté.",
    action:
      "Poursuivez la surveillance. Les contacts statiques sans AIS sont courants au mouillage ; attendez une heure avant d'escalader.",
    options: [
      {
        label: "Poursuivre la surveillance",
        detail:
          "Les contacts statiques sans AIS sont courants au mouillage ; attendez une heure avant d'escalader.",
      },
      {
        label: "Appeler maintenant en VHF",
        detail:
          "Identification plus rapide, mais occupe la veille pour un navire qui ne bouge pas.",
      },
      {
        label: "Envoyer une annexe pour enquêter",
        detail: "Confirme l'identité au prix d'un bateau, d'un équipage et du temps.",
      },
    ],
  },
  "usv-swarm": {
    name: "Essaim de navires de surface sans équipage",
    log: "4 petits contacts de surface, sans AIS, se déplaçant selon un schéma coordonné à 18 nœuds.",
    action:
      "Ce schéma est cohérent avec une approche coordonnée. Escaladez immédiatement et préparez une manœuvre d'évitement.",
  },
  "critical-closing-speed": {
    name: "Vitesse de rapprochement critique",
    log: "Contact se rapprochant à 22 nœuds ; point de plus proche approche sous 50 m en 3 minutes.",
    action: "Sonnez le cornet, changez de cap immédiatement, prévenez Support Center.",
  },
  "man-overboard": {
    name: "Homme à la mer",
    log: "Le capteur de périmètre et le rapport de l'équipage indiquent une personne à l'eau, bâbord.",
    action:
      "Exécutez immédiatement le protocole homme à la mer. Marquez la position. Tout le monde aux postes désignés.",
  },
  "stealth-uuv": {
    name: "Drone sous-marin furtif",
    log: "Contact acoustique faible, relèvement 200, classification incertaine — UUV possible, faible confiance.",
    action:
      "Poursuivez la surveillance passive. Évite d'éclairer la colonne d'eau tant que le contact n'est pas confirmé.",
    options: [
      {
        label: "Poursuivre la surveillance passive",
        detail:
          "Évite d'éclairer la colonne d'eau tant que le contact n'est pas confirmé.",
      },
      {
        label: "Passer le sonar en actif",
        detail:
          "Meilleure classification, mais annonce vos capteurs et peut masquer d'autres contacts.",
      },
      {
        label: "Tenir l'équipe de sécurité prête",
        detail:
          "Prêts s'il se rapproche de la coque ; retire des gens d'autres tâches pour un contact faible.",
      },
    ],
  },
  "diver-near-hull": {
    name: "Plongeur près de la coque",
    log: "Contact sonar cohérent avec un nageur, à 15 m de la coque, profondeur 3 m.",
    action:
      "Alertez la sécurité et figez les propulseurs. Un nageur aussi proche peut être tué par une hélice — arrêtez les machines jusqu'à identification.",
    options: [
      {
        label: "Alerter la sécurité et figer les propulseurs",
        detail:
          "Un nageur aussi proche peut être tué par une hélice — arrêtez les machines jusqu'à identification.",
      },
      {
        label: "Éclairer et héler depuis le pont",
        detail:
          "Peut identifier un plongeur connu, mais n'élimine pas le risque des machines.",
      },
      {
        label: "Mettre à l'eau une annexe pour intercepter",
        detail:
          "Met des yeux sur le nageur ; prend du temps et met un petit bateau à l'eau.",
      },
    ],
  },
  "uuv-payload": {
    name: "UUV s'approchant de l'infrastructure",
    log: "Contact sous-marin en approche directe de la coque ou du quai ; signature non biologique.",
    action:
      "Escalade immédiate vers Support Center. Évacuez le personnel non essentiel de la zone concernée.",
  },
  "gps-spoofing": {
    name: "Usurpation GPS",
    log: "Position GPS signalée incohérente de 340 m avec la position dérivée du radar.",
    action:
      "Croisez radar et visuel. Ne gouvernez pas au GPS seul tant que le décalage de 340 m n'est pas expliqué.",
    options: [
      {
        label: "Croiser radar et visuel",
        detail:
          "Ne gouvernez pas au GPS seul tant que le décalage de 340 m n'est pas expliqué.",
      },
      {
        label: "Passer à la source de position de secours",
        detail:
          "Isole une alimentation erronée et peut faire disparaître certaines surcharges de carte jusqu'au retour.",
      },
      {
        label: "Réduire la vitesse jusqu'à accord des positions",
        detail: "Gagne du temps pour clarifier le point, au prix du plan de route.",
      },
    ],
  },
  "comms-jamming": {
    name: "Brouillage des communications",
    log: "Perte de qualité satcom et VHF, cohérente avec un brouillage actif dans la zone.",
    action:
      "Passez sur le canal de communication de secours. Consignez l'heure et la durée pour l'analyse a posteriori.",
  },
  "anomalous-rf": {
    name: "Signal RF anormal",
    log: "Émission RF non classée détectée, relèvement 150, intermittente.",
    action:
      "Consignez l'émission et attendez. Une seule salve intermittente est souvent bénigne ; vous aurez une trace si elle se répète.",
    options: [
      {
        label: "Consigner l'émission et attendre",
        detail:
          "Une seule salve intermittente est souvent bénigne ; vous aurez une trace si elle se répète.",
      },
      {
        label: "Élargir le balayage de spectre",
        detail:
          "Attrape plus tôt une deuxième salve, au prix de l'attention de l'opérateur.",
      },
      {
        label: "Comparer avec le trafic proche",
        detail:
          "Peut expliquer la salve comme un navire connu, ou faire perdre du temps sur un cas isolé.",
      },
    ],
  },
  "network-intrusion": {
    name: "Tentative d'intrusion sur le réseau de bord",
    log: "Tentatives d'authentification inhabituelles sur le réseau du navire depuis un appareil non reconnu.",
    action:
      "Isolez le segment concerné. Stoppe la propagation pendant que l'IT / Support Center examinent l'appareil non reconnu.",
    options: [
      {
        label: "Isoler le segment concerné",
        detail:
          "Stoppe la propagation pendant que l'IT / Support Center examinent l'appareil non reconnu.",
      },
      {
        label: "Bloquer toutes les nouvelles connexions d'appareils",
        detail:
          "Stoppe l'attaquant et bloque aussi un ordinateur portable de réserve légitime.",
      },
      {
        label: "Retirer seulement l'appareil suspect",
        detail:
          "Moins de perturbation si vous savez déjà lequel — risqué si vous vous trompez.",
      },
    ],
  },
  "perimeter-breach": {
    name: "Franchissement de périmètre",
    log: "Capteur de mouvement déclenché, secteur 4 de la clôture ; aucun personnel autorisé consigné dans la zone.",
    action:
      "Envoyez la patrouille la plus proche, ouvrez les caméras. Mettez des yeux sur le secteur 4 avant de longer la clôture à l'aveugle.",
    options: [
      {
        label: "Envoyer la patrouille la plus proche, ouvrir les caméras",
        detail:
          "Mettez des yeux sur le secteur 4 avant de longer la clôture à l'aveugle.",
      },
      {
        label: "Verrouiller seulement les portes adjacentes",
        detail:
          "Contient le secteur, et peut coincer un travailleur légitime du mauvais côté.",
      },
      {
        label: "Immobiliser tous les mouvements du site",
        detail:
          "Contrôle maximal pour un seul impact de clôture ; forte perturbation du travail habituel.",
      },
    ],
  },
  "unauthorized-vehicle": {
    name: "Véhicule non autorisé au poste de contrôle",
    log: "Véhicule à la porte 2 sans titre d'accès enregistré.",
    action:
      "Retenez au poste de contrôle et vérifiez. Pas d'entrée tant que le conducteur et le véhicule ne sont pas identifiés.",
    options: [
      {
        label: "Retenir au poste de contrôle et vérifier",
        detail:
          "Pas d'entrée tant que le conducteur et le véhicule ne sont pas identifiés.",
      },
      {
        label: "Refuser et renvoyer le véhicule",
        detail:
          "Clôture la plus rapide s'ils n'ont rien à faire ici ; erroné s'il s'agit d'un invité attendu.",
      },
      {
        label: "Appeler d'abord le parrain indiqué",
        detail: "Utile s'ils invoquent un rendez-vous ; ajoute un délai à la porte.",
      },
    ],
  },
  tailgating: {
    name: "Intrusion à la suite à un point d'accès",
    log: "Deux personnes détectées franchissant un point d'accès à badge unique.",
    action:
      "Visionnez la caméra, confirmez la deuxième personne. La plupart des passages à la suite sont des invités ou des collègues — vérifiez avant un arrêt brutal.",
    options: [
      {
        label: "Visionner la caméra, confirmer la deuxième personne",
        detail:
          "La plupart des passages à la suite sont des invités ou des collègues — vérifiez avant un arrêt brutal.",
      },
      {
        label: "Interpeller les deux personnes maintenant",
        detail:
          "Contrôle immédiat, et peut mettre dans l'embarras quelqu'un d'autorisé.",
      },
      {
        label: "Bloquer le cycle de la porte",
        detail:
          "Empêche une troisième entrée, mais fait la queue derrière ce point d'accès.",
      },
    ],
  },
  "unattended-object": {
    name: "Objet sans surveillance",
    log: "Objet détecté dans une zone contrôlée depuis plus de 20 minutes, aucun personnel associé.",
    action:
      "Prévenez le responsable sécurité, ne vous approchez pas. Écartez les personnes jusqu'à ce qu'une personne qualifiée l'examine.",
    options: [
      {
        label: "Prévenir le responsable sécurité, ne pas s'approcher",
        detail:
          "Écartez les personnes jusqu'à ce qu'une personne qualifiée l'examine.",
      },
      {
        label: "Isoler la zone et attendre",
        detail:
          "Même prudence avec un cordon plus large — plus de perturbation s'il s'agit de matériel oublié.",
      },
      {
        label: "Demander au personnel proche s'ils l'ont laissé",
        detail: "Résolution rapide quand c'est le leur ; erroné si ce n'est pas le cas.",
      },
    ],
  },
  "multi-domain-event": {
    name: "Événement simultané multi-domaines",
    log: "Contacts simultanés : UAV aérien (relèvement 090) et navire de surface non identifié (relèvement 140).",
    action:
      "C'est un événement multi-domaines — passez immédiatement en mode crise, avec engagement complet de Support Center.",
  },
  "support-center-lost": {
    name: "Connexion Support Center perdue",
    log: "Liaison satcom vers Support Center perdue, 3 tentatives de reconnexion échouées.",
    action:
      "Passez au protocole de communication de secours. Poursuivez la surveillance et la consignation locales jusqu'au rétablissement de la liaison.",
  },
  "special-event-mode": {
    name: "Mode événement spécial / VIP",
    log: "Mode événement spécial actif — ajustement temporaire du profil de risque pour une présence élevée d'invités.",
    action:
      "Relisez à la main les contacts Attention. La sensibilité est déjà relevée ; un contrôle humain évite un faux mouvement pendant l'événement.",
    options: [
      {
        label: "Relire à la main les contacts Attention",
        detail:
          "La sensibilité est déjà relevée ; un contrôle humain évite un faux mouvement pendant l'événement.",
      },
      {
        label: "Resserrer la zone d'exclusion",
        detail:
          "Plus sûr pour les invités ; plus de fausses alertes et plus de friction au périmètre.",
      },
      {
        label: "Ajouter un second veilleur",
        detail:
          "Meilleure couverture pour l'événement, au prix d'une personne de plus à la veille.",
      },
    ],
  },
};

const de: Record<ScenarioId, ScenarioCopy> = {
  "recon-drone": {
    name: "Aufklärungsdrohne",
    log: "Unidentifizierte UAV in Position 200 m querab steuerbord, mit Kamera, kein registriertes Bedienersignal.",
    action:
      "Visuelle Verfolgung halten. Im Blick behalten und den Vorbeiflug protokollieren; erst ansprechen, wenn sie in die 100-m-Sperrzone einfliegt.",
    options: [
      {
        label: "Visuelle Verfolgung halten",
        detail:
          "Im Blick behalten und den Vorbeiflug protokollieren; erst ansprechen, wenn sie in die 100-m-Sperrzone einfliegt.",
      },
      {
        label: "Jetzt über Lautsprecher rufen",
        detail:
          "Schnellere Ansprache, wenn ein Bediener in der Nähe ist, aber Sie haben bekannt gegeben, dass Sie sie bemerkt haben.",
      },
      {
        label: "Support Center um Identifizierung bitten",
        detail:
          "Nützlich, wenn sie auf Station bleibt; langsamer als eine örtliche visuelle Wache.",
      },
    ],
  },
  "payload-drone": {
    name: "Drohne mit Nutzlast",
    log: "UAV auf direktem Anflug; Flugprofil passt zu einer Nutzlastabgabe.",
    action:
      "Das gesamte Personal warnen, Deckflächen zu räumen. Sofort Support Center kontaktieren. Sich dem Luftfahrzeug nicht nähern.",
  },
  "drone-swarm": {
    name: "Drohnenschwarm",
    log: "6 UAV-Kontakte in koordinierter Formation erkannt, nähern sich von Peilung 090.",
    action:
      "Sofort an Support Center eskalieren — mehrere gleichzeitige Kontakte übersteigen die Reaktionsfähigkeit eines einzelnen Bedieners.",
  },
  "loitering-drone": {
    name: "Kreisende Drohne",
    log: "UAV hält seit 14 Minuten eine feste Position, Höhe 80 m, Peilung 270.",
    action:
      "Position protokollieren und Wache halten. Peilung, Höhe und Dauer festhalten; nach 30 Minuten oder beim Sinken neu bewerten.",
    options: [
      {
        label: "Position protokollieren und Wache halten",
        detail:
          "Peilung, Höhe und Dauer festhalten; nach 30 Minuten oder beim Sinken neu bewerten.",
      },
      {
        label: "Über Lautsprecher ansprechen",
        detail:
          "Kann den Aufenthalt früher beenden, macht aber die Wache kenntlich.",
      },
      {
        label: "RF- und Kameraabdeckung erweitern",
        detail:
          "Bessere Chance, einen nahen Bediener zu finden; mehr Aufmerksamkeit für einen stillen Kontakt.",
      },
    ],
  },
  "converging-vessel": {
    name: "Konvergierendes unidentifiziertes Fahrzeug",
    log: "Unidentifizierter Kontakt schließt mit 8 kn auf abfangkursähnlicher Peilung; keine AIS-Antwort nach zwei Versuchen.",
    action:
      "Auf VHF ch.16 anrufen. Direkter Kontakt, schnellste Klärung, wenn das Fahrzeug Funk hört.",
    options: [
      {
        label: "Auf VHF ch.16 anrufen",
        detail:
          "Direkter Kontakt, schnellste Klärung, wenn das Fahrzeug Funk hört.",
      },
      {
        label: "Nur die Wache verstärken",
        detail:
          "Weniger Störung, verzögert aber die Identifizierung, wenn der Kontakt auf andere Hinweise nicht reagiert.",
      },
      {
        label: "Kurs vorsorglich ändern",
        detail: "Beseitigt das Risiko sofort, auf Kosten der geplanten Route.",
      },
    ],
  },
  "vessel-no-ais": {
    name: "Fahrzeug ohne AIS vor Anker",
    log: "Fahrzeug seit 40 Minuten in der Ankerzone, kein AIS-Transponder erkannt.",
    action:
      "Weiter beobachten. Statische Kontakte ohne AIS sind auf einem Ankerplatz üblich; eine Stunde warten, bevor eskaliert wird.",
    options: [
      {
        label: "Weiter beobachten",
        detail:
          "Statische Kontakte ohne AIS sind auf einem Ankerplatz üblich; eine Stunde warten, bevor eskaliert wird.",
      },
      {
        label: "Jetzt per VHF anrufen",
        detail:
          "Schnellere Identifizierung, belegt aber die Wache für ein Fahrzeug, das sich nicht bewegt.",
      },
      {
        label: "Beiboot zur Untersuchung aussetzen",
        detail: "Bestätigt die Identität auf Kosten von Boot, Besatzung und Zeit.",
      },
    ],
  },
  "usv-swarm": {
    name: "Schwarm unbemannter Überwasserfahrzeuge",
    log: "4 kleine Überwasserkontakte, kein AIS, bewegen sich in einem koordinierten Muster mit 18 Knoten.",
    action:
      "Dieses Muster passt zu einer koordinierten Annäherung. Sofort eskalieren und Ausweichmanöver vorbereiten.",
  },
  "critical-closing-speed": {
    name: "Kritische Annäherungsgeschwindigkeit",
    log: "Kontakt schließt mit 22 Knoten; nächster Punkt der Annäherung unter 50 m in 3 Minuten.",
    action: "Horn geben, Kurs sofort ändern, Support Center benachrichtigen.",
  },
  "man-overboard": {
    name: "Mann über Bord",
    log: "Perimetersensor und Meldung der Besatzung zeigen eine Person im Wasser, Backbord.",
    action:
      "Mann-über-Bord-Protokoll sofort ausführen. Position markieren. Alle auf die zugewiesenen Stationen.",
  },
  "stealth-uuv": {
    name: "Tarnende Unterwasserdrohne",
    log: "Schwacher akustischer Kontakt, Peilung 200, Klassifizierung unsicher — mögliches UUV, geringe Sicherheit.",
    action:
      "Passive Überwachung fortsetzen. Vermeidet, die Wassersäule auszuleuchten, bis der Kontakt bestätigt ist.",
    options: [
      {
        label: "Passive Überwachung fortsetzen",
        detail:
          "Vermeidet, die Wassersäule auszuleuchten, bis der Kontakt bestätigt ist.",
      },
      {
        label: "Sonar auf aktiv schalten",
        detail:
          "Bessere Klassifizierung, kündigt aber Ihre Sensoren an und kann andere Kontakte überdecken.",
      },
      {
        label: "Sicherheitsteam in Bereitschaft",
        detail:
          "Bereit, wenn es sich dem Rumpf nähert; zieht Leute von anderen Aufgaben für einen schwachen Kontakt ab.",
      },
    ],
  },
  "diver-near-hull": {
    name: "Taucher nahe am Rumpf",
    log: "Sonarkontakt passend zu einem Schwimmer, 15 m vom Rumpf, Tiefe 3 m.",
    action:
      "Sicherheit alarmieren und Strahler einfrieren. Ein Schwimmer so nah kann von einer Schraube getötet werden — Maschinen stoppen, bis identifiziert.",
    options: [
      {
        label: "Sicherheit alarmieren und Strahler einfrieren",
        detail:
          "Ein Schwimmer so nah kann von einer Schraube getötet werden — Maschinen stoppen, bis identifiziert.",
      },
      {
        label: "Ausleuchten und vom Deck aus rufen",
        detail:
          "Kann einen bekannten Taucher identifizieren, beseitigt aber nicht das Maschinenrisiko.",
      },
      {
        label: "Beiboot zum Abfangen aussetzen",
        detail:
          "Bringt Augen auf den Schwimmer, kostet Zeit und setzt ein kleines Boot ins Wasser.",
      },
    ],
  },
  "uuv-payload": {
    name: "UUV nähert sich der Infrastruktur",
    log: "Unterwasserkontakt auf direktem Kurs zu Rumpf/Pier, nichtbiologische Signatur.",
    action:
      "Sofortige Eskalation an Support Center. Nicht essenzielles Personal aus dem betroffenen Bereich evakuieren.",
  },
  "gps-spoofing": {
    name: "GPS-Täuschung",
    log: "Gemeldete GPS-Position weicht um 340 m von der radarabgeleiteten Position ab.",
    action:
      "Radar und Sicht gegenchecken. Nicht nur nach GPS steuern, bis der 340-m-Versatz erklärt ist.",
    options: [
      {
        label: "Radar und Sicht gegenchecken",
        detail: "Nicht nur nach GPS steuern, bis der 340-m-Versatz erklärt ist.",
      },
      {
        label: "Auf die Ersatzpositionsquelle wechseln",
        detail:
          "Trennt eine schlechte Einspeisung und kann einige Kartenüberlagerungen ausblenden, bis Sie zurückwechseln.",
      },
      {
        label: "Fahrt reduzieren, bis die Positionen übereinstimmen",
        detail: "Verschafft Zeit zur Klärung des Standorts, auf Kosten des Reiseplans.",
      },
    ],
  },
  "comms-jamming": {
    name: "Kommunikationsstörung",
    log: "Verlust der Satcom- und VHF-Signalqualität, passend zu aktiver Störung im Gebiet.",
    action:
      "Auf den Reserve-Kommunikationskanal wechseln. Zeit und Dauer für die Nachauswertung protokollieren.",
  },
  "anomalous-rf": {
    name: "Anomales RF-Signal",
    log: "Unklassifizierte RF-Emission erkannt, Peilung 150, intermittierend.",
    action:
      "Die Emission protokollieren und warten. Ein einzelner intermittierender Impuls ist oft harmlos; Sie haben einen Eintrag, falls er sich wiederholt.",
    options: [
      {
        label: "Die Emission protokollieren und warten",
        detail:
          "Ein einzelner intermittierender Impuls ist oft harmlos; Sie haben einen Eintrag, falls er sich wiederholt.",
      },
      {
        label: "Den Spektrumsweep erweitern",
        detail:
          "Erfasst einen zweiten Impuls früher, auf Kosten der Aufmerksamkeit des Bedieners.",
      },
      {
        label: "Mit nahem Verkehr vergleichen",
        detail:
          "Kann den Impuls als bekanntes Schiff erklären oder Zeit an einem Einzelfall verschwenden.",
      },
    ],
  },
  "network-intrusion": {
    name: "Versuch eines Eingriffs ins Bordnetz",
    log: "Ungewöhnliche Authentifizierungsversuche im Schiffsnetz von einem nicht erkannten Gerät.",
    action:
      "Das betroffene Segment isolieren. Stoppt die Ausbreitung, während IT / Support Center das nicht erkannte Gerät prüfen.",
    options: [
      {
        label: "Das betroffene Segment isolieren",
        detail:
          "Stoppt die Ausbreitung, während IT / Support Center das nicht erkannte Gerät prüfen.",
      },
      {
        label: "Alle neuen Gerätebeitritte sperren",
        detail:
          "Stoppt den Angreifer und sperrt auch ein legitimes Ersatznotebook.",
      },
      {
        label: "Nur das verdächtige Gerät entfernen",
        detail:
          "Geringere Störung, wenn Sie das Gerät schon kennen — riskant bei falscher Annahme.",
      },
    ],
  },
  "perimeter-breach": {
    name: "Perimeterdurchbruch",
    log: "Bewegungsmelder ausgelöst, Zaunlinie Sektor 4; kein berechtigtes Personal im Bereich erfasst.",
    action:
      "Nächste Streife entsenden, Kameras öffnen. Sektor 4 in den Blick nehmen, bevor jemand die Zaunlinie blind abläuft.",
    options: [
      {
        label: "Nächste Streife entsenden, Kameras öffnen",
        detail:
          "Sektor 4 in den Blick nehmen, bevor jemand die Zaunlinie blind abläuft.",
      },
      {
        label: "Nur die benachbarten Tore sperren",
        detail:
          "Dämmt den Sektor ein und kann eine berechtigte Arbeitskraft auf der falschen Seite einschließen.",
      },
      {
        label: "Jede Bewegung auf dem Gelände anhalten",
        detail:
          "Maximale Kontrolle für einen einzelnen Zauntreffer; hohe Störung der normalen Arbeit.",
      },
    ],
  },
  "unauthorized-vehicle": {
    name: "Unbefugtes Fahrzeug am Kontrollpunkt",
    log: "Fahrzeug an Tor 2 ohne registrierte Zugangsberechtigung.",
    action:
      "Am Kontrollpunkt halten und prüfen. Kein Einlass, bis Fahrer und Fahrzeug identifiziert sind.",
    options: [
      {
        label: "Am Kontrollpunkt halten und prüfen",
        detail: "Kein Einlass, bis Fahrer und Fahrzeug identifiziert sind.",
      },
      {
        label: "Ablehnen und das Fahrzeug abweisen",
        detail:
          "Schnellster Abschluss, wenn sie hier nichts zu suchen haben; falsch, wenn es ein erwarteter Gast ist.",
      },
      {
        label: "Zuerst den angegebenen Gastgeber anrufen",
        detail: "Hilft, wenn sie einen Termin angeben; verzögert am Tor.",
      },
    ],
  },
  tailgating: {
    name: "Hinterhergehen am Zugangspunkt",
    log: "Zwei Personen beim Passieren eines Ein-Ausweis-Zugangspunkts erkannt.",
    action:
      "Kamera prüfen, die zweite Person bestätigen. Die meisten Hinterhergehenden sind Gäste oder Kollegen — prüfen, bevor hart gestoppt wird.",
    options: [
      {
        label: "Kamera prüfen, die zweite Person bestätigen",
        detail:
          "Die meisten Hinterhergehenden sind Gäste oder Kollegen — prüfen, bevor hart gestoppt wird.",
      },
      {
        label: "Beide Personen jetzt ansprechen",
        detail:
          "Sofortige Kontrolle und kann jemanden in Verlegenheit bringen, der berechtigt war.",
      },
      {
        label: "Den Türzyklus anhalten",
        detail:
          "Verhindert einen dritten Eintritt, staut aber alle hinter diesem Zugangspunkt.",
      },
    ],
  },
  "unattended-object": {
    name: "Unbeaufsichtigter Gegenstand",
    log: "Gegenstand in einer kontrollierten Zone seit über 20 Minuten erkannt, kein zugehöriges Personal.",
    action:
      "Die Sicherheitsleitung benachrichtigen, nicht nähern. Personen fernhalten, bis jemand Qualifiziertes ihn ansieht.",
    options: [
      {
        label: "Die Sicherheitsleitung benachrichtigen, nicht nähern",
        detail:
          "Personen fernhalten, bis jemand Qualifiziertes ihn ansieht.",
      },
      {
        label: "Die Zone absperren und warten",
        detail:
          "Dieselbe Vorsicht mit einem weiteren Kordon — mehr Störung, wenn es vergessenes Gerät ist.",
      },
      {
        label: "Nahes Personal fragen, ob sie es liegen ließen",
        detail: "Schnelle Klärung, wenn es ihres ist; falsch, wenn nicht.",
      },
    ],
  },
  "multi-domain-event": {
    name: "Gleichzeitiges Ereignis in mehreren Bereichen",
    log: "Gleichzeitige Kontakte: luftgestützte UAV (Peilung 090) und unidentifiziertes Überwasserfahrzeug (Peilung 140).",
    action:
      "Das ist ein Mehrbereichsereignis — sofort in den Krisenmodus eskalieren, volle Einbindung von Support Center.",
  },
  "support-center-lost": {
    name: "Verbindung zu Support Center verloren",
    log: "Satcom-Verbindung zu Support Center verloren, 3 fehlgeschlagene Wiederverbindungsversuche.",
    action:
      "Auf das Reserve-Kommunikationsprotokoll wechseln. Örtliche Überwachung und Protokollierung fortsetzen, bis die Verbindung wiedersteht.",
  },
  "special-event-mode": {
    name: "Sonderveranstaltung / VIP-Modus",
    log: "Sonderveranstaltungsmodus aktiv — vorübergehende Anpassung des Risikoprofils wegen erhöhter Gästepräsenz.",
    action:
      "Attention-Kontakte von Hand prüfen. Die Empfindlichkeit ist bereits erhöht; eine menschliche Prüfung vermeidet eine falsche Bewegung während der Veranstaltung.",
    options: [
      {
        label: "Attention-Kontakte von Hand prüfen",
        detail:
          "Die Empfindlichkeit ist bereits erhöht; eine menschliche Prüfung vermeidet eine falsche Bewegung während der Veranstaltung.",
      },
      {
        label: "Die Sperrzone enger ziehen",
        detail:
          "Sicherer für Gäste; mehr Fehlalarme und mehr Reibung am Perimeter.",
      },
      {
        label: "Einen zweiten Wachhabenden hinzuziehen",
        detail:
          "Bessere Abdeckung für die Veranstaltung, auf Kosten einer weiteren Person auf der Wache.",
      },
    ],
  },
};

const ru: Record<ScenarioId, ScenarioCopy> = {
  "recon-drone": {
    name: "Разведывательный беспилотник",
    log: "Неопознанный БПЛА зависает в 200 м на траверзе правого борта, с камерой, сигнала зарегистрированного оператора нет.",
    action:
      "Держите визуальное сопровождение. Не выпускайте из виду и запишите проход; окликайте только если войдёт в зону исключения 100 м.",
    options: [
      {
        label: "Держать визуальное сопровождение",
        detail:
          "Не выпускайте из виду и запишите проход; окликайте только если войдёт в зону исключения 100 м.",
      },
      {
        label: "Окликнуть сейчас через громкоговоритель",
        detail:
          "Более быстрый оклик, если оператор рядом, но вы уже показали, что его заметили.",
      },
      {
        label: "Попросить Support Center опознать",
        detail:
          "Полезно, если он остаётся на станции; медленнее местной визуальной вахты.",
      },
    ],
  },
  "payload-drone": {
    name: "Беспилотник с полезной нагрузкой",
    log: "БПЛА на прямом сближении; профиль полёта соответствует доставке нагрузки.",
    action:
      "Предупредите весь персонал очистить палубные зоны. Немедленно свяжитесь с Support Center. К летательному аппарату не приближайтесь.",
  },
  "drone-swarm": {
    name: "Рой беспилотников",
    log: "Обнаружено 6 контактов БПЛА в согласованном строю, сходятся с пеленга 090.",
    action:
      "Немедленно эскалируйте в Support Center — несколько одновременных контактов превышают возможности одного оператора.",
  },
  "loitering-drone": {
    name: "Дежурящий беспилотник",
    log: "БПЛА держит фиксированную позицию 14 минут, высота 80 м, пеленг 270.",
    action:
      "Зафиксируйте позицию и продолжайте наблюдение. Запишите пеленг, высоту и длительность; пересмотрите через 30 минут или если снижется.",
    options: [
      {
        label: "Зафиксировать позицию и продолжать наблюдение",
        detail:
          "Запишите пеленг, высоту и длительность; пересмотрите через 30 минут или если снижется.",
      },
      {
        label: "Окликнуть через громкоговоритель",
        detail:
          "Может раньше прекратить зависание, ценой того, что вахта себя обнаружит.",
      },
      {
        label: "Расширить покрытие РЧ и камер",
        detail:
          "Выше шанс найти оператора поблизости; больше внимания на неподвижный контакт.",
      },
    ],
  },
  "converging-vessel": {
    name: "Сближающееся неопознанное судно",
    log: "Неопознанный контакт сближается на 8 kn по перехватному пеленгу; ответа AIS нет после двух попыток.",
    action:
      "Вызовите на VHF ch.16. Прямой контакт, самое быстрое разрешение, если судно слушает радио.",
    options: [
      {
        label: "Вызвать на VHF ch.16",
        detail:
          "Прямой контакт, самое быстрое разрешение, если судно слушает радио.",
      },
      {
        label: "Только усилить вахту",
        detail:
          "Меньше помех, но задерживает опознание, если контакт не реагирует на другие признаки.",
      },
      {
        label: "Заранее изменить курс",
        detail: "Снимает риск сразу, ценой запланированного маршрута.",
      },
    ],
  },
  "vessel-no-ais": {
    name: "Судно без AIS на якоре",
    log: "Судно в зоне якорной стоянки 40 минут, транспондер AIS не обнаружен.",
    action:
      "Продолжайте наблюдение. Неподвижные контакты без AIS на якорной стоянке обычны; подождите час, прежде чем эскалировать.",
    options: [
      {
        label: "Продолжить наблюдение",
        detail:
          "Неподвижные контакты без AIS на якорной стоянке обычны; подождите час, прежде чем эскалировать.",
      },
      {
        label: "Вызвать сейчас по VHF",
        detail:
          "Более быстрое опознание, но занимает вахту из-за судна, которое не движется.",
      },
      {
        label: "Отправить катер на проверку",
        detail: "Подтверждает личность ценой катера, экипажа и времени.",
      },
    ],
  },
  "usv-swarm": {
    name: "Рой беспилотных надводных аппаратов",
    log: "4 малых надводных контакта, без AIS, движутся согласованным рисунком на 18 узлах.",
    action:
      "Этот рисунок соответствует согласованному сближению. Немедленно эскалируйте и готовьте уклонение.",
  },
  "critical-closing-speed": {
    name: "Критическая скорость сближения",
    log: "Контакт сближается на 22 узлах; ближайшая точка подхода менее 50 м через 3 минуты.",
    action: "Дайте гудок, немедленно измените курс, уведомите Support Center.",
  },
  "man-overboard": {
    name: "Человек за бортом",
    log: "Периметровый датчик и доклад экипажа: человек в воде, левый борт.",
    action:
      "Немедленно выполните протокол «человек за бортом». Отметьте позицию. Всем — на назначенные посты.",
  },
  "stealth-uuv": {
    name: "Скрытный подводный аппарат",
    log: "Слабый акустический контакт, пеленг 200, классификация неясна — возможный UUV, низкая уверенность.",
    action:
      "Продолжайте пассивное наблюдение. Не подсвечивает водный столб, пока контакт не подтверждён.",
    options: [
      {
        label: "Продолжить пассивное наблюдение",
        detail: "Не подсвечивает водный столб, пока контакт не подтверждён.",
      },
      {
        label: "Перевести сонар в актив",
        detail:
          "Лучшая классификация, но выдаёт ваши датчики и может маскировать другие контакты.",
      },
      {
        label: "Держать группу охраны наготове",
        detail:
          "Готовы, если подойдёт к корпусу; снимает людей с других задач из-за слабого контакта.",
      },
    ],
  },
  "diver-near-hull": {
    name: "Пловец у корпуса",
    log: "Сонарный контакт, похожий на пловца, 15 м от корпуса, глубина 3 м.",
    action:
      "Оповестите охрану и остановите подруливающие устройства. Пловец так близко может погибнуть от винта — остановите механизмы до опознания.",
    options: [
      {
        label: "Оповестить охрану и остановить подруливающие",
        detail:
          "Пловец так близко может погибнуть от винта — остановите механизмы до опознания.",
      },
      {
        label: "Подсветить и окликнуть с палубы",
        detail:
          "Может опознать известного водолаза, но не снимает риск механизмов.",
      },
      {
        label: "Спустить катер на перехват",
        detail:
          "Даёт глаза на пловца; занимает время и ставит малый катер на воду.",
      },
    ],
  },
  "uuv-payload": {
    name: "UUV идёт к инфраструктуре",
    log: "Подводный контакт на прямом курсе к корпусу/причалу, небиологическая сигнатура.",
    action:
      "Немедленная эскалация в Support Center. Эвакуируйте несущественный персонал из затронутой зоны.",
  },
  "gps-spoofing": {
    name: "Подмена GPS",
    log: "Заявленная позиция GPS расходится с радиолокационной на 340 м.",
    action:
      "Сверьте радар и визуал. Не рулите только по GPS, пока не объяснено смещение 340 м.",
    options: [
      {
        label: "Сверить радар и визуал",
        detail: "Не рулите только по GPS, пока не объяснено смещение 340 м.",
      },
      {
        label: "Перейти на резервный источник позиции",
        detail:
          "Отсекает плохой поток и может снять часть картографических наложений, пока не вернётесь.",
      },
      {
        label: "Снизить ход, пока позиции не сойдутся",
        detail: "Даёт время разобрать обсервацию ценой плана перехода.",
      },
    ],
  },
  "comms-jamming": {
    name: "Подавление связи",
    log: "Потеря качества satcom и VHF, соответствует активному глушению в районе.",
    action:
      "Перейдите на резервный канал связи. Зафиксируйте время и длительность для разбора после события.",
  },
  "anomalous-rf": {
    name: "Аномальный РЧ-сигнал",
    log: "Обнаружено неклассифицированное РЧ-излучение, пеленг 150, прерывистое.",
    action:
      "Зафиксируйте излучение и ждите. Одиночный прерывистый всплеск часто безвреден; запись будет, если повторится.",
    options: [
      {
        label: "Зафиксировать излучение и ждать",
        detail:
          "Одиночный прерывистый всплеск часто безвреден; запись будет, если повторится.",
      },
      {
        label: "Расширить сканирование спектра",
        detail:
          "Раньше ловит второй всплеск ценой внимания оператора.",
      },
      {
        label: "Сравнить с близким трафиком",
        detail:
          "Может объяснить всплеск как известное судно или потратить время на разовый случай.",
      },
    ],
  },
  "network-intrusion": {
    name: "Попытка вторжения в бортовую сеть",
    log: "Необычные попытки аутентификации в сети судна с нераспознанного устройства.",
    action:
      "Изолируйте затронутый сегмент. Останавливает распространение, пока ИТ / Support Center проверяют нераспознанное устройство.",
    options: [
      {
        label: "Изолировать затронутый сегмент",
        detail:
          "Останавливает распространение, пока ИТ / Support Center проверяют нераспознанное устройство.",
      },
      {
        label: "Блокировать все новые подключения устройств",
        detail:
          "Останавливает атакующего и блокирует законный запасной ноутбук.",
      },
      {
        label: "Убрать только подозрительное устройство",
        detail:
          "Меньше сбоя, если вы уже знаете какое — риск, если угадаете неверно.",
      },
    ],
  },
  "perimeter-breach": {
    name: "Нарушение периметра",
    log: "Сработал датчик движения, линия ограждения сектор 4; уполномоченного персонала в зоне не зафиксировано.",
    action:
      "Вышлите ближайший патруль, откройте камеры. Поставьте глаза на сектор 4, прежде чем кто-то пойдёт вдоль ограждения вслепую.",
    options: [
      {
        label: "Выслать ближайший патруль, открыть камеры",
        detail:
          "Поставьте глаза на сектор 4, прежде чем кто-то пойдёт вдоль ограждения вслепую.",
      },
      {
        label: "Закрыть только смежные ворота",
        detail:
          "Локализует сектор и может запереть законного работника не с той стороны.",
      },
      {
        label: "Остановить всё движение по площадке",
        detail:
          "Максимальный контроль при одном срабатывании ограждения; сильный сбой обычной работы.",
      },
    ],
  },
  "unauthorized-vehicle": {
    name: "Несанкционированное транспортное средство на КПП",
    log: "Транспорт у ворот 2 без зарегистрированного пропуска.",
    action:
      "Удержите на КПП и проверьте. Входа нет, пока водитель и транспорт не опознаны.",
    options: [
      {
        label: "Удержать на КПП и проверить",
        detail: "Входа нет, пока водитель и транспорт не опознаны.",
      },
      {
        label: "Отказать и развернуть транспорт",
        detail:
          "Самое быстрое закрытие, если им здесь нечего делать; ошибка, если это ожидаемый гость.",
      },
      {
        label: "Сначала позвонить указанному пригласившему",
        detail: "Помогает, когда ссылаются на встречу; добавляет задержку у ворот.",
      },
    ],
  },
  tailgating: {
    name: "Проход следом в точке доступа",
    log: "Обнаружены двое, прошедшие через точку доступа с одним пропуском.",
    action:
      "Просмотрите камеру, подтвердите второго. Чаще всего это гости или коллеги — проверьте, прежде чем жёстко останавливать.",
    options: [
      {
        label: "Просмотреть камеру, подтвердить второго",
        detail:
          "Чаще всего это гости или коллеги — проверьте, прежде чем жёстко останавливать.",
      },
      {
        label: "Окликнуть обоих сейчас",
        detail:
          "Немедленный контроль, и может смутить того, кто был уполномочен.",
      },
      {
        label: "Остановить цикл двери",
        detail:
          "Препятствует третьему входу, но ставит очередь за этой точкой доступа.",
      },
    ],
  },
  "unattended-object": {
    name: "Бесхозный предмет",
    log: "Предмет в контролируемой зоне более 20 минут, связанного персонала нет.",
    action:
      "Сообщите руководителю охраны, не приближайтесь. Держите людей в стороне, пока квалифицированный человек не осмотрит.",
    options: [
      {
        label: "Сообщить руководителю охраны, не приближаться",
        detail:
          "Держите людей в стороне, пока квалифицированный человек не осмотрит.",
      },
      {
        label: "Изолировать зону и ждать",
        detail:
          "Та же осторожность с более широким кордоном — больше сбоя, если это забытый инвентарь.",
      },
      {
        label: "Спросить у ближайших, не они ли оставили",
        detail: "Быстрое разрешение, когда это их; ошибка, если нет.",
      },
    ],
  },
  "multi-domain-event": {
    name: "Одновременное событие в нескольких средах",
    log: "Одновременные контакты: воздушный БПЛА (пеленг 090) и неопознанное надводное судно (пеленг 140).",
    action:
      "Это событие в нескольких средах — немедленно эскалируйте в режим кризиса, с полной работой Support Center.",
  },
  "support-center-lost": {
    name: "Связь с Support Center потеряна",
    log: "Спутниковый канал к Support Center потерян, 3 неудачные попытки восстановить.",
    action:
      "Перейдите на резервный протокол связи. Продолжайте местное наблюдение и журнал, пока канал не восстановится.",
  },
  "special-event-mode": {
    name: "Режим особого мероприятия / VIP",
    log: "Режим особого мероприятия активен — временная подстройка профиля риска из-за повышенного присутствия гостей.",
    action:
      "Просмотрите контакты Attention вручную. Чувствительность уже повышена; человеческая проверка избегает ложного шага во время мероприятия.",
    options: [
      {
        label: "Просмотреть контакты Attention вручную",
        detail:
          "Чувствительность уже повышена; человеческая проверка избегает ложного шага во время мероприятия.",
      },
      {
        label: "Сжать зону исключения",
        detail:
          "Безопаснее для гостей; больше ложных тревог и больше трения на периметре.",
      },
      {
        label: "Добавить второго вахтенного",
        detail:
          "Лучшее покрытие мероприятия ценой ещё одного человека на вахте.",
      },
    ],
  },
};

const uk: Record<ScenarioId, ScenarioCopy> = {
  "recon-drone": {
    name: "Розвідувальний безпілотник",
    log: "Нерозпізнаний БПЛА тримає позицію за 200 м на траверзі правого борту, з камерою, сигналу зареєстрованого оператора немає.",
    action:
      "Тримайте візуальний супровід. Не випускайте з поля зору і запишіть прохід; окликайте лише якщо ввійде в зону виключення 100 м.",
    options: [
      {
        label: "Тримати візуальний супровід",
        detail:
          "Не випускайте з поля зору і запишіть прохід; окликайте лише якщо ввійде в зону виключення 100 м.",
      },
      {
        label: "Окликнути зараз через гучномовець",
        detail:
          "Швидший оклик, якщо оператор поруч, але ви вже показали, що його помітили.",
      },
      {
        label: "Попросити Support Center розпізнати",
        detail:
          "Корисно, якщо лишається на станції; повільніше за місцеву візуальну вахту.",
      },
    ],
  },
  "payload-drone": {
    name: "Безпілотник із корисним навантаженням",
    log: "БПЛА на прямому зближенні; профіль польоту відповідає доставці навантаження.",
    action:
      "Попередьте весь персонал звільнити палубні зони. Негайно зв’яжіться з Support Center. До літального апарата не наближайтесь.",
  },
  "drone-swarm": {
    name: "Рій безпілотників",
    log: "Виявлено 6 контактів БПЛА в узгодженому строю, сходяться з пеленга 090.",
    action:
      "Негайно ескалюйте до Support Center — кілька одночасних контактів перевищують спроможність одного оператора.",
  },
  "loitering-drone": {
    name: "Безпілотник на чергуванні",
    log: "БПЛА тримає фіксовану позицію 14 хвилин, висота 80 м, пеленг 270.",
    action:
      "Зафіксуйте позицію і продовжуйте спостереження. Запишіть пеленг, висоту й тривалість; перегляньте через 30 хвилин або якщо знизиться.",
    options: [
      {
        label: "Зафіксувати позицію і продовжувати спостереження",
        detail:
          "Запишіть пеленг, висоту й тривалість; перегляньте через 30 хвилин або якщо знизиться.",
      },
      {
        label: "Окликнути через гучномовець",
        detail:
          "Може раніше припинити зависання ціною того, що вахта себе виявить.",
      },
      {
        label: "Розширити покриття РЧ і камер",
        detail:
          "Вищий шанс знайти оператора поруч; більше уваги на нерухомий контакт.",
      },
    ],
  },
  "converging-vessel": {
    name: "Судно, що зближується, нерозпізнане",
    log: "Нерозпізнаний контакт зближується на 8 kn перехоплювальним пеленгом; відповіді AIS немає після двох спроб.",
    action:
      "Викличте на VHF ch.16. Прямий контакт, найшвидше розв’язання, якщо судно слухає радіо.",
    options: [
      {
        label: "Викликати на VHF ch.16",
        detail:
          "Прямий контакт, найшвидше розв’язання, якщо судно слухає радіо.",
      },
      {
        label: "Лише посилити вахту",
        detail:
          "Менше перешкод, але затримує розпізнавання, якщо контакт не реагує на інші ознаки.",
      },
      {
        label: "Заздалегідь змінити курс",
        detail: "Знімає ризик одразу ціною запланованого маршруту.",
      },
    ],
  },
  "vessel-no-ais": {
    name: "Судно без AIS на якорі",
    log: "Судно в зоні якірної стоянки 40 хвилин, транспондер AIS не виявлено.",
    action:
      "Продовжуйте спостереження. Нерухомі контакти без AIS на якірній стоянці звичні; зачекайте годину, перш ніж ескалювати.",
    options: [
      {
        label: "Продовжити спостереження",
        detail:
          "Нерухомі контакти без AIS на якірній стоянці звичні; зачекайте годину, перш ніж ескалювати.",
      },
      {
        label: "Викликати зараз по VHF",
        detail:
          "Швидше розпізнавання, але займає вахту через судно, яке не рухається.",
      },
      {
        label: "Відправити катер на перевірку",
        detail: "Підтверджує особу ціною катера, екіпажу і часу.",
      },
    ],
  },
  "usv-swarm": {
    name: "Рій безпілотних надводних апаратів",
    log: "4 малі надводні контакти, без AIS, рухаються узгодженим рисунком на 18 вузлах.",
    action:
      "Цей рисунок відповідає узгодженому зближенню. Негайно ескалюйте і готуйте ухилення.",
  },
  "critical-closing-speed": {
    name: "Критична швидкість зближення",
    log: "Контакт зближується на 22 вузлах; найближча точка підходу менше 50 м за 3 хвилини.",
    action: "Дайте гудок, негайно змініть курс, повідомте Support Center.",
  },
  "man-overboard": {
    name: "Людина за бортом",
    log: "Периметровий датчик і доповідь екіпажу: людина у воді, лівий борт.",
    action:
      "Негайно виконайте протокол «людина за бортом». Позначте позицію. Усім — на призначені пости.",
  },
  "stealth-uuv": {
    name: "Прихований підводний апарат",
    log: "Слабкий акустичний контакт, пеленг 200, класифікація неясна — можливий UUV, низька впевненість.",
    action:
      "Продовжуйте пасивне спостереження. Не підсвічує водний стовп, доки контакт не підтверджено.",
    options: [
      {
        label: "Продовжити пасивне спостереження",
        detail: "Не підсвічує водний стовп, доки контакт не підтверджено.",
      },
      {
        label: "Перевести сонар в актив",
        detail:
          "Краща класифікація, але видає ваші датчики і може маскувати інші контакти.",
      },
      {
        label: "Тримати групу охорони напоготові",
        detail:
          "Готові, якщо наблизиться до корпусу; знімає людей з інших завдань через слабкий контакт.",
      },
    ],
  },
  "diver-near-hull": {
    name: "Плавець біля корпусу",
    log: "Сонарний контакт, схожий на плавця, 15 м від корпусу, глибина 3 м.",
    action:
      "Сповістіть охорону і зупиніть підрулювальні пристрої. Плавець так близько може загинути від гвинта — зупиніть механізми до розпізнавання.",
    options: [
      {
        label: "Сповістити охорону і зупинити підрулювальні",
        detail:
          "Плавець так близько може загинути від гвинта — зупиніть механізми до розпізнавання.",
      },
      {
        label: "Підсвітити й окликнути з палуби",
        detail:
          "Може розпізнати відомого водолаза, але не знімає ризик механізмів.",
      },
      {
        label: "Спустити катер на перехоплення",
        detail:
          "Дає очі на плавця; займає час і ставить малий катер на воду.",
      },
    ],
  },
  "uuv-payload": {
    name: "UUV іде до інфраструктури",
    log: "Підводний контакт на прямому курсі до корпусу/причалу, небіологічна сигнатура.",
    action:
      "Негайна ескалація до Support Center. Евакуюйте несуттєвий персонал із ураженої зони.",
  },
  "gps-spoofing": {
    name: "Підміна GPS",
    log: "Заявлена позиція GPS розходиться з радіолокаційною на 340 м.",
    action:
      "Звірте радар і візуал. Не кермуйте лише за GPS, доки не пояснено зміщення 340 м.",
    options: [
      {
        label: "Звірити радар і візуал",
        detail: "Не кермуйте лише за GPS, доки не пояснено зміщення 340 м.",
      },
      {
        label: "Перейти на резервне джерело позиції",
        detail:
          "Відсікає поганий потік і може зняти частину картографічних накладень, доки не повернетесь.",
      },
      {
        label: "Знизити хід, доки позиції не зійдуться",
        detail: "Дає час розібрати обсервацію ціною плану переходу.",
      },
    ],
  },
  "comms-jamming": {
    name: "Придушення зв’язку",
    log: "Втрата якості satcom і VHF, відповідає активному глушінню в районі.",
    action:
      "Перейдіть на резервний канал зв’язку. Зафіксуйте час і тривалість для розбору після події.",
  },
  "anomalous-rf": {
    name: "Аномальний РЧ-сигнал",
    log: "Виявлено некласифіковане РЧ-випромінювання, пеленг 150, переривчасте.",
    action:
      "Зафіксуйте випромінювання і чекайте. Поодинокий переривчастий сплеск часто нешкідливий; запис буде, якщо повториться.",
    options: [
      {
        label: "Зафіксувати випромінювання і чекати",
        detail:
          "Поодинокий переривчастий сплеск часто нешкідливий; запис буде, якщо повториться.",
      },
      {
        label: "Розширити сканування спектра",
        detail: "Раніше ловить другий сплеск ціною уваги оператора.",
      },
      {
        label: "Порівняти з близьким трафіком",
        detail:
          "Може пояснити сплеск як відоме судно або витратити час на разовий випадок.",
      },
    ],
  },
  "network-intrusion": {
    name: "Спроба вторгнення в бортову мережу",
    log: "Незвичні спроби автентифікації в мережі судна з нерозпізнаного пристрою.",
    action:
      "Ізолюйте уражений сегмент. Зупиняє поширення, доки ІТ / Support Center перевіряють нерозпізнаний пристрій.",
    options: [
      {
        label: "Ізолювати уражений сегмент",
        detail:
          "Зупиняє поширення, доки ІТ / Support Center перевіряють нерозпізнаний пристрій.",
      },
      {
        label: "Блокувати всі нові підключення пристроїв",
        detail:
          "Зупиняє нападника і блокує законний запасний ноутбук.",
      },
      {
        label: "Прибрати лише підозрілий пристрій",
        detail:
          "Менше збою, якщо ви вже знаєте який — ризик, якщо вгадаєте неправильно.",
      },
    ],
  },
  "perimeter-breach": {
    name: "Порушення периметра",
    log: "Спрацював датчик руху, лінія огорожі сектор 4; уповноваженого персоналу в зоні не зафіксовано.",
    action:
      "Вишліть найближчий патруль, відкрийте камери. Поставте очі на сектор 4, перш ніж хтось піде вздовж огорожі всліпу.",
    options: [
      {
        label: "Вислати найближчий патруль, відкрити камери",
        detail:
          "Поставте очі на сектор 4, перш ніж хтось піде вздовж огорожі всліпу.",
      },
      {
        label: "Закрити лише суміжні ворота",
        detail:
          "Локалізує сектор і може замкнути законного працівника не з того боку.",
      },
      {
        label: "Зупинити весь рух майданчиком",
        detail:
          "Максимальний контроль при одному спрацюванні огорожі; сильний збій звичайної роботи.",
      },
    ],
  },
  "unauthorized-vehicle": {
    name: "Несанкціонований транспорт на КПП",
    log: "Транспорт біля воріт 2 без зареєстрованої перепустки.",
    action:
      "Утримайте на КПП і перевірте. Входу немає, доки водія і транспорт не розпізнано.",
    options: [
      {
        label: "Утримати на КПП і перевірити",
        detail: "Входу немає, доки водія і транспорт не розпізнано.",
      },
      {
        label: "Відмовити і розвернути транспорт",
        detail:
          "Найшвидше закриття, якщо їм тут нічого робити; помилка, якщо це очікуваний гість.",
      },
      {
        label: "Спочатку зателефонувати зазначеному запрошувачу",
        detail: "Допомагає, коли посилаються на зустріч; додає затримку біля воріт.",
      },
    ],
  },
  tailgating: {
    name: "Прохід слідом у точці доступу",
    log: "Виявлено двох, що пройшли через точку доступу з однією перепусткою.",
    action:
      "Перегляньте камеру, підтвердіть другу особу. Найчастіше це гості або колеги — перевірте, перш ніж жорстко зупиняти.",
    options: [
      {
        label: "Переглянути камеру, підтвердити другу особу",
        detail:
          "Найчастіше це гості або колеги — перевірте, перш ніж жорстко зупиняти.",
      },
      {
        label: "Окликнути обох зараз",
        detail:
          "Негайний контроль, і може збентежити того, хто був уповноважений.",
      },
      {
        label: "Зупинити цикл дверей",
        detail:
          "Перешкоджає третьому входу, але ставить чергу за цією точкою доступу.",
      },
    ],
  },
  "unattended-object": {
    name: "Бездоглядний предмет",
    log: "Предмет у контрольованій зоні понад 20 хвилин, пов’язаного персоналу немає.",
    action:
      "Повідомте керівника охорони, не наближайтесь. Тримайте людей осторонь, доки кваліфікована людина не огляне.",
    options: [
      {
        label: "Повідомити керівника охорони, не наближатись",
        detail:
          "Тримайте людей осторонь, доки кваліфікована людина не огляне.",
      },
      {
        label: "Ізолювати зону і чекати",
        detail:
          "Та сама обережність із ширшим кордоном — більше збою, якщо це забутий інвентар.",
      },
      {
        label: "Запитати в найближчих, чи не вони залишили",
        detail: "Швидке розв’язання, коли це їхнє; помилка, якщо ні.",
      },
    ],
  },
  "multi-domain-event": {
    name: "Одночасна подія в кількох середовищах",
    log: "Одночасні контакти: повітряний БПЛА (пеленг 090) і нерозпізнане надводне судно (пеленг 140).",
    action:
      "Це подія в кількох середовищах — негайно ескалюйте в режим кризи, з повною роботою Support Center.",
  },
  "support-center-lost": {
    name: "Зв’язок із Support Center втрачено",
    log: "Супутниковий канал до Support Center втрачено, 3 невдалі спроби відновити.",
    action:
      "Перейдіть на резервний протокол зв’язку. Продовжуйте місцеве спостереження і журнал, доки канал не відновиться.",
  },
  "special-event-mode": {
    name: "Режим особливої події / VIP",
    log: "Режим особливої події активний — тимчасове підлаштування профілю ризику через підвищену присутність гостей.",
    action:
      "Перегляньте контакти Attention вручну. Чутливість уже підвищена; людська перевірка уникає хибного кроку під час події.",
    options: [
      {
        label: "Переглянути контакти Attention вручну",
        detail:
          "Чутливість уже підвищена; людська перевірка уникає хибного кроку під час події.",
      },
      {
        label: "Стиснути зону виключення",
        detail:
          "Безпечніше для гостей; більше хибних тривог і більше тертя на периметрі.",
      },
      {
        label: "Додати другого вахтового",
        detail:
          "Краще покриття події ціною ще однієї людини на вахті.",
      },
    ],
  },
};

const ar: Record<ScenarioId, ScenarioCopy> = {
  "recon-drone": {
    name: "طائرة مسيرة للاستطلاع",
    log: "طائرة مسيرة غير محددة تحافظ على موقعها على بعد 200 م عن العارضة اليمنى، مزوّدة بكاميرا، دون إشارة مشغّل مسجّلة.",
    action:
      "أبقِ التتبع البصري. لا تفقدها من النظر وسجّل المرور؛ لا تستجوبها إلا إذا دخلت منطقة الاستبعاد البالغة 100 م.",
    options: [
      {
        label: "إبقاء التتبع البصري",
        detail:
          "لا تفقدها من النظر وسجّل المرور؛ لا تستجوبها إلا إذا دخلت منطقة الاستبعاد البالغة 100 م.",
      },
      {
        label: "المناداة الآن عبر مكبر الصوت",
        detail:
          "استجواب أسرع إذا كان المشغّل قريباً، لكنك أعلنت أنك لاحظتها.",
      },
      {
        label: "طلب التحديد من Support Center",
        detail:
          "مفيد إذا بقيت في موقعها؛ أبطأ من مراقبة بصرية محلية.",
      },
    ],
  },
  "payload-drone": {
    name: "طائرة مسيرة تحمل حمولة",
    log: "طائرة مسيرة في اقتراب مباشر؛ ملف الطيران يتوافق مع تسليم حمولة.",
    action:
      "نبّه جميع الأفراد لإخلاء مناطق السطح. اتصل بـ Support Center فوراً. لا تقترب من المركبة الجوية.",
  },
  "drone-swarm": {
    name: "سرب طائرات مسيرة",
    log: "اكتُشف 6 أهداف لطائرات مسيرة في تشكيل منسّق، تتقارب من السمت 090.",
    action:
      "صعّد إلى Support Center فوراً — عدة أهداف متزامنة تتجاوز قدرة استجابة مشغّل واحد.",
  },
  "loitering-drone": {
    name: "طائرة مسيرة محلّقة في المكان",
    log: "طائرة مسيرة تحافظ على موقع ثابت منذ 14 دقيقة، الارتفاع 80 م، السمت 270.",
    action:
      "سجّل الموقع وأبقِ المراقبة. دوّن السمت والارتفاع والمدة؛ أعد التقييم بعد 30 دقيقة أو إذا هبطت.",
    options: [
      {
        label: "تسجيل الموقع وإبقاء المراقبة",
        detail:
          "دوّن السمت والارتفاع والمدة؛ أعد التقييم بعد 30 دقيقة أو إذا هبطت.",
      },
      {
        label: "الاستجواب عبر مكبر الصوت",
        detail: "قد يُنهي التحليق في المكان أبكر، مقابل كشف وجود المراقبة.",
      },
      {
        label: "توسيع تغطية الترددات الراديوية والكاميرات",
        detail:
          "فرصة أفضل لإيجاد مشغّل قريب؛ انتباه إضافي لهدف ساكن.",
      },
    ],
  },
  "converging-vessel": {
    name: "سفينة غير محددة تتقارب",
    log: "هدف غير محدد يقترب بسرعة 8 kn على سمت يشبه الاعتراض؛ لا رد AIS بعد محاولتين.",
    action:
      "نادِ على VHF ch.16. اتصال مباشر، أسرع حل إذا كانت السفينة تراقب اللاسلكي.",
    options: [
      {
        label: "المناداة على VHF ch.16",
        detail:
          "اتصال مباشر، أسرع حل إذا كانت السفينة تراقب اللاسلكي.",
      },
      {
        label: "زيادة المراقبة فقط",
        detail:
          "أقل إعاقة، لكنه يؤخر التحديد إذا لم يستجب الهدف لإشارات أخرى.",
      },
      {
        label: "تغيير المسار استباقياً",
        detail: "يزيل الخطر فوراً، مقابل المسار المخطط.",
      },
    ],
  },
  "vessel-no-ais": {
    name: "سفينة بلا AIS على المرسى",
    log: "سفينة في منطقة المرسى منذ 40 دقيقة، لم يُكتشف جهاز إرسال AIS.",
    action:
      "واصل المراقبة. الأهداف الثابتة بلا AIS شائعة في المرسى؛ انتظر ساعة قبل التصعيد.",
    options: [
      {
        label: "مواصلة المراقبة",
        detail:
          "الأهداف الثابتة بلا AIS شائعة في المرسى؛ انتظر ساعة قبل التصعيد.",
      },
      {
        label: "المناداة الآن عبر VHF",
        detail:
          "تحديد أسرع، لكنه يشغل النوبة لسفينة لا تتحرك.",
      },
      {
        label: "إرسال زورق للتحقق",
        detail: "يؤكد الهوية مقابل زورق وطاقم ووقت.",
      },
    ],
  },
  "usv-swarm": {
    name: "سرب مركبات سطحية غير مأهولة",
    log: "4 أهداف سطحية صغيرة، بلا AIS، تتحرك بنمط منسّق بسرعة 18 عقدة.",
    action:
      "هذا النمط يتوافق مع اقتراب منسّق. صعّد فوراً واستعد لمناورة تفادٍ.",
  },
  "critical-closing-speed": {
    name: "سرعة اقتراب حرجة",
    log: "هدف يقترب بسرعة 22 عقدة؛ أقرب نقطة اقتراب أقل من 50 م خلال 3 دقائق.",
    action: "أطلق البوق، غيّر المسار فوراً، أبلغ Support Center.",
  },
  "man-overboard": {
    name: "رجل في البحر",
    log: "مستشعر المحيط وتقرير الطاقم يشيران إلى شخص في الماء، الجانب الأيسر.",
    action:
      "نفّذ بروتوكول رجل في البحر فوراً. علّم الموقع. الجميع إلى المحطات المعيّنة.",
  },
  "stealth-uuv": {
    name: "طائرة مسيرة تحت الماء خفية",
    log: "هدف صوتي ضعيف، السمت 200، التصنيف غير مؤكد — يُحتمل أنه UUV، ثقة منخفضة.",
    action:
      "واصل المراقبة السلبية. يتجنب إنارة عمود الماء حتى تأكيد الهدف.",
    options: [
      {
        label: "مواصلة المراقبة السلبية",
        detail: "يتجنب إنارة عمود الماء حتى تأكيد الهدف.",
      },
      {
        label: "تشغيل السونار النشط",
        detail:
          "تصنيف أفضل، لكنه يعلن عن مستشعراتك وقد يحجب أهدافاً أخرى.",
      },
      {
        label: "إبقاء فريق الأمن جاهزاً",
        detail:
          "جاهزون إذا اقترب من الهيكل؛ يسحب أشخاصاً من مهام أخرى لهدف ضعيف.",
      },
    ],
  },
  "diver-near-hull": {
    name: "غواص قرب الهيكل",
    log: "هدف سونار يتوافق مع سباح، على بعد 15 م من الهيكل، العمق 3 م.",
    action:
      "نبّه الأمن وأوقف الدافعات. سباح بهذا القرب قد يُقتل بمروحة — أوقف الآلات حتى التحديد.",
    options: [
      {
        label: "تنبيه الأمن وإيقاف الدافعات",
        detail:
          "سباح بهذا القرب قد يُقتل بمروحة — أوقف الآلات حتى التحديد.",
      },
      {
        label: "الإضاءة والمناداة من السطح",
        detail:
          "قد يحدد غواصاً معروفاً، لكنه لا يزيل خطر الآلات.",
      },
      {
        label: "إنزال زورق للاعتراض",
        detail:
          "يضع أعيناً على السباح؛ يستغرق وقتاً ويضع قارباً صغيراً في الماء.",
      },
    ],
  },
  "uuv-payload": {
    name: "UUV يقترب من البنية",
    log: "هدف تحت الماء في اقتراب مباشر من الهيكل/الرصيف، بصمة غير بيولوجية.",
    action:
      "تصعيد فوري إلى Support Center. أخلِ غير الضروري من المنطقة المتأثرة.",
  },
  "gps-spoofing": {
    name: "تزييف GPS",
    log: "موقع GPS المبلّغ عنه يختلف بمقدار 340 م عن الموقع المستمد من الرادار.",
    action:
      "قارن الرادار والرؤية. لا توجّه بالـ GPS وحده حتى يُفسَّر الانحراف البالغ 340 م.",
    options: [
      {
        label: "مقارنة الرادار والرؤية",
        detail:
          "لا توجّه بالـ GPS وحده حتى يُفسَّر الانحراف البالغ 340 م.",
      },
      {
        label: "التبديل إلى مصدر الموقع الاحتياطي",
        detail:
          "يعزل تغذية سيئة، وقد يُسقط بعض طبقات الخريطة حتى تعود.",
      },
      {
        label: "خفض السرعة حتى تتوافق المواقع",
        detail: "يكسب وقتاً لفرز التثبيت، مقابل خطة العبور.",
      },
    ],
  },
  "comms-jamming": {
    name: "تشويش الاتصالات",
    log: "فقدان جودة satcom وVHF، يتوافق مع تشويش نشط في المنطقة.",
    action:
      "انتقل إلى قناة الاتصال الاحتياطية. سجّل الوقت والمدة للتحليل بعد الحدث.",
  },
  "anomalous-rf": {
    name: "إشارة ترددات راديوية شاذة",
    log: "اكتُشف بث ترددات راديوية غير مصنّف، السمت 150، متقطع.",
    action:
      "سجّل البث وانتظر. نبضة متقطعة واحدة غالباً حميدة؛ لديك سجل إن تكررت.",
    options: [
      {
        label: "تسجيل البث والانتظار",
        detail:
          "نبضة متقطعة واحدة غالباً حميدة؛ لديك سجل إن تكررت.",
      },
      {
        label: "توسيع مسح الطيف",
        detail: "يلتقط نبضة ثانية أبكر، مقابل انتباه المشغّل.",
      },
      {
        label: "المقارنة مع الحركة القريبة",
        detail:
          "قد تفسّر النبضة كسفينة معروفة، أو تضيّع وقتاً على حالة لمرة واحدة.",
      },
    ],
  },
  "network-intrusion": {
    name: "محاولة اختراق لشبكة السفينة",
    log: "محاولات مصادقة غير معتادة على شبكة السفينة من جهاز غير معروف.",
    action:
      "اعزل الجزء المتأثر. يوقف الانتشار بينما يراجع قسم تقنية المعلومات / Support Center الجهاز غير المعروف.",
    options: [
      {
        label: "عزل الجزء المتأثر",
        detail:
          "يوقف الانتشار بينما يراجع قسم تقنية المعلومات / Support Center الجهاز غير المعروف.",
      },
      {
        label: "حظر كل انضمامات الأجهزة الجديدة",
        detail:
          "يوقف المهاجم ويحظر أيضاً حاسوباً محمولاً احتياطياً شرعياً.",
      },
      {
        label: "إزالة الجهاز المشتبه به فقط",
        detail:
          "إعاقة أصغر إذا كنت تعرف الجهاز مسبقاً — خطر إن خمّنت خطأ.",
      },
    ],
  },
  "perimeter-breach": {
    name: "اختراق المحيط",
    log: "تفعيل مستشعر حركة، قطاع 4 من خط السياج، لا أفراد مصرّح لهم مسجّلون في المنطقة.",
    action:
      "أرسل أقرب دورية، افتح الكاميرات. ضع أعيناً على القطاع 4 قبل أن يسير أحد على خط السياج على عمى.",
    options: [
      {
        label: "إرسال أقرب دورية وفتح الكاميرات",
        detail:
          "ضع أعيناً على القطاع 4 قبل أن يسير أحد على خط السياج على عمى.",
      },
      {
        label: "إغلاق البوابات المجاورة فقط",
        detail:
          "يحصر القطاع، وقد يحبس عاملاً شرعياً في الجانب الخطأ.",
      },
      {
        label: "إيقاف كل حركة في الموقع",
        detail:
          "أقصى ضبط لضربة سياج واحدة؛ إعاقة عالية للعمل المعتاد.",
      },
    ],
  },
  "unauthorized-vehicle": {
    name: "مركبة غير مصرّح بها عند نقطة التفتيش",
    log: "مركبة عند البوابة 2 دون اعتماد وصول مسجّل.",
    action:
      "أوقفها عند نقطة التفتيش وتحقق. لا دخول حتى تحديد السائق والمركبة.",
    options: [
      {
        label: "الإيقاف عند نقطة التفتيش والتحقق",
        detail: "لا دخول حتى تحديد السائق والمركبة.",
      },
      {
        label: "الرفض وإرجاع المركبة",
        detail:
          "أسرع إغلاق إن لم يكن لهم شأن هنا؛ خطأ إن كانوا ضيفاً متوقعاً.",
      },
      {
        label: "الاتصال أولاً بالراعي المذكور",
        detail: "يفيد عندما يدّعون موعداً؛ يضيف تأخيراً عند البوابة.",
      },
    ],
  },
  tailgating: {
    name: "المرور خلفاً عند نقطة الوصول",
    log: "اكتُشف شخصان يعبران نقطة وصول بشارة واحدة.",
    action:
      "راجع الكاميرا، أكّد الشخص الثاني. معظم من يتبعون هم ضيوف أو زملاء — تحقق قبل وقف قاسٍ.",
    options: [
      {
        label: "مراجعة الكاميرا وتأكيد الشخص الثاني",
        detail:
          "معظم من يتبعون هم ضيوف أو زملاء — تحقق قبل وقف قاسٍ.",
      },
      {
        label: "استجواب الشخصين الآن",
        detail:
          "ضبط فوري، وقد يُحرج شخصاً كان مصرّحاً له.",
      },
      {
        label: "إيقاف دورة الباب",
        detail:
          "يمنع دخولاً ثالثاً، لكنه يكدّس الجميع خلف نقطة الوصول تلك.",
      },
    ],
  },
  "unattended-object": {
    name: "جسم بلا مراقبة",
    log: "اكتُشف جسم في منطقة محكومة لأكثر من 20 دقيقة، دون أفراد مرتبطين.",
    action:
      "أبلغ مسؤول الأمن، لا تقترب. أبقِ الناس بعيدين حتى ينظر إليه شخص مؤهّل.",
    options: [
      {
        label: "إبلاغ مسؤول الأمن وعدم الاقتراب",
        detail: "أبقِ الناس بعيدين حتى ينظر إليه شخص مؤهّل.",
      },
      {
        label: "عزل المنطقة والانتظار",
        detail:
          "الحذر نفسه بحزام أوسع — إعاقة أكبر إن كان معدات منسية.",
      },
      {
        label: "سؤال العاملين القريبين إن تركوه",
        detail: "حل سريع عندما يكون لهم، خطأ إن لم يكن.",
      },
    ],
  },
  "multi-domain-event": {
    name: "حدث متزامن متعدد المجالات",
    log: "أهداف متزامنة: طائرة مسيرة جوية (السمت 090) وسفينة سطحية غير محددة (السمت 140).",
    action:
      "هذا حدث متعدد المجالات — صعّد فوراً إلى وضع الأزمة، مع مشاركة كاملة من Support Center.",
  },
  "support-center-lost": {
    name: "فقدان الاتصال بـ Support Center",
    log: "فُقد رابط satcom إلى Support Center، 3 محاولات إعادة اتصال فاشلة.",
    action:
      "انتقل إلى بروتوكول الاتصال الاحتياطي. واصل المراقبة والتسجيل المحليين حتى استعادة الرابط.",
  },
  "special-event-mode": {
    name: "وضع حدث خاص / كبار الشخصيات",
    log: "وضع الحدث الخاص نشط — ضبط مؤقت لملف المخاطر بسبب حضور ضيوف مرتفع.",
    action:
      "راجع أهداف Attention يدوياً. الحساسية مرفوعة أصلاً؛ فحص بشري يتجنب حركة خاطئة أثناء الحدث.",
    options: [
      {
        label: "مراجعة أهداف Attention يدوياً",
        detail:
          "الحساسية مرفوعة أصلاً؛ فحص بشري يتجنب حركة خاطئة أثناء الحدث.",
      },
      {
        label: "تضييق منطقة الاستبعاد",
        detail:
          "أكثر أماناً للضيوف؛ مزيد من الإنذارات الكاذبة ومزيد من الاحتكاك عند المحيط.",
      },
      {
        label: "إضافة مراقب ثانٍ للنوبة",
        detail:
          "تغطية أفضل للحدث، مقابل شخص إضافي في النوبة.",
      },
    ],
  },
};

const zh: Record<ScenarioId, ScenarioCopy> = {
  "recon-drone": {
    name: "侦察无人机",
    log: "未识别无人机在右舷正横 200 m 处悬停，带摄像头，无登记操控员信号。",
    action:
      "保持目视跟踪。盯住它并记录这次经过；仅当其进入 100 m 禁区时再质询。",
    options: [
      {
        label: "保持目视跟踪",
        detail: "盯住它并记录这次经过；仅当其进入 100 m 禁区时再质询。",
      },
      {
        label: "立即用扩音器呼叫",
        detail: "若附近有操控员则质询更快，但等于公开你已发现它。",
      },
      {
        label: "请 Support Center 识别",
        detail: "若它继续留在原位则有用；比本地目视值班更慢。",
      },
    ],
  },
  "payload-drone": {
    name: "载荷无人机",
    log: "无人机沿直线向内接近，飞行剖面符合投放载荷。",
    action: "警报全体人员清空甲板区域。立即联系 Support Center。不要靠近该航空器。",
  },
  "drone-swarm": {
    name: "无人机集群",
    log: "探测到 6 个无人机目标呈协同队形，从方位 090 会合。",
    action: "立即升级至 Support Center — 多个同时目标超出单人操作员的应对能力。",
  },
  "loitering-drone": {
    name: "徘徊无人机",
    log: "无人机固定位置已 14 分钟，高度 80 m，方位 270。",
    action: "记录位置并保持监视。记下方位、高度和持续时间；30 分钟后或若下降再评估。",
    options: [
      {
        label: "记录位置并保持监视",
        detail: "记下方位、高度和持续时间；30 分钟后或若下降再评估。",
      },
      {
        label: "用扩音器质询",
        detail: "可能更快结束徘徊，代价是暴露值班。",
      },
      {
        label: "扩大射频与摄像头覆盖",
        detail: "更有机会找到附近操控员；对静止目标需额外注意力。",
      },
    ],
  },
  "converging-vessel": {
    name: "会合中的未识别船舶",
    log: "未识别目标以 8 kn 沿近似拦截方位接近，两次尝试后无 AIS 应答。",
    action: "在 VHF ch.16 呼叫。直接联络；若对方在守听则解决最快。",
    options: [
      {
        label: "在 VHF ch.16 呼叫",
        detail: "直接联络；若对方在守听则解决最快。",
      },
      {
        label: "仅加强值班",
        detail: "干扰较少，但若目标对其它线索无反应会推迟识别。",
      },
      {
        label: "预先改向",
        detail: "立即消除风险，代价是原计划航线。",
      },
    ],
  },
  "vessel-no-ais": {
    name: "锚泊且无 AIS 的船舶",
    log: "船舶在锚地已 40 分钟，未探测到 AIS 应答器。",
    action: "继续监视。锚地中无 AIS 的静止目标很常见；升级前先等一小时。",
    options: [
      {
        label: "继续监视",
        detail: "锚地中无 AIS 的静止目标很常见；升级前先等一小时。",
      },
      {
        label: "立即用 VHF 呼叫",
        detail: "识别更快，但会占用值班去处理一艘未移动的船。",
      },
      {
        label: "派艇查探",
        detail: "能确认身份，代价是一艘艇、一组人员和时间。",
      },
    ],
  },
  "usv-swarm": {
    name: "无人水面艇集群",
    log: "4 个小型水面目标，无 AIS，以 18 节按协同模式运动。",
    action: "该模式符合协同接近。立即升级并准备规避机动。",
  },
  "critical-closing-speed": {
    name: "临界接近速度",
    log: "目标以 22 节接近，最近会遇点 3 分钟内小于 50 m。",
    action: "鸣笛，立即改向，通知 Support Center。",
  },
  "man-overboard": {
    name: "落水人员",
    log: "周界传感器和船员报告显示左舷有人落水。",
    action: "立即执行落水人员规程。标定位置。全员前往指定岗位。",
  },
  "stealth-uuv": {
    name: "隐蔽水下无人机",
    log: "微弱声学目标，方位 200，分类不确定 — 可能是 UUV，置信度低。",
    action: "继续被动监视。在确认目标前避免点亮水柱。",
    options: [
      {
        label: "继续被动监视",
        detail: "在确认目标前避免点亮水柱。",
      },
      {
        label: "改为主动声呐",
        detail: "分类更好，但会暴露传感器，并可能掩盖其它目标。",
      },
      {
        label: "让安保队待命",
        detail: "若逼近船体则有准备；为微弱目标抽调其它岗位人员。",
      },
    ],
  },
  "diver-near-hull": {
    name: "船体附近的潜水员",
    log: "声呐目标符合游泳者，距船体 15 m，深度 3 m。",
    action: "警报安保并冻结推进器。如此近的游泳者可能被螺旋桨致死 — 识别前停止机械。",
    options: [
      {
        label: "警报安保并冻结推进器",
        detail: "如此近的游泳者可能被螺旋桨致死 — 识别前停止机械。",
      },
      {
        label: "从甲板照明并呼叫",
        detail: "可能认出已知潜水员，但不能消除机械风险。",
      },
      {
        label: "放艇拦截",
        detail: "能看清游泳者，费时并要把小艇放入水中。",
      },
    ],
  },
  "uuv-payload": {
    name: "UUV 接近基础设施",
    log: "水下目标直线接近船体/码头结构，非生物特征。",
    action: "立即升级至 Support Center。从受影响区域撤离非必要人员。",
  },
  "gps-spoofing": {
    name: "GPS 欺骗",
    log: "报告的 GPS 位置与雷达推算位置相差 340 m。",
    action: "交叉核对雷达与目视。在解释 340 m 偏差前，不要仅凭 GPS 操舵。",
    options: [
      {
        label: "交叉核对雷达与目视",
        detail: "在解释 340 m 偏差前，不要仅凭 GPS 操舵。",
      },
      {
        label: "切换到备用位置源",
        detail: "隔离错误馈入，切回前可能丢掉部分海图叠加。",
      },
      {
        label: "减速直至位置一致",
        detail: "换取时间理清定位，代价是航次计划。",
      },
    ],
  },
  "comms-jamming": {
    name: "通信干扰",
    log: "satcom 与 VHF 信号质量丧失，符合该区域主动干扰。",
    action: "切换到备用通信信道。记录时间和时长，供事后分析。",
  },
  "anomalous-rf": {
    name: "异常射频信号",
    log: "探测到未分类射频发射，方位 150，间歇出现。",
    action: "记录该发射并等待。单次间歇突发往往无害；若重复则已有记录。",
    options: [
      {
        label: "记录该发射并等待",
        detail: "单次间歇突发往往无害；若重复则已有记录。",
      },
      {
        label: "扩大频谱扫描",
        detail: "能更早捕捉第二次突发，代价是操作员注意力。",
      },
      {
        label: "与附近交通比对",
        detail: "可能把突发解释为已知船舶，或把时间耗在一次性事件上。",
      },
    ],
  },
  "network-intrusion": {
    name: "船上网络入侵企图",
    log: "船舶网络上来自未识别设备的异常认证尝试。",
    action: "隔离受影响网段。在 IT / Support Center 审查该未识别设备期间阻止扩散。",
    options: [
      {
        label: "隔离受影响网段",
        detail: "在 IT / Support Center 审查该未识别设备期间阻止扩散。",
      },
      {
        label: "阻止所有新设备加入",
        detail: "拦住攻击者，也会挡住一台合法备用笔记本电脑。",
      },
      {
        label: "仅移除可疑设备",
        detail: "若已知道是哪台则扰动较小 — 猜错则有风险。",
      },
    ],
  },
  "perimeter-breach": {
    name: "周界突破",
    log: "运动传感器触发，围栏线第 4 扇区，该区域无已登记授权人员。",
    action: "派出最近巡逻、打开摄像头。先看清第 4 扇区，再派人盲目沿围栏走。",
    options: [
      {
        label: "派出最近巡逻、打开摄像头",
        detail: "先看清第 4 扇区，再派人盲目沿围栏走。",
      },
      {
        label: "仅锁相邻大门",
        detail: "能封住该扇区，也可能把合法工作人员堵在错误一侧。",
      },
      {
        label: "停止场地内一切移动",
        detail: "对单次围栏触发的最大控制，对正常工作干扰很大。",
      },
    ],
  },
  "unauthorized-vehicle": {
    name: "检查点的未授权车辆",
    log: "2 号门有车辆，无登记准入凭证。",
    action: "在检查点拦下并核验。在确认司机和车辆前不得进入。",
    options: [
      {
        label: "在检查点拦下并核验",
        detail: "在确认司机和车辆前不得进入。",
      },
      {
        label: "拒绝并让车辆掉头",
        detail: "若他们在此无事则最快结束；若是预约来宾则判断错误。",
      },
      {
        label: "先联系所列邀请人",
        detail: "在声称有预约时有帮助；会在门口增加延误。",
      },
    ],
  },
  tailgating: {
    name: "准入点尾随进入",
    log: "检测到两人通过单凭证准入点。",
    action: "查看摄像头，确认第二人。多数尾随是客人或同事 — 硬性拦截前先核对。",
    options: [
      {
        label: "查看摄像头，确认第二人",
        detail: "多数尾随是客人或同事 — 硬性拦截前先核对。",
      },
      {
        label: "立即质询两人",
        detail: "立即控制，也可能让本已获授权的人难堪。",
      },
      {
        label: "暂停门循环",
        detail: "阻止第三人进入，但会在该准入点后排队。",
      },
    ],
  },
  "unattended-object": {
    name: "无人看管物品",
    log: "受控区内探测到物品超过 20 分钟，无相关人员。",
    action: "通知安保负责人，不要靠近。在合格人员查看前让人远离。",
    options: [
      {
        label: "通知安保负责人，不要靠近",
        detail: "在合格人员查看前让人远离。",
      },
      {
        label: "隔离该区域并等待",
        detail: "同样谨慎但警戒圈更宽 — 若是遗忘器材则干扰更大。",
      },
      {
        label: "询问附近工作人员是否留下",
        detail: "若是他们的则解决很快；若不是则判断错误。",
      },
    ],
  },
  "multi-domain-event": {
    name: "多域同时事件",
    log: "同时目标：空中无人机（方位 090）和未识别水面船舶（方位 140）。",
    action: "这是多域事件 — 立即升级至危机模式，全面接入 Support Center。",
  },
  "support-center-lost": {
    name: "与 Support Center 的连接中断",
    log: "通往 Support Center 的 satcom 链路中断，3 次重连失败。",
    action: "切换到备用通信规程。继续本地监视与记录，直至链路恢复。",
  },
  "special-event-mode": {
    name: "特别活动 / 要客模式",
    log: "特别活动模式已启用 — 因宾客增多而临时调整风险画像。",
    action: "手工复核 Attention 级目标。灵敏度已经提高；人工核对可避免活动期间误动。",
    options: [
      {
        label: "手工复核 Attention 级目标",
        detail: "灵敏度已经提高；人工核对可避免活动期间误动。",
      },
      {
        label: "收紧禁区",
        detail: "对宾客更安全；更多误报，周界摩擦也更大。",
      },
      {
        label: "增加第二名值班员",
        detail: "活动覆盖更好，代价是值班再多一人。",
      },
    ],
  },
};

const ja: Record<ScenarioId, ScenarioCopy> = {
  "recon-drone": {
    name: "偵察ドローン",
    log: "未識別の UAV が右舷正横 200 m で位置を保持。カメラ搭載、登録された操縦者信号なし。",
    action:
      "目視追尾を維持。見失わず通過を記録し、100 m の除外区域に入ったときだけ問いかけよ。",
    options: [
      {
        label: "目視追尾を維持",
        detail: "見失わず通過を記録し、100 m の除外区域に入ったときだけ問いかけよ。",
      },
      {
        label: "今すぐ拡声器で呼びかけ",
        detail: "操縦者が近くにいれば早いが、気づいたことを知らせることになる。",
      },
      {
        label: "Support Center に識別を依頼",
        detail: "その場に留まるなら有用。現地の目視当直より遅い。",
      },
    ],
  },
  "payload-drone": {
    name: "搭載物のあるドローン",
    log: "UAV が直接接近中。飛行プロファイルは搭載物の投下と一致。",
    action:
      "全員に甲板区域の退避を警報せよ。直ちに Support Center へ連絡。機体に近づくな。",
  },
  "drone-swarm": {
    name: "ドローン群",
    log: "協調隊形の UAV 目標 6 件を探知。方位 090 から収れん。",
    action:
      "直ちに Support Center へエスカレーション — 同時複数目標は単独操作員の対応能力を超える。",
  },
  "loitering-drone": {
    name: "滞空ドローン",
    log: "UAV が 14 分間、固定位置を保持。高度 80 m、方位 270。",
    action:
      "位置を記録し監視を続けよ。方位・高度・継続時間を残し、30 分後または降下したら再評価。",
    options: [
      {
        label: "位置を記録し監視を続ける",
        detail: "方位・高度・継続時間を残し、30 分後または降下したら再評価。",
      },
      {
        label: "拡声器で問いかけ",
        detail: "滞空を早く終わらせられるが、当直が露見する。",
      },
      {
        label: "RF とカメラの範囲を広げる",
        detail: "近くの操縦者を見つける可能性が上がる。静止目標への注意は増える。",
      },
    ],
  },
  "converging-vessel": {
    name: "収れんする未識別船舶",
    log: "未識別目標が 8 kn で迎撃様の方位に接近。2 回試行後も AIS 応答なし。",
    action: "VHF ch.16 で呼びかけ。直接交信。船舶が無線を守っていれば最速で解決。",
    options: [
      {
        label: "VHF ch.16 で呼びかけ",
        detail: "直接交信。船舶が無線を守っていれば最速で解決。",
      },
      {
        label: "当直を強めるのみ",
        detail: "混乱は少ないが、他の手がかりに反応しなければ識別が遅れる。",
      },
      {
        label: "予防的に変針",
        detail: "リスクは直ちに消えるが、計画航路を犠牲にする。",
      },
    ],
  },
  "vessel-no-ais": {
    name: "AIS なしの錨泊船",
    log: "錨地に 40 分間いる船舶。AIS トランスポンダ未検出。",
    action:
      "監視を継続。錨地では AIS なしの静止目標はよくある。エスカレーション前に 1 時間待て。",
    options: [
      {
        label: "監視を継続",
        detail: "錨地では AIS なしの静止目標はよくある。エスカレーション前に 1 時間待て。",
      },
      {
        label: "今すぐ VHF で呼びかけ",
        detail: "識別は早いが、動いていない船のために当直を占有する。",
      },
      {
        label: "調査のため艇を出す",
        detail: "身元は確認できるが、艇・人員・時間の代償がある。",
      },
    ],
  },
  "usv-swarm": {
    name: "無人水上艇の群れ",
    log: "小型水上目標 4 件、AIS なし、18 ノットで協調パターン移動。",
    action: "このパターンは協調接近と一致。直ちにエスカレーションし、回避運動を準備せよ。",
  },
  "critical-closing-speed": {
    name: "臨界接近速度",
    log: "目標が 22 ノットで接近。最接近点は 3 分以内に 50 m 未満。",
    action: "汽笛を鳴らし、直ちに変針し、Support Center に通報せよ。",
  },
  "man-overboard": {
    name: "落水者",
    log: "周辺センサと乗組員の報告で、左舷側の水面に人物。",
    action: "直ちに落水者手順を実行。位置を標定。全員指定配置へ。",
  },
  "stealth-uuv": {
    name: "隠密水中ドローン",
    log: "弱い音響目標、方位 200、分類不確実 — UUV の可能性、確信度低。",
    action: "パッシブ監視を継続。目標確認まで水柱を照らさない。",
    options: [
      {
        label: "パッシブ監視を継続",
        detail: "目標確認まで水柱を照らさない。",
      },
      {
        label: "ソナーをアクティブへ",
        detail: "分類は良くなるが、センサが露見し、他目標を覆い隠すことがある。",
      },
      {
        label: "警備班を待機",
        detail: "船体に近づけば即応できる。弱い目標のために他任務から人員を抜く。",
      },
    ],
  },
  "diver-near-hull": {
    name: "船体近くの潜水者",
    log: "泳者に一致するソナー目標。船体から 15 m、深度 3 m。",
    action:
      "警備に警報しスラスタを凍結。これほど近い泳者はプロペラで死亡し得る — 識別まで機械を止めよ。",
    options: [
      {
        label: "警備に警報しスラスタを凍結",
        detail: "これほど近い泳者はプロペラで死亡し得る — 識別まで機械を止めよ。",
      },
      {
        label: "甲板から照射して呼びかけ",
        detail: "既知の潜水者なら識別できるが、機械のリスクは残る。",
      },
      {
        label: "迎撃のため艇を出す",
        detail: "泳者を目視できる。時間を取り、小型艇を水に出す。",
      },
    ],
  },
  "uuv-payload": {
    name: "インフラに接近する UUV",
    log: "水中目標が船体／岸壁構造へ直接接近。非生物シグネチャ。",
    action: "直ちに Support Center へエスカレーション。影響区域から非必須人員を退避させよ。",
  },
  "gps-spoofing": {
    name: "GPS なりすまし",
    log: "報告された GPS 位置がレーダー由来位置と 340 m 不一致。",
    action: "レーダーと目視を照合。340 m のずれが説明できるまで GPS のみで操舵するな。",
    options: [
      {
        label: "レーダーと目視を照合",
        detail: "340 m のずれが説明できるまで GPS のみで操舵するな。",
      },
      {
        label: "予備の位置源へ切り替え",
        detail: "不良フィードを切り離せる。戻すまで一部の海図重ね合わせが落ちることがある。",
      },
      {
        label: "位置が一致するまで減速",
        detail: "測位を整理する時間を稼げるが、航路計画の代償がある。",
      },
    ],
  },
  "comms-jamming": {
    name: "通信妨害",
    log: "satcom と VHF の信号品質喪失。海域の能動妨害と一致。",
    action: "予備通信チャネルへ切り替え。事後分析のため時刻と継続時間を記録せよ。",
  },
  "anomalous-rf": {
    name: "異常 RF 信号",
    log: "未分類の RF 放射を探知。方位 150、間欠。",
    action:
      "放射を記録して待て。単発の間欠バーストはしばしば無害。再発すれば記録が残る。",
    options: [
      {
        label: "放射を記録して待つ",
        detail: "単発の間欠バーストはしばしば無害。再発すれば記録が残る。",
      },
      {
        label: "スペクトル走査を広げる",
        detail: "二回目のバーストをより早く捉える。操作員の注意が代価。",
      },
      {
        label: "付近の交通と比較",
        detail: "既知の船として説明できることも、単発に時間を費やすこともある。",
      },
    ],
  },
  "network-intrusion": {
    name: "船内ネットワーク侵入の試み",
    log: "船舶ネットワーク上で、未認識機器からの異常な認証試行。",
    action:
      "影響セグメントを隔離。IT / Support Center が未認識機器を確認する間、拡散を止める。",
    options: [
      {
        label: "影響セグメントを隔離",
        detail: "IT / Support Center が未認識機器を確認する間、拡散を止める。",
      },
      {
        label: "新規機器の参加をすべて遮断",
        detail: "攻撃者を止めるが、正規の予備ノートも遮断する。",
      },
      {
        label: "疑わしい機器だけ外す",
        detail: "機器が分かっていれば混乱は小さい — 誤認すれば危険。",
      },
    ],
  },
  "perimeter-breach": {
    name: "周辺侵入",
    log: "動きセンサ作動。フェンス線セクター 4。当該区域に許可人員の記録なし。",
    action:
      "最寄りの巡回を出し、カメラを開け。誰かがフェンスを盲目で歩く前にセクター 4 を目視せよ。",
    options: [
      {
        label: "最寄りの巡回を出し、カメラを開ける",
        detail: "誰かがフェンスを盲目で歩く前にセクター 4 を目視せよ。",
      },
      {
        label: "隣接ゲートだけ施錠",
        detail: "セクターを封じるが、正規の作業者を反対側に閉じ込めることがある。",
      },
      {
        label: "敷地内の移動をすべて停止",
        detail: "フェンス一回の最大統制。通常作業への支障は大きい。",
      },
    ],
  },
  "unauthorized-vehicle": {
    name: "検問の無許可車両",
    log: "ゲート 2 に登録された入場証のない車両。",
    action: "検問で止め、確認せよ。運転者と車両が識別されるまで入場させるな。",
    options: [
      {
        label: "検問で止め、確認する",
        detail: "運転者と車両が識別されるまで入場させるな。",
      },
      {
        label: "拒否して車両を引き返させる",
        detail: "用事がなければ最速の終了。予定の来客なら誤り。",
      },
      {
        label: "まず記載の招待者に電話",
        detail: "予約を主張する場合に役立つ。ゲートで遅れが増える。",
      },
    ],
  },
  tailgating: {
    name: "入場点での便乗通過",
    log: "単一バッジの入場点を二人で通過したのを検知。",
    action:
      "カメラを確認し、二人目を確かめよ。便乗の多くは来客か同僚 — 強い制止の前に確認。",
    options: [
      {
        label: "カメラを確認し、二人目を確かめる",
        detail: "便乗の多くは来客か同僚 — 強い制止の前に確認。",
      },
      {
        label: "今すぐ両者に問いかけ",
        detail: "直ちに統制できるが、許可されていた人を辱めることがある。",
      },
      {
        label: "扉サイクルを止める",
        detail: "三人目の入場は止めるが、その入場点の後ろに列ができる。",
      },
    ],
  },
  "unattended-object": {
    name: "放置物",
    log: "管理区域内で 20 分超、関連人員なしの物体を探知。",
    action: "警備責任者に通報し、近づくな。資格ある者が見るまで人を遠ざけよ。",
    options: [
      {
        label: "警備責任者に通報し、近づかない",
        detail: "資格ある者が見るまで人を遠ざけよ。",
      },
      {
        label: "区域を隔離して待つ",
        detail: "同じ慎重さで警戒範囲が広い。置き忘れた器材なら支障は増える。",
      },
      {
        label: "近くの職員に置き忘れていないか尋ねる",
        detail: "本人のものなら早く終わる。そうでなければ誤り。",
      },
    ],
  },
  "multi-domain-event": {
    name: "複数領域の同時事象",
    log: "同時目標：空中 UAV（方位 090）と未識別水上船舶（方位 140）。",
    action:
      "これは複数領域の事象 — 直ちに危機モードへエスカレーションし、Support Center を全面関与させよ。",
  },
  "support-center-lost": {
    name: "Support Center 接続喪失",
    log: "Support Center への satcom 回線喪失。再接続 3 回失敗。",
    action: "予備通信手順へ切り替え。回線復旧まで現地の監視と記録を続けよ。",
  },
  "special-event-mode": {
    name: "特別行事 / VIP モード",
    log: "特別行事モード作動 — 来賓増加に伴う一時的なリスクプロファイル調整。",
    action:
      "Attention 目標を人手で確認。感度は既に上がっている。行事中の誤った動きを人が防ぐ。",
    options: [
      {
        label: "Attention 目標を人手で確認",
        detail: "感度は既に上がっている。行事中の誤った動きを人が防ぐ。",
      },
      {
        label: "除外区域を狭める",
        detail: "来賓には安全。誤警報と周辺の摩擦は増える。",
      },
      {
        label: "当直を一人増やす",
        detail: "行事のカバーは良くなるが、当直がもう一人必要。",
      },
    ],
  },
};

const he: Record<ScenarioId, ScenarioCopy> = {
  "recon-drone": {
    name: "כטב\"ם סיור",
    log: "כטב\"ם לא מזוהה שומר מיקום 200 מ' מקרן ימין, מצויד במצלמה, ללא אות מפעיל רשום.",
    action:
      "שמרו מעקב חזותי. אל תאבדו אותו מהעין ותעדו את המעבר; פנו אליו רק אם ייכנס לאזור ההרחקה של 100 מ'.",
    options: [
      {
        label: "לשמור מעקב חזותי",
        detail:
          "אל תאבדו אותו מהעין ותעדו את המעבר; פנו אליו רק אם ייכנס לאזור ההרחקה של 100 מ'.",
      },
      {
        label: "לקרוא עכשיו ברמקול",
        detail:
          "פנייה מהירה יותר אם המפעיל בקרבת מקום, אך הודעתם ששמתם לב אליו.",
      },
      {
        label: "לבקש מ-Support Center לזהות",
        detail: "שימושי אם הוא נשאר בעמדה; איטי יותר משמירה חזותית מקומית.",
      },
    ],
  },
  "payload-drone": {
    name: "כטב\"ם נושא מטען",
    log: "כטב\"ם בגישה ישירה פנימה; פרופיל הטיסה תואם מסירת מטען.",
    action:
      "התריעו לכל הצוות לפנות אזורי סיפון. צרו קשר עם Support Center מיד. אל תתקרבו לכלי הטיס.",
  },
  "drone-swarm": {
    name: "נחיל כטב\"מים",
    log: "זוהו 6 מגע כטב\"ם במערך מתואם, מתכנסים מנשא 090.",
    action:
      "הסלימו ל-Support Center מיד — מספר מגעים בו-זמניים חורגים מיכולת התגובה של מפעיל יחיד.",
  },
  "loitering-drone": {
    name: "כטב\"ם מרחף במקום",
    log: "כטב\"ם שומר מיקום קבוע 14 דקות, גובה 80 מ', נשא 270.",
    action:
      "תעדו מיקום והמשיכו בשמירה. רשמו נשא, גובה ומשך; העריכו מחדש אחרי 30 דקות או אם יורד.",
    options: [
      {
        label: "לתעד מיקום ולהמשיך בשמירה",
        detail: "רשמו נשא, גובה ומשך; העריכו מחדש אחרי 30 דקות או אם יורד.",
      },
      {
        label: "לפנות ברמקול",
        detail: "עשוי לסיים את הריחוף מוקדם יותר, במחיר חשיפת השמירה.",
      },
      {
        label: "להרחיב כיסוי RF ומצלמות",
        detail: "סיכוי טוב יותר למצוא מפעיל קרוב; תשומת לב נוספת למגע נייח.",
      },
    ],
  },
  "converging-vessel": {
    name: "כלי שיט לא מזוהה שמתכנס",
    log: "מגע לא מזוהה נסגר ב-8 kn בנשא דמוי יירוט; אין מענה AIS אחרי שתי ניסיונות.",
    action:
      "קראו ב-VHF ch.16. קשר ישיר, הפתרון המהיר ביותר אם הכלי מאזין לרדיו.",
    options: [
      {
        label: "לקרוא ב-VHF ch.16",
        detail: "קשר ישיר, הפתרון המהיר ביותר אם הכלי מאזין לרדיו.",
      },
      {
        label: "להגביר שמירה בלבד",
        detail:
          "פחות הפרעה, אך מעכב זיהוי אם המגע אינו מגיב לרמזים אחרים.",
      },
      {
        label: "לשנות נתיב מראש",
        detail: "מסיר את הסיכון מיד, במחיר הנתיב המתוכנן.",
      },
    ],
  },
  "vessel-no-ais": {
    name: "כלי שיט בלי AIS בעגינה",
    log: "כלי שיט באזור העגינה 40 דקות, לא זוהה משדר AIS.",
    action:
      "המשיכו בניטור. מגעים סטטיים בלי AIS נפוצים בעגינה; המתינו שעה לפני הסלמה.",
    options: [
      {
        label: "להמשיך בניטור",
        detail: "מגעים סטטיים בלי AIS נפוצים בעגינה; המתינו שעה לפני הסלמה.",
      },
      {
        label: "לקרוא עכשיו ב-VHF",
        detail: "זיהוי מהיר יותר, אך תופס את המשמרת לכלי שאינו זז.",
      },
      {
        label: "לשגר סירה לבדיקה",
        detail: "מאשר זהות במחיר סירה, צוות וזמן.",
      },
    ],
  },
  "usv-swarm": {
    name: "נחיל כלי שיט עיליים בלתי מאוישים",
    log: "4 מגעים עיליים קטנים, בלי AIS, נעים בדפוס מתואם ב-18 קשר.",
    action:
      "הדפוס תואם התקרבות מתואמת. הסלימו מיד והכינו תמרון התחמקות.",
  },
  "critical-closing-speed": {
    name: "מהירות סגירה קריטית",
    log: "מגע נסגר ב-22 קשר; נקודת ההתקרבות הקרובה ביותר מתחת ל-50 מ' תוך 3 דקות.",
    action: "צפרו בצופר, שנו נתיב מיד, הודיעו ל-Support Center.",
  },
  "man-overboard": {
    name: "אדם בים",
    log: "חיישן היקף ודיווח צוות מעידים על אדם במים, צד שמאל.",
    action:
      "בצעו מיד פרוטוקול אדם בים. סמנו מיקום. כולם לעמדות שהוקצו.",
  },
  "stealth-uuv": {
    name: "רחפן תת-מימי חמקן",
    log: "מגע אקוסטי חלש, נשא 200, סיווג לא ודאי — ייתכן UUV, ביטחון נמוך.",
    action:
      "המשיכו בניטור פסיבי. נמנע מהארת עמוד המים עד לאישור המגע.",
    options: [
      {
        label: "להמשיך בניטור פסיבי",
        detail: "נמנע מהארת עמוד המים עד לאישור המגע.",
      },
      {
        label: "לעבור לסונאר פעיל",
        detail:
          "סיווג טוב יותר, אך מכריז על החיישנים שלכם ועשוי להסוות מגעים אחרים.",
      },
      {
        label: "להעמיד את צוות האבטחה בכוננות",
        detail:
          "מוכנים אם יתקרב לגוף הכלי; מושך אנשים ממשימות אחרות בגלל מגע חלש.",
      },
    ],
  },
  "diver-near-hull": {
    name: "צולל ליד גוף הכלי",
    log: "מגע סונאר התואם שחיין, 15 מ' מגוף הכלי, עומק 3 מ'.",
    action:
      "התריעו לאבטחה והקפיאו מדחפים. שחיין כה קרוב עלול להיהרג ממדחף — עצרו מכונות עד לזיהוי.",
    options: [
      {
        label: "להתריע לאבטחה ולהקפיא מדחפים",
        detail:
          "שחיין כה קרוב עלול להיהרג ממדחף — עצרו מכונות עד לזיהוי.",
      },
      {
        label: "להאיר ולקרוא מהסיפון",
        detail: "עשוי לזהות צולל מוכר, אך אינו מסיר את סיכון המכונות.",
      },
      {
        label: "להוריד סירה ליירוט",
        detail: "שם עיניים על השחיין; לוקח זמן ומכניס סירה קטנה למים.",
      },
    ],
  },
  "uuv-payload": {
    name: "UUV מתקרב לתשתית",
    log: "מגע תת-מימי בגישה ישירה לגוף/מבנה רציף, חתימה לא ביולוגית.",
    action:
      "הסלמה מיידית ל-Support Center. פנו אנשי צוות שאינם חיוניים מהאזור המושפע.",
  },
  "gps-spoofing": {
    name: "זיוף GPS",
    log: "מיקום GPS מדווח אינו תואם את המיקום הנגזר ממכ\"ם ב-340 מ'.",
    action:
      "הצליבו מכ\"ם וראייה. אל תנווטו לפי GPS בלבד עד שהסטייה של 340 מ' תוסבר.",
    options: [
      {
        label: "להצליב מכ\"ם וראייה",
        detail: "אל תנווטו לפי GPS בלבד עד שהסטייה של 340 מ' תוסבר.",
      },
      {
        label: "לעבור למקור מיקום גיבוי",
        detail:
          "מבודד הזנה גרועה, ועשוי להוריד חלק משכבות המפה עד שתחזור.",
      },
      {
        label: "להאט עד שהמיקומים יסכימו",
        detail: "קונה זמן לברר את הקיבעון, במחיר תוכנית המעבר.",
      },
    ],
  },
  "comms-jamming": {
    name: "שיבוש תקשורת",
    log: "אובדן איכות satcom ו-VHF, תואם שיבוש פעיל באזור.",
    action:
      "עברו לערוץ התקשורת הגיבוי. תעדו שעה ומשך לניתוח לאחר האירוע.",
  },
  "anomalous-rf": {
    name: "אות RF חריג",
    log: "זוהתה פליטת RF לא מסווגת, נשא 150, לסירוגין.",
    action:
      "תעדו את הפליטה והמתינו. פרץ לסירוגין יחיד לרוב שפיר; יש לכם תיעוד אם יחזור.",
    options: [
      {
        label: "לתעד את הפליטה ולהמתין",
        detail: "פרץ לסירוגין יחיד לרוב שפיר; יש לכם תיעוד אם יחזור.",
      },
      {
        label: "להרחיב את סריקת הספקטרום",
        detail: "תופס פרץ שני מוקדם יותר, במחיר תשומת לב המפעיל.",
      },
      {
        label: "להשוות לתנועה קרובה",
        detail: "עשוי להסביר את הפרץ ככלי ידוע, או לבזבז זמן על מקרה חד-פעמי.",
      },
    ],
  },
  "network-intrusion": {
    name: "ניסיון חדירה לרשת הספינה",
    log: "ניסיונות אימות חריגים ברשת הכלי ממכשיר לא מוכר.",
    action:
      "בודדו את המקטע המושפע. עוצר התפשטות בזמן ש-IT / Support Center בודקים את המכשיר הלא מוכר.",
    options: [
      {
        label: "לבודד את המקטע המושפע",
        detail:
          "עוצר התפשטות בזמן ש-IT / Support Center בודקים את המכשיר הלא מוכר.",
      },
      {
        label: "לחסום כל הצטרפות מכשירים חדשים",
        detail: "עוצר את התוקף וגם חוסם מחשב נייד חלופי לגיטימי.",
      },
      {
        label: "להסיר רק את המכשיר החשוד",
        detail: "הפרעה קטנה יותר אם כבר יודעים איזה — מסוכן אם מנחשים לא נכון.",
      },
    ],
  },
  "perimeter-breach": {
    name: "פריצת היקף",
    log: "הופעל חיישן תנועה, קו גדר מגזר 4; אין אנשי צוות מורשים רשומים באזור.",
    action:
      "שלחו את הסיור הקרוב, פתחו מצלמות. שימו עיניים על מגזר 4 לפני שמישהו ילך לאורך הגדר בעיניים עצומות.",
    options: [
      {
        label: "לשלוח את הסיור הקרוב, לפתוח מצלמות",
        detail:
          "שימו עיניים על מגזר 4 לפני שמישהו ילך לאורך הגדר בעיניים עצומות.",
      },
      {
        label: "לנעול רק את השערים הסמוכים",
        detail: "כולא את המגזר, ועשוי ללכוד עובד לגיטימי בצד הלא נכון.",
      },
      {
        label: "לעצור כל תנועה באתר",
        detail: "שליטה מרבית לפגיעת גדר אחת; הפרעה גבוהה לעבודה הרגילה.",
      },
    ],
  },
  "unauthorized-vehicle": {
    name: "רכב לא מורשה במחסום",
    log: "רכב בשער 2 בלי אישור כניסה רשום.",
    action:
      "עצרו במחסום ואמתו. אין כניסה עד שיוהה הנהג והרכב.",
    options: [
      {
        label: "לעצור במחסום ולאמת",
        detail: "אין כניסה עד שיוהה הנהג והרכב.",
      },
      {
        label: "לסרב ולהשיב את הרכב",
        detail:
          "סגירה מהירה ביותר אם אין להם עניין כאן; שגוי אם הם אורח צפוי.",
      },
      {
        label: "להתקשר קודם למארח הרשום",
        detail: "עוזר כשהם טוענים לפגישה; מוסיף עיכוב בשער.",
      },
    ],
  },
  tailgating: {
    name: "היצמדות בנקודת כניסה",
    log: "זוהו שני אנשים העוברים בנקודת כניסה של תג יחיד.",
    action:
      "סקרו מצלמה, אשרו את האדם השני. רוב ההיצמדויות הם אורחים או עמיתים — בדקו לפני עצירה קשה.",
    options: [
      {
        label: "לסקור מצלמה ולאשר את האדם השני",
        detail: "רוב ההיצמדויות הם אורחים או עמיתים — בדקו לפני עצירה קשה.",
      },
      {
        label: "לפנות לשני האנשים עכשיו",
        detail: "שליטה מיידית, ועשוי להביך מישהו שהיה מורשה.",
      },
      {
        label: "לעצור את מחזור הדלת",
        detail: "מונע כניסה שלישית, אך יוצר תור מאחורי נקודת הכניסה.",
      },
    ],
  },
  "unattended-object": {
    name: "חפץ ללא השגחה",
    log: "זוהה חפץ באזור מבוקר יותר מ-20 דקות, בלי אנשי צוות משויכים.",
    action:
      "הודיעו לראש האבטחה, אל תתקרבו. הרחיקו אנשים עד שמישהו מוסמך יבדוק.",
    options: [
      {
        label: "להודיע לראש האבטחה, לא להתקרב",
        detail: "הרחיקו אנשים עד שמישהו מוסמך יבדוק.",
      },
      {
        label: "לבודד את האזור ולהמתין",
        detail: "אותה זהירות עם חבל רחב יותר — הפרעה גדולה יותר אם זה ציוד שנשכח.",
      },
      {
        label: "לשאול צוות קרוב אם השאירו אותו",
        detail: "פתרון מהיר כשזה שלהם; שגוי אם לא.",
      },
    ],
  },
  "multi-domain-event": {
    name: "אירוע בו-זמני במספר תחומים",
    log: "מגעים בו-זמניים: כטב\"ם אווירי (נשא 090) וכלי שיט עילי לא מזוהה (נשא 140).",
    action:
      "זה אירוע רב-תחומי — הסלימו מיד למצב משבר, עם מעורבות מלאה של Support Center.",
  },
  "support-center-lost": {
    name: "אבד החיבור ל-Support Center",
    log: "קישור satcom ל-Support Center אבד, 3 ניסיונות התחברות מחדש נכשלו.",
    action:
      "עברו לפרוטוקול התקשורת הגיבוי. המשיכו בניטור ותיעוד מקומיים עד שיוחזר הקישור.",
  },
  "special-event-mode": {
    name: "מצב אירוע מיוחד / VIP",
    log: "מצב אירוע מיוחד פעיל — התאמת פרופיל סיכון זמנית בשל נוכחות אורחים מוגברת.",
    action:
      "סקרו מגעי Attention ידנית. הרגישות כבר הוגברה; בדיקה אנושית מונעת תנועה שגויה במהלך האירוע.",
    options: [
      {
        label: "לסקור מגעי Attention ידנית",
        detail:
          "הרגישות כבר הוגברה; בדיקה אנושית מונעת תנועה שגויה במהלך האירוע.",
      },
      {
        label: "להדק את אזור ההרחקה",
        detail: "בטוח יותר לאורחים; יותר התרעות שווא ויותר חיכוך בהיקף.",
      },
      {
        label: "להוסיף שומר משמרת שני",
        detail: "כיסוי טוב יותר לאירוע, במחיר אדם נוסף במשמרת.",
      },
    ],
  },
};

const COPY: Record<Locale, Record<ScenarioId, ScenarioCopy>> = {
  en: englishScenarioCopy(),
  es,
  fr,
  de,
  ru,
  uk,
  ar,
  zh,
  ja,
  he,
};

const CRISIS: Record<Locale, Record<CrisisId, string[]>> = {
  en: englishCrisisCopy(),
  es: {
    "man-overboard": [
      "Marque la posición (botón MOB / marca GPS).",
      "Haga sonar la alarma — todo el personal.",
      "Asigne un observador para mantener el contacto visual.",
      "Prepare el equipo de rescate.",
      "Inicie la maniobra de recuperación.",
      "Registre hora y posición.",
    ],
    "payload-drone": [
      "Despeje todas las zonas de cubierta — nadie en cubierta.",
      "No se acerque a la aeronave.",
      "Escale ahora a Support Center.",
      "Mantenga en la imagen el rumbo de entrada y la altitud.",
      "Prepárese a maniobrar si entra en la zona de exclusión.",
      "Registre hora, rumbo y descripción.",
    ],
    "drone-swarm": [
      "Escale a Support Center — varios contactos superan la capacidad local.",
      "Mantenga un seguimiento continuo de la formación.",
      "Despeje cubiertas expuestas y reúna al personal abajo.",
      "Deje listo el canal de comunicaciones de reserva.",
      "No intente una interceptación de un solo operador.",
      "Registre número, rumbo y hora de la primera detección.",
    ],
    "usv-swarm": [
      "Escale de inmediato — es una aproximación de superficie coordinada.",
      "Aumente la velocidad y prepare un giro evasivo.",
      "Llame en VHF ch.16; dé por hecho que no habrá respuesta.",
      "Mantenga cada contacto en radar con vigilancia de CPA.",
      "Advierta a la tripulación de un posible impacto o estela.",
      "Registre número, velocidad y patrón.",
    ],
    "critical-closing-speed": [
      "Toque la sirena — cinco o más pitidos cortos.",
      "Altere el rumbo ahora; no espere una respuesta.",
      "Avise a Support Center del punto de máxima aproximación.",
      "Asigne un observador visual en el rumbo de la amenaza.",
      "Ponga estaciones de colisión si la distancia sigue cerrándose.",
      "Registre hora, distancia y el cambio de rumbo.",
    ],
    "uuv-payload": [
      "Escale a Support Center de inmediato.",
      "Evacue a las personas no esenciales de la zona afectada.",
      "Detenga motores y propulsores si es posible un contacto con el casco.",
      "Mantenga la pista de sónar — no pierda el contacto.",
      "Detenga el trabajo por la borda y cierre las escotillas cercanas.",
      "Registre rumbo, profundidad y hora de la primera detección.",
    ],
    "comms-jamming": [
      "Pase al canal de comunicación de reserva.",
      "Confirme si satcom, VHF o ambos están afectados.",
      "Siga con la vigilancia local de radar y visual — no se quede ciego.",
      "Registre la hora de inicio y qué circuitos fallaron.",
      "Reintente el restablecimiento a intervalos fijos, no de forma continua.",
      "Escale si también falla el canal de reserva.",
    ],
    "multi-domain-event": [
      "Ponga a Support Center en implicación plena ahora.",
      "Divida la guardia: uno en aire, uno en superficie si hay personal.",
      "Mantenga ambos contactos en la imagen; no suelte ninguna pista.",
      "Despeje cubiertas y fije una exclusión estrecha.",
      "No se fije solo en el primer contacto que vio.",
      "Registre ambos rumbos y la hora en que aparecieron juntos.",
    ],
    "support-center-lost": [
      "Pase al protocolo de comunicación de reserva.",
      "Siga con la vigilancia y el registro locales — sigue de guardia.",
      "Reintente el enlace a intervalos fijos, no de forma continua.",
      "Eleve la postura de riesgo local hasta que vuelva el enlace.",
      "Use cualquier vía secundaria si hay una disponible.",
      "Registre la hora de la caída y cada intento de restablecimiento.",
    ],
  },
  fr: {
    "man-overboard": [
      "Marquez la position (bouton MOB / marque GPS).",
      "Déclenchez l'alarme — tout le monde.",
      "Désignez un veilleur pour garder le contact visuel.",
      "Préparez le matériel de sauvetage.",
      "Engagez la manœuvre de récupération.",
      "Consignez l'heure et la position.",
    ],
    "payload-drone": [
      "Dégagez toutes les zones de pont — personne en haut.",
      "Ne vous approchez pas de l'aéronef.",
      "Escaladez vers Support Center maintenant.",
      "Gardez le relèvement d'approche et l'altitude sur l'image.",
      "Préparez-vous à manœuvrer s'il entre dans la zone d'exclusion.",
      "Consignez l'heure, le relèvement et la description.",
    ],
    "drone-swarm": [
      "Escaladez vers Support Center — plusieurs contacts dépassent la capacité locale.",
      "Gardez un suivi continu de la formation.",
      "Dégagez les ponts exposés et rassemblez en bas.",
      "Tenez prêt le canal de communication de secours.",
      "N'entreprenez pas une interception à un seul opérateur.",
      "Consignez le nombre, le relèvement et l'heure de première détection.",
    ],
    "usv-swarm": [
      "Escaladez immédiatement — c'est une approche de surface coordonnée.",
      "Augmentez la vitesse et préparez un virage d'évitement.",
      "Appelez sur VHF ch.16 ; partez du principe qu'il n'y aura pas de réponse.",
      "Gardez chaque contact au radar avec une veille CPA.",
      "Prévenez l'équipage d'un possible choc ou sillage.",
      "Consignez le nombre, la vitesse et le schéma.",
    ],
    "critical-closing-speed": [
      "Sonnez le cornet — cinq coups courts ou plus.",
      "Changez de cap maintenant ; n'attendez pas de réponse.",
      "Prévenez Support Center du point de plus proche approche.",
      "Désignez un veilleur visuel sur le relèvement de la menace.",
      "Passez aux postes de collision si la distance continue de se réduire.",
      "Consignez l'heure, la distance et le changement de cap.",
    ],
    "uuv-payload": [
      "Escaladez vers Support Center immédiatement.",
      "Évacuez les personnes non essentielles de la zone concernée.",
      "Immobilisez machines et propulseurs si un contact de coque est possible.",
      "Gardez la piste sonar — ne perdez pas le contact.",
      "Arrêtez le travail hors-bord et fermez les panneaux proches.",
      "Consignez le relèvement, la profondeur et l'heure de première détection.",
    ],
    "comms-jamming": [
      "Passez sur le canal de communication de secours.",
      "Confirmez si satcom, VHF, ou les deux sont affectés.",
      "Poursuivez la veille radar et visuelle locale — ne devenez pas aveugle.",
      "Consignez l'heure de début et quels circuits ont échoué.",
      "Retentez le rétablissement à intervalle fixe, pas en continu.",
      "Escaladez si le canal de secours échoue aussi.",
    ],
    "multi-domain-event": [
      "Mettez Support Center en engagement complet maintenant.",
      "Partagez la veille : une personne sur l'air, une sur la surface si disponible.",
      "Gardez les deux contacts sur l'image ; ne lâchez aucune piste.",
      "Dégagez les ponts et serrez l'exclusion.",
      "Ne vous figez pas sur le premier contact vu.",
      "Consignez les deux relèvements et l'heure où ils sont apparus ensemble.",
    ],
    "support-center-lost": [
      "Passez au protocole de communication de secours.",
      "Poursuivez la surveillance et la consignation locales — vous êtes toujours de veille.",
      "Retentez la liaison à intervalle fixe, pas en continu.",
      "Élevez la posture de risque locale jusqu'au retour de la liaison.",
      "Utilisez toute voie secondaire disponible.",
      "Consignez l'heure de la coupure et chaque tentative de rétablissement.",
    ],
  },
  de: {
    "man-overboard": [
      "Position markieren (MOB-Taste / GPS-Marke).",
      "Alarm geben — alle Mann.",
      "Einen Spotter zuweisen, der Sichtkontakt hält.",
      "Rettungsmittel bereitmachen.",
      "Das Bergungsmanöver beginnen.",
      "Zeit und Position protokollieren.",
    ],
    "payload-drone": [
      "Alle Deckflächen räumen — niemand oben.",
      "Sich dem Luftfahrzeug nicht nähern.",
      "Jetzt an Support Center eskalieren.",
      "Anflugpeilung und Höhe auf dem Bild halten.",
      "Zum Manövrieren bereit sein, falls es in die Sperrzone einfliegt.",
      "Zeit, Peilung und Beschreibung protokollieren.",
    ],
    "drone-swarm": [
      "An Support Center eskalieren — mehrere Kontakte übersteigen die örtliche Kapazität.",
      "Die Formation durchgehend verfolgen.",
      "Freiliegende Decks räumen und unten mustern.",
      "Den Reserve-Kommunikationskanal bereithalten.",
      "Kein Abfangen durch einen einzelnen Bediener versuchen.",
      "Anzahl, Peilung und erste Erkennungszeit protokollieren.",
    ],
    "usv-swarm": [
      "Sofort eskalieren — das ist eine koordinierte Überwasserannäherung.",
      "Fahrt erhöhen und eine Ausweichdrehung vorbereiten.",
      "Auf VHF ch.16 anrufen; keine Antwort annehmen.",
      "Jeden Kontakt auf dem Radar mit CPA-Wache halten.",
      "Die Besatzung vor möglichem Stoß oder Sog warnen.",
      "Anzahl, Geschwindigkeit und Muster protokollieren.",
    ],
    "critical-closing-speed": [
      "Horn geben — fünf oder mehr kurze Töne.",
      "Kurs jetzt ändern; nicht auf eine Antwort warten.",
      "Support Center über den nächsten Annäherungspunkt unterrichten.",
      "Einen visuellen Spotter auf der Bedrohungspeilung zuweisen.",
      "Kollisionsstationen setzen, wenn die Distanz weiter schließt.",
      "Zeit, Distanz und die Kursänderung protokollieren.",
    ],
    "uuv-payload": [
      "Sofort an Support Center eskalieren.",
      "Nicht essenzielle Personen aus dem betroffenen Bereich evakuieren.",
      "Maschinen und Strahler halten, falls ein Rumpfkontakt möglich ist.",
      "Die Sonarspur halten — den Kontakt nicht verlieren.",
      "Arbeiten über Bord stoppen und nahe Luken schließen.",
      "Peilung, Tiefe und erste Erkennungszeit protokollieren.",
    ],
    "comms-jamming": [
      "Auf den Reserve-Kommunikationskanal wechseln.",
      "Bestätigen, ob satcom, VHF oder beides betroffen ist.",
      "Örtliche Radar- und Sichtwache fortsetzen — nicht erblinden.",
      "Beginnzeit und welche Kreise ausgefallen sind protokollieren.",
      "Wiederherstellung in festem Intervall versuchen, nicht durchgehend.",
      "Eskalieren, falls auch der Reservekanal ausfällt.",
    ],
    "multi-domain-event": [
      "Support Center jetzt in volle Einbindung nehmen.",
      "Die Wache teilen: eine Person Luft, eine Überwasser, falls verfügbar.",
      "Beide Kontakte auf dem Bild halten; keine Spur fallen lassen.",
      "Decks räumen und eine enge Sperre setzen.",
      "Nicht auf den ersten gesehenen Kontakt fixieren.",
      "Beide Peilungen und die gemeinsame Erscheinungszeit protokollieren.",
    ],
    "support-center-lost": [
      "Auf das Reserve-Kommunikationsprotokoll wechseln.",
      "Örtliche Überwachung und Protokollierung fortsetzen — Sie sind weiter auf Wache.",
      "Die Verbindung in festem Intervall erneut versuchen, nicht durchgehend.",
      "Die örtliche Risikohaltung anheben, bis die Verbindung zurückkehrt.",
      "Jeden sekundären Weg nutzen, falls einer verfügbar ist.",
      "Ausfallzeit und jeden Wiederherstellungsversuch protokollieren.",
    ],
  },
  ru: {
    "man-overboard": [
      "Отметьте позицию (кнопка MOB / метка GPS).",
      "Дайте тревогу — всем.",
      "Назначьте наблюдателя держать визуальный контакт.",
      "Подготовьте спасательное снаряжение.",
      "Начните манёвр подъёма.",
      "Зафиксируйте время и позицию.",
    ],
    "payload-drone": [
      "Очистите все палубные зоны — никого наверху.",
      "К летательному аппарату не приближайтесь.",
      "Эскалируйте в Support Center сейчас.",
      "Держите на картине пеленг подхода и высоту.",
      "Готовьтесь маневрировать, если войдёт в зону исключения.",
      "Зафиксируйте время, пеленг и описание.",
    ],
    "drone-swarm": [
      "Эскалируйте в Support Center — несколько контактов превышают местные возможности.",
      "Держите непрерывную трассу строя.",
      "Очистите открытые палубы и соберите людей внизу.",
      "Приготовьте резервный канал связи.",
      "Не пытайтесь перехват одним оператором.",
      "Зафиксируйте число, пеленг и время первого обнаружения.",
    ],
    "usv-swarm": [
      "Немедленно эскалируйте — это согласованное надводное сближение.",
      "Увеличьте ход и готовьте уклоняющий поворот.",
      "Вызовите на VHF ch.16; исходите из отсутствия ответа.",
      "Держите каждый контакт на радаре с контролем CPA.",
      "Предупредите экипаж о возможном ударе или кильватере.",
      "Зафиксируйте число, скорость и рисунок.",
    ],
    "critical-closing-speed": [
      "Дайте гудок — пять или больше коротких сигналов.",
      "Измените курс сейчас; не ждите ответа.",
      "Уведомите Support Center о ближайшей точке подхода.",
      "Назначьте визуального наблюдателя по пеленгу угрозы.",
      "Поставьте посты столкновения, если дистанция продолжает закрываться.",
      "Зафиксируйте время, дистанцию и изменение курса.",
    ],
    "uuv-payload": [
      "Немедленно эскалируйте в Support Center.",
      "Эвакуируйте несущественных людей из затронутой зоны.",
      "Держите машины и подруливающие, если возможен контакт с корпусом.",
      "Держите сонарную трассу — не теряйте контакт.",
      "Остановите работы за бортом и закройте ближние люки.",
      "Зафиксируйте пеленг, глубину и время первого обнаружения.",
    ],
    "comms-jamming": [
      "Перейдите на резервный канал связи.",
      "Подтвердите, затронуты satcom, VHF или оба.",
      "Продолжайте местную радиолокационную и визуальную вахту — не слепните.",
      "Зафиксируйте время начала и какие цепи отказали.",
      "Повторяйте восстановление с заданным интервалом, не непрерывно.",
      "Эскалируйте, если откажет и резервный канал.",
    ],
    "multi-domain-event": [
      "Подключите Support Center к полной работе сейчас.",
      "Разделите вахту: один на воздух, один на поверхность, если есть люди.",
      "Держите оба контакта на картине; не бросайте ни одну трассу.",
      "Очистите палубы и поставьте плотную зону исключения.",
      "Не зацикливайтесь на первом увиденном контакте.",
      "Зафиксируйте оба пеленга и время, когда они появились вместе.",
    ],
    "support-center-lost": [
      "Перейдите на резервный протокол связи.",
      "Продолжайте местное наблюдение и журнал — вы всё ещё на вахте.",
      "Повторяйте канал с заданным интервалом, не непрерывно.",
      "Поднимите местную рисковую стойку, пока канал не вернётся.",
      "Используйте любой вторичный путь, если он есть.",
      "Зафиксируйте время обрыва и каждую попытку восстановления.",
    ],
  },
  uk: {
    "man-overboard": [
      "Позначте позицію (кнопка MOB / мітка GPS).",
      "Дайте тривогу — усім.",
      "Призначте спостерігача тримати візуальний контакт.",
      "Підготуйте рятувальне спорядження.",
      "Почніть маневр підйому.",
      "Зафіксуйте час і позицію.",
    ],
    "payload-drone": [
      "Звільніть усі палубні зони — нікого нагорі.",
      "До літального апарата не наближайтесь.",
      "Ескалюйте до Support Center зараз.",
      "Тримайте на картині пеленг підходу і висоту.",
      "Готуйтеся маневрувати, якщо ввійде в зону виключення.",
      "Зафіксуйте час, пеленг і опис.",
    ],
    "drone-swarm": [
      "Ескалюйте до Support Center — кілька контактів перевищують місцеві спроможності.",
      "Тримайте безперервну трасу строю.",
      "Звільніть відкриті палуби і зберіть людей унизу.",
      "Приготуйте резервний канал зв’язку.",
      "Не намагайтеся перехоплення одним оператором.",
      "Зафіксуйте число, пеленг і час першого виявлення.",
    ],
    "usv-swarm": [
      "Негайно ескалюйте — це узгоджене надводне зближення.",
      "Збільште хід і готуйте ухильний поворот.",
      "Викличте на VHF ch.16; виходьте з відсутності відповіді.",
      "Тримайте кожен контакт на радарі з контролем CPA.",
      "Попередьте екіпаж про можливий удар або кільватер.",
      "Зафіксуйте число, швидкість і рисунок.",
    ],
    "critical-closing-speed": [
      "Дайте гудок — п’ять або більше коротких сигналів.",
      "Змініть курс зараз; не чекайте відповіді.",
      "Повідомте Support Center про найближчу точку підходу.",
      "Призначте візуального спостерігача за пеленгом загрози.",
      "Поставте пости зіткнення, якщо дистанція далі закривається.",
      "Зафіксуйте час, дистанцію і зміну курсу.",
    ],
    "uuv-payload": [
      "Негайно ескалюйте до Support Center.",
      "Евакуюйте несуттєвих людей з ураженої зони.",
      "Тримайте машини і підрулювальні, якщо можливий контакт із корпусом.",
      "Тримайте сонарну трасу — не втрачайте контакт.",
      "Зупиніть роботи за бортом і закрийте ближні люки.",
      "Зафіксуйте пеленг, глибину і час першого виявлення.",
    ],
    "comms-jamming": [
      "Перейдіть на резервний канал зв’язку.",
      "Підтвердіть, уражені satcom, VHF чи обидва.",
      "Продовжуйте місцеву радіолокаційну і візуальну вахту — не сліпніть.",
      "Зафіксуйте час початку і які кола відмовили.",
      "Повторюйте відновлення із заданим інтервалом, не безперервно.",
      "Ескалюйте, якщо відмовить і резервний канал.",
    ],
    "multi-domain-event": [
      "Підключіть Support Center до повної роботи зараз.",
      "Розділіть вахту: один на повітря, один на поверхню, якщо є люди.",
      "Тримайте обидва контакти на картині; не кидайте жодної траси.",
      "Звільніть палуби і поставте щільну зону виключення.",
      "Не зациклюйтеся на першому побаченому контакті.",
      "Зафіксуйте обидва пеленги і час, коли вони з’явилися разом.",
    ],
    "support-center-lost": [
      "Перейдіть на резервний протокол зв’язку.",
      "Продовжуйте місцеве спостереження і журнал — ви все ще на вахті.",
      "Повторюйте канал із заданим інтервалом, не безперервно.",
      "Підніміть місцеву ризикову стійку, доки канал не повернеться.",
      "Використовуйте будь-який вторинний шлях, якщо він є.",
      "Зафіксуйте час обриву і кожну спробу відновлення.",
    ],
  },
  ar: {
    "man-overboard": [
      "علّم الموقع (زر MOB / علامة GPS).",
      "أطلق الإنذار — جميع الأيدي.",
      "عيّن راصداً للحفاظ على الاتصال البصري.",
      "جهّز معدات الإنقاذ.",
      "ابدأ مناورة الاستعادة.",
      "سجّل الوقت والموقع.",
    ],
    "payload-drone": [
      "أخلِ جميع مناطق السطح — لا أحد في الأعلى.",
      "لا تقترب من المركبة الجوية.",
      "صعّد إلى Support Center الآن.",
      "أبقِ سمت الاقتراب والارتفاع على الصورة.",
      "استعد للمناورة إذا دخلت منطقة الاستبعاد.",
      "سجّل الوقت والسمت والوصف.",
    ],
    "drone-swarm": [
      "صعّد إلى Support Center — عدة أهداف تتجاوز القدرة المحلية.",
      "أبقِ تتبعاً مستمراً للتشكيل.",
      "أخلِ الأسطح المكشوفة واجمع الأفراد في الأسفل.",
      "جهّز قناة الاتصالات الاحتياطية.",
      "لا تحاول اعتراضاً بمشغّل واحد.",
      "سجّل العدد والسمت ووقت أول كشف.",
    ],
    "usv-swarm": [
      "صعّد فوراً — هذا اقتراب سطحي منسّق.",
      "زد السرعة واستعد لدوران تفادٍ.",
      "نادِ على VHF ch.16؛ افترض عدم الرد.",
      "أبقِ كل هدف على الرادار مع مراقبة CPA.",
      "حذّر الطاقم من اصطدام أو أثر موجة محتمل.",
      "سجّل العدد والسرعة والنمط.",
    ],
    "critical-closing-speed": [
      "أطلق البوق — خمسة صافر قصيرة أو أكثر.",
      "غيّر المسار الآن؛ لا تنتظر رداً.",
      "أبلغ Support Center بأقرب نقطة اقتراب.",
      "عيّن راصداً بصرياً على سمت التهديد.",
      "اضبط محطات التصادم إذا استمرت المسافة في الإغلاق.",
      "سجّل الوقت والمدى وتغيير المسار.",
    ],
    "uuv-payload": [
      "صعّد إلى Support Center فوراً.",
      "أخلِ غير الضروري من المنطقة المتأثرة.",
      "أوقف المحركات والدافعات إذا أمكن تماس مع الهيكل.",
      "أبقِ مسار السونار — لا تفقد الهدف.",
      "أوقف العمل على الجانب وأغلق الفتحات القريبة.",
      "سجّل السمت والعمق ووقت أول كشف.",
    ],
    "comms-jamming": [
      "انتقل إلى قناة الاتصال الاحتياطية.",
      "أكّد إن كان satcom أو VHF أو كلاهما متأثراً.",
      "واصل المراقبة المحلية بالرادار والرؤية — لا تُصب بالعمى.",
      "سجّل وقت البدء وأي الدوائر فشلت.",
      "أعد محاولة الاستعادة على فاصل محدد، لا باستمرار.",
      "صعّد إذا فشلت قناة الاحتياط أيضاً.",
    ],
    "multi-domain-event": [
      "أشرك Support Center مشاركة كاملة الآن.",
      "قسّم النوبة: شخص على الجو وشخص على السطح إن وُجد.",
      "أبقِ كلا الهدفين على الصورة؛ لا تسقط أياً من المسارين.",
      "أخلِ الأسطح واضبط استبعاداً ضيقاً.",
      "لا تثبّت على أول هدف رأيته.",
      "سجّل كلا السمتين ووقت ظهورهما معاً.",
    ],
    "support-center-lost": [
      "انتقل إلى بروتوكول الاتصال الاحتياطي.",
      "واصل المراقبة والتسجيل المحليين — ما زلت في النوبة.",
      "أعد محاولة الرابط على فاصل محدد، لا باستمرار.",
      "ارفع وضع المخاطر المحلي حتى يعود الرابط.",
      "استخدم أي مسار ثانوي إن وُجد.",
      "سجّل وقت الانقطاع وكل محاولة استعادة.",
    ],
  },
  zh: {
    "man-overboard": [
      "标定位置（MOB 按钮 / GPS 标记）。",
      "拉响警报 — 全员。",
      "指定一名观察员保持目视接触。",
      "准备救援设备。",
      "开始回收机动。",
      "记录时间和位置。",
    ],
    "payload-drone": [
      "清空所有甲板区域 — 甲板上不得留人。",
      "不要靠近该航空器。",
      "立即升级至 Support Center。",
      "在画面上保持来向方位和高度。",
      "若其进入禁区，准备机动。",
      "记录时间、方位和描述。",
    ],
    "drone-swarm": [
      "升级至 Support Center — 多个目标超出本地能力。",
      "对编队保持连续跟踪。",
      "清空暴露甲板，在下层集合。",
      "备好备用通信信道。",
      "不要尝试单人拦截。",
      "记录数量、方位和首次探测时间。",
    ],
    "usv-swarm": [
      "立即升级 — 这是协同水面接近。",
      "加速并准备规避转向。",
      "在 VHF ch.16 呼叫；按无应答处理。",
      "雷达上保留每个目标并监视 CPA。",
      "警告船员可能撞击或伴流。",
      "记录数量、速度和模式。",
    ],
    "critical-closing-speed": [
      "鸣笛 — 五声或更多短声。",
      "立即改向；不要等待应答。",
      "将最近会遇点通知 Support Center。",
      "在威胁方位指定目视观察员。",
      "若距离继续缩小，进入碰撞部署。",
      "记录时间、距离和改向。",
    ],
    "uuv-payload": [
      "立即升级至 Support Center。",
      "从受影响区域撤离非必要人员。",
      "若可能接触船体，停住主机和推进器。",
      "保持声呐航迹 — 不要丢失目标。",
      "停止舷外作业并关闭附近舱口。",
      "记录方位、深度和首次探测时间。",
    ],
    "comms-jamming": [
      "切换到备用通信信道。",
      "确认受影响的是 satcom、VHF 还是两者。",
      "继续本地雷达与目视值班 — 不要失明。",
      "记录开始时间以及哪些电路失效。",
      "按固定间隔重试恢复，不要连续猛试。",
      "若备用信道也失败则升级。",
    ],
    "multi-domain-event": [
      "立即让 Support Center 全面介入。",
      "拆分值班：有人则一人管空中、一人管水面。",
      "两个目标都留在画面上；任一条航迹都不要丢。",
      "清空甲板并设紧禁区。",
      "不要只盯着最先看到的目标。",
      "记录两个方位以及它们同时出现的时间。",
    ],
    "support-center-lost": [
      "切换到备用通信规程。",
      "继续本地监视与记录 — 你仍在值班。",
      "按固定间隔重试链路，不要连续猛试。",
      "在链路恢复前提高本地风险态势。",
      "若有次级通路则使用。",
      "记录中断时间和每次恢复尝试。",
    ],
  },
  ja: {
    "man-overboard": [
      "位置を標定（MOB ボタン / GPS マーク）。",
      "警報を鳴らせ — 全員。",
      "目視接触を保つ監視員を指定せよ。",
      "救助器材を準備せよ。",
      "回収運動を開始せよ。",
      "時刻と位置を記録せよ。",
    ],
    "payload-drone": [
      "甲板区域をすべて空けよ — 上甲板に誰も残すな。",
      "機体に近づくな。",
      "今すぐ Support Center へエスカレーション。",
      "接近方位と高度を画面に保て。",
      "除外区域に入れば運動できるよう準備せよ。",
      "時刻、方位、状況を記録せよ。",
    ],
    "drone-swarm": [
      "Support Center へエスカレーション — 複数目標が現地能力を超える。",
      "編隊の連続追尾を保て。",
      "露出甲板を空け、下で集合せよ。",
      "予備通信チャネルを用意せよ。",
      "単独操作員による迎撃を試みるな。",
      "数、方位、初探知時刻を記録せよ。",
    ],
    "usv-swarm": [
      "直ちにエスカレーション — 協調した水上接近である。",
      "増速し、回避回頭を準備せよ。",
      "VHF ch.16 で呼びかけ；応答なしと想定せよ。",
      "全目標をレーダーに残し CPA を監視せよ。",
      "衝突または伴流の可能性を乗組員に警告せよ。",
      "数、速力、パターンを記録せよ。",
    ],
    "critical-closing-speed": [
      "汽笛 — 短声を五回以上。",
      "今すぐ変針；応答を待つな。",
      "最接近点を Support Center に通報せよ。",
      "脅威方位に目視監視員を置け。",
      "距離が閉じ続けるなら衝突配置につけ。",
      "時刻、距離、変針を記録せよ。",
    ],
    "uuv-payload": [
      "直ちに Support Center へエスカレーション。",
      "影響区域から非必須の人員を退避させよ。",
      "船体接触があり得るなら機関とスラスタを止めよ。",
      "ソナー航跡を保て — 目標を失うな。",
      "舷外作業を止め、近くのハッチを閉めよ。",
      "方位、深度、初探知時刻を記録せよ。",
    ],
    "comms-jamming": [
      "予備通信チャネルへ切り替えよ。",
      "satcom、VHF、または両方のどれが影響を受けたか確認せよ。",
      "現地のレーダーと目視当直を続けよ — 盲目になるな。",
      "開始時刻と故障した回線を記録せよ。",
      "復旧は定間隔で再試行し、連続してはならない。",
      "予備チャネルも失敗したらエスカレーションせよ。",
    ],
    "multi-domain-event": [
      "今すぐ Support Center を全面関与させよ。",
      "当直を分けよ：いれば空中一人、水面一人。",
      "両目標を画面に残せ；どちらの航跡も落とすな。",
      "甲板を空け、除外をきつくせよ。",
      "最初に見た目標に固着するな。",
      "両方の方位と同時出現時刻を記録せよ。",
    ],
    "support-center-lost": [
      "予備通信手順へ切り替えよ。",
      "現地の監視と記録を続けよ — 当直は続いている。",
      "回線は定間隔で再試行し、連続してはならない。",
      "回線が戻るまで現地のリスク態勢を上げよ。",
      "副経路があれば使え。",
      "切断時刻と各復旧試行を記録せよ。",
    ],
  },
  he: {
    "man-overboard": [
      "סמנו מיקום (כפתור MOB / סימון GPS).",
      "הפעילו אזעקה — כל הידיים.",
      "הקצו צופה לשמור על קשר עין.",
      "הכינו ציוד חילוץ.",
      "החלו בתמרון האיסוף.",
      "תעדו שעה ומיקום.",
    ],
    "payload-drone": [
      "פנו את כל אזורי הסיפון — אף אחד למעלה.",
      "אל תתקרבו לכלי הטיס.",
      "הסלימו ל-Support Center עכשיו.",
      "שמרו על נשא ההתקרבות והגובה בתמונה.",
      "התכוננו לתמרן אם ייכנס לאזור ההרחקה.",
      "תעדו שעה, נשא ותיאור.",
    ],
    "drone-swarm": [
      "הסלימו ל-Support Center — מספר מגעים חורגים מהיכולת המקומית.",
      "שמרו מעקב רציף אחר המערך.",
      "פנו סיפונים חשופים ואספו למטה.",
      "הכינו את ערוץ התקשורת הגיבוי.",
      "אל תנסו יירוט של מפעיל יחיד.",
      "תעדו מספר, נשא ושעת הזיהוי הראשון.",
    ],
    "usv-swarm": [
      "הסלימו מיד — זו התקרבות עילי מתואמת.",
      "הגבירו מהירות והכינו פנייה מתחמקת.",
      "קראו ב-VHF ch.16; הניחו שאין מענה.",
      "שמרו כל מגע במכ\"ם עם שמירת CPA.",
      "הזהירו את הצוות מפגיעה או שוקת אפשרית.",
      "תעדו מספר, מהירות ודפוס.",
    ],
    "critical-closing-speed": [
      "צפרו בצופר — חמש תקיעות קצרות או יותר.",
      "שנו נתיב עכשיו; אל תחכו למענה.",
      "הודיעו ל-Support Center על נקודת ההתקרבות הקרובה ביותר.",
      "הקצו צופה חזותי בנשא האיום.",
      "הציבו עמדות התנגשות אם הטווח ממשיך להיסגר.",
      "תעדו שעה, טווח ושינוי הנתיב.",
    ],
    "uuv-payload": [
      "הסלימו ל-Support Center מיד.",
      "פנו אנשים שאינם חיוניים מהאזור המושפע.",
      "עצרו מנועים ומדחפים אם מגע בגוף אפשרי.",
      "שמרו על מסלול הסונאר — אל תאבדו את המגע.",
      "עצרו עבודה מעל הדופן וסגרו פתחים קרובים.",
      "תעדו נשא, עומק ושעת הזיהוי הראשון.",
    ],
    "comms-jamming": [
      "עברו לערוץ התקשורת הגיבוי.",
      "אשרו אם satcom, VHF או שניהם מושפעים.",
      "המשיכו בשמירת מכ\"ם וראייה מקומית — אל תתעוורו.",
      "תעדו שעת התחלה ואילו מעגלים נכשלו.",
      "נסו שחזור במרווח קבוע, לא ברצף.",
      "הסלימו אם גם ערוץ הגיבוי נכשל.",
    ],
    "multi-domain-event": [
      "הכניסו את Support Center למעורבות מלאה עכשיו.",
      "פצלו את המשמרת: אחד על אוויר, אחד על פני השטח אם אפשר.",
      "שמרו את שני המגעים בתמונה; אל תשחררו אף מסלול.",
      "פנו סיפונים והדקו הרחקה.",
      "אל תיקבעו על המגע הראשון שראיתם.",
      "תעדו את שני הנשאים ואת השעה שבה הופיעו יחד.",
    ],
    "support-center-lost": [
      "עברו לפרוטוקול התקשורת הגיבוי.",
      "המשיכו בניטור ותיעוד מקומיים — אתם עדיין במשמרת.",
      "נסו את הקישור במרווח קבוע, לא ברצף.",
      "העלו את יציבת הסיכון המקומית עד שהקישור יחזור.",
      "השתמשו בכל נתיב משני אם יש.",
      "תעדו שעת ניתוק וכל ניסיון שחזור.",
    ],
  },
};

const FALLBACK: Record<Locale, string[]> = {
  en: [...FALLBACK_CRISIS_STEPS],
  es: [
    "Escale a Support Center.",
    "Mantenga viva la imagen situacional.",
    "Detenga el movimiento no esencial.",
    "Registre la hora y cada cambio.",
  ],
  fr: [
    "Escaladez vers Support Center.",
    "Gardez l'image situationnelle en direct.",
    "Immobilisez les mouvements non essentiels.",
    "Consignez l'heure et chaque changement.",
  ],
  de: [
    "An Support Center eskalieren.",
    "Das Lagebild lebendig halten.",
    "Nicht essenzielle Bewegung anhalten.",
    "Zeit und jede Änderung protokollieren.",
  ],
  ru: [
    "Эскалируйте в Support Center.",
    "Держите ситуационную картину живой.",
    "Остановите несущественное движение.",
    "Зафиксируйте время и каждое изменение.",
  ],
  uk: [
    "Ескалюйте до Support Center.",
    "Тримайте ситуаційну картину живою.",
    "Зупиніть несуттєвий рух.",
    "Зафіксуйте час і кожну зміну.",
  ],
  ar: [
    "صعّد إلى Support Center.",
    "أبقِ الصورة الموقفية حيّة.",
    "أوقف الحركة غير الضرورية.",
    "سجّل الوقت وكل تغيير.",
  ],
  zh: [
    "升级至 Support Center。",
    "保持态势画面实时。",
    "停止非必要移动。",
    "记录时间及每一次变化。",
  ],
  ja: [
    "Support Center へエスカレーション。",
    "状況画面を生きたまま保て。",
    "非必須の移動を止めよ。",
    "時刻とすべての変化を記録せよ。",
  ],
  he: [
    "הסלימו ל-Support Center.",
    "שמרו על התמונה המצבית חיה.",
    "עצרו תנועה שאינה חיונית.",
    "תעדו שעה וכל שינוי.",
  ],
};

const AUTO: Record<Locale, Record<AutoId, string[]>> = {
  en: englishAutoCopy(),
  es: {
    "perimeter-breach": [
      "Las cámaras cercanas pasaron automáticamente a grabar · Iluminación del sector 4 activada",
    ],
    "unattended-object": [
      "El zoom de la cámara se centró automáticamente en la ubicación del objeto",
    ],
    "recon-drone": ["El registro de seguimiento se inició automáticamente para este contacto"],
    tailgating: [
      "Las imágenes de la cámara del punto de acceso se marcaron automáticamente para revisión",
    ],
  },
  fr: {
    "perimeter-breach": [
      "Les caméras proches sont passées automatiquement en enregistrement · Éclairage du secteur 4 activé",
    ],
    "unattended-object": [
      "Le zoom caméra s'est automatiquement centré sur l'emplacement de l'objet",
    ],
    "recon-drone": ["Le journal de suivi a été démarré automatiquement pour ce contact"],
    tailgating: [
      "Les images caméra du point d'accès ont été automatiquement signalées pour examen",
    ],
  },
  de: {
    "perimeter-breach": [
      "Nahe Kameras automatisch auf Aufnahme umgeschaltet · Beleuchtung Sektor 4 aktiviert",
    ],
    "unattended-object": [
      "Kamerazoom automatisch auf den Objektstandort fokussiert",
    ],
    "recon-drone": ["Verfolgungsprotokoll für diesen Kontakt automatisch gestartet"],
    tailgating: [
      "Kameraaufnahmen des Zugangspunkts automatisch zur Prüfung markiert",
    ],
  },
  ru: {
    "perimeter-breach": [
      "Ближние камеры автоматически переключены на запись · Освещение сектора 4 включено",
    ],
    "unattended-object": [
      "Зум камеры автоматически наведён на место предмета",
    ],
    "recon-drone": ["Журнал сопровождения для этого контакта запущен автоматически"],
    tailgating: [
      "Запись камеры точки доступа автоматически помечена к просмотру",
    ],
  },
  uk: {
    "perimeter-breach": [
      "Найближчі камери автоматично перемкнено на запис · Освітлення сектора 4 увімкнено",
    ],
    "unattended-object": [
      "Зум камери автоматично наведено на місце предмета",
    ],
    "recon-drone": ["Журнал супроводу для цього контакту запущено автоматично"],
    tailgating: [
      "Запис камери точки доступу автоматично позначено до перегляду",
    ],
  },
  ar: {
    "perimeter-breach": [
      "الكاميرات القريبة انتقلت تلقائياً إلى التسجيل · إضاءة القطاع 4 مفعّلة",
    ],
    "unattended-object": ["تم تركيز تكبير الكاميرا تلقائياً على موقع الجسم"],
    "recon-drone": ["بدأ سجل التتبع تلقائياً لهذا الهدف"],
    tailgating: ["وُسمت لقطات كاميرا نقطة الوصول تلقائياً للمراجعة"],
  },
  zh: {
    "perimeter-breach": ["附近摄像头已自动切换为录像 · 第 4 扇区照明已开启"],
    "unattended-object": ["摄像头变焦已自动对准物品位置"],
    "recon-drone": ["已自动开始该目标的跟踪日志"],
    tailgating: ["准入点摄像头录像已自动标记待复核"],
  },
  ja: {
    "perimeter-breach": [
      "付近カメラが自動で録画に切替 · セクター 4 の照明を作動",
    ],
    "unattended-object": ["カメラズームが物体位置に自動で合焦"],
    "recon-drone": ["この目標の追尾ログを自動開始"],
    tailgating: ["入場点のカメラ映像を自動で確認対象に旗立て"],
  },
  he: {
    "perimeter-breach": [
      "מצלמות סמוכות הועברו אוטומטית להקלטה · תאורת מגזר 4 הופעלה",
    ],
    "unattended-object": ["זום המצלמה התמקד אוטומטית במיקום החפץ"],
    "recon-drone": ["יומן המעקב למגע זה הופעל אוטומטית"],
    tailgating: ["צילומי מצלמת נקודת הכניסה סומנו אוטומטית לבדיקה"],
  },
};

export function localizeScenario(locale: Locale, scenario: Scenario): Scenario {
  const pack = COPY[locale] ?? COPY.en;
  const copy =
    (isScenarioId(scenario.id) ? pack[scenario.id] : undefined) ??
    (isScenarioId(scenario.id) ? COPY.en[scenario.id] : undefined);
  const categories = CATEGORIES[locale] ?? CATEGORIES.en;
  const category = isCategoryKey(scenario.category)
    ? categories[scenario.category] ?? CATEGORIES.en[scenario.category]
    : scenario.category;

  if (!copy) {
    return { ...scenario, category };
  }

  const options = scenario.options
    ? scenario.options.map((option, index) => ({
        ...option,
        label: copy.options?.[index]?.label ?? option.label,
        detail: copy.options?.[index]?.detail ?? option.detail,
      }))
    : scenario.options;

  return {
    ...scenario,
    category,
    name: copy.name,
    logText: copy.log,
    actionText: copy.action,
    ...(options ? { options } : {}),
  };
}

export function localizeCrisisSteps(
  locale: Locale,
  scenarioId: string,
  fallback: string[],
): string[] {
  if (isCrisisId(scenarioId)) {
    return CRISIS[locale]?.[scenarioId] ?? CRISIS.en[scenarioId] ?? fallback;
  }
  if (sameSteps(fallback, FALLBACK.en)) {
    return FALLBACK[locale] ?? FALLBACK.en;
  }
  return fallback;
}

export function localizeAutoActions(
  locale: Locale,
  scenarioId: string,
  fallback: string[],
): string[] {
  if (isAutoId(scenarioId)) {
    return AUTO[locale]?.[scenarioId] ?? AUTO.en[scenarioId] ?? fallback;
  }
  return fallback;
}


