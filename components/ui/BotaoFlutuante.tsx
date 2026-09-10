"use client";

import { useEffect, useState } from "react";
import { linkWhats } from "@/content/site";
import { IconeWhatsApp } from "./Icones";

/**
 * Só aparece depois que o CTA do hero sai de vista — não compete com ele nem
 * polui a primeira impressão.
 */
export function BotaoFlutuante() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    // `#hero-cta` é garantido pelo Hero, que está sempre na página. Se alguém
    // removê-lo, o botão simplesmente não aparece — preferível a aparecer em
    // cima do CTA principal.
    const alvo = document.getElementById("hero-cta");
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
      className={`fixed right-5 bottom-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-strong text-ink-inverse shadow-lg transition-[opacity,transform] duration-200 hover:bg-accent-hover ${
        visivel
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <IconeWhatsApp className="h-7 w-7" />
    </a>
  );
}
