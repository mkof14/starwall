"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { usePreferences } from "@/lib/i18n/context";

const PLANS = [
  {
    index: 0 as const,
    id: "LIGHT",
    monthly: "$1,500",
    equipment: "$8,000",
    popular: false,
    custom: false,
  },
  {
    index: 1 as const,
    id: "ADVANCED",
    monthly: "$3,500",
    equipment: "$12,000",
    popular: true,
    custom: false,
  },
  {
    index: 2 as const,
    id: "INTELLIGENCE",
    monthly: "$7,000",
    equipment: "$18,000",
    popular: false,
    custom: false,
  },
  {
    index: 3 as const,
    id: "CUSTOM",
    monthly: null,
    equipment: null,
    popular: false,
    custom: true,
  },
];

export function PricingView() {
  const { t } = usePreferences();
  const { pricing } = t;

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            {pricing.kicker}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
            {pricing.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{pricing.lead}</p>
        </header>

        <section aria-label={pricing.title}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((plan) => {
              const tier = t.levels.tiers[plan.index];
              const href = plan.custom ? "/contact" : `/contact?plan=${plan.id}`;
              return (
                <article
                  key={plan.id}
                  className={cn(
                    "relative flex flex-col border p-5",
                    plan.popular
                      ? "border-orange bg-page text-ink"
                      : plan.custom
                        ? "border-navy bg-navy text-sand"
                        : "border-stroke bg-page text-ink",
                  )}
                >
                  {plan.popular ? (
                    <span className="absolute -top-2.5 left-4 bg-orange px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                      {pricing.mostPopular}
                    </span>
                  ) : null}
                  <h2
                    className={cn(
                      "font-heading text-2xl font-bold",
                      plan.custom ? "text-sand" : "text-ink",
                    )}
                  >
                    {tier.name}
                  </h2>
                  <p
                    className={cn(
                      "mt-1 text-sm italic",
                      plan.custom ? "text-sand/70" : "text-muted",
                    )}
                  >
                    {tier.subtitle}
                  </p>
                  <div className="mt-4 min-h-[4.25rem]">
                    {plan.custom ? (
                      <>
                        <p className="font-heading text-3xl font-bold text-sand">
                          {pricing.contactUs}
                        </p>
                        <p className="mt-1 text-sm text-sand/70">{pricing.customNote}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-heading text-3xl font-bold text-ink">
                          {plan.monthly}
                          <span className="ml-1 font-body text-base font-normal text-muted">
                            {pricing.perMonth}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {pricing.equipmentPrefix} {plan.equipment} {pricing.equipmentSuffix}
                        </p>
                      </>
                    )}
                  </div>
                  <ul className="mt-4 flex-1 space-y-2 text-sm">
                    {tier.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="text-orange" aria-hidden>
                          —
                        </span>
                        <span className={plan.custom ? "text-sand/85" : "text-ink"}>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href}
                    className={cn(
                      "mt-6 inline-flex min-h-11 items-center justify-center px-4 text-sm font-medium",
                      plan.popular
                        ? "bg-orange text-white hover:bg-orange/90"
                        : plan.custom
                          ? "border border-sand/40 text-sand hover:border-sand"
                          : "border border-stroke text-ink hover:border-navy",
                    )}
                  >
                    {plan.custom ? pricing.contactAgron : pricing.getStarted}
                  </Link>
                </article>
              );
            })}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm italic text-muted">
            {pricing.disclaimer}
          </p>
        </section>

        <section className="space-y-8" aria-labelledby="pricing-faq">
          <h2 id="pricing-faq" className="font-heading text-2xl font-bold text-ink">
            {pricing.faqTitle}
          </h2>
          <dl className="space-y-8">
            <div>
              <dt className="font-heading text-lg font-semibold text-ink">{pricing.faq1q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                {pricing.faq1aBefore}{" "}
                <Link href="/containers" className="font-medium text-orange underline-offset-2 hover:underline">
                  {pricing.faq1aLink}
                </Link>
                {pricing.faq1aAfter}
              </dd>
            </div>
            <div>
              <dt className="font-heading text-lg font-semibold text-ink">{pricing.faq2q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{pricing.faq2a}</dd>
            </div>
            <div>
              <dt className="font-heading text-lg font-semibold text-ink">{pricing.faq3q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{pricing.faq3a}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
