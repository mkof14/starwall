import { useHud } from "@/lib/i18n/use-hud";

type CrisisBannerProps = {
  scenarioName: string;
  onExit: () => void;
};

export function CrisisBanner({ scenarioName, onExit }: CrisisBannerProps) {
  const { hud } = useHud();
  return (
    <div
      data-testid="crisis-banner"
      className="flex flex-col gap-3 bg-crit px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          data-testid="crisis-pulse"
          className="crisis-pulse-dot h-3 w-3 shrink-0 rounded-full bg-white"
          aria-hidden
        />
        <h2 className="font-ui text-2xl font-bold tracking-wide md:text-3xl">
          {hud.chrome.crisisMode} — {scenarioName.toUpperCase()}
        </h2>
      </div>
      <button
        type="button"
        data-testid="crisis-exit"
        onClick={onExit}
        className="shrink-0 border-2 border-white bg-white px-4 py-2 font-ui text-xs font-bold tracking-wide text-crit hover:bg-sand"
      >
        {hud.chrome.exitCrisis}
      </button>
    </div>
  );
}
