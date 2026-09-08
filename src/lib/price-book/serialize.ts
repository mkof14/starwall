import { asMoney, grossMarginPct } from "@/lib/price-book/calc";
import type { CommercialRole } from "@/lib/commercial-rbac";
import { canSeeInternalCost } from "@/lib/commercial-rbac";

type ItemLike = {
  id: string;
  itemCode: string;
  category: string;
  subcategory: string;
  name: string;
  description: string;
  unit: string;
  internalCost: unknown;
  listPrice: unknown;
  minimumPrice: unknown;
  billingType: string;
  applicablePlans: string;
  active: boolean;
  internalNotes: string;
  manufacturer: string;
  model: string;
  sku: string;
  vendorCost: unknown;
  shippingCost: unknown;
  otherAcquisition: unknown;
  landedCost: unknown;
  markupPercent: unknown;
  listPriceOverride: boolean;
  installationHours: unknown;
  configurationHours: unknown;
  warranty: string;
  leadTime: string;
  coverageHours: string;
  responseTarget: string;
  escalation: string;
  namedContact: boolean;
  remoteSupport: boolean;
  onSiteSupport: boolean;
  includedEngHours: unknown;
  slaNotes: string;
  slaApproved: boolean;
  hourlyCost: unknown;
  customerHourly: unknown;
  customerDaily: unknown;
  minIncrementHours: unknown;
  includedInPlans: string;
  updatedAt: Date;
  updatedBy: string;
};

export function priceStatus(listPrice: unknown) {
  return asMoney(listPrice) === null ? "PRICE REQUIRED" : "PRICED";
}

export function serializePriceItem(item: ItemLike, role: CommercialRole) {
  const listPrice = asMoney(item.listPrice);
  const internalCost = asMoney(item.internalCost);
  const publicItem = {
    id: item.id,
    itemCode: item.itemCode,
    category: item.category,
    subcategory: item.subcategory,
    name: item.name,
    description: item.description,
    unit: item.unit,
    listPrice,
    billingType: item.billingType,
    applicablePlans: item.applicablePlans,
    active: item.active,
    manufacturer: item.manufacturer,
    model: item.model,
    sku: item.sku,
    warranty: item.warranty,
    leadTime: item.leadTime,
    includedInPlans: item.includedInPlans,
    priceStatus: priceStatus(item.listPrice),
    updatedAt: item.updatedAt.toISOString(),
    slaApproved: item.slaApproved,
    coverageHours: item.slaApproved ? item.coverageHours : "",
    responseTarget: item.slaApproved ? item.responseTarget : "",
    customerHourly: asMoney(item.customerHourly),
    customerDaily: asMoney(item.customerDaily),
    minIncrementHours: asMoney(item.minIncrementHours),
  };

  if (!canSeeInternalCost(role)) {
    return publicItem;
  }

  return {
    ...publicItem,
    internalCost,
    minimumPrice: asMoney(item.minimumPrice),
    grossMargin: grossMarginPct(listPrice, internalCost),
    internalNotes: item.internalNotes,
    vendorCost: asMoney(item.vendorCost),
    shippingCost: asMoney(item.shippingCost),
    otherAcquisition: asMoney(item.otherAcquisition),
    landedCost: asMoney(item.landedCost),
    markupPercent: asMoney(item.markupPercent),
    listPriceOverride: item.listPriceOverride,
    installationHours: asMoney(item.installationHours),
    configurationHours: asMoney(item.configurationHours),
    hourlyCost: asMoney(item.hourlyCost),
    escalation: item.escalation,
    namedContact: item.namedContact,
    remoteSupport: item.remoteSupport,
    onSiteSupport: item.onSiteSupport,
    includedEngHours: asMoney(item.includedEngHours),
    slaNotes: item.slaNotes,
    updatedBy: item.updatedBy,
  };
}

type LineLike = {
  id: string;
  category: string;
  name: string;
  description: string;
  billingType: string;
  quantity: unknown;
  unit: string;
  listPrice: unknown;
  internalCost: unknown;
  minimumPrice: unknown;
  unitPrice: unknown;
  discountPct: unknown;
  customerPrice: unknown;
  engineeringHours: unknown;
  notes: string;
  inclusion: string;
  sortOrder: number;
  priceItemId: string | null;
};

export function serializeQuoteLine(line: LineLike, role: CommercialRole) {
  const base = {
    id: line.id,
    priceItemId: line.priceItemId,
    category: line.category,
    name: line.name,
    description: line.description,
    billingType: line.billingType,
    quantity: asMoney(line.quantity) ?? 1,
    unit: line.unit,
    listPrice: asMoney(line.listPrice),
    unitPrice: asMoney(line.unitPrice),
    discountPct: asMoney(line.discountPct) ?? 0,
    customerPrice: asMoney(line.customerPrice),
    inclusion: line.inclusion,
    sortOrder: line.sortOrder,
    engineeringHours: asMoney(line.engineeringHours),
    notes: role === "engineering" || role === "admin" ? line.notes : "",
  };
  if (!canSeeInternalCost(role)) {
    return base;
  }
  return {
    ...base,
    internalCost: asMoney(line.internalCost),
    minimumPrice: asMoney(line.minimumPrice),
    notes: line.notes,
  };
}
