"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CONTAINER_BOX,
  CORE,
  ENDPOINTS,
  MAP_H,
  MAP_W,
  curvePath,
  pointOnLine,
  type MapEndpoint,
} from "@/lib/connections";
import { useAppMode } from "@/lib/mode";
import { cn } from "@/lib/cn";

const R = 30;

function DeviceMark({ id }: { id: string }) {
  const stroke = "currentColor";
  if (id === "radar") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <circle r="4" />
        <circle r="9" />
        <path d="M0,-13 A13,13 0 0 1 11,-7" />
      </g>
    );
  }
  if (id === "sonar") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M-10,6 C-4,-8 4,-8 10,6" />
        <path d="M-6,6 C-2,-2 2,-2 6,6" />
        <circle r="1.6" fill={stroke} />
      </g>
    );
  }
  if (id === "rf") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M0,10 V-2" />
        <path d="M-7,-2 A7,7 0 0 1 7,-2" />
        <path d="M-11,-6 A11,11 0 0 1 11,-6" />
      </g>
    );
  }
  if (id === "cameras") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <rect x="-10" y="-6" width="16" height="12" rx="2" />
        <circle cx="0" cy="0" r="3.2" />
        <path d="M6,-3 L11,-6 V6 L6,3" />
      </g>
    );
  }
  if (id === "power") {
    return (
      <path
        d="M2,-10 L-6,2 H1 L-2,10 L8,-2 H1 Z"
        fill={stroke}
        stroke="none"
      />
    );
  }
  if (id === "ais") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M0,-9 L7,8 H-7 Z" />
        <path d="M-4,8 H4" />
      </g>
    );
  }
  if (id === "satcom") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M-8,8 L4,-6" />
        <path d="M-2,-10 A10,10 0 0 1 10,2" />
        <circle cx="-8" cy="8" r="2" fill={stroke} />
      </g>
    );
  }
  if (id === "perimeter") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M0,-10 L10,-4 V6 L0,12 L-10,6 V-4 Z" />
        <path d="M0,-3 V6" />
      </g>
    );
  }
  if (id === "support") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.5">
        <circle cy="-3" r="4" />
        <path d="M-8,10 A8,7 0 0 1 8,10" />
        <path d="M-10,1 H-7 V6 H-10 Z M10,1 H7 V6 H10 Z" />
      </g>
    );
  }
  return (
    <g fill="none" stroke={stroke} strokeWidth="1.4">
      <rect x="-10" y="-7" width="20" height="14" rx="1.5" />
      <path d="M-6,-2 H6 M-6,2 H3" />
    </g>
  );
}

