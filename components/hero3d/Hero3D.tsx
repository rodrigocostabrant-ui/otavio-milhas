"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { CamadaDeTexto } from "./CamadaDeTexto";
import { Flash } from "./Flash";
import { PosterHero3D } from "./PosterHero3D";
import { HeroProgressoProvider, useHeroProgresso } from "./progresso";
import { useCapacidade } from "./useCapacidade";

/**
 * A hero cinemática.
 *
 * Estrutura: um trilho de rolagem alto, com um miolo sticky de uma tela. O
 * sticky solta limpo nas duas pontas — nada de sequestrar a rolagem, nada de
 * preventDefault em wheel, nada de snap entre beats.
 *
 * `<ScrollControls>` do drei foi descartado de propósito: ele assume o container
 * de scroll da página e briga com o resto da landing em fluxo normal.
 */

const Canvas3D = dynamic(() => import("./Canvas3D"), {
  ssr: false,
  loading: () => <PosterEmbutido />,
});

/** O poster ocupando o miolo sticky enquanto o canvas não chega. */
function PosterEmbutido() {
  return (
    <div className="absolute inset-0">
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(180deg, #2A4A73 0%, #6E86A8 38%, #D9A273 74%, #F2C48E 100%)",
        }}
      />
    </div>
  );
}

/* Altura do trilho: 240svh no mobile, 380svh no desktop. A sequência é a mesma
   nos dois — só mais comprimida no celular. Nenhum beat é cortado. O valor mora
   em `--trilho-hero`, em app/globals.css. */

function Trilho({ aoMontarCena }: { aoMontarCena: () => void }) {
  const { trilho } = useHeroProgresso();
  const miolo = useRef<HTMLDivElement>(null);

  return (
    <section
      id="topo"
      ref={trilho}
      className="relative"
      style={{ height: "var(--trilho-hero)" }}
    >
      <div
        ref={miolo}
        className="sticky top-0 h-[100svh] overflow-hidden bg-[#2A4A73]"
      >
        <Canvas3D aoMontar={aoMontarCena} alvoDeVisibilidade={miolo} />
        <CamadaDeTexto />
        <Flash />
      </div>
    </section>
  );
}

export function Hero3D() {
  const { capacidade, aoMontarCena } = useCapacidade();

  if (capacidade === "avaliando") {
    return <PosterHero3D comJanela={false} />;
  }

  // Sem WebGL: hero estática comum, sem a moldura de janela — a página não
  // promete um 3D que não vai existir.
  if (capacidade === "sem-webgl") {
    return <PosterHero3D comJanela={false} />;
  }

  // Menos movimento ou frame rate insuficiente: um frame estático bem composto.
  if (capacidade === "sem-movimento" || capacidade === "lento") {
    return <PosterHero3D />;
  }

  return (
    <HeroProgressoProvider>
      <Trilho aoMontarCena={aoMontarCena} />
    </HeroProgressoProvider>
  );
}
