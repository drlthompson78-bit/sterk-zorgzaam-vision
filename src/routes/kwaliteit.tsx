import { createFileRoute } from "@tanstack/react-router";
import { PaginaHeader } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnchorLink, FadeLink, useHashScroll } from "@/components/site/nav";
import { ArrowRight, IconCookie, IconGesprek, IconInfo, IconSlot } from "@/components/site/icons";
import { MobielKwaliteit } from "@/components/mobiel/MobielKwaliteit";

export const Route = createFileRoute("/kwaliteit")({
  component: Kwaliteit,
  head: () => ({
    meta: [
      { title: "Kwaliteit — Sterk & Zorgzaam" },
      {
        name: "description",
        content:
          "Privacyreglement, cookieverklaring, klachtenregeling en disclaimer van Sterk & Zorgzaam: zorgvuldig, transparant en aanspreekbaar.",
      },
    ],
  }),
});

const DOCUMENTEN = [
  {
    id: "privacy",
    icoon: <IconSlot />,
    titel: "Privacyreglement",
    tekst: "Hoe wij persoonsgegevens van jongeren en hun netwerk beschermen, conform de AVG.",
  },
  {
    id: "cookies",
    icoon: <IconCookie />,
    titel: "Cookieverklaring",
    tekst: "Welke cookies deze website gebruikt, waarvoor — en wat je zelf kunt instellen.",
  },
  {
    id: "klachten",
    icoon: <IconGesprek />,
    titel: "Klachtenregeling",
    tekst:
      "Niet tevreden? Zo bespreken en behandelen we klachten — laagdrempelig en onafhankelijk.",
  },
  {
    id: "disclaimer",
    icoon: <IconInfo />,
    titel: "Disclaimer",
    tekst:
      "Waar de informatie op deze website wel en niet voor bedoeld is — en wat je eraan kunt ontlenen.",
  },
];

