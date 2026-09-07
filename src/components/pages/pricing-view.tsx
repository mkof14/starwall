"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { usePreferences } from "@/lib/i18n/context";
import {
  ADDONS,
  CONTAINER_TIERS,
  DEFAULT_SELECTION,
  OBJECT_TYPES,
  SOFTWARE_TIERS,
  calculateQuote,
  formatUsd,
  selectionToQuery,
  type AddonId,
  type ContainerId,
  type ObjectId,
  type PricingSelection,
  type SoftwareId,
} from "@/lib/pricing";

function moneyOrContact(
  amount: number | null,
  contact: string,
  suffix = "",
) {
  if (amount === null) return contact;
  return `${formatUsd(amount)}${suffix}`;
}

export function PricingView() {
  const { t } = usePreferences();
  const { pricing } = t;
  const copy = pricing.config;
  const [selection, setSelection] = useState<PricingSelection>(DEFAULT_SELECTION);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const quote = useMemo(() => calculateQuote(selection), [selection]);

  const objectCopy = copy.objects[selection.objectId];
  const softwareCopy = copy.software[selection.softwareId];
  const containerCopy = copy.containers[selection.containerId];

  function toggleAddon(id: AddonId) {
    setSelection((current) => {
      const has = current.addonIds.includes(id);
      return {
        ...current,
        addonIds: has
          ? current.addonIds.filter((item) => item !== id)
          : [...current.addonIds, id],
      };
    });
  }

  const monthlyLabel = moneyOrContact(quote.monthly, copy.contactPricing, copy.perMonth);
  const oneTimeLabel = moneyOrContact(quote.oneTime, copy.contactPricing);
  const estimate =
    quote.customSoftware && quote.oneTime === null
      ? copy.customQuote
      : `${monthlyLabel}, ${oneTimeLabel} ${copy.oneTimeShort}`;

  const addonSummary = selection.addonIds
    .map((id) => `+ ${copy.addons[id].name}`)
    .join(", ");
  const summaryParts = [
    objectCopy.name,
    softwareCopy.name,
    containerCopy.name,
    addonSummary,
  ].filter(Boolean);
  const quoteMessage = copy.quoteMessage
    .replace("{summary}", summaryParts.join(", "))
    .replace("{estimate}", estimate);
  const contactHref = `/contact?${selectionToQuery(selection)}`;

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-[13px] text-orange">
            {pricing.kicker}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
            {pricing.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{pricing.lead}</p>
        </header>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
          <div className="space-y-8 pb-28 lg:pb-0">
            <Step heading={copy.stepObject} index={1}>
              <div className="grid gap-3 sm:grid-cols-2">
                {OBJECT_TYPES.map((item) => {
                  const selected = selection.objectId === item.id;
                  const label = copy.objects[item.id];
                  return (
                    <SelectCard
                      key={item.id}
                      testId={`object-${item.id}`}
                      selected={selected}
                      title={label.name}
                      detail={label.detail}
                      meta={`${item.multiplier.toFixed(1)}×`}
                      onClick={() =>
                        setSelection((current) => ({ ...current, objectId: item.id as ObjectId }))
                      }
                    />
                  );
                })}
              </div>
            </Step>

            <Step heading={copy.stepSoftware} index={2}>
              <div className="grid gap-3 sm:grid-cols-2">
                {SOFTWARE_TIERS.map((item) => {
                  const selected = selection.softwareId === item.id;
                  const label = copy.software[item.id];
                  return (
                    <SelectCard
                      key={item.id}
                      testId={`software-${item.id}`}
                      selected={selected}
                      title={label.name}
                      detail={label.detail}
                      meta={
                        item.custom
                          ? pricing.contactUs
                          : `${formatUsd(item.monthly ?? 0)}${copy.perMonth}`
                      }
                      badge={"popular" in item && item.popular ? pricing.mostPopular : null}
                      onClick={() =>
                        setSelection((current) => ({
                          ...current,
                          softwareId: item.id as SoftwareId,
                        }))
                      }
                    />
                  );
                })}
              </div>
            </Step>

            <Step heading={copy.stepContainer} index={3}>
              <div className="grid gap-3">
                {CONTAINER_TIERS.map((item) => {
                  const selected = selection.containerId === item.id;
                  const label = copy.containers[item.id];
                  return (
                    <SelectCard
                      key={item.id}
                      testId={`container-${item.id}`}
                      selected={selected}
                      title={label.name}
                      detail={label.detail}
                      meta={
                        item.exclusive
                          ? pricing.contactUs
                          : item.oneTime === 0
                            ? formatUsd(0)
                            : `${formatUsd(item.oneTime ?? 0)} ${copy.oneTimeShort}`
                      }
                      muted={quote.customSoftware}
                      onClick={() =>
                        setSelection((current) => ({
                          ...current,
                          containerId: item.id as ContainerId,
                        }))
                      }
                    />
                  );
                })}
              </div>
            </Step>

            <Step heading={copy.stepAddons} index={4}>
              <ul className="space-y-2">
                {ADDONS.map((item) => {
                  const checked = selection.addonIds.includes(item.id);
                  const label = copy.addons[item.id];
                  const price =
                    item.monthly > 0
                      ? `+${formatUsd(item.monthly)}${copy.perMonth}`
                      : `+${formatUsd(item.oneTime)} ${copy.oneTimeShort}`;
                  return (
                    <li key={item.id}>
                      <label
                        data-testid={`addon-${item.id}`}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 border px-4 py-3",
                          checked ? "border-orange bg-orange/5" : "border-stroke bg-page",
                          quote.customSoftware && "opacity-70",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 accent-orange"
                          checked={checked}
                          onChange={() => toggleAddon(item.id)}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-ui text-sm font-semibold text-ink">
                            {label.name}
                          </span>
                          <span className="mt-0.5 block font-mono text-[11px] text-muted">
                            {price}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Step>
          </div>

          <aside className="hidden lg:block">
            <SummaryPanel
              copy={copy}
              selection={selection}
              quote={quote}
              monthlyLabel={monthlyLabel}
              oneTimeLabel={oneTimeLabel}
              contactHref={contactHref}
              quoteMessage={quoteMessage}
            />
          </aside>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stroke bg-panel/95 p-3 shadow-[0_-8px_24px_rgb(15_25_34/0.12)] backdrop-blur lg:hidden">
          <button
            type="button"
            data-testid="mobile-summary-toggle"
            aria-expanded={summaryOpen}
            onClick={() => setSummaryOpen((value) => !value)}
            className="flex w-full items-center justify-between gap-3 text-start"
          >
            <span>
              <span className="block font-ui text-sm font-semibold text-ink">{monthlyLabel}</span>
              <span className="block font-mono text-[11px] text-muted">
                {copy.oneTimeLabel}: {oneTimeLabel}
              </span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-orange">
              {summaryOpen ? copy.hideSummary : copy.showSummary}
            </span>
          </button>
          {summaryOpen ? (
            <div className="mt-3 max-h-[55vh] overflow-y-auto border border-stroke bg-page p-3">
              <SummaryPanel
                copy={copy}
                selection={selection}
                quote={quote}
                monthlyLabel={monthlyLabel}
                oneTimeLabel={oneTimeLabel}
                contactHref={contactHref}
                quoteMessage={quoteMessage}
                compact
              />
            </div>
          ) : null}
        </div>

        <section className="mt-16 space-y-8" aria-labelledby="pricing-faq">
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

function Step({
  heading,
  index,
  children,
}: {
  heading: string;
  index: number;
  children: ReactNode;
}) {
  return (
    <section>
      <p className="font-mono text-[11px] tracking-[0.22em] text-orange">
        {String(index).padStart(2, "0")}
      </p>
      <h2 className="mt-1 font-heading text-2xl font-bold text-ink">{heading}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SelectCard({
  title,
  detail,
  meta,
  selected,
  onClick,
  testId,
  badge,
  muted,
}: {
  title: string;
  detail: string;
  meta: string;
  selected: boolean;
  onClick: () => void;
  testId: string;
  badge?: string | null;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "relative h-full border p-4 text-start transition-colors",
        selected ? "border-orange bg-orange/5" : "border-stroke bg-page hover:border-navy",
        muted && "opacity-80",
      )}
    >
      {badge ? (
        <span className="absolute -top-2.5 left-4 bg-orange px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
          {badge}
        </span>
      ) : null}
      <span className="flex items-start justify-between gap-3">
        <span className="font-heading text-lg font-bold text-ink">{title}</span>
        <span className="shrink-0 font-mono text-[11px] text-orange">{meta}</span>
      </span>
      <span className="mt-1 block text-sm leading-relaxed text-muted">{detail}</span>
    </button>
  );
}

function SummaryPanel({
  copy,
  selection,
  quote,
  monthlyLabel,
  oneTimeLabel,
  contactHref,
  quoteMessage,
  compact = false,
}: {
  copy: ReturnType<typeof usePreferences>["t"]["pricing"]["config"];
  selection: PricingSelection;
  quote: ReturnType<typeof calculateQuote>;
  monthlyLabel: string;
  oneTimeLabel: string;
  contactHref: string;
  quoteMessage: string;
  compact?: boolean;
}) {
  const object = copy.objects[selection.objectId];
  const software = copy.software[selection.softwareId];
  const container = copy.containers[selection.containerId];

  return (
    <div
      data-testid="pricing-summary"
      className={cn(
        compact ? "" : "sticky top-24 border border-stroke bg-panel p-5",
      )}
    >
      <p className="font-mono text-[11px] tracking-[0.22em] text-orange">{copy.yourConfig}</p>
      <ul className="mt-4 space-y-3 text-sm">
        <Line
          label={object.name}
          value={`${quote.multiplier.toFixed(1)}×`}
        />
        <Line
          label={software.name}
          value={
            quote.softwareMonthly === null
              ? copy.contactPricing
              : `${formatUsd(quote.softwareMonthly)}${copy.perMonth}`
          }
        />
        <Line
          label={container.name}
          value={
            quote.containerOneTime === null
              ? copy.contactPricing
              : formatUsd(quote.containerOneTime)
          }
        />
        {selection.addonIds.map((id) => {
          const addon = ADDONS.find((item) => item.id === id);
          if (!addon) return null;
          const priced =
            quote.customSoftware || (addon.oneTime > 0 && quote.exclusiveContainer)
              ? copy.contactPricing
              : addon.monthly > 0
                ? `+${formatUsd(addon.monthly)}${copy.perMonth}`
                : `+${formatUsd(addon.oneTime)}`;
          return <Line key={id} label={copy.addons[id].name} value={priced} />;
        })}
      </ul>
      <div className="mt-5 border-t border-stroke pt-4">
        {quote.customSoftware ? (
          <p data-testid="custom-quote-note" className="font-heading text-xl font-bold text-ink">
            {copy.customQuote}
          </p>
        ) : null}
        <p className="font-heading text-2xl font-bold text-ink">
          {copy.monthlyLabel}:{" "}
          <span data-testid="monthly-total">{monthlyLabel}</span>
        </p>
        <p className="mt-2 font-heading text-2xl font-bold text-ink">
          {copy.oneTimeLabel}:{" "}
          <span data-testid="onetime-total">{oneTimeLabel}</span>
        </p>
      </div>
      <p className="mt-4 text-xs italic leading-relaxed text-muted">{copy.summaryNote}</p>
      <Link
        href={contactHref}
        data-testid="request-quote"
        data-quote={quoteMessage}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center bg-orange px-4 text-sm font-medium text-white hover:bg-orange/90"
      >
        {copy.requestQuote}
      </Link>
      <p className="sr-only">{quoteMessage}</p>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start justify-between gap-3">
      <span className="text-ink">{label}</span>
      <span className="shrink-0 font-mono text-[11px] text-muted">{value}</span>
    </li>
  );
}
