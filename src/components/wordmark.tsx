import { cn } from "@/lib/cn";

type WordmarkProps = {
  full?: boolean;
  tone?: "on-dark" | "on-light";
  className?: string;
};

export function Wordmark({
  full = false,
  tone = "on-dark",
  className,
}: WordmarkProps) {
  const star = tone === "on-dark" ? "text-sand" : "text-navyText";
  const byline = tone === "on-dark" ? "text-sand/70" : "text-grey";

  return (
    <span className={cn("font-heading tracking-tight", className)}>
      <span className={star}>Star</span>
      <span className="text-orange">Wall</span>
      {full ? <span className={byline}> by AGRON</span> : null}
    </span>
  );
}
