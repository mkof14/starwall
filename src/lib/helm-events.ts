export const HELM_OPEN_EVENT = "starwall-open-helm";
export const HELM_STATE_EVENT = "starwall-helm-state";

export function openHelm() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(HELM_OPEN_EVENT));
}

export function publishHelmState(open: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(HELM_STATE_EVENT, { detail: { open } }));
}
