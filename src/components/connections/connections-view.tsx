"use client";

import Link from "next/link";
import { ConnectionsMap } from "@/components/connections/connections-map";
import { LiveModeBanner } from "@/components/live-mode-banner";
import { usePreferences } from "@/lib/i18n/context";
import { useAppMode } from "@/lib/mode";

export function ConnectionsView() {
  const { live } = useAppMode();
  const { t } = usePreferences();
  const copy = t.surface;

  return (
    <div
      className="min-h-screen bg-bridge-bg text-bridge-text"
      dir="ltr"
      data-testid="connections-view"
    >
      {live ? <LiveModeBanner /> : null}

      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-bridge-dim">
              {copy.connectionsKicker}
            </p>
            <h1 className="mt-1 font-ui text-2xl font-bold tracking-wide md:text-3xl">
              {copy.connectionsTitle}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-bridge-dim">
              {live ? copy.connectionsLeadLive : copy.connectionsLead}
            </p>
          </div>
          <Link
            href="/interface"
            className="shrink-0 border border-bridge-line px-3 py-1.5 font-ui text-xs text-bridge-text hover:border-orange hover:text-orange"
          >
            {copy.connectionsBack}
          </Link>
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-bridge-dim">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ok" />
            {copy.connectionsIn}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange" />
            {copy.connectionsOut}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4B5760]" />
            {copy.connectionsOff}
          </li>
        </ul>
      </div>

      <ConnectionsMap />
    </div>
  );
}
