"use client";

import { useId, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import {
  motionTowardOwnShip,
  radarScene,
  toneColor,
  type ContactMotion,
  type PictureContact,
} from "@/lib/picture-scenes";

type Tooltip = {
  x: number;
  y: number;
  name: string;
  type: string;
  dist: string;
};

type BridgeRadarProps = {
  scenarioId?: string;
  degraded?: "radar" | "ais" | null;
  empty?: boolean;
};

const TICKS = Array.from({ length: 36 }, (_, index) => index * 10);

function motionClass(motion?: ContactMotion) {
  if (motion === "close") return "contact-close";
  if (motion === "inbound") return "contact-inbound";
  if (motion === "orbit") return "contact-orbit";
  if (motion === "hold") return "contact-hold";
  return undefined;
}

function ContactMark({ contact }: { contact: PictureContact }) {
  const color = toneColor(contact.tone);
  const shape = contact.shape ?? "vessel";
  if (shape === "uav") {
    return (
      <g fill="none" stroke={color} strokeWidth="1.3">
        <circle className="hud-contact-pulse" r="14" />
        <path d="M0,-7 L6,0 L0,7 L-6,0 Z" fill={color} stroke="none" />
        <g className="uav-rotor">
          <path d="M-10,0 H10 M0,-10 V10" />
        </g>
      </g>
    );
  }
  if (shape === "usv") {
    return (
      <g fill="none" stroke={color} strokeWidth="1.3">
        <circle className="hud-contact-pulse" r="13" />
        <path d="M-8,4 L-5,-5 H5 L8,4 Z" fill={color} fillOpacity="0.85" />
      </g>
    );
  }
  if (shape === "mob") {
    return (
      <g fill="none" stroke={color} strokeWidth="1.5">
        <circle className="hud-contact-pulse" r="16" />
        <circle r="5" fill={color} stroke="none" />
        <path d="M-7,8 L0,2 L7,8" />
      </g>
    );
  }
  return (
    <g>
      {contact.tone !== "ok" ? (
        <circle className="hud-contact-pulse" r="14" fill="none" stroke={color} strokeWidth="1.2" />
      ) : null}
      <circle r="5" fill="none" stroke={color} strokeWidth="1.4" />
      <circle r="3.5" fill={color} />
    </g>
  );
}

export function BridgeRadar({
  scenarioId = "",
  degraded,
  empty,
}: BridgeRadarProps) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const scene = radarScene(scenarioId);
  const uid = useId().replace(/:/g, "");

  function onContactEnter(
    event: MouseEvent<SVGGElement>,
    contact: PictureContact,
  ) {
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      name: contact.name,
      type: contact.type,
      dist: contact.dist,
    });
  }

  function onContactMove(event: MouseEvent<SVGGElement>) {
    setTooltip((current) =>
      current ? { ...current, x: event.clientX, y: event.clientY } : current,
    );
  }

  return (
    <div
      className="instrument-radar relative overflow-hidden"
      data-testid="picture-scene"
      data-scene={scenarioId || "watch"}
    >
      <div className="flex items-center justify-between border-b border-[#13432C] bg-[#07150E] px-3 py-1 font-mono text-[9px] tracking-[0.16em] text-[#7DCF9A]">
        <span>S-BAND ARPA · RDR-6</span>
        <span>GAIN 72 · SEA 18 · RAIN 0 · TRAILS 6M</span>
      </div>
      <svg viewBox="0 0 680 428" className="h-auto w-full">
        <defs>
          <linearGradient id={`sweepGrad-${uid}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#2EE59A" stopOpacity="0" />
            <stop offset="100%" stopColor="#2EE59A" stopOpacity="0.28" />
          </linearGradient>
          <radialGradient id={`scopeGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0A2A18" />
            <stop offset="100%" stopColor="#03140C" />
          </radialGradient>
        </defs>
        <rect width="680" height="428" fill={`url(#scopeGlow-${uid})`} />
        <path
          d="M0,50 L100,44 L156,84 L132,140 L66,152 L0,116 Z"
          fill="#062016"
          stroke="#13432C"
          strokeWidth="1"
        />
        <path
          d="M630,380 L680,356 L680,428 L580,428 L568,398 Z"
          fill="#062016"
          stroke="#13432C"
          strokeWidth="1"
        />
        <circle cx="340" cy="214" r="168" fill="none" stroke="#1A5C3A" strokeWidth="1.2" />
        <circle cx="340" cy="214" r="112" fill="none" stroke="#164E32" strokeWidth="1" />
        <circle cx="340" cy="214" r="56" fill="none" stroke="#164E32" strokeWidth="1" />
        <text x="345" y="207" fontFamily="monospace" fontSize="8.5" fill="#2F6B4A">
          6NM
        </text>
        <text x="345" y="151" fontFamily="monospace" fontSize="8.5" fill="#2F6B4A">
          4NM
        </text>
        <text x="345" y="95" fontFamily="monospace" fontSize="8.5" fill="#2F6B4A">
          2NM
        </text>
        {TICKS.map((deg) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          const longer = deg % 30 === 0;
          const inner = longer ? 158 : 164;
          return (
            <line
              key={deg}
              x1={340 + inner * Math.cos(rad)}
              y1={214 + inner * Math.sin(rad)}
              x2={340 + 168 * Math.cos(rad)}
              y2={214 + 168 * Math.sin(rad)}
              stroke="#1A5C3A"
              strokeWidth={longer ? 1.4 : 1}
            />
          );
        })}
        <text x="340" y="34" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#7DCF9A" fontWeight="bold">
          N
        </text>
        <text x="340" y="402" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#3E7A58">
          S
        </text>
        <text x="626" y="219" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#3E7A58">
          E
        </text>
        <text x="54" y="219" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#3E7A58">
          W
        </text>
        <line
          x1="340"
          y1="214"
          x2="479"
          y2="45"
          stroke="#2A6A48"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        {degraded === "radar" || empty ? null : (
          <g className="bridge-sweep">
            <path d={`M340,214 L340,46 A168,168 0 0,1 483,124 Z`} fill={`url(#sweepGrad-${uid})`} />
          </g>
        )}
        <g transform="translate(340,214)">
          <path d="M0,-11 L8,10 L0,6 L-8,10 Z" fill="#E7ECEF" />
          {empty ? null : (
            <text x="12" y="16" fontFamily="monospace" fontSize="9" fill="#5A9A72">
              {scene.heading}
            </text>
          )}
        </g>
        {empty
          ? null
          : scene.contacts.map((contact) => {
              const shift = motionTowardOwnShip(
                contact.x,
                contact.y,
                contact.motion === "inbound" ? 36 : 18,
              );
              return (
                <g
                  key={contact.id}
                  transform={`translate(${contact.x} ${contact.y})`}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(event) => onContactEnter(event, contact)}
                  onMouseMove={onContactMove}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <g
                    className={cn(motionClass(contact.motion))}
                    style={{
                      ["--mx" as string]: `${shift.mx}px`,
                      ["--my" as string]: `${shift.my}px`,
                    }}
                  >
                    <circle r="16" fill="transparent" />
                    <ContactMark contact={contact} />
                    <text
                      x="12"
                      y="4"
                      fontFamily="monospace"
                      fontSize="9.5"
                      fill={toneColor(contact.tone)}
                    >
                      {contact.label}
                    </text>
                  </g>
                </g>
              );
            })}
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
