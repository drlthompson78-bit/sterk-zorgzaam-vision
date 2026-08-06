import { useEffect, useRef, useState } from "react";
import { ArrowRight, Close, Mail, Phone } from "../site/icons";

type Persoon = {
  id: "miriam" | "giovanni";
  naam: string;
  rol: string;
  lead: string;
  belLabel: string;
  intro: string;
  qa: { vraag: string; antwoord: string }[];
};

const PERSONEN: Persoon[] = [
  {
    id: "miriam",
    naam: "Miriam Twilt-Mendonça",
    rol: "Directie — Kwaliteit & Procesbewaking",
    lead: "Miriam bewaakt kwaliteit, verbindt mensen en processen en houdt de menselijke maat centraal.",
    belLabel: "Geef Miriam een belletje",
    intro:
      "Goede ondersteuning vraagt om aandacht, duidelijke afspraken en processen die werken. Miriam zorgt dat jongeren binnen Samen Sterk en Zorgzaam passende en verantwoorde begeleiding krijgen. Daarbij put ze uit haar ervaring in het onderwijs en verschillende directierollen binnen justitie.",
    qa: [
      {
        vraag: "Hoe zorg jij dat jongeren weer perspectief krijgen?",
        antwoord:
          "“Ik begin met luisteren naar het verhaal achter het gedrag. Wat speelt er, wat heeft iemand nodig en waar liggen nog mogelijkheden? Vanuit vertrouwen werken we samen aan structuur, zelfvertrouwen en een richting die echt bij de jongere past.”",
      },
      {
        vraag: "Hoe bewaak jij de kwaliteit van de ondersteuning?",
        antwoord:
          "“Kwaliteit zit voor mij niet alleen in protocollen, maar vooral in het dagelijks handelen. Zijn afspraken duidelijk, werken professionals zorgvuldig en leren we van de praktijk? Processen moeten houvast bieden zonder dat we de jongere uit het oog verliezen.”",
      },
      {
        vraag: "Wat neem jij mee uit je eerdere directierollen?",
        antwoord:
          "“Mijn ervaring in het onderwijs en binnen justitie heeft mij geleerd hoe belangrijk het is om vroeg aanwezig te zijn. Door verschillende leefwerelden te begrijpen en professioneel én cultuursensitief te handelen, ontstaat ruimte voor vertrouwen en verandering.”",
      },
    ],
  },
  {
    id: "giovanni",
    naam: "Giovanni Peters",
    rol: "Oprichter & Operationeel Directeur",
    lead: "Giovanni maakt contact, brengt mensen in beweging en vertaalt vertrouwen naar vooruitgang.",
    belLabel: "Geef Giovanni een belletje",
    intro:
      "Giovanni is een praktijkman die gelooft dat echte ondersteuning begint met een oprechte klik. Na zijn werk als treinmachinist en personal trainer maakte hij de overstap naar de zorg. Binnen Samen Sterk en Zorgzaam verbindt hij sport, coaching en dagelijkse begeleiding.",
    qa: [
      {
        vraag: "Waarom heb jij de overstap naar de zorg gemaakt?",
        antwoord:
          "“Als personal trainer merkte ik dat bewegen vaak de deur opent naar een persoonlijk gesprek. Mensen vertellen tijdens het sporten soms dingen die anders onbesproken blijven. Ik wilde die verbinding inzetten om jongeren verder te helpen en blijvende verandering mogelijk te maken.”",
      },
      {
        vraag: "Welke rol speelt sport binnen jullie begeleiding?",
        antwoord:
          "“Sport helpt om zonder veel woorden contact te maken. Je werkt samen, leert omgaan met grenzen en ervaart wat doorzetten oplevert. Die eerste klik is ontzettend belangrijk. Vanuit dat vertrouwen kun je praten over wat er werkelijk speelt en werken aan perspectief.”",
      },
      {
        vraag: "Wat drijft jou persoonlijk in dit werk?",
        antwoord:
          "“Ik ben vader van een tweeling die nu zelf hun eerste stappen in de zorg zetten. Dat maakt mij extra bewust van wat jongeren nodig hebben: iemand die luistert, duidelijk is en blijft staan. Precies dat willen we iedere jongere meegeven.”",
      },
    ],
  },
];

