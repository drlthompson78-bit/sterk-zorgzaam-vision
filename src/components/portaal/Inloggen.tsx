import { useState } from "react";
import { ArrowRight } from "@/components/site/icons";
import { inlogFout, supabase } from "@/lib/supabase";
import { lovable } from "@/integrations/lovable/index";

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
    const { data: uitdaging, error: uitdagingFout } = await supabase.auth.mfa.challenge({ factorId });
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

  const socialInloggen = async (provider: "google" | "apple") => {
    setFout("");
    setBezig(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: `${window.location.origin}/portaal`,
    });
    if (result.error) {
      setBezig(false);
      setFout("Inloggen via die dienst lukte niet. Probeer het opnieuw.");
      return;
    }
    if (result.redirected) return;
    await controleerTweestaps();
    setBezig(false);
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

      <div className="pz-scheiding">
        <span>of</span>
      </div>

      <div className="pz-social">
        <button
          type="button"
          className="pz-knop-omlijnd"
          onClick={() => socialInloggen("google")}
          disabled={bezig}
        >
          <svg className="pz-social-icoon" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.7 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.4-4.1 7.1-10.2 7.1-17.5z" />
            <path fill="#FBBC05" d="M10.4 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1z" />
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.7-3.7-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
          </svg>
          Doorgaan met Google
        </button>
        <button
          type="button"
          className="pz-knop-omlijnd"
          onClick={() => socialInloggen("apple")}
          disabled={bezig}
        >
          <svg className="pz-social-icoon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M16.365 1.43c0 1.14-.42 2.2-1.25 3.02-.9.9-1.98 1.42-3.05 1.34a3.1 3.1 0 0 1 1.28-3.06c.86-.83 2.06-1.35 3.02-1.3zM20.4 17.1c-.55 1.27-.82 1.84-1.53 2.96-.99 1.56-2.39 3.5-4.12 3.52-1.54.01-1.93-1-4.02-.99-2.09.01-2.52 1.01-4.06.99-1.73-.02-3.05-1.78-4.04-3.34C-.13 15.94-.42 10.8 1.28 8.07c1.2-1.93 3.1-3.06 4.89-3.06 1.82 0 2.97 1 4.47 1 1.46 0 2.35-1 4.46-1 1.6 0 3.29.87 4.5 2.37-3.95 2.17-3.31 7.8.8 9.72z" />
          </svg>
          Doorgaan met Apple
        </button>
      </div>

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
