"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Entrada sutil ao rolar: 220ms, deslocamento de 12px.
 *
 * O conteúdo **nasce visível**. O estado escondido só existe sob
 * `data-anima="sim"`, que `AtivarAnimacoes` escreve antes do primeiro paint e
 * só quando há JS e movimento permitido — então quem não pode desfazer o
 * esconderijo nunca o recebe. É a mesma disciplina da hero em
 * `components/hero-video/capacidade.tsx`.
 *
 * A versão anterior fazia o contrário: entregava `opacity: 0` no HTML do
 * servidor e contava com o JS para desfazer. Sem JS a página inteira sumia
 * (`Reveal` embrulha as oito seções de conteúdo), e com
 * `prefers-reduced-motion` sumia também — o componente animado dava lugar a uma
 * `<div>` comum e o estilo vindo do servidor ficava para trás, sem ninguém para
 * removê-lo. Ver `Reveal.test.ts`.
 */

/**
 * Um observador para a página toda, não um por bloco: são ~30 blocos, e trinta
 * observadores fazem trinta vezes o mesmo trabalho de layout.
 */
let observador: IntersectionObserver | null = null;

function observar(el: Element): () => void {
  observador ??= new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        (entrada.target as HTMLElement).dataset.visivel = "";
        // Uma vez só: reaparecer ao rolar de volta seria movimento sem motivo.
        observador?.unobserve(entrada.target);
      }
    },
    { rootMargin: "-80px" },
  );
  observador.observe(el);
  return () => observador?.unobserve(el);
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** Em segundos. Escalonar no máximo até 0.24 para não arrastar a leitura. */
  delay?: number;
  className?: string;
}) {
  const alvo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = alvo.current;
    if (!el) return;
    // Sem o modo animado o CSS nunca escondeu nada — não há o que revelar.
    if (document.documentElement.dataset.anima !== "sim") return;
    return observar(el);
  }, []);

  return (
    <div
      ref={alvo}
      data-revelar
      className={className}
      style={
        delay ? ({ "--revelar-atraso": `${delay}s` } as CSSProperties) : undefined
      }
    >
      {children}
    </div>
  );
}
