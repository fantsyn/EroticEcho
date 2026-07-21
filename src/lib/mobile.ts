/** Shared mobile / touch helpers */

export function isMobileUa(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/** True when coarse pointer (phones / many tablets) */
export function prefersCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(pointer: coarse)").matches;
  } catch {
    return isMobileUa();
  }
}

export function isTouchDevice(): boolean {
  return isMobileUa() || prefersCoarsePointer();
}
