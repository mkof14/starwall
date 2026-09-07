"use client";

import Link from "next/link";
import {
  OrangeRail,
  PageBody,
  PageHero,
  PageShell,
  RuleList,
  RuleRow,
  SectionTitle,
} from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

export function AboutView() {
  const { t } = usePreferences();
  const copy = t.about;

  return (
    <PageShell>
      <PageHero kicker={copy.kicker} title={copy.title} lead={copy.lead} />
      <PageBody>
        <section aria-labelledby="beliefs-heading">
          <SectionTitle id="beliefs-heading">{copy.beliefsTitle}</SectionTitle>
          <RuleList>
            {copy.beliefs.map((item) => (
              <RuleRow key={item.title} title={item.title} body={item.body} />
            ))}
          </RuleList>
        </section>

        <section aria-labelledby="team-heading">
          <SectionTitle id="team-heading">{copy.teamTitle}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {copy.teamBody}
          </p>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-ink/80">
            {copy.teamField}
          </p>
          <OrangeRail className="mt-6 space-y-4">
            {copy.teamPoints.map((item) => (
              <div key={item.title}>
                <p className="font-heading text-lg font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </OrangeRail>
        </section>

        <section aria-labelledby="agron-heading">
          <SectionTitle id="agron-heading">{copy.agronTitle}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
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
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-ink/80">
            {copy.agronTeam}
          </p>
        </section>

        <section aria-label={copy.contactCta} className="space-y-5">
          <OrangeRail>
            <p>{copy.todayCta}</p>
          </OrangeRail>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
          >
            {copy.contactCta}
          </Link>
        </section>
      </PageBody>
    </PageShell>
  );
}
