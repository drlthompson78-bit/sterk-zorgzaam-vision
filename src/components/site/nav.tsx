import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

/**
 * Zachte scroll naar een anker, met offset voor de sticky header. Mobiel en
 * desktop zijn twee layouts naast elkaar; alleen de zichtbare telt.
 */
export function scrollToId(id: string, offset = 90) {
  const kandidaten = Array.from(document.querySelectorAll<HTMLElement>(`[id="${CSS.escape(id)}"]`));
  const el = kandidaten.find((k) => k.offsetParent !== null) ?? kandidaten[0];
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - offset,
    behavior: "smooth",
  });
}

/**
 * Interne link met paginatransitie: body fade-out (600ms) → navigeren.
 * Zelfde timing als het prototype.
 */
export function FadeLink({
  to,
  hash,
  className,
  children,
  onNavigate,
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
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate?.();
        document.body.classList.add("sz-leaving");
        window.setTimeout(() => {
          router.navigate({ to, hash }).then(() => {
            window.scrollTo({ top: 0 });
            document.body.classList.remove("sz-leaving");
          });
        }, 610);
      }}
    >
      {children}
    </a>
  );
}

/** Anker-link binnen dezelfde pagina. */
export function AnchorLink({
  id,
  className,
  children,
  onNavigate,
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
        e.preventDefault();
        onNavigate?.();
        scrollToId(id);
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
    const t = window.setTimeout(() => scrollToId(hash, 100), 120);
    return () => window.clearTimeout(t);
  }, []);
}
