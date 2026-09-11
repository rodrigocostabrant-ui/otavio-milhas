"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { hero } from "@/content/site";
import { marcaVazioPara } from "./beats";
import { useHeroProgresso } from "./progresso";

/**
 * O logo e a tagline no beat de vazio.
 *
 * É a marca segurando a tela enquanto ainda não há imagem nem `<h1>`. Sem isto
 * o off-white liso lê como página quebrada. Some conforme a abertura em grande
 * angular cresce do centro — toda a calibragem está em `MARCA_VAZIO` /
 * `marcaVazioPara` em `beats.ts`.
 *
 * Estrutura e comportamento espelham o `Indicador`, não os blocos de `TEXTO`:
 * fica sempre montado, o CSS o esconde fora do modo sequência, e `t` dirige só
 * a opacidade do container — nunca monta nem desmonta. A entrada é uma animação
 * de CSS no filho (`.hero-marca-entra`), porque em `t = 0` o bloco já precisa
 * estar visível.
 *
 * `aria-hidden` porque o `<h1>` com este mesmo texto já está no DOM logo abaixo
 * (em `CamadaDeTexto`): um leitor de tela não deve ouvir a tagline duas vezes.
 * A tagline aqui é tinta escura sobre o off-white (contraste de sobra); o
 * laranja da marca vive no próprio logo.
 */
export function MarcaVazio() {
  const { inscrever } = useHeroProgresso();
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;

    return inscrever(({ suave: t }) => {
      const o = marcaVazioPara(t);
      el.style.opacity = o.toFixed(4);
      el.style.visibility = o < 0.02 ? "hidden" : "visible";
    });
  }, [inscrever]);

  return (
    <div
      ref={raiz}
      aria-hidden="true"
      data-hero-marca
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-7 px-6 text-center"
    >
      <div className="hero-marca-entra flex flex-col items-center gap-7">
        <Image
          src="/img/logo-otavio.png"
          alt=""
          width={299}
          height={165}
          loading="eager"
          className="h-24 w-auto sm:h-28"
        />
        <p className="max-w-[27ch] font-display text-[clamp(1.2rem,2.5vw,1.75rem)] leading-[1.18] font-semibold tracking-[-0.01em] text-balance text-ink-soft">
          {hero.headlineInicio}
          <span className="text-ink">{hero.headlineDestaque}</span>
        </p>
      </div>
    </div>
  );
}
