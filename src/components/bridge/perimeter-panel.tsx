import { HudPanel } from "@/components/bridge/hud-panel";

const MONO = "var(--font-jetbrains), ui-monospace, monospace";

const SENSORS = [
  { x: 80, y: 48, alert: false },
  { x: 600, y: 48, alert: false },
  { x: 80, y: 380, alert: false },
  { x: 340, y: 380, alert: false },
  { x: 600, y: 250, alert: true },
] as const;

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
      <div className="relative overflow-hidden bg-[#0A0F14]">
        <svg viewBox="0 0 680 428" className="h-auto w-full">
          <rect
            x="48"
            y="32"
            width="584"
            height="364"
            fill="none"
            stroke="#223039"
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
            fill="#0D161C"
            stroke="#223039"
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
            fill="#0D161C"
            stroke="#223039"
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
            fill="#0D161C"
            stroke="#223039"
            strokeWidth="1"
          />
          <text
            x="572"
            y="340"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="10"
            fill="#7C8894"
          >
            GATE 2
          </text>
          {SENSORS.map((sensor) =>
            sensor.alert ? (
              <g key={`${sensor.x}-${sensor.y}`}>
                <circle
                  className="hud-contact-pulse"
                  cx={sensor.x}
                  cy={sensor.y}
                  r="18"
                  fill="none"
                  stroke="#F15A00"
                  strokeWidth="1.4"
                />
                <circle cx={sensor.x} cy={sensor.y} r="6.5" fill="#F15A00" />
                <text
                  x={sensor.x - 14}
                  y={sensor.y - 16}
                  textAnchor="end"
                  fontFamily={MONO}
                  fontSize="10"
                  fill="#F15A00"
                >
                  SECTOR 4 — TRIGGERED
                </text>
              </g>
            ) : (
              <circle
                key={`${sensor.x}-${sensor.y}`}
                cx={sensor.x}
                cy={sensor.y}
                r="4.5"
                fill="#33D3A6"
              />
            ),
          )}
        </svg>
      </div>
    </HudPanel>
  );
}
