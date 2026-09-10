"use client";

import { useEffect, useRef } from "react";
import { hero } from "@/content/site";
import { indicadorPara } from "./beats";
import { useHeroProgresso } from "./progresso";

/**
 * As duas afordâncias de estado da hero.
 *
 * **A dica de rolagem** é a única coisa na tela durante o beat de vazio. Sem
 * ela, uma tela off-white em branco não lê como respiro — lê como página
 * quebrada. Ela some antes de a abertura terminar: quem já está rolando não
 * precisa mais do aviso.
 *
 * **A barra de carga** substitui o pôster parado enquanto a primeira passada de
 * quadros não chegou. Duas linhas: a pessoa sabe que algo está vindo, e sabe
 * quanto falta.
 *
 * Aqui é o único lugar da hero onde `--color-accent-strong` carrega texto, e
 * pode: o fundo é o off-white da página, não o vídeo (4,9:1).
 *
 * As duas ficam sempre montadas e são escondidas por CSS no modo estático. É de
 * propósito: se a montagem dependesse do modo, o primeiro render do cliente
 * divergiria do HTML do servidor, e a hidratação reclamaria.
 */
export function Indicador({
  carga,
  pronta,
}: {
  /** Fração da passada grossa que já chegou, 0 a 1. */
  carga: number;
  pronta: boolean;
}) {
  const { inscrever } = useHeroProgresso();
  const dica = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dica.current;
    if (!el) return;

    return inscrever(({ suave: t }) => {
      const o = indicadorPara(t);
      el.style.opacity = o.toFixed(4);
      el.style.visibility = o < 0.02 ? "hidden" : "visible";
    });
  }, [inscrever]);

  return (
    <>
      <div
        ref={dica}
        aria-hidden="true"
        data-hero-indicador
        className="pointer-events-none absolute inset-x-0 bottom-9 z-20 flex flex-col items-center gap-3"
      >
        <span className="rotulo text-accent-strong">{hero.rolagem}</span>
        <span className="hero-bob flex flex-col items-center gap-1.5">
          <span className="rastro-v h-7" />
          <svg
            viewBox="0 0 12 8"
            className="h-2 w-3 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 1l5 5 5-5" />
          </svg>
        </span>
      </div>

      {/* A barra vive na borda de baixo, onde não disputa com nada. */}
      <div
        aria-hidden="true"
        data-hero-indicador
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[2px] transition-opacity duration-200"
        style={{ opacity: pronta ? 0 : 1 }}
      >
        <div
          className="h-full w-full origin-left bg-accent transition-transform duration-200"
          style={{ transform: `scaleX(${Math.max(0.02, carga).toFixed(3)})` }}
        />
      </div>
    </>
  );
}
