import type { Metadata } from "next";
import { ContactView } from "@/components/pages/contact-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.contact.title,
  description: pageMeta.contact.description,
};

export default function ContactPage() {
  return <ContactView />;
}
