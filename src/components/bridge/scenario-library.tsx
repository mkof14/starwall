"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  SCENARIO_CATEGORIES,
  SCENARIOS,
  type RiskLevel,
  type Scenario,
} from "@/lib/scenarios";

type ScenarioLibraryProps = {
  selectedId: string;
  onSelect: (scenario: Scenario) => void;
  onReset: () => void;
  onReport: () => void;
};

const SECTION_SHORT: Record<string, string> = {
  Air: "AIR",
  Surface: "SURFACE",
  Underwater: "UNDERWATER",
  "RF / Electronic Warfare": "RF / EW",
  "Perimeter & Access": "PERIMETER",
  "Complex / Crisis": "CRISIS",
};

function riskChip(level: Exclude<RiskLevel, "NORMAL">) {
  if (level === "ATTENTION") return "text-attn border-attn/60 bg-attn/10";
  if (level === "ELEVATED") return "text-orange border-orange/60 bg-orange/10";
  return "text-crit border-crit/60 bg-crit/10";
}

export function ScenarioLibrary({
  selectedId,
  onSelect,
  onReset,
  onReport,
}: ScenarioLibraryProps) {
  const [open, setOpen] = useState(true);
  const selected = SCENARIOS.find((item) => item.id === selectedId);

  function expand() {
    setOpen(true);
  }

  return (
    <section
      data-testid="scenario-picker"
      data-open={open ? "true" : "false"}
      className="relative overflow-hidden border-2 border-[#2A3A48] bg-bridge-panel"
    >
      <header className="bg-navy px-4 py-4 text-sand sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-[0.32em] text-[#C47A4A]">
              TRAINING LIBRARY
            </p>
            <h2
              className={cn(
                "mt-1 font-ui font-bold tracking-wide text-sand",
                open ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl",
              )}
            >
              SELECT SCENARIO
            </h2>
            {open ? (
              <p className="mt-2 max-w-2xl text-sm text-sand/75">
                Six visible sections. Twenty-three situations. Pick one to load
                it across the console — risk, picture, recommended action, and
                event log all change with it.
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              data-testid="scenario-library-status"
              className="border border-sand/25 bg-white/5 px-3 py-1.5 font-mono text-[11px] tracking-wider text-sand"
            >
              {selected
                ? selected.name.toUpperCase()
                : "23 SITUATIONS · 6 SECTIONS"}
            </span>
            <button
              type="button"
              data-testid="reset-normal"
              onClick={onReset}
              className="border border-sand/40 bg-transparent px-3 py-1.5 font-ui text-xs font-medium text-sand hover:border-sand hover:bg-white/5"
            >
              Reset to Normal
            </button>
            <button
              type="button"
              data-testid="generate-report"
              onClick={onReport}
              className="bg-[#3A2418] px-3 py-1.5 font-ui text-xs font-medium text-sand hover:bg-[#4A2E1C]"
            >
              Generate report
            </button>
            <button
              type="button"
              data-testid="scenario-library-toggle"
              aria-expanded={open}
              aria-controls="scenario-library-body"
              onClick={() => setOpen((value) => !value)}
              className="border border-[#C47A4A] px-3 py-1.5 font-ui text-xs font-medium text-[#E8B48A] hover:bg-[#3A2418]"
            >
              {open ? "Hide library" : "Show library"}
            </button>
          </div>
        </div>

        {open ? null : (
          <div
            data-testid="scenario-library-collapsed"
            className="mt-4 flex flex-wrap gap-2"
          >
            {SCENARIO_CATEGORIES.map((category, index) => {
              const count = SCENARIOS.filter((item) => item.category === category)
                .length;
              const activeHere = selected?.category === category;
              return (
                <button
                  key={category}
                  type="button"
                  data-testid={`scenario-section-chip-${index + 1}`}
                  onClick={expand}
                  className={cn(
                    "border px-2.5 py-1.5 font-mono text-[10px] tracking-wider",
                    activeHere
                      ? "border-[#C47A4A] bg-[#3A2418] text-sand"
                      : "border-sand/20 text-sand/80 hover:border-[#C47A4A] hover:text-[#E8B48A]",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}{" "}
                  {SECTION_SHORT[category] ?? category.toUpperCase()}
                  <span className="ms-2 text-[#C47A4A]">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      <select
        id="scenario-select"
        data-testid="scenario-select"
        value={selectedId}
        onChange={(event) => {
          const next = SCENARIOS.find((item) => item.id === event.target.value);
          if (next) onSelect(next);
        }}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
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

      {open ? (
        <div
          id="scenario-library-body"
          className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {SCENARIO_CATEGORIES.map((category, index) => {
            const items = SCENARIOS.filter((item) => item.category === category);
            return (
              <section
                key={category}
                data-testid={`scenario-section-${index + 1}`}
                className="flex flex-col border border-[#2A3A48]/50 bg-bridge-bg"
              >
                <h3 className="flex items-center justify-between gap-3 border-b border-[#2A3A48] bg-[#1B2A3A]/5 px-3 py-2.5">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="font-mono text-[11px] tabular-nums text-[#8B4A28]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate font-ui text-sm font-bold tracking-wide text-bridge-text">
                      {category.toUpperCase()}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] tracking-wider text-[#8B4A28]">
                    {items.length} {items.length === 1 ? "CASE" : "CASES"}
                  </span>
                </h3>
                <ul className="flex flex-1 flex-col gap-2 p-3">
                  {items.map((item) => {
                    const active = item.id === selectedId;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          data-testid={`scenario-${item.id}`}
                          onClick={() => onSelect(item)}
                          className={cn(
                            "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left font-ui text-sm",
                            active
                              ? "bg-orange font-semibold text-white"
                              : "border border-bridge-line bg-bridge-panel text-bridge-text hover:border-[#8B4A28] hover:text-[#8B4A28]",
                          )}
                        >
                          <span>{item.name}</span>
                          <span
                            className={cn(
                              "shrink-0 border px-1.5 py-0.5 font-mono text-[9px] tracking-wider",
                              active
                                ? "border-white/60 text-white"
                                : riskChip(item.riskLevel),
                            )}
                          >
                            {item.riskLevel}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
