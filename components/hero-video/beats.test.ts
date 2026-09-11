import { describe, expect, it } from "vitest";
import {
  ABERTURA,
  BEATS,
  BLOCOS,
  BLOCOS_NARRATIVOS,
  DISSOLUCAO,
  MARCA_VAZIO,
  TEXTO,
  VOO,
  aberturaPara,
  bloomPara,
  indicadorPara,
  janelaDeTexto,
  marcaVazioPara,
  progresso,
  quadroPara,
  recorteDeCobertura,
  veuPara,
} from "./beats";

/** Amostragem densa de `t`, para as propriedades que valem em todo o trilho. */
function amostras(de = 0, ate = 1, passo = 0.001): number[] {
  const fora: number[] = [];
  for (let t = de; t <= ate + 1e-9; t += passo) fora.push(Number(t.toFixed(6)));
  return fora;
}

function opacidade(bloco: keyof typeof TEXTO, t: number): number {
  return janelaDeTexto(t, TEXTO[bloco].entra, TEXTO[bloco].sai);
}

describe("progresso da rolagem", () => {
  it("é 0 antes do trilho começar a passar", () => {
    expect(progresso(0, 0, 3800, 800)).toBe(0);
    expect(progresso(0, 500, 3800, 800)).toBe(0);
  });

  it("é 1 quando o trilho terminou de passar", () => {
    expect(progresso(3000, 0, 3800, 800)).toBe(1);
    expect(progresso(99999, 0, 3800, 800)).toBe(1);
  });

  it("é 0.5 na metade do percurso", () => {
    expect(progresso(1500, 0, 3800, 800)).toBeCloseTo(0.5, 6);
  });

  it("desconta o quanto o trilho está abaixo do topo do documento", () => {
    expect(progresso(1700, 200, 3800, 800)).toBeCloseTo(0.5, 6);
  });

  it("satura em vez de estourar quando a rolagem passa das pontas", () => {
    expect(progresso(-400, 0, 3800, 800)).toBe(0);
  });

  it("devolve 0 quando o trilho não é mais alto que a viewport", () => {
    expect(progresso(400, 0, 800, 800)).toBe(0);
    expect(progresso(400, 0, 600, 800)).toBe(0);
  });

  it("cresce sem retroceder ao longo da rolagem", () => {
    let anterior = -1;
    for (let y = 0; y <= 3800; y += 25) {
      const t = progresso(y, 0, 3800, 800);
      expect(t).toBeGreaterThanOrEqual(anterior);
      anterior = t;
    }
  });
});

describe("quadro exibido", () => {
  const TOTAL = 120;

  it("trava no primeiro quadro durante o vazio e a abertura", () => {
    expect(quadroPara(0, TOTAL)).toBe(0);
    expect(quadroPara(0.05, TOTAL)).toBe(0);
    expect(quadroPara(0.19, TOTAL)).toBe(0);
    expect(quadroPara(VOO.inicio, TOTAL)).toBe(0);
  });

  it("trava no último quadro a partir da dissolução", () => {
    expect(quadroPara(VOO.fim, TOTAL)).toBe(TOTAL - 1);
    expect(quadroPara(0.95, TOTAL)).toBe(TOTAL - 1);
    expect(quadroPara(1, TOTAL)).toBe(TOTAL - 1);
  });

  it("gasta o voo inteiro entre o fim da abertura e o início da dissolução", () => {
    const meio = (VOO.inicio + VOO.fim) / 2;
    expect(quadroPara(meio, TOTAL)).toBe(Math.round((TOTAL - 1) / 2));
  });

  it("nunca sai do intervalo de quadros existentes", () => {
    for (const t of amostras(-0.5, 1.5, 0.005)) {
      const q = quadroPara(t, TOTAL);
      expect(q).toBeGreaterThanOrEqual(0);
      expect(q).toBeLessThanOrEqual(TOTAL - 1);
      expect(Number.isInteger(q)).toBe(true);
    }
  });

  it("avança sem retroceder", () => {
    let anterior = -1;
    for (const t of amostras()) {
      const q = quadroPara(t, TOTAL);
      expect(q).toBeGreaterThanOrEqual(anterior);
      anterior = q;
    }
  });

  it("não quebra com uma sequência de um quadro só", () => {
    expect(quadroPara(0.5, 1)).toBe(0);
    expect(quadroPara(0.5, 0)).toBe(0);
  });
});

