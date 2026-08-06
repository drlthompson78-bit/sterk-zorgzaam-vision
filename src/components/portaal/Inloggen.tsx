import { useState } from "react";
import { ArrowRight } from "@/components/site/icons";
import { inlogFout, supabase } from "@/lib/supabase";

/** Echt inlogscherm van het documentenportaal. */
export function PortaalInloggen() {
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [herstelGestuurd, setHerstelGestuurd] = useState(false);

  const inloggen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBezig(true);
    setFout("");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: wachtwoord,
    });
    setBezig(false);
    if (error) setFout(inlogFout(error.message));
  };

  const wachtwoordVergeten = async () => {
    if (!supabase || !email.trim()) {
      setFout("Vul eerst je e-mailadres in, dan sturen we een herstellink.");
      return;
    }
    setFout("");
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/portaal`,
    });
    setHerstelGestuurd(true);
  };

  return (
    <div className="pz-inlogkaart">
      <img src="/assets/logo.svg" alt="Sterk & Zorgzaam" className="pz-inloglogo" />
      <p className="pz-eyebrow">Documentenportaal</p>
      <h1>Welkom</h1>
      <p className="pz-sub">Log in om bij de documenten te komen.</p>

      <form onSubmit={inloggen} className="pz-form">
        <label>
          E-mailadres
          <input
            type="email"
            inputMode="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="naam@voorbeeld.nl"
            required
          />
        </label>
        <label>
          Wachtwoord
          <input
            type="password"
            autoComplete="current-password"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {fout && (
          <p className="pz-fout" role="alert">
            {fout}
          </p>
        )}
        {herstelGestuurd && (
          <p className="pz-melding">
            We hebben een herstellink gestuurd naar {email.trim()}. Kijk ook in je spam.
          </p>
        )}

        <button type="submit" className="pz-knop-donker" disabled={bezig}>
          {bezig ? "Bezig met inloggen…" : "Inloggen"}
          {!bezig && <ArrowRight stroke="#d3a142" width={16} />}
        </button>
      </form>

      <button type="button" className="pz-tekstknop" onClick={wachtwoordVergeten}>
        Wachtwoord vergeten?
      </button>

      <p className="pz-voet">
        Geen account? Accounts worden op uitnodiging aangemaakt. Mail{" "}
        <a href="mailto:info@sterkzorgzaam.nl">info@sterkzorgzaam.nl</a>.
      </p>
    </div>
  );
}
