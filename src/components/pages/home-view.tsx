"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroRadar } from "@/components/hero-radar";
import { RtlAwareLabel } from "@/components/rtl-aware-label";
import { usePreferences } from "@/lib/i18n/context";

const cardHrefs = ["/how-it-works", "/interface", "/levels", "/technology"] as const;

export function HomeView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <section className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-14 md:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:py-20">
        <div className="space-y-5">
          <p className="text-[13px] text-orange">{t.home.kicker}</p>
          <h1 className="max-w-[18ch] font-heading text-[2.35rem] font-bold leading-[1.12] text-ink sm:text-5xl">
            {t.home.title}
          </h1>
          <p className="max-w-xl text-[1.05rem] leading-[1.65] text-ink/80">
            {t.home.lead}
          </p>
          <ul className="max-w-xl space-y-3 border-s-2 border-orange/70 ps-4 text-sm leading-relaxed text-muted sm:text-[15px]">
            {t.home.points.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
            >
              {t.home.contactCta}
            </Link>
            <a
              href="/starwall-overview.pdf"
              className="inline-flex items-center justify-center gap-2.5 px-1 py-2 text-sm text-ink underline decoration-stroke underline-offset-4 hover:decoration-orange"
            >
              <Image
                src="/overview-leaflet-thumb.jpg"
                alt=""
                width={24}
                height={36}
                className="h-8 w-5 shrink-0 border border-stroke object-cover"
              />
              {t.home.pdfCta}
            </a>
          </div>
        </div>
        <div className="lg:pt-6">
          <HeroRadar />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6 md:px-6">
        <div className="grid gap-px bg-stroke sm:grid-cols-2">
          {t.home.cards.map((card, index) => (
            <Link
              key={cardHrefs[index]}
              href={cardHrefs[index]}
              className="bg-page p-5 hover:bg-panel"
            >
              <h2 className="font-heading text-2xl font-bold text-ink">{card.title}</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{card.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 lg:py-16">
        <p className="text-[13px] text-orange">{t.home.interfaceKicker}</p>
        <h2 className="mt-2 max-w-[22ch] font-heading text-3xl font-bold text-ink sm:text-4xl">
          {t.home.interfaceTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.65] text-muted">
          {t.home.interfaceLead}
        </p>
        <ol className="mt-8 divide-y divide-stroke border-y border-stroke">
          {t.home.interfacePoints.map((item) => (
            <li
              key={item.title}
              className="grid gap-1 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8"
            >
              <h3 className="font-ui text-sm font-semibold text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
        <Link
          href="/interface"
          className="mt-8 inline-flex text-sm font-medium text-orange underline-offset-4 hover:underline"
        >
          {t.home.interfaceCta}
        </Link>
      </section>

      <p className="mx-auto max-w-6xl px-4 pb-16 text-sm text-muted md:px-6">
        <Link href="/containers" className="hover:text-ink">
          <RtlAwareLabel text={t.home.containersLink} />
        </Link>
      </p>
    </div>
  );
}