describe("janela de opacidade de um bloco de texto", () => {
  const entra = [0.2, 0.3] as const;
  const sai = [0.6, 0.7] as const;

  it("é 0 antes de entrar", () => {
    expect(janelaDeTexto(0, entra, sai)).toBe(0);
    expect(janelaDeTexto(0.2, entra, sai)).toBe(0);
  });

  it("é 1 no miolo", () => {
    expect(janelaDeTexto(0.3, entra, sai)).toBeCloseTo(1, 6);
    expect(janelaDeTexto(0.45, entra, sai)).toBeCloseTo(1, 6);
    expect(janelaDeTexto(0.6, entra, sai)).toBeCloseTo(1, 6);
  });

  it("é 0 depois de sair", () => {
    expect(janelaDeTexto(0.7, entra, sai)).toBe(0);
    expect(janelaDeTexto(1, entra, sai)).toBe(0);
  });

  it("transiciona nas bordas em vez de piscar", () => {
    expect(janelaDeTexto(0.25, entra, sai)).toBeCloseTo(0.5, 6);
    expect(janelaDeTexto(0.65, entra, sai)).toBeCloseTo(0.5, 6);
  });

  it("nunca sai de 0..1", () => {
    for (const t of amostras(-0.2, 1.2, 0.002)) {
      const o = janelaDeTexto(t, entra, sai);
      expect(o).toBeGreaterThanOrEqual(0);
      expect(o).toBeLessThanOrEqual(1);
    }
  });

  it("entra e não sai mais quando `sai` é null", () => {
    expect(janelaDeTexto(0.35, entra, null)).toBeCloseTo(1, 6);
    expect(janelaDeTexto(1, entra, null)).toBeCloseTo(1, 6);
  });
});

describe("coreografia do texto sobre o vídeo", () => {
  it("deixa a tela literalmente limpa durante o beat de vazio", () => {
    for (const t of amostras(0, BEATS.vazio[1], 0.002)) {
      for (const bloco of BLOCOS) {
        expect(opacidade(bloco, t)).toBe(0);
      }
    }
  });

  it("nunca deixa a tela sem nenhum texto depois que o primeiro entrou", () => {
    for (const t of amostras(TEXTO.headline.entra[1] + 0.005, 1, 0.001)) {
      const maior = Math.max(...BLOCOS.map((b) => opacidade(b, t)));
      expect(maior, `t=${t} ficou sem texto`).toBeGreaterThanOrEqual(0.49);
    }
  });

  it("nunca mostra dois blocos narrativos ao mesmo tempo", () => {
    // Cruzar duas frases na mesma âncora não lê como transição: lê como texto
    // borrado. Dava para ver o subtítulo atravessando o `<h1>` na tela. Uma
    // frase de cada vez, sempre.
    for (const t of amostras(0, 1, 0.001)) {
      const visiveis = BLOCOS_NARRATIVOS.filter((b) => opacidade(b, t) > 0.06);
      expect(visiveis, `t=${t} com ${visiveis.join(" + ")} juntos`).toHaveLength(
        visiveis.length > 1 ? 0 : visiveis.length,
      );
    }
  });

  it("termina de tirar um bloco antes de começar a pôr o próximo", () => {
    expect(TEXTO.headline.sai![1]).toBeLessThanOrEqual(TEXTO.sub.entra[0]);
    expect(TEXTO.sub.sai![1]).toBeLessThanOrEqual(TEXTO.selo.entra[0]);
  });

  it("põe o CTA inteiro na tela antes do primeiro revezamento — é ele que segura o instante em que nenhuma frase está visível", () => {
    expect(TEXTO.cta.entra[1]).toBeLessThanOrEqual(TEXTO.headline.sai![0]);
    expect(opacidade("cta", TEXTO.headline.sai![0])).toBeCloseTo(1, 6);
  });

  it("mantém o CTA na tela do meio da sequência até o fim", () => {
    expect(TEXTO.cta.sai).toBeNull();
    expect(TEXTO.cta.entra[0]).toBeLessThan(0.5);
    expect(opacidade("cta", 1)).toBeCloseTo(1, 6);
  });

  it("solta o selo antes da dissolução, deixando só o CTA", () => {
    expect(TEXTO.selo.sai[1]).toBeLessThan(BEATS.dissolucao[0]);
    expect(opacidade("selo", BEATS.dissolucao[0])).toBe(0);
    expect(opacidade("headline", BEATS.dissolucao[0])).toBe(0);
    expect(opacidade("sub", BEATS.dissolucao[0])).toBe(0);
  });

  it("põe o h1 sobre a pista, não sobre as nuvens", () => {
    expect(TEXTO.headline.entra[1]).toBeLessThan(BEATS.decolagem[1]);
    expect(opacidade("headline", BEATS.decolagem[1])).toBeGreaterThan(0.9);
  });
});