function Kwaliteit() {
  useHashScroll();

  return (
    <>
      <div className="sz-mobiel-alleen" lang="nl">
        <MobielKwaliteit />
      </div>

      <div className="sz-root sz-page sz-desktop-alleen" lang="nl">
        <PaginaHeader actief="kwaliteit" />

        <section className="sz-section sz-kw-hero sz-lift" aria-labelledby="kwaliteit-title">
          <nav aria-label="Kruimelpad" className="sz-kruimel">
            <FadeLink to="/">Home</FadeLink>
            <span className="sz-sep" aria-hidden="true">
              ›
            </span>
            <b>Kwaliteit</b>
          </nav>
          <h1 id="kwaliteit-title">Zorgvuldig, transparant en aanspreekbaar.</h1>
          <p>
            Goede begeleiding begint met luisteren, duidelijke afspraken en blijven leren. Hier lees
            je hoe wij omgaan met privacy, cookies en klachten.
          </p>
        </section>

        <section id="documenten" className="sz-docs" aria-label="Regelingen">
          {DOCUMENTEN.map((doc) => (
            <AnchorLink key={doc.id} id={doc.id} className="sz-doc">
              <span className="sz-doc-icoon">{doc.icoon}</span>
              <h2>{doc.titel}</h2>
              <p>{doc.tekst}</p>
              <span className="sz-doc-meer">
                Lees meer <ArrowRight width={14} />
              </span>
            </AnchorLink>
          ))}
        </section>

        <section
          id="privacy"
          className="sz-section sz-kw-sectie sz-kw--cream"
          aria-labelledby="privacy-title"
        >
          <header>
            <p className="sz-eyebrow">Privacy</p>
            <h2 id="privacy-title">Zorgvuldig met gegevens</h2>
          </header>
          <div className="sz-kw-body">
            <p>
              Sterk &amp; Zorgzaam verwerkt persoonsgegevens van jongeren, ouders/verzorgers en
              verwijzers uitsluitend om goede begeleiding te kunnen bieden. Wij houden ons daarbij
              aan de Algemene Verordening Gegevensbescherming (AVG) en de Jeugdwet.
            </p>
            <div className="sz-kw-lijst">
              <p>
                <strong>Doelbinding</strong> — gegevens gebruiken we alleen voor aanmelding,
                begeleiding en verantwoording richting de gemeente of verwijzer.
              </p>
              <p>
                <strong>Toegang</strong> — alleen direct betrokken begeleiders hebben toegang tot
                het dossier. Delen met derden gebeurt uitsluitend met toestemming.
              </p>
              <p>
                <strong>Bewaartermijn</strong> — dossiers bewaren wij volgens de wettelijke termijn
                en vernietigen wij daarna zorgvuldig.
              </p>
              <p>
                <strong>Jouw rechten</strong> — inzage, correctie of verwijdering vraag je aan via{" "}
                <a href="mailto:info@sterkzorgzaam.nl">info@sterkzorgzaam.nl</a>. Wij reageren
                binnen vier weken.
              </p>
            </div>
          </div>
        </section>

        <section
          id="cookies"
          className="sz-section sz-kw-sectie sz-kw--creamdeep"
          aria-labelledby="cookies-title"
        >
          <header>
            <p className="sz-eyebrow">Cookies</p>
            <h2 id="cookies-title">Alleen wat nodig is</h2>
          </header>
          <div className="sz-kw-body">
            <p>
              Deze website gebruikt uitsluitend functionele cookies: kleine bestanden die nodig zijn
              om de site goed te laten werken, zoals het onthouden van je voorkeuren. Wij plaatsen
              geen tracking- of advertentiecookies en volgen je niet over andere websites.
            </p>
            <div className="sz-kw-lijst">
              <p>
                <strong>Functioneel</strong> — noodzakelijk voor de werking van de site en het
                aanmeldformulier. Hiervoor is geen toestemming vereist.
              </p>
              <p>
                <strong>Kaartweergave</strong> — de contactkaart laadt kaartmateriaal van externe
                leveranciers (OpenStreetMap/CARTO); daarbij wordt je IP-adres gedeeld om de kaart te
                tonen.
              </p>
              <p>
                <strong>Zelf beheren</strong> — via je browserinstellingen kun je cookies altijd
                inzien, blokkeren of verwijderen.
              </p>
            </div>
          </div>
        </section>

        <section
          id="klachten"
          className="sz-section sz-kw-sectie sz-kw--ink"
          aria-labelledby="klachten-title"
        >
          <header>
            <p className="sz-eyebrow sz-eyebrow--light">Klachtenregeling</p>
            <h2 id="klachten-title">Samen oplossen, serieus nemen</h2>
          </header>
          <div className="sz-kw-body">
            <p>
              Ben je niet tevreden over onze begeleiding? Dat horen we graag — een klacht helpt ons
              beter te worden. We volgen drie stappen:
            </p>
            <div className="sz-kw-lijst">
              <p>
                <strong>1. Bespreek het eerst</strong> — met de begeleider zelf of met de
                oprichters. De meeste zorgen lossen we in een goed gesprek op.
              </p>
              <p>
                <strong>2. Dien een klacht in</strong> — schriftelijk via{" "}
                <a href="mailto:info@sterkzorgzaam.nl">info@sterkzorgzaam.nl</a>. Je ontvangt binnen
                vijf werkdagen een reactie en we plannen een gesprek.
              </p>
              <p>
                <strong>3. Onafhankelijke behandeling</strong> — komen we er samen niet uit, dan kun
                je terecht bij een onafhankelijke klachtenfunctionaris of vertrouwenspersoon (o.a.
                JeugdStem/AKJ, kosteloos).
              </p>
            </div>
          </div>
        </section>

        <section
          id="disclaimer"
          className="sz-section sz-kw-sectie sz-kw--creamdeep sz-kw--disclaimer"
          aria-labelledby="disclaimer-title"
        >
          <header>
            <p className="sz-eyebrow">Disclaimer</p>
            <h2 id="disclaimer-title">Zorgvuldig, zonder rechten te ontlenen</h2>
          </header>
          <div className="sz-kw-body">
            <p>
              Deze website is bedoeld om jongeren, ouders en opvoeders, verwijzers en opdrachtgevers
              te informeren over Sterk &amp; Zorgzaam.
            </p>
            <p>
              De inhoud is met de grootst mogelijke zorgvuldigheid samengesteld. Toch kunnen aan de
              informatie en diensten op deze website geen rechten worden ontleend. Sterk &amp;
              Zorgzaam aanvaardt geen aansprakelijkheid voor onjuiste of onvolledige informatie, of
              voor de inhoud van websites waarnaar wij verwijzen.
            </p>
            <p>
              Namen en foto's van jongeren op deze website zijn in verband met privacy gefingeerd,
              tenzij de betrokkene uitdrukkelijk toestemming heeft gegeven en de veiligheid van
              betrokkene en omgeving niet in het geding is. Voor fotografie wordt gebruikgemaakt van
              modellen.
            </p>
            <p>
              Informatie en documenten op deze website (met uitzondering van foto's) mogen voor
              privégebruik worden gekopieerd of opgeslagen. Openbaar maken of verspreiden mag alleen
              na uitdrukkelijke toestemming van Sterk &amp; Zorgzaam.
            </p>
            <p>
              Ontbreekt er informatie of klopt er iets niet? Laat het ons weten: mail naar{" "}
              <a href="mailto:info@sterkzorgzaam.nl">info@sterkzorgzaam.nl</a>.
            </p>
          </div>
        </section>

        <Footer compact />
      </div>
    </>
  );
}
