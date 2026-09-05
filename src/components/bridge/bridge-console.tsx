"use client";

import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { BridgeRadar } from "@/components/bridge/bridge-radar";
import { HudPanel } from "@/components/bridge/hud-panel";
import { UtcClock } from "@/components/bridge/utc-clock";
import { usePreferences } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";

type RiskLevel = "NORMAL" | "ELEVATED";

type LogLevel = "NORMAL" | "ATTENTION" | "ELEVATED" | "CRITICAL";

type LogEntry = {
  time: string;
  level: LogLevel;
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

function levelClass(level: LogLevel) {
  if (level === "NORMAL") return "text-ok border-ok/40";
  if (level === "ATTENTION") return "text-attn border-attn/40";
  if (level === "ELEVATED") return "text-orange border-orange/40";
  return "text-crit border-crit/40";
}

export function BridgeConsole() {
  const { t } = usePreferences();
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("NORMAL");
  const [logSeed] = useState(() => [
    { time: "14:32:07", level: "NORMAL" as const, text: t.bridge.log[0] },
    { time: "14:18:44", level: "NORMAL" as const, text: t.bridge.log[1] },
    { time: "13:55:12", level: "ATTENTION" as const, text: t.bridge.log[2] },
    { time: "13:40:03", level: "NORMAL" as const, text: t.bridge.log[3] },
    { time: "13:12:58", level: "NORMAL" as const, text: t.bridge.log[4] },
  ]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>(logSeed);
  const [showNewContact, setShowNewContact] = useState(false);

  const elevated = riskLevel === "ELEVATED";
  const systems = t.bridge.systems.map((name, index) => ({
    name,
    online: index !== 4,
  }));

  function simulateAlert() {
    setRiskLevel("ELEVATED");
    setShowNewContact(true);
    setLogEntries((entries) => [
      { time: nowStamp(), level: "ELEVATED", text: t.bridge.elevatedAdvice },
      ...entries,
    ]);
  }

  function resolveReset() {
    setRiskLevel("NORMAL");
    setShowNewContact(false);
    setLogEntries((entries) => [
      { time: nowStamp(), level: "NORMAL", text: t.bridge.resolveLog },
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
          <div className="border border-bridge-line bg-bridge-panel px-3 py-2 text-end">
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
            <p className="mt-1 font-mono text-[10px] text-bridge-dim">
              {t.bridge.riskLevel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border border-bridge-line bg-bridge-panel px-3 py-2 sm:grid-cols-4 lg:grid-cols-7">
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
          <HudPanel
            title={t.bridge.situational}
            extra={
              <span className="font-mono text-[10px] text-bridge-dim">
                {showNewContact ? t.bridge.contacts5 : t.bridge.contacts4}
              </span>
            }
          >
            <BridgeRadar showNewContact={showNewContact} />
          </HudPanel>

          <div className="flex flex-col gap-4">
            <HudPanel title={t.bridge.riskLevel}>
              <ul className="space-y-2">
                {RISK_KEYS.map((key, index) => {
                  const active =
                    (key === "NORMAL" && !elevated) ||
                    (key === "ELEVATED" && elevated);
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

            <HudPanel title={t.bridge.connected}>
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

            <HudPanel title={t.bridge.recommended}>
              <span className="inline-block border border-orange px-2 py-0.5 font-mono text-[10px] tracking-wider text-orange">
                {riskLevel}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-bridge-dim">
                {elevated ? t.bridge.elevatedAdvice : t.bridge.normalAdvice}
              </p>
            </HudPanel>
          </div>
        </div>

        <HudPanel
          title={t.bridge.eventLog}
          extra={
            <div className="flex flex-wrap items-center justify-end gap-3">
              <span className="flex items-center gap-1.5 text-ok">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
                {t.bridge.live}
              </span>
              {elevated ? (
                <button
                  type="button"
                  onClick={resolveReset}
                  className="border border-bridge-text/40 px-3 py-1 font-ui text-xs text-bridge-text hover:border-bridge-text"
                >
                  {t.bridge.resolve}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={simulateAlert}
                  className="bg-orange px-3 py-1 font-ui text-xs font-medium text-white hover:bg-orange/90"
                >
                  {t.bridge.simulate}
                </button>
              )}
            </div>
          }
        >
          <ul className="max-h-56 space-y-2 overflow-y-auto pe-1">
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

        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-bridge-dim">
          <BrandLogo className="h-5" />
          <p>{t.bridge.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
