import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containers.title,
  description: pageMeta.containers.description,
};

const zones = [
  {
    title: "Detection suite",
    body: "Radar, acoustic sensors, EO/IR & multi-spectrum cameras, sonar",
  },
  {
    title: "Countermeasure bay",
    body: "Available on select tiers — see Countermeasures page",
  },
  {
    title: "Life support & IT",
    body: "Power, communications, server & data racks, environmental control",
  },
  {
    title: "Operator workspace",
    body: "On-site or fully remote command",
  },
];

const subpages = [
  { href: "/containers/tiers", title: "Tiers" },
  { href: "/containers/specs", title: "Specifications" },
  { href: "/containers/countermeasures", title: "Countermeasures" },
  { href: "/containers/deployment", title: "Deployment" },
];

export default function ContainersPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-6 lg:py-20">
        <header className="max-w-3xl space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            AGRON · DEPLOYABLE SECURITY CONTAINER
          </p>
          <h1 className="font-heading text-4xl font-bold text-navyText text-balance sm:text-5xl">
            One container. Full-spectrum awareness.
          </h1>
          <p className="text-base leading-relaxed text-grey sm:text-lg">
            A self-contained detection, analysis, and response platform —
            deployable by land, sea, or fixed site in hours, not weeks.
            Detection and analysis run on StarWall; response equipment is
            available on select tiers, always under human authorization.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {zones.map((zone) => (
            <article key={zone.title} className="border border-gray-200 bg-white p-5">
              <h2 className="font-heading text-xl font-bold text-navyText">
                {zone.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-grey">{zone.body}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {subpages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="border border-gray-200 bg-white px-4 py-3 text-center font-heading text-lg font-bold text-navyText hover:border-orange"
            >
              {page.title}
            </Link>
          ))}
        </section>

        <p className="text-sm text-grey">
          Detection and analysis on this container run on{" "}
          <span className="text-navyText">Star</span>
          <span className="text-orange">Wall</span>
          {" — "}
          <Link href="/how-it-works" className="text-orange hover:underline">
            see how it works →
          </Link>
        </p>

        <Link
          href="/contact"
          className="inline-flex bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
        >
          Contact AGRON
        </Link>
      </div>
    </div>
  );
}
