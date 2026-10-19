import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { fadeToId } from "./nav";
import "./back-to-top.css";

export function BackToTop() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const publicPage = !pathname.startsWith("/portaal") && !pathname.startsWith("/lovable");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!publicPage) return;
    const update = () => setVisible(window.scrollY > Math.max(320, window.innerHeight * 0.75));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname, publicPage]);

  if (!publicPage || !visible) return null;

  return (
    <button
      type="button"
      className="sz-back-to-top"
      aria-label="Naar boven"
      onClick={() => void fadeToId("top")}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
