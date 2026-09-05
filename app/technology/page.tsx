import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Technology",
};

export default function TechnologyPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6">
      <PageIntro
        eyebrow="Technology"
        title="Equipment integration and OEM partners"
        lede="StarWall connects to the sensors and systems already on the vessel or site. The catalog of categories and partner tiers will be pulled from the integration documents."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3 border border-sand/15 p-6">
          <h2 className="font-serif text-2xl text-sand">Equipment catalog</h2>
          <p className="text-sm leading-relaxed text-sand/70">
            Category list from Integration Catalog v0.1, section 3 — pending
            source copy.
          </p>
        </section>
        <section className="space-y-3 border border-sand/15 p-6">
          <h2 className="font-serif text-2xl text-sand">OEM partnership tiers</h2>
          <p className="text-sm leading-relaxed text-sand/70">
            Partnership levels from Services & Capabilities v0.1, section 4 —
            pending source copy.
          </p>
        </section>
      </div>

      <aside className="border-l-2 border-orange pl-4 text-sm leading-relaxed text-sand/70">
        Specialized or dual-use detection equipment is subject to
        jurisdiction-specific review. Anything beyond detection and analysis
        requires human authorization.
      </aside>
    </div>
  );
}
