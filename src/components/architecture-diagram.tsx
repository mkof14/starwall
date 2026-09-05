const stages = [
  { name: "Data Sources", label: "radar, AIS, cameras, sensors" },
  { name: "Integration", label: "adapters, protocols, APIs" },
  { name: "Unified Data", label: "one shared data model" },
  { name: "Intelligence / AI", label: "correlation, learning" },
  { name: "Risk & Scenario", label: "explainable risk levels" },
  { name: "Decision", label: "recommended next step" },
  { name: "Support Center", label: "human specialist, live" },
];

const BOX_W = 156;
const BOX_H = 92;
const GAP = 40;
const PAD = 8;

export function ArchitectureDiagram() {
  const width = PAD * 2 + stages.length * BOX_W + (stages.length - 1) * GAP;
  const height = BOX_H + PAD * 2;

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="StarWall architecture flow: Data Sources, Integration, Unified Data, Intelligence / AI, Risk and Scenario, Decision, Support Center"
        className="max-w-none"
      >
        <title>StarWall architecture flow</title>
        {stages.map((stage, index) => {
          const x = PAD + index * (BOX_W + GAP);
          const y = PAD;
          const midY = y + BOX_H / 2;

          return (
            <g key={stage.name}>
              <rect
                x={x}
                y={y}
                width={BOX_W}
                height={BOX_H}
                fill="#0F1922"
              />
              <text
                x={x + BOX_W / 2}
                y={y + 36}
                textAnchor="middle"
                fill="#ffffff"
                fontFamily="var(--font-cormorant), Georgia, serif"
                fontSize="16"
                fontWeight="700"
              >
                {stage.name}
              </text>
              <text
                x={x + BOX_W / 2}
                y={y + 62}
                textAnchor="middle"
                fill="#6B7280"
                fontFamily="var(--font-inter), system-ui, sans-serif"
                fontSize="11"
              >
                {stage.label}
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