describe("abertura em grande angular", () => {
  it("começa fechada: fresta de altura zero e pouco mais da metade da largura", () => {
    const a = aberturaPara(0);
    expect(a.topo).toBeCloseTo(0.5, 6);
    expect(a.lado).toBeCloseTo((1 - ABERTURA.larguraInicial) / 2, 6);
    expect(a.raio).toBeCloseTo(ABERTURA.raioInicial, 6);
  });

  it("continua fechada durante o beat de vazio", () => {
    expect(aberturaPara(BEATS.vazio[1] - 0.001).topo).toBeCloseTo(0.5, 3);
  });

  it("termina sangrando de borda a borda, sem canto arredondado", () => {
    const a = aberturaPara(VOO.inicio);
    expect(a.topo).toBe(0);
    expect(a.lado).toBe(0);
    expect(a.raio).toBe(0);
    expect(aberturaPara(1)).toEqual({ topo: 0, lado: 0, raio: 0 });
  });

  it("abre sem nunca voltar a fechar", () => {
    let topo = Infinity;
    let lado = Infinity;
    for (const t of amostras()) {
      const a = aberturaPara(t);
      expect(a.topo).toBeLessThanOrEqual(topo + 1e-9);
      expect(a.lado).toBeLessThanOrEqual(lado + 1e-9);
      topo = a.topo;
      lado = a.lado;
    }
  });

  it("nunca produz inset fora de 0..50%", () => {
    for (const t of amostras(-0.2, 1.2, 0.002)) {
      const a = aberturaPara(t);
      expect(a.topo).toBeGreaterThanOrEqual(0);
      expect(a.topo).toBeLessThanOrEqual(0.5);
      expect(a.lado).toBeGreaterThanOrEqual(0);
      expect(a.lado).toBeLessThanOrEqual(0.5);
    }
  });

  it("acaba de abrir exatamente quando o voo começa a gastar quadro", () => {
    expect(ABERTURA.largura[1]).toBe(VOO.inicio);
  });
});

describe("dissolução no off-white", () => {
  it("não toca no quadro antes da hora", () => {
    expect(veuPara(0)).toBe(0);
    expect(veuPara(0.8)).toBe(0);
    expect(bloomPara(0)).toBe(0);
    expect(bloomPara(0.8)).toBe(0);
  });

  it("chega a véu cheio antes do sticky soltar", () => {
    expect(veuPara(DISSOLUCAO.veu[1])).toBeCloseTo(1, 6);
    expect(veuPara(1)).toBeCloseTo(1, 6);
    expect(DISSOLUCAO.veu[1]).toBeLessThanOrEqual(1);
  });

  it("lava o azul ANTES do véu chapado chegar — é o que evita a costura visível", () => {
    expect(DISSOLUCAO.bloom[0]).toBeLessThan(DISSOLUCAO.veu[0]);
    expect(bloomPara(DISSOLUCAO.veu[0])).toBeGreaterThan(0.1);
  });

  it("sobe sem retroceder e sem estourar", () => {
    let veu = -1;
    let bloom = -1;
    for (const t of amostras()) {
      const v = veuPara(t);
      const b = bloomPara(t);
      expect(v).toBeGreaterThanOrEqual(veu - 1e-9);
      expect(b).toBeGreaterThanOrEqual(bloom - 1e-9);
      expect(v).toBeLessThanOrEqual(1);
      expect(b).toBeLessThanOrEqual(DISSOLUCAO.bloomMax + 1e-9);
      veu = v;
      bloom = b;
    }
  });

  it("começa a dissolver só depois do voo ter gastado o último quadro", () => {
    expect(VOO.fim).toBe(BEATS.dissolucao[0]);
  });
});

describe("marca no beat de vazio", () => {
  it("está inteira na tela em t=0, que é onde a página não pode parecer quebrada", () => {
    expect(marcaVazioPara(0)).toBeCloseTo(1, 6);
    expect(marcaVazioPara(BEATS.vazio[0])).toBeCloseTo(1, 6);
  });

  it("sai antes de o `<h1>` da decolagem entrar — nunca dois blocos de texto ao mesmo tempo", () => {
    expect(MARCA_VAZIO.sai[1]).toBeLessThanOrEqual(TEXTO.headline.entra[0]);
    expect(marcaVazioPara(TEXTO.headline.entra[0])).toBe(0);
  });

  it("some antes de a abertura em grande angular começar", () => {
    // A fresta abre do centro — exatamente onde o bloco vive. Se ele ainda
    // estivesse lá, seria imagem escura por cima da tinta escura da tagline.
    // A marca pertence ao beat de vazio e a mais nada.
    expect(MARCA_VAZIO.sai[1]).toBeLessThanOrEqual(BEATS.abertura[0]);
    expect(marcaVazioPara(BEATS.abertura[0])).toBe(0);
  });

  it("só diminui", () => {
    let anterior = Infinity;
    for (const t of amostras()) {
      const o = marcaVazioPara(t);
      expect(o).toBeLessThanOrEqual(anterior + 1e-9);
      anterior = o;
    }
  });

  it("não reacende mais tarde na sequência", () => {
    for (const t of amostras(MARCA_VAZIO.sai[1], 1, 0.002)) {
      expect(marcaVazioPara(t)).toBe(0);
    }
  });
});

