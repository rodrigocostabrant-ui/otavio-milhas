"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { linkWhats, type ContextoCta } from "@/content/site";
import { IconeWhatsApp } from "@/components/ui/Icones";
import { useHeroParallax } from "./HeroParallaxProvider";

/**
 * O CTA da hero, com atração ao cursor.
 *
 * O botão não sai do lugar no layout — quem se desloca é só o `transform`, e
 * no máximo 10px. Isso importa: um botão que realmente muda de posição vira
 * alvo móvel, e a pessoa passa a perseguir o que deveria simplesmente clicar.
 * A área clicável fica exatamente onde o olho a viu.
 *
 * O ímã só existe onde faz sentido. Em toque não há cursor para atrair, e um
 * botão que se desloca sozinho no primeiro toque leria como defeito — por isso
 * `HeroParallaxProvider` só liga o movimento sob `(hover: hover) and
 * (pointer: fine)`, e aqui o resultado é um botão normal, idêntico ao
 * `WhatsAppLink`. O botão flutuante do celular continua sendo o
 * `BotaoFlutuante`, que aparece depois da hero.
 *
 * Não há `useState`: o deslocamento é escrito direto no `style` a cada quadro
 * do laço da hero.
 */

/** Distância, em px, a partir da qual o botão começa a sentir o cursor. */
const RAIO = 130;
/** Deslocamento máximo. Passou disso, o botão vira alvo móvel. */
const PUXAO = 10;
/** Quanto o botão cresce no ponto de maior atração. */
const CRESCE = 0.03;
/**
 * Constante de tempo da suavização, em segundos. 0.07s assenta em ~210ms, que
 * é a faixa de resposta a interação do AGENTS.md. Mais lento que isso e o botão
 * parece arrastar atrás do cursor.
 */
const TAU = 0.07;

export function BotaoMagneticoWhatsApp({
  contexto,
  children,
}: {
  contexto: ContextoCta;
  children: ReactNode;
}) {
  const caixa = useRef<HTMLSpanElement>(null);
  const api = useHeroParallax();

  useEffect(() => {
    const el = caixa.current;
    if (!el || !api) return;

    const atual = { x: 0, y: 0, e: 0 };

    function aoQuadro(q: { clienteX: number; clienteY: number; dt: number }) {
      const r = el!.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = q.clienteX - cx;
      const dy = q.clienteY - cy;
      const dist = Math.hypot(dx, dy);

      // A força cai do centro para a borda do raio, não é um degrau: assim o
      // botão não "salta" para o cursor ao cruzar a fronteira.
      const forca = dist < RAIO ? 1 - dist / RAIO : 0;
      const alvoX = dist > 0 ? (dx / dist) * PUXAO * forca : 0;
      const alvoY = dist > 0 ? (dy / dist) * PUXAO * forca : 0;
      const alvoE = forca * CRESCE;

      const k = 1 - Math.exp(-q.dt / TAU);
      atual.x += (alvoX - atual.x) * k;
      atual.y += (alvoY - atual.y) * k;
      atual.e += (alvoE - atual.e) * k;

      el!.style.transform = `translate3d(${atual.x.toFixed(2)}px, ${atual.y.toFixed(2)}px, 0) scale(${(1 + atual.e).toFixed(4)})`;
    }

    const desassinar = api.assinar(aoQuadro);
    return () => {
      desassinar();
      el.style.transform = "";
    };
  }, [api]);

  return (
    /* Dois elementos, e é por causa de uma colisão real: o ímã escreve
       `transform` inline a cada quadro, e estilo inline ganha de qualquer
       regra CSS. Se o afundar ao pressionar (`botao-tatil`, também `transform`)
       morasse no mesmo elemento, o clique não teria resposta nenhuma.
       O invólucro carrega o ímã; o link carrega o toque. */
    <span ref={caixa} className="inline-flex will-change-transform">
      <a
        href={linkWhats(contexto)}
        target="_blank"
        rel="noopener noreferrer"
        className="botao-tatil inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent-strong px-5 py-3.5 text-[15px] font-medium text-ink shadow-[0_1px_2px_rgba(28,27,26,0.08)] transition-colors duration-200 hover:bg-accent-hover sm:px-7 sm:py-4 sm:text-base"
      >
        <IconeWhatsApp className="h-[18px] w-[18px] shrink-0" />
        <span>{children}</span>
      </a>
    </span>
  );
}
