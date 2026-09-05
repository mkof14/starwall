"use client";

import Image from "next/image";
import eventLogNew from "../../../public/bridge/event-log-new.png";
import radarNormal from "../../../public/bridge/radar-normal.png";
import recommendedAction from "../../../public/bridge/recommended-action.png";
import riskElevated from "../../../public/bridge/risk-elevated.png";

const stills = {
  "radar-normal.png": radarNormal,
  "risk-elevated.png": riskElevated,
  "recommended-action.png": recommendedAction,
  "event-log-new.png": eventLogNew,
} as const;

type ScenarioStillProps = {
  file: keyof typeof stills | string;
};

export function ScenarioStill({ file }: ScenarioStillProps) {
  const src = stills[file as keyof typeof stills];

  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center border border-bridge-line bg-[#1A222A] font-mono text-sm text-bridge-dim">
        {file}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      unoptimized
      className="h-auto w-full border border-bridge-line object-cover object-top"
    />
  );
}
