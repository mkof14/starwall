"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { PageBody, PageHero, PageShell, RuleList, RuleRow } from "@/components/page-chrome";
import { cn } from "@/lib/cn";
import { usePreferences } from "@/lib/i18n/context";
import {
  ADDONS,
  CONTAINER_TIERS,
  DEFAULT_SELECTION,
  OBJECT_TYPES,
  SOFTWARE_TIERS,
  selectionToQuery,
  type AddonId,
  type ContainerId,
  type ObjectId,
  type PricingSelection,
  type SoftwareId,
} from "@/lib/pricing";

const PLAN_TONE: Record<
  SoftwareId,
  { rail: string; chip: string; wash: string }
> = {
  LIGHT: {
    rail: "border-ok",
    chip: "bg-ok text-[#0F1922]",
    wash: "bg-ok/10",
  },
  ADVANCED: {
    rail: "border-orange",
    chip: "bg-orange text-white",
    wash: "bg-orange/10",
  },
  INTELLIGENCE: {
    rail: "border-navy",
    chip: "bg-navy text-sand",
    wash: "bg-navy/10",
  },
  CUSTOM: {
    rail: "border-attn",
    chip: "bg-attn text-[#0F1922]",
    wash: "bg-attn/15",
  },
};

const OBJECT_TONE = [
  "border-ok",
  "border-orange",
  "border-navy",
  "border-attn",
  "border-ok",
] as const;

const CONTAINER_TONE = [
  "border-stroke",
  "border-ok",
  "border-orange",
  "border-navy",
  "border-attn",
] as const;

