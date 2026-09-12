import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { ViradaDeChave } from "@/components/sections/ViradaDeChave";
import { QuemEOtavio } from "@/components/sections/QuemEOtavio";
import { Temas } from "@/components/sections/Temas";
import { ComoComeca } from "@/components/sections/ComoComeca";
import { ParaQuem } from "@/components/sections/ParaQuem";
import { ProvaSocial } from "@/components/sections/ProvaSocial";
import { FAQ } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { BotaoFlutuante } from "@/components/ui/BotaoFlutuante";
import { AtivarAnimacoes } from "@/components/ui/AtivarAnimacoes";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      {/* Antes de tudo: decide, durante o parse, se os blocos de
          conteúdo entram animados — para que nenhum deles nasça escondido. */}
      <AtivarAnimacoes />
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
