export const INTEGRATION_CATALOG = [
  { id: "radar", name: "Radar", vendor: "Vendor-agnostic adapter" },
  { id: "ais", name: "AIS", vendor: "NMEA / standard feed" },
  { id: "cameras", name: "Camera systems", vendor: "ONVIF / RTSP adapters" },
  { id: "satcom", name: "Satcom provider", vendor: "Primary + backup path" },
] as const;

export type IntegrationLiveStatus = "connected" | "stale" | "disconnected";

const TWO_MINUTES_MS = 2 * 60 * 1000;

export function integrationStatus(lastPingAt: Date | string | null | undefined): IntegrationLiveStatus {
  if (!lastPingAt) return "disconnected";
  const at = typeof lastPingAt === "string" ? new Date(lastPingAt).getTime() : lastPingAt.getTime();
  if (Number.isNaN(at)) return "disconnected";
  if (Date.now() - at <= TWO_MINUTES_MS) return "connected";
  return "stale";
}
