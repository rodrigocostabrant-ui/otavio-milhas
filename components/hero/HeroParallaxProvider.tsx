"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * O relógio da hero: um `pointermove`, um `requestAnimationFrame` e um
 * `IntersectionObserver` para a tela inteira.
 *
 * O contexto NÃO carrega estado do React. Carrega uma inscrição: cada sistema
 * (deck, botão magnético, bandeiras) registra uma função e recebe o quadro
 * pronto. Guardar a posição do mouse em `useState` re-renderizaria a árvore da
 * hero sessenta vezes por segundo — é exatamente o defeito que um provider de
 * parallax costuma introduzir, e o motivo de o valor do contexto ser criado uma
 * vez só, num ref, e nunca mudar de identidade.
 *
 * Três laços separados custariam três vezes o mesmo `requestAnimationFrame`
 * sobre os mesmos números. Aqui é um.
 *
 * O laço para quando a hero sai da tela. Sem isso a página continuaria
 * calculando seis poses por quadro no rodapé, gastando bateria para animar algo
 * que ninguém está vendo.
 */

/** O que cada sistema recebe por quadro. */
export type Quadro = {
  /** Mouse relativo à hero, já suavizado, em [-1, 1]. Centro é 0. */
  readonly x: number;
  readonly y: number;
  /** Posição crua do cursor na viewport. O botão magnético precisa dela para
   *  medir a distância até si mesmo, que o valor normalizado não dá. */
  readonly clienteX: number;
  readonly clienteY: number;
  /** Segundos desde o quadro anterior, limitado a 50ms. Sem o limite, voltar
   *  para uma aba parada daria um salto de vários segundos de uma vez. */
  readonly dt: number;
  /** Segundos desde que o laço começou. As bandeiras derivam disto. */
  readonly t: number;
  /** O ponteiro está sobre o deck? É o que pausa a deriva. */
  readonly sobreODeck: boolean;
};

type Inscricao = (q: Quadro) => void;

type ApiHero = {
  /** Registra um sistema. Devolve a função que o remove. */
  assinar: (fn: Inscricao) => () => void;
  /** O deck avisa quando o ponteiro entra e sai dele. */
  definirSobreODeck: (dentro: boolean) => void;
  /** Falso sob `prefers-reduced-motion` ou em ponteiro grosso: o laço nunca
   *  roda e cada sistema se desenha uma vez, parado. */
  readonly movimento: () => boolean;
};

const Contexto = createContext<ApiHero | null>(null);

/**
 * `null` fora do provider é legítimo: quem consome sabe se desenhar parado.
 * Nenhum sistema da hero pode depender do movimento para aparecer.
 */
export function useHeroParallax(): ApiHero | null {
  return useContext(Contexto);
}

/** Constante de tempo da suavização do parallax, em segundos. */
const TAU_PARALLAX = 0.18;

/**
 * O provider É a `<section>` da hero, não um embrulho invisível em volta dela.
 *
 * Um `<div className="contents">` seria transparente para o layout mas também
 * para a medição: `display: contents` não gera caixa, e `getBoundingClientRect`
 * devolveria zeros — o parallax inteiro leria a posição do mouse contra um
 * retângulo de tamanho nenhum.
 */
