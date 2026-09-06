"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BridgeRadar } from "@/components/bridge/bridge-radar";
import { CrisisBanner } from "@/components/bridge/crisis-banner";
import { CrisisProtocolPanel } from "@/components/bridge/crisis-protocol-panel";
import { DegradedBanner } from "@/components/bridge/degraded-banner";
import { ExpandablePicture } from "@/components/bridge/expandable-picture";
import {
  EventToasts,
  type EventToast,
  type ToastKind,
} from "@/components/bridge/event-toasts";
import { HudPanel } from "@/components/bridge/hud-panel";
import { ModeToggle } from "@/components/mode-toggle";
import { PerimeterView } from "@/components/bridge/perimeter-panel";
import { FullscreenButton } from "@/components/bridge/fullscreen-button";
import { RankedActionList } from "@/components/bridge/ranked-action-list";
import { ScenarioLibrary } from "@/components/bridge/scenario-library";
import { SessionReport } from "@/components/bridge/session-report";
import { TrainingTour } from "@/components/bridge/training-tour";
import { SonarView } from "@/components/bridge/sonar-panel";
import { SpectrumView } from "@/components/bridge/spectrum-panel";
import { UtcClock } from "@/components/bridge/utc-clock";
import { AUTOMATED_ACTIONS } from "@/lib/automated-actions";
import { CRISIS_PROTOCOLS, FALLBACK_CRISIS_STEPS } from "@/lib/crisis-protocols";
import {
  EQUIPMENT,
  equipmentName,
  type EquipmentId,
} from "@/lib/equipment";
import { useBlackBox } from "@/lib/black-box";
import { useBridgeSession } from "@/lib/bridge-session";
import { cloudVesselName, syncEventToCloud } from "@/lib/cloud-sync";
import { listEvents, putEvents, putSessionReport, type StoredEvent } from "@/lib/local-db";
import { useCrisisMode } from "@/lib/crisis-mode";
import { usePreferences } from "@/lib/i18n/context";
import { useAppMode } from "@/lib/mode";
import { cn } from "@/lib/cn";
import {
  PANEL_CHROME,
  RESET_LOG,
  SCENARIOS,
  type PanelType,
  type RiskLevel,
  type Scenario,
  type ScenarioOption,
  type SessionEvent,
} from "@/lib/scenarios";
import {
  perimeterScene,
  radarScene,
  sonarScene,
  spectrumScene,
} from "@/lib/picture-scenes";

type LogEntry = EventToast;

function GearMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 text-ok"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M6.4 1.2h3.2l.3 1.6a5 5 0 0 1 1.4.8l1.5-.6 1.6 2.8-1.2 1.1c.1.4.2.8.2 1.1s-.1.8-.2 1.1l1.2 1.1-1.6 2.8-1.5-.6a5 5 0 0 1-1.4.8l-.3 1.6H6.4l-.3-1.6a5 5 0 0 1-1.4-.8l-1.5.6L1.6 10l1.2-1.1A5 5 0 0 1 2.6 8c0-.4.1-.8.2-1.1L1.6 5.8 3.2 3l1.5.6a5 5 0 0 1 1.4-.8l.3-1.6ZM8 6.2A1.8 1.8 0 1 0 8 9.8 1.8 1.8 0 0 0 8 6.2Z"
      />
    </svg>
  );
}

const TELEMETRY_VALUES = [
  "M/Y AURELIA",
  "41°23'06\"N 002°11'42\"E",
  "247° TRUE",
  "11.4 KN",
  "14 KN NE",
  "62 M",
] as const;

const RISK_KEYS = ["NORMAL", "ATTENTION", "ELEVATED", "CRITICAL"] as const;
const RISK_BARS = ["bg-ok", "bg-attn", "bg-orange", "bg-crit"] as const;

function nowStamp() {
  return new Date().toISOString().slice(11, 19);
}

function levelClass(level: RiskLevel) {
  if (level === "NORMAL") return "text-ok border-ok/40";
  if (level === "ATTENTION") return "text-attn border-attn/40";
  if (level === "ELEVATED") return "text-orange border-orange/40";
  return "text-crit border-crit/40";
}

