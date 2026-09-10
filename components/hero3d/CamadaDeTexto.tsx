"use client";

import { useEffect, useRef } from "react";
import { hero3d } from "@/content/hero3d";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { faixa, suave } from "./beats";
import { useHeroProgresso } from "./progresso";

/**
 * A copy vive no DOM, por cima do canvas — nunca dentro do Three.js. Leitor de
 * tela recebe as quatro linhas independente de haver WebGL, e o texto continua
 * selecionável e nítido em qualquer densidade de tela.
 *
 * A atualização é imperativa, no mesmo laço de rAF do resto: `style` direto,
 * sem re-render do React a 60fps. Os blocos são localizados por
 * `data-bloco` uma vez, no efeito — sem ref callback por elemento.
 */

function opacidadeDoBloco(
  t: number,
  entra: readonly [number, number],
  sai: readonly [number, number] | null,
): number {
  const dentro = suave(faixa(t, entra[0], entra[1]));
  const fora = sai ? suave(faixa(t, sai[0], sai[1])) : 0;
  return dentro * (1 - fora);
}

/** Janelas de opacidade de cada bloco, incluindo os que nunca saem. */
const JANELAS: ReadonlyArray<{
  chave: string;
  entra: readonly [number, number];
  sai: readonly [number, number] | null;
}> = [
  ...hero3d.blocos.map((b) => ({ chave: b.chave, entra: b.entra, sai: b.sai })),
  { chave: "cta", entra: hero3d.cta.entra, sai: null },
  { chave: "reforco", entra: hero3d.reforco.entra, sai: null },
];

export function CamadaDeTexto() {
  const { inscrever } = useHeroProgresso();
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = raiz.current;
    if (!container) return;

    const elementos = JANELAS.map(({ chave, entra, sai }) => ({
      el: container.querySelector<HTMLElement>(`[data-bloco="${chave}"]`),
      entra,
      sai,
    })).filter((x): x is { el: HTMLElement; entra: readonly [number, number]; sai: readonly [number, number] | null } => x.el !== null);

    return inscrever(({ suave: t }) => {
      for (const { el, entra, sai } of elementos) {
        const o = opacidadeDoBloco(t, entra, sai);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - o) * 14}px, 0)`;
        // Fora de vista não deve ser focável nem lido.
        el.style.visibility = o < 0.02 ? "hidden" : "visible";
      }
    });
  }, [inscrever]);

  const oculto = { opacity: 0, visibility: "hidden" } as const;

  return (
    <div
      ref={raiz}
      className="pointer-events-none absolute inset-0 z-20 flex items-center"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="relative max-w-[22ch]">
          {hero3d.blocos.map((bloco) => {
            const Tag = bloco.tag;
            const base =
              "font-display text-[clamp(2rem,6vw,4rem)] leading-[1.06] font-bold tracking-[-0.025em] text-balance text-ink-inverse [text-shadow:0_2px_28px_rgba(12,14,18,0.45)]";
            // O primeiro fica no fluxo e define a altura; os outros se
            // sobrepõem a ele, para as linhas trocarem sem a caixa pular.
            const posicao =
              bloco.chave === "pista" ? "" : "absolute inset-x-0 top-0 ";
            return (
              <Tag
                key={bloco.chave}
                data-bloco={bloco.chave}
                className={`${posicao}${base}`}
                style={oculto}
              >
                {bloco.texto}
              </Tag>
            );
          })}
        </div>

        <div data-bloco="cta" className="pointer-events-auto mt-10" style={oculto}>
          <WhatsAppLink contexto="hero" tamanho="grande">
            {hero3d.cta.rotulo}
          </WhatsAppLink>
        </div>

        <p
          data-bloco="reforco"
          className="mt-5 max-w-[36ch] text-[15px] leading-relaxed text-ink-inverse/80 [text-shadow:0_1px_16px_rgba(12,14,18,0.5)]"
          style={oculto}
        >
          {hero3d.reforco.texto}
        </p>
      </div>
    </div>
  );
}
