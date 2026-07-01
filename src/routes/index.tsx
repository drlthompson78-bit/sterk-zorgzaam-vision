import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-youth.jpg";
import logoImg from "@/assets/logo.svg";
import {
  Heart,
  Users,
  Brain,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sterk & Zorgzaam — Begeleiding voor jongeren 12–18" },
      {
        name: "description",
        content:
          "Cultuursensitieve, relationele en praktijkgerichte begeleiding voor jongeren die vastlopen in gedrag, ontwikkeling of omgeving.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" aria-label="Sterk & Zorgzaam startpagina" className="block shrink-0">
            <img
              src={logoImg}
              alt="Sterk & Zorgzaam"
              width={144}
              height={60}
              className="h-14 w-auto"
            />
          </a>
          <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#missie" className="hover:text-primary">Missie</a>
            <a href="#aanpak" className="hover:text-primary">Aanpak</a>
            <a href="#doelgroep" className="hover:text-primary">Doelgroep</a>
            <a href="#oprichters" className="hover:text-primary">Oprichters</a>
            <a href="#contact" className="hover:text-primary">Contact</a>
          </nav>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
          >
            Aan de slag <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img
          src={heroImg}
          alt="Jongeren bij Sterk & Zorgzaam"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-36">
          <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            Jeugdbegeleiding 12 – 18 jaar
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold uppercase leading-tight tracking-tight md:text-6xl">
            Kleine stapjes <span className="text-accent">zijn</span> ook stappen
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
            Sterk &amp; Zorgzaam ondersteunt jongeren die vastlopen in gedrag,
            ontwikkeling of omgeving. Cultuursensitief, relationeel en
            praktijkgericht — gericht op duurzaam perspectief.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg transition hover:brightness-95"
            >
              Aan de slag <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#missie"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10"
            >
              Onze missie
            </a>
          </div>
        </div>
      </section>

      {/* Missie & Visie */}
      <section id="missie" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Missie</p>
            <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
              De mens achter het gedrag
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Wij ondersteunen jongeren van 12 tot 18 jaar die risico lopen op
              maatschappelijke of forensische ontsporing. Vanuit een
              cultuursensitieve, relationele en praktijkgerichte aanpak helpen
              wij hen om opnieuw perspectief, structuur en richting te
              ontwikkelen.
            </p>
          </div>
          <div className="rounded-2xl border-l-4 border-accent bg-secondary p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Visie</p>
            <h3 className="mt-3 text-2xl font-bold text-primary">
              Verbinding vóór interventie
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-secondary-foreground/90">
              {[
                "Jongeren openen zich pas voor verandering wanneer vertrouwen is opgebouwd.",
                "Cultuur, leefwereld en omgeving zijn essentieel binnen begeleiding.",
                "Duurzame ontwikkeling vraagt versterking van het hele systeem.",
                "Iedere jongere bezit talenten en ontwikkelmogelijkheden.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Aanpak */}
      <section id="aanpak" className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Onze aanpak</p>
            <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
              Vier pijlers, één doel: duurzame verandering
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: Heart,
                title: "Cultuursensitief & relationeel",
                body: "Aansluiten bij de leefwereld, straattaal en sociale dynamiek. Vertrouwen, herkenning en geloofwaardigheid staan centraal — jongeren benaderen vanuit potentieel.",
              },
              {
                icon: Users,
                title: "Systemisch werken",
                body: "Actieve betrokkenheid van ouders en netwerk. Aandacht voor veiligheid, structuur en het versterken van opvoedvaardigheden binnen het hele systeem.",
              },
              {
                icon: Brain,
                title: "Executieve functies versterken",
                body: "Impulscontrole, emotieregulatie, plannen, concentratie, zelfreflectie en verantwoordelijkheid — de basis voor blijvende gedragsverandering.",
              },
              {
                icon: Wrench,
                title: "Praktijkgerichte interventies",
                body: "Persoonlijke begeleiding, dagbesteding, leerwerktrajecten, talentontwikkeling en — waar passend — elementen uit cognitieve gedragsbehandeling.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-primary">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Doelgroep + USP */}
      <section id="doelgroep" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Doelgroep</p>
            <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
              Voor wie wij er zijn
            </h2>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              {[
                "Jongeren van 12 t/m 18 jaar",
                "Gedragsproblematiek of risico op uitval",
                "Schurend tegen forensische of criminele problematiek",
                "Beperkte motivatie richting hulpverlening",
                "Complexe systeem- of gezinsproblematiek",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 inline-block h-1.5 w-6 shrink-0 rounded-full bg-accent" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Onderscheidend</p>
            <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
              Wat ons anders maakt
            </h2>
            <div className="mt-6 grid gap-3">
              {[
                "Sterk relationele en cultuursensitieve aanpak",
                "Begeleiding start vanuit verbinding en vertrouwen",
                "Intensieve aandacht voor het systeem rondom de jongere",
                "Focus op executieve functies als basis",
                "Maatwerk in plaats van standaardtrajecten",
                "Bereiken van jongeren met weerstand tegen reguliere zorg",
                "Combinatie van praktijkervaring en bestuurlijke expertise",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Uitsluitingscriteria */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Uitsluitingscriteria
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Wanneer wij niet de juiste match zijn
            </h2>
            <p className="mt-4 text-primary-foreground/75">
              Soms vraagt de situatie van een jongere om specialistische of
              klinische zorg. In deze situaties kan onze aanpak onvoldoende
              aansluiten of veiligheid niet waarborgen.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                n: "01",
                title: "Wettelijk dwingend kader",
                body: "Wvggz / Wzd, gesloten plaatsing of verplichte opname — wij werken vanuit vrijwilligheid en eigen regie.",
              },
              {
                n: "02",
                title: "Acute psychiatrische nood",
                body: "Bij ernstige ontregeling of suïcidaliteit is specialistische GGZ of klinische behandeling vereist.",
              },
              {
                n: "03",
                title: "Ernstige verslavingsproblematiek",
                body: "Wanneer detox of medische stabilisatie eerst noodzakelijk is, zijn wij niet de passende eerste interventie.",
              },
              {
                n: "04",
                title: "Ernstige veiligheidsrisico's",
                body: "Structureel onbeheersbare agressie of voortdurende fysieke risico's overstijgen de veilige uitvoerbaarheid.",
              },
              {
                n: "05",
                title: "Volledige zorgweigering",
                body: "Onze aanpak vraagt minimale bereidheid tot contact. Zonder dat ontbreekt de basis voor een traject.",
              },
            ].map((c) => (
              <article
                key={c.n}
                className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-accent">{c.n}</span>
                  <X className="h-4 w-4 text-accent" />
                </div>
                <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/75">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Oprichters */}
      <section id="oprichters" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Oprichters</p>
          <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
            Bestuurlijke expertise. Praktijkkennis. Maatschappelijke betrokkenheid.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              name: "Miriam Twilt-Mendonça",
              role: "Mede-oprichter",
              bio: "Brengt ruime ervaring mee vanuit leiderschap, organisatieontwikkeling, onderwijs en het veiligheidsdomein.",
            },
            {
              name: "Giovanni Peters",
              role: "Mede-oprichter",
              bio: "Brengt brede praktijkervaring mee in het begeleiden van jongeren met complexe gedrags- en ontwikkelingsproblematiek.",
            },
          ].map((p) => (
            <article
              key={p.name}
              className="rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-lg font-bold text-accent">
                  {p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.role}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="bg-secondary py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Samen werken aan duurzaam perspectief
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Wilt u een jongere aanmelden of kennismaken met onze aanpak? Neem
            contact met ons op — wij denken graag mee.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:info@sterkzorgzaam.nl"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg transition hover:brightness-95"
            >
              info@sterkzorgzaam.nl <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground md:flex-row">
          <span className="font-semibold text-primary">
            Sterk <span className="text-accent">&amp;</span> Zorgzaam
          </span>
          <span>© {new Date().getFullYear()} — Kleine stapjes zijn ook stappen.</span>
        </div>
      </footer>
    </main>
  );
}
