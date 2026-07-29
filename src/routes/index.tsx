import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, Menu, X } from "lucide-react";
import heroImage from "@/assets/hero-youth.jpg";
import logoImg from "@/assets/logo.svg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sterk & Zorgzaam — Jeugdbegeleiding 12–18" },
      {
        name: "description",
        content:
          "Cultuursensitieve, relationele en praktijkgerichte begeleiding voor jongeren die vastlopen in gedrag, ontwikkeling of omgeving.",
      },
    ],
  }),
});

const pillars = [
  {
    number: "01",
    title: "Cultuursensitief & relationeel",
    body: "Aansluiten bij de leefwereld, straattaal en sociale dynamiek. Vertrouwen, herkenning en geloofwaardigheid staan centraal — jongeren benaderen vanuit potentieel.",
  },
  {
    number: "02",
    title: "Systemisch werken",
    body: "Actieve betrokkenheid van ouders en netwerk. Aandacht voor veiligheid, structuur en het versterken van opvoedvaardigheden binnen het hele systeem.",
  },
  {
    number: "03",
    title: "Executieve functies versterken",
    body: "Impulscontrole, emotieregulatie, plannen, concentratie, zelfreflectie en verantwoordelijkheid — de basis voor blijvende gedragsverandering.",
  },
  {
    number: "04",
    title: "Praktijkgerichte interventies",
    body: "Persoonlijke begeleiding, dagbesteding, leerwerktrajecten en talentontwikkeling — waar passend aangevuld met cognitieve gedragsbehandeling.",
  },
];

const exclusions = [
  {
    number: "01",
    title: "Wettelijk dwingend kader",
    body: "Wvggz / Wzd, gesloten plaatsing of verplichte opname — wij werken vanuit vrijwilligheid en eigen regie.",
  },
  {
    number: "02",
    title: "Acute psychiatrische nood",
    body: "Bij ernstige ontregeling of suïcidaliteit is specialistische GGZ of klinische behandeling vereist.",
  },
  {
    number: "03",
    title: "Ernstige verslavingsproblematiek",
    body: "Wanneer detox of medische stabilisatie eerst noodzakelijk is, zijn wij niet de passende eerste interventie.",
  },
  {
    number: "04",
    title: "Ernstige veiligheidsrisico's",
    body: "Structureel onbeheersbare agressie of voortdurende fysieke risico's overstijgen de veilige uitvoerbaarheid.",
  },
  {
    number: "05",
    title: "Volledige zorgweigering",
    body: "Onze aanpak vraagt minimale bereidheid tot contact. Zonder dat ontbreekt de basis voor een traject.",
  },
];

const audience = [
  "Jongeren van 12 t/m 18 jaar",
  "Gedragsproblematiek of risico op uitval",
  "Schurend tegen forensische of criminele problematiek",
  "Beperkte motivatie richting hulpverlening",
  "Complexe systeem- of gezinsproblematiek",
];

const difference = [
  "Sterk relationele en cultuursensitieve aanpak",
  "Verbinding en vertrouwen als vertrekpunt",
  "Intensieve aandacht voor het systeem rondom de jongere",
  "Focus op executieve functies als basis",
  "Maatwerk in plaats van standaardtrajecten",
  "Bereiken van jongeren met weerstand tegen reguliere zorg",
];

const founders = [
  {
    initials: "MT",
    name: "Miriam Twilt-Mendonça",
    expertise: "Bestuur & ontwikkeling",
    bio: "Brengt ruime ervaring mee vanuit leiderschap, organisatieontwikkeling, onderwijs en het veiligheidsdomein.",
  },
  {
    initials: "GP",
    name: "Giovanni Peters",
    expertise: "Praktijk & begeleiding",
    bio: "Brengt brede praktijkervaring mee in het begeleiden van jongeren met complexe gedrags- en ontwikkelingsproblematiek.",
  },
];

function TextLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <a className={`text-link${light ? " text-link--light" : ""}`} href={href}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

