import { useEffect, useRef, useState } from "react";

/*
 * Gedeelde logica van het aanmeldformulier: elfproef, adres-autocomplete en de
 * mailto-samenvatting. Desktop en mobiel hebben een eigen layout, maar draaien
 * op deze regels.
 */

export type Rol = "Ouder / verzorger" | "Professional / verwijzer";
export type AdresStatus = "idle" | "loading" | "ok" | "fail";

export const ADRES_MELDING: Record<AdresStatus, [string, string]> = {
  idle: ["", "#647176"],
  loading: ["Adres opzoeken…", "#647176"],
  ok: ["Adres gevonden en ingevuld.", "#3f7d4e"],
  fail: ["Geen adres gevonden — vul straat en plaats zelf in.", "#b4482f"],
};

/** Elfproef: (9×d1 + 8×d2 + … + 2×d8 − 1×d9) deelbaar door 11. */
export function bsnGeldig(ruw: string) {
  const d = (ruw || "").replace(/\D/g, "");
  if (d.length !== 9) return false;
  let som = 0;
  for (let i = 0; i < 8; i++) som += Number(d[i]) * (9 - i);
  som -= Number(d[8]);
  return som > 0 && som % 11 === 0;
}

/** Zoekt straat en woonplaats op via de PDOK Locatieserver, met debounce. */
export function useAdresLookup(
  postcode: string,
  huisnummer: string,
  gevonden: (straat: string, woonplaats: string) => void,
) {
  const [status, setStatus] = useState<AdresStatus>("idle");
  const timer = useRef<number | undefined>(undefined);
  const melden = useRef(gevonden);
  melden.current = gevonden;

  useEffect(() => {
    const pc = postcode.replace(/\s/g, "").toUpperCase();
    const nr = huisnummer.trim();
    if (!/^[1-9]\d{3}[A-Z]{2}$/.test(pc) || !/^\d+/.test(nr)) return;

    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setStatus("loading");
      const cijfers = nr.match(/^\d+/)![0];
      try {
        const res = await fetch(
          "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?rows=1&fl=straatnaam,woonplaatsnaam" +
            `&fq=type:adres&fq=postcode:${pc}&fq=huisnummer:${cijfers}&q=${encodeURIComponent(`${pc} ${cijfers}`)}`,
        );
        const json = await res.json();
        const doc = json?.response?.docs?.[0];
        if (doc?.straatnaam) {
          melden.current(doc.straatnaam, doc.woonplaatsnaam || "");
          setStatus("ok");
        } else {
          setStatus("fail");
        }
      } catch {
        setStatus("fail");
      }
    }, 600);

    return () => window.clearTimeout(timer.current);
  }, [postcode, huisnummer]);

  return status;
}

export type Aanmeldgegevens = {
  rol: Rol | null;
  naamAanmelder: string;
  organisatie: string;
  voornaam: string;
  achternaam: string;
  gebdatum: string;
  bsn: string;
  straat: string;
  huisnummer: string;
  toevoeging: string;
  postcode: string;
  woonplaats: string;
  telefoon: string;
  email: string;
  urgentie: "Regulier" | "Spoed";
  toestemming: boolean;
  situatie: string;
};

/** Zet de aanmelding om in een mailto-link met de volledige samenvatting. */
export function bouwMailto(g: Aanmeldgegevens) {
  const adres = [
    g.straat,
    g.huisnummer + (g.toevoeging ? ` ${g.toevoeging}` : ""),
    g.postcode,
    g.woonplaats,
  ]
    .filter(Boolean)
    .join(", ");

  const regels = [
    "Aanmelding via sterkzorgzaam.nl",
    "",
    `Aangemeld door: ${g.rol || "Onbekend"}`,
    `Naam aanmelder: ${g.naamAanmelder || "-"}`,
    g.organisatie ? `Organisatie: ${g.organisatie}` : null,
    "",
    `Jongere: ${[g.voornaam, g.achternaam].filter(Boolean).join(" ")}`,
    `Geboortedatum: ${g.gebdatum || "-"}`,
    `BSN: ${g.bsn || "-"}`,
    `Adres: ${adres || "-"}`,
    "",
    `Telefoon: ${g.telefoon || "-"}`,
    `E-mail: ${g.email || "-"}`,
    "",
    `Urgentie: ${g.urgentie}`,
    `Toestemming gegeven: ${g.toestemming ? "ja" : "nee"}`,
    "",
    "Situatie:",
    g.situatie || "-",
  ].filter((r): r is string => r !== null);

  return (
    "mailto:aanmelden@sterkzorgzaam.nl?subject=" +
    encodeURIComponent(`Aanmelding — ${g.voornaam || "nieuwe jongere"} (${g.urgentie})`) +
    "&body=" +
    encodeURIComponent(regels.join("\n"))
  );
}

