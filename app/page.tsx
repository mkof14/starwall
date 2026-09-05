import Link from "next/link";
import { AmbientRadar } from "@/components/ambient-radar";
import { Wordmark } from "@/components/wordmark";

const sections = [
  {
    href: "/how-it-works",
    title: "How it works",
    body: "Capabilities, architecture, and a walkthrough of how a watch is supported.",
  },
  {
    href: "/interface",
    title: "Interface",
    body: "The AGRON Bridge demo — radar, telemetry, and alert state.",
  },
  {
    href: "/levels",
    title: "Levels",
    body: "Assess, Protect, and Intelligence + Support — what is available now.",
  },
  {
    href: "/technology",
    title: "Technology",
    body: "Equipment integration catalog and OEM partnership tiers.",
  },
  {
    href: "/faq",
    title: "FAQ",
    body: "Direct answers for owners, captains, brokers, and pilot partners.",
  },
  {
    href: "/contact",
    title: "Contact",
    body: "Request a briefing or a pilot conversation.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <section className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Wordmark full className="block" />
          <p className="max-w-xl text-lg leading-relaxed text-sand/75 sm:text-xl">
            Intelligence, integration, and decision-support for yacht, marina,
            port, and private-island security.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-sm bg-orange px-4 py-2 text-sm font-medium text-navy hover:bg-orange/90"
            >
              See how it works
            </Link>
            <Link
              href="/interface"
              className="inline-flex items-center justify-center rounded-sm border border-sand/25 px-4 py-2 text-sm font-medium text-sand hover:border-sand/50"
            >
              Open the Bridge demo
            </Link>
          </div>
        </div>
        <AmbientRadar />
      </section>

      <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group border border-sand/15 p-5 transition-colors hover:border-orange/60"
          >
            <h2 className="font-serif text-2xl text-sand">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-sand/65">
              {section.body}
            </p>
            <p className="mt-4 text-xs uppercase tracking-widest text-orange">
              Open
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
