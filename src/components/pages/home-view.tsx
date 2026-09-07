"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroRadar } from "@/components/hero-radar";
import {
  NumberedGrid,
  NumberedItem,
  PageBody,
  PageHero,
  PageShell,
  RuleList,
  RuleRow,
  SectionKicker,
  SectionTitle,
} from "@/components/page-chrome";
import { RtlAwareLabel } from "@/components/rtl-aware-label";
import { usePreferences } from "@/lib/i18n/context";

const cardHrefs = ["/how-it-works", "/interface", "/levels", "/technology"] as const;

export function HomeView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero
        kicker={t.home.kicker}
        title={t.home.title}
        lead={t.home.lead}
        aside={<HeroRadar />}
      >
        <ul className="max-w-xl space-y-3 border-s-2 border-orange ps-4 text-sm leading-relaxed text-muted sm:text-[15px]">
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
      </PageHero>

      <PageBody>
        <NumberedGrid>
          {t.home.cards.map((card, index) => (
            <NumberedItem
              key={cardHrefs[index]}
              index={index + 1}
              title={card.title}
              body={card.body}
              href={cardHrefs[index]}
            />
          ))}
        </NumberedGrid>

        <section>
          <SectionKicker>{t.home.interfaceKicker}</SectionKicker>
          <SectionTitle>{t.home.interfaceTitle}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {t.home.interfaceLead}
          </p>
          <RuleList>
            {t.home.interfacePoints.map((item) => (
              <RuleRow key={item.title} title={item.title} body={item.body} />
            ))}
          </RuleList>
          <Link
            href="/interface"
            className="mt-8 inline-flex text-sm font-medium text-orange underline-offset-4 hover:underline"
          >
            {t.home.interfaceCta}
          </Link>
        </section>

        <p className="text-sm text-muted">
          <Link href="/containers" className="hover:text-ink">
            <RtlAwareLabel text={t.home.containersLink} />
          </Link>
        </p>
      </PageBody>
    </PageShell>
  );
}
