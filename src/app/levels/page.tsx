import type { Metadata } from "next";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Levels",
};

const tiers = [
  {
    name: "LIGHT",
    subtitle: "Essential",
    points: [
      "Equipment connection for what the client already has",
      "Unified picture in one interface",
      "Support during business hours",
    ],
    highlight: false,
  },
  {
    name: "ADVANCED",
    subtitle: "Standard Protection",
    points: [
      "Risk Engine, 4 threat levels",
      "Event and object history",
      "Support Center 24/7",
    ],
    highlight: false,
  },
  {
    name: "INTELLIGENCE",
    subtitle: "Adaptive",
    points: [
      "Adaptive AI and anomaly detection",
      "Scenario Engine",
      "Proactive monitoring support",
    ],
    highlight: false,
  },
  {
    name: "CUSTOM",
    subtitle: "Bespoke Solutions",
    points: [
      "Individual configuration",
      "Specialized equipment, Crisis Mode",
      "Dedicated security lead",
    ],
    highlight: true,
  },
];

const availableNow = [
  "Equipment integration (Gateway)",
  "Unified situational picture",
  "Rule-based risk levels",
  "Bridge interface",
  "Manual escalation to Support Center",
];

const inDevelopment = [
  "Adaptive AI / anomaly detection",
  "Scenario Engine",
  "Multi-object Family Office view",
  "Special Event / Crisis Mode",
  "Automated report generation",
];

export default function LevelsPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            Levels
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-navyText sm:text-5xl">
            From essential monitoring to a fully custom build
          </h1>
        </header>

        <section aria-label="Service tiers">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={cn(
                  "border p-5",
                  tier.highlight
                    ? "border-navy bg-navy text-sand"
                    : "border-gray-200 bg-white text-navyText",
                )}
              >
                <h2
                  className={cn(
                    "font-heading text-2xl font-bold",
                    tier.highlight ? "text-sand" : "text-navyText",
                  )}
                >
                  {tier.name}
                </h2>
                <p
                  className={cn(
                    "mt-1 text-sm italic",
                    tier.highlight ? "text-sand/70" : "text-grey",
                  )}
                >
                  {tier.subtitle}
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {tier.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="text-orange" aria-hidden>
                        —
                      </span>
                      <span
                        className={
                          tier.highlight ? "text-sand/85" : "text-navyText"
                        }
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <p className="max-w-3xl text-sm leading-relaxed text-grey">
          These levels map to AGRON Maritime&apos;s existing service structure:
          LIGHT and ADVANCED sit within Protect, INTELLIGENCE and CUSTOM extend
          into Intelligence + Support.
        </p>

        <section className="space-y-5" aria-labelledby="honesty-heading">
          <p className="text-sm italic text-grey">
            We&apos;d rather tell you exactly what&apos;s built than promise
            everything at once.
          </p>
          <h2 id="honesty-heading" className="sr-only">
            Available now and in development
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-ok/40 bg-white p-6">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-ok">
                Available now
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-navyText">
                {availableNow.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-orange" aria-hidden>
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-gray-200 bg-gray-50 p-6 text-grey">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-attn">
                In development
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {inDevelopment.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
