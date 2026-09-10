"use client";

import { useEffect, useRef } from "react";
import { hero } from "@/content/site";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { BLOCOS, TEXTO, janelaDeTexto } from "./beats";
import { useHeroProgresso } from "./progresso";

/**
 * A copy, sempre no DOM, sempre por cima do quadro — nunca dentro do canvas.
 *
 * Um leitor de tela recebe os quatro blocos independente de rolagem, de canvas
 * e de os quadros terem carregado, e o texto continua selecionável e nítido em
 * qualquer densidade de tela. `t` dirige **só** opacidade e `translateY`: nada
 * monta nem desmonta com a rolagem. É também o que mantém o `#hero-cta` no DOM
 * do primeiro render — `components/ui/BotaoFlutuante.tsx` procura esse id uma
 * vez, na montagem, e desiste em silêncio se não achar.
 *
 * A atualização é imperativa, no mesmo laço de rAF do resto: `style` direto,
 * sem re-render do React a 60fps.
 *
 * Nenhum texto aqui é laranja, e isso é medição, não gosto: o pior caso na
 * faixa do texto é nuvem branca pura, e `--color-accent` sobre o scrim nessa
 * situação dá 1,1:1 — o laranja tem quase a mesma luminância do branco
 * escurecido. Sobre imagem o laranja vive só em traço (o rastro tracejado do
 * logo), que é decorativo. Ver a nota de contraste em `app/globals.css`.
 */
export function CamadaDeTexto() {
  const { inscrever } = useHeroProgresso();
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = raiz.current;
    if (!container) return;

    const elementos = BLOCOS.map((chave) => ({
      el: container.querySelector<HTMLElement>(`[data-bloco="${chave}"]`),
      janela: TEXTO[chave],
    })).filter(
      (x): x is { el: HTMLElement; janela: (typeof TEXTO)[keyof typeof TEXTO] } =>
        x.el !== null,
    );

    return inscrever(({ suave: t }) => {
      for (const { el, janela } of elementos) {
        const o = janelaDeTexto(t, janela.entra, janela.sai);
        el.style.opacity = o.toFixed(4);
        el.style.transform = `translate3d(0, ${((1 - o) * 14).toFixed(2)}px, 0)`;
        // Fora de vista não deve ser focável nem lido. `visibility` mantém a
        // caixa, então o observador do botão flutuante continua funcionando.
        el.style.visibility = o < 0.02 ? "hidden" : "visible";
      }
    });
  }, [inscrever]);

  return (
    <div
      ref={raiz}
      data-hero-texto
      className="pointer-events-none absolute inset-0 z-20 flex items-end"
    >
      <div className="mx-auto w-full max-w-6xl px-5 pb-[16svh] sm:px-8 sm:pb-[18svh]">
        {/*
          Os três blocos narrativos se revezam nesta âncora. Na sequência eles
          ocupam o mesmo lugar, ancorados na base; no modo estático empilham em
          fluxo. A troca é seca — um sai inteiro antes de o próximo começar a
          entrar — porque duas frases a meia opacidade no mesmo ponto não leem
          como transição, leem como texto borrado. Ver a nota em `beats.ts`,
          que é onde as janelas moram.
        */}
        <div data-hero-pilha className="relative">
          <h1
            data-bloco="headline"
            /* Menor que um `<h1>` de hero comum, e de propósito: sobre imagem
               em movimento, tipo gigante empurra as primeiras linhas para o
               meio do quadro, onde o scrim é fraco e o fundo é ocupado. A 2.9rem
               as três linhas cabem no terço de baixo, que é onde o scrim segura. */
            className="max-w-[24ch] font-display text-[clamp(1.75rem,3.5vw,2.9rem)] leading-[1.08] font-bold tracking-[-0.02em] text-balance text-ink-inverse"
          >
            {hero.headlineInicio}
            {hero.headlineDestaque}
          </h1>

          <p
            data-bloco="sub"
            className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-ink-inverse sm:text-[19px]"
          >
            {hero.sub}
          </p>

          <div
            data-bloco="selo"
            className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <span className="font-display text-3xl font-bold tracking-tight text-ink-inverse">
              {hero.seloNumero}
            </span>
            <span className="rotulo text-ink-inverse">{hero.seloTexto}</span>
            <span className="rastro-h hidden w-16 sm:block" aria-hidden="true" />
            <span className="rotulo text-ink-inverse">{hero.seloDesde}</span>
          </div>
        </div>

        <div
          id="hero-cta"
          data-bloco="cta"
          className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4"
        >
          <WhatsAppLink contexto="hero" tamanho="grande">
            {hero.cta}
          </WhatsAppLink>
        </div>
      </div>
    </div>
  );
}
