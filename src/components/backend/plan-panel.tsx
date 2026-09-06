"use client";

import { HudPanel } from "@/components/bridge/hud-panel";
import { cn } from "@/lib/cn";
import { usePreferences } from "@/lib/i18n/context";

const CURRENT_TIER = 1;

export function PlanPanel() {
  const { t } = usePreferences();
  const copy = t.backend;
  const current = t.levels.tiers[CURRENT_TIER];

  return (
    <HudPanel testId="backend-plan" title={copy.planTitle}>
      <p className="font-mono text-[11px] text-bridge-dim">{copy.planCurrent}</p>
      <p className="mt-1 font-ui text-xl font-semibold text-orange">
        {current.name}
        <span className="ms-2 text-sm font-normal text-bridge-dim">
          {current.subtitle}
        </span>
      </p>
      <ul className="mt-5 space-y-4">
        {t.levels.tiers.map((tier, index) => {
          const included = index <= CURRENT_TIER;
          return (
            <li key={tier.name}>
              <p
                className={cn(
                  "mb-2 font-mono text-[10px] tracking-wider",
                  included ? "text-ok" : "text-bridge-dim",
                )}
              >
                {tier.name}
              </p>
              <ul className="space-y-2">
                {tier.points.map((point) => (
                  <li
                    key={point}
                    className={cn(
                      "flex items-start gap-2 text-sm",
                      included ? "text-bridge-text" : "text-bridge-dim",
                    )}
                  >
                    <span aria-hidden className={included ? "text-ok" : "text-bridge-dim"}>
                      {included ? "✓" : "–"}
                    </span>
                    <span className={included ? undefined : "opacity-70"}>{point}</span>
                    {included ? null : (
                      <span className="ms-auto shrink-0 font-mono text-[10px] text-orange">
                        {copy.planUpgrade}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </HudPanel>
  );
}
