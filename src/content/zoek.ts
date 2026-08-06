import { useEffect, useState } from "react";
import Fuse from "fuse.js";

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
  /** De echte paginatekst; hierop zoekt de zoekmachine mee. */
  inhoud?: string;
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
    inhoud:
      "De mens achter het gedrag. Wij ondersteunen jongeren die risico lopen op maatschappelijke of forensische ontsporing, cultuursensitief, relationeel en praktijkgericht. Verbinding voor interventie. Vertrouwen opent de deur naar verandering. Cultuur en leefwereld horen bij de begeleiding. Duurzame ontwikkeling versterkt het hele systeem. Iedere jongere bezit talent en mogelijkheden. De leefwereld als vertrekpunt.",
    tags: ["Missie & visie"],
  },
  {
    cat: "Missie",
    titel: "Onze overtuiging",
    tekst: "Het credo achter ons werk met jongeren en hun omgeving.",
    hash: "missie",
    inhoud:
      "Wat schuilt er achter opstandig of onbegrepen gedrag? Achter elk moeilijk gedrag zien wij een jongere die vastloopt, zich onbegrepen voelt of de weg kwijt is. Gedrag is de buitenkant, wij richten ons op de mens erachter. Verandering ontstaat wanneer je schouder aan schouder samen optrekt met de jongere, het gezin en de leefomgeving. Wij zijn Samen Sterk en Zorgzaam.",
    tags: ["Missie & visie"],
  },
  {
    cat: "Doelgroep",
    titel: "Voor wie wij er zijn",
    tekst: "Jongeren van 12 tot 18 die vastlopen in gedrag, ontwikkeling of omgeving.",
    hash: "doelgroep",
    inhoud:
      "Er zijn als het schuurt. Jongeren van 12 tot 18 die vastlopen in gedrag, ontwikkeling of omgeving. Juist wanneer reguliere zorg geen aansluiting vindt zoeken wij het contact dat verandering mogelijk maakt. Verbinding eerst, het hele systeem, maatwerk en geen traject. Wij bereiken jongeren die zijn afgehaakt bij reguliere zorg. School, spijbelen, verzuim, thuiszitter, thuissituatie, motivatie, gezin, straat, ouders, dochter, zoon, kind, puber, tiener.",
    tags: ["Voor wie wij er zijn"],
  },
  {
    cat: "Aanpak",
    titel: "Cultuursensitief & relationeel werken",
    tekst: "Aansluiten bij de leefwereld als basis voor vertrouwen.",
    hash: "aanpak",
    inhoud:
      "De leefwereld van de jongere is ons vertrekpunt: taal, straatcultuur, sociale codes, groepsdruk en loyaliteit. Door die werkelijkheid serieus te nemen ontstaat herkenning en ruimte om te sturen. Aansluiten bij de leefwereld en de taal van de jongere. Denken vanuit potentieel, niet vanuit het dossier. Presentie en nabijheid op de momenten die tellen. Betrouwbare relatie, erkennen leefwereld, eigenaarschap.",
    tags: ["Onze aanpak", "Cultuursensitief werken"],
  },
  {
    cat: "Aanpak",
    titel: "Systemisch werken & netwerkversterking",
    tekst: "Het gezin en netwerk actief betrekken bij de begeleiding.",
    hash: "aanpak",
    inhoud:
      "Een jongere ontwikkelt zich nooit los van de omgeving. Wij betrekken vanaf dag een ouders, school, netwerk en betrokken professionals. Gezinsdynamiek: patronen doorbreken en communicatie herstellen. Veiligheid en structuur: duidelijke kaders en de-escalatie. Een dragend informeel netwerk voor borging na de begeleiding.",
    tags: ["Onze aanpak", "Systemisch werken & netwerk"],
  },
  {
    cat: "Aanpak",
    titel: "Executieve functies & gedragsverandering",
    tekst: "Werken aan plannen, impulsregulatie en zelfsturing.",
    hash: "aanpak",
    inhoud:
      "Achter onwil zit vaak een achterstand in de vaardigheden om gedrag, gedachten en emoties te sturen. Impulscontrole en emotieregulatie: pauzeren voor escalatie. Plannen en uitvoeren: structuur, prioriteiten, afmaken. Zelfreflectie en eigenaarschap zonder schuld of schaamte. Concentratie, uitstelgedrag, agressie, boosheid.",
    tags: ["Onze aanpak", "Executieve functies"],
  },
  {
    cat: "Aanpak",
    titel: "Praktijkgerichte interventies & talentontwikkeling",
    tekst: "Sport, coaching en doen als motor voor groei.",
    hash: "aanpak",
    inhoud:
      "Veel jongeren leren makkelijker in beweging dan aan tafel. We verbinden gesprekken aan doen, ervaren en oefenen, waar passend met principes uit de cognitieve gedragstherapie CGT. Fase 1 stabilisatie: rust, ritme en veiligheid. Fase 2 talent: interesses, sport, leertrajecten. Fase 3 leren en werken: onderwijs, BBL of werk. Sport, coaching, stage, leerwerktraject, uitstroom.",
    tags: ["Onze aanpak", "Sport & talentontwikkeling"],
  },
  {
    cat: "Kwaliteit",
    titel: "Privacy",
    tekst: "Hoe wij omgaan met persoonsgegevens van jongeren en gezinnen.",
    to: "/kwaliteit",
    toHash: "privacy",
    inhoud:
      "Privacyreglement. Wij verwerken persoonsgegevens van jongeren, ouders, verzorgers en verwijzers uitsluitend om goede begeleiding te bieden, volgens de AVG en de Jeugdwet. Doelbinding, toegang tot het dossier, bewaartermijn en jouw rechten op inzage, correctie of verwijdering. Alleen direct betrokken begeleiders hebben toegang. Delen met derden gebeurt met toestemming.",
    tags: ["Kwaliteit & privacy"],
  },
  {
    cat: "Kwaliteit",
    titel: "Cookies",
    tekst: "Wat deze website wel en niet bijhoudt.",
    to: "/kwaliteit",
    toHash: "cookies",
    inhoud:
      "Cookieverklaring. Deze website gebruikt uitsluitend functionele cookies. Geen tracking of advertentiecookies, wij volgen je niet over andere websites. De contactkaart laadt kaartmateriaal van OpenStreetMap en CARTO, daarbij wordt je IP-adres gedeeld. Cookies zelf beheren via je browserinstellingen.",
    tags: ["Kwaliteit & privacy"],
  },
  {
    cat: "Kwaliteit",
    titel: "Klachtenregeling",
    tekst: "Samen oplossen, serieus nemen — in drie duidelijke stappen.",
    to: "/kwaliteit",
    toHash: "klachten",
    inhoud:
      "Klachtenregeling, laagdrempelig en onafhankelijk. Niet tevreden over de begeleiding? Bespreek het eerst met de begeleider of de oprichters. Dien daarna schriftelijk een klacht in, je krijgt binnen vijf werkdagen een reactie. Komen we er samen niet uit, dan kun je terecht bij een onafhankelijke klachtenfunctionaris of vertrouwenspersoon, onder andere JeugdStem en AKJ, kosteloos.",
    tags: ["Kwaliteit & privacy", "Klachtenregeling"],
  },
  {
    cat: "Kwaliteit",
    titel: "Disclaimer",
    tekst: "Wat je mag verwachten van de informatie op deze site.",
    to: "/kwaliteit",
    toHash: "disclaimer",
    inhoud:
      "Disclaimer. Deze website informeert jongeren, ouders en opvoeders, verwijzers en opdrachtgevers. Aan de informatie kunnen geen rechten worden ontleend. Namen en fotos van jongeren zijn in verband met privacy gefingeerd, voor fotografie wordt gebruikgemaakt van modellen.",
    tags: ["Kwaliteit & privacy"],
  },
  {
    cat: "Aanmelden",
    titel: "Een jongere aanmelden",
    tekst: "Het aanmeldformulier — wij reageren binnen twee werkdagen.",
    to: "/aanmelden",
    inhoud:
      "Aanmelden of aanmelding van een jongere, zoon, dochter of client. Het aanmeldformulier in vijf stappen: wie meldt aan als ouder, verzorger, professional of verwijzer, gegevens van de jongere met geboortedatum en BSN, adres, contactgegevens en de situatie. Wij reageren binnen twee werkdagen. Ook voor een eerste kennismaking of vrijblijvend gesprek. Spoed of regulier. Mailen kan ook rechtstreeks naar aanmelden@sterkzorgzaam.nl.",
    tags: ["Aanmelden"],
  },
  {
    cat: "Oprichters",
    titel: "Maak kennis met de oprichters",
    tekst: "Miriam Twilt-Mendonça en Giovanni Peters over hun werk.",
    hash: "oprichters",
    inhoud:
      "Wie zijn wij, wie zit er achter Samen Sterk en Zorgzaam: Miriam Twilt-Mendonca en Giovanni Peters, oprichters en directie. Over ons, het team, ervaring en achtergrond. Miriam bewaakt kwaliteit, verbindt mensen en processen en put uit haar ervaring in het onderwijs en directierollen binnen justitie. Giovanni maakt contact, was treinmachinist en personal trainer en verbindt sport, coaching en dagelijkse begeleiding. Twee perspectieven, een betrokken missie.",
    tags: ["Missie & visie"],
  },
  {
    cat: "Passende zorg",
    titel: "Wanneer wij niet de juiste match zijn",
    tekst: "Wvggz, crisis, verslaving, veiligheid en zorgweigering.",
    hash: "geenmatch",
    inhoud:
      "Wanneer wij niet de juiste match zijn. Wettelijk dwingend kader zoals Wvggz, Wzd, gesloten plaatsing of verplichte opname, wij werken vanuit vrijwilligheid. Acute psychiatrische nood, ernstige ontregeling of suicidaliteit vraagt specialistische GGZ of klinische behandeling. Ernstige verslavingsproblematiek waarbij detox eerst nodig is. Ernstige veiligheidsrisicos en onbeheersbare agressie. Volledige zorgweigering.",
    tags: ["Voor wie wij er zijn"],
  },
  {
    cat: "Contact",
    titel: "Bezoek & contact",
    tekst: "Adres, telefoon, mail en onze bereikbaarheid.",
    hash: "contact",
    inhoud:
      "Contact, bezoek en bereikbaarheid. Graze Weitje 22, 3077 BM Rotterdam. Telefoon 06 288 730 94, mail hallo@sterkzorgzaam.nl. Route, adres, bezoekadres en locatie: waar zitten wij en hoe kom ik er. Aanmelden of eerst kennismaken, wij denken graag mee. Bereikbaarheid, openingstijden, afspraak maken. Samen werken aan duurzaam perspectief.",
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

/*
 * Zoeken gebeurt per woord en verdraagt typefouten. Zo vindt "hoe meld ik mijn
 * zoon aan" de aanmeldpagina, ook al staat het woord "zoon" nergens letterlijk.
 */

/** Alles waarop een item gevonden mag worden, als één doorzoekbare regel. */
function zoekveld(it: Resultaat) {
  return `${it.titel} ${it.cat} ${it.tags.join(" ")} ${it.tekst} ${it.inhoud ?? ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const VELDEN = new Map(ITEMS.map((it) => [it, zoekveld(it)]));
const TITELS = new Map(
  ITEMS.map((it) => [it, `${it.titel} ${it.cat} ${it.tags.join(" ")}`.toLowerCase()]),
);

const fuse = new Fuse(ITEMS, {
  keys: [
    { name: "titel", weight: 3 },
    { name: "cat", weight: 2 },
    { name: "tags", weight: 2 },
    { name: "tekst", weight: 1.5 },
    { name: "inhoud", weight: 1 },
  ],
  threshold: 0.36,
  ignoreLocation: true,
  minMatchCharLength: 3,
  includeScore: true,
});

/** Woorden die in vrijwel elke vraag zitten en dus niets onderscheiden. */
const STOPWOORDEN = new Set([
  "aan",
  "als",
  "ben",
  "bij",
  "dat",
  "de",
  "den",
  "der",
  "die",
  "dit",
  "een",
  "en",
  "er",
  "het",
  "hoe",
  "hun",
  "ik",
  "in",
  "is",
  "je",
  "kan",
  "kun",
  "me",
  "met",
  "mij",
  "mijn",
  "naar",
  "niet",
  "of",
  "om",
  "ons",
  "onze",
  "op",
  "over",
  "te",
  "tot",
  "uit",
  "van",
  "voor",
  "waar",
  "wat",
  "we",
  "wie",
  "wij",
  "zijn",
  "zo",
]);

/**
 * Filtert op de aangevinkte onderwerpen en, vanaf twee tekens, op de ingetypte
 * vraag. Beide tegelijk werkt als een verfijning: eerst zoeken, dan filteren.
 */
export function zoeken(sel: Record<string, boolean>, query = "") {
  const actief = ALLE_FILTERS.filter((l) => sel[l]);
  const q = query.trim();

  if (q.length < 2) {
    const resultaten = actief.length ? ITEMS.filter((it) => it.tags.some((t) => sel[t])) : [];
    return { actief, resultaten };
  }

  /* Per woord zoeken en de scores optellen: een item dat op meerdere woorden
     aanslaat komt bovenaan. */
  const woorden = q
    .toLowerCase()
    .split(/[^a-zà-ÿ0-9]+/i)
    .filter((w) => w.length >= 3 && !STOPWOORDEN.has(w));

  const punten = new Map<Resultaat, number>();
  const tel = (item: Resultaat, winst: number) => punten.set(item, (punten.get(item) ?? 0) + winst);

  for (const woord of woorden.length > 0 ? woorden : [q.toLowerCase()]) {
    /* Staat het woord er letterlijk? Dat weegt het zwaarst. De stam zonder
       laatste letter vangt verbuigingen op: "spijbelt" vindt "spijbelen". */
    const stam = woord.length > 5 ? woord.slice(0, -1) : woord;
    for (const [item, veld] of VELDEN) {
      if (!veld.includes(stam)) continue;
      tel(item, TITELS.get(item)!.includes(stam) ? 1.6 : 1);
    }
    /* Daarnaast fuzzy, voor typefouten — maar met minder gewicht. */
    for (const treffer of fuse.search(woord)) {
      tel(treffer.item, (1 - (treffer.score ?? 1)) * 0.5);
    }
  }

  /* Alleen treffers die in de buurt komen van de beste; anders sleept een
     vage match op één woord de halve site mee. */
  const gesorteerd = [...punten.entries()].sort((a, b) => b[1] - a[1]);
  const beste = gesorteerd[0]?.[1] ?? 0;
  let resultaten = gesorteerd
    .filter(([, score]) => score >= Math.max(0.9, beste * 0.4))
    .slice(0, 8)
    .map(([item]) => item);

  if (actief.length) resultaten = resultaten.filter((it) => it.tags.some((t) => sel[t]));
  return { actief, resultaten };
}
