"use client";

import { ArchitectureDiagram } from "@/components/architecture-diagram";
import {
  NumberedGrid,
  NumberedItem,
  PageBody,
  PageHero,
  PageShell,
  RuleList,
  RuleRow,
  SectionTitle,
} from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

export function HowItWorksView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero kicker={t.how.kicker} title={t.how.title} />
      <PageBody>
        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="sr-only">
            {t.how.stepsLabel}
          </h2>
          <NumberedGrid>
            {t.how.steps.map((step, index) => (
              <NumberedItem
                key={step.title}
                index={index + 1}
                title={step.title}
                body={step.body}
              />
            ))}
          </NumberedGrid>
        </section>

        <section aria-labelledby="architecture-heading">
          <SectionTitle id="architecture-heading">{t.how.architecture}</SectionTitle>
          <div className="mt-6">
            <ArchitectureDiagram />
          </div>
        </section>

        <section aria-labelledby="capabilities-heading">
          <SectionTitle id="capabilities-heading">{t.how.does}</SectionTitle>
          <RuleList>
            {t.how.capabilities.map((item) => (
              <RuleRow key={item.title} title={item.title} body={item.body} />
            ))}
          </RuleList>
        </section>
      </PageBody>
    </PageShell>
  );
}
