import { useRef } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const SEGMENTEN: { tekst: string; nadruk?: boolean }[] = [
  { tekst: "Wij zijn er voor " },
  { tekst: "jongeren van 12 t/m 18 jaar", nadruk: true },
  {
    tekst:
      " bij wie gedrag, motivatie of thuissituatie vastloopt — die schuren tegen forensische of criminele problematiek, weinig vertrouwen hebben in hulpverlening, en opgroeien binnen complexe systeem- of gezinsproblematiek.",
  },
];

const KOLOMMEN = [
  {
    titel: "Verbinding eerst",
    tekst:
      "Relationeel en cultuursensitief werken: vertrouwen en herkenning zijn het vertrekpunt, niet de interventie.",
  },
  {
    titel: "Het hele systeem",
    tekst:
      "Intensieve aandacht voor ouders en netwerk, en voor de executieve functies die gedrag dragen.",
  },
  {
    titel: "Maatwerk, geen traject",
    tekst:
      "Wij bereiken jongeren die zijn afgehaakt bij reguliere zorg — met begeleiding die op hen is gebouwd.",
  },
];

/** Splitst de tekst in losse woorden voor de gestaffelde animatie. */
function Woorden() {
  let sleutel = 0;
  return (
    <>
      {SEGMENTEN.map((seg) =>
        seg.tekst.split(/(\s+)/).map((deel) => {
          if (!deel) return null;
          if (/^\s+$/.test(deel)) return <span key={`s${sleutel++}`}>{deel}</span>;
          const woord = (
            <span data-w="" style={{ display: "inline-block" }}>
              {deel}
            </span>
          );
          return seg.nadruk ? (
            <em key={`w${sleutel++}`} style={{ color: "#e8bd65", fontStyle: "normal" }}>
              {woord}
            </em>
          ) : (
            <span key={`w${sleutel++}`}>{woord}</span>
          );
        }),
      )}
    </>
  );
}

export function Doelgroep() {
  const alinea = useRef<HTMLParagraphElement>(null);

  useScrollReveal(alinea, "span[data-w]", 16, 900, 60);

  return (
    <section id="doelgroep" className="sz-section sz-doelgroep" aria-labelledby="audience-title">
      <div className="sz-doelgroep-grid">
        <div>
          <p className="sz-eyebrow sz-eyebrow--light">Voor wie</p>
          <h2 id="audience-title">Er zijn als het schuurt.</h2>
          <p className="sz-doelgroep-intro">
            Juist wanneer reguliere zorg geen aansluiting vindt, zoeken wij naar het contact dat
            verandering mogelijk maakt.
          </p>
        </div>
        <div>
          <h3>Onze doelgroep</h3>
          <p className="sz-doelgroep-tekst" ref={alinea}>
            <Woorden />
          </p>
        </div>
        <div className="sz-doelgroep-foto" aria-hidden="true">
          <div className="sz-vel sz-scheur" />
          <div className="sz-foto sz-scheur">
            <img
              src="/assets/doelgroep-bankje.jpg"
              alt=""
              loading="lazy"
              decoding="async"
              width={900}
              height={600}
            />
          </div>
        </div>
      </div>

      <div className="sz-pijlers3">
        {KOLOMMEN.map((kol) => (
          <div key={kol.titel}>
            <p>{kol.titel}</p>
            <p>{kol.tekst}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
