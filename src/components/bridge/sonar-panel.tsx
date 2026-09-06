import { HudPanel } from "@/components/bridge/hud-panel";
import { cn } from "@/lib/cn";
import {
  motionTowardOwnShip,
  sonarScene,
  toneColor,
} from "@/lib/picture-scenes";

const MONO = "var(--font-jetbrains), ui-monospace, monospace";

export function SonarView({ scenarioId = "" }: { scenarioId?: string }) {
  const scene = sonarScene(scenarioId);

  return (
    <div
      className="instrument-sonar relative overflow-hidden"
      data-testid="picture-scene"
      data-scene={scenarioId || "watch"}
    >
      <div className="flex items-center justify-between border-b border-[#0E4A55] bg-[#031418] px-3 py-1 font-mono text-[9px] tracking-[0.16em] text-[#6DE4F2]">
        <span>HF SONAR · 200 kHz</span>
        <span>PASSIVE / ACTIVE · DEPTH SCALE</span>
      </div>
      <svg viewBox="0 0 680 428" className="h-auto w-full">
        <rect width="680" height="428" fill="#02161C" />
        <circle cx="340" cy="214" r="168" fill="none" stroke="#0E4A55" strokeWidth="1.2" />
        <circle cx="340" cy="214" r="112" fill="none" stroke="#0A3A44" strokeWidth="1" />
        <circle cx="340" cy="214" r="56" fill="none" stroke="#0A3A44" strokeWidth="1" />
        <text x="348" y="95" fontFamily={MONO} fontSize="8.5" fill="#1A6A78">
          0-20M
        </text>
        <text x="348" y="151" fontFamily={MONO} fontSize="8.5" fill="#3C4750">
          20-50M
        </text>
        <text x="348" y="207" fontFamily={MONO} fontSize="8.5" fill="#3C4750">
          50M+
        </text>
        <circle
          className="sonar-ping-ring"
          cx="340"
          cy="214"
          r="168"
          fill="none"
          stroke="#2DD4E8"
          strokeWidth="1.4"
        />
        <circle cx="340" cy="214" r="3" fill="#2DD4E8" />
        <circle cx="340" cy="214" r="7" fill="none" stroke="#2DD4E8" strokeWidth="1" />
        <text
          x="340"
          y="404"
          textAnchor="middle"
          fontFamily={MONO}
          fontSize="10"
          fill="#7C8894"
        >
          {scene.note}
        </text>
        {scene.contacts.map((contact) => {
          const shift = motionTowardOwnShip(
            contact.x,
            contact.y,
            contact.motion === "inbound" ? 28 : 12,
          );
          const color = toneColor(contact.tone);
          return (
            <g key={contact.id} transform={`translate(${contact.x} ${contact.y})`}>
              <g
                className={cn(
                  contact.motion === "inbound" && "contact-inbound",
                  contact.motion === "close" && "contact-close",
                  contact.motion === "hold" && "contact-hold",
                )}
                style={{
                  ["--mx" as string]: `${shift.mx}px`,
                  ["--my" as string]: `${shift.my}px`,
                }}
              >
                <circle className="hud-contact-pulse" r="16" fill="none" stroke={color} />
                <circle r="5" fill="none" stroke={color} strokeWidth="1.4" />
                <circle r="3.5" fill={color} />
                <text x="10" y="4" fontFamily={MONO} fontSize="9.5" fill={color}>
                  {contact.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SonarPanel() {
  return (
    <HudPanel
      testId="sonar-panel"
      title="UNDERWATER PICTURE"
      extra={
        <span className="font-mono text-[10px] text-bridge-dim">
          RANGE 1.0 NM · SONAR ACTIVE
        </span>
      }
    >
      <SonarView />
    </HudPanel>
  );
}
