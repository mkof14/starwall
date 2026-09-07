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

export function TechnologyView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero kicker={t.tech.kicker} title={t.tech.title} lead={t.tech.lead} />
      <PageBody>
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
