import { useEffect, useState } from "react";
import { FadeLink } from "@/components/site/nav";
import { ArrowLeft, ArrowRight, Close, Phone, Sparkle, User } from "@/components/site/icons";
import { FGROEPEN, useTypewriter, zoeken } from "@/content/zoek";

/*
 * Gedeelde onderdelen van de mobiele site: topbalk, menu, zoeken, inloggen en
 * de vaste actiebalk onderin. De mobiele pagina's zijn zelfstandige layouts —
 * geen responsieve variant van de desktoppagina's.
 */

const MENU_TEGELS = [
  { label: "Missie", hash: "m-missie", src: "/assets/menu-missie.jpg" },
  { label: "Aanpak", hash: "m-aanpak", src: "/assets/menu-aanpak.jpg" },
  { label: "Kwaliteit", to: "/kwaliteit", src: "/assets/menu-kwaliteit.jpg" },
  { label: "Contact", hash: "m-contact", src: "/assets/menu-contact.jpg" },
];

/** Scrollt binnen de mobiele pagina, onder de vaste topbalk door. */
export function mobielNaar(id: string) {
  const el = document.getElementById(id);
  if (el)
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 60,
      behavior: "smooth",
    });
}

export function MobielTopbar({
  variant = "home",
  onMenu,
  onZoek,
}: {
  variant?: "home" | "terug";
  onMenu?: () => void;
  onZoek?: () => void;
}) {
  return (
    <header className="mz-topbar">
      {variant === "home" ? (
        <a
          href="#m-top"
          aria-label="Naar boven"
          onClick={(e) => {
            e.preventDefault();
            mobielNaar("m-top");
          }}
        >
          <img src="/assets/logo.svg" alt="Sterk & Zorgzaam" />
        </a>
      ) : (
        <FadeLink to="/" aria-label="Terug naar home">
          <img src="/assets/logo.svg" alt="Sterk & Zorgzaam" />
        </FadeLink>
      )}

      {variant === "home" ? (
        <div className="mz-topbar-acties">
          <FadeLink to="/portaal" aria-label="Inloggen" className="mz-icoonlink">
            <User stroke="#132a34" width={22} />
          </FadeLink>
          <button type="button" onClick={onZoek} aria-label="Zoeken">
            <Sparkle color="#132a34" width={23} />
          </button>
          <button type="button" onClick={onMenu} aria-label="Menu openen" className="mz-hamburger">
            <span />
            <span />
            <span />
          </button>
        </div>
      ) : (
        <FadeLink to="/" className="mz-terug">
          <ArrowLeft stroke="#d3a142" width={14} />
          Terug
        </FadeLink>
      )}
    </header>
  );
}

/** Vaste actiebalk onderin; op de homepage pas zichtbaar ná de hero. */
export function MobielActiebalk({ zichtbaar = true }: { zichtbaar?: boolean }) {
  return (
    <div className={`mz-actiebalk${zichtbaar ? " is-zichtbaar" : ""}`} aria-hidden={!zichtbaar}>
      <FadeLink to="/aanmelden" className="mz-actiebalk-cta" tabIndex={zichtbaar ? undefined : -1}>
        Meld een jongere aan
        <ArrowRight stroke="#d3a142" width={16} />
      </FadeLink>
      <a
        href="tel:+31628873094"
        aria-label="Bel ons"
        className="mz-actiebalk-bel"
        tabIndex={zichtbaar ? undefined : -1}
      >
        <Phone stroke="#0d2028" width={20} />
      </a>
    </div>
  );
}

export function MobielMenu({ open, onSluiten }: { open: boolean; onSluiten: () => void }) {
  return (
    <nav className={`mz-menu${open ? " is-open" : ""}`} aria-hidden={!open} aria-label="Hoofdmenu">
      <div className="mz-paneel-kop">
        <span className="mz-paneel-label mz-paneel-label--goud">Menu</span>
        <button
          type="button"
          onClick={onSluiten}
          aria-label="Menu sluiten"
          className="mz-paneel-sluit mz-paneel-sluit--kaal"
        >
          <Close stroke="#fffdf8" width={22} />
        </button>
      </div>
      <div className="mz-menu-raster">
        {MENU_TEGELS.map((tegel) =>
          tegel.to ? (
            <FadeLink key={tegel.label} to={tegel.to} className="mz-menu-tegel">
              <img src={tegel.src} alt="" />
              <span className="mz-menu-sluier" aria-hidden="true" />
              <span className="mz-menu-label">
                {tegel.label}
                <ArrowRight stroke="#d3a142" width={13} />
              </span>
            </FadeLink>
          ) : (
            <a
              key={tegel.label}
              href={`#${tegel.hash}`}
              className="mz-menu-tegel"
              onClick={(e) => {
                e.preventDefault();
                onSluiten();
                mobielNaar(tegel.hash!);
              }}
            >
              <img src={tegel.src} alt="" />
              <span className="mz-menu-sluier" aria-hidden="true" />
              <span className="mz-menu-label">
                {tegel.label}
                <ArrowRight stroke="#d3a142" width={13} />
              </span>
            </a>
          ),
        )}
      </div>
    </nav>
  );
}

