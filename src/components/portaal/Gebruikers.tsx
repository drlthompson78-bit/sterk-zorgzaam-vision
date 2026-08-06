import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  gebruikerUitnodigen,
  gebruikerVerwijderen,
  gebruikersLijst,
  rolWijzigen,
  type PortaalGebruiker,
} from "@/lib/gebruikers.functions";

/*
 * Beheerdersscherm: accounts uitnodigen, rollen wisselen en accounts
 * verwijderen. De server controleert bij elke actie opnieuw de rol.
 */

function leesbaarDatum(waarde: string | null) {
  if (!waarde) return "nog niet ingelogd";
  return new Date(waarde).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Gebruikers({ eigenId }: { eigenId: string }) {
  const lijstOphalen = useServerFn(gebruikersLijst);
  const uitnodigen = useServerFn(gebruikerUitnodigen);
  const wijzigen = useServerFn(rolWijzigen);
  const verwijderen = useServerFn(gebruikerVerwijderen);

  const [gebruikers, setGebruikers] = useState<PortaalGebruiker[]>([]);
  const [bezig, setBezig] = useState(true);
  const [fout, setFout] = useState("");
  const [melding, setMelding] = useState("");
  const [email, setEmail] = useState("");
  const [naam, setNaam] = useState("");
  const [rol, setRol] = useState<"auditor" | "beheerder">("auditor");
  const [wachtwoord, setWachtwoord] = useState("");
  const [versturen, setVersturen] = useState(false);

  const laden = useCallback(async () => {
    setBezig(true);
    setFout("");
    try {
      setGebruikers(await lijstOphalen({}));
    } catch (e) {
      setFout(e instanceof Error ? e.message : "Laden van gebruikers lukte niet.");
    }
    setBezig(false);
  }, [lijstOphalen]);

  useEffect(() => {
    void laden();
  }, [laden]);

  const toevoegen = async (e: React.FormEvent) => {
    e.preventDefault();
    setVersturen(true);
    setFout("");
    setMelding("");
    try {
      const res = await uitnodigen({
        data: {
          email: email.trim(),
          naam: naam.trim(),
          rol,
          ...(wachtwoord ? { wachtwoord } : {}),
        },
      });
      setMelding(
        res.uitgenodigd
          ? `Uitnodiging verstuurd naar ${email.trim()}.`
          : `Account aangemaakt voor ${email.trim()}.`,
      );
      setEmail("");
      setNaam("");
      setWachtwoord("");
      setRol("auditor");
      await laden();
    } catch (err) {
      setFout(err instanceof Error ? err.message : "Toevoegen lukte niet.");
    }
    setVersturen(false);
  };

  const rolZetten = async (id: string, nieuweRol: "auditor" | "beheerder") => {
    setFout("");
    setMelding("");
    try {
      await wijzigen({ data: { id, rol: nieuweRol } });
      await laden();
    } catch (err) {
      setFout(err instanceof Error ? err.message : "Rol wijzigen lukte niet.");
    }
  };

  const wissen = async (g: PortaalGebruiker) => {
    if (!window.confirm(`Account van ${g.email} definitief verwijderen?`)) return;
    setFout("");
    setMelding("");
    try {
      await verwijderen({ data: { id: g.id } });
      await laden();
    } catch (err) {
      setFout(err instanceof Error ? err.message : "Verwijderen lukte niet.");
    }
  };

  return (
    <div className="pz-gebruikers">
      <form className="pz-uitnodigen" onSubmit={toevoegen}>
        <h2>Gebruiker toevoegen</h2>
        <div className="pz-velden">
          <label>
            <span>E-mailadres</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@organisatie.nl"
            />
          </label>
          <label>
            <span>Naam</span>
            <input
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              placeholder="Voornaam Achternaam"
            />
          </label>
          <label>
            <span>Rol</span>
            <select value={rol} onChange={(e) => setRol(e.target.value as "auditor" | "beheerder")}>
              <option value="auditor">Auditor (alleen lezen)</option>
              <option value="beheerder">Beheerder</option>
            </select>
          </label>
          <label>
            <span>Wachtwoord (optioneel)</span>
            <input
              type="text"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              placeholder="Leeg = uitnodiging per e-mail"
              minLength={8}
            />
          </label>
        </div>
        <button type="submit" className="pz-knop-donker pz-knop-klein" disabled={versturen}>
          {versturen ? "Bezig…" : wachtwoord ? "Account aanmaken" : "Uitnodiging versturen"}
        </button>
      </form>

      {fout && <p className="pz-fout">{fout}</p>}
      {melding && <p className="pz-melding">{melding}</p>}

      {bezig ? (
        <p className="pz-leeg">Gebruikers laden…</p>
      ) : gebruikers.length === 0 ? (
        <p className="pz-leeg">Nog geen accounts.</p>
      ) : (
        <ul className="pz-gebruikerslijst">
          {gebruikers.map((g) => (
            <li key={g.id}>
              <div className="pz-gebruikerinfo">
                <strong>{g.naam || g.email}</strong>
                <span>{g.email}</span>
                <small>
                  {g.bevestigd ? "Bevestigd" : "Uitnodiging open"} · laatst ingelogd:{" "}
                  {leesbaarDatum(g.laatsteAanmelding)}
                </small>
              </div>
              <div className="pz-gebruikeracties">
                <select
                  value={g.rol}
                  onChange={(e) => rolZetten(g.id, e.target.value as "auditor" | "beheerder")}
                  disabled={g.id === eigenId}
                  aria-label={`Rol van ${g.email}`}
                >
                  <option value="auditor">Auditor</option>
                  <option value="beheerder">Beheerder</option>
                </select>
                <button
                  type="button"
                  className="pz-knop-omlijnd pz-knop-klein"
                  onClick={() => wissen(g)}
                  disabled={g.id === eigenId}
                >
                  Verwijderen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
