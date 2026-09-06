import { describe, expect, it } from "vitest";
import { DEMO_LOCAL_STORES } from "@/lib/demo-storage";

describe("LIVE local wipe contract", () => {
  it("names every IndexedDB store that holds illustrative DEMO records", () => {
    expect(DEMO_LOCAL_STORES).toEqual([
      "events",
      "conversations",
      "sessionReports",
      "blackbox",
    ]);
  });
});
