"use client";

import { ScenarioStill } from "@/components/bridge/scenario-still";
import { useCrisisMode } from "@/lib/crisis-mode";
import { usePreferences } from "@/lib/i18n/context";

const files = [
  "radar-normal.png",
  "risk-elevated.png",
  "recommended-action.png",
  "event-log-new.png",
] as const;

export function ScenarioWalkthrough() {
  const { t } = usePreferences();
  const { crisis } = useCrisisMode();
  if (crisis) return null;

  return (
    <section className="bg-bridge-bg px-4 pb-4 pt-10 text-bridge-text md:px-6">
      <div className="mx-auto max-w-6xl space-y-10">
        <header>
          <p className="font-mono text-[10px] tracking-[0.2em] text-orange">
            {t.walkthrough.kicker}
          </p>
          <h2 className="mt-2 font-ui text-2xl font-bold">{t.walkthrough.title}</h2>
        </header>

        <ol className="space-y-10">
          {t.walkthrough.steps.map((text, index) => (
            <li
              key={files[index]}
              className="grid items-center gap-6 md:grid-cols-2"
            >
              <p
                className={`text-base leading-relaxed text-bridge-text ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <span className="me-2 font-mono text-xs text-orange">
                  0{index + 1}
                </span>
                {text}
              </p>
              <ScenarioStill file={files[index]} />
            </li>
          ))}
        </ol>

        <p className="text-sm italic text-bridge-dim">{t.walkthrough.note}</p>
      </div>
    </section>
  );
}
