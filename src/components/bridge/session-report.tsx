"use client";

import { cn } from "@/lib/cn";
import { fill } from "@/lib/i18n/hud";
import { localizeScenario } from "@/lib/i18n/hud-scenarios";
import { useHud } from "@/lib/i18n/use-hud";
import { SCENARIOS, type RiskLevel, type SessionEvent } from "@/lib/scenarios";

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
  const { locale, hud } = useHud();
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
          {hud.report.print}
        </button>
        <button
          type="button"
          data-testid="back-to-console"
          onClick={onBack}
          className="border border-navyText/30 px-3 py-1.5 font-ui text-sm text-navyText hover:border-orange hover:text-orange"
        >
          {hud.report.back}
        </button>
      </div>

      <article className="session-report-page mx-auto max-w-4xl bg-white px-6 py-10 shadow-sm md:px-12 md:py-14">
        <header className="border-b border-[#d5d0c8] pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange">
            {hud.report.kicker}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-navyText sm:text-4xl">
            {hud.report.title}
          </h1>
          <p className="mt-3 text-sm text-[#6B7280]">
            {hud.report.vessel} <span className="font-medium text-navyText">M/Y AURELIA</span>
            <span className="mx-2 text-[#d5d0c8]">·</span>
            {formatGeneratedAt(generatedAt)}
          </p>
        </header>

        {events.length === 0 ? (
          <p className="mt-8 text-base text-[#6B7280]">
            {hud.report.empty}
          </p>
        ) : (
          <>
            <p className="mt-6 text-base text-navyText">
              {fill(hud.report.summary, {
                count: String(events.length),
                normal: String(counts.NORMAL),
                attention: String(counts.ATTENTION),
                elevated: String(counts.ELEVATED),
                critical: String(counts.CRITICAL),
              })}
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-left font-ui text-sm">
                <thead>
                  <tr className="border-b border-[#d5d0c8] text-xs uppercase tracking-wider text-[#6B7280]">
                    <th className="py-2 pr-3 font-medium">{hud.report.time}</th>
                    <th className="py-2 pr-3 font-medium">{hud.report.scenario}</th>
                    <th className="py-2 pr-3 font-medium">{hud.report.category}</th>
                    <th className="py-2 pr-3 font-medium">{hud.report.risk}</th>
                    <th className="py-2 font-medium">{hud.report.recommendation}</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => {
                    const catalog = event.scenarioId
                      ? SCENARIOS.find((item) => item.id === event.scenarioId)
                      : undefined;
                    const view = catalog
                      ? localizeScenario(locale, catalog)
                      : undefined;
                    return (
                    <tr key={`${event.timestamp}-${event.name}-${index}`} className="border-b border-[#ece8e1] align-top">
                      <td className="whitespace-nowrap py-3 pr-3 font-mono text-xs text-[#6B7280]">
                        {event.timestamp}
                      </td>
                      <td className="py-3 pr-3 font-medium text-navyText">{view?.name ?? event.name}</td>
                      <td className="py-3 pr-3 text-[#6B7280]">{view?.category ?? event.category}</td>
                      <td
                        className={cn(
                          "whitespace-nowrap py-3 pr-3 font-mono text-xs font-semibold",
                          riskTextClass(event.riskLevel),
                        )}
                      >
                        {event.riskLevel}
                      </td>
                      <td className="py-3 text-navyText">{view?.actionText ?? event.actionText}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="mt-10 border-t border-[#d5d0c8] pt-6 text-xs leading-relaxed text-[#6B7280]">
          {hud.report.footer}
        </p>
      </article>
    </div>
  );
}
