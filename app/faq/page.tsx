import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "FAQ",
};

const faqs = [
  {
    q: "What is StarWall?",
    a: "An intelligence, integration, and decision-support system for yacht, marina, port, and private-island security. It is a product of AGRON.",
  },
  {
    q: "Who is it for?",
    a: "Yacht owners and family offices, captains and security officers, marine insurance brokers, and organizations evaluating a pilot.",
  },
  {
    q: "Is the Bridge on this site a live vessel?",
    a: "No. The interface is a demonstration with illustrative data, not a live vessel.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-16 sm:px-6">
      <PageIntro
        eyebrow="FAQ"
        title="Questions we expect first"
        lede="A fuller set will be pulled from the drafted FAQ copy. These three are the facts already in the site specification."
      />

      <dl className="space-y-8">
        {faqs.map((item) => (
          <div key={item.q} className="border-t border-sand/15 pt-6">
            <dt className="font-serif text-2xl text-sand">{item.q}</dt>
            <dd className="mt-3 text-sm leading-relaxed text-sand/70">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
