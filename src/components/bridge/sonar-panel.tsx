import { HudPanel } from "@/components/bridge/hud-panel";

const MONO = "var(--font-jetbrains), ui-monospace, monospace";

export function SonarView() {
  return (
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_center,#0C1820_0%,#0A0F14_72%)]">
        <svg viewBox="0 0 680 428" className="h-auto w-full">
          <circle cx="340" cy="214" r="168" fill="none" stroke="#182229" strokeWidth="1" />
          <circle cx="340" cy="214" r="112" fill="none" stroke="#182229" strokeWidth="1" />
          <circle cx="340" cy="214" r="56" fill="none" stroke="#182229" strokeWidth="1" />
          <text x="348" y="95" fontFamily={MONO} fontSize="8.5" fill="#3C4750">
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
          <g transform="translate(468,118)">
            <circle r="5" fill="none" stroke="#2DD4E8" strokeWidth="1.4" />
            <circle r="3.5" fill="#2DD4E8" />
            <text x="10" y="4" fontFamily={MONO} fontSize="9.5" fill="#7C8894">
              CONTACT — 15M DEPTH
            </text>
          </g>
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