function Index() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Sterk & Zorgzaam startpagina">
          <img src={logoImg} alt="Sterk & Zorgzaam" />
        </a>

        <nav className="desktop-nav" aria-label="Hoofdnavigatie">
          <a href="#missie">Missie</a>
          <a href="#aanpak">Aanpak</a>
          <a href="#doelgroep">Doelgroep</a>
          <a href="#oprichters">Oprichters</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="header-cta" href="#contact">
          <span>Aan de slag</span>
          <ArrowRight aria-hidden="true" />
        </a>

        <details className="mobile-menu">
          <summary aria-label="Menu openen">
            <Menu aria-hidden="true" />
          </summary>
          <nav aria-label="Mobiele navigatie">
            <a href="#missie">Missie</a>
            <a href="#aanpak">Aanpak</a>
            <a href="#doelgroep">Doelgroep</a>
            <a href="#oprichters">Oprichters</a>
            <a href="#contact">Contact</a>
          </nav>
        </details>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="hero-kicker">Jeugdbegeleiding / 12—18 jaar</div>
          <h1 id="hero-title">
            Kleine <em>stapjes</em>
            <br />
            zijn ook stappen
          </h1>
          <p>
            Sterk &amp; Zorgzaam ondersteunt jongeren die vastlopen in gedrag, ontwikkeling of
            omgeving. Gericht op duurzaam perspectief.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#contact">
              Kennismaken <ArrowRight aria-hidden="true" />
            </a>
            <TextLink href="#aanpak" light>
              Onze aanpak
            </TextLink>
          </div>
          <span className="hero-index" aria-hidden="true">
            01
          </span>
        </div>
        <figure className="hero-visual">
          <img
            src={heroImage}
            alt="Een diverse groep jongeren samen in de stad"
            fetchPriority="high"
          />
          <figcaption>
            Verbinding. Vertrouwen.
            <br />
            Vooruitgang.
          </figcaption>
        </figure>
      </section>

      <section className="manifesto" id="missie" aria-labelledby="mission-title">
        <div className="portrait-slice" aria-hidden="true">
          <img src={heroImage} alt="" />
          <span>De leefwereld als vertrekpunt</span>
        </div>

        <div className="manifesto-copy">
          <p className="eyebrow">01 / Missie</p>
          <h2 id="mission-title">
            De mens achter
            <br />
            het gedrag
          </h2>
          <p className="lead">
            Wij ondersteunen jongeren van 12 tot 18 jaar die risico lopen op maatschappelijke of
            forensische ontsporing.
          </p>
          <p>
            Vanuit een cultuursensitieve, relationele en praktijkgerichte aanpak helpen wij hen om
            opnieuw perspectief, structuur en richting te ontwikkelen.
          </p>
        </div>

        <div className="vision">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <blockquote>Verbinding vóór interventie.</blockquote>
          <ul>
            {[
              "Vertrouwen opent de deur naar verandering.",
              "Cultuur en leefwereld zijn onderdeel van de begeleiding.",
              "Duurzame ontwikkeling versterkt het hele systeem.",
              "Iedere jongere bezit talent en ontwikkelmogelijkheden.",
            ].map((item) => (
              <li key={item}>
                <Check aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="approach" id="aanpak" aria-labelledby="approach-title">
        <header className="section-heading">
          <p className="eyebrow">02 / Onze aanpak</p>
          <h2 id="approach-title">
            Vier pijlers.
            <br />
            Eén beweging vooruit.
          </h2>
          <p>
            Geen standaardtraject, maar begeleiding die aansluit op de jongere en de wereld om hen
            heen.
          </p>
        </header>

        <div className="pillar-list">
          {pillars.map((pillar) => (
            <article className="pillar" key={pillar.number}>
              <span>{pillar.number}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
              <ArrowUpRight aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="audience" id="doelgroep" aria-labelledby="audience-title">
        <div className="audience-intro">
          <p className="eyebrow eyebrow--light">03 / Voor wie</p>
          <h2 id="audience-title">
            Er zijn als het
            <br />
            schuurt.
          </h2>
          <p>
            Juist wanneer reguliere zorg geen aansluiting vindt, zoeken wij naar het contact dat
            verandering mogelijk maakt.
          </p>
        </div>

        <div className="audience-columns">
          <div>
            <h3>Onze doelgroep</h3>
            <ol>
              {audience.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3>Wat ons onderscheidt</h3>
            <ol>
              {difference.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="boundaries" aria-labelledby="boundaries-title">
        <header>
          <p className="eyebrow">04 / Heldere grenzen</p>
          <h2 id="boundaries-title">Wanneer wij niet de juiste match zijn</h2>
          <p>
            Goede zorg begint ook bij weten wanneer specialistische of klinische ondersteuning
            passender is.
          </p>
        </header>
        <div className="boundary-list">
          {exclusions.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <X aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="founders" id="oprichters" aria-labelledby="founders-title">
        <header className="section-heading">
          <p className="eyebrow">05 / Oprichters</p>
          <h2 id="founders-title">
            Twee perspectieven.
            <br />
            Eén betrokken missie.
          </h2>
        </header>

        <div className="founder-list">
          {founders.map((founder) => (
            <article key={founder.name}>
              <span className="founder-initials">{founder.initials}</span>
              <div>
                <p>{founder.expertise}</p>
                <h3>{founder.name}</h3>
                <span>{founder.bio}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <span className="contact-label">Een eerste kleine stap</span>
        <h2 id="contact-title">
          Samen werken aan
          <br />
          duurzaam <em>perspectief.</em>
        </h2>
        <p>
          Een jongere aanmelden of eerst kennismaken met onze aanpak?
          <br />
          Wij denken graag mee.
        </p>
        <a href="mailto:info@sterkzorgzaam.nl">
          <span>info@sterkzorgzaam.nl</span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </section>

      <footer>
        <img src={logoImg} alt="Sterk & Zorgzaam" />
        <p>Jeugdbegeleiding / 12—18 jaar</p>
        <p>© {new Date().getFullYear()} Sterk &amp; Zorgzaam</p>
      </footer>
    </main>
  );
}
