import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { FadeLink } from "@/components/site/nav";
import { PortaalInloggen } from "@/components/portaal/Inloggen";
import achtergrond from "@/assets/portaal-achtergrond.png.asset.json";
import { Bestanden } from "@/components/portaal/Bestanden";
import { Gebruikers } from "@/components/portaal/Gebruikers";
import { Deellinks } from "@/components/portaal/Deellinks";
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
  const [tab, setTab] = useState<"documenten" | "gebruikers" | "deellinks">("documenten");

  /* Sessie ophalen en blijven volgen (in- en uitloggen, verlopen sessie). */
  useEffect(() => {
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
    if (!session) {
      setBeheerder(false);
      setNaam("");
      return;
    }
    const laadProfiel = async () => {
      const { data } = await supabase
        .from("profielen")
        .select("naam, rol")
        .eq("id", session.user.id)
        .maybeSingle();
      if (!data) {
        /* Eerste keer inloggen: profiel aanmaken met de standaardrol. */
        const naamUitAccount =
          (session.user.user_metadata?.["naam"] as string | undefined) ??
          (session.user.user_metadata?.["full_name"] as string | undefined) ??
          "";
        await supabase.from("profielen").insert({ id: session.user.id, naam: naamUitAccount });
        setBeheerder(false);
        setNaam(naamUitAccount || session.user.email || "");
        return;
      }
      setBeheerder(data.rol === "beheerder");
      setNaam(data.naam || session.user.email || "");
    };
    void laadProfiel();
  }, [session]);

  return (
    <div
      className={`pz-root${!session && geladen ? " pz-root--inlog" : ""}`}
      lang="nl"
      style={!session && geladen ? { backgroundImage: `url(${achtergrond.url})` } : undefined}
    >
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
            <button type="button" onClick={() => supabase.auth.signOut()} className="pz-uitloggen">
              Uitloggen
            </button>
          </div>
        )}
      </header>

      <main className="pz-main">
        {!geladen ? (
          <p className="pz-leeg">Even geduld…</p>
        ) : !session ? (
          <PortaalInloggen />
        ) : (
          <>
            <div className="pz-intro">
              <p className="pz-eyebrow">Documentenportaal</p>
              <h1>
                {tab === "gebruikers"
                  ? "Gebruikers"
                  : tab === "deellinks"
                    ? "Deelkoppelingen"
                    : "Documenten"}
              </h1>
              <p className="pz-sub">
                {tab === "gebruikers"
                  ? "Accounts uitnodigen, rollen wisselen en toegang intrekken."
                  : tab === "deellinks"
                    ? "Openbare koppelingen: wat loopt er, hoe vaak is het opgehaald, en intrekken."
                    : "Kwaliteitsdocumentatie van Sterk & Zorgzaam. Downloads worden vastgelegd."}
              </p>
            </div>
            {beheerder && (
              <div className="pz-tabs">
                <button
                  type="button"
                  className={tab === "documenten" ? "is-hier" : undefined}
                  onClick={() => setTab("documenten")}
                >
                  Documenten
                </button>
                <button
                  type="button"
                  className={tab === "gebruikers" ? "is-hier" : undefined}
                  onClick={() => setTab("gebruikers")}
                >
                  Gebruikers
                </button>
                <button
                  type="button"
                  className={tab === "deellinks" ? "is-hier" : undefined}
                  onClick={() => setTab("deellinks")}
                >
                  Deelkoppelingen
                </button>
              </div>
            )}
            {beheerder && tab === "gebruikers" ? (
              <Gebruikers eigenId={session.user.id} />
            ) : beheerder && tab === "deellinks" ? (
              <Deellinks />
            ) : (
              <Bestanden session={session} beheerder={beheerder} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
