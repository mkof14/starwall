import type { Metadata } from "next";
import { ContainersBackLink } from "@/components/containers-back-link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.containersDeployment.title,
  description: pageMeta.containersDeployment.description,
};

const cases = [
  {
    name: "Maritime",
    body: "Continuous protection on board or ashore, integrated with existing navigation and security systems.",
  },
  {
    name: "Port & Harbor",
    body: "Large-area surveillance across water, air, and shore approaches.",
  },
  {
    name: "Critical Infrastructure",
    body: "Perimeter and airspace awareness for fixed-site facilities.",
  },
  {
    name: "Private Estates & Islands",
    body: "Remote, self-sufficient protection where continuous staffing isn't practical.",
  },
  {
    name: "Special Events",
    body: "Temporary deployment for high-profile gatherings, with rapid setup and teardown.",
  },
];

export default function ContainersDeploymentPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-14 md:px-6 lg:py-20">
        <ContainersBackLink />

        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            AGRON Containers
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-navyText sm:text-5xl">
            Deployment
          </h1>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((item) => (
            <article key={item.name} className="border border-gray-200 bg-white">
              <div
                className="flex aspect-[16/10] items-center justify-center bg-sand px-4 text-center"
                aria-hidden
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-grey">
                  Photo — {item.name}
                </p>
              </div>
              <div className="p-5">
                <h2 className="font-heading text-xl font-bold text-navyText">
                  {item.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-grey">{item.body}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
