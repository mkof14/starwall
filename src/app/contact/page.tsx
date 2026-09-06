import type { Metadata } from "next";
import { ContactView } from "@/components/pages/contact-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageMeta.contact.title,
  description: pageMeta.contact.description,
};

export default function ContactPage({
  searchParams,
}: {
  searchParams: {
    plan?: string;
    object?: string;
    software?: string;
    container?: string;
    addons?: string;
  };
}) {
  return (
    <ContactView
      plan={searchParams.plan}
      object={searchParams.object}
      software={searchParams.software}
      container={searchParams.container}
      addons={searchParams.addons}
    />
  );
}
