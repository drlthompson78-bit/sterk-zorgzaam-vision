import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { FadeLink } from "@/components/site/nav";
import { PortaalInloggen } from "@/components/portaal/Inloggen";
import { Bestanden } from "@/components/portaal/Bestanden";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/portaal")({
  component: Portaal,
  head: () => ({
    meta: [
      { title: "Documentenportaal — Sterk & Zorgzaam" },
      /* Niet in Google: dit is een afgeschermde omgeving. */
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function Portaal() {
  const [session, setSession] = useState<Session | null>(null);
  const [naam, setNaam] = useState("");
  const [beheerder, setBeheerder] = useState(false);
  const [geladen, setGeladen] = useState(false);

  /* Sessie ophalen en blijven volgen (in- en uitloggen, verlopen sessie). */
  useEffect(() => {
    if (!supabase) {
      setGeladen(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setGeladen(true);
    });
    const { data: luisteraar } = supabase.auth.onAuthStateChange((_gebeurtenis, nieuwe) => {
      setSession(nieuwe);
    });
    return () => luisteraar.subscription.unsubscribe();
  }, []);

  /* Rol bepaalt of de beheerknoppen zichtbaar zijn. De database bewaakt dit
     zelf ook: zonder de rol 'beheerder' weigert de opslag een upload. */
  useEffect(() => {
    if (!supabase || !session) {
      setBeheerder(false);
      setNaam("");
      return;
    }
    supabase
      .from("profielen")
      .select("naam, rol")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setBeheerder(data?.rol === "beheerder");
        setNaam(data?.naam || session.user.email || "");
      });
  }, [session]);

  return (
    <div className="pz-root" lang="nl">
      <header className="pz-header">
        <FadeLink to="/" aria-label="Naar de website">
          <img src="/assets/logo.svg" alt="Sterk & Zorgzaam" />
        </FadeLink>
        {session && (
          <div className="pz-headerrechts">
            <span className="pz-wie">
              {naam}
              {beheerder && <b> · beheerder</b>}
            </span>
            <button type="button" onClick={() => supabase?.auth.signOut()} className="pz-uitloggen">
              Uitloggen
            </button>
          </div>
        )}
      </header>

      <main className="pz-main">
        {!supabase ? (
          <div className="pz-inlogkaart">
            <p className="pz-eyebrow">Documentenportaal</p>
            <h1>Nog niet gekoppeld</h1>
            <p className="pz-sub">
              Het portaal staat klaar, maar de database is nog niet verbonden. Koppel Supabase aan
              dit project; daarna werkt het inloggen meteen.
            </p>
          </div>
        ) : !geladen ? (
          <p className="pz-leeg">Even geduld…</p>
        ) : !session ? (
          <PortaalInloggen />
        ) : (
          <>
            <div className="pz-intro">
              <p className="pz-eyebrow">Documentenportaal</p>
              <h1>Documenten</h1>
              <p className="pz-sub">
                Kwaliteitsdocumentatie van Sterk &amp; Zorgzaam. Downloads worden vastgelegd.
              </p>
            </div>
            <Bestanden session={session} beheerder={beheerder} />
          </>
        )}
      </main>
    </div>
  );
}
