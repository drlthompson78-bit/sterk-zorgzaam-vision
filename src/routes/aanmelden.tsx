import { createFileRoute } from "@tanstack/react-router";
import { TerugHeader } from "@/components/site/Header";
import { FadeLink } from "@/components/site/nav";
import { ArrowLeft, ArrowRight, Check, IconKoffer, IconOuder } from "@/components/site/icons";
import { MobielAanmelden } from "@/components/mobiel/MobielAanmelden";
import { ADRES_MELDING, bouwMailto, useAanmelding } from "@/lib/aanmelding";

export const Route = createFileRoute("/aanmelden")({
  component: Aanmelden,
  head: () => ({
    meta: [
      { title: "Aanmelden — Sterk & Zorgzaam" },
      {
        name: "description",
        content:
          "Meld een jongere aan of vraag een kennismaking aan. Wij nemen binnen twee werkdagen contact op.",
      },
    ],
  }),
});

function Aanmelden() {
  /* Zelfde regels als het mobiele formulier: elfproef, PDOK-adres, mailto. */
  const {
    step,
    setStep,
    setRol,
    voornaam,
    setVoornaam,
    achternaam,
    setAchternaam,
    gebdatum,
    setGebdatum,
    bsn,
    setBsn,
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
    setToestemming,
    toestemmingFout,
    gegevens,
    volgende,
  } = useAanmelding();
  const isVerwijzer = gegevens.rol === "Professional / verwijzer";
  const mailto = () => bouwMailto(gegevens);

  return (
    <>
      <div className="sz-mobiel-alleen" lang="nl">
        <MobielAanmelden />
      </div>

      <div className="sz-root sz-page sz-desktop-alleen" lang="nl" style={{ minHeight: "100vh" }}>
        <TerugHeader />

        <main className="sz-aanmelden sz-lift">
          <nav aria-label="Kruimelpad" className="sz-kruimel sz-kruimel--licht">
            <FadeLink to="/">Home</FadeLink>
            <span className="sz-sep" aria-hidden="true">
              ›
            </span>
            <b>Aanmelden</b>
          </nav>
          <h1>
            Een eerste <em>kleine stap.</em>
          </h1>
          <p className="sz-aanmelden-intro">
            Meld een jongere aan of vraag een kennismaking aan. Wij nemen binnen twee werkdagen
            contact met je op.
          </p>

          <div className="sz-formkaart">
            {step < 5 && (
              <div className="sz-voortgang">
                <span>Stap {step + 1} van 5</span>
                <span className="sz-balk" aria-hidden="true">
                  <i style={{ width: `${((step + 1) / 5) * 100}%` }} />
                </span>
              </div>
            )}

            {step === 0 && (
              <div className="sz-stapblok">
                <h2 className="sz-alleen">Wie meldt aan?</h2>
                <div className="sz-rolkeuze">
                  <button
                    type="button"
                    className="sz-rolknop"
                    onClick={() => {
                      setRol("Ouder / verzorger");
                      setStep(1);
                    }}
                  >
                    <span className="sz-rolicoon">
                      <IconOuder />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span className="sz-roltitel">Ouder of verzorger</span>
                      <span className="sz-roltekst">
                        Je meldt je kind of een jongere uit je gezin aan.
                      </span>
                    </span>
                    <ArrowRight stroke="#d3a142" width={17} />
                  </button>
                  <button
                    type="button"
                    className="sz-rolknop"
                    onClick={() => {
                      setRol("Professional / verwijzer");
                      setStep(1);
                    }}
                  >
                    <span className="sz-rolicoon">
                      <IconKoffer />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span className="sz-roltitel">Professional of verwijzer</span>
                      <span className="sz-roltekst">
                        Gemeente, school, huisarts of andere organisatie.
                      </span>
                    </span>
                    <ArrowRight stroke="#d3a142" width={17} />
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="sz-stapblok">
                <h2>Over de jongere</h2>
                <p>Gegevens zoals op het identiteitsbewijs.</p>
                <div className="sz-veldrij">
                  <label className="sz-veld">
                    Voornaam
                    <input
                      type="text"
                      value={voornaam}
                      onChange={(e) => setVoornaam(e.target.value)}
                      placeholder="Voornaam"
                    />
                  </label>
                  <label className="sz-veld">
                    Achternaam
                    <input
                      type="text"
                      value={achternaam}
                      onChange={(e) => setAchternaam(e.target.value)}
                      placeholder="Achternaam"
                    />
                  </label>
                  <label className="sz-veld">
                    Geboortedatum
                    <input
                      type="date"
                      value={gebdatum}
                      onChange={(e) => setGebdatum(e.target.value)}
                    />
                  </label>
                  <label className="sz-veld">
                    BSN
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={9}
                      value={bsn}
                      placeholder="9 cijfers"
                      style={{ borderColor: bsnFout ? "#b4482f" : bsnOk ? "#3f7d4e" : undefined }}
                      onChange={(e) => {
                        setBsn(e.target.value);
                      }}
                    />
                    <span
                      className="sz-veldmelding"
                      style={{ color: bsnFout ? "#b4482f" : "#3f7d4e" }}
                    >
                      {bsnFout
                        ? "Ongeldig BSN — voldoet niet aan de 11-proef."
                        : bsnOk
                          ? "BSN klopt (11-proef)."
                          : ""}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="sz-stapblok">
                <h2>Adres van de jongere</h2>
                <p>Vul postcode en huisnummer in — straat en plaats vullen we automatisch aan.</p>
                <div className="sz-veldrij sz-veldrij--smal">
                  <label className="sz-veld">
                    Postcode
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="1234 AB"
                      maxLength={7}
                    />
                  </label>
                  <label className="sz-veld">
                    Huisnummer
                    <input
                      type="text"
                      inputMode="numeric"
                      value={huisnummer}
                      onChange={(e) => setHuisnummer(e.target.value)}
                      placeholder="12"
                    />
                  </label>
                  <label className="sz-veld">
                    Toevoeging
                    <input
                      type="text"
                      value={toevoeging}
                      onChange={(e) => setToevoeging(e.target.value)}
                      placeholder="A / 2-hoog"
                    />
                  </label>
                </div>
                <p className="sz-adresmelding" style={{ color: ADRES_MELDING[adresStatus][1] }}>
                  {ADRES_MELDING[adresStatus][0]}
                </p>
                <div className="sz-veldrij">
                  <label className="sz-veld">
                    Straat
                    <input
                      type="text"
                      className="sz-auto"
                      value={straat}
                      onChange={(e) => setStraat(e.target.value)}
                      placeholder="Wordt automatisch ingevuld"
                    />
                  </label>
                  <label className="sz-veld">
                    Woonplaats
                    <input
                      type="text"
                      className="sz-auto"
                      value={woonplaats}
                      onChange={(e) => setWoonplaats(e.target.value)}
                      placeholder="Wordt automatisch ingevuld"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="sz-stapblok">
                <h2>Hoe bereiken we je?</h2>
                <p>We bellen of mailen voor een eerste kennismaking.</p>
                <div className="sz-veldrij">
                  <label className="sz-veld sz-veld--breed">
                    Jouw naam
                    <input
                      type="text"
                      value={naamAanmelder}
                      onChange={(e) => setNaamAanmelder(e.target.value)}
                      placeholder="Voor- en achternaam"
                    />
                  </label>
                  {isVerwijzer && (
                    <label className="sz-veld sz-veld--breed">
                      Organisatie
                      <input
                        type="text"
                        value={organisatie}
                        onChange={(e) => setOrganisatie(e.target.value)}
                        placeholder="Naam organisatie"
                      />
                    </label>
                  )}
                  <label className="sz-veld">
                    Telefoon
                    <input
                      type="tel"
                      value={telefoon}
                      onChange={(e) => setTelefoon(e.target.value)}
                      placeholder="06 12 34 56 78"
                    />
                  </label>
                  <label className="sz-veld">
                    E-mail
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="naam@voorbeeld.nl"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="sz-stapblok">
                <h2>Waar loopt het vast?</h2>
                <p>Een paar zinnen is genoeg. Geen dossiers nodig.</p>
                <textarea
                  rows={5}
                  value={situatie}
                  onChange={(e) => setSituatie(e.target.value)}
                  placeholder="Bijv. school gaat moeizaam, veel conflicten thuis, verkeerde vrienden…"
                />
                <div className="sz-urgentie">
                  <span>Urgentie</span>
                  {(["Regulier", "Spoed"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      aria-pressed={urgentie === u}
                      className={urgentie === u ? "is-active" : undefined}
                      onClick={() => setUrgentie(u)}
                    >
                      {u}
                    </button>
                  ))}
                </div>
                <label className={`sz-toestemming${toestemmingFout ? " is-error" : ""}`}>
                  <input
                    type="checkbox"
                    checked={toestemming}
                    onChange={(e) => {
                      setToestemming(e.target.checked);
                    }}
                  />
                  <span>
                    Ik geef toestemming om deze gegevens te gebruiken voor het in behandeling nemen
                    van de aanmelding.
                  </span>
                </label>
                {toestemmingFout && (
                  <p className="sz-fout">Vink de toestemming aan om te kunnen versturen.</p>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="sz-stapblok sz-bedankt">
                <span className="sz-bedankt-vink">
                  <Check width={30} />
                </span>
                <h2>Dank je wel{naamAanmelder ? `, ${naamAanmelder}` : ""}</h2>
                <p>
                  Je e-mailprogramma is geopend met de volledige aanmelding. Verstuur het bericht en
                  wij nemen binnen twee werkdagen contact op.
                </p>
                <a href={mailto()} className="sz-bedankt-knop">
                  <span>Opnieuw openen in e-mail</span>
                </a>
                <p className="sz-bedankt-voet">
                  Liever direct contact? Mail{" "}
                  <a href="mailto:hallo@sterkzorgzaam.nl">hallo@sterkzorgzaam.nl</a>
                </p>
              </div>
            )}

            {step > 0 && step < 5 && (
              <div className="sz-formnav">
                <button
                  type="button"
                  className="sz-terugknop"
                  onClick={() => setStep(Math.max(0, step - 1))}
                >
                  <ArrowLeft width={14} />
                  <span>Terug</span>
                </button>
                <button type="button" className="sz-volgende" onClick={volgende}>
                  <span>{step === 4 ? "Verstuur aanmelding" : "Volgende"}</span>
                  <ArrowRight stroke="#d3a142" width={16} />
                </button>
              </div>
            )}
          </div>

          <p className="sz-formvoet">
            Je gegevens worden alleen gebruikt om contact op te nemen over deze aanmelding.
          </p>
        </main>
      </div>
    </>
  );
}
