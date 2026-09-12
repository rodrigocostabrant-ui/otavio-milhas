"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { hero } from "@/content/site";
import { isPendente } from "@/content/types";
import { IconeAviao } from "@/components/ui/Icones";
import { useHeroParallax } from "./HeroParallaxProvider";

/**
 * As marcas que flutuam ao redor da hero.
 *
 * **O que elas são hoje.** Bandeiras, quando `hero.bandeiras` tiver a lista de
 * países. Enquanto não tiver, o avião e o rastro tracejado do próprio logo —
 * vocabulário que já vive na página, no CTA final e no conector dos passos.
 * A troca é de dados, não de código: o arranjo, o movimento e as posições são
 * os mesmos nos dois casos. Escolher seis bandeiras por conta própria seria
 * afirmar seis viagens que ninguém confirmou (ver a nota em `content/site.ts`).
 *
 * **Por que solto e não em órbita.** Uma órbita é geometria, e geometria puxa
 * o olho: a pessoa percebe o padrão e passa a segui-lo. Cada marca aqui tem
 * posição fixa própria, período próprio e fase própria, e os períodos são
 * primos entre si o bastante para o conjunto nunca voltar a uma formação
 * reconhecível. O objetivo é que ninguém consiga dizer o que está se mexendo.
 *
 * **Por que nunca competem.** Opacidade entre 0,16 e 0,26, escala pequena,
 * deslocamento de no máximo 14px, e `pointer-events: none` em tudo. Uma marca
 * decorativa que rouba um clique deixou de ser decorativa.
 *
 * Sob movimento reduzido elas ficam paradas nas suas posições, ainda discretas.
 * Apagá-las seria perder a composição; o que se perde é só o deslocamento, que
 * é o que a preferência pede.
 */

/**
 * O arranjo. Posições em porcentagem da hero, escolhidas para caber nas
 * margens: acima do selo, na calha entre as duas colunas, nas bordas laterais
 * e no rodapé da seção. Nenhuma cai sobre o `<h1>`, o apoio ou os botões.
 *
 * `profundidade` é o quanto cada uma responde ao parallax. Variar isto é o que
 * separa as marcas em planos; com um valor só elas andariam em bloco, que é
 * exatamente a formação que este arranjo existe para não ter.
 */
const MARCAS = [
  { esq: 4, topo: 16, giro: -18, escala: 1.0, periodo: 11, fase: 0.0, profundidade: 1.0, opacidade: 0.22 },
  { esq: 41, topo: 9, giro: 12, escala: 0.75, periodo: 14, fase: 1.7, profundidade: 0.55, opacidade: 0.16 },
  { esq: 52, topo: 78, giro: -8, escala: 0.9, periodo: 9.5, fase: 3.1, profundidade: 1.35, opacidade: 0.2 },
  { esq: 94, topo: 32, giro: 24, escala: 0.8, periodo: 12.5, fase: 0.8, profundidade: 0.8, opacidade: 0.18 },
  { esq: 8, topo: 86, giro: 6, escala: 1.1, periodo: 10.5, fase: 4.2, profundidade: 1.2, opacidade: 0.26 },
  { esq: 88, topo: 90, giro: -26, escala: 0.7, periodo: 13.5, fase: 2.4, profundidade: 0.65, opacidade: 0.17 },
  { esq: 30, topo: 95, giro: 16, escala: 0.85, periodo: 8.5, fase: 5.3, profundidade: 0.95, opacidade: 0.19 },
] as const;

/** Amplitude, em px, da flutuação de cada marca. */
const BOIA = 9;
/** Deslocamento máximo, em px, que o parallax impõe a uma marca de profundidade 1. */
const DESLIZE = 14;

export function BandeirasDecorativas() {
  const marcas = useRef<(HTMLElement | null)[]>([]);
  const api = useHeroParallax();
  const bandeiras = isPendente(hero.bandeiras) ? null : hero.bandeiras;

  useEffect(() => {
    if (!api) return;

    function aoQuadro(q: { x: number; y: number; t: number }) {
      for (let i = 0; i < MARCAS.length; i++) {
        const el = marcas.current[i];
        if (!el) continue;
        const m = MARCAS[i];

        // Duas senoides de períodos diferentes por eixo: uma só daria uma
        // subida e descida regular, que o olho identifica em dois ciclos.
        const fx =
          Math.sin((q.t / m.periodo) * Math.PI * 2 + m.fase) * BOIA * 0.6 +
          q.x * DESLIZE * m.profundidade;
        const fy =
          Math.cos((q.t / (m.periodo * 0.73)) * Math.PI * 2 + m.fase) * BOIA +
          q.y * DESLIZE * m.profundidade * 0.7;

        el.style.transform = `translate3d(${fx.toFixed(2)}px, ${fy.toFixed(2)}px, 0) rotate(${m.giro}deg) scale(${m.escala})`;
      }
    }

    return api.assinar(aoQuadro);
  }, [api]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {MARCAS.map((m, i) => (
        <span
          key={i}
          ref={(el) => {
            marcas.current[i] = el;
          }}
          className="absolute block will-change-transform"
          style={{
            left: `${m.esq}%`,
            top: `${m.topo}%`,
            opacity: m.opacidade,
            transform: `rotate(${m.giro}deg) scale(${m.escala})`,
          }}
        >
          {bandeiras && bandeiras.length > 0 ? (
            <Image
              src={bandeiras[i % bandeiras.length].src}
              alt=""
              width={34}
              height={24}
              className="h-6 w-auto rounded-[2px]"
            />
          ) : i % 2 === 0 ? (
            <IconeAviao className="h-6 w-6 text-accent" />
          ) : (
            <span className="rastro-h block w-14" />
          )}
        </span>
      ))}
    </div>
  );
}
