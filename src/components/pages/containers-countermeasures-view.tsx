"use client";

import { ContainersBackLink } from "@/components/containers-back-link";
import {
  NumberedGrid,
  NumberedItem,
  OrangeRail,
  PageBody,
  PageHero,
  PageShell,
} from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersCountermeasuresView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero
        kicker={t.containers.eyebrow}
        title={t.containers.cmTitle}
        preface={<ContainersBackLink />}
      >
        <OrangeRail>
          <p>{t.containers.cmLegal}</p>
        </OrangeRail>
      </PageHero>
      <PageBody>
        <NumberedGrid>
          {t.containers.cmItems.map((item, index) => (
            <NumberedItem
              key={item.name}
              index={index + 1}
              title={item.name}
              body={item.body}
            />
          ))}
        </NumberedGrid>
      </PageBody>
    </PageShell>
  );
}
