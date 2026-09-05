"use client";

import Link from "next/link";
import { HeroRadar } from "@/components/hero-radar";
import { usePreferences } from "@/lib/i18n/context";

const cardHrefs = ["/how-it-works", "/interface", "/levels", "/technology"] as const;

export function HomeView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div className="space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            {t.home.kicker}
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-ink text-balance sm:text-5xl">
            {t.home.title}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {t.home.lead}
          </p>
          <ul className="space-y-2 text-sm text-ink sm:text-base">
            {t.home.points.map((line) => (
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
              {t.home.contactCta}
            </Link>
            <a
              href="/starwall-overview.pdf"
              className="inline-flex items-center justify-center gap-2.5 border border-ink px-4 py-2 text-sm font-medium text-ink hover:border-orange hover:text-orange"
            >
              <img
                src="/overview-leaflet-thumb.jpg"
                alt=""
                width={24}
                height={36}
                className="h-9 w-6 shrink-0 border border-stroke object-cover"
              />
              {t.home.pdfCta}
            </a>
          </div>
        </div>
        <HeroRadar />
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-16 md:grid-cols-2 md:px-6 xl:grid-cols-4">
        {t.home.cards.map((card, index) => (
          <Link
            key={cardHrefs[index]}
            href={cardHrefs[index]}
            className="border border-stroke bg-page p-5 transition-colors hover:border-orange/50"
          >
            <h2 className="font-heading text-xl font-bold text-ink">{card.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
          </Link>
        ))}
      </section>

      <p className="mx-auto max-w-6xl px-4 pb-16 text-sm text-muted md:px-6">
        <Link href="/containers" className="hover:text-ink">
          {t.home.containersLink}
        </Link>
      </p>
    </div>
  );
}
