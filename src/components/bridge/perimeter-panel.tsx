import { HudPanel } from "@/components/bridge/hud-panel";
import { perimeterScene } from "@/lib/picture-scenes";

const MONO = "var(--font-jetbrains), ui-monospace, monospace";

const SENSORS = [
  { x: 80, y: 48, id: "nw" },
  { x: 600, y: 48, id: "ne" },
  { x: 80, y: 380, id: "sw" },
  { x: 340, y: 380, id: "s" },
  { x: 600, y: 250, id: "se" },
] as const;

export function PerimeterView({ scenarioId = "" }: { scenarioId?: string }) {
  const scene = perimeterScene(scenarioId);
  const alertId =
    scene.variant === "breach"
      ? "se"
      : scene.variant === "vehicle"
        ? "se"
        : scene.variant === "tailgate"
          ? "sw"
          : scene.variant === "object"
            ? "ne"
            : null;

  return (
    <div
      className="relative overflow-hidden bg-[#0A0F14]"
      data-testid="picture-scene"
      data-scene={scenarioId || "watch"}
    >
      <svg viewBox="0 0 680 428" className="h-auto w-full">
        <rect
          x="48"
          y="32"
          width="584"
          height="364"
          fill="none"
          stroke={scene.variant === "vip" ? "#E8B23D" : "#223039"}
          strokeWidth="1.4"
        />
        <rect
          x="88"
          y="72"
          width="196"
          height="128"
          fill="#0D161C"
          stroke="#223039"
          strokeWidth="1"
        />
        <text x="186" y="140" textAnchor="middle" fontFamily={MONO} fontSize="11" fill="#7C8894">
          ZONE A
        </text>
        <rect
          x="360"
          y="88"
          width="220"
          height="112"
          fill={scene.variant === "object" ? "rgba(241,90,0,0.08)" : "#0D161C"}
          stroke={scene.variant === "object" ? "#F15A00" : "#223039"}
          strokeWidth="1"
        />
        <text x="470" y="148" textAnchor="middle" fontFamily={MONO} fontSize="11" fill="#7C8894">
          ZONE B
        </text>
        <rect
          x="120"
          y="336"
          width="88"
          height="36"
          fill={scene.variant === "tailgate" ? "rgba(232,178,61,0.12)" : "#0D161C"}
          stroke={scene.variant === "tailgate" ? "#E8B23D" : "#223039"}
          strokeWidth="1"
        />
        <text x="164" y="358" textAnchor="middle" fontFamily={MONO} fontSize="10" fill="#7C8894">
          GATE 1
        </text>
        <rect
          x="544"
          y="300"
          width="56"
          height="72"
          fill={scene.variant === "vehicle" ? "rgba(241,90,0,0.12)" : "#0D161C"}
          stroke={scene.variant === "vehicle" ? "#F15A00" : "#223039"}
          strokeWidth="1"
        />
        <text x="572" y="340" textAnchor="middle" fontFamily={MONO} fontSize="10" fill="#7C8894">
          GATE 2
        </text>
        {scene.variant === "object" ? (
          <g transform="translate(470 160)">
            <rect
              className="contact-hold"
              x="-10"
              y="-8"
              width="20"
              height="16"
              fill="#F15A00"
            />
          </g>
        ) : null}
        {scene.variant === "tailgate" ? (
          <g transform="translate(164 318)" fill="#E8B23D">
            <circle cx="-8" r="4" />
            <circle cx="8" r="4" className="contact-hold" />
          </g>
        ) : null}
        {scene.variant === "vehicle" ? (
          <g transform="translate(572 268)" className="contact-hold">
            <rect x="-14" y="-8" width="28" height="14" rx="2" fill="#F15A00" />
          </g>
        ) : null}
        <text
          x="340"
          y="24"
          textAnchor="middle"
          fontFamily={MONO}
          fontSize="11"
          fill={scene.variant === "watch" ? "#33D3A6" : "#F15A00"}
        >
          {scene.callout}
        </text>
        {SENSORS.map((sensor) => {
          const alert = alertId === sensor.id || scene.variant === "vip";
          const color = scene.variant === "vip" ? "#E8B23D" : alert ? "#F15A00" : "#33D3A6";
          return alert && scene.variant !== "vip" ? (
            <g key={sensor.id}>
              <circle
                className="hud-contact-pulse"
                cx={sensor.x}
                cy={sensor.y}
                r="18"
                fill="none"
                stroke={color}
                strokeWidth="1.4"
              />
              <circle cx={sensor.x} cy={sensor.y} r="6.5" fill={color} />
            </g>
          ) : (
            <circle
              key={sensor.id}
              className={scene.variant === "vip" ? "map-status-pulse" : undefined}
              cx={sensor.x}
              cy={sensor.y}
              r={alert ? 6 : 4.5}
              fill={color}
            />
          );
        })}
      </svg>
    </div>
  );
}

export function PerimeterPanel() {
  return (
    <HudPanel
      testId="perimeter-panel"
      title="PERIMETER"
      extra={
        <span className="font-mono text-[10px] text-bridge-dim">
          5 SENSORS · 1 ALERT
        </span>
      }
    >
      <PerimeterView />
    </HudPanel>
  );
}
