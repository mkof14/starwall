"use client";

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
  const selected = SCENARIOS.find((item) => item.id === selectedId);

  return (
    <section
      data-testid="scenario-picker"
      className="relative overflow-hidden border-2 border-orange bg-bridge-panel shadow-[0_0_0_4px_rgb(241_90_0_/_0.18)]"
    >
      <span className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-4 border-t-4 border-orange" />
      <span className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-4 border-t-4 border-orange" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-4 border-l-4 border-orange" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-4 border-r-4 border-orange" />

      <header className="border-b-2 border-orange bg-orange px-4 py-5 text-white sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.32em] text-white/80">
              TRAINING LIBRARY
            </p>
            <h2 className="mt-1 font-ui text-3xl font-bold tracking-wide md:text-4xl">
              SELECT SCENARIO
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/90">
              Six visible sections. Twenty-three situations. Pick one to load it
              across the console — risk, picture, recommended action, and event
              log all change with it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              data-testid="scenario-library-status"
              className="border border-white/40 bg-white/10 px-3 py-1.5 font-mono text-[11px] tracking-wider"
            >
              {selected
                ? selected.name.toUpperCase()
                : "23 SITUATIONS · 6 SECTIONS"}
            </span>
            <button
              type="button"
              data-testid="reset-normal"
              onClick={onReset}
              className="border border-white/70 bg-transparent px-3 py-1.5 font-ui text-xs font-medium text-white hover:bg-white/15"
            >
              Reset to Normal
            </button>
            <button
              type="button"
              data-testid="generate-report"
              onClick={onReport}
              className="bg-[#0F1922] px-3 py-1.5 font-ui text-xs font-medium text-white hover:bg-navy"
            >
              Generate report
            </button>
          </div>
        </div>
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

      <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3">
        {SCENARIO_CATEGORIES.map((category, index) => {
          const items = SCENARIOS.filter((item) => item.category === category);
          return (
            <section
              key={category}
              data-testid={`scenario-section-${index + 1}`}
              className="flex flex-col border-2 border-bridge-line bg-bridge-bg"
            >
              <h3 className="flex items-center justify-between gap-3 border-b-2 border-orange bg-orange/15 px-3 py-2.5">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="font-mono text-[11px] tabular-nums text-orange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate font-ui text-sm font-bold tracking-wide text-bridge-text">
                    {category.toUpperCase()}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[10px] tracking-wider text-orange">
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
                            : "border border-bridge-line bg-bridge-panel text-bridge-text hover:border-orange hover:text-orange",
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
    </section>
  );
}
