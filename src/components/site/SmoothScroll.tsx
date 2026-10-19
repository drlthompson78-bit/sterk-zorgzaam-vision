import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import type Lenis from "lenis";
import { flushPendingScroll, setSmoothScroller } from "@/lib/scroll";

/** One owner and one animation loop, shared by every public page and anchor. */
export function SmoothScroll() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const publicPage = !pathname.startsWith("/portaal") && !pathname.startsWith("/lovable");

  useEffect(() => {
    if (!publicPage) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let instance: Lenis | null = null;
    let observer: MutationObserver | undefined;
    let generation = 0;

    const syncLock = () => {
      if (!instance) return;
      const locked =
        document.hidden ||
        document.documentElement.hasAttribute("data-sz-intro") ||
        document.documentElement.hasAttribute("data-sz-transition") ||
        document.body.style.overflow === "hidden";
      if (locked) instance.stop();
      else {
        instance.start();
        flushPendingScroll();
      }
    };

    const setup = async () => {
      const current = ++generation;
      observer?.disconnect();
      instance?.destroy();
      instance = null;
      setSmoothScroller(null);
      if (motion.matches) return;

      const { default: Lenis } = await import("lenis");
      if (disposed || current !== generation || motion.matches) return;
      instance = new Lenis({
        autoRaf: true,
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        // Navigation helpers already resolve the visible responsive anchor.
        // Lenis' global anchor handler would select the hidden duplicate ID.
        anchors: false,
        stopInertiaOnNavigate: true,
        prevent: (node) =>
          node.matches(
            "[data-lenis-prevent], .sz-overlay, .sz-reslijst, .sz-filterpaneel, .mz-overlay, .mz-menu, .mz-zoek, .leaflet-container, [role='dialog']",
          ),
      });
      setSmoothScroller(instance);
      observer = new MutationObserver(syncLock);
      observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-sz-intro", "data-sz-transition"],
      });
      syncLock();
    };

    void setup();
    motion.addEventListener("change", setup);
    document.addEventListener("visibilitychange", syncLock);
    return () => {
      disposed = true;
      generation++;
      motion.removeEventListener("change", setup);
      document.removeEventListener("visibilitychange", syncLock);
      observer?.disconnect();
      instance?.destroy();
      setSmoothScroller(null);
    };
  }, [publicPage]);

  return null;
}
