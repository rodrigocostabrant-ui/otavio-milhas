import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AtivarSequencia } from "@/components/hero-video/capacidade";
import { HeroVideo } from "@/components/hero-video/HeroVideo";
import { ViradaDeChave } from "@/components/sections/ViradaDeChave";
import { QuemEOtavio } from "@/components/sections/QuemEOtavio";
import { Temas } from "@/components/sections/Temas";
import { ComoComeca } from "@/components/sections/ComoComeca";
import { ParaQuem } from "@/components/sections/ParaQuem";
import { ProvaSocial } from "@/components/sections/ProvaSocial";
import { FAQ } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { BotaoFlutuante } from "@/components/ui/BotaoFlutuante";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      {/* Precisa vir antes do header e da hero: decide o modo da hero durante o
          parse do HTML, então tudo abaixo já nasce no modo certo. */}
      <AtivarSequencia />
      <JsonLd />
      <Header />
      <main>
        <HeroVideo />
        <ViradaDeChave />
        <QuemEOtavio />
        <Temas />
        <ComoComeca />
        <ParaQuem />
        <ProvaSocial />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
      <BotaoFlutuante />
    </>
  );
}
