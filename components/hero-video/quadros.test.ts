import { describe, expect, it } from "vitest";
import {
  CONJUNTOS,
  PASSO_GROSSO,
  dprDoCanvas,
  escolherConjunto,
  indicesDaPassadaGrossa,
  urlDoQuadro,
  vizinhoCarregado,
} from "./quadros";

const CELULAR = { largura: 390, altura: 844 };
const DESKTOP = { largura: 1440, altura: 860 };
/** Janela baixa e estreita: o único caso em que 640px realmente cobre a tela. */
const JANELINHA = { largura: 420, altura: 320 };

describe("escolha do conjunto de quadros", () => {
  it("dá o conjunto grande para um celular, porque o recorte em pé joga a largura fora", () => {
    // Cobrir 390x844 a partir de 16:9 usa só ~26% da largura da fonte: 640px
    // viram ~166px reais na horizontal. O conjunto pequeno fica borrado num
    // celular, não leve — é o contrário da intuição de "tela pequena, imagem
    // pequena".
    expect(escolherConjunto(CELULAR, 3, "rapida").id).toBe("grande");
    expect(escolherConjunto(CELULAR, 2, "rapida").id).toBe("grande");
  });

  it("dá o conjunto grande num desktop", () => {
    expect(escolherConjunto(DESKTOP, 1, "rapida").id).toBe("grande");
    expect(escolherConjunto(DESKTOP, 2, "rapida").id).toBe("grande");
  });

  it("dá o conjunto pequeno quando 640px de fato cobrem a tela", () => {
    expect(escolherConjunto(JANELINHA, 1, "rapida").id).toBe("pequeno");
  });

  it("dá o conjunto pequeno em 3g, mesmo onde a nitidez pediria o grande", () => {
    // 3g não é lento o bastante para cair no estático, mas 3,4MB doeria.
    expect(escolherConjunto(CELULAR, 3, "3g").id).toBe("pequeno");
    expect(escolherConjunto(DESKTOP, 2, "3g").id).toBe("pequeno");
  });

  it("trata rede desconhecida como rápida, e não como ruim", () => {
    expect(escolherConjunto(CELULAR, 2, "desconhecida").id).toBe("grande");
  });

  it("não quebra antes de a tela ter tamanho medido", () => {
    expect(escolherConjunto({ largura: 0, altura: 0 }, 1, "rapida").id).toBe(
      "grande",
    );
  });
});

describe("url de um quadro", () => {
  it("numera de 1, com três dígitos, como o ffmpeg gerou", () => {
    expect(urlDoQuadro(CONJUNTOS.grande, 0)).toBe("/hero/frames/f_001.webp");
    expect(urlDoQuadro(CONJUNTOS.grande, 9)).toBe("/hero/frames/f_010.webp");
    expect(urlDoQuadro(CONJUNTOS.grande, 119)).toBe("/hero/frames/f_120.webp");
    expect(urlDoQuadro(CONJUNTOS.pequeno, 0)).toBe(
      "/hero/frames-640/f_001.webp",
    );
  });

  it("satura em vez de pedir um arquivo que não existe", () => {
    expect(urlDoQuadro(CONJUNTOS.grande, -3)).toBe("/hero/frames/f_001.webp");
    expect(urlDoQuadro(CONJUNTOS.grande, 999)).toBe("/hero/frames/f_120.webp");
  });
});

describe("dpr efetivo do canvas", () => {
  it("nunca desce abaixo de 1 nem sobe acima de 2", () => {
    for (const destino of [CELULAR, DESKTOP, JANELINHA]) {
      for (const dpr of [0.5, 1, 1.5, 2, 3, 4]) {
        const d = dprDoCanvas(destino, CONJUNTOS.grande, dpr);
        expect(d).toBeGreaterThanOrEqual(1);
        expect(d).toBeLessThanOrEqual(2);
      }
    }
  });

  it("corta o dpr num celular de tela densa — o buffer extra não traz pixel nenhum novo", () => {
    // 1280x720 cobrindo 390x844 mostra ~333px de fonte na horizontal. Encher um
    // buffer de 390*3 = 1170px é ampliar 3,5x: custo de preenchimento sem
    // detalhe. O corte é o que segura o frame rate no celular.
    expect(dprDoCanvas(CELULAR, CONJUNTOS.grande, 3)).toBeLessThan(1.6);
  });

  it("respeita um dpr baixo em vez de inventar resolução", () => {
    expect(dprDoCanvas(DESKTOP, CONJUNTOS.grande, 1)).toBe(1);
  });

  it("libera o dpr cheio quando a fonte tem pixel de sobra", () => {
    expect(dprDoCanvas(JANELINHA, CONJUNTOS.grande, 2)).toBe(2);
  });

  it("não devolve NaN antes de a tela ter tamanho medido", () => {
    expect(dprDoCanvas({ largura: 0, altura: 0 }, CONJUNTOS.grande, 2)).toBe(1);
  });
});

