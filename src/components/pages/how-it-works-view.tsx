"use client";

import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { usePreferences } from "@/lib/i18n/context";

export function HowItWorksView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            {t.how.kicker}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
            {t.how.title}
          </h1>
        </header>

        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="sr-only">
            {t.how.stepsLabel}
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {t.how.steps.map((step, index) => (
              <li key={step.title} className="border border-stroke bg-page p-5">
                <p className="font-heading text-3xl font-bold text-orange">
                  {index + 1}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="architecture-heading" className="space-y-5">
          <h2
            id="architecture-heading"
            className="font-heading text-3xl font-bold text-ink"
          >
            {t.how.architecture}
          </h2>
          <ArchitectureDiagram />
        </section>

        <section aria-labelledby="capabilities-heading" className="space-y-5">
          <h2
            id="capabilities-heading"
            className="font-heading text-3xl font-bold text-ink"
          >
            {t.how.does}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {t.how.capabilities.map((item) => (
              <article key={item.title} className="border border-stroke bg-page p-5">
                <h3 className="font-heading text-xl font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
