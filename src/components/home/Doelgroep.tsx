import { useEffect, useRef } from "react";

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

/** Splitst de tekst in losse woorden zodat GSAP ze per woord kan animeren. */
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

  useEffect(() => {
    const el = alinea.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let io: IntersectionObserver | undefined;
    let afgebroken = false;

    import("gsap").then(({ gsap }) => {
      if (afgebroken || !alinea.current) return;
      const woorden = alinea.current.querySelectorAll("span[data-w]");
      gsap.set(woorden, { opacity: 0, y: 16 });
      let speelt = false;
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.intersectionRatio >= 0.55 && !speelt) {
              speelt = true;
              gsap.fromTo(
                woorden,
                { opacity: 0, y: 16 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  ease: "power2.out",
                  stagger: 0.06,
                  overwrite: true,
                },
              );
            } else if (!e.isIntersecting && speelt) {
              speelt = false;
              gsap.set(woorden, { opacity: 0, y: 16 });
            }
          });
        },
        { threshold: [0, 0.55] },
      );
      io.observe(alinea.current);
    });

    return () => {
      afgebroken = true;
      io?.disconnect();
    };
  }, []);

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
            <img src="/assets/doelgroep-bankje.jpg" alt="" />
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