function Hex({
  cx,
  cy,
  r,
  fill,
  stroke,
  strokeWidth,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <polygon
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

function linePath(item: MapEndpoint) {
  const start =
    item.flow === "in"
      ? pointOnLine(item, CORE, R + 2)
      : pointOnLine(CORE, item, CORE.r + 4);
  const end =
    item.flow === "in"
      ? pointOnLine(CORE, item, CORE.r + 4)
      : pointOnLine(item, CORE, R + 2);
  const bend = 0.1 + ((item.x + item.y) % 17) / 90;
  return { start, end, d: curvePath(start, end, item.flow === "out" ? -bend : bend) };
}

export function ConnectionsMap() {
  const { live } = useAppMode();
  const [hover, setHover] = useState<string | null>(null);
  const [tipAt, setTipAt] = useState<{ x: number; y: number } | null>(null);

  const active = hover;
  const containerHot = active === "container";

  const hovered = ENDPOINTS.find((item) => item.id === active) ?? null;
  const showContainerTip = active === "container";

  return (
    <div className="relative" data-testid="connections-map">
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        role="img"
        aria-label="StarWall system connections map"
        className="h-auto w-full"
      >
        <defs>
          <filter id="core-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="flow-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#152028" strokeWidth="0.6" />
          </pattern>
          <radialGradient id="map-vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0A0F14" stopOpacity="0" />
            <stop offset="100%" stopColor="#05080C" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        <rect width={MAP_W} height={MAP_H} fill="#0A0F14" />
        <rect width={MAP_W} height={MAP_H} fill="url(#map-grid)" />
        <rect width={MAP_W} height={MAP_H} fill="url(#map-vignette)" />
        {[210, 320, 430].map((r) => (
          <circle
            key={r}
            cx={CORE.x}
            cy={CORE.y}
            r={r}
            fill="none"
            stroke={live ? "#1C2830" : "#1E3340"}
            strokeWidth="1"
            className={live ? undefined : "map-ring-breathe"}
          />
        ))}
        {live ? null : (
          <circle
            className="core-orbit-ring"
            cx={CORE.x}
            cy={CORE.y}
            r="118"
            fill="none"
            stroke="#F15A00"
            strokeOpacity="0.28"
            strokeWidth="1.2"
            strokeDasharray="4 14"
          />
        )}

        {ENDPOINTS.map((item) => {
          const { d } = linePath(item);
          const lit =
            active === item.id ||
            (containerHot && item.group === "container");
          const inbound = item.flow === "in";
          return (
            <g key={`link-${item.id}`}>
              {live ? null : (
                <path
                  d={d}
                  fill="none"
                  stroke={inbound ? "#33D3A6" : "#F15A00"}
                  strokeWidth={lit ? 10 : 7}
                  opacity={lit ? 0.16 : 0.07}
                />
              )}
              <path
                d={d}
                fill="none"
                stroke={
                  live
                    ? "#4B5760"
                    : lit
                      ? inbound
                        ? "#33D3A6"
                        : "#F15A00"
                      : "#2A3A48"
                }
                strokeWidth={lit ? 2.8 : 1.6}
                strokeDasharray={live ? "7 7" : undefined}
                className="transition-all duration-200"
              />
              {live ? null : (
                <g filter="url(#flow-glow)">
                  <circle r="4" fill={inbound ? "#33D3A6" : "#F15A00"}>
                    <animateMotion
                      dur={`${2.4 + (item.x % 7) * 0.12}s`}
                      repeatCount="indefinite"
                      path={d}
                    />
                  </circle>
                  <circle r="2.6" fill={inbound ? "#33D3A6" : "#F15A00"} opacity="0.55">
                    <animateMotion
                      dur={`${2.4 + (item.x % 7) * 0.12}s`}
                      begin="0.8s"
                      repeatCount="indefinite"
                      path={d}
                    />
                  </circle>
                  <circle r="2" fill="#E7ECEF" opacity="0.35">
                    <animateMotion
                      dur={`${2.4 + (item.x % 7) * 0.12}s`}
                      begin="1.6s"
                      repeatCount="indefinite"
                      path={d}
                    />
                  </circle>
                </g>
              )}
            </g>
          );
        })}

        <g
          data-testid="container-group"
          onMouseEnter={() => {
            setHover("container");
            setTipAt({
              x: CONTAINER_BOX.x + CONTAINER_BOX.w / 2,
              y: CONTAINER_BOX.y,
            });
          }}
          onMouseLeave={() => {
            setHover(null);
            setTipAt(null);
          }}
        >
          <rect
            x={CONTAINER_BOX.x}
            y={CONTAINER_BOX.y}
            width={CONTAINER_BOX.w}
            height={CONTAINER_BOX.h}
            rx="18"
            fill={containerHot ? "rgba(241,90,0,0.06)" : "rgba(13,22,28,0.72)"}
            stroke={containerHot ? "#F15A00" : live ? "#4B5760" : "#3A5166"}
            strokeWidth="1.6"
            strokeDasharray="10 8"
          />
          <text
            x={CONTAINER_BOX.x + CONTAINER_BOX.w / 2}
            y={CONTAINER_BOX.y + 36}
            textAnchor="middle"
            fill={containerHot ? "#F15A00" : "#9CA3AF"}
            fontFamily="var(--font-space-grotesk), system-ui, sans-serif"
            fontSize="13"
            fontWeight="600"
            letterSpacing="0.28em"
          >
            AGRON CONTAINER
          </text>
        </g>

        <g filter={live ? undefined : "url(#core-glow)"}>
          <circle
            cx={CORE.x}
            cy={CORE.y}
            r="108"
            fill="#F15A00"
            className={live ? "opacity-5" : "core-glow-ring"}
          />
          <circle
            cx={CORE.x}
            cy={CORE.y}
            r="86"
            fill="#F15A00"
            opacity={live ? 0.05 : 0.14}
          />
          <circle
            cx={CORE.x}
            cy={CORE.y}
            r="70"
            fill="#F15A00"
            opacity={live ? 0.06 : 0.2}
          />
          <Hex
            cx={CORE.x}
            cy={CORE.y}
            r={CORE.r}
            fill="#111820"
            stroke={live ? "#4B5760" : "#F15A00"}
            strokeWidth={2.2}
          />
        </g>
        <g>
          <text
            x={CORE.x}
            y={CORE.y + 28}
            textAnchor="middle"
            fill="#9CA3AF"
            fontFamily="var(--font-jetbrains), ui-monospace, monospace"
            fontSize="10"
            letterSpacing="0.22em"
          >
            CORE
          </text>
          {live ? (
            <text
              x={CORE.x}
              y={CORE.y + 36}
              textAnchor="middle"
              fill="#4B5760"
              fontFamily="var(--font-jetbrains), ui-monospace, monospace"
              fontSize="9"
              letterSpacing="0.08em"
            >
              not connected
            </text>
          ) : null}
          <circle
            cx={CORE.x + 38}
            cy={CORE.y - 34}
            r="4"
            fill={live ? "#4B5760" : "#33D3A6"}
          />
        </g>

        {ENDPOINTS.map((item) => {
          const lit = active === item.id || (containerHot && item.group === "container");
          const tone = live ? "#4B5760" : lit ? "#E7ECEF" : "#8A97A3";
          return (
            <g
              key={item.id}
              data-testid={`map-endpoint-${item.id}`}
              transform={`translate(${item.x} ${item.y})`}
              className="cursor-pointer"
              onMouseEnter={() => {
                setHover(item.id);
                setTipAt({ x: item.x, y: item.y - 48 });
              }}
              onMouseLeave={() => {
                setHover(null);
                setTipAt(null);
              }}
            >
              <circle
                r={R}
                fill="#111820"
                stroke={
                  live ? "#4B5760" : lit ? (item.flow === "out" ? "#F15A00" : "#33D3A6") : "#3A5166"
                }
                strokeWidth={lit ? 2.2 : 1.4}
              />
              <g
                className={cn(item.kind === "human" ? "text-[#E8B48A]" : "text-[#9CA3AF]")}
                style={{ color: live ? "#4B5760" : tone }}
              >
                <DeviceMark id={item.id} />
              </g>
              <circle
                cx={18}
                cy={-18}
                r="4.2"
                className={live ? undefined : "map-status-pulse"}
                fill={live ? "#4B5760" : "#33D3A6"}
                stroke="#0A0F14"
                strokeWidth="1.4"
              />
              <text
                y={R + 20}
                textAnchor="middle"
                fill={live ? "#6B7280" : "#E7ECEF"}
                fontFamily="var(--font-space-grotesk), system-ui, sans-serif"
                fontSize="13"
                fontWeight="500"
              >
                {item.label}
              </text>
              {live ? (
                <text
                  y={R + 36}
                  textAnchor="middle"
                  fill="#4B5760"
                  fontFamily="var(--font-jetbrains), ui-monospace, monospace"
                  fontSize="9"
                  letterSpacing="0.08em"
                >
                  not connected
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <Image
        src="/SW3.png"
        alt="StarWall"
        width={2086}
        height={316}
        data-testid="map-core-logo"
        className="pointer-events-none absolute z-[1] h-auto w-[200px] -translate-x-1/2 -translate-y-[80%]"
        style={{
          left: `${(CORE.x / MAP_W) * 100}%`,
          top: `${(CORE.y / MAP_H) * 100}%`,
        }}
      />

      {tipAt && (hovered || showContainerTip) ? (
        <div
          className={cn(
            "absolute z-10 max-w-xs border border-bridge-line bg-[#111820] px-3 py-2 text-sm text-sand shadow-lg",
            showContainerTip ? "pointer-events-auto" : "pointer-events-none",
          )}
          style={{
            left: `${(tipAt.x / MAP_W) * 100}%`,
            top: `${(tipAt.y / MAP_H) * 100}%`,
            transform: "translate(-50%, -110%)",
          }}
          data-testid="map-tooltip"
        >
          {showContainerTip ? (
            <p>
              Deployable hardware unit —{" "}
              <Link href="/containers" className="text-orange hover:underline">
                see /containers for details
              </Link>
            </p>
          ) : (
            <p>{hovered?.tip}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
