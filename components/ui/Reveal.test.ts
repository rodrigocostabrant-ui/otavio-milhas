import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Reveal } from "./Reveal";

/**
 * O contrato do `Reveal`: ele é um ENFEITE, não um interruptor de visibilidade.
 *
 * Quem entrega o estado escondido já no HTML aposta que o JS vai chegar para
 * desfazê-lo. Quando não chega — sem JS, ou com `prefers-reduced-motion`, que
 * troca o componente animado por uma `<div>` comum e deixa o estilo do servidor
 * para trás — a aposta some com a página inteira: `Reveal` embrulha as oito
 * seções de conteúdo.
 *
 * A regra que impede isso de voltar: o conteúdo nasce visível, e o estado
 * escondido só existe depois que o cliente provou que sabe desfazê-lo.
 */
describe("Reveal", () => {
  const marcacao = () =>
    renderToStaticMarkup(
      createElement(Reveal, null, createElement("p", null, "conteúdo")),
    );

  it("entrega o conteúdo visível no HTML do servidor", () => {
    expect(marcacao()).not.toMatch(/opacity\s*:\s*0/);
  });

  it("não desloca o conteúdo no HTML do servidor", () => {
    // Um `translateY` sem quem o desfaça deixa a seção torta para sempre.
    expect(marcacao()).not.toMatch(/transform\s*:/);
  });

  it("mantém o conteúdo no HTML do servidor", () => {
    expect(marcacao()).toContain("conteúdo");
  });
});
