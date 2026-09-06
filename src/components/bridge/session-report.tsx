"use client";

import { cn } from "@/lib/cn";
import type { RiskLevel, SessionEvent } from "@/lib/scenarios";

type SessionReportProps = {
  events: SessionEvent[];
  generatedAt: Date;
  onBack: () => void;
};

function riskTextClass(level: RiskLevel) {
  if (level === "ATTENTION") return "text-attn";
  if (level === "ELEVATED") return "text-orange";
  if (level === "CRITICAL") return "text-crit";
  return "text-ok";
}

function formatGeneratedAt(date: Date) {
  const iso = date.toISOString();
  return `${iso.slice(0, 10)} · ${iso.slice(11, 16)} UTC`;
}

export function SessionReport({ events, generatedAt, onBack }: SessionReportProps) {
  const counts = {
    NORMAL: events.filter((item) => item.riskLevel === "NORMAL").length,
    ATTENTION: events.filter((item) => item.riskLevel === "ATTENTION").length,
    ELEVATED: events.filter((item) => item.riskLevel === "ELEVATED").length,
    CRITICAL: events.filter((item) => item.riskLevel === "CRITICAL").length,
  };

  return (
    <div
      id="session-report"
      data-testid="session-report"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#f7f5f0] text-navyText"
    >
      <div className="session-report-chrome mx-auto flex max-w-4xl flex-wrap items-center justify-end gap-2 px-4 py-4 md:px-6">
        <button
          type="button"
          data-testid="print-report"
          onClick={() => window.print()}
          className="bg-orange px-3 py-1.5 font-ui text-sm font-medium text-white hover:bg-orange/90"
        >
          Print / Save as PDF
        </button>
        <button
          type="button"
          data-testid="back-to-console"
          onClick={onBack}
          className="border border-navyText/30 px-3 py-1.5 font-ui text-sm text-navyText hover:border-orange hover:text-orange"
        >
          Back to console
        </button>
      </div>

      <article className="session-report-page mx-auto max-w-4xl bg-white px-6 py-10 shadow-sm md:px-12 md:py-14">
        <header className="border-b border-[#d5d0c8] pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange">
            AGRON Maritime
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-navyText sm:text-4xl">
            StarWall Session Report
          </h1>
          <p className="mt-3 text-sm text-[#6B7280]">
            Vessel <span className="font-medium text-navyText">M/Y AURELIA</span>
            <span className="mx-2 text-[#d5d0c8]">·</span>
            {formatGeneratedAt(generatedAt)}
          </p>
        </header>

        {events.length === 0 ? (
          <p className="mt-8 text-base text-[#6B7280]">
            No events yet this session — try a scenario from the dropdown, then
            generate a report.
          </p>
        ) : (
          <>
            <p className="mt-6 text-base text-navyText">
              {events.length} event{events.length === 1 ? "" : "s"} reviewed during this
              session — {counts.NORMAL} Normal, {counts.ATTENTION} Attention,{" "}
              {counts.ELEVATED} Elevated, {counts.CRITICAL} Critical
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-left font-ui text-sm">
                <thead>
                  <tr className="border-b border-[#d5d0c8] text-xs uppercase tracking-wider text-[#6B7280]">
                    <th className="py-2 pr-3 font-medium">Time</th>
                    <th className="py-2 pr-3 font-medium">Scenario</th>
                    <th className="py-2 pr-3 font-medium">Category</th>
                    <th className="py-2 pr-3 font-medium">Risk</th>
                    <th className="py-2 font-medium">Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={`${event.timestamp}-${event.name}-${index}`} className="border-b border-[#ece8e1] align-top">
                      <td className="whitespace-nowrap py-3 pr-3 font-mono text-xs text-[#6B7280]">
                        {event.timestamp}
                      </td>
                      <td className="py-3 pr-3 font-medium text-navyText">{event.name}</td>
                      <td className="py-3 pr-3 text-[#6B7280]">{event.category}</td>
                      <td
                        className={cn(
                          "whitespace-nowrap py-3 pr-3 font-mono text-xs font-semibold",
                          riskTextClass(event.riskLevel),
                        )}
                      >
                        {event.riskLevel}
                      </td>
                      <td className="py-3 text-navyText">{event.actionText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="mt-10 border-t border-[#d5d0c8] pt-6 text-xs leading-relaxed text-[#6B7280]">
          Report generated by StarWall by AGRON — illustrative session data, not a live
          vessel.
        </p>
      </article>
    </div>
  );
}
