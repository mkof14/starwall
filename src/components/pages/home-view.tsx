"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroRadar } from "@/components/hero-radar";
import { RtlAwareLabel } from "@/components/rtl-aware-label";
import { usePreferences } from "@/lib/i18n/context";

const cardHrefs = ["/how-it-works", "/interface", "/levels", "/technology"] as const;
const cardAccent = ["border-l-orange", "border-l-ok", "border-l-attn", "border-l-orange"] as const;
const pointAccent = ["bg-orange", "bg-ok", "bg-attn", "bg-orange", "bg-ok", "bg-attn", "bg-orange", "bg-ok"] as const;

export function HomeView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange via-ok to-orange"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-orange/10 blur-3xl"
          aria-hidden
        />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
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
            <ul className="space-y-2.5 text-sm text-ink sm:text-base">
              {t.home.points.map((line) => (
                <li key={line} className="flex gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange shadow-[0_0_8px_rgb(241_90_0/0.7)]"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-orange px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_rgb(241_90_0/0.28)] hover:bg-orange/90"
              >
                {t.home.contactCta}
              </Link>
              <a
                href="/starwall-overview.pdf"
                className="inline-flex items-center justify-center gap-2.5 border border-ink/20 bg-panel px-4 py-2 text-sm font-medium text-ink shadow-sm hover:border-orange hover:text-orange"
              >
                <Image
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
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-16 md:grid-cols-2 md:px-6 xl:grid-cols-4">
        {t.home.cards.map((card, index) => (
          <Link
            key={cardHrefs[index]}
            href={cardHrefs[index]}
            className={`border border-stroke border-l-4 ${cardAccent[index]} bg-panel p-5 shadow-[0_10px_28px_rgb(15_25_34/0.08)] transition hover:-translate-y-0.5 hover:border-orange/40 hover:shadow-[0_16px_36px_rgb(241_90_0/0.12)]`}
          >
            <h2 className="font-heading text-xl font-bold text-ink">{card.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
          </Link>
        ))}
      </section>

      <section className="relative border-y border-stroke bg-panel">
        <div
          className="pointer-events-none absolute inset-y-0 start-0 w-1 bg-orange"
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 lg:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            {t.home.interfaceKicker}
          </p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold text-ink sm:text-4xl">
            {t.home.interfaceTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {t.home.interfaceLead}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.interfacePoints.map((item, index) => (
              <article
                key={item.title}
                className="border border-stroke bg-page p-4 shadow-[0_8px_22px_rgb(15_25_34/0.07)]"
              >
                <span
                  className={`mb-3 inline-block h-1 w-8 ${pointAccent[index]}`}
                  aria-hidden
                />
                <h3 className="font-heading text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </article>
            ))}
          </div>
          <Link
            href="/interface"
            className="mt-8 inline-flex items-center justify-center bg-navy px-4 py-2.5 text-sm font-medium text-sand shadow-[0_8px_24px_rgb(15_25_34/0.22)] hover:bg-navy/90"
          >
            {t.home.interfaceCta}
          </Link>
        </div>
      </section>

      <p className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted md:px-6">
        <Link href="/containers" className="hover:text-ink hover:underline">
          <RtlAwareLabel text={t.home.containersLink} />
        </Link>
      </p>
    </div>
  );
}
