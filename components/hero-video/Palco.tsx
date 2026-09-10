"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { hero } from "@/content/site";
import { MASCARA_INFERIOR, aberturaPara, veuPara } from "./beats";
import { useHeroProgresso } from "./progresso";

/**
 * O palco: a superfície de imagem e as suas bordas.
 *
 * Quatro coisas que são todas tratamento da mesma superfície, e por isso moram
 * juntas: a abertura em grande angular que a revela, o quadro parado que
 * aparece quando não há sequência, os três scrims que tornam o texto legível, e
 * o véu que a dissolve no off-white da página.
 *
 * Nada aqui é um cartão: sem `rounded`, sem borda, sem sombra, sem container. A
 * imagem ocupa `100vw × 100svh` fora do `max-w-6xl` que rege o resto da página,
 * e sai de cena virando o fundo do site.
 */
export function Palco({ children }: { children: ReactNode }) {
  const { inscrever } = useHeroProgresso();
  const abertura = useRef<HTMLDivElement>(null);
  const veu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alvo = abertura.current;
    const cortina = veu.current;
    if (!alvo || !cortina) return;

    let aberto: boolean | null = null;

    return inscrever(({ suave: t }) => {
      const { topo, lado, raio } = aberturaPara(t);
      const fechado = topo > 0 || lado > 0;

      if (fechado) {
        alvo.style.setProperty("--ab-topo", `${(topo * 100).toFixed(3)}%`);
        alvo.style.setProperty("--ab-lado", `${(lado * 100).toFixed(3)}%`);
        alvo.style.setProperty("--ab-raio", `${raio.toFixed(2)}px`);
      }

      // Trocar o atributo é o que tira o `clip-path` de cena depois de abrir —
      // e o que o traz de volta se a pessoa rolar para cima.
      if (aberto !== !fechado) {
        aberto = !fechado;
        if (aberto) alvo.setAttribute("data-aberto", "");
        else alvo.removeAttribute("data-aberto");
      }

      cortina.style.opacity = veuPara(t).toFixed(4);
    });
  }, [inscrever]);

  return (
    <>
      <div ref={abertura} data-hero-abertura className="absolute inset-0">
        <div
          data-hero-quadro
          className="absolute inset-0"
          style={
            {
              "--hero-mascara": `${MASCARA_INFERIOR * 100}%`,
            } as CSSProperties
          }
        >
          {children}

          {/*
            O quadro parado. `loading="lazy"` de propósito: no modo sequência
            ele está em `display: none`, e um `<img>` lazy escondido não é
            baixado — `preload` ou `eager` custariam 45KB a cada visita para
            uma imagem que ninguém veria. Quando ele aparece, está na primeira
            tela, e o navegador carrega imediatamente.
          */}
          <Image
            data-hero-poster
            src={hero.poster.src}
            alt={hero.poster.alt}
            width={hero.poster.largura}
            height={hero.poster.altura}
            sizes="100vw"
            loading="lazy"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div
            aria-hidden="true"
            data-hero-scrim="coluna"
            className="absolute inset-0"
          />
          <div
            aria-hidden="true"
            data-hero-scrim="topo"
            className="absolute inset-0"
          />
          <div
            aria-hidden="true"
            data-hero-scrim="base"
            className="absolute inset-0"
          />
        </div>
      </div>

      {/*
        Fora da abertura e da máscara de propósito: o véu tem de chegar chapado
        até a borda de baixo, senão a dissolução termina com uma faixa de imagem
        aparecendo por baixo dele.
      */}
      <div
        aria-hidden="true"
        ref={veu}
        data-hero-veu
        className="absolute inset-0 bg-bg"
        style={{ opacity: 0 }}
      />
    </>
  );
}
