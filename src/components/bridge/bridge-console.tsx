"use client";

import { useState } from "react";
import { BridgeRadar } from "@/components/bridge/bridge-radar";
import { HudPanel } from "@/components/bridge/hud-panel";
import { UtcClock } from "@/components/bridge/utc-clock";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/cn";

type RiskLevel = "NORMAL" | "ELEVATED";

type LogLevel = "NORMAL" | "ATTENTION" | "ELEVATED" | "CRITICAL";

type LogEntry = {
  time: string;
  level: LogLevel;
  text: string;
};

const INITIAL_LOG: LogEntry[] = [
  {
    time: "14:32:07",
    level: "NORMAL",
    text: "Contact SIRENA reclassified — known vessel, marina neighbor",
  },
  {
    time: "14:18:44",
    level: "NORMAL",
    text: "Perimeter sensor 3 — routine check, no anomaly",
  },
  {
    time: "13:55:12",
    level: "ATTENTION",
    text: "Unidentified contact entered 6 NM range, no AIS signal",
  },
  {
    time: "13:40:03",
    level: "NORMAL",
    text: "Route update accepted — next waypoint 41°19'N 002°05'E",
  },
  {
    time: "13:12:58",
    level: "NORMAL",
    text: "Shift handover — Support Center acknowledged",
  },
];

const NORMAL_ADVICE =
  "Picture is stable. Known traffic holding. Maintain standard watch and keep the unidentified contact on the plot.";

const ELEVATED_ADVICE =
  "Unidentified contact closing at 8 kn on an intercept-like bearing, no AIS response after two attempts. Recommend: hail on VHF ch.16, increase watch, prepare to alter course if range closes below 1.0 NM.";

const RESOLVE_LOG =
  "Contact hailed and identified — local fishing vessel, no AIS fitted. Risk level reset.";

const RISK_ROWS = [
  { key: "NORMAL", label: "Normal", bar: "bg-ok" },
  { key: "ATTENTION", label: "Attention", bar: "bg-attn" },
  { key: "ELEVATED", label: "Elevated", bar: "bg-orange" },
  { key: "CRITICAL", label: "Critical", bar: "bg-crit" },
] as const;

const SYSTEMS = [
  { name: "Radar", status: "Online" },
  { name: "AIS", status: "Online" },
  { name: "CCTV · 6 cameras", status: "Online" },
  { name: "Perimeter sensors", status: "Online" },
  { name: "Sonar", status: "Standby" },
  { name: "Satcom link", status: "Online" },
] as const;

const TELEMETRY = [
  { label: "VESSEL", value: "M/Y AURELIA" },
  { label: "POSITION", value: "41°23'06\"N 002°11'42\"E" },
  { label: "HEADING", value: "247° TRUE" },
  { label: "SPEED", value: "11.4 KN" },
  { label: "WIND", value: "14 KN NE" },
  { label: "DEPTH", value: "62 M" },
];

function nowStamp() {
  return new Date().toISOString().slice(11, 19);
}

function levelClass(level: LogLevel) {
  if (level === "NORMAL") return "text-ok border-ok/40";
  if (level === "ATTENTION") return "text-attn border-attn/40";
  if (level === "ELEVATED") return "text-orange border-orange/40";
  return "text-crit border-crit/40";
}

