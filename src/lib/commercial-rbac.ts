import type { UserRole } from "@/lib/rbac";

export const COMMERCIAL_ROLES = ["admin", "sales", "engineering"] as const;
export type CommercialRole = (typeof COMMERCIAL_ROLES)[number];

export type CommercialActor = {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  commercialRole: CommercialRole;
};

export function isCommercialRole(value: unknown): value is CommercialRole {
  return typeof value === "string" && (COMMERCIAL_ROLES as readonly string[]).includes(value);
}

export function resolveCommercialRole(
  backendRole: UserRole,
  stored?: string | null,
): CommercialRole | null {
  if (isCommercialRole(stored)) return stored;
  if (backendRole === "Super Admin" || backendRole === "Admin") return "admin";
  return null;
}

export function canAccessPriceBook(role: CommercialRole | null | undefined) {
  return Boolean(role);
}

export function sessionHasDeskAccess(
  session:
    | { role?: UserRole | null; commercialRole?: string | null }
    | null
    | undefined,
) {
  if (!session?.role) return false;
  return canAccessPriceBook(
    resolveCommercialRole(session.role, session.commercialRole),
  );
}

export function canSeeInternalCost(role: CommercialRole | null | undefined) {
  return role === "admin";
}

export function canEditPriceBook(role: CommercialRole | null | undefined) {
  return role === "admin";
}

export function canOverrideListPrice(role: CommercialRole | null | undefined) {
  return role === "admin";
}

export function canApplyDiscount(role: CommercialRole | null | undefined) {
  return role === "admin" || role === "sales";
}

export function canApprovePricing(role: CommercialRole | null | undefined) {
  return role === "admin";
}

export function canEditEngineering(role: CommercialRole | null | undefined) {
  return role === "admin" || role === "engineering";
}

export function canEditQuoteCommercial(role: CommercialRole | null | undefined) {
  return role === "admin" || role === "sales";
}
