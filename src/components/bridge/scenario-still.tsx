"use client";

import { useState } from "react";

type ScenarioStillProps = {
  file: string;
};

export function ScenarioStill({ file }: ScenarioStillProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-video w-full items-center justify-center border border-bridge-line bg-[#1A222A] font-mono text-sm text-bridge-dim">
        {file}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/bridge/${file}`}
      alt=""
      onError={() => setFailed(true)}
      className="aspect-video w-full border border-bridge-line object-cover object-top"
    />
  );
}
