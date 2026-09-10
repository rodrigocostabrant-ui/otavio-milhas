"use client";

import { useEffect, useRef } from "react";
import { FLASH_ENTRADA, FLASH_SAIDA, pulso } from "./beats";
import { useHeroProgresso } from "./progresso";

/**
 * O corte pelo vidro.
 *
 * Não se resolve a geometria de atravessar a fuselagem: no pico da aproximação
 * um estouro branco cobre o corte, e do outro lado já estamos dentro. É um
 * truque de montagem clássico e é suficiente.
 *
 * É uma `div`, de propósito. Bloom e motion blur de verdade custariam ~50KB de
 * `@react-three/postprocessing` e um passe de render a mais para entregar o que
 * isto já entrega.
 */
export function Flash() {
  const el = useRef<HTMLDivElement>(null);
  const { inscrever } = useHeroProgresso();

  useEffect(
    () =>
      inscrever(({ suave: t }) => {
        const nodo = el.current;
        if (!nodo) return;
        const forca = Math.max(pulso(t, FLASH_ENTRADA), pulso(t, FLASH_SAIDA));
        nodo.style.opacity = String(forca);
      }),
    [inscrever],
  );

  return (
    <div
      ref={el}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 bg-white"
      style={{ opacity: 0 }}
    />
  );
}