/** Alle formulierstate op één plek; desktop en mobiel renderen hem anders. */
export function useAanmelding() {
  const [step, setStep] = useState(0);
  const [rol, setRol] = useState<Rol | null>(null);
  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [gebdatum, setGebdatum] = useState("");
  const [bsn, setBsn] = useState("");
  const [bsnTouched, setBsnTouched] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [huisnummer, setHuisnummer] = useState("");
  const [toevoeging, setToevoeging] = useState("");
  const [straat, setStraat] = useState("");
  const [woonplaats, setWoonplaats] = useState("");
  const [naamAanmelder, setNaamAanmelder] = useState("");
  const [organisatie, setOrganisatie] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [email, setEmail] = useState("");
  const [situatie, setSituatie] = useState("");
  const [urgentie, setUrgentie] = useState<"Regulier" | "Spoed">("Regulier");
  const [toestemming, setToestemming] = useState(false);
  const [toestemmingFout, setToestemmingFout] = useState(false);

  const adresStatus = useAdresLookup(postcode, huisnummer, (s, w) => {
    setStraat(s);
    setWoonplaats(w);
  });

  const bsnCijfers = bsn.replace(/\D/g, "");
  const bsnOk = bsnGeldig(bsn);
  const bsnFout = bsnCijfers.length > 0 && (bsnTouched || bsnCijfers.length === 9) && !bsnOk;

  const gegevens: Aanmeldgegevens = {
    rol,
    naamAanmelder,
    organisatie,
    voornaam,
    achternaam,
    gebdatum,
    bsn,
    straat,
    huisnummer,
    toevoeging,
    postcode,
    woonplaats,
    telefoon,
    email,
    urgentie,
    toestemming,
    situatie,
  };

  const volgende = () => {
    if (step === 1 && bsnCijfers.length > 0 && !bsnOk) {
      setBsnTouched(true);
      return;
    }
    if (step === 4) {
      if (!toestemming) {
        setToestemmingFout(true);
        return;
      }
      window.location.href = bouwMailto(gegevens);
      setStep(5);
      return;
    }
    setStep(step + 1);
  };

  return {
    step,
    setStep,
    rol,
    setRol,
    voornaam,
    setVoornaam,
    achternaam,
    setAchternaam,
    gebdatum,
    setGebdatum,
    bsn,
    setBsn: (waarde: string) => {
      setBsn(waarde.replace(/\D/g, "").slice(0, 9));
      setBsnTouched(false);
    },
    bsnOk,
    bsnFout,
    postcode,
    setPostcode,
    huisnummer,
    setHuisnummer,
    toevoeging,
    setToevoeging,
    straat,
    setStraat,
    woonplaats,
    setWoonplaats,
    adresStatus,
    naamAanmelder,
    setNaamAanmelder,
    organisatie,
    setOrganisatie,
    telefoon,
    setTelefoon,
    email,
    setEmail,
    situatie,
    setSituatie,
    urgentie,
    setUrgentie,
    toestemming,
    setToestemming: (aan: boolean) => {
      setToestemming(aan);
      setToestemmingFout(false);
    },
    toestemmingFout,
    gegevens,
    volgende,
    vorige: () => setStep(Math.max(0, step - 1)),
  };
}
