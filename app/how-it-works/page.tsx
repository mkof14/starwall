import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "How it works",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6">
      <PageIntro
        eyebrow="How it works"
        title="From sensors on the water to a decision on the Bridge"
        lede="StarWall collects, correlates, and presents security-relevant information so a captain, officer, or owner can act with context. It does not take unsupervised physical action."
      />

      <div className="grid gap-10 lg:grid-cols-3">
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-sand">Capabilities</h2>
          <p className="text-sm leading-relaxed text-sand/70">
            Watch support across vessels, marinas, ports, and private islands:
            integration of existing equipment, a single operating picture, and
            a recorded event trail.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-sand">Architecture</h2>
          <p className="text-sm leading-relaxed text-sand/70">
            On-site units and gateways feed the Bridge. Source-document
            diagrams from the software-intelligence brief will sit here in the
            next content pass.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-sand">Scenario</h2>
          <p className="text-sm leading-relaxed text-sand/70">
            A walkthrough from detection to human authorization — condensed
            from the content spec — will replace this holding copy.
          </p>
        </section>
      </div>
    </div>
  );
}
