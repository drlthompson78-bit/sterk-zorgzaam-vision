import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Close } from "@/components/site/icons";
import { supabase } from "@/lib/supabase";

/*
 * Overzicht van openbare deelkoppelingen. Die werken zónder inloggen, dus een
 * beheerder moet kunnen zien wat er loopt, hoe vaak het is opgehaald, en het
 * kunnen intrekken voordat de koppeling vanzelf verloopt.
 */

type Deellink = {
  id: string;
  code: string;
  pad: string;
  vervalt: string;
  created_at: string;
};

function datumTijd(waarde: string) {
  return new Date(waarde).toLocaleString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Deellinks() {
  const [links, setLinks] = useState<Deellink[]>([]);
  const [gebruik, setGebruik] = useState<Record<string, { aantal: number; laatst: string }>>({});
  const [bezig, setBezig] = useState(true);
  const [fout, setFout] = useState("");

  const laden = useCallback(async () => {
    setBezig(true);
    setFout("");
    const { data, error } = await supabase
      .from("deellinks")
      .select("id, code, pad, vervalt, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setBezig(false);
      setFout("De koppelingen konden niet worden geladen.");
      return;
    }
    setLinks(data ?? []);

    /* Het gebruikslogboek bestaat pas na de migratie; ontbreekt het, dan tonen
       we de lijst gewoon zonder tellingen. */
    const logboek = supabase as unknown as {
      from: (t: string) => {
        select: (k: string) => Promise<{ data: { code: string; tijdstip: string }[] | null }>;
      };
    };
    try {
      const { data: regels } = await logboek.from("deellink_gebruik").select("code, tijdstip");
      const telling: Record<string, { aantal: number; laatst: string }> = {};
      for (const regel of regels ?? []) {
        const huidig = telling[regel.code];
        telling[regel.code] = {
          aantal: (huidig?.aantal ?? 0) + 1,
          laatst: !huidig || regel.tijdstip > huidig.laatst ? regel.tijdstip : huidig.laatst,
        };
      }
      setGebruik(telling);
    } catch {
      setGebruik({});
    }
    setBezig(false);
  }, []);

  useEffect(() => {
    void laden();
  }, [laden]);

  const intrekken = async (link: Deellink) => {
    const naam = link.pad.split("/").pop() ?? link.pad;
    if (!window.confirm(`Koppeling naar "${naam}" intrekken? De link werkt daarna niet meer.`)) {
      return;
    }
    const { error } = await supabase.from("deellinks").delete().eq("id", link.id);
    if (error) {
      toast.error("Intrekken lukte niet.");
      return;
    }
    toast.success("Koppeling ingetrokken");
    void laden();
  };

  const nu = Date.now();
  const lopend = links.filter((l) => new Date(l.vervalt).getTime() >= nu);
  const verlopen = links.filter((l) => new Date(l.vervalt).getTime() < nu);

  if (bezig) return <p className="pz-leeg">Bezig met laden…</p>;

  return (
    <div className="pz-browser">
      {fout && (
        <p className="pz-fout" role="alert">
          {fout}
        </p>
      )}

      <p className="pz-sub" style={{ marginBottom: 18 }}>
        Deze koppelingen werken zonder inloggen. Iedereen die de link heeft, kan het document
        ophalen tot het moment van verlopen.
      </p>

      {lopend.length === 0 ? (
        <p className="pz-leeg">Er lopen op dit moment geen koppelingen.</p>
      ) : (
        <ul className="pz-lijst">
          {lopend.map((link) => {
            const stat = gebruik[link.code];
            return (
              <li key={link.id} className="pz-rij">
                <span className="pz-rijknop" style={{ cursor: "default" }}>
                  <span className="pz-naam">{link.pad}</span>
                  <span className="pz-meta">
                    verloopt {datumTijd(link.vervalt)}
                    {stat
                      ? ` · ${stat.aantal}× opgehaald, laatst ${datumTijd(stat.laatst)}`
                      : " · nog niet opgehaald"}
                  </span>
                </span>
                <button
                  type="button"
                  className="pz-verwijder"
                  onClick={() => intrekken(link)}
                  aria-label={`Koppeling naar ${link.pad} intrekken`}
                >
                  <Close stroke="#b4482f" width={14} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {verlopen.length > 0 && (
        <>
          <p className="pz-eyebrow" style={{ marginTop: 26 }}>
            Verlopen
          </p>
          <ul className="pz-lijst">
            {verlopen.map((link) => (
              <li key={link.id} className="pz-rij" style={{ opacity: 0.6 }}>
                <span className="pz-rijknop" style={{ cursor: "default" }}>
                  <span className="pz-naam">{link.pad}</span>
                  <span className="pz-meta">verlopen {datumTijd(link.vervalt)}</span>
                </span>
                <button
                  type="button"
                  className="pz-verwijder"
                  onClick={() => intrekken(link)}
                  aria-label={`Koppeling naar ${link.pad} opruimen`}
                >
                  <Close stroke="#b4482f" width={14} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
