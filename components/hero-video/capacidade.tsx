"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

/**
 * Quem decide se a sequência roda.
 *
 * A decisão acontece **antes do primeiro paint**, num script inline, e não no
 * React. O motivo é a abertura: o HTML servido é a hero estática (pôster e
 * textos, que é o que funciona sem JS), e a sequência começa com a tela vazia.
 * Se a troca esperasse a hidratação, todo mundo veria o pôster inteiro piscar
 * e sumir. Decidindo antes do paint, quem recebe a sequência nunca vê o pôster
 * e quem recebe o estático nunca vê a tela vazia.
 *
 * O React só *lê* o que o script decidiu — nunca redecide. Uma segunda
 * derivação em JS seria uma segunda fonte de verdade, e as duas divergiriam no
 * primeiro caso de borda. O atributo no `<html>` é, literalmente, um store
 * externo, então quem faz a leitura é `useSyncExternalStore`: `desligar()` mexe
 * no DOM e o React descobre pelo observador, sem `setState` dentro de efeito.
 *
 * Ordem da degradação, e cada caso cai no mesmo lugar (a hero estática):
 *   1. `prefers-reduced-motion: reduce`  → o script não liga
 *   2. sem JS                            → o script não roda
 *   3. `saveData`, 2g ou slow-2g         → o script não liga
 *   4. quadros falharam ao carregar      → `desligar()` desfaz
 */

/**
 * Não use template literal com interpolação aqui: este texto vai inteiro para
 * dentro de um `<script>`, e a única defesa que ele tem é ser constante.
 */
const SCRIPT_DE_ATIVACAO = [
  "try{",
  'var d=document.documentElement,c=navigator.connection||{},e=c.effectiveType||"";',
  'if(!matchMedia("(prefers-reduced-motion: reduce)").matches',
  '&&c.saveData!==true&&e!=="2g"&&e!=="slow-2g"){',
  'd.dataset.heroModo="sequencia";d.dataset.heroFase="vazio";',
  "}}catch(_){}",
].join("");

/**
 * Precisa ser renderizado **antes** do header e da hero no `app/page.tsx`: um
 * script inline executa durante o parse, então tudo que vem depois dele já
 * nasce no modo certo. Depois do header, o header piscaria.
 */
export function AtivarSequencia() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT_DE_ATIVACAO }} />;
}

export type Modo = "avaliando" | "sequencia" | "estatico";

const CONSULTA_MOVIMENTO = "(prefers-reduced-motion: reduce)";

function assinar(aoMudar: () => void): () => void {
  const observador = new MutationObserver(aoMudar);
  observador.observe(document.documentElement, {
    attributeFilter: ["data-hero-modo"],
  });
  return () => observador.disconnect();
}

function ler(): Modo {
  return document.documentElement.dataset.heroModo === "sequencia"
    ? "sequencia"
    : "estatico";
}

/** No servidor não há atributo para ler: o HTML servido é o estático. */
const lerNoServidor = (): Modo => "avaliando";

export function useCapacidade(): {
  modo: Modo;
  /** Volta para a hero estática. O observador acima faz o React acompanhar. */
  desligar: () => void;
} {
  const modo = useSyncExternalStore(assinar, ler, lerNoServidor);

  const desligar = useCallback(() => {
    const raiz = document.documentElement;
    delete raiz.dataset.heroModo;
    delete raiz.dataset.heroFase;
    // O animador escreve estilo inline nos blocos de texto; sem limpar, eles
    // ficariam presos em `opacity: 0` na hero estática.
    for (const el of raiz.querySelectorAll<HTMLElement>("[data-bloco]")) {
      el.style.removeProperty("opacity");
      el.style.removeProperty("visibility");
      el.style.removeProperty("transform");
    }
  }, []);

  // A pessoa pode ligar "reduzir movimento" com a página aberta. Aí a sequência
  // para, e não volta.
  useEffect(() => {
    const mq = window.matchMedia(CONSULTA_MOVIMENTO);
    const aoMudar = () => {
      if (mq.matches) desligar();
    };
    mq.addEventListener("change", aoMudar);
    return () => mq.removeEventListener("change", aoMudar);
  }, [desligar]);

  return { modo, desligar };
}
