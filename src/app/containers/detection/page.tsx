import type { Metadata } from "next";
import Link from "next/link";
import { ContainersBackLink } from "@/components/containers-back-link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containersDetection.title,
  description: pageMeta.containersDetection.description,
};

const rows = [
  {
    name: "3D AESA Radar",
    spec: "360° air & surface detection up to 15 km",
  },
  {
    name: "Acoustic Radar",
    spec: "Detects low, slow, small targets and surface disturbances",
  },
  {
    name: "Spectral Analyzer",
    spec: "RF & signal intelligence, wide spectrum monitoring",
  },
  {
    name: "Multi-Spectrum Cameras",
    spec: "Day, night, thermal, SWIR up to 10 km",
  },
  {
    name: "Acoustic Sonar",
    spec: "Underwater threat detection up to 1 km",
  },
];

export default function ContainersDetectionPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-14 md:px-6 lg:py-20">
        <ContainersBackLink />

        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            AGRON Containers
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-navyText sm:text-5xl">
            Detection Suite
          </h1>
        </header>

        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-navy text-sand">
              <tr>
                <th className="px-4 py-3 font-heading text-base font-bold">
                  Equipment
                </th>
                <th className="px-4 py-3 font-heading text-base font-bold">
                  Spec
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-t border-gray-200 align-top">
                  <th className="px-4 py-3 font-bold text-navyText">{row.name}</th>
                  <td className="px-4 py-3 text-grey">{row.spec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-grey">
          All detection and analysis on this suite runs on StarWall —{" "}
          <Link href="/how-it-works" className="text-orange hover:underline">
            see how it works →
          </Link>
        </p>
      </div>
    </div>
  );
}
