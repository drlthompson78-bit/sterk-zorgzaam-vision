import { useState } from "react";
import {
  ChevronDown,
  IconFocus,
  IconPraktijk,
  IconSysteem,
  IconVerbinding,
  Paperclip,
} from "../site/icons";

type Blok = { titel: string; tekst: string };

type Pijler = {
  eyebrow: string;
  titel: string;
  icoon: React.ReactNode;
  foto: string;
  tilt: number;
  detail: {
    kop: string;
    alineas: string[];
    quote?: string;
    stappen?: Blok[];
    blokLabel: string;
    blokken: Blok[];
  };
};

const PIJLERS: Pijler[] = [
  {
    eyebrow: "Verbinding vóór interventie",
    titel: "Cultuursensitief werken",
    icoon: <IconVerbinding />,
    foto: "/assets/pijler-1.jpg",
    tilt: -1.6,
    detail: {
      kop: "Cultuursensitief & relationeel werken",
      alineas: [
        "Jongeren die vastlopen in traditionele hulpverleningstrajecten voelen zich vaak niet gehoord of begrepen. Binnen onze methodiek staat de leefwereld van de jongere centraal. Cultuursensitief werken gaat verder dan culturele achtergrond alleen: het omvat de straatcultuur, groepsdynamiek, taal en de ongeschreven regels waarin jongeren navigeren.",
        "Door aan te sluiten op hun frequentie bouwen we aan een fundament van intrinsiek vertrouwen. Pas als er oprechte herkenning en geloofwaardigheid is, ontstaat er ruimte voor sturing en verandering.",
      ],
      stappen: [
        {
          titel: "Betrouwbare relatie",
          tekst: "Presentie en nabijheid: er zijn op de momenten die tellen en doen wat je zegt.",
        },
        {
          titel: "Erkennen leefwereld",
          tekst: "Taal, cultuur en groepsdynamiek serieus nemen als onderdeel van de begeleiding.",
        },
        {
          titel: "Eigenaarschap & potentieel",
          tekst: "De jongere neemt zelf regie, vanuit talent in plaats van dossier.",
        },
      ],
      blokLabel: "In de praktijk",
      blokken: [
        {
          titel: "Aansluiten bij de leefwereld",
          tekst:
            "Onze professionals spreken de taal van de straat, begrijpen de sociale druk van het netwerk en herkennen signalen van status, loyaliteit en defensief gedrag.",
        },
        {
          titel: "Denken vanuit potentieel",
          tekst:
            "Wij benaderen jongeren niet vanuit hun dossier of risicoprofiel, maar vanuit hun talenten en ambities. Gedragsproblemen zien we als beschermingsmechanisme dat we samen herkaderen.",
        },
        {
          titel: "Presentie & nabijheid",
          tekst:
            "Vertrouwen groeit door er te zijn op de cruciale momenten. Geen rigide 9-tot-5 mentaliteit, maar flexibele, betrouwbare aanwezigheid op de plekken waar het telt.",
        },
      ],
    },
  },
  {
    eyebrow: "Het systeem verandert mee",
    titel: "Systemisch werken",
    icoon: <IconSysteem />,
    foto: "/assets/pijler-2.jpg",
    tilt: 0.9,
    detail: {
      kop: "Systemisch werken & netwerkversterking",
      alineas: [
        "Een jongere ontwikkelt zich nooit in een vacuüm. Gedrag is vaak een reactie op of reflectie van de dynamiek binnen het gezin, de peergroup of de directe omgeving. Eenzijdige hulpverlening gericht op alleen de jongere blijkt in de praktijk zelden duurzaam.",
        "Wij betrekken vanaf dag één het volledige systeem: ouders, verzorgers, school, wijkagent en informeel netwerk. Door opvoedvaardigheden te versterken en de veiligheid in de thuissituatie te herstellen, bouwen we aan een blijvend dragend netwerk.",
      ],
      quote:
        "Verandering bij de jongere houdt pas stand als de omgeving mee verandert. Het versterken van het systeem is de beste garantie tegen terugval.",
      blokLabel: "Methodische aanpak",
      blokken: [
        {
          titel: "Gezinsdynamiek",
          tekst:
            "Patronen doorbreken en communicatie herstellen — via systeemgesprekken en psycho-educatie voor ouders.",
        },
        {
          titel: "Veiligheid & structuur",
          tekst:
            "Duidelijke kaders en grenzen stellen — met opvoedondersteuning aan huis en de-escalatie.",
        },
        {
          titel: "Informeel netwerk",
          tekst:
            "Duurzame borging na uitstroom — door sleutelfiguren, mentoren en familie in te zetten.",
        },
      ],
    },
  },
  {
    eyebrow: "De motor van gedragsverandering",
    titel: "Executieve functies",
    icoon: <IconFocus />,
    foto: "/assets/pijler-3.jpg",
    tilt: -0.8,
    detail: {
      kop: "Executieve functies & gedragsverandering",
      alineas: [
        "Veel uitval op school, werk of binnen behandeltrajecten komt voort uit een achterstand in de ontwikkeling van executieve functies. Problemen met impulscontrole, emotieregulatie, plannen en zelfreflectie leiden tot conflicten, overprikkeling en ondoordachte besluiten.",
        "Wij richten ons op het direct trainen en versterken van deze neurocognitieve vaardigheden. Dat vormt de motor voor duurzame gedragsverandering en zelfstandigheid op lange termijn.",
      ],
      blokLabel: "Ontwikkeldomeinen",
      blokken: [
        {
          titel: "Impulscontrole & emotieregulatie",
          tekst:
            "Fysieke en mentale triggers herkennen vóór escalatie. Jongeren leren de pauzeknop in te drukken tussen prikkel en reactie.",
        },
        {
          titel: "Planning & executie",
          tekst:
            "Structuur in de dag, afspraken nakomen, prioriteiten stellen en doelen opbreken in behapbare stappen.",
        },
        {
          titel: "Zelfreflectie & eigenaarschap",
          tekst:
            "Kijken naar het eigen aandeel in situaties en verantwoordelijkheid nemen voor keuzes en consequenties.",
        },
      ],
    },
  },
  {
    eyebrow: "Leren door te doen",
    titel: "Praktijkgerichte interventies",
    icoon: <IconPraktijk />,
    foto: "/assets/pijler-4.jpg",
    tilt: 1.5,
    detail: {
      kop: "Praktijkgerichte interventies & talentontwikkeling",
      alineas: [
        "Praten alleen is vaak niet genoeg — jongeren leren en groeien door te doen. Onze praktijkgerichte interventies combineren activerende begeleiding met concrete dagbesteding, maatschappelijke participatie en talentontwikkeling.",
        "Waar nodig ondersteunen we dit met bewezen methodieken uit de cognitieve gedragstherapie (CGT), om belemmerende overtuigingen te doorbreken.",
      ],
      blokLabel: "Fasering",
      blokken: [
        {
          titel: "Fase 1 — Stabilisatie & activering",
          tekst:
            "Rust en ritme creëren: een vast dagritme opbouwen, acute stressoren wegnemen (schulden, huisvesting) en lichte, activerende activiteiten opstarten.",
        },
        {
          titel: "Fase 2 — Talent & competentie",
          tekst:
            "Drijfveren ontdekken via erkende binnen- en buitenschoolse leertrajecten, sport, creatieve projecten of praktijkgericht vrijwilligerswerk.",
        },
        {
          titel: "Fase 3 — Leerwerktraject & uitstroom",
          tekst:
            "Op weg naar zelfstandigheid: begeleiding naar onderwijs, een BBL-traject of regulier werk, met CGT-technieken om nieuw gedrag te verankeren.",
        },
      ],
    },
  },
];

