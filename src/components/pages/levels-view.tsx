"use client";

import Link from "next/link";
import {
  NumberedGrid,
  NumberedItem,
  PageBody,
  PageHero,
  PageShell,
} from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";

export function LevelsView() {
  const { t } = usePreferences();

  return (
    <PageShell>
      <PageHero kicker={t.levels.kicker} title={t.levels.title} />
      <PageBody>
        <section aria-label={t.levels.tiersLabel}>
          <NumberedGrid>
            {t.levels.tiers.map((tier, index) => (
              <NumberedItem
                key={tier.name}
                index={index + 1}
                title={tier.name}
                body={
                  <>
                    <p className="italic">{tier.subtitle}</p>
                    <ul className="mt-3 space-y-2">
                      {tier.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="text-orange" aria-hidden>
                            —
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                }
              />
            ))}
          </NumberedGrid>
        </section>

        <p className="max-w-3xl text-sm leading-relaxed text-muted">{t.levels.mapNote}</p>
        <p className="max-w-3xl text-sm leading-relaxed">
          <Link
            href="/pricing"
            className="font-medium text-orange underline-offset-2 hover:underline"
          >
            {t.pricing.levelsCta}
          </Link>
        </p>

        <section aria-labelledby="honesty-heading">
          <p className="text-sm italic text-muted">{t.levels.honesty}</p>
          <h2 id="honesty-heading" className="sr-only">
            {t.levels.honestySr}
          </h2>
          <NumberedGrid>
            <NumberedItem
              index={1}
              title={t.levels.available}
              body={
                <ul className="space-y-2">
                  {t.levels.availableNow.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              }
            />
            <NumberedItem
              index={2}
              title={t.levels.developing}
              body={
                <ul className="space-y-2">
                  {t.levels.inDevelopment.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              }
            />
          </NumberedGrid>
        </section>
      </PageBody>
    </PageShell>
  );
}
