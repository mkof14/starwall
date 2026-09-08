"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PageBody,
  PageHero,
  PageShell,
  SectionKicker,
  SectionTitle,
} from "@/components/page-chrome";
import { PlansRequestForm } from "@/components/plans-request-form";
import { cn } from "@/lib/cn";
import { useAuthSession } from "@/lib/auth-session";
import { sessionHasDeskAccess } from "@/lib/commercial-rbac";
import { getPlansDesk } from "@/lib/i18n/plans-desk";
import { getPlansPage } from "@/lib/i18n/plans-page";
import { usePreferences } from "@/lib/i18n/context";
import { deskPaths } from "@/lib/price-book/paths";
import {
  COMPARE_KEYS,
  COMPARE_ROWS,
  ENVIRONMENT_KEYS,
  HARDWARE_KEYS,
  HOW_KEYS,
  PLAN_ORDER,
  POPULAR_PLAN,
  type CompareCell,
  type PlanId,
} from "@/lib/plans";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function PricingView() {
  const { locale } = usePreferences();
  const { session } = useAuthSession();
  const copy = getPlansPage(locale);
  const desk = getPlansDesk(locale);
  const hasDesk = sessionHasDeskAccess(session);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  function goToRequest(plan?: PlanId) {
    if (plan) setSelectedPlan(plan);
    scrollToId("request");
  }

  return (
    <PageShell>
      {hasDesk ? (
        <div
          data-testid="plans-desk-entry"
          className="border-b border-stroke bg-panel px-4 py-4 md:px-6"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-ui text-[11px] tracking-wide text-orange">
                {desk.kicker}
              </p>
              <p className="mt-1 font-heading text-xl font-bold text-ink">
                {desk.title}
              </p>
              <p className="mt-1 max-w-2xl text-sm text-muted">{desk.body}</p>
            </div>
            <Link
              href={deskPaths.root}
              className="inline-flex shrink-0 items-center justify-center bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
            >
              {desk.cta}
            </Link>
          </div>
        </div>
      ) : null}
      <PageHero kicker={copy.kicker} title={copy.title}>
        <p className="max-w-2xl font-heading text-2xl font-semibold leading-snug text-ink sm:text-3xl">
          {copy.supporting}
        </p>
        <p className="max-w-2xl text-[1.05rem] leading-[1.7] text-ink/80">{copy.body}</p>
        <ol className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-heading text-xl font-bold text-ink sm:text-2xl">
          {PLAN_ORDER.map((id, index) => (
            <li key={id} className="flex items-center gap-5">
              {index > 0 ? (
                <span className="hidden h-4 w-px bg-stroke sm:block" aria-hidden />
              ) : null}
              <a href={`#${id.toLowerCase()}`} className="hover:text-orange">
                {id}
              </a>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <a
            href="#compare"
            data-testid="compare-plans"
            className="inline-flex items-center justify-center bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
          >
            {copy.compareCta}
          </a>
          <a
            href="#request"
            data-testid="request-pricing"
            className="inline-flex items-center justify-center px-1 py-2 text-sm text-ink underline decoration-stroke underline-offset-4 hover:decoration-orange"
          >
            {copy.requestCta}
          </a>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted">{copy.heroNote}</p>
      </PageHero>

      <PageBody className="space-y-24">
        <section aria-label={copy.title} className="grid gap-12 md:grid-cols-2 xl:grid-cols-4">
          {PLAN_ORDER.map((id) => {
            const plan = copy.plans[id];
            const popular = id === POPULAR_PLAN;
            return (
              <article
                key={id}
                id={id.toLowerCase()}
                data-testid={`plan-${id}`}
                className="flex scroll-mt-24 flex-col border-t border-stroke pt-6"
              >
                <div className="min-h-[1.15rem]">
                  {popular ? (
                    <p className="font-ui text-[11px] tracking-wide text-orange">
                      {copy.mostPopular}
                    </p>
                  ) : null}
                </div>
                <h2 className="mt-2 font-heading text-3xl font-bold text-ink">{id}</h2>
                <p className="mt-1 text-sm italic text-muted">{plan.subtitle}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink/80">{plan.description}</p>
                <p className="mt-6 font-ui text-[11px] tracking-wide text-muted">
                  {copy.includesLabel}
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
                  {plan.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-auto pt-8 text-xs leading-relaxed text-muted">
                  <span className="text-ink">{copy.bestForLabel}</span>
                  <span className="mt-1 block">{plan.bestFor}</span>
                </p>
                <a
                  href="#request"
                  onClick={() => setSelectedPlan(id)}
                  className="mt-5 self-start text-sm font-medium text-orange underline-offset-4 hover:underline"
                >
                  {plan.cta}
                </a>
              </article>
            );
          })}
        </section>

        <section id="compare" className="scroll-mt-24" aria-labelledby="compare-heading">
          <SectionKicker>{copy.kicker}</SectionKicker>
          <SectionTitle id="compare-heading">{copy.compare.heading}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {copy.compare.subheading}
          </p>
          <div className="mt-8 overflow-x-auto border-y border-stroke">
            <table className="w-full min-w-[40rem] text-start text-sm">
              <caption className="sr-only">{copy.compare.heading}</caption>
              <thead>
                <tr className="border-b border-stroke">
                  <th className="sticky start-0 bg-page py-3 pe-6 text-start font-heading text-base font-bold text-ink">
                    {copy.compare.capability}
                  </th>
                  {PLAN_ORDER.map((id) => (
                    <th
                      key={id}
                      className="px-3 py-3 text-center font-heading text-base font-bold text-ink"
                    >
                      {id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_KEYS.map((key) => (
                  <tr key={key} className="border-t border-stroke">
                    <th className="sticky start-0 bg-page py-3 pe-6 text-start font-medium text-ink">
                      {copy.compare.rows[key]}
                    </th>
                    {COMPARE_ROWS[key].map((cell, index) => (
                      <td key={PLAN_ORDER[index]} className="px-3 py-3 text-center">
                        <CompareMark cell={cell} optionalLabel={copy.optional} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="environments" className="scroll-mt-24" aria-labelledby="environments-heading">
          <SectionKicker>{copy.kicker}</SectionKicker>
          <SectionTitle id="environments-heading">{copy.environments.heading}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {copy.environments.body}
          </p>
          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {ENVIRONMENT_KEYS.map((key) => {
              const item = copy.environments.items[key];
              return (
                <article key={key} className="border-t border-stroke pt-5">
                  <h3 className="font-heading text-2xl font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                  <p className="mt-4 font-ui text-[11px] tracking-wide text-muted">
                    {copy.recommendedLabel}
                    <span className="ms-2 text-ink">{item.recommended}</span>
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="hardware" className="scroll-mt-24" aria-labelledby="hardware-heading">
          <SectionKicker>{copy.kicker}</SectionKicker>
          <SectionTitle id="hardware-heading">{copy.hardware.heading}</SectionTitle>
          <p className="mt-2 max-w-2xl font-heading text-xl text-ink">{copy.hardware.subheading}</p>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {copy.hardware.body}
          </p>
          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {HARDWARE_KEYS.map((key) => {
              const item = copy.hardware.items[key];
              return (
                <article key={key} className="border-t border-stroke pt-5">
                  <h3 className="font-heading text-2xl font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{item.body}</p>
                </article>
              );
            })}
          </div>
          <Link
            href="/technology"
            data-testid="explore-hardware"
            className="mt-8 inline-flex text-sm font-medium text-orange underline-offset-4 hover:underline"
          >
            {copy.hardware.cta}
          </Link>
        </section>

        <section id="pricing-how" className="scroll-mt-24" aria-labelledby="how-heading">
          <SectionKicker>{copy.kicker}</SectionKicker>
          <SectionTitle id="how-heading">{copy.how.heading}</SectionTitle>
          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {HOW_KEYS.map((key, index) => {
              const item = copy.how.items[key];
              const last = index === HOW_KEYS.length - 1;
              return (
                <div key={key} className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  {index > 0 ? (
                    <p
                      className="font-heading text-2xl font-bold text-orange lg:pt-1"
                      aria-hidden
                    >
                      {last ? "=" : "+"}
                    </p>
                  ) : null}
                  <div className={cn("max-w-xs lg:max-w-[10.5rem]", last && "lg:max-w-[12rem]")}>
                    <p className="font-heading text-xl font-bold text-ink">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.caption}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-10 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">{copy.how.body}</p>
          <button
            type="button"
            onClick={() => goToRequest()}
            className="mt-8 inline-flex bg-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-orange/90"
          >
            {copy.how.cta}
          </button>
        </section>

        <section id="request" className="scroll-mt-24 pb-8" aria-labelledby="request-heading">
          <SectionKicker>{copy.kicker}</SectionKicker>
          <SectionTitle id="request-heading">{copy.request.heading}</SectionTitle>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
            {copy.request.body}
          </p>
          <div className="mt-10">
            <PlansRequestForm copy={copy.request} selectedPlan={selectedPlan} />
          </div>
        </section>
      </PageBody>
    </PageShell>
  );
}

function CompareMark({
  cell,
  optionalLabel,
}: {
  cell: CompareCell;
  optionalLabel: string;
}) {
  if (cell === "yes") {
    return (
      <span className="text-orange" aria-label="yes">
        ✓
      </span>
    );
  }
  if (cell === "optional") {
    return <span className="text-xs text-muted">{optionalLabel}</span>;
  }
  return (
    <span className="text-muted" aria-label="not included">
      —
    </span>
  );
}
