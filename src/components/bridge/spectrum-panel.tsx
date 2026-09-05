import { HudPanel } from "@/components/bridge/hud-panel";

const MONO = "var(--font-jetbrains), ui-monospace, monospace";

const LEFT = 36;
const RIGHT = 644;
const BASE = 348;
const BAR_COUNT = 88;
const ANOMALY_INDEX = 82;

const NOISE_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, index) => {
  const wave =
    Math.sin(index * 0.41) * 7 + Math.sin(index * 1.13) * 5 + ((index * 13) % 6);
  return 18 + wave;
});

const TICKS = [
  { label: "2.4GHz", t: 0 },
  { label: "3.6GHz", t: 1 / 3 },
  { label: "4.8GHz", t: 2 / 3 },
  { label: "5.8GHz", t: 1 },
] as const;

export function SpectrumPanel() {
  const span = RIGHT - LEFT;
  const gap = 1.4;
  const width = span / BAR_COUNT - gap;

  return (
    <HudPanel
      testId="spectrum-panel"
      title="RF SPECTRUM"
      extra={
        <span className="font-mono text-[10px] text-bridge-dim">
          WIDE-BAND SCAN · ACTIVE
        </span>
      }
    >
      <div className="relative overflow-hidden bg-[#0A0F14]">
        <svg viewBox="0 0 680 428" className="h-auto w-full">
          {NOISE_HEIGHTS.map((height, index) => {
            if (index === ANOMALY_INDEX) return null;
            const x = LEFT + (index / BAR_COUNT) * span;
            return (
              <rect
                key={index}
                className="rf-noise-bar"
                x={x}
                y={BASE - height}
                width={width}
                height={height}
                fill="#3C4750"
                style={{
                  animationDelay: `${(index % 9) * 0.11}s`,
                  animationDuration: `${1.5 + (index % 5) * 0.14}s`,
                }}
              />
            );
          })}
          <rect
            x={LEFT + (ANOMALY_INDEX / BAR_COUNT) * span}
            y={BASE - 96}
            width={width + 1.5}
            height={96}
            fill="#F15A00"
          />
          <text
            x={LEFT + (ANOMALY_INDEX / BAR_COUNT) * span + width / 2}
            y={BASE - 108}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="10"
            fill="#F15A00"
          >
            ANOMALY — 5.8GHz
          </text>
          {TICKS.map((tick) => (
            <text
              key={tick.label}
              x={LEFT + tick.t * span}
              y={382}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize="10"
              fill="#7C8894"
            >
              {tick.label}
            </text>
          ))}
        </svg>
      </div>
    </HudPanel>
  );
}
