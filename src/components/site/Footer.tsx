import { FadeLink } from "./nav";

export function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="sz-footer">
      <img src="/assets/logo.svg" alt="Sterk & Zorgzaam" />
      {compact ? (
        <p style={{ margin: 0, textAlign: "right" }}>© 2026 Samen Sterk &amp; Zorgzaam B.V.</p>
      ) : (
        <div className="sz-footer-links">
          <FadeLink to="/kwaliteit" hash="privacy">
            Privacy
          </FadeLink>
          <FadeLink to="/kwaliteit" hash="cookies">
            Cookies
          </FadeLink>
          <FadeLink to="/kwaliteit" hash="klachten">
            Klachtenregeling
          </FadeLink>
          <FadeLink to="/kwaliteit" hash="disclaimer">
            Disclaimer
          </FadeLink>
          <p>© 2026 Samen Sterk &amp; Zorgzaam B.V.</p>
        </div>
      )}
    </footer>
  );
}
