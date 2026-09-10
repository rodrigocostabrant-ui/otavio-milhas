"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/**
 * Decide se a cena 3D pode rodar. A degradação é obrigatória, não enfeite.
 *
 * Ordem:
 *  1. sem WebGL              → hero estática, altura de tela única, sem trilho
 *  2. prefers-reduced-motion → um frame estático bem composto, sem pinar rolagem
 *  3. FPS baixo no 1º segundo → cai para o estático e NÃO tenta de novo
 *
 * O item 2 é deliberado e diferente do que se faz num scrub 1:1 com o gesto:
 * uma cena 3D com nuvens e deriva de câmera se move sozinha, e isso merece o
 * desligamento honesto em vez de só reduzir a suavização.
 */

export type Capacidade =
  | "avaliando"
  | "liberado"
  /** Sem WebGL: hero estática comum. */
  | "sem-webgl"
  /** Usuário pediu menos movimento. */
  | "sem-movimento"
  /** Rodou, mas não segurou o frame rate. */
  | "lento";

/** Criar contexto WebGL custa; a resposta não muda durante a sessão. */
let webglEmCache: boolean | null = null;

function temWebGL(): boolean {
  if (webglEmCache !== null) return webglEmCache;
  try {
    const canvas = document.createElement("canvas");
    webglEmCache = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    webglEmCache = false;
  }
  return webglEmCache;
}

const consultaMovimento = "(prefers-reduced-motion: reduce)";

function assinar(aoMudar: () => void): () => void {
  const mq = window.matchMedia(consultaMovimento);
  mq.addEventListener("change", aoMudar);
  return () => mq.removeEventListener("change", aoMudar);
}

function lerAgora(): Capacidade {
  if (window.matchMedia(consultaMovimento).matches) return "sem-movimento";
  return temWebGL() ? "liberado" : "sem-webgl";
}

/** No servidor não há como saber: fica em "avaliando" até hidratar. */
const lerNoServidor = (): Capacidade => "avaliando";

export function useCapacidade(): {
  capacidade: Capacidade;
  /** Chame quando o canvas montar: dispara a amostragem de FPS. */
  aoMontarCena: () => void;
} {
  const base = useSyncExternalStore(assinar, lerAgora, lerNoServidor);
  const [lento, setLento] = useState(false);
  const [medindo, setMedindo] = useState(false);

  // Amostragem de FPS no primeiro segundo de cena. Uma vez só: se cair para o
  // estático, não volta a tentar.
  useEffect(() => {
    if (!medindo || base !== "liberado" || lento) return;

    let frames = 0;
    let id = 0;
    const inicio = performance.now();

    const contar = () => {
      frames += 1;
      const decorrido = performance.now() - inicio;
      if (decorrido < 1000) {
        id = requestAnimationFrame(contar);
        return;
      }
      if ((frames * 1000) / decorrido < 32) setLento(true);
    };

    id = requestAnimationFrame(contar);
    return () => cancelAnimationFrame(id);
  }, [medindo, base, lento]);

  const aoMontarCena = useCallback(() => setMedindo(true), []);

  return {
    capacidade: lento && base === "liberado" ? "lento" : base,
    aoMontarCena,
  };
}
