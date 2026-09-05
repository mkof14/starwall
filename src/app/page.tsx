import type { Metadata } from "next";
import Link from "next/link";
import { HeroRadar } from "@/components/hero-radar";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.home.title,
  description: pageMeta.home.description,
};

const points = [
  "Works with the equipment you already have — no replacement required",
  "Learns your vessel or site, and gets sharper the longer it runs",
  "Connects straight to AGRON's Security Support Center when it matters",
];

const cards = [
  {
    href: "/how-it-works",
    title: "How it works",
    body: "Connect, understand, decide — in three steps",
  },
  {
    href: "/interface",
    title: "See it in action",
    body: "An interactive look at the Bridge interface",
  },
  {
    href: "/levels",
    title: "Levels",
    body: "From essential monitoring to a fully custom build",
  },
  {
    href: "/technology",
    title: "Equipment",
    body: "What it connects to, and how",
  },
];

export default function OverviewPage() {
  return (
    <div className="bg-white text-navyText">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div className="space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            AGRON MARITIME · STARWALL BY AGRON
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-navyText text-balance sm:text-5xl">
            One picture. Every source. A decision you can trust.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-grey sm:text-lg">
            StarWall connects the equipment already on your yacht, marina, port,
            or private island into a single, continuously updated picture — and
            gives the person in command a clear basis for every decision, in
            seconds.
          </p>
          <ul className="space-y-2 text-sm text-navyText sm:text-base">
            {points.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-orange" aria-hidden>
                  —
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
            >
              Contact AGRON Maritime
            </Link>
            <a
              href="/starwall-overview.pdf"
              className="inline-flex items-center justify-center border border-navyText px-4 py-2.5 text-sm font-medium text-navyText hover:border-orange hover:text-orange"
            >
              Download overview (PDF)
            </a>
          </div>
        </div>
        <HeroRadar />
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-16 md:grid-cols-2 md:px-6 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-gray-200 bg-white p-5 transition-colors hover:border-orange/50"
          >
            <h2 className="font-heading text-xl font-bold text-navyText">
              {card.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-grey">{card.body}</p>
          </Link>
        ))}
      </section>

      <p className="mx-auto max-w-6xl px-4 pb-16 text-sm text-grey md:px-6">
        <Link href="/containers" className="hover:text-navyText">
          StarWall also runs inside AGRON&apos;s deployable container hardware →
        </Link>
      </p>
    </div>
  );
}
