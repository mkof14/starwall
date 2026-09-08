import { describe, expect, it } from "vitest";
import {
  calculateQuote,
  grossMarginPct,
  landedCost,
  lineBelowMinimum,
  lineCustomerPrice,
  listFromLanded,
} from "@/lib/price-book/calc";
import { serializePriceItem } from "@/lib/price-book/serialize";

const line = {
  category: "LICENSE",
  name: "INTELLIGENCE",
  billingType: "ANNUAL" as const,
  quantity: 1,
  listPrice: 42000,
  internalCost: 12000,
  minimumPrice: 42000,
  unitPrice: 42000,
  discountPct: 0,
  inclusion: "ADDITIONAL",
};

describe("price book math", () => {
  it("computes gross margin and does not accept a typed margin", () => {
    expect(grossMarginPct(42000, 12000)).toBe(71.43);
    expect(grossMarginPct(null, 100)).toBeNull();
    expect(grossMarginPct(0, 10)).toBeNull();
  });

  it("computes landed cost and list from markup", () => {
    expect(landedCost({ vendorCost: 1000, shippingCost: 80, otherAcquisition: 20 })).toBe(1100);
    expect(listFromLanded(1100, 50)).toBe(1650);
  });

  it("keeps Year 1 and Year 2+ separate", () => {
    const totals = calculateQuote(
      [
        line,
        {
          category: "HARDWARE",
          name: "Thermal",
          billingType: "ONE-TIME",
          quantity: 2,
          listPrice: 4000,
          internalCost: 2000,
          minimumPrice: 3500,
          unitPrice: 4000,
          discountPct: 0,
          inclusion: "ADDITIONAL",
        },
        {
          category: "DEPLOYMENT",
          name: "Commissioning",
          billingType: "ONE-TIME",
          quantity: 1,
          listPrice: 10000,
          internalCost: 4000,
          minimumPrice: null,
          unitPrice: 10000,
          discountPct: 0,
          inclusion: "ADDITIONAL",
        },
        {
          category: "TRAINING",
          name: "Operator",
          billingType: "ONE-TIME",
          quantity: 1,
          listPrice: 2000,
          internalCost: 400,
          minimumPrice: null,
          unitPrice: 2000,
          discountPct: 0,
          inclusion: "INCLUDED",
        },
      ],
      { travel: 0, hotel: 0, airfare: 0, ground: 0, shipping: 0, other: 0 },
    );
    expect(totals.year1).toBe(60000);
    expect(totals.annualRecurring).toBe(42000);
    expect(totals.oneTime).toBe(18000);
    expect(totals.year1Cost).toBe(20400);
    expect(totals.year1Profit).toBe(39600);
    expect(totals.year1Margin).toBe(66);
    expect(totals.recurringMargin).toBe(71.43);
  });

  it("flags below-minimum customer price", () => {
    expect(lineBelowMinimum({ ...line, discountPct: 10, minimumPrice: 42000 })).toBe(true);
    expect(lineCustomerPrice({ ...line, discountPct: 10 })).toBe(37800);
    const totals = calculateQuote(
      [{ ...line, discountPct: 10 }],
      { travel: 0, hotel: 0, airfare: 0, ground: 0, shipping: 0, other: 0 },
    );
    expect(totals.approvalState).toBe("BELOW MINIMUM");
  });

  it("does not leak cost fields to sales serialization", () => {
    const item = serializePriceItem(
      {
        id: "1",
        itemCode: "SW-LIC-LIGHT",
        category: "LICENSE",
        subcategory: "",
        name: "LIGHT",
        description: "",
        unit: "year",
        internalCost: 2000,
        listPrice: 6000,
        minimumPrice: 6000,
        billingType: "ANNUAL",
        applicablePlans: "LIGHT",
        active: true,
        internalNotes: "secret",
        manufacturer: "",
        model: "",
        sku: "",
        vendorCost: 1,
        shippingCost: 2,
        otherAcquisition: 0,
        landedCost: 3,
        markupPercent: 10,
        listPriceOverride: false,
        installationHours: null,
        configurationHours: null,
        warranty: "",
        leadTime: "",
        coverageHours: "",
        responseTarget: "1h",
        escalation: "",
        namedContact: false,
        remoteSupport: false,
        onSiteSupport: false,
        includedEngHours: null,
        slaNotes: "",
        slaApproved: false,
        hourlyCost: 50,
        customerHourly: null,
        customerDaily: null,
        minIncrementHours: null,
        includedInPlans: "",
        updatedAt: new Date("2026-01-01"),
        updatedBy: "admin",
      },
      "sales",
    );
    expect(item).not.toHaveProperty("internalCost");
    expect(item).not.toHaveProperty("grossMargin");
    expect(item).not.toHaveProperty("vendorCost");
    expect(item).not.toHaveProperty("internalNotes");
    expect(item.listPrice).toBe(6000);
    expect(item.responseTarget).toBe("");
  });
});