export function HeroParallaxProvider({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  const raiz = useRef<HTMLElement>(null);
  const inscritos = useRef(new Set<Inscricao>());
  const movimento = useRef(false);

  const estado = useRef({
    alvoX: 0,
    alvoY: 0,
    x: 0,
    y: 0,
    clienteX: 0,
    clienteY: 0,
    sobreODeck: false,
    quadro: 0,
    ultimo: 0,
    inicio: 0,
  });

  /**
   * A identidade do valor do contexto nunca muda. Um objeto novo por render
   * invalidaria todos os consumidores a cada vez, que é o custo que este
   * provider existe para não ter.
   *
   * `useState` com inicializador preguiçoso, não `useRef`: o valor é lido
   * durante o render (vai para o `value` do provider), e ler `ref.current` no
   * render é o que o `react-hooks/refs` proíbe, com razão. O estado nunca é
   * atualizado, então não há re-render — só a garantia de identidade estável.
   */
  const [api] = useState<ApiHero>(() => ({
    assinar(fn) {
      inscritos.current.add(fn);
      return () => {
        inscritos.current.delete(fn);
      };
    },
    definirSobreODeck(dentro) {
      estado.current.sobreODeck = dentro;
    },
    movimento: () => movimento.current,
  }));

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;

    const e = estado.current;
    const podeAnimar =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    movimento.current = podeAnimar;

    function emitir(dt: number, t: number) {
      const q: Quadro = {
        x: e.x,
        y: e.y,
        clienteX: e.clienteX,
        clienteY: e.clienteY,
        dt,
        t,
        sobreODeck: e.sobreODeck,
      };
      for (const fn of inscritos.current) fn(q);
    }

    // Um quadro parado, sempre. Quem não tem movimento recebe este e nada mais;
    // quem tem, recebe este antes do primeiro tique, para não nascer torto.
    emitir(0, 0);

    if (!podeAnimar) return;

    function laço(agora: number) {
      if (!e.inicio) e.inicio = agora;
      const dt = Math.min((agora - (e.ultimo || agora)) / 1000, 0.05);
      e.ultimo = agora;

      // Suavização exponencial, não interpolação por quadro fixo: assim o
      // parallax chega no mesmo tempo a 60Hz e a 120Hz.
      const k = 1 - Math.exp(-dt / TAU_PARALLAX);
      e.x += (e.alvoX - e.x) * k;
      e.y += (e.alvoY - e.y) * k;

      emitir(dt, (agora - e.inicio) / 1000);
      e.quadro = requestAnimationFrame(laço);
    }

    function ligar() {
      if (!e.quadro) {
        e.ultimo = 0;
        e.quadro = requestAnimationFrame(laço);
      }
    }

    function desligar() {
      if (e.quadro) cancelAnimationFrame(e.quadro);
      e.quadro = 0;
    }

    function aoMover(ev: PointerEvent) {
      const r = el!.getBoundingClientRect();
      e.alvoX = Math.max(-1, Math.min(1, ((ev.clientX - r.left) / r.width) * 2 - 1));
      e.alvoY = Math.max(-1, Math.min(1, ((ev.clientY - r.top) / r.height) * 2 - 1));
      e.clienteX = ev.clientX;
      e.clienteY = ev.clientY;
    }

    function aoSair() {
      e.alvoX = 0;
      e.alvoY = 0;
      // Longe o bastante para o botão magnético soltar sem precisar de um
      // sinal próprio de saída.
      e.clienteX = -99999;
      e.clienteY = -99999;
    }

    el.addEventListener("pointermove", aoMover, { passive: true });
    el.addEventListener("pointerleave", aoSair);

    // O laço começa ligado, e o observador só o desliga.
    //
    // O contrário — esperar o primeiro registro do IntersectionObserver para
    // ligar — deixa a hero congelada se esse registro não chegar, e ele nem
    // sempre chega: numa janela ocluída ou com a renderização suspensa o
    // observador pode não entregar nada. A hero está no topo da página; assumir
    // que ela é visível no primeiro quadro é a aposta certa, e o observador
    // corrige em seguida se não for.
    ligar();

    const observador = new IntersectionObserver(
      ([entrada]) => (entrada.isIntersecting ? ligar() : desligar()),
      { threshold: 0 },
    );
    observador.observe(el);

    return () => {
      el.removeEventListener("pointermove", aoMover);
      el.removeEventListener("pointerleave", aoSair);
      observador.disconnect();
      desligar();
    };
  }, []);

  return (
    <Contexto.Provider value={api}>
      <section ref={raiz} id={id} className={className}>
        {children}
      </section>
    </Contexto.Provider>
  );
}
