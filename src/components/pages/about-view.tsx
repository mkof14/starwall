"use client";

import Link from "next/link";
import { usePreferences } from "@/lib/i18n/context";

export function AboutView() {
  const { t } = usePreferences();
  const copy = t.about;

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 md:px-6 lg:py-20">
        <header className="max-w-2xl">
          <p className="text-[13px] text-orange">{copy.kicker}</p>
          <h1 className="mt-2 font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 text-[1.05rem] leading-[1.7] text-ink/80">{copy.lead}</p>
        </header>

        <section aria-labelledby="beliefs-heading" className="max-w-2xl space-y-8">
          <h2
            id="beliefs-heading"
            className="font-heading text-3xl font-bold text-ink"
          >
            {copy.beliefsTitle}
          </h2>
          {copy.beliefs.map((item) => (
            <article key={item.title}>
              <h3 className="font-heading text-xl font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </section>

        <section aria-labelledby="team-heading" className="max-w-2xl space-y-5">
          <h2 id="team-heading" className="font-heading text-3xl font-bold text-ink">
            {copy.teamTitle}
          </h2>
          <p className="text-sm leading-relaxed text-muted sm:text-base">{copy.teamBody}</p>
          <p className="text-sm leading-relaxed text-ink sm:text-base">{copy.teamField}</p>
          <ul className="space-y-4 border-s-2 border-stroke ps-4">
            {copy.teamPoints.map((item) => (
              <li key={item.title}>
                <p className="font-ui text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
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
