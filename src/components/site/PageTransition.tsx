import "./page-transition.css";

/** Mounted outside the routed content so the cover survives the page change. */
export function PageTransition() {
  return (
    <div className="sz-page-transition" aria-hidden="true" data-lenis-prevent>
      <span>Sterk &amp; Zorgzaam</span>
    </div>
  );
}
