import { useEffect, useRef } from "react";
import { Facebook, Instagram, LinkedIn, Mail, MapPin, Phone } from "../site/icons";

const ADRES = "Graze Weitje 22, 3077BM Rotterdam";
const FALLBACK: [number, number] = [51.8931, 4.5602];

const MARKER_HTML =
  '<div style="width:38px;height:38px;margin:-19px 0 0 -19px;display:flex;align-items:center;justify-content:center;background:#d3a142;border:3px solid #0d2028;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 8px 18px rgba(13,32,40,0.35);"><div style="width:10px;height:10px;background:#0d2028;border-radius:50%;transform:rotate(45deg);"></div></div>';

function useKaart() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let map: import("leaflet").Map | undefined;
    let afgebroken = false;

    const opzetten = async () => {
      const L = (await import("leaflet")).default;
      if (afgebroken || !container.current) return;

      let coord = FALLBACK;
      try {
        const res = await fetch(
          `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(ADRES)}&rows=1&fl=centroide_ll`,
        );
        const data = await res.json();
        const punt = data?.response?.docs?.[0]?.centroide_ll?.match(/POINT\(([\d.]+) ([\d.]+)\)/);
        if (punt) coord = [parseFloat(punt[2]), parseFloat(punt[1])];
      } catch {
        /* val terug op de vaste coördinaat */
      }
      if (afgebroken || !container.current) return;

      map = L.map(container.current, { scrollWheelZoom: false, zoomControl: true }).setView(
        coord,
        15,
      );
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        maxZoom: 19,
      }).addTo(map);
      L.marker(coord, { icon: L.divIcon({ className: "", html: MARKER_HTML, iconSize: [0, 0] }) })
        .addTo(map)
        .bindPopup(
          '<strong style="font-family:Georgia,serif;">Sterk &amp; Zorgzaam</strong><br />Graze Weitje 22<br />3077 BM Rotterdam',
        );
    };

    opzetten();
    return () => {
      afgebroken = true;
      map?.remove();
    };
  }, []);

  return container;
}

export function Contact() {
  const kaart = useKaart();

  return (
    <section id="contact" className="sz-section sz-contact" aria-labelledby="contact-title">
      <span className="sz-contact-pijl" aria-hidden="true">
        →
      </span>
      <h2 id="contact-title">
        Samen werken aan
        <br />
        duurzaam <em>perspectief.</em>
      </h2>
      <p className="sz-contact-intro">
        Een jongere aanmelden of eerst kennismaken met onze aanpak?
        <br />
        Wij denken graag mee.
      </p>
      <div className="sz-contact-grid">
        <div className="sz-contact-paneel">
          <p className="sz-contact-label">Bezoek &amp; contact</p>
          <div className="sz-contact-adres">
            <a
              href="https://maps.google.com/?q=Graze+Weitje+22,+3077+BM+Rotterdam"
              target="_blank"
              rel="noopener"
              aria-label="Open adres in kaarten-app"
              title="Route plannen"
              className="sz-ring"
            >
              <MapPin stroke="#d3a142" width={19} />
            </a>
            <p>
              Graze Weitje 22
              <br />
              3077 BM Rotterdam
            </p>
          </div>
          <div className="sz-contact-knoppen">
            <a
              href="tel:+31628873094"
              aria-label="Bel 06 28873094"
              title="Bel ons"
              className="sz-rond-goud"
            >
              <Phone stroke="#0d2028" width={19} />
            </a>
            <a
              href="mailto:hallo@sterkzorgzaam.nl"
              aria-label="Mail hallo@sterkzorgzaam.nl"
              title="Mail ons"
              className="sz-rond-goud"
            >
              <Mail stroke="#0d2028" width={19} />
            </a>
            <span>Bellen of mailen — wij reageren snel.</span>
          </div>
          <div className="sz-socials">
            <span>Volg ons</span>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className="sz-social"
            >
              <Instagram stroke="#e8bd65" width={17} />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              className="sz-social"
            >
              <Facebook stroke="#e8bd65" width={17} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn"
              className="sz-social"
            >
              <LinkedIn stroke="#e8bd65" width={17} />
            </a>
          </div>
        </div>
        <div id="contact-map" className="sz-kaart" ref={kaart} />
      </div>
    </section>
  );
}
