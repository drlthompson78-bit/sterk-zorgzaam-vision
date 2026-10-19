import type Lenis from "lenis";

let scroller: Lenis | null = null;
let pendingScroll: number | null = null;

export function setSmoothScroller(instance: Lenis | null) {
  scroller = instance;
  if (!instance) pendingScroll = null;
}

export function flushPendingScroll() {
  if (!scroller || scroller.isStopped || pendingScroll === null) return;
  const top = pendingScroll;
  pendingScroll = null;
  scroller.scrollTo(top);
}

export function scrollToPosition(top: number, immediate = false) {
  if (scroller) {
    // A mobile menu closes asynchronously. Keep its anchor request until the
    // body unlocks instead of silently dropping it while Lenis is stopped.
    if (scroller.isStopped && !immediate) {
      pendingScroll = top;
      return;
    }
    pendingScroll = null;
    scroller.scrollTo(top, { immediate, force: immediate });
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: immediate || reduced ? "instant" : "smooth" });
}

/** Offset follows Lenis: a negative value leaves room for the sticky header. */
export function scrollToElement(element: HTMLElement, offset = 0) {
  scrollToPosition(element.getBoundingClientRect().top + window.scrollY + offset);
}