const TILTS = ["sz-tilt-a", "sz-tilt-b", "sz-tilt-c"];

function Interview({
  persoon,
  open,
  onSluiten,
}: {
  persoon: Persoon;
  open: boolean;
  onSluiten: () => void;
}) {
  const links = persoon.id === "giovanni";
  const paneel = useRef<HTMLDivElement>(null);

  /* Altijd bovenaan het gesprek beginnen. */
  useEffect(() => {
    if (open && paneel.current) paneel.current.scrollTop = 0;
  }, [open]);

  return (
    <div
      ref={paneel}
      className={`sz-interview sz-interview--${persoon.id}${open ? " is-open" : ""}`}
      aria-hidden={!open}
      role="dialog"
      aria-label={persoon.naam}
    >
      <button type="button" className="sz-interview-sluit" aria-label="Sluiten" onClick={onSluiten}>
        <Close stroke="#e8bd65" width={16} />
      </button>
      <p className="sz-interview-rol">{persoon.rol}</p>
      <h3>{persoon.naam}</h3>
      <div className="sz-interview-grid">
        <div className="sz-interview-links">
          <h4>{persoon.lead}</h4>
          <div className="sz-contactkaartjes">
            <a href="tel:+31628873094" className="sz-contactkaartje">
              <span>
                <b>{persoon.belLabel}</b>
                <i>06 288 730 94</i>
              </span>
              <Phone stroke="#8a6420" width={20} />
            </a>
            <a href="mailto:hallo@sterkzorgzaam.nl" className="sz-contactkaartje">
              <span>
                <b>Of stuur een mail</b>
                <i>hallo@sterkzorgzaam.nl</i>
              </span>
              <Mail stroke="#8a6420" width={20} />
            </a>
          </div>
        </div>
        <div className="sz-interview-rechts">
          <p>{persoon.intro}</p>
          {persoon.qa.map((item, i) => (
            <div
              key={item.vraag}
              className={`sz-qa ${(i % 2 === 0) === links ? "sz-qa--r" : "sz-qa--l"}`}
            >
              <span className="sz-vraag">{item.vraag}</span>
              <div className={`sz-antwoord ${TILTS[i]}`}>
                <p>{item.antwoord}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MOBIEL = "(max-width: 780px)";

export function Oprichters() {
  const [interview, setInterview] = useState<"miriam" | "giovanni" | null>(null);

  const openen = (id: "miriam" | "giovanni") => {
    setInterview(id);
    if (window.matchMedia(MOBIEL).matches) return; // paneel vult daar het scherm
    const sec = document.getElementById("oprichters");
    if (sec) window.scrollTo({ top: sec.offsetTop - 70, behavior: "smooth" });
  };

  /* Op mobiel het paneel als dialoog behandelen: pagina eronder niet meescrollen,
     Escape sluit. */
  useEffect(() => {
    if (!interview) return;
    const opMobiel = window.matchMedia(MOBIEL).matches;
    const vorige = document.body.style.overflow;
    if (opMobiel) document.body.style.overflow = "hidden";
    const opToets = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInterview(null);
    };
    window.addEventListener("keydown", opToets);
    return () => {
      document.body.style.overflow = vorige;
      window.removeEventListener("keydown", opToets);
    };
  }, [interview]);

  return (
    <section id="oprichters" className="sz-section sz-oprichters" aria-labelledby="founders-title">
      <img src="/assets/oprichters.jpg" alt="Miriam Twilt-Mendonça en Giovanni Peters" />
      <div className="sz-oprichters-veil" aria-hidden="true" />
      <header>
        <p>Oprichters</p>
        <h2 id="founders-title">
          Twee perspectieven.
          <br />
          Eén betrokken missie.
        </h2>
      </header>

      {PERSONEN.map((persoon) => (
        <div key={persoon.id} className={`sz-badge sz-badge--${persoon.id}`}>
          <h3>{persoon.naam}</h3>
          <button type="button" onClick={() => openen(persoon.id)}>
            Maak kennis <ArrowRight stroke="#e8bd65" width={14} />
          </button>
        </div>
      ))}

      {PERSONEN.map((persoon) => (
        <Interview
          key={persoon.id}
          persoon={persoon}
          open={interview === persoon.id}
          onSluiten={() => setInterview(null)}
        />
      ))}
    </section>
  );
}
