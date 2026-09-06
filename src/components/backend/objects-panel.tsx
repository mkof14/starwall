"use client";

import { useState } from "react";
import { HudPanel } from "@/components/bridge/hud-panel";
import { cn } from "@/lib/cn";
import { usePreferences } from "@/lib/i18n/context";

const OBJECTS = [
  { id: "aurelia", name: "M/Y Aurelia", risk: "NORMAL", tone: "ok" },
  { id: "marina", name: "Marina Bay — North Dock", risk: "ATTENTION", tone: "attn" },
  {
    id: "island",
    name: "Private Island — Example Estate",
    risk: "ELEVATED",
    tone: "orange",
  },
] as const;

export function ObjectsPanel() {
  const { t } = usePreferences();
  const copy = t.backend;
  const [message, setMessage] = useState<string | null>(null);

  return (
    <HudPanel testId="backend-objects" title={copy.objectsTitle}>
      <p className="mb-4 font-mono text-[11px] text-bridge-dim">{copy.objectsNote}</p>
      <ul className="space-y-2">
        {OBJECTS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              data-testid={`object-${item.id}`}
              onClick={() =>
                setMessage(copy.objectsSwitch.replace("{name}", item.name))
              }
              className="flex w-full items-center justify-between gap-3 border border-bridge-line bg-bridge-bg px-3 py-2.5 text-start hover:border-orange"
            >
              <span className="text-sm">{item.name}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-2 font-mono text-[10px] tracking-wider",
                  item.tone === "ok" && "text-ok",
                  item.tone === "attn" && "text-attn",
                  item.tone === "orange" && "text-orange",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    item.tone === "ok" && "bg-ok",
                    item.tone === "attn" && "bg-attn",
                    item.tone === "orange" && "bg-orange",
                  )}
                />
                {item.risk}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {message ? (
        <p
          data-testid="object-switch-message"
          className="mt-4 border border-attn/40 bg-attn/10 px-3 py-2 font-mono text-[11px] text-attn"
        >
          {message}
        </p>
      ) : null}
    </HudPanel>
  );
}