function riskTone(level: RiskLevel) {
  if (level === "ATTENTION") return { dot: "bg-attn", text: "text-attn", chip: "border-attn text-attn" };
  if (level === "ELEVATED") return { dot: "bg-orange", text: "text-orange", chip: "border-orange text-orange" };
  if (level === "CRITICAL") return { dot: "bg-crit", text: "text-crit", chip: "border-crit text-crit" };
  return { dot: "bg-ok", text: "text-ok", chip: "border-ok text-ok" };
}

function pictureFor(
  panelType: PanelType,
  scenarioId: string,
  situational: string,
  pictureFault: "radar" | "ais" | null,
  empty?: boolean,
) {
  if (empty || panelType === "radar") {
    const scene = radarScene(empty ? "" : scenarioId);
    return {
      testId: "radar-panel",
      title: situational,
      extra: empty ? "NO SENSORS" : scene.extra,
      view: (
        <BridgeRadar
          scenarioId={empty ? "" : scenarioId}
          degraded={empty ? null : pictureFault}
          empty={empty}
        />
      ),
    };
  }
  const chrome = PANEL_CHROME[panelType];
  if (panelType === "sonar") {
    return {
      testId: chrome.testId,
      title: chrome.title,
      extra: sonarScene(scenarioId).extra,
      view: <SonarView scenarioId={scenarioId} />,
    };
  }
  if (panelType === "spectrum") {
    return {
      testId: chrome.testId,
      title: chrome.title,
      extra: spectrumScene(scenarioId).extra,
      view: <SpectrumView scenarioId={scenarioId} />,
    };
  }
  return {
    testId: chrome.testId,
    title: chrome.title,
    extra: perimeterScene(scenarioId).extra,
    view: <PerimeterView scenarioId={scenarioId} />,
  };
}

