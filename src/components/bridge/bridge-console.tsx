"use client";

import { useState } from "react";
import { BridgeRadar } from "@/components/bridge/bridge-radar";
import { HudPanel } from "@/components/bridge/hud-panel";
import { PerimeterView } from "@/components/bridge/perimeter-panel";
import { FullscreenButton } from "@/components/bridge/fullscreen-button";
import { SessionReport } from "@/components/bridge/session-report";
import { TrainingTour } from "@/components/bridge/training-tour";
import { SonarView } from "@/components/bridge/sonar-panel";
import { SpectrumView } from "@/components/bridge/spectrum-panel";
import { UtcClock } from "@/components/bridge/utc-clock";
import { usePreferences } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";
import {
  PANEL_CHROME,
  RESET_LOG,
  SCENARIO_CATEGORIES,
  SCENARIOS,
  type PanelType,
  type RiskLevel,
  type Scenario,
  type SessionEvent,
} from "@/lib/scenarios";

type LogEntry = {
  time: string;
  level: RiskLevel;
  text: string;
};

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

function pictureFor(panelType: PanelType, showNewContact: boolean, situational: string, contacts4: string, contacts5: string) {
  if (panelType === "radar") {
    return {
      testId: "radar-panel",
      title: situational,
      extra: showNewContact ? contacts5 : contacts4,
      view: <BridgeRadar showNewContact={showNewContact} />,
    };
  }
  const chrome = PANEL_CHROME[panelType];
  return {
    testId: chrome.testId,
    title: chrome.title,
    extra: chrome.extra,
    view:
      panelType === "sonar" ? (
        <SonarView />
      ) : panelType === "spectrum" ? (
        <SpectrumView />
      ) : (
        <PerimeterView />
      ),
  };
}

