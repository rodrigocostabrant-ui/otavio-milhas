"use client";

import { useEffect, useRef } from "react";
import { hero } from "@/content/site";
import { Imagem } from "@/components/ui/Imagem";
import { useHeroParallax } from "./HeroParallaxProvider";
import { avancar, poseDe, posicaoNoTrilho, type EstadoGiro } from "./giro";

/**
 * O deck de fotos de viagem: um carrossel 3D com deriva contínua, parallax e
 * arrasto.
 *
 * Três movimentos, e cada um responde a uma pergunta diferente:
 *
 *  - **Deriva.** Os cartões avançam sozinhos, uma volta a cada 42 segundos. É o
 *    que diz "isto continua" sem exigir nada de ninguém.
 *  - **Pausa ao passar o mouse.** A deriva para quando o ponteiro entra no
 *    deck. Sem isso a pessoa tentaria olhar uma foto e a foto fugiria — um
 *    carrossel que se move debaixo do cursor é hostil, não vivo.
 *  - **Parallax.** O palco inteiro inclina alguns graus seguindo o mouse. Move
 *    o *palco*, nunca os cartões um a um: inclinar a cena é profundidade,
 *    empurrar cada cartão numa direção é confusão.
 *
 * O arrasto continua sendo o controle explícito e ganha de tudo: enquanto a
 * mão está no cartão, deriva e inércia ficam quietas.
 *
 * Nenhuma posição passa por estado do React. O laço é o do
 * `HeroParallaxProvider` — este componente só se inscreve nele e escreve
 * transformações direto no DOM. Sem provider, ou sob `prefers-reduced-motion`,
 * recebe um quadro parado, se desenha uma vez e o arrasto continua funcionando:
 * é resposta a um gesto do usuário, não movimento imposto.
 */

/** Quanto de giro um arrasto de uma altura de contêiner produz. */
const GANHO_ARRASTO = 0.9;
/** Graus de inclinação do palco em cada eixo, no extremo do movimento. */
const PARALLAX_X = 6;
const PARALLAX_Y = 3.5;
/** Inclinação de repouso do palco, que o parallax modula em volta. */
const BASE_RX = 3;
const BASE_RY = -4;

