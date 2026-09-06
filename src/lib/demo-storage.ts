import {
  clearDemoLocalData,
  listBlackBox,
  listEvents,
  listSessionReports,
} from "@/lib/local-db";

export const DEMO_LOCAL_STORES = [
  "events",
  "conversations",
  "sessionReports",
  "blackbox",
] as const;

export const DEMO_CLEARED_EVENT = "starwall-demo-cleared";

export async function wipeDemoLocalData() {
  await clearDemoLocalData();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(DEMO_CLEARED_EVENT));
  }
}

export async function demoLocalIsEmpty() {
  const [events, reports, box] = await Promise.all([
    listEvents(),
    listSessionReports(),
    listBlackBox(),
  ]);
  return events.length === 0 && reports.length === 0 && box.length === 0;
}
