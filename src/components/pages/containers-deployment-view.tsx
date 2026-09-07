"use client";

import { ContainersBackLink } from "@/components/containers-back-link";
import {
  NumberedGrid,
  NumberedItem,
  PageBody,
  PageHero,
  PageShell,
} from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersDeploymentView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero
        kicker={t.containers.eyebrow}
        title={t.containers.deployTitle}
        preface={<ContainersBackLink />}
      />
      <PageBody>
        <NumberedGrid className="xl:grid-cols-3">
          {t.containers.cases.map((item, index) => (
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
