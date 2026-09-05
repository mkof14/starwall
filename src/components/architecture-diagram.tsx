"use client";

import { usePreferences } from "@/lib/i18n/context";

const BOX_W = 156;
const BOX_H = 100;
const GAP = 36;
const PAD = 8;

export function ArchitectureDiagram() {
  const { t } = usePreferences();
  const stages = t.how.stages;
  const width = PAD * 2 + stages.length * BOX_W + (stages.length - 1) * GAP;
  const height = BOX_H + PAD * 2;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={t.how.architectureLabel}
        className="h-auto w-full min-w-[880px]"
        preserveAspectRatio="xMinYMid meet"
      >
        <title>{t.how.architecture}</title>
        {stages.map((stage, index) => {
          const x = PAD + index * (BOX_W + GAP);
          const y = PAD;
          const midY = y + BOX_H / 2;

          return (
            <g key={`${stage.name}-${index}`}>
              <rect x={x} y={y} width={BOX_W} height={BOX_H} fill="#0F1922" />
              <text
                x={x + BOX_W / 2}
                y={y + 32}
                textAnchor="middle"
                fill="#ffffff"
                fontFamily="var(--font-cormorant), Georgia, serif"
                fontSize="15"
                fontWeight="700"
              >
                {stage.name}
              </text>
              <text
                x={x + BOX_W / 2}
                y={y + 56}
                textAnchor="middle"
                fill="#6B7280"
                fontFamily="var(--font-inter), system-ui, sans-serif"
                fontSize="11"
              >
                {stage.lines.map((line, lineIndex) => (
                  <tspan
                    key={line}
                    x={x + BOX_W / 2}
                    dy={lineIndex === 0 ? 0 : 14}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
              {index < stages.length - 1 ? (
                <g>
                  <line
                    x1={x + BOX_W}
                    y1={midY}
                    x2={x + BOX_W + GAP - 8}
                    y2={midY}
                    stroke="#F15A00"
                    strokeWidth="2"
                  />
                  <polygon
                    points={`${x + BOX_W + GAP},${midY} ${x + BOX_W + GAP - 8},${midY - 5} ${x + BOX_W + GAP - 8},${midY + 5}`}
                    fill="#F15A00"
                  />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
