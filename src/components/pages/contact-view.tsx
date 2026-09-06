"use client";

import { ContactForm } from "@/components/contact-form";
import { usePreferences } from "@/lib/i18n/context";

const PRICING_PLANS = new Set(["LIGHT", "ADVANCED", "INTELLIGENCE"]);

export function ContactView({ plan }: { plan?: string }) {
  const { t } = usePreferences();
  const tier = plan?.toUpperCase() ?? "";
  const initialMessage = PRICING_PLANS.has(tier)
    ? t.pricing.interestMessage.replace("{tier}", tier)
    : "";

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            {t.contact.kicker}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
            {t.contact.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{t.contact.lead}</p>
        </header>
        <ContactForm initialMessage={initialMessage} />
      </div>
    </div>
  );
}
