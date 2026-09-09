"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useHud } from "@/lib/i18n/use-hud";
import { enterFullscreen, exitFullscreen, fullscreenTarget, isFullscreen, onFullscreenChange } from "@/lib/fullscreen";

function ExpandIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
        d="M3 7.5V3h4.5M13 3H17.5V7.5M17.5 13V17.5H13M7.5 17.5H3V13"
      />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
        d="M7.5 3v4.5H3M13 3v4.5H17.5M17.5 13H13V17.5M3 13h4.5V17.5"
      />
    </svg>
  );
}

export function FullscreenButton() {
  const { hud } = useHud();
  const [active, setActive] = useState(false);

  useEffect(() => {
    function sync() {
      setActive(isFullscreen());
    }
    sync();
    return onFullscreenChange(sync);
  }, []);

  async function toggle() {
    try {
      if (isFullscreen()) {
        await exitFullscreen();
      } else {
        await enterFullscreen(fullscreenTarget());
      }
    } catch {
      setActive(isFullscreen());
    }
  }

  return (
    <button
      type="button"
      data-testid="fullscreen-toggle"
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? hud.chrome.fullscreenExit : hud.chrome.fullscreenEnter}
      title={active ? hud.chrome.fullscreenExit : hud.chrome.fullscreenEnter}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center border",
        active
          ? "border-orange bg-orange text-white"
          : "border-bridge-text/40 text-bridge-text hover:border-orange hover:text-orange",
      )}
    >
      {active ? <CollapseIcon /> : <ExpandIcon />}
    </button>
  );
}