export function BridgeConsole() {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("NORMAL");
  const [logEntries, setLogEntries] = useState<LogEntry[]>(INITIAL_LOG);
  const [showNewContact, setShowNewContact] = useState(false);

  const elevated = riskLevel === "ELEVATED";

  function simulateAlert() {
    setRiskLevel("ELEVATED");
    setShowNewContact(true);
    setLogEntries((entries) => [
      { time: nowStamp(), level: "ELEVATED", text: ELEVATED_ADVICE },
      ...entries,
    ]);
  }

  function resolveReset() {
    setRiskLevel("NORMAL");
    setShowNewContact(false);
    setLogEntries((entries) => [
      { time: nowStamp(), level: "NORMAL", text: RESOLVE_LOG },
      ...entries,
    ]);
  }

  return (
    <div className="bg-bridge-bg font-ui text-bridge-text">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:px-6">
        <p className="hidden max-[599px]:block border border-attn/40 bg-attn/10 px-3 py-2 font-mono text-[11px] text-attn">
          This interface is best viewed on a larger screen.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-ui text-2xl font-bold tracking-wide">AGRON Bridge</h1>
            <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-bridge-dim">
              CAPTAIN / SECURITY OFFICER INTERFACE
            </p>
          </div>
          <div className="border border-bridge-line bg-bridge-panel px-3 py-2 text-right">
            <div className="flex items-center justify-end gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  elevated ? "bg-orange" : "bg-ok",
                )}
              />
              <span
                className={cn(
                  "font-mono text-sm font-semibold",
                  elevated ? "text-orange" : "text-ok",
                )}
              >
                {riskLevel}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-bridge-dim">RISK LEVEL</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border border-bridge-line bg-bridge-panel px-3 py-2 sm:grid-cols-4 lg:grid-cols-7">
          {TELEMETRY.map((item) => (
            <div key={item.label}>
              <p className="font-mono text-[9px] tracking-wider text-bridge-dim">
                {item.label}
              </p>
              <p className="font-mono text-sm text-bridge-text">{item.value}</p>
            </div>
          ))}
          <div>
            <p className="font-mono text-[9px] tracking-wider text-bridge-dim">UTC</p>
            <UtcClock />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <HudPanel
            title="SITUATIONAL PICTURE"
            extra={
              <span className="font-mono text-[10px] text-bridge-dim">
                {showNewContact
                  ? "RANGE 6.0 NM · 5 CONTACTS"
                  : "RANGE 6.0 NM · 4 CONTACTS"}
              </span>
            }
          >
            <BridgeRadar showNewContact={showNewContact} />
          </HudPanel>

          <div className="flex flex-col gap-4">
            <HudPanel title="RISK LEVEL">
              <ul className="space-y-2">
                {RISK_ROWS.map((row) => {
                  const active =
                    (row.key === "NORMAL" && !elevated) ||
                    (row.key === "ELEVATED" && elevated);
                  return (
                    <li key={row.key} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "w-24 font-ui text-xs",
                          active
                            ? "font-bold text-bridge-text"
                            : "text-bridge-dim",
                        )}
                      >
                        {row.label}
                      </span>
                      <span
                        className={cn(
                          "h-1.5 flex-1",
                          row.bar,
                          active ? "opacity-100" : "opacity-25",
                        )}
                      />
                    </li>
                  );
                })}
              </ul>
            </HudPanel>

            <HudPanel title="CONNECTED SYSTEMS">
              <ul className="space-y-1.5">
                {SYSTEMS.map((system) => {
                  const online = system.status === "Online";
                  return (
                    <li
                      key={system.name}
                      className="flex items-center justify-between gap-3 font-mono text-xs"
                    >
                      <span className="text-bridge-text">{system.name}</span>
                      <span className="flex items-center gap-2 text-bridge-dim">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            online ? "bg-ok" : "bg-bridge-dim",
                          )}
                        />
                        {system.status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </HudPanel>

            <HudPanel title="RECOMMENDED ACTION">
              <span className="inline-block border border-orange px-2 py-0.5 font-mono text-[10px] tracking-wider text-orange">
                {riskLevel}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-bridge-dim">
                {elevated ? ELEVATED_ADVICE : NORMAL_ADVICE}
              </p>
            </HudPanel>
          </div>
        </div>

        <HudPanel
          title="EVENT LOG"
          extra={
            <div className="flex flex-wrap items-center justify-end gap-3">
              <span className="flex items-center gap-1.5 text-ok">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
                LIVE
              </span>
              {elevated ? (
                <button
                  type="button"
                  onClick={resolveReset}
                  className="border border-bridge-text/40 px-3 py-1 font-ui text-xs text-bridge-text hover:border-bridge-text"
                >
                  Resolve & reset
                </button>
              ) : (
                <button
                  type="button"
                  onClick={simulateAlert}
                  className="bg-orange px-3 py-1 font-ui text-xs font-medium text-white hover:bg-orange/90"
                >
                  Simulate alert
                </button>
              )}
            </div>
          }
        >
          <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {logEntries.map((entry, index) => (
              <li
                key={`${entry.time}-${index}`}
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

        <p className="font-mono text-[11px] text-bridge-dim">
          © AGRON Inc. · <Wordmark className="text-[11px]" /> — demo interface,
          illustrative data, not a live vessel.
        </p>
      </div>
    </div>
  );
}
