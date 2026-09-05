import { cn } from "@/lib/cn";

type WordmarkProps = {
  /** Full form is reserved for a page's first / hero mention. */
  full?: boolean;
  tone?: "on-dark" | "on-light";
  className?: string;
};

export function Wordmark({
  full = false,
  tone = "on-dark",
  className,
}: WordmarkProps) {
  const star = tone === "on-dark" ? "text-sand" : "text-navy-text";
  const byline = tone === "on-dark" ? "text-sand/70" : "text-grey";

  return (
    <span
      className={cn(
        "font-serif tracking-tight",
        full ? "text-3xl sm:text-5xl" : "text-xl",
        className,
      )}
    >
      <span className={star}>Star</span>
      <span className="text-orange">Wall</span>
      {full ? <span className={byline}> by AGRON</span> : null}
    </span>
  );
}
