import { cn } from "@/lib/cn";
import { useHud } from "@/lib/i18n/use-hud";
import type { ScenarioOption } from "@/lib/scenarios";

type RankedActionListProps = {
  options: ScenarioOption[];
};

export function RankedActionList({ options }: RankedActionListProps) {
  const { hud } = useHud();
  const ranked = [...options].sort(
    (a, b) => Number(b.recommended) - Number(a.recommended),
  );

  return (
    <ol className="mt-3 space-y-2" data-testid="ranked-action-list">
      {ranked.map((option, index) => {
        const top = option.recommended;
        return (
          <li
            key={option.label}
            data-testid={top ? "recommended-option" : `alternative-option-${index}`}
            className={cn(
              top
                ? "border-l-4 border-orange bg-orange/10 px-3 py-3"
                : "border-l-4 border-bridge-line bg-bridge-bg px-3 py-2",
            )}
          >
            {top ? (
              <p className="mb-1 font-mono text-[10px] font-semibold tracking-[0.2em] text-orange">
                {hud.chrome.recommended}
              </p>
            ) : null}
            <p
              className={cn(
                "text-bridge-text",
                top ? "text-base font-bold" : "text-sm font-semibold text-bridge-dim",
              )}
            >
              {option.label}
            </p>
            <p
              className={cn(
                "mt-1 leading-relaxed text-bridge-dim",
                top ? "text-sm" : "text-xs",
              )}
            >
              {option.detail}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
