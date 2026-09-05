import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containersSpecs.title,
  description: pageMeta.containersSpecs.description,
};

const rows = [
  { label: "Length", value: "6.058 m (19.9 ft)" },
  { label: "Width", value: "2.438 m (8.0 ft)" },
  { label: "Height", value: "2.896 m (9.5 ft)" },
  { label: "Weight", value: "~9,500 kg" },
  { label: "Power", value: "10–15 kW" },
  { label: "Operating temperature", value: "−30°C to +50°C" },
  { label: "Autonomy", value: "72+ hours (mission-dependent)" },
];

export default function ContainersSpecsPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            AGRON Containers
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-navyText sm:text-5xl">
            Container Specifications
          </h1>
        </header>

        <dl className="border border-gray-200">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 border-t border-gray-200 first:border-t-0 sm:grid-cols-2"
            >
              <dt className="px-4 py-3 text-sm font-bold text-navyText">
                {row.label}
              </dt>
              <dd className="px-4 py-3 text-sm text-grey sm:text-right">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="border-l-4 border-orange bg-orange/10 px-4 py-4 font-heading text-xl font-bold text-navyText">
          Rapid deployment: under 2 hours from arrival to operational.
        </p>
      </div>
    </div>
  );
}
