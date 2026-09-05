import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.contact.title,
  description: pageMeta.contact.description,
};

export default function ContactPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-14 md:px-6 lg:py-20">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            Contact
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-navyText sm:text-5xl">
            Request a briefing
          </h1>
          <p className="mt-4 text-base leading-relaxed text-grey">
            For owners, captains, brokers, and teams evaluating a pilot. An
            outbound email service is not connected yet — submissions are
            received locally until AGRON confirms the channel.
          </p>
        </header>
        <ContactForm />
      </div>
    </div>
  );
}
