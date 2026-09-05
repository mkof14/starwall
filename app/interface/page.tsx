import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Interface",
};

export default function InterfacePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-6">
      <PageIntro
        eyebrow="AGRON Bridge"
        title="The operating picture"
        lede="This page will host the interactive Bridge demo: compass-ring radar, telemetry strip, event log, and a two-state risk machine (normal / elevated)."
      />

      <div className="border border-sand/15 bg-navy-text/20 px-6 py-16 text-center">
        <p className="font-bridge text-sm uppercase tracking-[0.25em] text-sand/50">
          Bridge demo
        </p>
        <p className="mt-4 font-serif text-2xl text-sand">
          Interactive prototype lands in a later task
        </p>
        <p className="mx-auto mt-3 max-w-lg text-sm text-sand/60">
          StarWall by AGRON — demo interface, illustrative data, not a live
          vessel.
        </p>
      </div>
    </div>
  );
}
