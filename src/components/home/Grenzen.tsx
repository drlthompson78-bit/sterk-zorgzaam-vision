import { useState } from "react";
import { Close, IconHand, IconHartslag, IconPil, IconSchild, IconWeegschaal } from "../site/icons";

const GRENZEN = [
  {
    titel: "Wettelijk dwingend kader",
    tekst:
      "Wvggz / Wzd, gesloten plaatsing of verplichte opname — wij werken vanuit vrijwilligheid en eigen regie.",
    icoon: <IconWeegschaal />,
  },
  {
    titel: "Acute psychiatrische nood",
    tekst:
      "Bij ernstige ontregeling of suïcidaliteit is specialistische GGZ of klinische behandeling vereist.",
    icoon: <IconHartslag />,
  },
  {
    titel: "Ernstige verslavingsproblematiek",
    tekst:
      "Wanneer detox of medische stabilisatie eerst noodzakelijk is, zijn wij niet de passende eerste interventie.",
    icoon: <IconPil />,
  },
  {
    titel: "Ernstige veiligheidsrisico's",
    tekst:
      "Structureel onbeheersbare agressie of voortdurende fysieke risico's overstijgen de veilige uitvoerbaarheid.",
    icoon: <IconSchild />,
  },
  {
    titel: "Volledige zorgweigering",
    tekst:
      "Onze aanpak vraagt minimale bereidheid tot contact. Zonder dat ontbreekt de basis voor een traject.",
    icoon: <IconHand />,
  },
];

export function Grenzen() {
  const [geflipt, setGeflipt] = useState(-1);

  return (
    <section className="sz-section sz-grenzen" aria-labelledby="boundaries-title">
      <header>
        <h2 id="boundaries-title">Wanneer wij niet de juiste match zijn</h2>
        <p>
          Goede zorg begint ook bij weten wanneer specialistische of klinische ondersteuning
          passender is.
        </p>
      </header>
      <div className="sz-flipgrid">
        {GRENZEN.map((grens, i) => {
          const nr = String(i + 1).padStart(2, "0");
          const open = geflipt === i;
          return (
            <button
              key={grens.titel}
              type="button"
              aria-expanded={open}
              onClick={() => setGeflipt((v) => (v === i ? -1 : i))}
              className={`sz-flip${open ? " is-flipped" : ""}`}
            >
              <span className="sz-flip-inner">
                <span className="sz-flip-voor">
                  <span className="sz-flip-top">
                    <span className="sz-flip-nr">{nr}</span>
                    <Close className="sz-flip-x" stroke="#d3a142" width={15} />
                  </span>
                  <span className="sz-flip-icoon" aria-hidden="true">
                    {grens.icoon}
                  </span>
                  <span className="sz-flip-titel">{grens.titel}</span>
                </span>
                <span className="sz-flip-achter">
                  <span className="sz-flip-top">
                    <span className="sz-flip-nr">{nr}</span>
                    <Close className="sz-flip-x" stroke="#e8bd65" width={15} />
                  </span>
                  <span className="sz-flip-tekst">{grens.tekst}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
