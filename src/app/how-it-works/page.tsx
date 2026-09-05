import type { Metadata } from "next";
import { ArchitectureDiagram } from "@/components/architecture-diagram";

import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.howItWorks.title,
  description: pageMeta.howItWorks.description,
};

const steps = [
  {
    n: "1",
    title: "Connect",
    body: "StarWall reads from the radar, cameras, AIS, and other systems already installed — no replacement equipment required.",
  },
  {
    n: "2",
    title: "Understand",
    body: "Signals are brought into a single timeline and map, with history retained after each alert is closed.",
  },
  {
    n: "3",
    title: "Decide",
    body: "A clear, explainable risk level and, where needed, a direct line to AGRON's Security Support Center.",
  },
];

const capabilities = [
  {
    title: "Unified picture",
    body: "Radar, video, AIS, drones and perimeter sensors shown as one situational picture, not separate screens.",
  },
  {
    title: "Continuous history",
    body: "Every object and event is retained, not discarded once an alert is closed.",
  },
  {
    title: "Explainable risk levels",
    body: "A defined scale — Normal, Attention, Elevated, Critical — with the reasons behind each change always visible.",
  },
  {
    title: "Works with existing equipment",
    body: "Built to sit on top of the systems already on board or on site, regardless of manufacturer.",
  },
  {
    title: "Learns the specific vessel or site",
    body: "Builds a profile of normal activity for that yacht, marina or property, and flags what falls outside it.",
  },
  {
    title: "Connected to AGRON's Support Center",
    body: "Escalation to a trained specialist when a situation calls for it, not only an automated alert.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            How it works
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-navyText sm:text-5xl">
            Connect, understand, decide
          </h1>
        </header>

        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="sr-only">
            Three-step flow
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.title} className="border border-gray-200 bg-white p-5">
                <p className="font-heading text-3xl font-bold text-orange">{step.n}</p>
                <h3 className="mt-2 font-heading text-2xl font-bold text-navyText">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-grey">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="architecture-heading" className="space-y-5">
          <h2
            id="architecture-heading"
            className="font-heading text-3xl font-bold text-navyText"
          >
            Architecture
          </h2>
          <ArchitectureDiagram />
        </section>

        <section aria-labelledby="capabilities-heading" className="space-y-5">
          <h2
            id="capabilities-heading"
            className="font-heading text-3xl font-bold text-navyText"
          >
            What <span className="text-navyText">Star</span>
            <span className="text-orange">Wall</span> does
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map((item) => (
              <article key={item.title} className="border border-gray-200 bg-white p-5">
                <h3 className="font-heading text-xl font-bold text-navyText">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-grey">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
