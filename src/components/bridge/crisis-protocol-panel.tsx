"use client";

import { useEffect, useRef, useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { cn } from "@/lib/cn";

type Escalation = "idle" | "connecting" | "connected";

type CrisisProtocolPanelProps = {
  steps: string[];
  onEscalated: () => void;
};

export function CrisisProtocolPanel({
  steps,
  onEscalated,
}: CrisisProtocolPanelProps) {
  const [checked, setChecked] = useState<boolean[]>(() => steps.map(() => false));
  const [escalation, setEscalation] = useState<Escalation>("idle");
  const onEscalatedRef = useRef(onEscalated);
  onEscalatedRef.current = onEscalated;

  useEffect(() => {
    setChecked(steps.map(() => false));
    setEscalation("idle");
  }, [steps]);

  useEffect(() => {
    if (escalation !== "connecting") return;
    const timer = window.setTimeout(() => {
      setEscalation("connected");
      onEscalatedRef.current();
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [escalation]);

  function toggle(index: number) {
    setChecked((current) =>
      current.map((value, i) => (i === index ? !value : value)),
    );
  }

  return (
    <HudPanel
      id="crisis-protocol-panel"
      testId="crisis-protocol-panel"
      title="CRISIS PROTOCOL"
      className="scroll-mt-20 border-crit"
    >
      <ol className="space-y-2">
        {steps.map((step, index) => {
          const done = checked[index];
          return (
            <li key={`${index}-${step}`}>
              <label
                data-testid={`crisis-step-${index}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 border px-3 py-2",
                  done
                    ? "border-bridge-line bg-bridge-bg"
                    : "border-crit/40 bg-crit/5",
                )}
              >
                <input
                  type="checkbox"
                  checked={Boolean(done)}
                  onChange={() => toggle(index)}
                  className="mt-1 h-4 w-4 shrink-0 accent-crit"
                />
                <span
                  className={cn(
                    "text-sm leading-snug",
                    done
                      ? "text-bridge-dim line-through"
                      : "font-medium text-bridge-text",
                  )}
                >
                  <span className="me-1 font-mono text-[11px] text-crit">
                    {index + 1}.
                  </span>
                  {step}
                </span>
              </label>
            </li>
          );
        })}
      </ol>

      <div className="mt-4" data-testid="support-center-status">
        {escalation === "connected" ? (
          <div className="border border-ok bg-ok/10 px-3 py-3">
            <p className="flex items-center gap-2 font-ui text-sm font-semibold text-ok">
              <span className="h-2 w-2 rounded-full bg-ok" />
              Support Center: Live
            </p>
            <p className="mt-1 text-sm text-bridge-text">
              CONNECTED — Support Center specialist is reviewing this situation
            </p>
          </div>
        ) : (
          <button
            type="button"
            data-testid="escalate-support"
            disabled={escalation === "connecting"}
            onClick={() => setEscalation("connecting")}
            className="flex w-full items-center justify-center gap-2 bg-crit px-4 py-3 font-ui text-sm font-bold tracking-wide text-white hover:bg-crit/90 disabled:cursor-wait"
          >
            {escalation === "connecting" ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Connecting...
              </>
            ) : (
              "ESCALATE TO SUPPORT CENTER"
            )}
          </button>
        )}
      </div>
    </HudPanel>
  );
}
