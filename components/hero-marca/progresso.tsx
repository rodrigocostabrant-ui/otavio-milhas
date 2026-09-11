"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { AMORTECIMENTO, PARADA, lerp, progresso as calcular } from "./beats";

/**
 * O driver único da hero.
 *
 * `t` é calculado UMA vez, aqui, num laço de rAF só. Canvas, texto, véu,
 * indicador e header leem a mesma fonte — não cinco listeners de scroll
 * concorrendo, e não re-render do React a 60fps: quem consome mexe no `style`
 * direto, dentro do mesmo frame.
 *
 * Duas economias que importam de verdade no celular:
 *
 *  - **Dorme quando assenta.** Quando o `t` amortecido alcança o cru, o laço
 *    para. Um evento de rolagem o acorda. Sem isso a página desenha 60 vezes
 *    por segundo enquanto a pessoa está parada lendo.
 *  - **Dorme quando o trilho sai de vista.** IntersectionObserver, para não
 *    queimar bateria desenhando enquanto a pessoa lê o FAQ.
 *
 * Nunca sequestra a rolagem: sem `preventDefault` em `wheel`, sem snap entre
 * beats. O sticky solta limpo nas duas pontas.
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
  /** Inscreve um consumidor e devolve o cancelamento. */
  inscrever: (fn: Assinante) => () => void;
  /** Força um frame — para quem acabou de montar e precisa se posicionar. */
  acordar: () => void;
};

const HeroProgressoContext = createContext<Contexto | null>(null);

export function HeroProgressoProvider({
  children,
  ativo = true,
}: {
  children: ReactNode;
  /** Falso quando a hero degradou para estática: não há rolagem para dirigir. */
  ativo?: boolean;
}) {
  const progresso = useRef<Progresso>({ cru: 0, suave: 0 });
  const trilho = useRef<HTMLElement | null>(null);
  const assinantes = useRef<Set<Assinante>>(new Set());
  // O laço se registra aqui para que `acordar` continue apontando para o laço
  // vivo mesmo quando o efeito remonta.
  const despertador = useRef<() => void>(() => {});

  const valor = useMemo<Contexto>(
    () => ({
      progresso,
      trilho,
      inscrever: (fn) => {
        assinantes.current.add(fn);
        despertador.current();
        return () => {
          assinantes.current.delete(fn);
        };
      },
      acordar: () => despertador.current(),
    }),
    [],
  );

  useEffect(() => {
    const elemento = trilho.current;
    if (!ativo || !elemento) return;

    let id = 0;
    let rodando = false;
    let visivel = true;
    let vivo = true;

    const medir = () => {
      const caixa = elemento.getBoundingClientRect();
      progresso.current.cru = calcular(
        window.scrollY,
        caixa.top + window.scrollY,
        caixa.height,
        window.innerHeight,
      );
    };

    const publicar = () => {
      for (const fn of assinantes.current) fn(progresso.current);
    };

    const passo = () => {
      if (!vivo) return;
      medir();

      const p = progresso.current;
      p.suave = lerp(p.suave, p.cru, AMORTECIMENTO);
      // Encosta em vez de convergir para sempre: um lerp nunca chega, e ficar a
      // 0,0001 do alvo mantém o laço acordado sem nada mudando na tela.
      if (Math.abs(p.suave - p.cru) < PARADA) p.suave = p.cru;

      publicar();

      if (!visivel || p.suave === p.cru) {
        rodando = false;
        return;
      }
      id = requestAnimationFrame(passo);
    };

    const acordar = () => {
      if (!vivo || rodando || !visivel) return;
      rodando = true;
      id = requestAnimationFrame(passo);
    };
    despertador.current = acordar;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        visivel = entrada.isIntersecting;
        if (visivel) acordar();
      },
      { rootMargin: "10% 0px" },
    );
    observador.observe(elemento);

    window.addEventListener("scroll", acordar, { passive: true });
    window.addEventListener("resize", acordar);
    acordar();

    return () => {
      vivo = false;
      rodando = false;
      despertador.current = () => {};
      cancelAnimationFrame(id);
      observador.disconnect();
      window.removeEventListener("scroll", acordar);
      window.removeEventListener("resize", acordar);
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
    throw new Error(
      "useHeroProgresso precisa estar dentro de HeroProgressoProvider",
    );
  }
  return ctx;
}
