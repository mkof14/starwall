/**
 * Banned marketing terms from the StarWall spec.
 * Enforced by `npm run lint:copy` — not only by authoring discipline.
 */
export const bannedTerms = [
  {
    term: "Node",
    pattern: /\bNode\b/,
    useInstead: "Unit / Kit / Gateway",
  },
  {
    term: "Command",
    pattern: /\bCommand\b/,
    useInstead: "Bridge (as a feature name)",
  },
  {
    term: "Dominate",
    pattern: /\bDominate\b/i,
    useInstead: "omit",
  },
  {
    term: "Autonomous",
    pattern: /\bAutonomous\b/i,
    useInstead: "omit (unsupervised physical action)",
  },
] as const;
