import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
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
      <JsonLd />
      <Header />
      <main>
        <Hero />
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
