import { useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Check, ChevronDown } from "../site/icons";

const CHECKS = [
  "Vertrouwen opent de deur naar verandering.",
  "Cultuur en leefwereld zijn onderdeel van de begeleiding.",
  "Duurzame ontwikkeling versterkt het hele systeem.",
  "Iedere jongere bezit talent en ontwikkelmogelijkheden.",
];

export function Missie({ toonPortret = true }: { toonPortret?: boolean }) {
  const [credo, setCredo] = useState(false);
  const lijst = useRef<HTMLUListElement>(null);

  useScrollReveal(lijst, "li", 34, 1500, 450, 250);

  return (
    <section id="missie" className="sz-section sz-missie" aria-labelledby="mission-title">
      {toonPortret && (
        <div className="sz-portret" aria-hidden="true">
          <div className="sz-portret-vel sz-scheur" />
          <div className="sz-portret-foto sz-scheur">
            <img
              src="/assets/hero-youth.jpg"
              alt=""
              loading="lazy"
              decoding="async"
              width={1800}
              height={1020}
            />
          </div>
        </div>
      )}

      <div className="sz-missie-hoofd">
        <p className="sz-eyebrow">Missie</p>
        <h2 id="mission-title">
          De mens achter
          <br />
          het gedrag
        </h2>
        <p className="sz-missie-lead">
          Wij ondersteunen jongeren van 12 tot 18 jaar die risico lopen op maatschappelijke of
          forensische ontsporing.
        </p>
        <p className="sz-missie-sub">
          Vanuit een cultuursensitieve, relationele en praktijkgerichte aanpak helpen wij hen om
          opnieuw perspectief, structuur en richting te ontwikkelen.
        </p>
        <button
          type="button"
          className="sz-btn-gold sz-btn-gold--auto"
          aria-expanded={credo}
          onClick={() => setCredo((v) => !v)}
        >
          <span>Onze overtuiging</span>
          <ChevronDown className={credo ? "is-open" : undefined} width={14} />
        </button>
      </div>

      <div className="sz-citaatkolom">
        <div className="sz-citaatkader" aria-hidden="true" />
        <span className="sz-citaatmark" aria-hidden="true">
          “
        </span>
        <blockquote className="sz-citaat">Verbinding vóór interventie.</blockquote>
        <ul className="sz-checklist" ref={lijst}>
          {CHECKS.map((tekst) => (
            <li key={tekst}>
              <Check width={15} />
              <span>{tekst}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`sz-credo sz-collapse sz-collapse--credo${credo ? " is-open" : ""}`}>
        <div id="overtuiging" className="sz-tweekolom">
          <header>
            <p className="sz-eyebrow sz-eyebrow--brief">Onze overtuiging</p>
            <p className="sz-kop-md">
              Heb je wel eens stilgestaan bij wat er écht schuilgaat achter opstandig of onbegrepen
              gedrag?
            </p>
          </header>
          <div className="sz-lopend">
            <p>
              Achter elk 'moeilijk' of ingewikkeld gedrag zien wij simpelweg een jongere die
              vastloopt, zich onbegrepen voelt of de weg even kwijt is. Waar de wereld soms snel een
              oordeel klaar heeft, kijken wij verder. Gedrag is tenslotte slechts de buitenkant —
              wij richten ons altijd op de mens erachter.
            </p>
            <p>
              Echte verandering bereik je nooit alleen; verandering ontstaat pas wanneer je schouder
              aan schouder <strong>samen</strong> optrekt met de jongere, het gezin en de
              leefomgeving. Door niet boven de jongere te staan, maar echt naast hen te bewegen,
              maken we hen stap voor stap <strong>sterker</strong> in hun eigen veerkracht en
              zelfvertrouwen. Dat vraagt om een oprecht <strong>zorgzaam</strong> fundament: een
              veilige plek waar geluisterd wordt zonder oordeel, waar cultuur en achtergrond er
              mogen zijn, en waar vertrouwen de basis vormt voor een nieuwe toekomst.
            </p>
            <p>
              Want als je samen schouder aan schouder staat, jongeren vanuit hun eigen kracht
              sterker maakt en dit doet met oprechte zorg en aandacht, blijft er maar één conclusie
              over:
            </p>
            <p className="sz-credo-slot">
              Wij zijn Samen <em>Sterk</em> en <em>Zorgzaam</em>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
