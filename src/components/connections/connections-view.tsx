"use client";

import Link from "next/link";
import { ConnectionsMap } from "@/components/connections/connections-map";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { useAppMode } from "@/lib/mode";

export function ConnectionsView() {
  const { live } = useAppMode();

  return (
    <div
      className="min-h-screen bg-[#0A0F14] text-[#E7ECEF]"
      dir="ltr"
      lang="en"
      data-testid="connections-view"
    >
      {live ? <LiveModeBanner /> : null}

      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-[#7C8894]">
              AGRON BRIDGE · TOPOLOGY
            </p>
            <h1 className="mt-1 font-ui text-2xl font-bold tracking-wide md:text-3xl">
              System Connections Map
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#9CA3AF]">
              {live
                ? "Same layout as the working picture — every unit is waiting for installation. No live sensors are connected yet."
                : "How sensors, the AGRON Container, the Bridge, and Support Center meet at StarWall Core."}
            </p>
          </div>
          <Link
            href="/interface"
            className="shrink-0 border border-[#3A5166] px-3 py-1.5 font-ui text-xs text-[#E7ECEF] hover:border-orange hover:text-orange"
          >
            ← Back to Bridge
          </Link>
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-[#9CA3AF]">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#33D3A6]" />
            Data in (sensors → core)
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F15A00]" />
            Information out (core → Bridge / Support)
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4B5760]" />
            Not connected
          </li>
        </ul>
      </div>

      <ConnectionsMap />
    </div>
  );
}
