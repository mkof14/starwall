import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16 sm:px-6">
      <PageIntro
        eyebrow="Contact"
        title="Request a briefing"
        lede="For owners, captains, brokers, and teams evaluating a pilot. The form is wired locally; an email provider has not been chosen yet."
      />
      <ContactForm />
    </div>
  );
}
