export const USER_ROLES = [
  "Super Admin",
  "Admin",
  "Operator",
  "Viewer",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

const RANK: Record<UserRole, number> = {
  Viewer: 1,
  Operator: 2,
  Admin: 3,
  "Super Admin": 4,
};

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (USER_ROLES as readonly string[]).includes(value)
  );
}

export function roleRank(role: UserRole) {
  return RANK[role];
}

export function hasMinRole(role: UserRole | null | undefined, minimum: UserRole) {
  if (!role) return false;
  return roleRank(role) >= roleRank(minimum);
}

export function canManageUsers(role: UserRole | null | undefined) {
  return role === "Super Admin";
}

export function canWriteSettings(role: UserRole | null | undefined) {
  return hasMinRole(role, "Admin");
}

export function canTriggerScenarios(role: UserRole | null | undefined) {
  return hasMinRole(role, "Operator");
}

export function canUseHelm(role: UserRole | null | undefined) {
  return hasMinRole(role, "Operator");
}

export function defaultSignupRole(): UserRole {
  return "Operator";
}
