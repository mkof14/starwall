import type { Metadata } from "next";
import { cn } from "@/lib/cn";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containersTiers.title,
  description: pageMeta.containersTiers.description,
};

const tiers = [
  {
    name: "Basic",
    body: "Detection suite + StarWall analysis only",
    exclusive: false,
  },
  {
    name: "Business",
    body: "+ extended sensor range, Support Center connection",
    exclusive: false,
  },
  {
    name: "Premium",
    body: "+ countermeasure bay (non-kinetic: electronic warfare)",
    exclusive: false,
  },
  {
    name: "Exclusive",
    body: "Full custom build, up to authorized government/defense configurations, subject to export control and end-user certification",
    exclusive: true,
  },
];

export default function ContainersTiersPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            AGRON Containers
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-navyText sm:text-5xl">
            Container Tiers
          </h1>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={cn(
                "p-5",
                tier.exclusive
                  ? "border border-dashed border-navy bg-navy/5"
                  : "border border-gray-200 bg-white",
              )}
            >
              {tier.exclusive ? (
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-orange">
                  Custom
                </p>
              ) : null}
              <h2 className="font-heading text-2xl font-bold text-navyText">
                {tier.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-grey">{tier.body}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
