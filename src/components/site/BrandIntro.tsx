import { useCallback, useEffect, useId, useRef, useState } from "react";
import { dogPath, wordmarkPaths } from "./brand-artwork";
import "./brand-intro.css";

const SESSION_KEY = "ssz-brand-intro-v1";
const DURATION = 4780;
const END_FRAME = 3550;

// Runs before the first paint. A bounded fallback always releases the page,
// including when the main JavaScript fails to hydrate.
export const brandIntroBootstrap = `(function(){try{var force=${import.meta.env.DEV}&&new URLSearchParams(location.search).get('intro')==='1';if(location.pathname!=='/'||location.hash||matchMedia('(prefers-reduced-motion: reduce)').matches||(!force&&sessionStorage.getItem('${SESSION_KEY}')))return;var root=document.documentElement;root.setAttribute('data-sz-intro','pending');var guard=setTimeout(function(){root.removeAttribute('data-sz-intro');root.removeAttribute('data-sz-intro-guard')},6200);root.setAttribute('data-sz-intro-guard',String(guard))}catch(e){}})();`;

function clearBootstrapGuard() {
  const root = document.documentElement;
  const guard = root.getAttribute("data-sz-intro-guard");
  if (guard) window.clearTimeout(Number(guard));
  root.removeAttribute("data-sz-intro-guard");
}

export function BrandIntro() {
  const [visible, setVisible] = useState(true);
  const [completed, setCompleted] = useState(false);
  const completeRequested = useRef(false);
  const introRef = useRef<HTMLDivElement>(null);
  const finishTimer = useRef<number | undefined>(undefined);
  const uid = useId().replace(/:/g, "");

  const finish = useCallback(() => {
    clearBootstrapGuard();
    document.documentElement.removeAttribute("data-sz-intro");
    const content = document.getElementById("sz-site-content");
    if (content) content.inert = false;
    setVisible(false);
  }, []);

  const completeIntro = useCallback(() => {
    if (completeRequested.current) return;
    const animations =
      introRef.current
        ?.getAnimations({ subtree: true })
        .filter(
          (animation) =>
            animation instanceof CSSAnimation &&
            ["sz-logo-out", "sz-curtain-out"].includes(animation.animationName),
        ) ?? [];
    const progress = Math.max(
      0,
      ...animations.map((animation) =>
        typeof animation.currentTime === "number" ? animation.currentTime : 0,
      ),
    );
    if (progress >= END_FRAME) return;

    completeRequested.current = true;
    setCompleted(true);
    // Show the finished artwork, then keep the existing exit and curtain timing.
    for (const animation of animations) animation.currentTime = END_FRAME;
    window.clearTimeout(finishTimer.current);
    finishTimer.current = window.setTimeout(finish, DURATION - END_FRAME);
  }, [finish]);

  useEffect(() => {
    if (!visible) return;
    clearBootstrapGuard();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const force = import.meta.env.DEV && new URLSearchParams(location.search).get("intro") === "1";
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* A blocked session store must not block the page. */
    }
    if (location.pathname !== "/" || location.hash || motion.matches || (seen && !force)) {
      finish();
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* Private browsing. */
    }
    document.documentElement.setAttribute("data-sz-intro", "running");
    const content = document.getElementById("sz-site-content");
    if (content) content.inert = true;
    introRef.current?.focus({ preventScroll: true });
    finishTimer.current = window.setTimeout(finish, DURATION);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") completeIntro();
    };
    const onMotionChange = () => {
      if (motion.matches) finish();
    };
    window.addEventListener("keydown", onKey);
    motion.addEventListener("change", onMotionChange);
    return () => {
      window.clearTimeout(finishTimer.current);
      window.removeEventListener("keydown", onKey);
      motion.removeEventListener("change", onMotionChange);
      document.documentElement.removeAttribute("data-sz-intro");
      if (content) content.inert = false;
    };
  }, [completeIntro, finish, visible]);

  if (!visible) return null;

  return (
    <div
      ref={introRef}
      className={`sz-brand-intro${completed ? " is-complete" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welkom bij Sterk en Zorgzaam"
      tabIndex={-1}
      data-lenis-prevent
    >
      <div className="sz-intro-panels" aria-hidden="true">
        {[0, 1, 2, 3].map((panel) => (
          <span key={panel} style={{ "--panel": panel } as React.CSSProperties} />
        ))}
      </div>
      <button
        className="sz-intro-artwork"
        type="button"
        aria-label="Toon het complete logo en open de website"
        onClick={completeIntro}
      >
        <svg className="sz-intro-logo" viewBox="-16 -12 456 304" fill="none" aria-hidden="true">
          <defs>
            <g id={`${uid}-letters`}>
              {wordmarkPaths.map((path, i) => (
                <path key={i} d={path.d} fillRule={"evenodd" in path ? "evenodd" : "nonzero"} />
              ))}
            </g>
            <clipPath id={`${uid}-clip`}>
              <use href={`#${uid}-letters`} />
            </clipPath>
            <linearGradient id={`${uid}-light`}>
              <stop offset="0" stopColor="#fff4d4" stopOpacity="0" />
              <stop offset=".5" stopColor="#fff4d4" stopOpacity=".85" />
              <stop offset="1" stopColor="#fff4d4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g className="sz-intro-dog">
            <path
              d={dogPath}
              pathLength="1"
              stroke="#eee8dc"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <g className="sz-intro-wordmark">
            <use href={`#${uid}-letters`} fill="#d19f1f" />
            <g clipPath={`url(#${uid}-clip)`}>
              <rect
                className="sz-intro-dimmer"
                x="-3"
                y="35"
                width="310"
                height="110"
                fill="#0b2028"
                fillOpacity=".8"
              />
              <rect
                className="sz-intro-light"
                x="-180"
                y="35"
                width="160"
                height="110"
                fill={`url(#${uid}-light)`}
              />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
