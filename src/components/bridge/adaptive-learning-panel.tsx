"use client";

import { useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { cn } from "@/lib/cn";
import { useCrisisMode } from "@/lib/crisis-mode";
import { useHud } from "@/lib/i18n/use-hud";
import { useAppMode } from "@/lib/mode";

const MONO = "var(--font-jetbrains), ui-monospace, monospace";

type DayId = "1" | "30" | "90";

export function AdaptiveLearningPanel() {
  const { hud } = useHud();
  const [day, setDay] = useState<DayId>("1");
  const [expanded, setExpanded] = useState(true);
  const { crisis } = useCrisisMode();
  const { live } = useAppMode();
  const days = [
    { id: "1" as const, label: hud.learning.day1, stats: hud.learning.stats1, blurb: hud.learning.blurb1 },
    { id: "30" as const, label: hud.learning.day30, stats: hud.learning.stats30, blurb: hud.learning.blurb30 },
    { id: "90" as const, label: hud.learning.day90, stats: hud.learning.stats90, blurb: hud.learning.blurb90 },
  ];
  const current = days.find((item) => item.id === day) ?? days[0];
  if (crisis) return null;

  return (
    <div className="dark bg-bridge-bg px-4 pb-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <HudPanel
          id="adaptive-learning-panel"
          testId="adaptive-learning-panel"
          className="scroll-mt-20"
          title={hud.learning.title}
          extra={
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-[10px] text-bridge-dim sm:inline">
                {live ? hud.learning.noHistory : hud.learning.illustrative}
              </span>
              <button
                type="button"
                data-testid="learning-toggle"
                onClick={() => setExpanded((open) => !open)}
                className="font-ui text-xs text-orange hover:underline"
              >
                {expanded ? hud.learning.hide : hud.learning.show}
              </button>
            </div>
          }
        >
          {expanded ? (
          <>
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label={hud.learning.timeline}>
            {live ? (
              <span
                className="bg-orange px-3 py-1.5 font-ui text-xs text-white"
                data-testid="learning-day-0"
              >
                {hud.learning.day0}
              </span>
            ) : null}
            {days.map((item) => {
              const locked = live && item.id !== "1";
              const active = !live && item.id === day;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-testid={`learning-day-${item.id}`}
                  disabled={locked}
                  title={locked ? hud.learning.lockedTip : undefined}
                  onClick={() => {
                    if (!locked) setDay(item.id);
                  }}
                  className={cn(
                    "px-3 py-1.5 font-ui text-xs",
                    live && item.id === "1" && "hidden",
                    active
                      ? "bg-orange text-white"
                      : "border border-bridge-line text-bridge-dim hover:border-orange hover:text-orange",
                    locked && "cursor-not-allowed opacity-40 hover:border-bridge-line hover:text-bridge-dim",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {live ? (
            <p
              data-testid="learning-live-empty"
              className="border border-bridge-line bg-bridge-bg px-4 py-6 font-ui text-sm text-bridge-dim"
            >
              {hud.learning.liveEmpty}
            </p>
          ) : (
          <>
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
                {hud.learning.knownActivity}
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
            {hud.learning.footnote}
          </p>
          </>
          )}
          </>
          ) : (
            <p className="font-mono text-[10px] text-bridge-dim">
              {hud.learning.illustrative}
            </p>
          )}
        </HudPanel>
      </div>
    </div>
  );
}
