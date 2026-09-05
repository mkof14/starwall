"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

type Tooltip = {
  x: number;
  y: number;
  name: string;
  type: string;
  dist: string;
};

type BridgeRadarProps = {
  showNewContact: boolean;
};

export function BridgeRadar({ showNewContact }: BridgeRadarProps) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  useEffect(() => {
    const group = document.getElementById("ticks");
    if (!group) return;
    group.replaceChildren();

    for (let deg = 0; deg < 360; deg += 10) {
      const rad = ((deg - 90) * Math.PI) / 180;
      const longer = deg % 30 === 0;
      const inner = longer ? 158 : 164;
      const x1 = 340 + inner * Math.cos(rad);
      const y1 = 214 + inner * Math.sin(rad);
      const x2 = 340 + 168 * Math.cos(rad);
      const y2 = 214 + 168 * Math.sin(rad);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(x1));
      line.setAttribute("y1", String(y1));
      line.setAttribute("x2", String(x2));
      line.setAttribute("y2", String(y2));
      line.setAttribute("stroke", "#223039");
      line.setAttribute("stroke-width", longer ? "1.4" : "1");
      group.appendChild(line);
    }
  }, []);

  function onContactEnter(
    event: MouseEvent<SVGGElement>,
    fallback?: { name: string; type: string; dist: string },
  ) {
    const target = event.currentTarget;
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      name: target.dataset.name ?? fallback?.name ?? "",
      type: target.dataset.type ?? fallback?.type ?? "",
      dist: target.dataset.dist ?? fallback?.dist ?? "",
    });
  }

  function onContactMove(event: MouseEvent<SVGGElement>) {
    setTooltip((current) =>
      current
        ? { ...current, x: event.clientX, y: event.clientY }
        : current,
    );
  }

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_center,#0D161C_0%,#0A0F14_70%)]">
      <svg viewBox="0 0 680 428" className="h-auto w-full">
        <path
          d="M0,50 L100,44 L156,84 L132,140 L66,152 L0,116 Z"
          fill="#0D161C"
          stroke="#182229"
          strokeWidth="1"
        />
        <path
          d="M630,380 L680,356 L680,428 L580,428 L568,398 Z"
          fill="#0D161C"
          stroke="#182229"
          strokeWidth="1"
        />
        <circle cx="340" cy="214" r="168" fill="none" stroke="#182229" strokeWidth="1" />
        <circle cx="340" cy="214" r="112" fill="none" stroke="#182229" strokeWidth="1" />
        <circle cx="340" cy="214" r="56" fill="none" stroke="#182229" strokeWidth="1" />
        <text x="345" y="207" fontFamily="monospace" fontSize="8.5" fill="#3C4750">
          6NM
        </text>
        <text x="345" y="151" fontFamily="monospace" fontSize="8.5" fill="#3C4750">
          4NM
        </text>
        <text x="345" y="95" fontFamily="monospace" fontSize="8.5" fill="#3C4750">
          2NM
        </text>
        <g id="ticks" />
        <text
          x="340"
          y="34"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="11"
          fill="#7C8894"
          fontWeight="bold"
        >
          N
        </text>
        <text
          x="340"
          y="402"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="11"
          fill="#4E5B65"
        >
          S
        </text>
        <text
          x="626"
          y="219"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="11"
          fill="#4E5B65"
        >
          E
        </text>
        <text
          x="54"
          y="219"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="11"
          fill="#4E5B65"
        >
          W
        </text>
        <line
          x1="340"
          y1="214"
          x2="479"
          y2="45"
          stroke="#3A4E56"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <g className="bridge-sweep" style={{ pointerEvents: "none" }}>
          <path d="M340,214 L340,46 A168,168 0 0,1 483,124 Z" fill="url(#sweepGrad)" />
        </g>
        <defs>
          <linearGradient id="sweepGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#33D3A6" stopOpacity="0" />
            <stop offset="100%" stopColor="#33D3A6" stopOpacity="0.20" />
          </linearGradient>
        </defs>
        <g transform="translate(340,214)">
          <path d="M0,-11 L8,10 L0,6 L-8,10 Z" fill="#E7ECEF" />
          <text x="12" y="16" fontFamily="monospace" fontSize="9" fill="#48545D">
            HDG 247° · 11.4KN
          </text>
        </g>
        <g
          data-name="M/V KESTREL 2"
          data-type="Cargo · 4200t · AIS ok"
          data-dist="3.1 NM · brg 318°"
          transform="translate(214,126)"
          style={{ cursor: "pointer" }}
          onMouseEnter={onContactEnter}
          onMouseMove={onContactMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <circle r="16" fill="transparent" />
          <circle r="5" fill="none" stroke="#33D3A6" strokeWidth="1.4" />
          <circle r="3.5" fill="#33D3A6" />
          <text x="9" y="4" fontFamily="monospace" fontSize="9.5" fill="#7C8894">
            KESTREL 2
          </text>
        </g>
        <g
          data-name="Fishing vessel (unident.)"
          data-type="No AIS signal"
          data-dist="4.6 NM · brg 142°"
          transform="translate(468,322)"
          style={{ cursor: "pointer" }}
          onMouseEnter={onContactEnter}
          onMouseMove={onContactMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <circle r="16" fill="transparent" />
          <circle r="5" fill="none" stroke="#33D3A6" strokeWidth="1.4" />
          <circle r="3.5" fill="#33D3A6" />
          <text x="9" y="4" fontFamily="monospace" fontSize="9.5" fill="#7C8894">
            UNIDENT.
          </text>
        </g>
        <g
          data-name="M/Y SIRENA"
          data-type="Yacht · 38m · known"
          data-dist="2.0 NM · brg 048°"
          transform="translate(418,150)"
          style={{ cursor: "pointer" }}
          onMouseEnter={onContactEnter}
          onMouseMove={onContactMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <circle r="16" fill="transparent" />
          <circle r="5" fill="none" stroke="#33D3A6" strokeWidth="1.4" />
          <circle r="3.5" fill="#33D3A6" />
          <text x="9" y="4" fontFamily="monospace" fontSize="9.5" fill="#7C8894">
            SIRENA
          </text>
        </g>
        {showNewContact ? (
          <g
            data-name="NEW CONTACT"
            data-type="Unidentified · no AIS"
            data-dist="4.2 NM · closing 8 kn"
            transform="translate(490,300)"
            style={{ cursor: "pointer" }}
            onMouseEnter={onContactEnter}
            onMouseMove={onContactMove}
            onMouseLeave={() => setTooltip(null)}
          >
            <circle r="16" fill="transparent" />
            <circle r="5" fill="none" stroke="#F15A00" strokeWidth="1.4" />
            <circle r="3.5" fill="#F15A00" />
            <text x="9" y="4" fontFamily="monospace" fontSize="9.5" fill="#F15A00">
              NEW CONTACT
            </text>
          </g>
        ) : null}
      </svg>
      {tooltip && typeof document !== "undefined"
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[80] border border-bridge-line bg-bridge-panel px-2 py-1.5 font-mono text-[10px] text-bridge-text shadow-lg"
              style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
            >
              <p className="text-bridge-text">{tooltip.name}</p>
              <p className="text-bridge-dim">{tooltip.type}</p>
              <p className="text-bridge-dim">{tooltip.dist}</p>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
