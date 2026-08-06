import { useEffect, useRef, useState } from "react";
import { AnchorLink, FadeLink } from "./nav";
import { FGROEPEN, useTypewriter, zoeken } from "@/content/zoek";
import { ArrowLeft, ArrowRight, ChevronDown, Close, Sparkle, User } from "./icons";

const MENU_TEGELS = [
  { label: "Missie", hash: "missie", src: "/assets/menu-missie.jpg" },
  { label: "Aanpak", hash: "aanpak", src: "/assets/menu-aanpak.jpg" },
  { label: "Kwaliteit", to: "/kwaliteit", src: "/assets/menu-kwaliteit.jpg" },
  { label: "Contact", hash: "contact", src: "/assets/menu-contact.jpg" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [zoekOpen, setZoekOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [lijstweergave, setLijstweergave] = useState(false);
  const [selectie, setSelectie] = useState<Record<string, boolean>>({});
  const [zoekterm, setZoekterm] = useState("");
  const sluitTimer = useRef<number | undefined>(undefined);
  const placeholder = useTypewriter(zoekOpen);

  const menuEnter = () => {
    window.clearTimeout(sluitTimer.current);
    setMenuOpen(true);
  };
  const menuLeave = () => {
    window.clearTimeout(sluitTimer.current);
    sluitTimer.current = window.setTimeout(() => setMenuOpen(false), 320);
  };

  const toggleFilter = (label: string) => setSelectie((s) => ({ ...s, [label]: !s[label] }));
  const { actief: actieveFilters, resultaten } = zoeken(selectie, zoekterm);
  const heeftVraag = zoekterm.trim().length >= 2;

  const sluitZoek = () => {
    setZoekOpen(false);
    setFiltersOpen(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      sluitZoek();
      setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sz-header">
        <AnchorLink id="top" className="sz-header-logo" aria-label="Sterk & Zorgzaam startpagina">
          <img src="/assets/logo.svg" alt="Sterk & Zorgzaam" />
        </AnchorLink>

        <div className="sz-header-mid">
          <span className="sz-header-spacer" />
          <button
            type="button"
            aria-label="Zoeken met AI"
            className="sz-iconbtn"
            onClick={() => setZoekOpen(true)}
          >
            <Sparkle />
          </button>
          <nav aria-label="Hoofdnavigatie" className="sz-nav">
            <button
              type="button"
              className="sz-menubtn"
              aria-expanded={menuOpen}
              onMouseEnter={menuEnter}
              onMouseLeave={menuLeave}
              onClick={() => setMenuOpen((v) => !v)}
            >
              Menu
              <ChevronDown
                className={`sz-chev${menuOpen ? " is-open" : ""}`}
                stroke="#8a6420"
                width={11}
              />
            </button>
          </nav>
          <FadeLink to="/portaal" className="sz-loginbtn">
            <User stroke="#8a6420" width={17} />
            Inloggen
          </FadeLink>
        </div>

        <FadeLink to="/aanmelden" className="sz-cta">
          <span>Aanmelden</span>
          <ArrowRight stroke="#8a6420" width={16} />
        </FadeLink>

        <div
          className={`sz-mega${menuOpen ? " is-open" : ""}`}
          aria-hidden={!menuOpen}
          onMouseEnter={menuEnter}
          onMouseLeave={menuLeave}
        >
          <div className="sz-mega-intro">
            <p className="sz-mega-label">Menu</p>
            <p className="sz-mega-kop">Begeleiding met verbinding, vertrouwen en vooruitgang.</p>
            <FadeLink to="/aanmelden" className="sz-mega-link">
              Meld een jongere aan <ArrowRight width={14} />
            </FadeLink>
          </div>
          <div className="sz-mega-tiles">
            {MENU_TEGELS.map((tegel) => {
              const inhoud = (
                <>
                  <img src={tegel.src} alt="" />
                  <span className="mk-veil" aria-hidden="true" />
                  <span className="mk-label">
                    {tegel.label} <ArrowRight className="mk-pijl" stroke="#fffdf8" width={22} />
                  </span>
                </>
              );
              return tegel.to ? (
                <FadeLink
                  key={tegel.label}
                  to={tegel.to}
                  className="mk-kaart"
                  onNavigate={() => setMenuOpen(false)}
                >
                  {inhoud}
                </FadeLink>
              ) : (
                <AnchorLink
                  key={tegel.label}
                  id={tegel.hash!}
                  className="mk-kaart"
                  onNavigate={() => setMenuOpen(false)}
                >
                  {inhoud}
                </AnchorLink>
              );
            })}
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------- zoeken */}
      <div className={`sz-overlay sz-zoek${zoekOpen ? " is-open" : ""}`} onClick={sluitZoek}>
        <h2 className="sz-zoek-kop">
          Wat je ook zoekt, <strong>we denken graag mee</strong>
        </h2>
        <div className="sz-zoek-veld" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={zoekterm}
            onChange={(e) => setZoekterm(e.target.value)}
            placeholder={`Bijvoorbeeld: ${placeholder}`}
            aria-label="Zoeken"
            rows={4}
          />
          <button type="button" className="sz-filterbtn" onClick={() => setFiltersOpen((v) => !v)}>
            Filters
            {actieveFilters.length > 0 && <span className="sz-filterdot" aria-hidden="true" />}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fffdf8"
              strokeWidth={2}
              aria-hidden="true"
              style={{
                width: 14,
                transform: filtersOpen ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 300ms ease",
              }}
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <span className="sz-zoek-icoon" aria-hidden="true">
            <Sparkle color="#fffdf8" width={26} />
          </span>
        </div>

        {(actieveFilters.length > 0 || heeftVraag) && (
          <div className="sz-zoek-res" onClick={(e) => e.stopPropagation()}>
            <div className="sz-zoek-reshead">
              <strong>
                {resultaten.length} {resultaten.length === 1 ? "resultaat" : "resultaten"}
                {actieveFilters.length > 0 ? " met ..." : ""}
              </strong>
              {actieveFilters.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="sz-chip"
                  onClick={() => toggleFilter(label)}
                >
                  {label} <Close stroke="#132a34" width={13} />
                </button>
              ))}
              <span style={{ flex: 1 }} />
              <button
                type="button"
                className="sz-viewbtn"
                onClick={() => setLijstweergave((v) => !v)}
              >
                Wissel weergave
                <span className="sz-viewicon">
                  {lijstweergave ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="#fffdf8"
                      style={{ width: 17, display: "block" }}
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="8" height="18" rx="1.5" />
                      <rect x="13" y="3" width="8" height="8" rx="1.5" />
                      <rect x="13" y="13" width="8" height="8" rx="1.5" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fffdf8"
                      strokeWidth={2.6}
                      strokeLinecap="round"
                      style={{ width: 19, display: "block" }}
                      aria-hidden="true"
                    >
                      <path d="M4 6h16" />
                      <path d="M4 12h16" />
                      <path d="M4 18h16" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
            <div
              className="sz-reslijst"
              style={
                lijstweergave
                  ? { display: "block", columns: "2 280px" }
                  : {
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    }
              }
            >
              {resultaten.map((res) => {
                const inhoud = (
                  <>
                    <span className="sz-rescat">{res.cat}</span>
                    <span className="sz-restitel">{res.titel}</span>
                    <span className="sz-restekst">{res.tekst}</span>
                  </>
                );
                const stijl = {
                  padding: lijstweergave ? "28px 26px 30px" : "22px 24px",
                  marginBottom: lijstweergave ? 14 : 0,
                };
                return res.to ? (
                  <FadeLink
                    key={res.titel}
                    to={res.to}
                    hash={res.toHash}
                    className="sz-reskaart"
                    style={stijl}
                    onNavigate={sluitZoek}
                  >
                    {inhoud}
                  </FadeLink>
                ) : (
                  <AnchorLink
                    key={res.titel}
                    id={res.hash!}
                    className="sz-reskaart"
                    style={stijl}
                    onNavigate={sluitZoek}
                  >
                    {inhoud}
                  </AnchorLink>
                );
              })}
            </div>
            {resultaten.length === 0 && (
              <p className="sz-zoek-leeg">
                Niets gevonden. Probeer <strong>aanmelden</strong>, <strong>privacy</strong> of{" "}
                <strong>gezin</strong> — of kies een filter.
              </p>
            )}
          </div>
        )}

        <div
          className={`sz-filterpaneel${filtersOpen ? " is-open" : ""}`}
          onClick={(e) => e.stopPropagation()}
          aria-hidden={!filtersOpen}
        >
          <button
            type="button"
            className="sz-sluitbtn"
            aria-label="Filters sluiten"
            onClick={() => setFiltersOpen(false)}
          >
            <Close stroke="#fffdf8" width={22} />
          </button>
          {FGROEPEN.map((groep) => (
            <div key={groep.titel}>
              <p>{groep.titel}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {groep.items.map((label) => (
                  <label key={label}>
                    <input
                      type="checkbox"
                      checked={!!selectie[label]}
                      onChange={() => toggleFilter(label)}
                    />{" "}
                    {label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** Header voor de Kwaliteit-pagina. */
export function PaginaHeader({ actief }: { actief: "kwaliteit" }) {
  return (
    <header className="sz-header">
      <FadeLink to="/" className="sz-header-logo" aria-label="Sterk & Zorgzaam startpagina">
        <img src="/assets/logo.svg" alt="Sterk & Zorgzaam" />
      </FadeLink>
      <nav
        aria-label="Hoofdnavigatie"
        className="sz-nav"
        style={{ justifyContent: "center", flexWrap: "wrap", gap: "clamp(18px, 3vw, 52px)" }}
      >
        <FadeLink to="/">Home</FadeLink>
        <AnchorLink id="documenten" className={actief === "kwaliteit" ? "is-active" : undefined}>
          Kwaliteit
        </AnchorLink>
        <FadeLink to="/" hash="contact">
          Contact
        </FadeLink>
      </nav>
      <FadeLink to="/aanmelden" className="sz-cta">
        <span>Aanmelden</span>
        <ArrowRight stroke="#d3a142" width={16} />
      </FadeLink>
    </header>
  );
}

/** Header voor de Aanmelden-pagina. */
export function TerugHeader() {
  return (
    <header className="sz-header">
      <FadeLink to="/" className="sz-header-logo" aria-label="Terug naar startpagina">
        <img src="/assets/logo.svg" alt="Sterk & Zorgzaam" />
      </FadeLink>
      <span />
      <FadeLink to="/" className="sz-back">
        <ArrowLeft width={15} />
        <span>Terug</span>
      </FadeLink>
    </header>
  );
}