export function PricingView() {
  const { t } = usePreferences();
  const { pricing } = t;
  const copy = pricing.config;
  const [selection, setSelection] = useState<PricingSelection>(DEFAULT_SELECTION);
  const [summaryOpen, setSummaryOpen] = useState(false);

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

  const addonSummary = selection.addonIds
    .map((id) => `+ ${copy.addons[id].name}`)
    .join(", ");
  const summaryParts = [
    objectCopy.name,
    softwareCopy.name,
    containerCopy.name,
    addonSummary,
  ].filter(Boolean);
  const quoteMessage = copy.quoteMessage.replace("{summary}", summaryParts.join(", "));
  const contactHref = `/contact?${selectionToQuery(selection)}`;

  return (
    <PageShell>
      <PageHero kicker={pricing.kicker} title={pricing.title} lead={pricing.lead}>
        <p className="max-w-xl border-s-2 border-orange ps-4 text-sm leading-relaxed text-ink sm:text-[15px]">
          {pricing.salesNote}
        </p>
      </PageHero>
      <PageBody>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.85fr)]">
          <div className="space-y-12 pb-28 lg:pb-0">
            <Step heading={copy.stepSoftware} index={1}>
              <div className="grid gap-5 sm:grid-cols-2">
                {SOFTWARE_TIERS.map((item, index) => {
                  const selected = selection.softwareId === item.id;
                  const label = copy.software[item.id];
                  const tone = PLAN_TONE[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-testid={`software-${item.id}`}
                      aria-pressed={selected}
                      onClick={() =>
                        setSelection((current) => ({
                          ...current,
                          softwareId: item.id as SoftwareId,
                        }))
                      }
                      className={cn(
                        "relative h-full border-s-4 px-4 py-5 text-start transition-colors",
                        tone.rail,
                        selected ? tone.wash : "bg-page hover:bg-panel",
                      )}
                    >
                      <p className="font-mono text-[11px] text-orange">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <span
                        className={cn(
                          "mt-2 inline-flex px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
                          tone.chip,
                        )}
                      >
                        {label.name}
                      </span>
                      {"popular" in item && item.popular ? (
                        <span className="ms-2 font-mono text-[10px] text-orange">
                          {pricing.mostPopular}
                        </span>
                      ) : null}
                      <h3 className="mt-3 font-heading text-3xl font-bold text-ink">
                        {label.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{label.detail}</p>
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step heading={copy.stepObject} index={2}>
              <div className="grid gap-4 sm:grid-cols-2">
                {OBJECT_TYPES.map((item, index) => {
                  const selected = selection.objectId === item.id;
                  const label = copy.objects[item.id];
                  return (
                    <SelectBlock
                      key={item.id}
                      testId={`object-${item.id}`}
                      selected={selected}
                      rail={OBJECT_TONE[index]}
                      title={label.name}
                      detail={label.detail}
                      onClick={() =>
                        setSelection((current) => ({ ...current, objectId: item.id as ObjectId }))
                      }
                    />
                  );
                })}
              </div>
            </Step>

            <Step heading={copy.stepContainer} index={3}>
              <div className="grid gap-4">
                {CONTAINER_TIERS.map((item, index) => {
                  const selected = selection.containerId === item.id;
                  const label = copy.containers[item.id];
                  return (
                    <SelectBlock
                      key={item.id}
                      testId={`container-${item.id}`}
                      selected={selected}
                      rail={CONTAINER_TONE[index]}
                      title={label.name}
                      detail={label.detail}
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
              <ul className="grid gap-3 sm:grid-cols-2">
                {ADDONS.map((item) => {
                  const checked = selection.addonIds.includes(item.id);
                  const label = copy.addons[item.id];
                  return (
                    <li key={item.id}>
                      <label
                        data-testid={`addon-${item.id}`}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 border-s-4 py-3 ps-3",
                          checked ? "border-orange bg-orange/10" : "border-stroke hover:border-navy",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 accent-orange"
                          checked={checked}
                          onChange={() => toggleAddon(item.id)}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-heading text-xl font-bold text-ink">
                            {label.name}
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
            <BriefPanel
              copy={copy}
              pricing={pricing}
              selection={selection}
              contactHref={contactHref}
              quoteMessage={quoteMessage}
            />
          </aside>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stroke bg-header/95 p-3 shadow-[0_-8px_24px_rgb(15_25_34/0.12)] backdrop-blur lg:hidden">
          <button
            type="button"
            data-testid="mobile-summary-toggle"
            aria-expanded={summaryOpen}
            onClick={() => setSummaryOpen((value) => !value)}
            className="flex w-full items-center justify-between gap-3 text-start"
          >
            <span>
              <span className="block font-heading text-lg font-bold text-ink">
                {softwareCopy.name}
              </span>
              <span className="block text-sm text-muted">{objectCopy.name}</span>
            </span>
            <span className="font-mono text-[10px] text-orange">
              {summaryOpen ? copy.hideSummary : copy.showSummary}
            </span>
          </button>
          {summaryOpen ? (
            <div className="mt-3 max-h-[55vh] overflow-y-auto border-s-4 border-orange bg-page p-3">
              <BriefPanel
                copy={copy}
                pricing={pricing}
                selection={selection}
                contactHref={contactHref}
                quoteMessage={quoteMessage}
                compact
              />
            </div>
          ) : null}
        </div>

        <section aria-labelledby="pricing-faq">
          <h2 id="pricing-faq" className="font-heading text-3xl font-bold text-ink">
            {pricing.faqTitle}
          </h2>
          <RuleList>
            <RuleRow
              title={pricing.faq1q}
              body={
                <>
                  {pricing.faq1aBefore}{" "}
                  <Link
                    href="/containers"
                    className="font-medium text-orange underline-offset-2 hover:underline"
                  >
                    {pricing.faq1aLink}
                  </Link>
                  {pricing.faq1aAfter}
                </>
              }
            />
            <RuleRow title={pricing.faq2q} body={pricing.faq2a} />
            <RuleRow title={pricing.faq3q} body={pricing.faq3a} />
          </RuleList>
        </section>
      </PageBody>
    </PageShell>
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
      <p className="font-mono text-[11px] text-orange">
        {String(index).padStart(2, "0")}
      </p>
      <h2 className="mt-1 font-heading text-3xl font-bold text-ink">{heading}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SelectBlock({
  title,
  detail,
  selected,
  onClick,
  testId,
  rail,
}: {
  title: string;
  detail: string;
  selected: boolean;
  onClick: () => void;
  testId: string;
  rail: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-full border-s-4 px-4 py-4 text-start transition-colors",
        rail,
        selected ? "bg-orange/10" : "bg-page hover:bg-panel",
      )}
    >
      <span className="block font-heading text-2xl font-bold text-ink">{title}</span>
      <span className="mt-2 block text-sm leading-relaxed text-muted">{detail}</span>
    </button>
  );
}

function BriefPanel({
  copy,
  pricing,
  selection,
  contactHref,
  quoteMessage,
  compact = false,
}: {
  copy: ReturnType<typeof usePreferences>["t"]["pricing"]["config"];
  pricing: ReturnType<typeof usePreferences>["t"]["pricing"];
  selection: PricingSelection;
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
      className={cn(compact ? "" : "sticky top-24 border-s-4 border-orange bg-navy px-5 py-6 text-sand")}
    >
      <p className="font-mono text-[11px] text-orange">{copy.yourConfig}</p>
      <ul className="mt-4 space-y-3 text-sm">
        <li>
          <p className="font-heading text-2xl font-bold">{software.name}</p>
          <p className={compact ? "text-muted" : "text-sand/70"}>{software.detail}</p>
        </li>
        <li className={compact ? "text-ink" : "text-sand"}>{object.name}</li>
        <li className={compact ? "text-ink" : "text-sand"}>{container.name}</li>
        {selection.addonIds.map((id) => (
          <li key={id} className="text-orange">
            + {copy.addons[id].name}
          </li>
        ))}
      </ul>
      <p className={cn("mt-5 text-sm leading-relaxed", compact ? "text-muted" : "text-sand/75")}>
        {pricing.salesNote}
      </p>
      <p className={cn("mt-3 text-xs italic leading-relaxed", compact ? "text-muted" : "text-sand/55")}>
        {copy.summaryNote}
      </p>
      <Link
        href={contactHref}
        data-testid="request-quote"
        data-quote={quoteMessage}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center bg-orange px-4 text-sm font-medium text-white hover:bg-orange/90"
      >
        {pricing.askSales}
      </Link>
      <p className="sr-only">{quoteMessage}</p>
    </div>
  );
}
