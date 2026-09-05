import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { site } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-sand/10 bg-navy">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Wordmark />
          <p className="max-w-md text-xs leading-relaxed text-sand/55">
            © {new Date().getFullYear()} {site.company}. Confidentiality
            notice: any interface shown on this site is a demonstration with
            illustrative data, not a live vessel.
          </p>
        </div>
        <p className="text-sm text-sand/70">
          <Link
            href={site.companyUrl}
            className="underline-offset-4 hover:text-sand hover:underline"
          >
            agron1.com
          </Link>
        </p>
      </div>
    </footer>
  );
}
