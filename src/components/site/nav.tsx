import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { scrollToElement, scrollToPosition } from "@/lib/scroll";
import { transitionPage } from "@/lib/page-transition";

/**
 * Zachte scroll naar een anker, met offset voor de sticky header. Mobiel en
 * desktop zijn twee layouts naast elkaar; alleen de zichtbare telt.
 */
export function scrollToId(id: string, offset = 90, immediate = false) {
  const mobileId = `m-${id}`;
  const resolvedId =
    window.matchMedia("(max-width: 780px)").matches && document.getElementById(mobileId)
      ? mobileId
      : id;
  const kandidaten = Array.from(
    document.querySelectorAll<HTMLElement>(`[id="${CSS.escape(resolvedId)}"]`),
  );
  const el = kandidaten.find((k) => k.offsetParent !== null) ?? kandidaten[0];
  if (!el) return;
  if (immediate) scrollToPosition(el.getBoundingClientRect().top + window.scrollY - offset, true);
  else scrollToElement(el, -offset);
}

/**
 * Cover the current section, jump directly under the cover, then reveal it.
 * The top links always return to the actual top of the page.
 */
export function fadeToId(id: string, offset?: number) {
  return transitionPage(
    async () => {},
    () => {
      if (id === "top" || id === "m-top") scrollToPosition(0, true);
      else {
        const headerOffset = offset ?? (window.matchMedia("(max-width: 780px)").matches ? 60 : 90);
        scrollToId(id, headerOffset, true);
      }
    },
  );
}

/**
 * Internal page and section links share the same cover / position / reveal.
 */
export function FadeLink({
  to,
  hash,
  className,
  children,
  onNavigate,
  onClick,
  target,
  download,
  ...rest
}: {
  to: string;
  hash?: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const router = useRouter();
  const href = hash ? `${to}#${hash}` : to;

  return (
    <a
      {...rest}
      href={href}
      className={className}
      target={target}
      download={download}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0 ||
          (target && target !== "_self") ||
          (download !== undefined && download !== false)
        )
          return;
        if (new URL(href, window.location.href).origin !== window.location.origin) return;
        e.preventDefault();
        onNavigate?.();
        if (to === window.location.pathname) {
          if (hash) void fadeToId(hash);
          else
            void transitionPage(
              async () => {},
              () => scrollToPosition(0, true),
            );
          return;
        }
        void transitionPage(
          () => router.navigate({ to, hash }),
          () => {
            scrollToPosition(0, true);
            if (hash) scrollToId(hash, 100, true);
          },
        );
      }}
    >
      {children}
    </a>
  );
}

/** Anker-link binnen dezelfde pagina, met dezelfde fade als een paginawissel. */
export function AnchorLink({
  id,
  className,
  children,
  onNavigate,
  onClick,
  ...rest
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <a
      {...rest}
      href={`#${id}`}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0 ||
          (e.currentTarget.target && e.currentTarget.target !== "_self") ||
          e.currentTarget.hasAttribute("download")
        )
          return;
        e.preventDefault();
        onNavigate?.();
        void fadeToId(id);
      }}
    >
      {children}
    </a>
  );
}

/** Scrollt na binnenkomst naar de hash uit de URL. */
export function useHashScroll() {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const t = window.setTimeout(() => scrollToId(hash, 100, true), 120);
    return () => window.clearTimeout(t);
  }, []);
}
