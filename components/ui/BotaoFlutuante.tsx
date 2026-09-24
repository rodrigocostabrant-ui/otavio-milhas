"use client";

import { useEffect, useState } from "react";
import { linkWhats } from "@/content/site";
import { IconeWhatsApp } from "./Icones";

/**
 * Só aparece depois que a hero sai de vista — não compete com a marca nem
 * polui a primeira impressão.
 *
 * Observa a seção da hero, não um CTA dentro dela: a hero é a marca e o `<h1>`,
 * e não tem botão. A intenção continua a mesma de quando tinha ("só depois do
 * hero"), e agora não depende de um elemento que pode deixar de existir.
 */
export function BotaoFlutuante() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    // `#topo` é a seção da hero, que está sempre na página. Se alguém a
    // remover, o botão simplesmente não aparece — preferível a aparecer em
    // cima da primeira tela.
    const alvo = document.getElementById("topo");
    if (!alvo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => setVisivel(!entrada.isIntersecting),
      { rootMargin: "-8px 0px 0px 0px" },
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <a
      href={linkWhats("flutuante")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Otávio no WhatsApp"
      aria-hidden={!visivel}
      tabIndex={visivel ? 0 : -1}
      className={`fixed right-5 bottom-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-strong text-ink shadow-lg transition-[opacity,transform] duration-200 hover:bg-accent-hover ${
        visivel
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <IconeWhatsApp className="h-7 w-7" />
    </a>
  );
}
