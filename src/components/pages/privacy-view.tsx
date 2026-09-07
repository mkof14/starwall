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

  const privacyBlock = (
    <>
      <p className="mt-6 max-w-3xl text-xs uppercase tracking-[0.14em] text-muted">
        {legal.privacyUpdated}
      </p>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{legal.privacyIntro}</p>
      {legal.privacySections.map((section) => (
        <section key={section.title} className="mt-10 space-y-3">
          <h2 className="font-ui text-xl font-semibold">{section.title}</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted">{section.body}</p>
        </section>
      ))}
    </>
  );

  const termsBlock = (
    <>
      <p className="mt-6 max-w-3xl text-xs uppercase tracking-[0.14em] text-muted">
        {legal.termsUpdated}
      </p>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{legal.termsIntro}</p>
      {legal.termsSections.map((section) => (
        <section key={section.title} className="mt-10 space-y-3">
          <h2 className="font-ui text-xl font-semibold">{section.title}</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted">{section.body}</p>
        </section>
      ))}
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
          <div id="terms">{termsBlock}</div>
          <h2 className="mt-16 font-heading text-3xl font-bold">{legal.privacyTitle}</h2>
          {privacyBlock}
        </>
      ) : (
        <>
          {privacyBlock}
          <section id="terms" className="mt-16">
            <h2 className="font-heading text-3xl font-bold">{legal.termsTitle}</h2>
            {termsBlock}
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
