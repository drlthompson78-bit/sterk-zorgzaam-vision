import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Close } from "@/components/site/icons";
import { BUCKET, supabase } from "@/lib/supabase";

/*
 * Bestandsbrowser van het documentenportaal. De mappenstructuur is de
 * padstructuur in de opslag; een lege map bestaat daar niet, dus die krijgt een
 * onzichtbaar plaatshouderbestand (net als in de Supabase-interface zelf).
 */

const PLAATSHOUDER = ".emptyFolderPlaceholder";

type Item = {
  name: string;
  id: string | null;
  updated_at?: string | null;
  metadata?: { size?: number; mimetype?: string } | null;
};

function leesbaarFormaat(bytes?: number) {
  if (bytes === undefined) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function leesbaarDatum(waarde?: string | null) {
  if (!waarde) return "";
  return new Date(waarde).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Bestanden({ session, beheerder }: { session: Session; beheerder: boolean }) {
  const [pad, setPad] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [bezig, setBezig] = useState(true);
  const [fout, setFout] = useState("");
  const [nieuweMap, setNieuweMap] = useState<string | null>(null);
  const [uploadBezig, setUploadBezig] = useState(false);
  const [selectie, setSelectie] = useState<string[]>([]);
  const [zipBezig, setZipBezig] = useState(false);
  const [melding, setMelding] = useState("");
  const [mapStats, setMapStats] = useState<Record<string, { aantal: number; bytes: number }>>({});
  const [hernoemDoel, setHernoemDoel] = useState<{ naam: string; isMap: boolean } | null>(null);
  const [hernoemNaam, setHernoemNaam] = useState("");
  const [keuze, setKeuze] = useState<Item | null>(null);
  const [bekijk, setBekijk] = useState<{ naam: string; url: string; type: string } | null>(null);
  const [bekijkBezig, setBekijkBezig] = useState(false);
  const bestandKiezer = useRef<HTMLInputElement>(null);
  const mapKiezer = useRef<HTMLInputElement>(null);

  const laden = useCallback(async () => {
    if (!supabase) return;
    setBezig(true);
    setFout("");
    const { data, error } = await supabase.storage.from(BUCKET).list(pad, {
      limit: 500,
      sortBy: { column: "name", order: "asc" },
    });
    setBezig(false);
    if (error) {
      setFout("De map kon niet worden geladen. Ververs de pagina of log opnieuw in.");
      return;
    }
    setItems((data ?? []).filter((i) => i.name !== PLAATSHOUDER) as Item[]);
  }, [pad]);

  useEffect(() => {
    laden();
  }, [laden]);

  /* Bij wisselen van map vervalt de selectie. */
  useEffect(() => {
    setSelectie([]);
  }, [pad]);

  const mappen = items.filter((i) => i.id === null);
  const bestanden = items.filter((i) => i.id !== null);
  const kruimels = pad ? pad.split("/") : [];

  const volledigPad = (naam: string) => (pad ? `${pad}/${naam}` : naam);

  /* Per map tellen hoeveel bestanden erin zitten (inclusief submappen) en
     hoeveel ruimte die innemen. */
  useEffect(() => {
    const db = supabase;
    if (!db || mappen.length === 0) return;
    let afgebroken = false;

    const meten = async (map: string): Promise<{ aantal: number; bytes: number }> => {
      const { data } = await db.storage.from(BUCKET).list(map, { limit: 500 });
      let aantal = 0;
      let bytes = 0;
      for (const item of data ?? []) {
        if (item.name === PLAATSHOUDER) continue;
        if (item.id === null) {
          const sub = await meten(`${map}/${item.name}`);
          aantal += sub.aantal;
          bytes += sub.bytes;
        } else {
          aantal += 1;
          bytes += (item as Item).metadata?.size ?? 0;
        }
      }
      return { aantal, bytes };
    };

    (async () => {
      for (const map of mappen) {
        const volledig = pad ? `${pad}/${map.name}` : map.name;
        const stat = await meten(volledig);
        if (afgebroken) return;
        setMapStats((huidig) => ({ ...huidig, [volledig]: stat }));
      }
    })();

    return () => {
      afgebroken = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pad, items]);

  const downloaden = async (naam: string) => {
    if (!supabase) return;
    const doelPad = volledigPad(naam);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(doelPad, 60, { download: naam });
    if (error || !data) {
      setFout("Downloaden lukte niet. Probeer het opnieuw.");
      return;
    }
    /* Vastleggen wie wat ophaalt — bewijs voor de audit. */
    await supabase.from("downloadlog").insert({ gebruiker: session.user.id, pad: doelPad });
    window.location.href = data.signedUrl;
  };

  /* Bekijken: dezelfde tijdelijke koppeling, maar zonder download-vlag zodat
     de browser het bestand in beeld toont in plaats van op te slaan. */
  const bekijken = async (bestand: Item) => {
    if (!supabase) return;
    setBekijkBezig(true);
    const doelPad = volledigPad(bestand.name);
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(doelPad, 600);
    setBekijkBezig(false);
    if (error || !data) {
      setFout("Het bestand kon niet worden geopend.");
      return;
    }
    const naam = bestand.name.toLowerCase();
    const mime = bestand.metadata?.mimetype ?? "";
    const type =
      mime.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|avif)$/.test(naam)
        ? "afbeelding"
        : mime.startsWith("video/") || /\.(mp4|webm|mov)$/.test(naam)
          ? "video"
          : mime.startsWith("audio/") || /\.(mp3|wav|m4a|ogg)$/.test(naam)
            ? "audio"
            : mime === "application/pdf" || naam.endsWith(".pdf")
              ? "pdf"
              : mime.startsWith("text/") || /\.(txt|csv|md|json|log)$/.test(naam)
                ? "tekst"
                : "onbekend";
    setKeuze(null);
    setBekijk({ naam: bestand.name, url: data.signedUrl, type });
  };

  const wisselSelectie = (naam: string) => {
    setSelectie((huidig) =>
      huidig.includes(naam) ? huidig.filter((n) => n !== naam) : [...huidig, naam],
    );
  };

  /* Meerdere bestanden gaan als één zip-bestand mee, zodat de browser
     niet meerdere downloads tegelijk hoeft te blokkeren. */
  const selectieDownloaden = async () => {
    if (!supabase || selectie.length === 0) return;
    setZipBezig(true);
    setFout("");
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const naam of selectie) {
        const doelPad = volledigPad(naam);
        const { data, error } = await supabase.storage.from(BUCKET).download(doelPad);
        if (error || !data) throw new Error(naam);
        zip.file(naam, data);
        await supabase.from("downloadlog").insert({ gebruiker: session.user.id, pad: doelPad });
      }
      const inhoud = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(inhoud);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pad ? pad.split("/").pop() : "documenten"}.zip`;
      link.click();
      URL.revokeObjectURL(url);
      setSelectie([]);
    } catch {
      setFout("Niet alle bestanden konden worden opgehaald. Probeer het opnieuw.");
    }
    setZipBezig(false);
  };

  /* "Delen" = een korte koppeling (7 dagen) op het klembord. De code verwijst
     naar het bestand; de lange ondertekende opslag-URL blijft binnenskamers. */
  const koppelingKopieren = async () => {
    if (!supabase || selectie.length === 0) return;
    setFout("");
    const links: string[] = [];
    for (const naam of selectie) {
      /* Zestien tekens uit 32 mogelijkheden: te veel om te raden, ook als
         iemand systematisch codes afgaat. */
      const code = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((n) => "abcdefghijkmnpqrstuvwxyz23456789"[n % 32])
        .join("");
      const { error } = await supabase.from("deellinks").insert({
        code,
        pad: volledigPad(naam),
        aangemaakt_door: session.user.id,
      });
      if (error) {
        setFout("De koppeling kon niet worden gemaakt.");
        return;
      }
      links.push(`${window.location.origin}/api/public/d/${code}`);
    }
    try {
      await navigator.clipboard.writeText(links.join("\n"));
      const tekst =
        selectie.length > 1 ? `${selectie.length} koppelingen gekopieerd` : "Koppeling gekopieerd";
      toast.success(tekst, {
        description: "Plak de link om te delen — 7 dagen geldig.",
      });
      setMelding(`${tekst} ✓`);
      window.setTimeout(() => setMelding(""), 4000);
    } catch {
      toast.error("Kopiëren naar het klembord lukte niet.");
      setFout("Kopiëren naar het klembord lukte niet.");
    }
  };

  const selectieVerwijderen = async () => {
    if (!supabase || selectie.length === 0) return;
    if (!window.confirm(`${selectie.length} bestand(en) verwijderen?`)) return;
    await supabase.storage.from(BUCKET).remove(selectie.map((n) => volledigPad(n)));
    setSelectie([]);
    laden();
  };

  const uploaden = async (lijst: FileList | null, metMappen = false) => {
    if (!supabase || !lijst || lijst.length === 0) return;
    setUploadBezig(true);
    setFout("");
    for (const bestand of Array.from(lijst)) {
      /* Bij een hele map uploaden houden we de mappenstructuur intact. */
      const relatief = metMappen
        ? (bestand as File & { webkitRelativePath?: string }).webkitRelativePath || bestand.name
        : bestand.name;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(volledigPad(relatief), bestand, { upsert: true });
      if (error) {
        setFout(`"${relatief}" kon niet worden geüpload: ${error.message}`);
        break;
      }
    }
    setUploadBezig(false);
    if (bestandKiezer.current) bestandKiezer.current.value = "";
    if (mapKiezer.current) mapKiezer.current.value = "";
    laden();
  };

  const mapAanmaken = async () => {
    if (!supabase || !nieuweMap?.trim()) return;
    const naam = nieuweMap.trim().replace(/[/\\]/g, "-");
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(`${volledigPad(naam)}/${PLAATSHOUDER}`, new Blob([""]), { upsert: true });
    setNieuweMap(null);
    if (error) {
      setFout("De map kon niet worden aangemaakt.");
      return;
    }
    laden();
  };

  /** Verwijdert een bestand, of een map inclusief alles wat erin zit. */
  const hernoemen = async () => {
    if (!supabase || !hernoemDoel) return;
    const nieuw = hernoemNaam.trim().replace(/[/\\]/g, "-");
    if (!nieuw || nieuw === hernoemDoel.naam) {
      setHernoemDoel(null);
      return;
    }
    const van = volledigPad(hernoemDoel.naam);
    const naar = volledigPad(nieuw);
    setFout("");

    if (!hernoemDoel.isMap) {
      const { error } = await supabase.storage.from(BUCKET).move(van, naar);
      if (error) setFout("Naam wijzigen lukte niet. Bestaat de nieuwe naam al?");
      setHernoemDoel(null);
      laden();
      return;
    }

    /* Een map is alleen een pad: alle objecten eronder verplaatsen. */
    const db = supabase;
    const paden: string[] = [];
    const doorlopen = async (map: string) => {
      const { data } = await db.storage.from(BUCKET).list(map, { limit: 500 });
      for (const item of data ?? []) {
        const kind = `${map}/${item.name}`;
        if (item.id === null) await doorlopen(kind);
        else paden.push(kind);
      }
    };
    await doorlopen(van);
    for (const oud of paden) {
      const { error } = await db.storage.from(BUCKET).move(oud, `${naar}${oud.slice(van.length)}`);
      if (error) {
        setFout("Niet alles kon worden hernoemd. Probeer het opnieuw.");
        break;
      }
    }
    setHernoemDoel(null);
    laden();
  };

  const startHernoemen = (naam: string, isMap: boolean) => {
    setHernoemDoel({ naam, isMap });
    setHernoemNaam(naam);
  };

  const hernoemVeld = (
    <span className="pz-hernoemveld">
      <input
        autoFocus
        value={hernoemNaam}
        onChange={(e) => setHernoemNaam(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") hernoemen();
          if (e.key === "Escape") setHernoemDoel(null);
        }}
        aria-label="Nieuwe naam"
      />
      <button type="button" onClick={hernoemen} aria-label="Naam opslaan">
        <Check stroke="#0d2028" width={16} />
      </button>
      <button type="button" onClick={() => setHernoemDoel(null)} aria-label="Annuleren">
        <Close stroke="#132a34" width={14} />
      </button>
    </span>
  );

  const potloodKnop = (naam: string, isMap: boolean) => (
    <button
      type="button"
      className="pz-hernoem"
      onClick={() => startHernoemen(naam, isMap)}
      aria-label={`Naam van ${naam} wijzigen`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="#5c7480" strokeWidth={1.7} width={15}>
        <path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16z" />
      </svg>
    </button>
  );

  const verwijderen = async (naam: string, isMap: boolean) => {
    if (!supabase) return;
    const doel = volledigPad(naam);
    const vraag = isMap
      ? `Map "${naam}" en alles wat erin zit verwijderen?`
      : `"${naam}" verwijderen?`;
    if (!window.confirm(vraag)) return;

    if (!isMap) {
      await supabase.storage.from(BUCKET).remove([doel]);
      laden();
      return;
    }

    /* Mappen bestaan alleen als pad: alle onderliggende objecten opsporen. */
    const db = supabase;
    const paden: string[] = [];
    const doorlopen = async (map: string) => {
      const { data } = await db.storage.from(BUCKET).list(map, { limit: 500 });
      for (const item of data ?? []) {
        const kind = `${map}/${item.name}`;
        if (item.id === null) await doorlopen(kind);
        else paden.push(kind);
      }
    };
    await doorlopen(doel);
    if (paden.length > 0) await supabase.storage.from(BUCKET).remove(paden);
    laden();
  };

  return (
    <div className="pz-browser">
      {keuze && (
        <div className="pz-overlay" role="dialog" aria-modal="true" onClick={() => setKeuze(null)}>
          <div className="pz-keuze" onClick={(e) => e.stopPropagation()}>
            <h3>{keuze.name}</h3>
            <p>Wat wil je met dit bestand doen?</p>
            <div className="pz-keuzeknoppen">
              <button
                type="button"
                className="pz-knop-donker pz-knop-klein"
                onClick={() => bekijken(keuze)}
                disabled={bekijkBezig}
              >
                {bekijkBezig ? "Bezig met openen…" : "Bekijken"}
              </button>
              <button
                type="button"
                className="pz-knop-omlijnd pz-knop-klein"
                onClick={() => {
                  const naam = keuze.name;
                  setKeuze(null);
                  downloaden(naam);
                }}
              >
                Downloaden
              </button>
              <button type="button" className="pz-keuzeannuleer" onClick={() => setKeuze(null)}>
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {bekijk && (
        <div className="pz-overlay" role="dialog" aria-modal="true" onClick={() => setBekijk(null)}>
          <div className="pz-viewer" onClick={(e) => e.stopPropagation()}>
            <header>
              <span className="pz-naam">{bekijk.naam}</span>
              <button
                type="button"
                className="pz-knop-omlijnd pz-knop-klein"
                onClick={() => downloaden(bekijk.naam)}
              >
                Downloaden
              </button>
              <button type="button" onClick={() => setBekijk(null)} aria-label="Sluiten">
                <Close stroke="#132a34" width={16} />
              </button>
            </header>
            <div className="pz-viewervlak">
              {bekijk.type === "afbeelding" ? (
                <img src={bekijk.url} alt={bekijk.naam} />
              ) : bekijk.type === "video" ? (
                <video src={bekijk.url} controls />
              ) : bekijk.type === "audio" ? (
                <audio src={bekijk.url} controls />
              ) : bekijk.type === "onbekend" ? (
                <p className="pz-leeg">
                  Dit bestandstype kan niet in beeld worden getoond. Download het om te openen.
                </p>
              ) : (
                <iframe src={bekijk.url} title={bekijk.naam} />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="pz-kruimels">
        <button type="button" onClick={() => setPad("")} className={pad ? undefined : "is-hier"}>
          Documenten
        </button>
        {kruimels.map((deel, i) => (
          <span key={deel + i}>
            <span aria-hidden="true" className="pz-sep">
              ›
            </span>
            <button
              type="button"
              onClick={() => setPad(kruimels.slice(0, i + 1).join("/"))}
              className={i === kruimels.length - 1 ? "is-hier" : undefined}
            >
              {deel}
            </button>
          </span>
        ))}
      </div>

      {beheerder && (
        <div className="pz-beheer">
          <button
            type="button"
            className="pz-knop-donker pz-knop-klein"
            onClick={() => bestandKiezer.current?.click()}
            disabled={uploadBezig}
          >
            {uploadBezig ? "Bezig met uploaden…" : "Bestanden toevoegen"}
          </button>
          <input
            ref={bestandKiezer}
            type="file"
            multiple
            hidden
            onChange={(e) => uploaden(e.target.files)}
          />
          <button
            type="button"
            className="pz-knop-omlijnd pz-knop-klein"
            onClick={() => mapKiezer.current?.click()}
            disabled={uploadBezig}
          >
            Map uploaden
          </button>
          <input
            ref={mapKiezer}
            type="file"
            multiple
            hidden
            /* @ts-expect-error niet-standaard maar breed ondersteund attribuut */
            webkitdirectory=""
            directory=""
            onChange={(e) => uploaden(e.target.files, true)}
          />
          {nieuweMap === null ? (
            <button
              type="button"
              className="pz-knop-omlijnd pz-knop-klein"
              onClick={() => setNieuweMap("")}
            >
              Nieuwe map
            </button>
          ) : (
            <span className="pz-nieuwemap">
              <input
                autoFocus
                value={nieuweMap}
                onChange={(e) => setNieuweMap(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") mapAanmaken();
                  if (e.key === "Escape") setNieuweMap(null);
                }}
                placeholder="Naam van de map"
              />
              <button type="button" onClick={mapAanmaken} aria-label="Map aanmaken">
                <Check stroke="#0d2028" width={16} />
              </button>
              <button type="button" onClick={() => setNieuweMap(null)} aria-label="Annuleren">
                <Close stroke="#132a34" width={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {fout && (
        <p className="pz-fout" role="alert">
          {fout}
        </p>
      )}

      {bestanden.length > 0 && (
        <div className="pz-actiebalk">
          <label className="pz-selectall">
            <input
              type="checkbox"
              checked={selectie.length > 0 && selectie.length === bestanden.length}
              onChange={(e) => setSelectie(e.target.checked ? bestanden.map((b) => b.name) : [])}
              aria-label="Alles selecteren"
            />
            {selectie.length > 0 ? `${selectie.length} geselecteerd` : "Alles selecteren"}
          </label>

          <span className="pz-actiescheiding" aria-hidden="true" />

          {/* Delen maakt een koppeling die zonder inloggen werkt; dat blijft
              een beheerdersbeslissing. */}
          {beheerder && (
            <button
              type="button"
              className="pz-actie"
              onClick={koppelingKopieren}
              disabled={selectie.length === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                <path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1L11.3 4.6" />
                <path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7" />
              </svg>
              Delen
            </button>
          )}

          <button
            type="button"
            className="pz-actie"
            onClick={selectieDownloaden}
            disabled={selectie.length === 0 || zipBezig}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
              <path d="M12 3v12" />
              <path d="m7 11 5 5 5-5" />
              <path d="M4 20h16" />
            </svg>
            {zipBezig ? "Bezig met inpakken…" : "Downloaden"}
          </button>

          {beheerder && (
            <button
              type="button"
              className="pz-actie pz-actie--rood"
              onClick={selectieVerwijderen}
              disabled={selectie.length === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                <path d="M4 7h16" />
                <path d="M9 7V5h6v2" />
                <path d="M6 7l1 13h10l1-13" />
              </svg>
              Verwijderen
            </button>
          )}

          {melding && <span className="pz-actiemelding">{melding}</span>}
        </div>
      )}

      {bezig ? (
        <p className="pz-leeg">Bezig met laden…</p>
      ) : items.length === 0 ? (
        <p className="pz-leeg">
          Deze map is nog leeg.
          {beheerder && " Voeg hierboven bestanden toe."}
        </p>
      ) : (
        <ul className="pz-lijst">
          {pad && (
            <li className="pz-rij pz-rij--terug">
              <button
                type="button"
                onClick={() => setPad(kruimels.slice(0, -1).join("/"))}
                className="pz-rijknop"
              >
                <ArrowLeft stroke="#8a6420" width={16} />
                <span className="pz-naam">Terug</span>
              </button>
            </li>
          )}

          {mappen.map((map) => (
            <li key={map.name} className="pz-rij">
              {hernoemDoel?.isMap && hernoemDoel.naam === map.name ? (
                hernoemVeld
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setPad(volledigPad(map.name))}
                    className="pz-rijknop"
                  >
                    <span className="pz-icoon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#d3a142" strokeWidth={1.7}>
                        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                    </span>
                    <span className="pz-naam">{map.name}</span>
                    <span className="pz-meta">
                      {mapStats[volledigPad(map.name)]
                        ? `${mapStats[volledigPad(map.name)]!.aantal} bestand${
                            mapStats[volledigPad(map.name)]!.aantal === 1 ? "" : "en"
                          } · ${leesbaarFormaat(mapStats[volledigPad(map.name)]!.bytes)}`
                        : "Map"}
                    </span>
                    <ArrowRight stroke="#8a6420" width={14} />
                  </button>
                  {beheerder && (
                    <>
                      {potloodKnop(map.name, true)}
                      <button
                        type="button"
                        className="pz-verwijder"
                        onClick={() => verwijderen(map.name, true)}
                        aria-label={`Map ${map.name} verwijderen`}
                      >
                        <Close stroke="#b4482f" width={14} />
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}

          {bestanden.map((bestand) => (
            <li key={bestand.name} className="pz-rij">
              {hernoemDoel && !hernoemDoel.isMap && hernoemDoel.naam === bestand.name ? (
                hernoemVeld
              ) : (
                <>
                  <label className="pz-vink" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectie.includes(bestand.name)}
                      onChange={() => wisselSelectie(bestand.name)}
                      aria-label={`${bestand.name} selecteren`}
                    />
                  </label>
                  <button type="button" onClick={() => setKeuze(bestand)} className="pz-rijknop">
                    <span className="pz-icoon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#8a6420" strokeWidth={1.7}>
                        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                        <path d="M14 3v5h5" />
                      </svg>
                    </span>
                    <span className="pz-naam">{bestand.name}</span>
                    <span className="pz-meta">
                      {leesbaarFormaat(bestand.metadata?.size)}
                      {bestand.updated_at && ` · ${leesbaarDatum(bestand.updated_at)}`}
                    </span>
                    <span className="pz-download">Openen</span>
                  </button>
                  {beheerder && (
                    <>
                      {potloodKnop(bestand.name, false)}
                      <button
                        type="button"
                        className="pz-verwijder"
                        onClick={() => verwijderen(bestand.name, false)}
                        aria-label={`${bestand.name} verwijderen`}
                      >
                        <Close stroke="#b4482f" width={14} />
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
