export const DESK_ROOT = "/pricing/desk";

export const deskPaths = {
  root: DESK_ROOT,
  book: `${DESK_ROOT}/book`,
  newQuote: `${DESK_ROOT}/quotes/new`,
  quote: (id: string) => `${DESK_ROOT}/quotes/${id}`,
  proposal: (id: string) => `${DESK_ROOT}/quotes/${id}/proposal`,
  catalog: "/pricing",
  pdf: (id: string) => `/api/admin/starwall/pricing/quotes/${id}/pdf`,
} as const;

export function isPlansDeskPath(pathname: string | null | undefined) {
  return Boolean(pathname?.startsWith(DESK_ROOT));
}
