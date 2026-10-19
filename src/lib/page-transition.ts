const COVER_MS = 500;
const HOLD_MS = 200;
const REVEAL_MS = 450;
const RECOVERY_MS = 8000;

let active: symbol | null = null;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const nextPaint = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

/**
 * Linden's latest page transition: one persistent cover across an SPA route swap.
 * The next route is revealed only after it is ready, at the correct scroll position.
 */
export async function transitionPage(
  navigate: () => Promise<unknown>,
  positionPage: () => void,
): Promise<boolean> {
  if (active) return false;
  const token = Symbol("page-transition");
  active = token;

  const root = document.documentElement;
  const content = document.getElementById("sz-site-content");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animate = !motion.matches && !!document.querySelector(".sz-page-transition");
  const wasInert = content?.inert ?? false;
  const wasBusy = content?.getAttribute("aria-busy");

  const unlock = () => {
    root.removeAttribute("data-sz-transition");
    if (content) {
      content.inert = wasInert;
      if (wasBusy == null) content.removeAttribute("aria-busy");
      else content.setAttribute("aria-busy", wasBusy);
    }
  };
  const release = () => {
    if (active !== token) return;
    active = null;
    window.clearTimeout(recovery);
    unlock();
    window.removeEventListener("popstate", release);
    window.removeEventListener("pageshow", onPageShow);
    motion.removeEventListener("change", onMotionChange);
  };
  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) release();
  };
  const onMotionChange = () => {
    if (motion.matches && active === token) {
      animate = false;
      unlock();
    }
  };

  window.addEventListener("popstate", release);
  window.addEventListener("pageshow", onPageShow);
  motion.addEventListener("change", onMotionChange);
  const recovery = window.setTimeout(release, RECOVERY_MS);

  try {
    if (animate) {
      root.setAttribute("data-sz-transition", "cover");
      if (content) {
        content.inert = true;
        content.setAttribute("aria-busy", "true");
      }
      await wait(COVER_MS);
      if (active !== token) return false;
    }

    await navigate();
    if (active !== token) return false;
    // A route promise can settle just before React commits its destination DOM.
    await nextPaint();
    if (active !== token) return false;
    if (animate && !motion.matches) await wait(HOLD_MS);
    if (active !== token) return false;
    positionPage();

    if (animate && !motion.matches) {
      root.setAttribute("data-sz-transition", "reveal");
      await wait(REVEAL_MS);
    }
    return active === token;
  } catch (error) {
    console.error("Page navigation failed", error);
    return false;
  } finally {
    release();
  }
}
