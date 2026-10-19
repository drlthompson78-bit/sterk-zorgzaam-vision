import { useEffect } from "react";
import type { RefObject } from "react";

/** Native staggered reveals: no animation library or work for the hidden layout. */
export function useScrollReveal(
  container: RefObject<HTMLElement | null>,
  selector: string,
  distance: number,
  duration: number,
  stagger: number,
  delay = 0,
) {
  useEffect(() => {
    const el = container.current;
    if (!el || !el.animate || !window.IntersectionObserver) return;

    const desktop = window.matchMedia("(min-width: 781px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let animations: Animation[] = [];

    const reset = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations = [];
    };

    const setup = () => {
      reset();
      if (!desktop.matches || reducedMotion.matches) return;

      let playing = false;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio >= 0.55 && !playing) {
            playing = true;
            animations = Array.from(el.querySelectorAll<HTMLElement>(selector)).map((item, i) =>
              item.animate(
                [
                  { opacity: 0, transform: `translateY(${distance}px)` },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                {
                  duration,
                  delay: delay + i * stagger,
                  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                  fill: "backwards",
                },
              ),
            );
          } else if (!entry.isIntersecting) {
            playing = false;
            animations.forEach((animation) => animation.cancel());
            animations = [];
          }
        },
        { threshold: [0, 0.55] },
      );
      observer.observe(el);
    };

    setup();
    desktop.addEventListener("change", setup);
    reducedMotion.addEventListener("change", setup);
    return () => {
      reset();
      desktop.removeEventListener("change", setup);
      reducedMotion.removeEventListener("change", setup);
    };
  }, [container, selector, distance, duration, stagger, delay]);
}
