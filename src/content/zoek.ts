import { useEffect, useState } from "react";

/*
 * Eén zoekbron voor desktop én mobiel. De mobiele zoekfunctie voegt hier
 * alleen tekstfiltering aan toe; de index en de filtergroepen zijn gedeeld.
 */

export const FGROEPEN = [
  {
    titel: "Onderwerp",
    items: [
      "Missie & visie",
      "Onze aanpak",
      "Voor wie wij er zijn",
      "Kwaliteit & privacy",
      "Aanmelden",
      "Contact",
    ],
  },
  {
    titel: "Thema's",
    items: [
      "Cultuursensitief werken",
      "Systemisch werken & netwerk",
      "Executieve functies",
      "Sport & talentontwikkeling",
      "Klachtenregeling",
    ],
  },
];

export type Resultaat = {
  cat: string;
  titel: string;
  tekst: string;
  hash?: string;
  to?: string;
  toHash?: string;
  tags: string[];
};

export const ITEMS: Resultaat[] = [
  {
    cat: "Missie",
    titel: "Onze missie",
    tekst: "Waar Samen Sterk & Zorgzaam voor staat en van waaruit wij werken.",
    hash: "missie",
    tags: ["Missie & visie"],
  },
  {
    cat: "Missie",
    titel: "Onze overtuiging",
    tekst: "Het credo achter ons werk met jongeren en hun omgeving.",
    hash: "missie",
    tags: ["Missie & visie"],
  },
  {
    cat: "Doelgroep",
    titel: "Voor wie wij er zijn",
    tekst: "Jongeren van 12 tot 18 die vastlopen in gedrag, ontwikkeling of omgeving.",
    hash: "doelgroep",
    tags: ["Voor wie wij er zijn"],
  },
  {
    cat: "Aanpak",
    titel: "Cultuursensitief & relationeel werken",
    tekst: "Aansluiten bij de leefwereld als basis voor vertrouwen.",
    hash: "aanpak",
    tags: ["Onze aanpak", "Cultuursensitief werken"],
  },
  {
    cat: "Aanpak",
    titel: "Systemisch werken & netwerkversterking",
    tekst: "Het gezin en netwerk actief betrekken bij de begeleiding.",
    hash: "aanpak",
    tags: ["Onze aanpak", "Systemisch werken & netwerk"],
  },
  {
    cat: "Aanpak",
    titel: "Executieve functies & gedragsverandering",
    tekst: "Werken aan plannen, impulsregulatie en zelfsturing.",
    hash: "aanpak",
    tags: ["Onze aanpak", "Executieve functies"],
  },
  {
    cat: "Aanpak",
    titel: "Praktijkgerichte interventies & talentontwikkeling",
    tekst: "Sport, coaching en doen als motor voor groei.",
    hash: "aanpak",
    tags: ["Onze aanpak", "Sport & talentontwikkeling"],
  },
  {
    cat: "Kwaliteit",
    titel: "Privacy",
    tekst: "Hoe wij omgaan met persoonsgegevens van jongeren en gezinnen.",
    to: "/kwaliteit",
    toHash: "privacy",
    tags: ["Kwaliteit & privacy"],
  },
  {
    cat: "Kwaliteit",
    titel: "Cookies",
    tekst: "Wat deze website wel en niet bijhoudt.",
    to: "/kwaliteit",
    toHash: "cookies",
    tags: ["Kwaliteit & privacy"],
  },
  {
    cat: "Kwaliteit",
    titel: "Klachtenregeling",
    tekst: "Samen oplossen, serieus nemen — in drie duidelijke stappen.",
    to: "/kwaliteit",
    toHash: "klachten",
    tags: ["Kwaliteit & privacy", "Klachtenregeling"],
  },
  {
    cat: "Kwaliteit",
    titel: "Disclaimer",
    tekst: "Wat je mag verwachten van de informatie op deze site.",
    to: "/kwaliteit",
    toHash: "disclaimer",
    tags: ["Kwaliteit & privacy"],
  },
  {
    cat: "Aanmelden",
    titel: "Een jongere aanmelden",
    tekst: "Het aanmeldformulier — wij reageren binnen twee werkdagen.",
    to: "/aanmelden",
    tags: ["Aanmelden"],
  },
  {
    cat: "Oprichters",
    titel: "Maak kennis met de oprichters",
    tekst: "Miriam Twilt-Mendonça en Giovanni Peters over hun werk.",
    hash: "oprichters",
    tags: ["Missie & visie"],
  },
  {
    cat: "Passende zorg",
    titel: "Wanneer wij niet de juiste match zijn",
    tekst: "Wvggz, crisis, verslaving, veiligheid en zorgweigering.",
    hash: "geenmatch",
    tags: ["Voor wie wij er zijn"],
  },
  {
    cat: "Contact",
    titel: "Bezoek & contact",
    tekst: "Adres, telefoon, mail en onze bereikbaarheid.",
    hash: "contact",
    tags: ["Contact"],
  },
];

export const TIPS = [
  "hoe meld ik een jongere aan?",
  "wat is cultuursensitief werken?",
  "voor wie is Sterk & Zorgzaam?",
  "hoe bewaken jullie kwaliteit?",
  "wat gebeurt er na aanmelding?",
];

/** Typemachine-placeholder in het zoekveld. */
export function useTypewriter(actief: boolean) {
  const [tekst, setTekst] = useState("");
  useEffect(() => {
    if (!actief) return;
    let tip = 0;
    let pos = 0;
    let del = false;
    let timer: number;
    const stap = () => {
      const t = TIPS[tip];
      if (!del) {
        pos++;
        setTekst(t.slice(0, pos));
        if (pos >= t.length) {
          del = true;
          timer = window.setTimeout(stap, 4000);
          return;
        }
        timer = window.setTimeout(stap, 45);
      } else {
        pos--;
        setTekst(t.slice(0, pos));
        if (pos <= 0) {
          del = false;
          tip = (tip + 1) % TIPS.length;
          timer = window.setTimeout(stap, 500);
          return;
        }
        timer = window.setTimeout(stap, 22);
      }
    };
    stap();
    return () => window.clearTimeout(timer);
  }, [actief]);
  return tekst;
}

export const ALLE_FILTERS = FGROEPEN.flatMap((g) => g.items);

/**
 * Filteren op gekozen filters en — alleen mobiel gebruikt dit — op vrije tekst
 * vanaf twee tekens.
 */
export function filterResultaten(sel: Record<string, boolean>, query = "") {
  const actief = ALLE_FILTERS.filter((l) => sel[l]);
  const q = query.trim().toLowerCase();
  let res = actief.length ? ITEMS.filter((it) => it.tags.some((t) => sel[t])) : [];
  if (q.length >= 2) {
    const pool = actief.length ? res : ITEMS;
    res = pool.filter((it) =>
      `${it.titel} ${it.tekst} ${it.cat} ${it.tags.join(" ")}`.toLowerCase().includes(q),
    );
  }
  return { actief, resultaten: res };
}
