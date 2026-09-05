import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
};

const faqs = [
  {
    q: "Does StarWall replace the captain?",
    a: "No. StarWall gives faster, clearer information and a recommended next step — the decision and the responsibility stay with the captain or security officer at all times.",
  },
  {
    q: "What happens if we lose connectivity?",
    a: "StarWall keeps working locally and buffers data until the connection returns. Losing one link doesn't shut down protection for the object.",
  },
  {
    q: "Who has access to our data?",
    a: "Access follows role — owner, captain, marina, Support Center each see only what's relevant to them. Object data isn't shared outside your account, identifiable, for any AI training.",
  },
  {
    q: "We've heard StarWall can integrate specialized detection equipment — is that legal?",
    a: "Some equipment categories (for example RF/counter-drone detection) require jurisdiction-specific export and licensing checks before deployment. StarWall's architecture supports this as an optional module; enabling it always goes through a separate legal review first.",
  },
  {
    q: "Do we need to replace our existing equipment?",
    a: "No. StarWall is built to connect to what's already installed — radar, cameras, navigation — through adapters, not to replace it.",
  },
];

export default function FaqPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            FAQ
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-navyText sm:text-5xl">
            Questions we expect first
          </h1>
        </header>

        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {faqs.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer list-none font-heading text-xl font-bold text-navyText marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  {item.q}
                  <span
                    aria-hidden
                    className="text-orange transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-grey">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
