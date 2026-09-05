import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type HudPanelProps = {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function HudPanel({ title, extra, children, className }: HudPanelProps) {
  return (
    <section
      className={cn(
        "relative border border-bridge-line bg-bridge-panel p-4",
        className,
      )}
    >
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-orange" />
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-orange" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-orange" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-orange" />
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-ui text-sm font-semibold tracking-wide text-bridge-text">
          {title}
        </h2>
        {extra ? <div className="shrink-0">{extra}</div> : null}
      </header>
      {children}
    </section>
  );
}