export function DeckViagens() {
  const palco = useRef<HTMLDivElement>(null);
  const cartoes = useRef<(HTMLElement | null)[]>([]);
  const giro = useRef<EstadoGiro>({ offset: 0, velocidade: 0, arrastando: false });
  const api = useHeroParallax();

  useEffect(() => {
    const alvo = palco.current;
    if (!alvo) return;

    const estado = giro.current;
    const total = cartoes.current.length;

    function aplicar() {
      for (let i = 0; i < total; i++) {
        const el = cartoes.current[i];
        if (!el) continue;

        const p = poseDe(posicaoNoTrilho(i, total, estado.offset));

        el.style.transform =
          `translate3d(${p.x}%, ${p.y}%, ${p.z}px)` +
          ` rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg)` +
          ` scale(${p.escala})`;
        el.style.opacity = String(p.opacidade);
        el.style.zIndex = String(p.camada);
        el.style.pointerEvents = p.opacidade > 0.6 ? "auto" : "none";
      }
    }

    /** Um quadro do laço da hero. */
    function aoQuadro(q: {
      x: number;
      y: number;
      dt: number;
      sobreODeck: boolean;
    }) {
      // Arrasto, inércia e deriva disputam o mesmo número, e a ordem entre eles
      // é `giro.ts` que decide — e `giro.test.ts` que tranca.
      avancar(estado, q.dt, q.sobreODeck);

      alvo!.style.transform =
        `rotateX(${BASE_RX - q.y * PARALLAX_Y}deg)` +
        ` rotateY(${BASE_RY + q.x * PARALLAX_X}deg)`;

      aplicar();
    }

    let ultimoX = 0;
    let ultimoY = 0;

    function aoPressionar(e: PointerEvent) {
      estado.arrastando = true;
      estado.velocidade = 0;
      ultimoX = e.clientX;
      ultimoY = e.clientY;
      alvo!.setPointerCapture(e.pointerId);
    }

    function aoMover(e: PointerEvent) {
      if (!estado.arrastando) return;
      const altura = alvo!.clientHeight || 1;
      const dx = e.clientX - ultimoX;
      const dy = e.clientY - ultimoY;
      const passo = ((dy + dx) / altura) * GANHO_ARRASTO;

      ultimoX = e.clientX;
      ultimoY = e.clientY;
      estado.offset += passo;
      // A inércia é medida em voltas por segundo. 60 é a taxa nominal, e o erro
      // que sobra some no atrito nos primeiros décimos de segundo.
      estado.velocidade = passo * 60;
      // Sem laço (movimento reduzido), o arrasto se desenha sozinho.
      if (!api?.movimento()) aplicar();
    }

    function aoSoltar(e: PointerEvent) {
      if (!estado.arrastando) return;
      estado.arrastando = false;
      if (alvo!.hasPointerCapture(e.pointerId)) {
        alvo!.releasePointerCapture(e.pointerId);
      }
      // Sem laço a inércia não tem onde rodar: o deck para onde a mão deixou.
      if (!api?.movimento()) estado.velocidade = 0;
    }

    function aoEntrar() {
      api?.definirSobreODeck(true);
    }

    function aoSairDoDeck() {
      api?.definirSobreODeck(false);
    }

    alvo.addEventListener("pointerdown", aoPressionar);
    alvo.addEventListener("pointermove", aoMover);
    alvo.addEventListener("pointerup", aoSoltar);
    alvo.addEventListener("pointercancel", aoSoltar);
    alvo.addEventListener("pointerenter", aoEntrar);
    alvo.addEventListener("pointerleave", aoSairDoDeck);

    // A primeira pose é escrita fora do laço: sem isto os cartões ficariam
    // empilhados no centro até o primeiro quadro chegar.
    aplicar();

    const desassinar = api?.assinar(aoQuadro);

    return () => {
      alvo.removeEventListener("pointerdown", aoPressionar);
      alvo.removeEventListener("pointermove", aoMover);
      alvo.removeEventListener("pointerup", aoSoltar);
      alvo.removeEventListener("pointercancel", aoSoltar);
      alvo.removeEventListener("pointerenter", aoEntrar);
      alvo.removeEventListener("pointerleave", aoSairDoDeck);
      desassinar?.();
      api?.definirSobreODeck(false);
    };
  }, [api]);

  return (
    <div
      className="hero-entra relative w-full min-w-0"
      style={{ "--atraso": "420ms" } as React.CSSProperties}
    >
      {/* ---- Celular: uma faixa que escoa devagar ---- */}
      <div className="faixa-fotos -mx-5 w-screen max-w-[100vw] sm:-mx-8 lg:hidden">
        <div className="flex w-max gap-4">
          {[...hero.fotos, ...hero.fotos].map((foto, i) => (
            <figure
              key={i}
              aria-hidden={i >= hero.fotos.length ? "true" : undefined}
              className="w-[260px] flex-none overflow-hidden rounded-2xl bg-surface sm:w-[320px]"
            >
              <Imagem
                foto={foto}
                proporcao="3/2"
                sizes="320px"
                prioridade={i === 0}
              />
            </figure>
          ))}
        </div>
      </div>

      {/* ---- Desktop: o deck arrastável ---- */}
      <div
        className="hero-deck-flutua relative mx-auto hidden h-[68vh] max-h-[780px] w-full overflow-hidden select-none lg:block"
        style={{ perspective: "2600px" }}
      >
        <div
          ref={palco}
          role="group"
          aria-label={hero.instrucaoDeck}
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${BASE_RX}deg) rotateY(${BASE_RY}deg)`,
          }}
        >
          {hero.fotos.map((foto, i) => (
            <figure
              key={i}
              ref={(el) => {
                cartoes.current[i] = el;
              }}
              className="absolute top-1/2 left-1/2 w-[62%] will-change-transform"
            >
              {/* O fundo opaco é estrutural, não decoração: sem ele um cartão
                  de trás aparece por dentro do da frente e a profundidade some. */}
              <div
                className={`overflow-hidden rounded-2xl bg-surface shadow-[0_30px_60px_-28px_var(--color-ink)] ${
                  i % 2 === 0 ? "hero-flutua-a" : "hero-flutua-b"
                }`}
              >
                <Imagem foto={foto} proporcao="3/2" sizes="46vw" prioridade={i === 0} />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
