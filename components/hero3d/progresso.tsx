"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { AMORTECIMENTO, clamp01, lerp } from "./beats";

/**
 * Driver de rolagem da hero.
 *
 * `t` é calculado UMA vez, aqui, num laço de rAF só. Câmera, texto e flash leem
 * a mesma fonte — não três listeners de scroll concorrendo, e não re-render do
 * React a cada frame: os consumidores de DOM se inscrevem e mexem no `style`
 * direto.
 *
 * Rolagem crua é trêmula, então `suave` é o `cru` passado por damping.
 */

export type Progresso = {
  /** Progresso cru da rolagem, 0 a 1. */
  cru: number;
  /** Progresso amortecido. É o que a cena e o texto devem ler. */
  suave: number;
};

type Assinante = (p: Progresso) => void;

type Contexto = {
  progresso: RefObject<Progresso>;
  trilho: RefObject<HTMLElement | null>;
  inscrever: (fn: Assinante) => () => void;
};

const HeroProgressoContext = createContext<Contexto | null>(null);

export function HeroProgressoProvider({
  children,
  ativo = true,
}: {
  children: React.ReactNode;
  /** Falso quando a hero degradou para estática: não há rolagem para dirigir. */
  ativo?: boolean;
}) {
  const progresso = useRef<Progresso>({ cru: 0, suave: 0 });
  const trilho = useRef<HTMLElement | null>(null);
  const assinantes = useRef<Set<Assinante>>(new Set());

  const valor = useMemo<Contexto>(
    () => ({
      progresso,
      trilho,
      inscrever: (fn: Assinante) => {
        assinantes.current.add(fn);
        return () => {
          assinantes.current.delete(fn);
        };
      },
    }),
    [],
  );

  useEffect(() => {
    if (!ativo) return;

    let id = 0;
    let vivo = true;

    const passo = () => {
      if (!vivo) return;

      const elemento = trilho.current;
      if (elemento) {
        const caixa = elemento.getBoundingClientRect();
        const percurso = caixa.height - window.innerHeight;
        // Enquanto o topo do trilho está acima da viewport, -caixa.top é o
        // quanto já rolamos dentro dele.
        progresso.current.cru =
          percurso > 0 ? clamp01(-caixa.top / percurso) : 0;
      }

      progresso.current.suave = lerp(
        progresso.current.suave,
        progresso.current.cru,
        AMORTECIMENTO,
      );

      for (const fn of assinantes.current) fn(progresso.current);
      id = requestAnimationFrame(passo);
    };

    id = requestAnimationFrame(passo);
    return () => {
      vivo = false;
      cancelAnimationFrame(id);
    };
  }, [ativo]);

  return (
    <HeroProgressoContext.Provider value={valor}>
      {children}
    </HeroProgressoContext.Provider>
  );
}

export function useHeroProgresso(): Contexto {
  const ctx = useContext(HeroProgressoContext);
  if (!ctx) {
    throw new Error("useHeroProgresso precisa estar dentro de HeroProgressoProvider");
  }
  return ctx;
}
