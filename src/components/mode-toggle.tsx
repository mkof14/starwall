"use client";

import { useAppMode, type AppMode } from "@/lib/mode";
import { useHud } from "@/lib/i18n/use-hud";
import { cn } from "@/lib/cn";

export function ModeToggle({
  tone = "on-light",
}: {
  tone?: "on-light" | "on-dark";
}) {
  const { mode, setMode } = useAppMode();
  const { hud } = useHud();
  const onDark = tone === "on-dark";

  return (
    <div
      role="group"
      aria-label={hud.mode.group}
      data-testid="mode-toggle"
      className={cn(
        "inline-flex shrink-0 border font-mono text-[10px] font-semibold tracking-wider",
        onDark ? "border-white/20" : "border-stroke",
      )}
    >
      {(["demo", "live"] as const).map((value: AppMode) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            data-testid={`mode-${value}`}
            aria-pressed={active}
            onClick={() => setMode(value)}
            className={cn(
              "px-2.5 py-1.5",
              value === "demo" && active && "bg-orange text-white",
              value === "live" && active && "bg-[#3A5166] text-sand",
              !active &&
                (onDark
                  ? "text-sand/65 hover:text-sand"
                  : "text-muted hover:text-ink"),
            )}
          >
            {value === "demo" ? hud.mode.demo : hud.mode.live}
          </button>
        );
      })}
    </div>
  );
}
