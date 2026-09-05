import type { Metadata } from "next";
import { ContainersBackLink } from "@/components/containers-back-link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containersCountermeasures.title,
  description: pageMeta.containersCountermeasures.description,
};

const items = [
  {
    name: "Interceptor drone system",
    body: "High-speed, multi-role UAVs, remote controlled. Max speed 200+ km/h, range up to 20 km, endurance up to 25 min.",
  },
  {
    name: "Electronic warfare",
    body: "Jamming, spoofing, signal denial",
  },
  {
    name: "Microwave system",
    body: "Non-kinetic directed energy, anti-swarm",
  },
];

export default function ContainersCountermeasuresPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-14 md:px-6 lg:py-20">
        <ContainersBackLink />

        <aside className="border-l-4 border-orange bg-[#FFF1E8] px-4 py-4 text-sm leading-relaxed text-navyText">
          Countermeasure equipment is available on select container tiers.
          Enabling or operating it always requires jurisdiction-specific
          authorization and a licensed operator. AGRON Container&apos;s
          detection and analysis layer (StarWall) never triggers these systems
          autonomously — activation is a human decision, made by an authorized
          operator, every time.
        </aside>

        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            AGRON Containers
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-navyText sm:text-5xl">
            Countermeasures
          </h1>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.name} className="border border-gray-200 bg-white p-5">
              <h2 className="font-heading text-xl font-bold text-navyText">
                {item.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-grey">{item.body}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
