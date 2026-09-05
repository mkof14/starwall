import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Levels",
};

export default function LevelsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6">
      <PageIntro
        eyebrow="Service levels"
        title="Assess, Protect, Intelligence + Support"
        lede="Tiers map to how much of the watch StarWall covers. Roadmap items stay labeled as in development — nothing here is presented as shipped unless it is."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <section className="border border-ok/40 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ok">
            Available now
          </p>
          <h2 className="mt-3 font-serif text-3xl text-sand">Current offering</h2>
          <p className="mt-3 text-sm leading-relaxed text-sand/70">
            The shipped tier table from the MVP scope will be listed here. No
            invented package names or prices in this scaffold.
          </p>
        </section>
        <section className="border border-attn/40 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-attn">
            In development
          </p>
          <h2 className="mt-3 font-serif text-3xl text-sand">On the roadmap</h2>
          <p className="mt-3 text-sm leading-relaxed text-sand/70">
            Later capabilities stay in this column until they exist. They are
            not sold as available.
          </p>
        </section>
      </div>
    </div>
  );
}
