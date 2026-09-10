"use client";

import { useEffect, useRef } from "react";
import { LIMIAR_BLOOM, bloomPara, quadroPara, recorteDeCobertura } from "./beats";
import { useHeroProgresso } from "./progresso";
import {
  carregarSequencia,
  dprDoCanvas,
  escolherConjunto,
  redeAtual,
  vizinhoCarregado,
} from "./quadros";

/**
 * O canvas.
 *
 * Não é um `<video>` com `currentTime` dirigido por rolagem: para o seek ser
 * fluido o arquivo precisaria ter todo quadro como keyframe, o que triplica o
 * tamanho, e mesmo assim o Safari do iOS engasga — `seeking` é assíncrono e não
 * garante quadro entregue. Aqui o "seek" é um índice de array, então é
 * determinístico e idêntico em todo navegador.
 *
 * Três coisas seguram o custo:
 *
 *  - **Redesenha só quando muda.** O quadro raramente avança um índice por
 *    frame de tela. Sem o limiar, o canvas repinta 60 vezes por segundo o mesmo
 *    pixel.
 *  - **O buffer é limitado pela fonte, não pelo display.** Ver `dprDoCanvas`.
 *  - **Desenha o quadro carregado mais próximo do alvo.** O scrub funciona
 *    durante o carregamento em vez de piscar.
 */
export default function Sequencia({
  aoProgresso,
  aoFalhar,
}: {
  aoProgresso: (fracao: number, pronta: boolean) => void;
  aoFalhar: () => void;
}) {
  const { inscrever, acordar } = useHeroProgresso();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;

    const ctx = el.getContext("2d", { alpha: false });
    if (!ctx) {
      aoFalhar();
      return;
    }

    /** A cor do véu e do fundo do canvas vem do token, nunca de literal. */
    const corDeFundo = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-bg")
      .trim();

    const medir = () => {
      const caixa = el.getBoundingClientRect();
      return {
        largura: Math.max(1, Math.round(caixa.width)),
        altura: Math.max(1, Math.round(caixa.height)),
      };
    };

    // O conjunto é escolhido uma vez. Reescolher ao redimensionar significaria
    // baixar 120 imagens de novo no meio da rolagem.
    const conjunto = escolherConjunto(
      medir(),
      window.devicePixelRatio || 1,
      redeAtual(),
    );

    let quadros: readonly (HTMLImageElement | null)[] = [];
    let largura = 0;
    let altura = 0;
    let ultimoQuadro = -1;
    let ultimoBloom = -1;

    const dimensionar = () => {
      const tamanho = medir();
      largura = tamanho.largura;
      altura = tamanho.altura;

      const d = dprDoCanvas(tamanho, conjunto, window.devicePixelRatio || 1);
      el.width = Math.round(largura * d);
      el.height = Math.round(altura * d);
      // Mexer em width/height zera o estado do contexto, então a transformação
      // vem depois — e a partir daqui desenhamos em px de CSS.
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Sem isto o canvas nasce preto (contexto opaco) e a fresta da abertura
      // mostraria um retângulo escuro antes do primeiro quadro chegar.
      ctx.fillStyle = corDeFundo;
      ctx.fillRect(0, 0, largura, altura);

      ultimoQuadro = -1;
      ultimoBloom = -1;
    };

    const desenhar = (t: number) => {
      if (largura === 0) return;

      const alvo = quadroPara(t, conjunto.total);
      const indice = vizinhoCarregado(quadros, alvo);
      if (indice < 0) return;

      const bloom = bloomPara(t);
      if (
        indice === ultimoQuadro &&
        Math.abs(bloom - ultimoBloom) < LIMIAR_BLOOM
      ) {
        return;
      }
      ultimoQuadro = indice;
      ultimoBloom = bloom;

      const img = quadros[indice];
      if (!img) return;

      const { sx, sy, sw, sh } = recorteDeCobertura(conjunto, {
        largura,
        altura,
      });
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, largura, altura);

      // A lavagem branca da dissolução, desenhada aqui e não em CSS: um
      // `filter` no elemento custa uma camada nova a cada frame, e isto é um
      // `fillRect`.
      if (bloom > 0) {
        ctx.globalAlpha = bloom;
        ctx.fillStyle = corDeFundo;
        ctx.fillRect(0, 0, largura, altura);
        ctx.globalAlpha = 1;
      }
    };

    dimensionar();

    const cancelarCarga = carregarSequencia(conjunto, (estado) => {
      quadros = estado.quadros;
      aoProgresso(estado.progresso, estado.pronta);
      if (estado.falhou) {
        aoFalhar();
        return;
      }
      // Um quadro novo chegou: força o redesenho e acorda o laço, que pode
      // estar dormindo com a pessoa parada.
      ultimoQuadro = -1;
      acordar();
    });

    const observador = new ResizeObserver(() => {
      dimensionar();
      acordar();
    });
    observador.observe(el);

    const cancelarInscricao = inscrever(({ suave: t }) => desenhar(t));

    return () => {
      cancelarInscricao();
      cancelarCarga();
      observador.disconnect();
    };
  }, [inscrever, acordar, aoProgresso, aoFalhar]);

  return (
    <canvas
      ref={canvas}
      data-hero-canvas
      aria-hidden="true"
      role="presentation"
      className="absolute inset-0 h-full w-full"
    />
  );
}