describe("indicador de continuar rolando", () => {
  it("está visível na tela vazia, que é onde ele é a única pista do que fazer", () => {
    expect(indicadorPara(0)).toBeCloseTo(1, 6);
    expect(indicadorPara(BEATS.vazio[0])).toBeCloseTo(1, 6);
  });

  it("some antes de a abertura terminar", () => {
    expect(indicadorPara(0.12)).toBe(0);
    expect(indicadorPara(VOO.inicio)).toBe(0);
  });

  it("só diminui", () => {
    let anterior = Infinity;
    for (const t of amostras()) {
      const o = indicadorPara(t);
      expect(o).toBeLessThanOrEqual(anterior + 1e-9);
      anterior = o;
    }
  });
});

describe("recorte de cobertura do quadro", () => {
  const fonte = { largura: 1280, altura: 720 };

  it("usa o quadro inteiro quando as proporções batem", () => {
    expect(recorteDeCobertura(fonte, { largura: 1920, altura: 1080 })).toEqual({
      sx: 0,
      sy: 0,
      sw: 1280,
      sh: 720,
    });
  });

  it("num celular em pé, usa a altura toda e recorta a largura", () => {
    const r = recorteDeCobertura(fonte, { largura: 390, altura: 844 });
    expect(r.sh).toBe(720);
    expect(r.sw).toBeCloseTo((720 * 390) / 844, 4);
    expect(r.sx).toBeCloseTo((1280 - (720 * 390) / 844) / 2, 4);
    expect(r.sy).toBe(0);
  });

  it("numa tela panorâmica, usa a largura toda e recorta a altura", () => {
    const r = recorteDeCobertura(fonte, { largura: 1920, altura: 960 });
    expect(r).toEqual({ sx: 0, sy: 40, sw: 1280, sh: 640 });
  });

  it("preserva a proporção do destino, que é o que evita o quadro esticado", () => {
    for (const destino of [
      { largura: 390, altura: 844 },
      { largura: 768, altura: 1024 },
      { largura: 1440, altura: 860 },
      { largura: 2560, altura: 1080 },
      { largura: 300, altura: 300 },
    ]) {
      const r = recorteDeCobertura(fonte, destino);
      expect(r.sw / r.sh).toBeCloseTo(destino.largura / destino.altura, 5);
    }
  });

  it("nunca pede pixel que não existe no quadro", () => {
    for (const destino of [
      { largura: 320, altura: 2000 },
      { largura: 4000, altura: 200 },
      { largura: 1, altura: 1 },
    ]) {
      for (const foco of [
        { x: 0, y: 0 },
        { x: 0.5, y: 0.5 },
        { x: 1, y: 1 },
      ]) {
        const r = recorteDeCobertura(fonte, destino, foco);
        expect(r.sx).toBeGreaterThanOrEqual(0);
        expect(r.sy).toBeGreaterThanOrEqual(0);
        expect(r.sx + r.sw).toBeLessThanOrEqual(fonte.largura + 1e-9);
        expect(r.sy + r.sh).toBeLessThanOrEqual(fonte.altura + 1e-9);
      }
    }
  });

  it("obedece o ponto de foco", () => {
    const destino = { largura: 390, altura: 844 };
    const esquerda = recorteDeCobertura(fonte, destino, { x: 0, y: 0.5 });
    const direita = recorteDeCobertura(fonte, destino, { x: 1, y: 0.5 });
    expect(esquerda.sx).toBe(0);
    expect(direita.sx).toBeCloseTo(1280 - direita.sw, 6);
  });

  it("não devolve NaN quando o destino ainda não tem tamanho", () => {
    const r = recorteDeCobertura(fonte, { largura: 0, altura: 0 });
    expect(Number.isFinite(r.sw)).toBe(true);
    expect(Number.isFinite(r.sh)).toBe(true);
    expect(r).toEqual({ sx: 0, sy: 0, sw: 1280, sh: 720 });
  });
});

describe("encadeamento dos beats", () => {
  const ordem = [
    BEATS.vazio,
    BEATS.abertura,
    BEATS.decolagem,
    BEATS.subida,
    BEATS.janela,
    BEATS.partida,
    BEATS.dissolucao,
  ];

  it("cobre o trilho inteiro sem buraco e sem sobreposição", () => {
    expect(ordem[0][0]).toBe(0);
    expect(ordem[ordem.length - 1][1]).toBe(1);
    for (let i = 1; i < ordem.length; i += 1) {
      expect(ordem[i][0], `beat ${i} não encosta no anterior`).toBe(
        ordem[i - 1][1],
      );
    }
  });

  it("tem todo beat com duração positiva", () => {
    for (const [a, b] of ordem) expect(b).toBeGreaterThan(a);
  });
});
