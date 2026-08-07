import { useState } from "react";
import { ArrowRight, Close } from "@/components/site/icons";
import { FadeLink } from "@/components/site/nav";
import { inlogFout, supabase } from "@/lib/supabase";

/** Echt inlogscherm van het documentenportaal. */
export function PortaalInloggen() {
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [herstelGestuurd, setHerstelGestuurd] = useState(false);

  /* Tweestapsverificatie: gevuld zodra het account een extra code vraagt. */
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");

  /* Vraagt het account om een extra code? Zo ja: toon het codescherm. */
  const controleerTweestaps = async () => {
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!data || data.currentLevel === data.nextLevel) return false;
    const { data: factoren } = await supabase.auth.mfa.listFactors();
    const factor = factoren?.totp?.[0];
    if (!factor) return false;
    setFactorId(factor.id);
    return true;
  };

  const inloggen = async (e: React.FormEvent) => {
    e.preventDefault();
    setBezig(true);
    setFout("");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: wachtwoord,
    });
    if (error) {
      setBezig(false);
      setFout(inlogFout(error.message));
      return;
    }
    await controleerTweestaps();
    setBezig(false);
  };

  const codeVersturen = async (e: React.FormEvent) => {
    e.preventDefault();
    setBezig(true);
    setFout("");
    const { data: uitdaging, error: uitdagingFout } = await supabase.auth.mfa.challenge({
      factorId,
    });
    if (uitdagingFout || !uitdaging) {
      setBezig(false);
      setFout(inlogFout(uitdagingFout?.message ?? ""));
      return;
    }
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: uitdaging.id,
      code: code.trim(),
    });
    setBezig(false);
    if (error) setFout(inlogFout(error.message));
  };

  const wachtwoordVergeten = async () => {
    if (!email.trim()) {
      setFout("Vul eerst je e-mailadres in, dan sturen we een herstellink.");
      return;
    }
    setFout("");
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/portaal`,
    });
    setHerstelGestuurd(true);
  };

  if (factorId) {
    return (
      <div className="pz-inlogkaart">
        <img src="/assets/logo.svg" alt="Sterk & Zorgzaam" className="pz-inloglogo" />
        <p className="pz-eyebrow">Tweestapsverificatie</p>
        <h1>Nog één stap</h1>
        <p className="pz-sub">Vul de code van zes cijfers uit je authenticator-app in.</p>

        <form onSubmit={codeVersturen} className="pz-form">
          <label>
            Verificatiecode
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
            />
          </label>
          {fout && (
            <p className="pz-fout" role="alert">
              {fout}
            </p>
          )}
          <button type="submit" className="pz-knop-donker" disabled={bezig}>
            {bezig ? "Bezig met controleren…" : "Bevestigen"}
            {!bezig && <ArrowRight stroke="#d3a142" width={16} />}
          </button>
        </form>

        <button
          type="button"
          className="pz-tekstknop"
          onClick={async () => {
            await supabase.auth.signOut();
            setFactorId("");
            setCode("");
          }}
        >
          Annuleren
        </button>
      </div>
    );
  }

  return (
    <div className="pz-inlogkaart">
      <FadeLink to="/" className="pz-sluit" aria-label="Sluiten">
        <Close stroke="#132a34" width={14} />
      </FadeLink>
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
        <a href="mailto:hallo@sterkzorgzaam.nl">hallo@sterkzorgzaam.nl</a>.
      </p>
    </div>
  );
}
