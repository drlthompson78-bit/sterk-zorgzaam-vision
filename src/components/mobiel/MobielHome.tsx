import { useEffect, useRef, useState } from "react";
import { FadeLink } from "@/components/site/nav";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Close,
  Facebook,
  Instagram,
  LinkedIn,
  Mail,
  MapPin,
  Phone,
} from "@/components/site/icons";
import { MobielActiebalk, MobielChroom, useVoorbijHero } from "./Chroom";

const PIJLERS = [
  {
    kaart: "Cultuursensitief werken",
    src: "/assets/pijler-1.jpg",
    titel: "Cultuursensitief en relationeel werken",
    tekst:
      "De leefwereld van de jongere is ons vertrekpunt: taal, straatcultuur, sociale codes, groepsdruk en loyaliteit. Door die werkelijkheid serieus te nemen ontstaat herkenning — en ruimte om te sturen.",
    punten: [
      "Aansluiten bij de leefwereld en de taal van de jongere.",
      "Denken vanuit potentieel, niet vanuit het dossier.",
      "Presentie en nabijheid op de momenten die tellen.",
    ],
  },
  {
    kaart: "Systemisch werken",
    src: "/assets/pijler-2.jpg",
    titel: "Systemisch werken en netwerkversterking",
    tekst:
      "Een jongere ontwikkelt zich nooit los van de omgeving. Wij betrekken vanaf dag één ouders, school, netwerk en betrokken professionals.",
    punten: [
      "Gezinsdynamiek: patronen doorbreken, communicatie herstellen.",
      "Veiligheid en structuur: duidelijke kaders en de-escalatie.",
      "Een dragend netwerk voor borging na de begeleiding.",
    ],
  },
  {
    kaart: "Executieve functies",
    src: "/assets/pijler-3.jpg",
    titel: "Executieve functies versterken",
    tekst:
      "Achter 'onwil' zit vaak een achterstand in de vaardigheden om gedrag, gedachten en emoties te sturen. Die maken wij concreet en oefenen we in het dagelijks leven.",
    punten: [
      "Impulscontrole en emotieregulatie: pauzeren vóór escalatie.",
      "Plannen en uitvoeren: structuur, prioriteiten, afmaken.",
      "Zelfreflectie en eigenaarschap zonder schuld of schaamte.",
    ],
  },
  {
    kaart: "Praktijkgericht leren",
    src: "/assets/pijler-4.jpg",
    titel: "Praktijkgerichte interventies en talent",
    tekst:
      "Veel jongeren leren makkelijker in beweging dan aan tafel. We verbinden gesprekken aan doen, ervaren en oefenen — waar passend met principes uit de CGT.",
    punten: [
      "Fase 1 — Stabilisatie: rust, ritme en veiligheid.",
      "Fase 2 — Talent: interesses, sport, leertrajecten.",
      "Fase 3 — Leren en werken: onderwijs, BBL of werk.",
    ],
  },
];

const MISSIE_PUNTEN = [
  "Vertrouwen opent de deur naar verandering.",
  "Cultuur en leefwereld horen bij de begeleiding.",
  "Duurzame ontwikkeling versterkt het hele systeem.",
  "Iedere jongere bezit talent en mogelijkheden.",
];

const DOELGROEP = [
  {
    titel: "Verbinding eerst",
    tekst: "Vertrouwen en herkenning zijn het vertrekpunt, niet de interventie.",
  },
  {
    titel: "Het hele systeem",
    tekst: "Intensieve aandacht voor ouders, netwerk en de vaardigheden die gedrag dragen.",
  },
  {
    titel: "Maatwerk, geen traject",
    tekst: "Wij bereiken jongeren die zijn afgehaakt bij reguliere zorg.",
  },
];