export function Aanpak() {
  const [open, setOpen] = useState(0);
  const detail = PIJLERS[open].detail;

  return (
    <section id="aanpak" className="sz-section sz-aanpak" aria-labelledby="approach-title">
      <header>
        <h2 id="approach-title">Onze aanpak</h2>
      </header>

      <div className="sz-kaartenrij">
        {PIJLERS.map((pijler, i) => {
          const actief = open === i;
          return (
            <button
              key={pijler.titel}
              type="button"
              aria-pressed={actief}
              onClick={() => setOpen(i)}
              className={`sz-pijlerkaart${actief ? " is-active" : ""}`}
              style={
                {
                  "--tilt": `${pijler.tilt}deg`,
                  "--zi": actief ? 8 : 4 - i,
                } as React.CSSProperties
              }
            >
              <span className="sz-pijler-foto" aria-hidden="true">
                <img src={pijler.foto} alt="" loading="lazy" />
              </span>
              <span className="sz-pijler-veil" aria-hidden="true" />
              <Paperclip className="sz-clip" />
              <span className="sz-pijler-lijn" aria-hidden="true" />

              <div className="sz-pijler-body">
                {pijler.icoon}
                <div style={{ width: "100%", minWidth: 0 }}>
                  <p className="sz-pijler-eyebrow">{pijler.eyebrow}</p>
                  <h3 className="sz-pijler-titel">{pijler.titel}</h3>
                  <span className="sz-pijler-hint">
                    {actief ? "Hieronder geopend" : "Lees meer"}{" "}
                    <ChevronDown stroke="#d3a142" width={12} />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="sz-detail">
        <h3>{detail.kop}</h3>
        <div className="sz-detail-inner">
          <div className="sz-detail-basis">
            <p className="sz-detail-label">De basis</p>
            {detail.alineas.map((alinea) => (
              <p key={alinea.slice(0, 32)}>{alinea}</p>
            ))}
            {detail.quote && <blockquote className="sz-detail-quote">{detail.quote}</blockquote>}
            {detail.stappen && (
              <div className="sz-stappen">
                {detail.stappen.map((stap) => (
                  <div className="sz-stap" key={stap.titel}>
                    <span className="sz-stap-bullet" aria-hidden="true">
                      <i />
                    </span>
                    <div>
                      <p className="sz-stap-titel">{stap.titel}</p>
                      <p className="sz-stap-tekst">{stap.tekst}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="sz-detail-label" style={{ margin: 0 }}>
              {detail.blokLabel}
            </p>
            <div className="sz-genummerd">
              {detail.blokken.map((blok, i) => (
                <div key={blok.titel}>
                  <span className="sz-nummer" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p>{blok.titel}</p>
                  <p>{blok.tekst}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
