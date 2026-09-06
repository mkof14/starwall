"use client";

import { usePreferences } from "@/lib/i18n/context";

export function PrivacyView({
  framed = false,
  focus = "privacy",
}: {
  framed?: boolean;
  focus?: "privacy" | "terms";
}) {
  const { t } = usePreferences();
  const legal = t.legal;
  const termsFirst = focus === "terms";

  const privacySections = (
    <>
      <section className="mt-10 space-y-3">
        <h2 className="font-ui text-xl font-semibold">{legal.storesTitle}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">{legal.storesBody}</p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="font-ui text-xl font-semibold">{legal.whereTitle}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">{legal.whereBody}</p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="font-ui text-xl font-semibold">{legal.whoTitle}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">{legal.whoBody}</p>
      </section>
      <p className="mt-10 max-w-3xl border border-stroke bg-panel px-4 py-3 text-sm leading-relaxed text-ink">
        {legal.gdpr}
      </p>
    </>
  );

  const inner = (
    <>
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
        {termsFirst ? t.chrome.terms : t.chrome.privacy}
      </p>
      <h1 className="mt-3 font-heading text-4xl font-bold text-ink">
        {termsFirst ? legal.termsTitle : legal.privacyTitle}
      </h1>
      {termsFirst ? (
        <>
          <section id="terms" className="mt-10 space-y-3">
            <p className="max-w-3xl text-sm leading-relaxed text-muted">{legal.termsBody}</p>
          </section>
          <h2 className="mt-14 font-heading text-3xl font-bold">{legal.privacyTitle}</h2>
          {privacySections}
        </>
      ) : (
        <>
          {privacySections}
          <section id="terms" className="mt-14 space-y-3">
            <h2 className="font-heading text-3xl font-bold">{legal.termsTitle}</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted">{legal.termsBody}</p>
          </section>
        </>
      )}
    </>
  );

  if (framed) {
    return <div className="text-bridge-text">{inner}</div>;
  }

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 lg:py-20">{inner}</div>
    </div>
  );
}
