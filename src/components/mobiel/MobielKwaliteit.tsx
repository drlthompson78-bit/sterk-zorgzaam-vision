import { useEffect, useState } from "react";
import { FadeLink } from "@/components/site/nav";
import { ChevronDown, IconCookie, IconGesprek, IconInfo, IconSlot } from "@/components/site/icons";
import { MobielActiebalk, MobielTopbar } from "./Chroom";

const RIJEN = [
  {
    id: "privacy",
    icoon: <IconSlot />,
    titel: "Privacyreglement",
    sub: "Bescherming van persoonsgegevens, AVG",
    intro:
      "Sterk & Zorgzaam verwerkt persoonsgegevens van jongeren, ouders/verzorgers en verwijzers uitsluitend om goede begeleiding te kunnen bieden. Wij houden ons aan de AVG en de Jeugdwet.",
    regels: [
      [
        "Doelbinding",
        " — gegevens gebruiken we alleen voor aanmelding, begeleiding en verantwoording richting de gemeente of verwijzer.",
      ],
      [
        "Toegang",
        " — alleen direct betrokken begeleiders hebben toegang tot het dossier. Delen met derden gebeurt uitsluitend met toestemming.",
      ],
      [
        "Bewaartermijn",
        " — dossiers bewaren wij volgens de wettelijke termijn en vernietigen wij daarna zorgvuldig.",
      ],
      [
        "Jouw rechten",
        " — inzage, correctie of verwijdering vraag je aan via {mail}. Wij reageren binnen vier weken.",
      ],
    ],
  },
  {
    id: "cookies",
    icoon: <IconCookie />,
    titel: "Cookieverklaring",
    sub: "Welke cookies wij gebruiken",
    intro:
      "Deze website gebruikt uitsluitend functionele cookies. Wij plaatsen geen tracking- of advertentiecookies en volgen je niet over andere websites.",
    regels: [
      [
        "Functioneel",
        " — noodzakelijk voor de werking van de site en het aanmeldformulier. Hiervoor is geen toestemming vereist.",
      ],
      [
        "Kaartweergave",
        " — de contactkaart laadt kaartmateriaal van externe leveranciers (OpenStreetMap/CARTO); daarbij wordt je IP-adres gedeeld om de kaart te tonen.",
      ],
      [
        "Zelf beheren",
        " — via je browserinstellingen kun je cookies altijd inzien, blokkeren of verwijderen.",
      ],
    ],
  },
  {
    id: "klachten",
    icoon: <IconGesprek />,
    titel: "Klachtenregeling",
    sub: "Laagdrempelig en onafhankelijk",
    intro:
      "Ben je niet tevreden over onze begeleiding? Dat horen we graag — een klacht helpt ons beter te worden. We volgen drie stappen:",
    goud: true,
    regels: [
      [
        "1. Bespreek het eerst",
        " — met de begeleider zelf of met de oprichters. De meeste zorgen lossen we in een goed gesprek op.",
      ],
      [
        "2. Dien een klacht in",
        " — schriftelijk via {mail}. Je ontvangt binnen vijf werkdagen een reactie en we plannen een gesprek.",
      ],
      [
        "3. Onafhankelijke behandeling",
        " — komen we er samen niet uit, dan kun je terecht bij een onafhankelijke klachtenfunctionaris of vertrouwenspersoon (o.a. JeugdStem/AKJ, kosteloos).",
      ],
    ],
  },
  {
    id: "disclaimer",
    icoon: <IconInfo />,
    titel: "Disclaimer",
    sub: "Waarvoor deze site bedoeld is",
    alinea: [
      "Deze website is bedoeld om jongeren, ouders en opvoeders, verwijzers en opdrachtgevers te informeren over Sterk & Zorgzaam.",
      "De inhoud is met de grootst mogelijke zorgvuldigheid samengesteld. Toch kunnen aan de informatie en diensten op deze website geen rechten worden ontleend. Sterk & Zorgzaam aanvaardt geen aansprakelijkheid voor onjuiste of onvolledige informatie, of voor de inhoud van websites waarnaar wij verwijzen.",
      "Namen en foto's van jongeren op deze website zijn in verband met privacy gefingeerd, tenzij de betrokkene uitdrukkelijk toestemming heeft gegeven en de veiligheid van betrokkene en omgeving niet in het geding is. Voor fotografie wordt gebruikgemaakt van modellen.",
    ],
    slot: "Ontbreekt er informatie of klopt er iets niet? Mail naar {mail}.",
  },
];

const Mail = () => (
  <a href="mailto:info@sterkzorgzaam.nl" className="mz-mail">
    info@sterkzorgzaam.nl
  </a>
);

/** Vervangt {mail} in de redactionele teksten door een klikbare mailtolink. */
function metMail(tekst: string) {
  const delen = tekst.split("{mail}");
  return delen.map((deel, i) => (
    <span key={i}>
      {deel}
      {i < delen.length - 1 && <Mail />}
    </span>
  ));
}

export function MobielKwaliteit() {
  const [open, setOpen] = useState(0);

  /* Een deeplink (bijv. vanuit de zoekfunctie of de footer) opent meteen het
     juiste onderwerp. */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const i = RIJEN.findIndex((r) => r.id === hash);
    if (i >= 0) setOpen(i);
  }, []);

  return (
    <div className="mz-root">
      <MobielTopbar variant="terug" />

      <section className="mz-kw-hero">
        <nav aria-label="Kruimelpad" className="mz-kruimel">
          <FadeLink to="/">Home</FadeLink>
          <span aria-hidden="true">›</span>
          <span>Kwaliteit</span>
        </nav>
        <p className="mz-eyebrow mz-eyebrow--goud">Kwaliteit</p>
        <h1>Zorgvuldig, transparant en aanspreekbaar.</h1>
        <p className="mz-kw-lead">
          Goede begeleiding begint met luisteren, duidelijke afspraken en blijven leren.
        </p>
      </section>

      <section className="mz-kw-lijst">
        {RIJEN.map((rij, i) => (
          <div key={rij.id} id={`m-${rij.id}`} className="mz-kw-rij">
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
            >
              <span className="mz-kw-icoon">{rij.icoon}</span>
              <span className="mz-kw-titel">
                <span>{rij.titel}</span>
                <span>{rij.sub}</span>
              </span>
              <ChevronDown
                stroke="#d3a142"
                width={14}
                style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            <div className={`mz-kw-paneel${open === i ? " is-open" : ""}`}>
              <div>
                {rij.intro && <p className="mz-kw-intro">{rij.intro}</p>}
                {rij.regels?.map(([vet, rest]) => (
                  <p key={vet} className="mz-kw-regel">
                    <strong className={rij.goud ? "mz-goud" : undefined}>{vet}</strong>
                    {metMail(rest)}
                  </p>
                ))}
                {rij.alinea?.map((tekst) => (
                  <p key={tekst} className="mz-kw-intro">
                    {tekst}
                  </p>
                ))}
                {rij.slot && <p className="mz-kw-intro">{metMail(rij.slot)}</p>}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mz-kw-voet">
        <p className="mz-eyebrow mz-eyebrow--goud">Vragen?</p>
        <p className="mz-kw-voet-kop">Wij denken graag mee.</p>
        <div className="mz-kw-voet-knoppen">
          <a href="tel:+31628873094">Bellen</a>
          <a href="mailto:info@sterkzorgzaam.nl">Mailen</a>
        </div>
        <p className="mz-copy">© 2026 Samen Sterk &amp; Zorgzaam B.V.</p>
      </section>

      <MobielActiebalk />
    </div>
  );
}