export function BridgeConsole() {
  const { t } = usePreferences();
  const { live } = useAppMode();
  const { setCrisis } = useCrisisMode();
  const { setSession } = useBridgeSession();
  const { recordScenario } = useBlackBox();
  const [storageReady, setStorageReady] = useState(false);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("NORMAL");
  const [panelType, setPanelType] = useState<PanelType>("radar");
  const [actionText, setActionText] = useState<string | null>(null);
  const [actionOptions, setActionOptions] = useState<ScenarioOption[] | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [logSeed] = useState(() => [
    { id: "seed-1", time: "14:32:07", level: "NORMAL" as const, text: t.bridge.log[0], kind: "watch" as const },
    { id: "seed-2", time: "14:18:44", level: "NORMAL" as const, text: t.bridge.log[1], kind: "watch" as const },
    { id: "seed-3", time: "13:55:12", level: "ATTENTION" as const, text: t.bridge.log[2], kind: "watch" as const },
    { id: "seed-4", time: "13:40:03", level: "NORMAL" as const, text: t.bridge.log[3], kind: "watch" as const },
    { id: "seed-5", time: "13:12:58", level: "NORMAL" as const, text: t.bridge.log[4], kind: "watch" as const },
  ]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>(logSeed);
  const [toasts, setToasts] = useState<EventToast[]>([]);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportAt, setReportAt] = useState<Date | null>(null);
  const [training, setTraining] = useState(false);
  const [faultId, setFaultId] = useState<EquipmentId | null>(null);
  const autoTimer = useRef<number | null>(null);
  const toastTimers = useRef<Map<string, number>>(new Map());
  const flashTimer = useRef<number | null>(null);
  const logSeq = useRef(0);

  function clearAutoTimer() {
    if (autoTimer.current !== null) {
      window.clearTimeout(autoTimer.current);
      autoTimer.current = null;
    }
  }

  function dismissToast(id: string) {
    const timer = toastTimers.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      toastTimers.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function restoreSessionEvents(rows: StoredEvent[]) {
    const next = rows
      .filter((row) => row.kind === "scenario" && row.scenarioId)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      .map((row) => ({
        timestamp: row.time,
        name: SCENARIOS.find((item) => item.id === row.scenarioId)?.name ?? row.scenarioId ?? row.text,
        category: row.category ?? "",
        riskLevel: row.level,
        actionText: row.actionText ?? "",
      }));
    setSessionEvents(next);
  }

  function applyStoredLog(rows: StoredEvent[]) {
    const entries = rows.map((row) => ({
      id: row.id,
      time: row.time,
      level: row.level,
      text: row.text,
      kind: row.kind,
      auto: row.auto,
    }));
    setLogEntries(entries);
    const maxSeq = rows.reduce((max, row) => {
      const match = /^log-(\d+)$/.exec(row.id);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    logSeq.current = maxSeq;
    restoreSessionEvents(rows);
  }

  function persistLogs(
    stamped: LogEntry[],
    extras: Array<{ scenarioId?: string; category?: string; actionText?: string }>,
  ) {
    const stored: StoredEvent[] = stamped.map((entry, index) => ({
      ...entry,
      timestamp: new Date().toISOString(),
      scenarioId: extras[index]?.scenarioId,
      category: extras[index]?.category,
      actionText: extras[index]?.actionText,
    }));
    void putEvents(stored).catch(() => undefined);
    const vessel = cloudVesselName(live);
    stored.forEach((event) => {
      void syncEventToCloud(event, vessel).catch(() => undefined);
    });
  }

  function pushLogs(
    rows: {
      level: RiskLevel;
      text: string;
      kind: ToastKind;
      auto?: boolean;
      scenarioId?: string;
      category?: string;
      actionText?: string;
    }[],
  ) {
    if (live) return [];
    const stamped: LogEntry[] = rows.map((row) => {
      logSeq.current += 1;
      return {
        id: `log-${logSeq.current}`,
        time: nowStamp(),
        level: row.level,
        text: row.text,
        kind: row.kind,
        auto: row.auto,
      };
    });
    setLogEntries((entries) => [...stamped, ...entries]);
    setToasts((current) => [...stamped, ...current]);
    for (const entry of stamped) {
      const ms = entry.level === "CRITICAL" ? 10000 : 5000;
      const timer = window.setTimeout(() => dismissToast(entry.id), ms);
      toastTimers.current.set(entry.id, timer);
    }
    persistLogs(
      stamped,
      rows.map((row) => ({
        scenarioId: row.scenarioId,
        category: row.category,
        actionText: row.actionText,
      })),
    );
    return stamped;
  }

  function openLogRow(id: string) {
    const row = document.querySelector<HTMLElement>(`[data-log-row="${id}"]`);
    (row ?? document.getElementById("event-log-panel"))?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setFlashId(id);
    if (flashTimer.current !== null) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlashId(null), 1400);
  }

  useEffect(
    () => () => {
      clearAutoTimer();
      toastTimers.current.forEach((timer) => window.clearTimeout(timer));
      toastTimers.current.clear();
      if (flashTimer.current !== null) window.clearTimeout(flashTimer.current);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    void listEvents()
      .then((rows) => {
        if (cancelled) return;
        if (rows.length) applyStoredLog(rows);
        setStorageReady(true);
      })
      .catch(() => {
        if (!cancelled) setStorageReady(true);
      });
    return () => {
      cancelled = true;
    };
    // First paint hydrates the Event Log from IndexedDB.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    if (live) {
      clearAutoTimer();
      setCrisis(false);
      setSelectedId("");
      setSelectedName("");
      setRiskLevel("NORMAL");
      setPanelType("radar");
      setActionText(null);
      setActionOptions(null);
      setFaultId(null);
      setTraining(false);
      setLogEntries([]);
      setToasts([]);
      setSessionEvents([]);
      setReportOpen(false);
      return;
    }
    void listEvents()
      .then((rows) => {
        if (rows.length) applyStoredLog(rows);
        else setLogEntries(logSeed);
        setToasts([]);
      })
      .catch(() => undefined);
    // Switching into LIVE clears the illustrative simulation only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, storageReady]);

  useEffect(() => {
    if (live) {
      setSession({
        scenarioName: "No live picture",
        riskLevel: "NO DATA",
        vessel: "Unconnected deployment",
      });
      return;
    }
    setSession({
      scenarioName: selectedName || "Normal watch",
      riskLevel,
      vessel: "M/Y AURELIA",
    });
  }, [live, selectedName, riskLevel, setSession]);

  const systems = t.bridge.systems.map((name, index) => {
    const id = EQUIPMENT[index]?.id;
    const faulted = id === faultId;
    return {
      id,
      name,
      faulted,
      online: faulted ? false : index !== 4,
    };
  });
  const tone = riskTone(riskLevel);
  const pictureFault =
    faultId === "radar" || faultId === "ais" ? faultId : null;
  const picture = pictureFor(
    panelType,
    selectedId,
    t.bridge.situational,
    pictureFault,
    live,
  );
  const activeScenario = SCENARIOS.find((item) => item.id === selectedId);
  const pictureOverlay =
    faultId === "radar"
      ? "Radar offline — showing AIS/last known positions only"
      : faultId === "ais"
        ? "AIS offline — showing radar tracks only"
        : null;

  function applyScenario(scenario: Scenario) {
    if (live) return;
    clearAutoTimer();
    const critical = scenario.riskLevel === "CRITICAL";
    setSelectedId(scenario.id);
    setSelectedName(scenario.name);
    setRiskLevel(scenario.riskLevel);
    setPanelType(scenario.panelType);
    setActionText(scenario.actionText);
    setActionOptions(critical ? null : scenario.options ?? null);
    setCrisis(critical);
    if (critical) setTraining(false);
    const stamp = nowStamp();
    const nextRows: {
      level: RiskLevel;
      text: string;
      kind: ToastKind;
      scenarioId?: string;
      category?: string;
      actionText?: string;
    }[] = [
      {
        level: scenario.riskLevel,
        text: scenario.logText,
        kind: "scenario",
        scenarioId: scenario.id,
        category: scenario.category,
        actionText: scenario.actionText,
      },
    ];
    if (critical) {
      nextRows.unshift({
        level: "CRITICAL",
        text: `CRISIS MODE ACTIVATED — ${scenario.name}`,
        kind: "crisis",
      });
    }
    pushLogs(nextRows);
    setSessionEvents((events) => [
      ...events,
      {
        timestamp: stamp,
        name: scenario.name,
        category: scenario.category,
        riskLevel: scenario.riskLevel,
        actionText: scenario.actionText,
      },
    ]);
    recordScenario({
      summary: `${scenario.name} · ${scenario.riskLevel}`,
      fullContent: [
        `Scenario: ${scenario.name}`,
        `Category: ${scenario.category}`,
        `Risk: ${scenario.riskLevel}`,
        `Recommendation: ${scenario.actionText}`,
        `Alert: ${scenario.logText}`,
      ].join("\n"),
    });
    const autoRows = !critical ? AUTOMATED_ACTIONS[scenario.id] : undefined;
    if (autoRows?.length) {
      autoTimer.current = window.setTimeout(() => {
        pushLogs(
          autoRows.map((text) => ({
            level: "NORMAL" as const,
            text: `AUTO — ${text}`,
            auto: true,
            kind: "auto" as const,
          })),
        );
      }, 1000);
    }
  }

  function resetToNormal() {
    clearAutoTimer();
    setSelectedId("");
    setSelectedName("");
    setRiskLevel("NORMAL");
    setPanelType("radar");
    setActionText(null);
    setActionOptions(null);
    setCrisis(false);
    setFaultId(null);
    pushLogs([{ level: "NORMAL", text: RESET_LOG, kind: "reset" }]);
  }

  function logRow(level: RiskLevel, text: string, kind: ToastKind) {
    pushLogs([{ level, text, kind }]);
  }

  function restoreFault(id: EquipmentId) {
    setFaultId(null);
    logRow(
      "NORMAL",
      `${equipmentName(id)} connection restored — full capability resumed`,
      "restore",
    );
  }

  function simulateFault(id: EquipmentId) {
    if (faultId === id) return;
    if (faultId) {
      logRow(
        "NORMAL",
        `${equipmentName(faultId)} connection restored — full capability resumed`,
        "restore",
      );
    }
    setFaultId(id);
    logRow(
      "ATTENTION",
      `${equipmentName(id)} connection lost — switching to degraded mode`,
      "fault",
    );
  }

  function logSupportEscalation() {
    pushLogs([
      {
        level: "CRITICAL",
        text: "Escalated to Support Center — connection established",
        kind: "escalate",
      },
    ]);
  }

  const crisis = riskLevel === "CRITICAL" && selectedId !== "";
  const crisisSteps = CRISIS_PROTOCOLS[selectedId] ?? FALLBACK_CRISIS_STEPS;

  return (
    <div
      data-testid="bridge-console"
      className={cn(
        "bg-bridge-bg font-ui text-bridge-text",
        crisis && "border-4 border-crit",
      )}
    >
      {crisis ? (
        <CrisisBanner scenarioName={selectedName} onExit={resetToNormal} />
      ) : null}
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:px-6">
        <p className="hidden max-[599px]:block border border-attn/40 bg-attn/10 px-3 py-2 font-mono text-[11px] text-attn">
          {t.bridge.mobileNotice}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-ui text-2xl font-bold tracking-wide">
              {t.bridge.title}
            </h1>
            <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-bridge-dim">
              {t.bridge.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-start justify-end gap-3">
            <Link
              href="/interface/connections"
              data-testid="connections-map-link"
              className="border border-bridge-text/40 px-3 py-1.5 font-ui text-xs text-bridge-text hover:border-orange hover:text-orange"
            >
              Connections Map
            </Link>
            <ModeToggle />
            <FullscreenButton />
            {crisis || live ? null : (
            <button
              type="button"
              data-testid="training-toggle"
              onClick={() => {
                setTraining((open) => {
                  if (!open) setReportOpen(false);
                  return !open;
                });
              }}
              className={cn(
                "border px-3 py-1.5 font-ui text-xs",
                training
                  ? "border-orange bg-orange text-white"
                  : "border-bridge-text/40 text-bridge-text hover:border-orange hover:text-orange",
              )}
            >
              Training Mode
            </button>
            )}
          {crisis ? null : (
          <div
            data-testid="risk-badge"
            className="border border-bridge-line bg-bridge-panel px-3 py-2 text-end"
          >
            <div className="flex items-center justify-end gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  live ? "bg-bridge-dim" : tone.dot,
                )}
              />
              <span
                className={cn(
                  "font-mono text-sm font-semibold",
                  live ? "text-bridge-dim" : tone.text,
                )}
              >
                {live ? "NO DATA" : riskLevel}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-bridge-dim">
              {t.bridge.riskLevel}
            </p>
          </div>
          )}
          </div>
        </div>

        <div
          data-testid="telemetry-strip"
          className="grid grid-cols-2 gap-3 border border-bridge-line bg-bridge-panel px-3 py-2 sm:grid-cols-4 lg:grid-cols-7"
        >
          {t.bridge.telemetry.map((label, index) => (
            <div key={label}>
              <p className="font-mono text-[9px] tracking-wider text-bridge-dim">
                {label}
              </p>
              <p className="font-mono text-sm text-bridge-text">
                {live ? "—" : TELEMETRY_VALUES[index]}
              </p>
            </div>
          ))}
          <div>
            <p className="font-mono text-[9px] tracking-wider text-bridge-dim">
              UTC
            </p>
            <UtcClock />
          </div>
        </div>

        {faultId ? (
          <DegradedBanner
            faultId={faultId}
            onRestore={() => restoreFault(faultId)}
          />
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <div data-testid="situational-panel">
          <div
            data-testid="picture-scenario-banner"
            className="mb-2 border border-bridge-line bg-bridge-panel px-3 py-2"
          >
            <p className="font-mono text-[10px] tracking-[0.22em] text-orange">
              {activeScenario
                ? "TRAINING LIBRARY · SELECT SCENARIO"
                : "WATCH · SELECT SCENARIO"}
            </p>
            <p className="mt-0.5 font-ui text-lg font-bold tracking-wide text-bridge-text">
              {activeScenario?.name ?? "Normal watch"}
            </p>
            <p className="font-mono text-[10px] text-bridge-dim">
              {activeScenario
                ? `${activeScenario.category} · ${activeScenario.riskLevel}`
                : "Pick a case from the library to load its picture."}
            </p>
          </div>
          <HudPanel
            testId={picture.testId}
            title={picture.title}
            extra={
              <span className="font-mono text-[10px] text-bridge-dim">
                {picture.extra}
              </span>
            }
          >
            <div className="relative">
              <ExpandablePicture>{picture.view}</ExpandablePicture>
              {live ? (
                <p
                  data-testid="live-picture-empty"
                  className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2 border border-bridge-line bg-bridge-panel/90 px-3 py-2.5 text-center font-ui text-xs leading-relaxed text-bridge-text"
                >
                  No live sensors connected — this view activates once
                  radar/AIS/camera equipment is integrated.
                </p>
              ) : null}
              {pictureOverlay && !live ? (
                <p
                  data-testid="picture-degraded-overlay"
                  className="pointer-events-none absolute inset-x-2 bottom-2 border border-attn/60 bg-attn/20 px-2 py-1.5 font-mono text-[11px] text-attn"
                >
                  {pictureOverlay}
                </p>
              ) : null}
            </div>
          </HudPanel>
          </div>

          <div className="flex flex-col gap-4">
            {crisis ? (
              <CrisisProtocolPanel
                steps={crisisSteps}
                onEscalated={logSupportEscalation}
              />
            ) : (
              <>
            <HudPanel testId="risk-level-panel" title={t.bridge.riskLevel}>
              <ul className="space-y-2">
                {RISK_KEYS.map((key, index) => {
                  const active = !live && key === riskLevel;
                  return (
                    <li key={key} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "w-24 font-ui text-xs",
                          active
                            ? "font-bold text-bridge-text"
                            : "text-bridge-dim",
                        )}
                      >
                        {t.bridge.risks[index]}
                      </span>
                      <span
                        className={cn(
                          "h-1.5 flex-1",
                          RISK_BARS[index],
                          active ? "opacity-100" : "opacity-25",
                        )}
                      />
                    </li>
                  );
                })}
              </ul>
            </HudPanel>

            <HudPanel
              testId="connected-systems-panel"
              title={t.bridge.connected}
              extra={
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <label className="sr-only" htmlFor="simulate-fault">
                    Simulate equipment fault
                  </label>
                  <select
                    id="simulate-fault"
                    data-testid="simulate-fault"
                    value=""
                    disabled={live}
                    title={
                      live
                        ? "Scenario simulation is a DEMO mode feature."
                        : undefined
                    }
                    onChange={(event) => {
                      const next = event.target.value as EquipmentId;
                      if (next) simulateFault(next);
                    }}
                    className="max-w-[11rem] border border-bridge-line bg-bridge-bg px-2 py-1 font-ui text-[11px] text-bridge-text disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <option value="">Simulate equipment fault</option>
                    {EQUIPMENT.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              }
            >
              <ul className="space-y-1.5">
                {systems.map((system) => (
                  <li
                    key={system.name}
                    data-testid={system.id ? `system-row-${system.id}` : undefined}
                    className="flex items-center justify-between gap-3 font-mono text-xs"
                  >
                    <span className="text-bridge-text">{system.name}</span>
                    <span
                      className={cn(
                        "flex items-center gap-2",
                        live
                          ? "text-bridge-dim"
                          : system.faulted
                            ? "text-crit"
                            : "text-bridge-dim",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          live
                            ? "bg-bridge-dim"
                            : system.faulted
                              ? "bg-crit"
                              : system.online
                                ? "bg-ok"
                                : "bg-bridge-dim",
                        )}
                      />
                      {live
                        ? "Not connected"
                        : system.faulted
                          ? "Offline"
                          : system.online
                            ? t.bridge.online
                            : t.bridge.standby}
                    </span>
                  </li>
                ))}
              </ul>
            </HudPanel>

            <HudPanel testId="recommended-action-panel" title={t.bridge.recommended}>
              <span
                className={cn(
                  "inline-block border px-2 py-0.5 font-mono text-[10px] tracking-wider",
                  live ? "border-bridge-line text-bridge-dim" : tone.chip,
                )}
              >
                {live ? "NO DATA" : riskLevel}
              </span>
              {live ? (
                <p className="mt-3 text-sm leading-relaxed text-bridge-dim">
                  No recommendation — waiting for equipment integration.
                </p>
              ) : actionOptions ? (
                <RankedActionList options={actionOptions} />
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-bridge-dim">
                  {actionText ?? t.bridge.normalAdvice}
                </p>
              )}
            </HudPanel>
              </>
            )}
          </div>
        </div>

        <div className={crisis ? "hidden" : undefined}>
        <ScenarioLibrary
          selectedId={selectedId}
          disabled={live}
          onSelect={applyScenario}
          onReset={resetToNormal}
          onReport={() => {
            const generatedAt = new Date();
            setTraining(false);
            setReportAt(generatedAt);
            setReportOpen(true);
            void putSessionReport({
              id: `rpt-${generatedAt.toISOString()}`,
              timestamp: generatedAt.toISOString(),
              generatedAt: generatedAt.toISOString(),
              vesselName: "M/Y AURELIA",
              events: sessionEvents,
            }).catch(() => undefined);
          }}
        />
        </div>

        <HudPanel
          id="event-log-panel"
          testId="event-log-panel"
          title={t.bridge.eventLog}
          extra={
            live ? (
              <span className="font-mono text-[10px] text-bridge-dim">NO FEED</span>
            ) : (
            <span className="flex items-center gap-1.5 text-ok">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
              {t.bridge.live}
            </span>
            )
          }
        >
          {live ? (
            <p
              data-testid="event-log-empty"
              className="py-6 text-center font-ui text-sm text-bridge-dim"
            >
              No events — no equipment connected yet.
            </p>
          ) : (
          <>
          <p
            data-testid="event-log-legend"
            className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-bridge-dim"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 bg-orange" />
              Human decision required
            </span>
            <span className="inline-flex items-center gap-1.5 text-ok">
              <GearMark />
              Automated (procedural only)
            </span>
          </p>
          <ul className="max-h-56 space-y-2 overflow-y-auto pe-1">
            {logEntries.map((entry, index) => (
              <li
                key={entry.id}
                data-log-row={entry.id}
                data-testid={
                  entry.auto
                    ? `auto-log-row-${index}`
                    : index === 0
                      ? "event-log-newest-row"
                      : undefined
                }
                className={cn(
                  "grid grid-cols-[auto_auto_auto_1fr] items-start gap-3 font-mono text-xs",
                  entry.auto && "border-l-2 border-ok bg-ok/10 py-1.5 ps-2",
                  flashId === entry.id &&
                    (entry.level === "CRITICAL"
                      ? "event-log-flash-crit"
                      : "event-log-flash"),
                )}
              >
                <span className="mt-0.5 flex w-3.5 justify-center">
                  {entry.auto ? (
                    <GearMark />
                  ) : (
                    <span
                      className={cn(
                        "mt-1 block h-2 w-2",
                        entry.level === "CRITICAL"
                          ? "bg-crit"
                          : entry.level === "ELEVATED"
                            ? "bg-orange"
                            : entry.level === "ATTENTION"
                              ? "bg-attn"
                              : "bg-bridge-line",
                      )}
                    />
                  )}
                </span>
                <span className="text-bridge-dim">{entry.time}</span>
                <span
                  className={cn(
                    "border px-1.5 py-0.5",
                    entry.auto ? "border-ok text-ok" : levelClass(entry.level),
                  )}
                >
                  {entry.auto ? "AUTO" : entry.level}
                </span>
                <span className={entry.auto ? "text-ok" : "text-bridge-text"}>
                  {entry.text}
                </span>
              </li>
            ))}
          </ul>
          </>
          )}
        </HudPanel>

        <p className="font-mono text-[11px] text-bridge-dim">{t.bridge.disclaimer}</p>
      </div>
      <TrainingTour active={training} onClose={() => setTraining(false)} />
      {reportOpen && reportAt ? (
        <SessionReport
          events={sessionEvents}
          generatedAt={reportAt}
          onBack={() => setReportOpen(false)}
        />
      ) : null}
      <EventToasts
        toasts={toasts}
        onDismiss={dismissToast}
        onOpen={openLogRow}
      />
    </div>
  );
}