describe("passada grossa", () => {
  const TOTAL = 120;

  it("pega um em cada oito, e garante o primeiro e o último", () => {
    const i = indicesDaPassadaGrossa(TOTAL);
    expect(i[0]).toBe(0);
    expect(i.at(-1)).toBe(TOTAL - 1);
    expect(i).toContain(PASSO_GROSSO);
  });

  it("é barata o bastante para valer como primeira passada", () => {
    // ~16 imagens de 120: o suficiente para scrubar de forma grossa enquanto o
    // resto preenche os buracos.
    expect(indicesDaPassadaGrossa(TOTAL).length).toBeLessThan(TOTAL / 6);
  });

  it("não repete índice, não sai do intervalo e vem em ordem", () => {
    for (const total of [1, 2, 7, 8, 9, 120, 121]) {
      const i = indicesDaPassadaGrossa(total);
      expect(new Set(i).size).toBe(i.length);
      expect([...i].sort((a, b) => a - b)).toEqual(i);
      for (const n of i) {
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThanOrEqual(total - 1);
      }
    }
  });
});

describe("vizinho carregado", () => {
  /** `total` posições, com só algumas preenchidas. */
  function comCarregados(total: number, presentes: number[]): (object | null)[] {
    const q: (object | null)[] = Array.from({ length: total }, () => null);
    for (const i of presentes) q[i] = {};
    return q;
  }

  it("usa o próprio quadro quando ele já chegou", () => {
    expect(vizinhoCarregado(comCarregados(20, [0, 8, 16]), 8)).toBe(8);
  });

  it("cai no mais próximo que existe enquanto o alvo não chegou", () => {
    const q = comCarregados(20, [0, 8, 16]);
    expect(vizinhoCarregado(q, 10)).toBe(8);
    expect(vizinhoCarregado(q, 14)).toBe(16);
    expect(vizinhoCarregado(q, 19)).toBe(16);
    expect(vizinhoCarregado(q, 1)).toBe(0);
  });

  it("no empate, prefere o quadro anterior — atrasar lê melhor que adiantar", () => {
    expect(vizinhoCarregado(comCarregados(20, [0, 8]), 4)).toBe(0);
  });

  it("avisa que não há nada para desenhar em vez de devolver um índice falso", () => {
    expect(vizinhoCarregado(comCarregados(20, []), 5)).toBe(-1);
    expect(vizinhoCarregado([], 0)).toBe(-1);
  });

  it("não estoura com alvo fora do intervalo", () => {
    const q = comCarregados(20, [0, 19]);
    expect(vizinhoCarregado(q, -5)).toBe(0);
    expect(vizinhoCarregado(q, 99)).toBe(19);
  });
});

describe("descritores dos conjuntos", () => {
  it("descrevem o que existe em public/hero", () => {
    expect(CONJUNTOS.grande.largura).toBe(1280);
    expect(CONJUNTOS.grande.altura).toBe(720);
    expect(CONJUNTOS.pequeno.largura).toBe(640);
    expect(CONJUNTOS.pequeno.altura).toBe(360);
  });

  it("têm a mesma contagem de quadros, senão o mapeamento de `t` mudaria com a tela", () => {
    expect(CONJUNTOS.pequeno.total).toBe(CONJUNTOS.grande.total);
  });

  it("têm a mesma proporção, senão o recorte mudaria com a tela", () => {
    expect(CONJUNTOS.pequeno.largura / CONJUNTOS.pequeno.altura).toBeCloseTo(
      CONJUNTOS.grande.largura / CONJUNTOS.grande.altura,
      6,
    );
  });
});
