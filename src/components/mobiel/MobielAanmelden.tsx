import { FadeLink } from "@/components/site/nav";
import { ArrowLeft, ArrowRight, Check, IconKoffer, IconOuder } from "@/components/site/icons";
import { ADRES_MELDING, bouwMailto, useAanmelding } from "@/lib/aanmelding";
import { MobielTopbar } from "./Chroom";

export function MobielAanmelden() {
  const f = useAanmelding();
  const [adresMelding, adresKleur] = ADRES_MELDING[f.adresStatus];

  return (
    <div className="mz-root mz-root--formulier">
      <div className="mz-formkop">
        <MobielTopbar variant="terug" />
        {f.step < 5 && (
          <div className="mz-voortgang">
            <div className="mz-voortgang-regel">
              <span>Stap {f.step + 1} van 5</span>
              <span className="mz-voortgang-label">Aanmelden</span>
            </div>
            <div className="mz-voortgang-balk">
              <div style={{ width: `${((f.step + 1) / 5) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      <main className="mz-formulier">
        {f.step === 0 && (
          <div className="mz-stap">
            <h1>Een eerste kleine stap.</h1>
            <p className="mz-stap-lead">
              Meld een jongere aan of vraag een kennismaking aan. Wij nemen binnen twee werkdagen
              contact met je op.
            </p>
            <h2>Wie meldt aan?</h2>
            <div className="mz-rolkeuze">
              <button
                type="button"
                onClick={() => {
                  f.setRol("Ouder / verzorger");
                  f.setStep(1);
                }}
              >
                <span className="mz-rolicoon">
                  <IconOuder />
                </span>
                <span className="mz-roltekst">
                  <b>Ouder of verzorger</b>
                  <i>Je meldt je kind of een jongere uit je gezin aan.</i>
                </span>
                <ArrowRight stroke="#d3a142" width={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  f.setRol("Professional / verwijzer");
                  f.setStep(1);
                }}
              >
                <span className="mz-rolicoon">
                  <IconKoffer />
                </span>
                <span className="mz-roltekst">
                  <b>Professional of verwijzer</b>
                  <i>Gemeente, school, huisarts of andere organisatie.</i>
                </span>
                <ArrowRight stroke="#d3a142" width={16} />
              </button>
            </div>
            <p className="mz-stap-voet">
              Je gegevens worden alleen gebruikt om contact op te nemen over deze aanmelding.
            </p>
          </div>
        )}

        {f.step === 1 && (
          <div className="mz-stap">
            <h2>Over de jongere</h2>
            <p className="mz-stap-sub">Gegevens zoals op het identiteitsbewijs.</p>
            <div className="mz-velden">
              <label>
                Voornaam
                <input
                  type="text"
                  value={f.voornaam}
                  onChange={(e) => f.setVoornaam(e.target.value)}
                  placeholder="Voornaam"
                />
              </label>
              <label>
                Achternaam
                <input
                  type="text"
                  value={f.achternaam}
                  onChange={(e) => f.setAchternaam(e.target.value)}
                  placeholder="Achternaam"
                />
              </label>
              <label>
                Geboortedatum
                <input
                  type="date"
                  value={f.gebdatum}
                  onChange={(e) => f.setGebdatum(e.target.value)}
                />
              </label>
              <label>
                BSN
                <input
                  type="text"
                  inputMode="numeric"
                  value={f.bsn}
                  onChange={(e) => f.setBsn(e.target.value)}
                  placeholder="9 cijfers"
                  maxLength={9}
                  className="mz-bsn"
                  style={{
                    borderColor: f.bsnFout ? "#b4482f" : f.bsnOk ? "#3f7d4e" : undefined,
                  }}
                />
              </label>
              <p className="mz-veldmelding" style={{ color: f.bsnFout ? "#b4482f" : "#3f7d4e" }}>
                {f.bsnFout
                  ? "Ongeldig BSN — voldoet niet aan de 11-proef."
                  : f.bsnOk
                    ? "BSN klopt (11-proef)."
                    : ""}
              </p>
            </div>
          </div>
        )}

        {f.step === 2 && (
          <div className="mz-stap">
            <h2>Adres van de jongere</h2>
            <p className="mz-stap-sub">
              Vul postcode en huisnummer in — straat en plaats vullen we automatisch aan.
            </p>
            <div className="mz-adresrij">
              <label style={{ flex: 1.3 }}>
                Postcode
                <input
                  type="text"
                  value={f.postcode}
                  onChange={(e) => f.setPostcode(e.target.value)}
                  placeholder="1234 AB"
                  maxLength={7}
                  style={{ textTransform: "uppercase" }}
                />
              </label>
              <label style={{ flex: 1 }}>
                Nr.
                <input
                  type="text"
                  inputMode="numeric"
                  value={f.huisnummer}
                  onChange={(e) => f.setHuisnummer(e.target.value)}
                  placeholder="22"
                />
              </label>
              <label style={{ flex: 0.8 }}>
                Toev.
                <input
                  type="text"
                  value={f.toevoeging}
                  onChange={(e) => f.setToevoeging(e.target.value)}
                  placeholder="A"
                />
              </label>
            </div>
            <p className="mz-veldmelding mz-adresmelding" style={{ color: adresKleur }}>
              {adresMelding}
            </p>
            <div className="mz-velden">
              <label>
                Straat
                <input
                  type="text"
                  value={f.straat}
                  onChange={(e) => f.setStraat(e.target.value)}
                  placeholder="Wordt automatisch ingevuld"
                  className="mz-auto"
                />
              </label>
              <label>
                Woonplaats
                <input
                  type="text"
                  value={f.woonplaats}
                  onChange={(e) => f.setWoonplaats(e.target.value)}
                  placeholder="Wordt automatisch ingevuld"
                  className="mz-auto"
                />
              </label>
            </div>
          </div>
        )}

        {f.step === 3 && (
          <div className="mz-stap">
            <h2>Hoe bereiken we je?</h2>
            <p className="mz-stap-sub">We bellen of mailen voor een eerste kennismaking.</p>
            <div className="mz-velden">
              <label>
                Jouw naam
                <input
                  type="text"
                  value={f.naamAanmelder}
                  onChange={(e) => f.setNaamAanmelder(e.target.value)}
                  placeholder="Voor- en achternaam"
                />
              </label>
              {f.rol === "Professional / verwijzer" && (
                <label>
                  Organisatie
                  <input
                    type="text"
                    value={f.organisatie}
                    onChange={(e) => f.setOrganisatie(e.target.value)}
                    placeholder="Gemeente, school of organisatie"
                  />
                </label>
              )}
              <label>
                Telefoon
                <input
                  type="tel"
                  inputMode="tel"
                  value={f.telefoon}
                  onChange={(e) => f.setTelefoon(e.target.value)}
                  placeholder="06 12345678"
                />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  inputMode="email"
                  value={f.email}
                  onChange={(e) => f.setEmail(e.target.value)}
                  placeholder="naam@voorbeeld.nl"
                />
              </label>
            </div>
          </div>
        )}

        {f.step === 4 && (
          <div className="mz-stap">
            <h2>Waar loopt het vast?</h2>
            <p className="mz-stap-sub">Een paar zinnen is genoeg. Geen dossiers nodig.</p>
            <textarea
              rows={6}
              value={f.situatie}
              onChange={(e) => f.setSituatie(e.target.value)}
              placeholder="Beschrijf kort de situatie…"
            />
            <p className="mz-veldlabel">Urgentie</p>
            <div className="mz-urgentie">
              {(["Regulier", "Spoed"] as const).map((keuze) => (
                <button
                  key={keuze}
                  type="button"
                  aria-pressed={f.urgentie === keuze}
                  onClick={() => f.setUrgentie(keuze)}
                  className={f.urgentie === keuze ? "is-actief" : undefined}
                >
                  {keuze}
                </button>
              ))}
            </div>
            <label
              className="mz-toestemming"
              style={{ borderColor: f.toestemmingFout ? "#b4482f" : undefined }}
            >
              <input
                type="checkbox"
                checked={f.toestemming}
                onChange={(e) => f.setToestemming(e.target.checked)}
              />
              <span>
                Ik geef toestemming om deze gegevens te gebruiken voor het in behandeling nemen van
                de aanmelding.
              </span>
            </label>
            {f.toestemmingFout && (
              <p className="mz-fout">Vink de toestemming aan om te kunnen versturen.</p>
            )}
          </div>
        )}

        {f.step === 5 && (
          <div className="mz-stap mz-stap--klaar">
            <span className="mz-vinkje">
              <Check stroke="#0d2028" width={28} />
            </span>
            <h2>Bijna klaar.</h2>
            <p className="mz-stap-lead">
              Je e-mailprogramma is geopend met de volledige aanmelding. Verstuur het bericht en wij
              nemen binnen twee werkdagen contact op.
            </p>
            <a href={bouwMailto(f.gegevens)} className="mz-knop-goud">
              Opnieuw openen in e-mail
            </a>
            <p className="mz-stap-sub">
              Liever direct contact? Bel <a href="tel:+31628873094">06 288 730 94</a> of mail{" "}
              <a href="mailto:aanmelden@sterkzorgzaam.nl">aanmelden@sterkzorgzaam.nl</a>.
            </p>
            <FadeLink to="/" className="mz-knop-omlijnd">
              Terug naar home
            </FadeLink>
          </div>
        )}
      </main>

      {f.step > 0 && f.step < 5 && (
        <div className="mz-actiebalk is-zichtbaar">
          <button
            type="button"
            onClick={f.vorige}
            aria-label="Vorige stap"
            className="mz-stap-terug"
          >
            <ArrowLeft stroke="#132a34" width={18} />
          </button>
          <button type="button" onClick={f.volgende} className="mz-actiebalk-cta">
            {f.step === 4 ? "Verstuur aanmelding" : "Volgende"}
            <ArrowRight stroke="#d3a142" width={16} />
          </button>
        </div>
      )}
    </div>
  );
}
