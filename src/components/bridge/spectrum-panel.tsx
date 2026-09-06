import { HudPanel } from "@/components/bridge/hud-panel";
import { spectrumScene } from "@/lib/picture-scenes";

const MONO = "var(--font-jetbrains), ui-monospace, monospace";

const LEFT = 36;
const RIGHT = 644;
const BASE = 348;
const BAR_COUNT = 88;

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

export function SpectrumView({ scenarioId = "" }: { scenarioId?: string }) {
  const scene = spectrumScene(scenarioId);
  const span = RIGHT - LEFT;
  const gap = 1.4;
  const width = span / BAR_COUNT - gap;
  const spike =
    scene.variant === "anomaly"
      ? 82
      : scene.variant === "intrusion"
        ? 24
        : scene.variant === "spoof"
          ? 40
          : scene.variant === "satcom"
            ? 70
            : scene.variant === "jam"
              ? -1
              : -1;

  return (
    <div
      className="instrument-spectrum relative overflow-hidden"
      data-testid="picture-scene"
      data-scene={scenarioId || "watch"}
    >
      <div className="flex items-center justify-between border-b border-[#5A3A10] bg-[#140E06] px-3 py-1 font-mono text-[9px] tracking-[0.16em] text-[#E8B23D]">
        <span>SPECTRUM ANALYZER · SA-58</span>
        <span>RBW 100 kHz · dBm</span>
      </div>
      <svg viewBox="0 0 680 428" className="h-auto w-full">
        <rect width="680" height="428" fill="#0C0A06" />
        {[0, 1, 2, 3, 4].map((row) => (
          <line
            key={row}
            x1={LEFT}
            x2={RIGHT}
            y1={80 + row * 64}
            y2={80 + row * 64}
            stroke="#3A2A10"
            strokeWidth="0.7"
          />
        ))}
        <text x="18" y="86" fontFamily={MONO} fontSize="8" fill="#8A7340">
          0
        </text>
        <text x="12" y="214" fontFamily={MONO} fontSize="8" fill="#8A7340">
          -40
        </text>
        <text x="12" y="348" fontFamily={MONO} fontSize="8" fill="#8A7340">
          -80
        </text>
        {NOISE_HEIGHTS.map((height, index) => {
          const jammed = scene.variant === "jam";
          const deadSatcom =
            scene.variant === "satcom" && index >= 64 && index <= 78;
          const barH = jammed
            ? Math.max(4, height * 0.28)
            : deadSatcom
              ? 5
              : height;
          const x = LEFT + (index / BAR_COUNT) * span;
          const fill = jammed
            ? "#FF4757"
            : deadSatcom
              ? "#4B5760"
              : "#3C4750";
          return (
            <rect
              key={index}
              className={jammed || deadSatcom ? undefined : "rf-noise-bar"}
              x={x}
              y={BASE - barH}
              width={width}
              height={barH}
              fill={fill}
              opacity={jammed ? 0.55 : 1}
              style={{
                animationDelay: `${(index % 9) * 0.11}s`,
                animationDuration: `${1.5 + (index % 5) * 0.14}s`,
              }}
            />
          );
        })}
        {spike >= 0 ? (
          <>
            <rect
              className="spectrum-spike"
              x={LEFT + (spike / BAR_COUNT) * span}
              y={BASE - 110}
              width={width + 1.5}
              height={110}
              fill={scene.variant === "spoof" ? "#E8B23D" : "#F15A00"}
            />
            {scene.variant === "spoof" ? (
              <rect
                x={LEFT + ((spike + 8) / BAR_COUNT) * span}
                y={BASE - 72}
                width={width + 1.5}
                height={72}
                fill="#33D3A6"
                opacity="0.7"
              />
            ) : null}
          </>
        ) : null}
        <text
          x={340}
          y={48}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize="12"
          fill={
            scene.variant === "watch"
              ? "#33D3A6"
              : scene.variant === "spoof"
                ? "#E8B23D"
                : "#F15A00"
          }
        >
          {scene.callout}
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
  );
}

export function SpectrumPanel() {
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
      <SpectrumView />
    </HudPanel>
  );
}