export function MobielZoeken({ open, onSluiten }: { open: boolean; onSluiten: () => void }) {
  const [query, setQuery] = useState("");
  const [selectie, setSelectie] = useState<Record<string, boolean>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const placeholder = useTypewriter(open);
  const { actief, resultaten } = zoeken(selectie, query);
  const geenRes = (actief.length > 0 || query.trim().length >= 2) && resultaten.length === 0;

  const wissel = (label: string) => setSelectie((s) => ({ ...s, [label]: !s[label] }));

  const sluiten = () => {
    setFiltersOpen(false);
    onSluiten();
  };

  return (
    <div
      className={`mz-zoek${open ? " is-open" : ""}`}
      aria-hidden={!open}
      role="dialog"
      aria-label="Zoeken"
      onClick={sluiten}
    >
      <div className="mz-zoek-kop">
        <button
          type="button"
          onClick={sluiten}
          aria-label="Zoeken sluiten"
          className="mz-zoek-sluit"
        >
          <Close stroke="#fffdf8" width={17} />
        </button>
      </div>

      <h2 className="mz-zoek-titel">
        Wat je ook zoekt, <strong>we denken graag mee</strong>
      </h2>

      <div className="mz-zoek-veld" onClick={(e) => e.stopPropagation()}>
        <textarea
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Bijvoorbeeld: ${placeholder}`}
          aria-label="Zoeken"
        />
        <button type="button" className="mz-filterknop" onClick={() => setFiltersOpen((v) => !v)}>
          Filters
          {actief.length > 0 && <span className="mz-filterstip" aria-hidden="true" />}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fffdf8"
            strokeWidth={2}
            aria-hidden="true"
            style={{ width: 13, transform: filtersOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
        <span className="mz-zoek-icoon" aria-hidden="true">
          <Sparkle color="#fffdf8" width={24} />
        </span>
      </div>

      {resultaten.length > 0 && (
        <div className="mz-zoek-resultaten" onClick={(e) => e.stopPropagation()}>
          <div className="mz-zoek-chips">
            <strong>
              {resultaten.length} {resultaten.length === 1 ? "resultaat" : "resultaten"}
              {actief.length > 0 ? " met ..." : ""}
            </strong>
            {actief.map((label) => (
              <button key={label} type="button" onClick={() => wissel(label)}>
                {label} <Close stroke="#132a34" width={12} />
              </button>
            ))}
          </div>
          <div className="mz-zoek-lijst">
            {resultaten.map((res) =>
              res.to ? (
                <FadeLink
                  key={res.titel}
                  to={res.to}
                  hash={res.toHash}
                  className="mz-zoek-kaart"
                  onNavigate={sluiten}
                >
                  <span className="mz-zoek-cat">{res.cat}</span>
                  <span className="mz-zoek-kop2">{res.titel}</span>
                  <span className="mz-zoek-tekst">{res.tekst}</span>
                </FadeLink>
              ) : (
                <a
                  key={res.titel}
                  href={`#m-${res.hash}`}
                  className="mz-zoek-kaart"
                  onClick={(e) => {
                    e.preventDefault();
                    sluiten();
                    mobielNaar(`m-${res.hash}`);
                  }}
                >
                  <span className="mz-zoek-cat">{res.cat}</span>
                  <span className="mz-zoek-kop2">{res.titel}</span>
                  <span className="mz-zoek-tekst">{res.tekst}</span>
                </a>
              ),
            )}
          </div>
        </div>
      )}

      {geenRes && (
        <p className="mz-zoek-leeg">
          Niets gevonden. Probeer <strong>aanmelden</strong>, <strong>privacy</strong> of{" "}
          <strong>gezin</strong> — of kies een filter.
        </p>
      )}

      <div
        className={`mz-filterlade${filtersOpen ? " is-open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          aria-label="Filters sluiten"
          className="mz-filterlade-sluit"
        >
          <Close stroke="#fffdf8" width={20} />
        </button>
        {FGROEPEN.map((groep) => (
          <div key={groep.titel}>
            <p className="mz-filtergroep">{groep.titel}</p>
            <div className="mz-filteritems">
              {groep.items.map((label) => (
                <label key={label}>
                  <input
                    type="checkbox"
                    checked={!!selectie[label]}
                    onChange={() => wissel(label)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Topbalk + alle overlays samen; scrollt de pagina op slot zolang er één open is. */
export function MobielChroom({ variant = "home" }: { variant?: "home" | "terug" }) {
  const [menu, setMenu] = useState(false);
  const [zoek, setZoek] = useState(false);
  const open = menu || zoek;

  useEffect(() => {
    if (!open) return;
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opToets = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(false);
      setZoek(false);
    };
    window.addEventListener("keydown", opToets);
    return () => {
      document.body.style.overflow = vorige;
      window.removeEventListener("keydown", opToets);
    };
  }, [open]);

  return (
    <>
      <MobielTopbar variant={variant} onMenu={() => setMenu(true)} onZoek={() => setZoek(true)} />
      <MobielMenu open={menu} onSluiten={() => setMenu(false)} />
      <MobielZoeken open={zoek} onSluiten={() => setZoek(false)} />
    </>
  );
}

/** Waarschuwt de homepage zodra de hero uit beeld is. */
export function useVoorbijHero(id = "m-top") {
  const [voorbij, setVoorbij] = useState(false);
  useEffect(() => {
    const hero = document.getElementById(id);
    if (!hero) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((en) => setVoorbij(!en.isIntersecting)),
      { threshold: 0.12 },
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, [id]);
  return voorbij;
}
