import { ChevronDown } from "../site/icons";

export function Hero({
  briefOpen,
  onToggleBrief,
}: {
  briefOpen: boolean;
  onToggleBrief: () => void;
}) {
  return (
    <section id="top" className="sz-section sz-hero sz-lift" aria-labelledby="hero-title">
      <div className="sz-hero-body">
        <h1 id="hero-title">
          Kleine <em>stapjes</em>
          <br />
          zijn ook stappen
        </h1>
        <p className="sz-hero-sub">
          Sterk &amp; Zorgzaam ondersteunt jongeren die vastlopen in gedrag, ontwikkeling of
          omgeving. Gericht op duurzaam perspectief.
        </p>
        <div className="sz-hero-acties">
          <button
            type="button"
            className="sz-btn-gold"
            aria-expanded={briefOpen}
            onClick={onToggleBrief}
          >
            <span>Lees verder</span>
            <ChevronDown className={briefOpen ? "is-open" : undefined} width={16} />
          </button>
        </div>
      </div>
      <figure className="sz-hero-figure">
        <div className="sz-hero-veil" aria-hidden="true" />
        <img
          src="/assets/hero-youth.jpg"
          alt="Een diverse groep jongeren samen in de stad"
          fetchPriority="high"
        />
      </figure>
    </section>
  );
}

export function Brief({ open }: { open: boolean }) {
  return (
    <section id="brief" className="sz-section sz-brief" aria-label="Boodschap van de oprichters">
      <div className={`sz-collapse sz-collapse--brief${open ? " is-open" : ""}`}>
        <div className="sz-tweekolom">
          <header>
            <p className="sz-eyebrow sz-eyebrow--brief">Van de oprichters</p>
            <p className="sz-kop-md">Vooruitgang begint zelden met een grote stap.</p>
          </header>
          <div className="sz-lopend">
            <p>
              <span className="sz-dropcap">S</span>oms begint verandering met opendoen wanneer we
              aanbellen. Met toch verschijnen bij een afspraak. Met een eerlijk antwoord, een eerste
              dag terug op school of één moment waarop een jongere besluit het anders te proberen.
            </p>
            <p>
              Voor de jongeren die wij begeleiden, zijn zulke stappen niet vanzelfsprekend. Zij
              groeien vaak op in complexe omstandigheden, hebben weinig vertrouwen in hulpverlening
              en lopen vast in hun gedrag, motivatie of thuissituatie. Soms komen zij daarbij dicht
              bij criminaliteit of zijn ze al in aanraking gekomen met politie en justitie.
            </p>
            <p>Juist dan geloven wij niet in snelle oordelen of grote beloften.</p>
            <p>
              We beginnen met contact. Met luisteren naar het verhaal achter het gedrag. Met
              aanwezig blijven wanneer motivatie wisselt en vooruitgang even niet zichtbaar is. We
              bieden duidelijkheid en grenzen, maar verliezen de mogelijkheden van een jongere nooit
              uit het oog.
            </p>
            <blockquote className="sz-blockquote">
              Een klein stapje lijkt misschien weinig. Voor een jongere die lang heeft stilgestaan,
              kan het alles betekenen.
            </blockquote>
            <p>
              Bij Sterk &amp; Zorgzaam werken we vanuit vertrouwen, verbinding en een positieve blik
              op ontwikkeling. Samen met de jongere, het gezin en betrokken professionals maken we
              grote problemen kleiner en de volgende stap haalbaar.
            </p>
            <p>
              Niet alles hoeft vandaag opgelost te worden. Als er beweging ontstaat, kan vertrouwen
              groeien. Als vertrouwen groeit, ontstaat ruimte voor andere keuzes. En uit al die
              kleine stapjes kan uiteindelijk een nieuw perspectief ontstaan.
            </p>
            <p>
              Daarom kijken we niet alleen naar waar een jongere nu staat, maar vooral naar waar
              diegene naartoe kan.
            </p>
            <p className="sz-slotzin">Kleine stapjes zijn ook stappen.</p>
            <div style={{ marginTop: 18 }}>
              <p className="sz-handtekening">
                Miriam <span>&amp;</span> Giovanni
              </p>
              <p className="sz-founders">Founders</p>
              <p style={{ margin: "2px 0 0", fontWeight: 700, color: "#132a34" }}>
                Samen Sterk &amp; Zorgzaam
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
