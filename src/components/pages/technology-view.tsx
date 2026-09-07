"use client";

import Link from "next/link";
import {
  LogTable,
  NumberedGrid,
  NumberedItem,
  OrangeRail,
  PageBody,
  PageHero,
  PageShell,
  SectionTitle,
} from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

const DECK_HREF = "/starwall-intelligence-platform.pdf";

export function TechnologyView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero kicker={t.tech.kicker} title={t.tech.title} lead={t.tech.lead} />
      <PageBody>
        <section aria-labelledby="deck-heading" className="space-y-5">
          <SectionTitle id="deck-heading">{t.tech.deckTitle}</SectionTitle>
          <p className="max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {t.tech.deckLead}
          </p>
          <div className="overflow-hidden border-y border-stroke bg-[#061018]">
            <iframe
              title={t.tech.deckTitle}
              src={`${DECK_HREF}#view=FitH`}
              className="h-[min(78vh,52rem)] w-full bg-[#061018]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href={DECK_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-orange px-4 py-2.5 font-medium text-white hover:bg-orange/90"
            >
              {t.tech.deckOpen}
            </a>
            <a
              href={DECK_HREF}
              download
              className="text-ink underline decoration-stroke underline-offset-4 hover:decoration-orange"
            >
              {t.tech.deckDownload}
            </a>
          </div>
        </section>

        <section aria-labelledby="catalog-heading">
          <SectionTitle id="catalog-heading">{t.tech.catalog}</SectionTitle>
          <div className="mt-6">
            <LogTable
              columns={[t.tech.category, t.tech.connects]}
              rows={t.tech.rows.map((row) => ({ name: row.name, value: row.connects }))}
            />
          </div>
        </section>

        <OrangeRail>
          <p>
            {t.tech.legal}{" "}
            <Link href="/contact" className="font-medium text-orange underline">
              {t.tech.contactUs}
            </Link>
            .
          </p>
        </OrangeRail>

        <section aria-labelledby="oem-heading">
          <SectionTitle id="oem-heading">{t.tech.oem}</SectionTitle>
          <NumberedGrid className="mt-6">
            {t.tech.partners.map((step, index) => (
              <NumberedItem
                key={step.name}
                index={index + 1}
                title={step.name}
                body={step.body}
              />
            ))}
          </NumberedGrid>
        </section>
      </PageBody>
    </PageShell>
  );
}
