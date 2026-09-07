"use client";

import { ContainersBackLink } from "@/components/containers-back-link";
import { OrangeRail, PageBody, PageHero, PageShell, RuleList, RuleRow } from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersSpecsView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero
        kicker={t.containers.eyebrow}
        title={t.containers.specsTitle}
        preface={<ContainersBackLink />}
      />
      <PageBody>
        <RuleList>
          {t.containers.specs.map((row) => (
            <RuleRow key={row.label} title={row.label} body={row.value} />
          ))}
        </RuleList>
        <OrangeRail>
          <p className="font-heading text-xl font-bold text-ink">{t.containers.rapid}</p>
        </OrangeRail>
      </PageBody>
    </PageShell>
  );
}