const GEEN_MATCH = [
  {
    titel: "Wettelijk dwingend kader",
    tekst:
      "Wvggz / Wzd, gesloten plaatsing of verplichte opname — wij werken vanuit vrijwilligheid en eigen regie.",
  },
  {
    titel: "Acute psychiatrische nood",
    tekst:
      "Bij ernstige ontregeling of suïcidaliteit is specialistische GGZ of klinische behandeling vereist.",
  },
  {
    titel: "Ernstige verslavingsproblematiek",
    tekst:
      "Wanneer detox of medische stabilisatie eerst noodzakelijk is, zijn wij niet de passende eerste interventie.",
  },
  {
    titel: "Ernstige veiligheidsrisico's",
    tekst:
      "Structureel onbeheersbare agressie of voortdurende fysieke risico's overstijgen de veilige uitvoerbaarheid.",
  },
  {
    titel: "Volledige zorgweigering",
    tekst:
      "Onze aanpak vraagt minimale bereidheid tot contact. Zonder dat ontbreekt de basis voor een traject.",
  },
];

type Persoon = {
  id: "miriam" | "giovanni";
  rol: string;
  naam: string;
  kern: string;
  intro: string;
  belLabel: string;
  gesprek: { vraag: string; antwoord: string }[];
};

const PERSONEN: Persoon[] = [
  {
    id: "miriam",
    rol: "Directie — Kwaliteit & Procesbewaking",
    naam: "Miriam Twilt-Mendonça",
    kern: "Miriam bewaakt kwaliteit, verbindt mensen en processen en houdt de menselijke maat centraal.",
    intro:
      "Goede ondersteuning vraagt om aandacht, duidelijke afspraken en processen die werken. Miriam zorgt dat jongeren binnen Samen Sterk en Zorgzaam passende en verantwoorde begeleiding krijgen. Daarbij put ze uit haar ervaring in het onderwijs en verschillende directierollen binnen justitie.",
    belLabel: "Geef Miriam een belletje",
    gesprek: [
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
    rol: "Oprichter & Operationeel Directeur",
    naam: "Giovanni Peters",
    kern: "Giovanni maakt contact, brengt mensen in beweging en vertaalt vertrouwen naar vooruitgang.",
    intro:
      "Giovanni is een praktijkman die gelooft dat echte ondersteuning begint met een oprechte klik. Na zijn werk als treinmachinist en personal trainer maakte hij de overstap naar de zorg. Binnen Samen Sterk en Zorgzaam verbindt hij sport, coaching en dagelijkse begeleiding.",
    belLabel: "Geef Giovanni een belletje",
    gesprek: [
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

function Interview({
  persoon,
  open,
  onSluiten,
}: {
  persoon: Persoon;
  open: boolean;
  onSluiten: () => void;
}) {
  const paneel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && paneel.current) paneel.current.scrollTop = 0;
  }, [open]);

  return (
    <div
      ref={paneel}
      className={`mz-interview${open ? " is-open" : ""}`}
      aria-hidden={!open}
      role="dialog"
      aria-label={persoon.naam}
    >
      <div className="mz-paneel-kop">
        <span className="mz-paneel-label">Maak kennis</span>
        <button type="button" onClick={onSluiten} aria-label="Sluiten" className="mz-paneel-sluit">
          <Close stroke="#e8bd65" width={16} />
        </button>
      </div>
      <p className="mz-interview-rol">{persoon.rol}</p>
      <h3>{persoon.naam}</h3>
      <p className="mz-interview-kern">{persoon.kern}</p>
      <p className="mz-interview-intro">{persoon.intro}</p>

      <div className="mz-contactkaartjes">
        <a href="tel:+31628873094">
          <span>
            <b>{persoon.belLabel}</b>
            <i>06 288 730 94</i>
          </span>
          <Phone stroke="#8a6420" width={19} />
        </a>
        <a href="mailto:info@sterkzorgzaam.nl">
          <span>
            <b>Of stuur een mail</b>
            <i>info@sterkzorgzaam.nl</i>
          </span>
          <Mail stroke="#8a6420" width={19} />
        </a>
      </div>

      <div className="mz-gesprek">
        {persoon.gesprek.map((qa) => (
          <div key={qa.vraag} className="mz-qa">
            <span className="mz-vraag">{qa.vraag}</span>
            <div className="mz-antwoord">
              <span aria-hidden="true" className="mz-quote">
                “
              </span>
              <p>{qa.antwoord}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobielHome() {
  const [brief, setBrief] = useState(false);
  const [credo, setCredo] = useState(false);
  const [pijler, setPijler] = useState(0);
  const [acc, setAcc] = useState(-1);
  const [interview, setInterview] = useState<"miriam" | "giovanni" | null>(null);
  const voorbijHero = useVoorbijHero("m-top");
  const spoor = useRef<HTMLDivElement>(null);

  /* Interview is een volledig scherm: pagina eronder op slot, Escape sluit. */
  useEffect(() => {
    if (!interview) return;
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opToets = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInterview(null);
    };
    window.addEventListener("keydown", opToets);
    return () => {
      document.body.style.overflow = vorige;
      window.removeEventListener("keydown", opToets);
    };
  }, [interview]);

  /* Meelopen met vegen: de kaart in het midden wordt de actieve pijler. */
  const opScroll = () => {
    const baan = spoor.current;
    if (!baan) return;
    const midden = baan.scrollLeft + baan.clientWidth / 2;
    let dichtst = 0;
    let besteAfstand = Infinity;
    Array.from(baan.children).forEach((kind, i) => {
      const el = kind as HTMLElement;
      const kaartMidden = el.offsetLeft + el.offsetWidth / 2;
      const afstand = Math.abs(kaartMidden - midden);
      if (afstand < besteAfstand) {
        besteAfstand = afstand;
        dichtst = i;
      }
    });
    setPijler(dichtst);
  };

  const kiesPijler = (i: number) => {
    setPijler(i);
    const baan = spoor.current;
    const kaart = baan?.children[i] as HTMLElement | undefined;
    if (baan && kaart) {
      baan.scrollTo({
        left: kaart.offsetLeft - (baan.clientWidth - kaart.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  const p = PIJLERS[pijler];

  return (
    <div className="mz-root">
      <MobielChroom />

      <section id="m-top" className="mz-hero">
        <img src="/assets/hero-youth.jpg" alt="" />
        <span className="mz-hero-sluier" aria-hidden="true" />
        <div className="mz-hero-tekst">
          <h1>
            Kleine <em>stapjes</em> zijn ook stappen
          </h1>
          <p>Voor jongeren die vastlopen in gedrag, ontwikkeling of omgeving.</p>
          <div className="mz-hero-acties">
            <FadeLink to="/aanmelden" className="mz-hero-cta">
              Aanmelden
              <ArrowRight stroke="currentColor" width={16} />
            </FadeLink>
            <a href="tel:+31628873094" aria-label="Bel ons" className="mz-hero-bel">
              <Phone stroke="#e8bd65" width={20} />
            </a>
          </div>
        </div>
      </section>

      <section id="m-brief" className="mz-brief">
        <p className="mz-brief-kop">Vooruitgang begint zelden met een grote stap.</p>
        <div className={`mz-uitklap${brief ? " is-open" : ""}`}>
          <div className="mz-brief-tekst">
            <p>
              <span className="mz-dropcap">S</span>oms begint verandering met opendoen wanneer we
              aanbellen. Met toch verschijnen bij een afspraak. Met een eerlijk antwoord, een eerste
              dag terug op school of één moment waarop een jongere besluit het anders te proberen.
            </p>
            <p>
              Voor de jongeren die wij begeleiden, zijn zulke stappen niet vanzelfsprekend. Zij
              hebben weinig vertrouwen in hulpverlening en lopen vast in hun gedrag, motivatie of
              thuissituatie.
            </p>
            <p>
              We beginnen met contact. Met luisteren naar het verhaal achter het gedrag. We bieden
              duidelijkheid en grenzen, maar verliezen de mogelijkheden van een jongere nooit uit
              het oog.
            </p>
            <blockquote>
              Een klein stapje lijkt misschien weinig. Voor een jongere die lang heeft stilgestaan,
              kan het alles betekenen.
            </blockquote>
            <p>
              Daarom kijken we niet alleen naar waar een jongere nu staat, maar vooral naar waar
              diegene naartoe kan.
            </p>
            <p className="mz-brief-slot">Kleine stapjes zijn ook stappen.</p>
            <p className="mz-handtekening">
              Miriam <span>&</span> Giovanni
            </p>
            <p className="mz-brief-functie">Oprichters en directie</p>
          </div>
        </div>
        <button
          type="button"
          className="mz-meer"
          onClick={() => setBrief((v) => !v)}
          aria-expanded={brief}
        >
          {brief ? "Minder lezen" : "Lees verder"}
          <ChevronDown
            stroke="#d3a142"
            width={13}
            style={{ transform: brief ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      </section>

      <section id="m-missie" className="mz-missie">
        <p className="mz-eyebrow">Missie</p>
        <h2>De mens achter het gedrag</h2>
        <p className="mz-lead">
          Wij ondersteunen jongeren die risico lopen op maatschappelijke of forensische ontsporing —
          cultuursensitief, relationeel en praktijkgericht.
        </p>
        <div className="mz-missiekaart">
          <p className="mz-missiekaart-kop">Verbinding vóór interventie.</p>
          <div className="mz-checklist">
            {MISSIE_PUNTEN.map((punt) => (
              <div key={punt}>
                <Check stroke="#d3a142" width={14} />
                <span>{punt}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`mz-uitklap${credo ? " is-open" : ""}`}>
          <div className="mz-credo">
            <p className="mz-credo-vraag">
              Heb je wel eens stilgestaan bij wat er écht schuilgaat achter opstandig of onbegrepen
              gedrag?
            </p>
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
            <p className="mz-credo-slot">
              Wij zijn Samen <em>Sterk</em> en <em>Zorgzaam</em>.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="mz-meer"
          onClick={() => setCredo((v) => !v)}
          aria-expanded={credo}
        >
          {credo ? "Minder lezen" : "Onze overtuiging"}
          <ChevronDown
            stroke="#d3a142"
            width={13}
            style={{ transform: credo ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      </section>

      <section id="m-aanpak" className="mz-aanpak">
        <div className="mz-aanpak-kop">
          <p className="mz-eyebrow">Onze aanpak</p>
          <p className="mz-aanpak-hint">Veeg door de pijlers en tik voor de toelichting.</p>
        </div>
        <div className="mz-spoor" ref={spoor} onScroll={opScroll}>
          {PIJLERS.map((item, i) => (
            <button
              key={item.kaart}
              type="button"
              className={`mz-pijlerkaart${pijler === i ? " is-actief" : ""}`}
              onClick={() => kiesPijler(i)}
              aria-pressed={pijler === i}
            >
              <img src={item.src} alt="" />
              <span className="mz-pijler-sluier" aria-hidden="true" />
              <span className="mz-pijler-titel">{item.kaart}</span>
            </button>
          ))}
        </div>
        <div className="mz-stippen" aria-hidden="true">
          {PIJLERS.map((item, i) => (
            <span key={item.kaart} className={pijler === i ? "is-actief" : ""} />
          ))}
        </div>
        <div className="mz-pijlerdetail">
          <p className="mz-pijlerdetail-titel">{p.titel}</p>
          <p className="mz-pijlerdetail-tekst">{p.tekst}</p>
          <div className="mz-pijlerpunten">
            {p.punten.map((punt, i) => (
              <div key={punt}>
                <span>{`0${i + 1}`}</span>
                <span>{punt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="m-doelgroep" className="mz-doelgroep">
        <h2>Er zijn als het schuurt</h2>
        <figure>
          <img src="/assets/doelgroep-bankje.jpg" alt="Jongeren op een bankje" />
        </figure>
        <p className="mz-doelgroep-lead">
          Juist wanneer reguliere zorg geen aansluiting vindt, zoeken wij naar het contact dat
          verandering mogelijk maakt.
        </p>
        <div className="mz-doelgroepkaarten">
          {DOELGROEP.map((item) => (
            <div key={item.titel}>
              <p>{item.titel}</p>
              <p>{item.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="m-geenmatch" className="mz-geenmatch">
        <h2>Wanneer wij niet de juiste match zijn</h2>
        <div className="mz-accordeon">
          {GEEN_MATCH.map((item, i) => (
            <div key={item.titel} className="mz-accrij">
              <button
                type="button"
                onClick={() => setAcc(acc === i ? -1 : i)}
                aria-expanded={acc === i}
              >
                <span>{item.titel}</span>
                <ChevronDown
                  stroke="#d3a142"
                  width={14}
                  style={{ transform: acc === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              <div className={`mz-accpaneel${acc === i ? " is-open" : ""}`}>
                <p>{item.tekst}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="m-oprichters" className="mz-oprichters">
        <p className="mz-eyebrow">Oprichters</p>
        <h2>
          Twee perspectieven.
          <br />
          Eén betrokken missie.
        </h2>
        <figure>
          <img src="/assets/oprichters.jpg" alt="Miriam Twilt-Mendonça en Giovanni Peters" />
          <span className="mz-oprichters-sluier" aria-hidden="true" />
          <figcaption>
            {PERSONEN.map((persoon) => (
              <button key={persoon.id} type="button" onClick={() => setInterview(persoon.id)}>
                <span className="mz-oprichter-naam">
                  {persoon.naam.split(" ")[0]}
                  <br />
                  {persoon.naam.split(" ").slice(1).join(" ")}
                </span>
                <span className="mz-oprichter-cta">
                  Maak kennis <ArrowRight stroke="#e8bd65" width={12} />
                </span>
              </button>
            ))}
          </figcaption>
        </figure>
      </section>

      {PERSONEN.map((persoon) => (
        <Interview
          key={persoon.id}
          persoon={persoon}
          open={interview === persoon.id}
          onSluiten={() => setInterview(null)}
        />
      ))}

      <section id="m-contact" className="mz-contact">
        <p className="mz-eyebrow mz-eyebrow--goud">Contact</p>
        <h2>
          Samen werken aan duurzaam <em>perspectief</em>
        </h2>
        <div className="mz-contacttegels">
          <a href="tel:+31628873094">
            <Phone stroke="#d3a142" width={22} />
            <span>Bellen</span>
          </a>
          <a href="mailto:info@sterkzorgzaam.nl">
            <Mail stroke="#d3a142" width={22} />
            <span>Mailen</span>
          </a>
          <a
            href="https://maps.apple.com/?q=Graze+Weitje+22,+3077+BM+Rotterdam"
            target="_blank"
            rel="noopener"
          >
            <MapPin stroke="#d3a142" width={22} />
            <span>Route</span>
          </a>
        </div>
        <div className="mz-adreskaart">
          <p>
            Graze Weitje 22
            <br />
            3077 BM Rotterdam
          </p>
          <p>Aanmelden of eerst kennismaken? Wij denken graag mee.</p>
        </div>
        <div className="mz-socials">
          <a href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
            <Instagram stroke="#e8bd65" width={18} />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
            <Facebook stroke="#e8bd65" width={18} />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn">
            <LinkedIn stroke="#e8bd65" width={18} />
          </a>
        </div>
        <div className="mz-voet">
          <FadeLink to="/kwaliteit" hash="privacy">
            Privacy
          </FadeLink>
          <FadeLink to="/kwaliteit" hash="cookies">
            Cookies
          </FadeLink>
          <FadeLink to="/kwaliteit" hash="klachten">
            Klachten
          </FadeLink>
          <span>© 2026 Samen Sterk &amp; Zorgzaam B.V.</span>
        </div>
      </section>

      <MobielActiebalk zichtbaar={voorbijHero && !interview} />
    </div>
  );
}
