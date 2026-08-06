import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
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

  const mappen = items.filter((i) => i.id === null);
  const bestanden = items.filter((i) => i.id !== null);
  const kruimels = pad ? pad.split("/") : [];

  const volledigPad = (naam: string) => (pad ? `${pad}/${naam}` : naam);

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

  const uploaden = async (lijst: FileList | null, metMappen = false) => {
    if (!supabase || !lijst || lijst.length === 0) return;
    setUploadBezig(true);
    setFout("");
    for (const bestand of Array.from(lijst)) {
      /* Bij een hele map uploaden houden we de mappenstructuur intact. */
      const relatief = metMappen
        ? ((bestand as File & { webkitRelativePath?: string }).webkitRelativePath || bestand.name)
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
                <span className="pz-meta">Map</span>
                <ArrowRight stroke="#8a6420" width={14} />
              </button>
              {beheerder && (
                <button
                  type="button"
                  className="pz-verwijder"
                  onClick={() => verwijderen(map.name, true)}
                  aria-label={`Map ${map.name} verwijderen`}
                >
                  <Close stroke="#b4482f" width={14} />
                </button>
              )}
            </li>
          ))}

          {bestanden.map((bestand) => (
            <li key={bestand.name} className="pz-rij">
              <button type="button" onClick={() => downloaden(bestand.name)} className="pz-rijknop">
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
                <span className="pz-download">Downloaden</span>
              </button>
              {beheerder && (
                <button
                  type="button"
                  className="pz-verwijder"
                  onClick={() => verwijderen(bestand.name, false)}
                  aria-label={`${bestand.name} verwijderen`}
                >
                  <Close stroke="#b4482f" width={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
