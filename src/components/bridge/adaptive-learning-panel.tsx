"use client";

import { useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { cn } from "@/lib/cn";
import { useCrisisMode } from "@/lib/crisis-mode";

const MONO = "var(--font-jetbrains), ui-monospace, monospace";

const DAYS = [
  {
    id: "1",
    label: "Day 1",
    stats:
      "Known vessels in area: 3 · Baseline established: No · False-positive rate: Not yet measured",
    blurb: "StarWall has no history yet for this object — every contact is treated as new.",
  },
  {
    id: "30",
    label: "Day 30",
    stats:
      "Known vessels in area: 14 · Baseline established: Partial · False-positive rate: ~22%",
    blurb:
      "A baseline is forming. StarWall recognizes regular traffic but still flags some routine activity for review.",
  },
  {
    id: "90",
    label: "Day 90",
    stats:
      "Known vessels in area: 37 · Baseline established: Yes · False-positive rate: ~6%",
    blurb:
      "StarWall reliably distinguishes routine activity from genuine anomalies for this specific object.",
  },
] as const;

export function AdaptiveLearningPanel() {
  const [day, setDay] = useState<(typeof DAYS)[number]["id"]>("1");
  const [expanded, setExpanded] = useState(true);
  const { crisis } = useCrisisMode();
  const current = DAYS.find((item) => item.id === day) ?? DAYS[0];
  if (crisis) return null;

  return (
    <div className="dark bg-bridge-bg px-4 pb-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <HudPanel
          testId="adaptive-learning-panel"
          title="OBJECT PROFILE — LEARNING OVER TIME"
          extra={
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-[10px] text-bridge-dim sm:inline">
                ILLUSTRATIVE SIMULATION
              </span>
              <button
                type="button"
                data-testid="learning-toggle"
                onClick={() => setExpanded((open) => !open)}
                className="font-ui text-xs text-orange hover:underline"
              >
                {expanded ? "Hide" : "Show"}
              </button>
            </div>
          }
        >
          {expanded ? (
          <>
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Learning timeline">
            {DAYS.map((item) => {
              const active = item.id === day;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-testid={`learning-day-${item.id}`}
                  onClick={() => setDay(item.id)}
                  className={cn(
                    "px-3 py-1.5 font-ui text-xs",
                    active
                      ? "bg-orange text-white"
                      : "border border-bridge-line text-bridge-dim hover:border-orange hover:text-orange",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden bg-[#0A0F14]">
            <svg viewBox="0 0 680 280" className="h-auto w-full">
              <rect x="40" y="24" width="600" height="232" fill="none" stroke="#223039" strokeWidth="1.4" />
              <rect x="80" y="48" width="160" height="88" fill="#0D161C" stroke="#223039" strokeWidth="1" />
              <text x="160" y="96" textAnchor="middle" fontFamily={MONO} fontSize="10" fill="#7C8894">
                ZONE A
              </text>
              <rect x="360" y="56" width="180" height="80" fill="#0D161C" stroke="#223039" strokeWidth="1" />
              <text x="450" y="100" textAnchor="middle" fontFamily={MONO} fontSize="10" fill="#7C8894">
                ZONE B
              </text>

              {day === "1" ? (
                <ellipse
                  cx="160"
                  cy="200"
                  rx="36"
                  ry="16"
                  fill="#F15A00"
                  fillOpacity="0.18"
                  stroke="#F15A00"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
              ) : null}

              {day === "30" || day === "90" ? (
                <>
                  <path
                    d="M80 220 C 140 210, 180 190, 160 140"
                    fill="none"
                    stroke="#F15A00"
                    strokeOpacity={day === "90" ? 0.55 : 0.35}
                    strokeWidth={day === "90" ? 10 : 7}
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="160"
                    cy="92"
                    rx={day === "90" ? 78 : 52}
                    ry={day === "90" ? 48 : 34}
                    fill="#F15A00"
                    fillOpacity={day === "90" ? 0.22 : 0.14}
                    stroke="#F15A00"
                    strokeOpacity="0.4"
                    strokeWidth="1"
                  />
                  <ellipse
                    cx="450"
                    cy="200"
                    rx={day === "90" ? 70 : 40}
                    ry={day === "90" ? 28 : 18}
                    fill="#F15A00"
                    fillOpacity={day === "90" ? 0.2 : 0.12}
                    stroke="#F15A00"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                  />
                </>
              ) : null}

              {day === "90" ? (
                <>
                  <ellipse
                    cx="450"
                    cy="96"
                    rx="88"
                    ry="46"
                    fill="#F15A00"
                    fillOpacity="0.2"
                    stroke="#F15A00"
                    strokeOpacity="0.45"
                    strokeWidth="1"
                  />
                  <path
                    d="M48 40 H 632 V 248 H 48 Z"
                    fill="none"
                    stroke="#F15A00"
                    strokeOpacity="0.28"
                    strokeWidth="6"
                    strokeDasharray="18 14"
                  />
                </>
              ) : null}

              <text x="340" y="268" textAnchor="middle" fontFamily={MONO} fontSize="9" fill="#7C8894">
                KNOWN NORMAL ACTIVITY
              </text>
            </svg>
          </div>

          <p
            data-testid="learning-stats"
            className="mt-4 font-mono text-xs leading-relaxed text-bridge-text"
          >
            {current.stats}
          </p>
          <p data-testid="learning-blurb" className="mt-2 text-sm leading-relaxed text-bridge-dim">
            {current.blurb}
          </p>
          <p className="mt-4 text-xs italic text-bridge-dim">
            Illustrative simulation of the learning process — actual timelines and accuracy
            depend on the object and available data.
          </p>
          </>
          ) : (
            <p className="font-mono text-[10px] text-bridge-dim">
              ILLUSTRATIVE SIMULATION
            </p>
          )}
        </HudPanel>
      </div>
    </div>
  );
}