export function BridgeConsole() {
  const { t } = usePreferences();
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("NORMAL");
  const [panelType, setPanelType] = useState<PanelType>("radar");
  const [actionText, setActionText] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [logSeed] = useState(() => [
    { time: "14:32:07", level: "NORMAL" as const, text: t.bridge.log[0] },
    { time: "14:18:44", level: "NORMAL" as const, text: t.bridge.log[1] },
    { time: "13:55:12", level: "ATTENTION" as const, text: t.bridge.log[2] },
    { time: "13:40:03", level: "NORMAL" as const, text: t.bridge.log[3] },
    { time: "13:12:58", level: "NORMAL" as const, text: t.bridge.log[4] },
  ]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>(logSeed);
  const [showNewContact, setShowNewContact] = useState(false);
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportAt, setReportAt] = useState<Date | null>(null);
  const [training, setTraining] = useState(false);

  const systems = t.bridge.systems.map((name, index) => ({
    name,
    online: index !== 4,
  }));
  const tone = riskTone(riskLevel);
  const picture = pictureFor(
    panelType,
    showNewContact,
    t.bridge.situational,
    t.bridge.contacts4,
    t.bridge.contacts5,
  );

  function applyScenario(scenario: Scenario) {
    setSelectedId(scenario.id);
    setRiskLevel(scenario.riskLevel);
    setPanelType(scenario.panelType);
    setActionText(scenario.actionText);
    setShowNewContact(scenario.panelType === "radar");
    const stamp = nowStamp();
    setLogEntries((entries) => [
      { time: stamp, level: scenario.riskLevel, text: scenario.logText },
      ...entries,
    ]);
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
  }

  function resetToNormal() {
    setSelectedId("");
    setRiskLevel("NORMAL");
    setPanelType("radar");
    setActionText(null);
    setShowNewContact(false);
    setLogEntries((entries) => [
      { time: nowStamp(), level: "NORMAL", text: RESET_LOG },
      ...entries,
    ]);
  }

  return (
    <div className="bg-bridge-bg font-ui text-bridge-text">
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
            <FullscreenButton />
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
          <div
            data-testid="risk-badge"
            className="border border-bridge-line bg-bridge-panel px-3 py-2 text-end"
          >
            <div className="flex items-center justify-end gap-2">
              <span className={cn("h-2 w-2 rounded-full", tone.dot)} />
              <span className={cn("font-mono text-sm font-semibold", tone.text)}>
                {riskLevel}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-bridge-dim">
              {t.bridge.riskLevel}
            </p>
          </div>
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
                {TELEMETRY_VALUES[index]}
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

        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <div data-testid="situational-panel">
          <HudPanel
            testId={picture.testId}
            title={picture.title}
            extra={
              <span className="font-mono text-[10px] text-bridge-dim">
                {picture.extra}
              </span>
            }
          >
            {picture.view}
          </HudPanel>
          </div>

          <div className="flex flex-col gap-4">
            <HudPanel testId="risk-level-panel" title={t.bridge.riskLevel}>
              <ul className="space-y-2">
                {RISK_KEYS.map((key, index) => {
                  const active = key === riskLevel;
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

            <HudPanel testId="connected-systems-panel" title={t.bridge.connected}>
              <ul className="space-y-1.5">
                {systems.map((system) => (
                  <li
                    key={system.name}
                    className="flex items-center justify-between gap-3 font-mono text-xs"
                  >
                    <span className="text-bridge-text">{system.name}</span>
                    <span className="flex items-center gap-2 text-bridge-dim">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          system.online ? "bg-ok" : "bg-bridge-dim",
                        )}
                      />
                      {system.online ? t.bridge.online : t.bridge.standby}
                    </span>
                  </li>
                ))}
              </ul>
            </HudPanel>

            <HudPanel testId="recommended-action-panel" title={t.bridge.recommended}>
              <span
                className={cn(
                  "inline-block border px-2 py-0.5 font-mono text-[10px] tracking-wider",
                  tone.chip,
                )}
              >
                {riskLevel}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-bridge-dim">
                {actionText ?? t.bridge.normalAdvice}
              </p>
            </HudPanel>
          </div>
        </div>

        <HudPanel
          testId="event-log-panel"
          title={t.bridge.eventLog}
          extra={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="flex items-center gap-1.5 text-ok">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
                {t.bridge.live}
              </span>
              <div data-testid="scenario-picker" className="w-full min-w-[12rem] sm:w-auto">
              <label htmlFor="scenario-select" className="sr-only">
                Scenario
              </label>
              <select
                id="scenario-select"
                data-testid="scenario-select"
                value={selectedId}
                onChange={(event) => {
                  const next = SCENARIOS.find((item) => item.id === event.target.value);
                  if (next) applyScenario(next);
                }}
                className="w-full max-w-full border border-bridge-line bg-bridge-panel px-2 py-1 font-ui text-xs text-bridge-text outline-none focus:border-orange sm:max-w-[16rem]"
              >
                <option value="">Select a scenario…</option>
                {SCENARIO_CATEGORIES.map((category) => (
                  <optgroup key={category} label={category}>
                    {SCENARIOS.filter((item) => item.category === category).map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              </div>
              <button
                type="button"
                data-testid="reset-normal"
                onClick={resetToNormal}
                className="border border-bridge-text/40 px-3 py-1 font-ui text-xs text-bridge-text hover:border-bridge-text"
              >
                Reset to Normal
              </button>
              <button
                type="button"
                data-testid="generate-report"
                onClick={() => {
                  setTraining(false);
                  setReportAt(new Date());
                  setReportOpen(true);
                }}
                className="bg-orange px-3 py-1 font-ui text-xs font-medium text-white hover:bg-orange/90"
              >
                Generate report
              </button>
            </div>
          }
        >
          <ul className="max-h-56 space-y-2 overflow-y-auto pe-1">
            {logEntries.map((entry, index) => (
              <li
                key={`${entry.time}-${index}`}
                data-testid={index === 0 ? "event-log-newest-row" : undefined}
                className="grid grid-cols-[auto_auto_1fr] items-start gap-3 font-mono text-xs"
              >
                <span className="text-bridge-dim">{entry.time}</span>
                <span className={cn("border px-1.5 py-0.5", levelClass(entry.level))}>
                  {entry.level}
                </span>
                <span className="text-bridge-text">{entry.text}</span>
              </li>
            ))}
          </ul>
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
    </div>
  );
}
