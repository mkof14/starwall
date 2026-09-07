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
        <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">
          {pricing.salesNote}
        </p>
      </PageHero>
      <PageBody>
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.8fr)]">
          <div className="space-y-14 pb-28 lg:pb-0">
            <Step heading={copy.stepSoftware} index={1}>
              <div className="divide-y divide-stroke border-y border-stroke">
                {SOFTWARE_TIERS.map((item, index) => {
                  const selected = selection.softwareId === item.id;
                  const label = copy.software[item.id];
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
                      className="grid w-full gap-1 py-5 text-start sm:grid-cols-[4rem_11rem_minmax(0,1fr)] sm:gap-8"
                    >
                      <span className="font-mono text-[11px] text-orange">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-heading text-2xl font-bold",
                          selected ? "text-orange" : "text-ink",
                        )}
                      >
                        {label.name}
                        {"popular" in item && item.popular ? (
                          <span className="ms-2 align-middle font-ui text-[12px] font-normal text-muted">
                            {pricing.mostPopular}
                          </span>
                        ) : null}
                      </span>
                      <span className="text-sm leading-relaxed text-muted">{label.detail}</span>
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step heading={copy.stepObject} index={2}>
              <div className="divide-y divide-stroke border-y border-stroke">
                {OBJECT_TYPES.map((item) => {
                  const selected = selection.objectId === item.id;
                  const label = copy.objects[item.id];
                  return (
                    <ChoiceRow
                      key={item.id}
                      testId={`object-${item.id}`}
                      selected={selected}
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
              <div className="divide-y divide-stroke border-y border-stroke">
                {CONTAINER_TIERS.map((item) => {
                  const selected = selection.containerId === item.id;
                  const label = copy.containers[item.id];
                  return (
                    <ChoiceRow
                      key={item.id}
                      testId={`container-${item.id}`}
                      selected={selected}
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
              <ul className="divide-y divide-stroke border-y border-stroke">
                {ADDONS.map((item) => {
                  const checked = selection.addonIds.includes(item.id);
                  const label = copy.addons[item.id];
                  return (
                    <li key={item.id}>
                      <label
                        data-testid={`addon-${item.id}`}
                        className="flex cursor-pointer items-baseline gap-4 py-4"
                      >
                        <input
                          type="checkbox"
                          className="accent-orange"
                          checked={checked}
                          onChange={() => toggleAddon(item.id)}
                        />
                        <span
                          className={cn(
                            "font-heading text-xl font-bold",
                            checked ? "text-orange" : "text-ink",
                          )}
                        >
                          {label.name}
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

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stroke bg-header/95 p-3 backdrop-blur lg:hidden">
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
            <div className="mt-3 max-h-[55vh] overflow-y-auto border-t border-stroke pt-3">
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
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ChoiceRow({
  title,
  detail,
  selected,
  onClick,
  testId,
}: {
  title: string;
  detail: string;
  selected: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={selected}
      onClick={onClick}
      className="grid w-full gap-1 py-4 text-start sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8"
    >
      <span
        className={cn(
          "font-heading text-xl font-bold",
          selected ? "text-orange" : "text-ink",
        )}
      >
        {title}
      </span>
      <span className="text-sm leading-relaxed text-muted">{detail}</span>
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
    <div data-testid="pricing-summary" className={cn(compact ? "" : "sticky top-24")}>
      <p className="font-ui text-[12px] tracking-wide text-orange">{copy.yourConfig}</p>
      <p className="mt-2 font-heading text-3xl font-bold text-ink">{software.name}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{software.detail}</p>
      <ul className="mt-6 divide-y divide-stroke border-y border-stroke text-sm">
        <li className="py-3 text-ink">{object.name}</li>
        <li className="py-3 text-ink">{container.name}</li>
        {selection.addonIds.map((id) => (
          <li key={id} className="py-3 text-ink">
            {copy.addons[id].name}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-relaxed text-muted">{pricing.salesNote}</p>
      <p className="mt-3 text-xs italic leading-relaxed text-muted">{copy.summaryNote}</p>
      <Link
        href={contactHref}
        data-testid="request-quote"
        data-quote={quoteMessage}
        className="mt-6 inline-flex min-h-11 items-center justify-center bg-orange px-4 text-sm font-medium text-white hover:bg-orange/90"
      >
        {pricing.askSales}
      </Link>
      <p className="sr-only">{quoteMessage}</p>
    </div>
  );
}
