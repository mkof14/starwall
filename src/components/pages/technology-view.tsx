"use client";

import Link from "next/link";
import { usePreferences } from "@/lib/i18n/context";

export function TechnologyView() {
  const { t } = usePreferences();

  return (
    <div className="bg-page text-ink">
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 md:px-6 lg:py-20">
        <header className="max-w-3xl space-y-4">
          <p className="text-[13px] text-orange">{t.tech.kicker}</p>
          <h1 className="font-heading text-4xl font-bold text-ink sm:text-5xl">
            {t.tech.title}
          </h1>
          <p className="text-base leading-relaxed text-muted">{t.tech.lead}</p>
        </header>

        <section aria-labelledby="catalog-heading">
          <h2
            id="catalog-heading"
            className="font-heading text-3xl font-bold text-ink"
          >
            {t.tech.catalog}
          </h2>
          <div className="mt-5 overflow-x-auto border border-stroke">
            <table className="w-full min-w-[36rem] text-start text-sm">
              <thead className="bg-navy text-sand">
                <tr>
                  <th className="px-4 py-3 font-heading text-base font-bold">
                    {t.tech.category}
                  </th>
                  <th className="px-4 py-3 font-heading text-base font-bold">
                    {t.tech.connects}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.tech.rows.map((row) => (
                  <tr key={row.name} className="border-t border-stroke align-top">
                    <th className="px-4 py-3 font-bold text-ink">{row.name}</th>
                    <td className="px-4 py-3 text-muted">{row.connects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="border-s-4 border-orange bg-callout px-4 py-4 text-sm leading-relaxed text-ink">
          {t.tech.legal}{" "}
          <Link href="/contact" className="font-medium text-orange underline">
            {t.tech.contactUs}
          </Link>
          .
        </aside>

        <section aria-labelledby="oem-heading" className="space-y-5">
          <h2 id="oem-heading" className="font-heading text-3xl font-bold text-ink">
            {t.tech.oem}
          </h2>
          <ol className="space-y-3">
            {t.tech.partners.map((step, index) => {
              const width = ["w-full max-w-md", "w-full max-w-lg", "w-full max-w-xl", "w-full"][
                index
              ];
              const tone = [
                "bg-page border-stroke",
                "bg-panel border-stroke",
                "bg-ink/5 border-ink/20",
                "bg-navy border-navy text-sand",
              ][index];
              return (
                <li key={step.name} className={`${width} border p-5 ${tone}`}>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-orange">
                    0{index + 1}
                  </p>
                  <h3
                    className={`mt-1 font-heading text-xl font-bold ${index === 3 ? "text-sand" : "text-ink"}`}
                  >
                    {step.name}
                  </h3>
                  <p className={`mt-2 text-sm ${index === 3 ? "text-sand/75" : "text-muted"}`}>
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
