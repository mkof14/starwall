import { describe, expect, it } from "vitest";
import { denyUnlessSignedIn } from "@/lib/authz";
import {
  canTriggerScenarios,
  canUseHelm,
  canWriteSettings,
  hasMinRole,
} from "@/lib/rbac";

describe("RBAC writes", () => {
  it("rejects a Viewer changing notification settings", () => {
    expect(canWriteSettings("Viewer")).toBe(false);
    expect(hasMinRole("Viewer", "Admin")).toBe(false);
  });

  it("allows Admin and Super Admin to write settings", () => {
    expect(canWriteSettings("Admin")).toBe(true);
    expect(canWriteSettings("Super Admin")).toBe(true);
  });

  it("keeps Operator below settings writes but able to run the watch", () => {
    expect(canWriteSettings("Operator")).toBe(false);
    expect(canTriggerScenarios("Operator")).toBe(true);
    expect(canUseHelm("Operator")).toBe(true);
  });
});

describe("unsigned API access", () => {
  it("rejects a request with no session", () => {
    expect(denyUnlessSignedIn(null)).toEqual({
      ok: false,
      status: 401,
      error: "signed_out",
    });
  });
});
