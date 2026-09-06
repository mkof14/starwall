// Procedural, reversible Supervised Automation only.
// CRITICAL / Crisis Mode cases are excluded — human escalation takes priority.
//
// Conflict: "comms-jamming" is on the requested automation list AND is CRITICAL
// in the scenario catalog. It is omitted here on purpose.

export const AUTOMATED_ACTIONS: Record<string, string[]> = {
  "perimeter-breach": [
    "Nearby cameras automatically switched to recording · Sector 4 lighting activated",
  ],
  "unattended-object": ["Camera zoom automatically focused on object location"],
  "recon-drone": ["Tracking log automatically started for this contact"],
  tailgating: ["Access point camera footage automatically flagged for review"],
};
