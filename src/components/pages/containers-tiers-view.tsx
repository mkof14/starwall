"use client";

import Link from "next/link";
import { ContainersBackLink } from "@/components/containers-back-link";
import {
  NumberedGrid,
  NumberedItem,
  PageBody,
  PageHero,
  PageShell,
} from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

export function ContainersTiersView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero
        kicker={t.containers.eyebrow}
        title={t.containers.tiersTitle}
        preface={<ContainersBackLink />}
      />
      <PageBody>
        <NumberedGrid>
          {t.containers.tiers.map((tier, index) => (
            <NumberedItem
              key={tier.name}
              index={index + 1}
              title={tier.name}
              meta={index === 3 ? t.containers.customBadge : undefined}
              body={tier.body}
            />
          ))}
        </NumberedGrid>
        <p className="max-w-3xl text-sm leading-relaxed">
          <Link
            href="/pricing"
            className="font-medium text-orange underline-offset-2 hover:underline"
          >
            {t.pricing.levelsCta}
          </Link>
        </p>
      </PageBody>
    </PageShell>
  );
}
