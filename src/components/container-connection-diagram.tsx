const BOX_W = 200;
const BOX_H = 168;
const GAP = 92;
const PAD = 28;

const WIDTH = PAD * 2 + BOX_W * 3 + GAP * 2;
const HEIGHT = BOX_H + PAD * 2 + 18;

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - 8} y2={y} stroke="#F15A00" strokeWidth="2" />
      <polygon
        points={`${x2},${y} ${x2 - 8},${y - 5} ${x2 - 8},${y + 5}`}
        fill="#F15A00"
      />
    </g>
  );
}

function Box({
  x,
  y,
  title,
  lines,
  starwall,
}: {
  x: number;
  y: number;
  title: string;
  lines: readonly string[];
  starwall?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={BOX_W} height={BOX_H} fill="#0F1922" />
      {starwall ? (
        <text
          x={x + BOX_W / 2}
          y={y + 32}
          textAnchor="middle"
          fontFamily="var(--font-cormorant), Georgia, serif"
          fontSize="18"
          fontWeight="700"
        >
          <tspan fill="#ffffff">Star</tspan>
          <tspan fill="#F15A00">Wall</tspan>
        </text>
      ) : (
        <text
          x={x + BOX_W / 2}
          y={y + 32}
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="var(--font-cormorant), Georgia, serif"
          fontSize="15"
          fontWeight="700"
        >
          {title}
        </text>
      )}
      <text
        x={x + BOX_W / 2}
        y={y + 58}
        textAnchor="middle"
        fill="#6B7280"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="11"
      >
        {lines.map((line, index) => (
          <tspan key={line} x={x + BOX_W / 2} dy={index === 0 ? 0 : 16}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export function ContainerConnectionDiagram() {
  const y = PAD + 10;
  const midY = y + BOX_H / 2;
  const left = PAD;
  const mid = PAD + BOX_W + GAP;
  const right = PAD + (BOX_W + GAP) * 2;

  return (
    <figure className="space-y-4">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="AGRON Container hardware feeds StarWall, which sends alerts and recommendations to the operator on AGRON Bridge."
          className="h-auto w-full min-w-[720px]"
          preserveAspectRatio="xMinYMid meet"
        >
          <title>Container to StarWall to operator</title>
          <Box
            x={left}
            y={y}
            title="AGRON CONTAINER"
            lines={["Radar & Sensors", "Cameras", "Sonar", "RF/EW equipment"]}
          />
          <Arrow x1={left + BOX_W} x2={mid} y={midY} />
          <text
            x={left + BOX_W + GAP / 2}
            y={midY - 12}
            textAnchor="middle"
            fill="#F15A00"
            fontFamily="var(--font-jetbrains), ui-monospace, monospace"
            fontSize="10"
          >
            raw sensor data
          </text>
          <Box
            x={mid}
            y={y}
            title="STARWALL"
            starwall
            lines={["Unified Data", "Risk Engine", "Recommendations"]}
          />
          <Arrow x1={mid + BOX_W} x2={right} y={midY} />
          <text
            x={mid + BOX_W + GAP / 2}
            y={midY - 12}
            textAnchor="middle"
            fill="#F15A00"
            fontFamily="var(--font-jetbrains), ui-monospace, monospace"
            fontSize="10"
          >
            alerts & recommendations
          </text>
          <Box
            x={right}
            y={y}
            title="OPERATOR"
            lines={["AGRON Bridge interface"]}
          />
        </svg>
      </div>
      <figcaption className="max-w-3xl text-sm leading-relaxed text-muted">
        The container provides the hardware. StarWall provides the intelligence.
        Together they give the operator one clear picture and a fast decision.
      </figcaption>
    </figure>
  );
}
