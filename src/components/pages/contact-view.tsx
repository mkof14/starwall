"use client";

import { ContactForm } from "@/components/contact-form";
import { PageBody, PageHero, PageShell } from "@/components/page-chrome";
import { usePreferences } from "@/lib/i18n/context";
import {
  calculateQuote,
  formatUsd,
  quoteFromSearch,
  type PricingSelection,
} from "@/lib/pricing";

const PRICING_PLANS = new Set(["LIGHT", "ADVANCED", "INTELLIGENCE"]);

function quoteMessage(selection: PricingSelection, copy: ReturnType<typeof usePreferences>["t"]["pricing"]) {
  const quote = calculateQuote(selection);
  const monthly =
    quote.monthly === null ? copy.config.contactPricing : `${formatUsd(quote.monthly)}${copy.config.perMonth}`;
  const oneTime = quote.oneTime === null ? copy.config.contactPricing : formatUsd(quote.oneTime);
  const estimate =
    quote.customSoftware && quote.oneTime === null
      ? copy.config.customQuote
      : `${monthly}, ${oneTime} ${copy.config.oneTimeShort}`;
  const addons = selection.addonIds.map((id) => `+ ${copy.config.addons[id].name}`).join(", ");
  const summary = [
    copy.config.objects[selection.objectId].name,
    copy.config.software[selection.softwareId].name,
    copy.config.containers[selection.containerId].name,
    addons,
  ]
    .filter(Boolean)
    .join(", ");
  return copy.config.quoteMessage.replace("{summary}", summary).replace("{estimate}", estimate);
}

export function ContactView({
  plan,
  object,
  software,
  container,
  addons,
}: {
  plan?: string;
  object?: string;
  software?: string;
  container?: string;
  addons?: string;
}) {
  const { t } = usePreferences();
  const fromConfig = quoteFromSearch({ object, software, container, addons });
  const tier = plan?.toUpperCase() ?? "";
  const initialMessage = fromConfig
    ? quoteMessage(fromConfig, t.pricing)
    : PRICING_PLANS.has(tier)
      ? t.pricing.interestMessage.replace("{tier}", tier)
      : "";

  return (
    <PageShell>
      <PageHero kicker={t.contact.kicker} title={t.contact.title} lead={t.contact.lead} />
      <PageBody>
        <div className="max-w-3xl">
          <ContactForm initialMessage={initialMessage} />
        </div>
      </PageBody>
    </PageShell>
  );
}
