"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { headerPara, type ModoDeHeader } from "./beats";
import { CamadaDeTexto } from "./CamadaDeTexto";
import { Indicador } from "./Indicador";
import { MarcaVazio } from "./MarcaVazio";
import { Palco } from "./Palco";
import { HeroProgressoProvider, useHeroProgresso } from "./progresso";
import { useCapacidade } from "./capacidade";

/**
 * A hero cinemática.
 *
 * Um trilho de rolagem alto com um miolo sticky de uma tela. O sticky solta
 * limpo nas duas pontas — nada de sequestrar a rolagem, nada de
 * `preventDefault` em `wheel`, nada de snap entre beats.
 *
 * O mesmo DOM serve aos dois modos. A hero estática não é um componente
 * separado: é este, sem trilho, sem sticky, sem canvas e com os quatro blocos
 * de texto visíveis ao mesmo tempo — tudo decidido em CSS a partir de
 * `data-hero-modo` no `<html>`. Um DOM só significa um `<h1>` só na página e
 * nenhuma cópia de conteúdo para as duas versões divergirem.
 *
 * Toda a calibragem está em `beats.ts`, nomeada por beat.
 */

const Sequencia = dynamic(() => import("./Sequencia"), { ssr: false });

function Trilho({
  ligada,
  children,
}: {
  ligada: boolean;
  children: React.ReactNode;
}) {
  const { trilho, inscrever } = useHeroProgresso();

  // O header não tem estado próprio: ele lê `data-hero-fase` do <html>. A
  // escrita acontece uma vez por troca de fase, não a cada frame.
  useEffect(() => {
    if (!ligada) return;
    let fase: ModoDeHeader | null = null;

    return inscrever(({ suave: t }) => {
      const proxima = headerPara(t);
      if (proxima === fase) return;
      fase = proxima;
      document.documentElement.dataset.heroFase = proxima;
    });
  }, [inscrever, ligada]);

  return (
    <section id="topo" ref={trilho} data-hero-raiz className="relative">
      <div
        data-hero-miolo
        className="relative min-h-[88svh] overflow-hidden bg-bg"
      >
        {children}
      </div>
    </section>
  );
}

export function HeroVideo() {
  const { modo, desligar } = useCapacidade();
  const [carga, setCarga] = useState({ fracao: 0, pronta: false });

  const ligada = modo === "sequencia";

  const aoProgresso = useCallback((fracao: number, pronta: boolean) => {
    setCarga((antes) =>
      antes.fracao === fracao && antes.pronta === pronta
        ? antes
        : { fracao, pronta },
    );
  }, []);

  return (
    <HeroProgressoProvider ativo={ligada}>
      <Trilho ligada={ligada}>
        <Palco>
          {/* `ssr: false`, então o servidor não renderiza nada aqui de todo
              jeito: montar condicionalmente no cliente não cria divergência de
              hidratação. O `Indicador`, que renderiza markup de verdade, é o
              contrário — fica sempre montado e o CSS o esconde. */}
          {ligada ? (
            <Sequencia aoProgresso={aoProgresso} aoFalhar={desligar} />
          ) : null}
        </Palco>

        <MarcaVazio />

        <CamadaDeTexto />

        <Indicador carga={carga.fracao} pronta={carga.pronta} />
      </Trilho>
    </HeroProgressoProvider>
  );
}
