import type { EquipmentId } from "@/lib/equipment";
import { equipmentName } from "@/lib/equipment";

type DegradedBannerProps = {
  faultId: EquipmentId;
  onRestore: () => void;
};

export function DegradedBanner({ faultId, onRestore }: DegradedBannerProps) {
  const name = equipmentName(faultId);
  return (
    <div
      data-testid="degraded-banner"
      className="flex flex-col gap-3 border border-attn/50 bg-attn/15 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <svg
          viewBox="0 0 24 24"
          className="mt-0.5 h-6 w-6 shrink-0 text-attn"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M12 2 4 6v6c0 5 3.4 9.4 8 10.5 1.2-.3 2.3-.8 3.3-1.5L7 13.2V7.6L12 5l5 2.6v4.3l2-1.6V6L12 2Zm7.2 10.2-6.5 6.5-2.9-2.9 1.4-1.4 1.5 1.5 5.1-5.1 1.4 1.4Z"
          />
        </svg>
        <p className="font-ui text-sm text-bridge-text">
          <span className="font-bold tracking-wide text-attn">
            DEGRADED MODE
          </span>
          {" — "}
          operating without {name}. Other systems continue normally.
        </p>
      </div>
      <button
        type="button"
        data-testid="restore-fault"
        onClick={onRestore}
        className="shrink-0 border border-attn px-3 py-1.5 font-ui text-xs font-medium text-attn hover:bg-attn/20"
      >
        Restore {name}
      </button>
    </div>
  );
}
