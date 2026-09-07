"use client";

import Link from "next/link";
import { usePreferences } from "@/lib/i18n/context";

export function AboutView() {
  const { t } = usePreferences();
  const copy = t.about;

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 md:px-6 lg:py-20">
        <header className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            {copy.kicker}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            {copy.lead}
          </p>
        </header>

        <section aria-labelledby="beliefs-heading" className="space-y-5">
          <h2
            id="beliefs-heading"
            className="font-heading text-3xl font-bold text-ink"
          >
            {copy.beliefsTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {copy.beliefs.map((item) => (
              <article key={item.title} className="border border-stroke bg-page p-5">
                <h3 className="font-heading text-xl font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="team-heading" className="space-y-5">
          <div className="max-w-3xl space-y-4">
            <h2 id="team-heading" className="font-heading text-3xl font-bold text-ink">
              {copy.teamTitle}
            </h2>
            <p className="text-sm leading-relaxed text-muted sm:text-base">{copy.teamBody}</p>
            <p className="text-sm leading-relaxed text-ink sm:text-base">{copy.teamField}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {copy.teamPoints.map((item) => (
              <article key={item.title} className="border border-stroke bg-page p-5">
                <h3 className="font-heading text-xl font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="agron-heading" className="max-w-3xl space-y-4">
          <h2 id="agron-heading" className="font-heading text-3xl font-bold text-ink">
            {copy.agronTitle}
          </h2>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            {copy.agronBefore}
            <a
              href="https://agron1.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-orange underline-offset-2 hover:underline"
            >
              {copy.agronLink}
            </a>
            {copy.agronAfter}
          </p>
          <p className="text-sm leading-relaxed text-ink sm:text-base">{copy.agronTeam}</p>
        </section>

        <section
          aria-label={copy.contactCta}
          className="max-w-3xl space-y-5 border border-stroke bg-panel px-5 py-6 md:px-7 md:py-8"
        >
          <p className="text-sm leading-relaxed text-muted sm:text-base">{copy.todayCta}</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
          >
            {copy.contactCta}
          </Link>
        </section>
      </div>
    </div>
  );
}
