import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { scrollToId, useHashScroll } from "@/components/site/nav";
import { Brief, Hero } from "@/components/home/Hero";
import { Missie } from "@/components/home/Missie";
import { Doelgroep } from "@/components/home/Doelgroep";
import { Aanpak } from "@/components/home/Aanpak";
import { Grenzen } from "@/components/home/Grenzen";
import { Oprichters } from "@/components/home/Oprichters";
import { Contact } from "@/components/home/Contact";
import { MobielHome } from "@/components/mobiel/MobielHome";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Samen Sterk & Zorgzaam — Kleine stapjes zijn ook stappen" },
      {
        name: "description",
        content:
          "Cultuursensitieve, relationele en praktijkgerichte begeleiding voor jongeren die vastlopen in gedrag, ontwikkeling of omgeving.",
      },
    ],
  }),
});

function Index() {
  const [brief, setBrief] = useState(false);
  useHashScroll();

  const briefToggle = () => {
    const volgende = !brief;
    setBrief(volgende);
    if (volgende) window.setTimeout(() => scrollToId("brief", 120), 250);
  };

  return (
    <>
      {/* Mobiel en desktop zijn zelfstandige layouts; de breedte bepaalt
          welke van de twee zichtbaar is. */}
      <div className="sz-mobiel-alleen" lang="nl">
        <MobielHome />
      </div>

      <div className="sz-root sz-page sz-desktop-alleen" lang="nl">
        <Header />
        <Hero briefOpen={brief} onToggleBrief={briefToggle} />
        <Brief open={brief} />
        <Missie />
        <Doelgroep />
        <Aanpak />
        <Grenzen />
        <Oprichters />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
