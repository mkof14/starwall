"use client";

import { ContactForm } from "@/components/contact-form";
import { usePreferences } from "@/lib/i18n/context";

export function ContactView() {
  const { t } = usePreferences();

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
        <ContactForm />
      </div>
    </div>
  );
}
