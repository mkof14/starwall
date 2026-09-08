import { describe, expect, it } from "vitest";
import { denyUnlessSignedIn } from "@/lib/authz";
import {
  canApplyDiscount,
  canApprovePricing,
  canEditPriceBook,
  canSeeInternalCost,
  resolveCommercialRole,
  sessionHasDeskAccess,
} from "@/lib/commercial-rbac";

describe("commercial desk access", () => {
  it("maps Super Admin and Admin to commercial admin when unset", () => {
    expect(resolveCommercialRole("Super Admin", "none")).toBe("admin");
    expect(resolveCommercialRole("Admin", null)).toBe("admin");
    expect(resolveCommercialRole("Operator", "sales")).toBe("sales");
    expect(resolveCommercialRole("Operator", "none")).toBeNull();
    expect(resolveCommercialRole("Viewer", "engineering")).toBe("engineering");
  });

  it("keeps cost editing and floor approval on admin", () => {
    expect(canSeeInternalCost("admin")).toBe(true);
    expect(canSeeInternalCost("sales")).toBe(false);
    expect(canSeeInternalCost("engineering")).toBe(false);
    expect(canEditPriceBook("sales")).toBe(false);
    expect(canApplyDiscount("sales")).toBe(true);
    expect(canApplyDiscount("engineering")).toBe(false);
    expect(canApprovePricing("sales")).toBe(false);
    expect(canApprovePricing("admin")).toBe(true);
  });

  it("rejects unsigned callers before any price data", () => {
    expect(denyUnlessSignedIn(null).ok).toBe(false);
  });

  it("opens the Plans desk for Super Admin, Admin, and assigned commercial roles", () => {
    expect(sessionHasDeskAccess({ role: "Super Admin", commercialRole: "none" })).toBe(true);
    expect(sessionHasDeskAccess({ role: "Admin" })).toBe(true);
    expect(sessionHasDeskAccess({ role: "Operator", commercialRole: "sales" })).toBe(true);
    expect(sessionHasDeskAccess({ role: "Operator", commercialRole: "none" })).toBe(false);
    expect(sessionHasDeskAccess({ role: "Viewer" })).toBe(false);
    expect(sessionHasDeskAccess(null)).toBe(false);
  });
});
