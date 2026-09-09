"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useHud } from "@/lib/i18n/use-hud";

const TOUR_TARGETS = [
  "risk-badge",
  "telemetry-strip",
  "situational-panel",
  "risk-level-panel",
  "connected-systems-panel",
  "recommended-action-panel",
  "scenario-picker",
  "event-log-panel",
  null,
] as const;

type Rect = { top: number; left: number; width: number; height: number };

type TrainingTourProps = {
  active: boolean;
  onClose: () => void;
};

export function TrainingTour({ active, onClose }: TrainingTourProps) {
  const { hud } = useHud();
  const steps = hud.tour.steps.map((text, index) => ({
    target: TOUR_TARGETS[index],
    text,
  }));
  const [step, setStep] = useState(0);
  const [spot, setSpot] = useState<Rect | null>(null);
  const calloutRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (active) setStep(0);
  }, [active]);

  useLayoutEffect(() => {
    if (!active) return;

    function measure() {
      const target = TOUR_TARGETS[step];
      if (!target) {
        setSpot(null);
        return;
      }
      const el = document.querySelector(`[data-testid="${target}"]`);
      if (!(el instanceof HTMLElement)) {
        setSpot(null);
        return;
      }
      const box = el.getBoundingClientRect();
      setSpot({
        top: box.top - 6,
        left: box.left - 6,
        width: box.width + 12,
        height: box.height + 12,
      });
    }

    const target = TOUR_TARGETS[step];
    const el = target ? document.querySelector(`[data-testid="${target}"]`) : null;
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [active, step]);

  useEffect(() => {
    if (!active) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    function onPointer(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        onClose();
        return;
      }
      if (target.closest("[data-testid='training-callout']")) return;
      if (target.closest("[data-testid='training-toggle']")) return;
      onClose();
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [active, onClose]);

  if (!active) return null;

  const last = step === steps.length - 1;
  const callout = steps[step];
  const calloutStyle = last
    ? { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
    : placeCallout(spot, calloutRef.current);

  return (
    <div className="pointer-events-none fixed inset-0 z-[45]" data-testid="training-overlay">
      {spot ? (
        <div
          className="absolute border-2 border-orange"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            boxShadow: "0 0 0 9999px rgb(10 15 20 / 0.68)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#0A0F14]/70" />
      )}

      <div
        ref={calloutRef}
        data-testid="training-callout"
        className="pointer-events-auto absolute w-[min(22rem,calc(100vw-2rem))] border border-orange/50 bg-[#0A0F14] p-4 font-ui text-sand shadow-xl"
        style={calloutStyle}
      >
        <p className="font-mono text-[10px] tracking-[0.18em] text-orange">
          {step + 1} / {steps.length}
        </p>
        <p className="mt-2 text-sm leading-relaxed">{callout.text}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            data-testid="training-skip"
            onClick={onClose}
            className="text-xs text-sand/70 underline-offset-2 hover:text-sand hover:underline"
          >
            {hud.tour.skip}
          </button>
          <div className="flex gap-2">
            {step > 0 ? (
              <button
                type="button"
                data-testid="training-back"
                onClick={() => setStep((current) => current - 1)}
                className="border border-sand/30 px-3 py-1 text-xs text-sand hover:border-sand"
              >
                {hud.tour.back}
              </button>
            ) : null}
            {last ? (
              <button
                type="button"
                data-testid="training-finish"
                onClick={onClose}
                className="bg-orange px-3 py-1 text-xs font-medium text-white hover:bg-orange/90"
              >
                {hud.tour.finish}
              </button>
            ) : (
              <button
                type="button"
                data-testid="training-next"
                onClick={() => setStep((current) => current + 1)}
                className="bg-orange px-3 py-1 text-xs font-medium text-white hover:bg-orange/90"
              >
                {hud.tour.next}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function placeCallout(spot: Rect | null, callout: HTMLDivElement | null) {
  const width = callout?.offsetWidth ?? 352;
  const height = callout?.offsetHeight ?? 180;
  const gap = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!spot) {
    return { top: Math.max(16, (vh - height) / 2), left: Math.max(16, (vw - width) / 2) };
  }

  let top = spot.top + spot.height + gap;
  if (top + height > vh - 16) {
    top = spot.top - height - gap;
  }
  top = Math.min(Math.max(16, top), vh - height - 16);

  let left = spot.left;
  left = Math.min(Math.max(16, left), vw - width - 16);

  return { top, left };
}
