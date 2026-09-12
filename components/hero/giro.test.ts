import { describe, expect, it } from "vitest";
import {
  avancar,
  DERIVA,
  poseDe,
  posicaoNoTrilho,
  REPOUSO,
  volta,
  type EstadoGiro,
} from "./giro";

/**
 * O contrato do deck.
 *
 * Três movimentos disputam o mesmo número (`offset`), e a ordem entre eles é a
 * diferença entre um carrossel vivo e um carrossel hostil. Nada disso se
 * verifica olhando a tela: a deriva é lenta demais para se distinguir a olho de
 * uma inércia residual, e a independência de taxa de quadros só apareceria num
 * monitor de 120Hz.
 */

const parado = (): EstadoGiro => ({
  offset: 0,
  velocidade: 0,
  arrastando: false,
});

/**
 * Roda `segundos` de laço em passos de `dt`.
 *
 * A contagem é por número inteiro de passos, não por acumulador (`t += dt`):
 * somar 1/60 trezentas vezes não dá exatamente 5, e o passo a mais que sobra
 * bastava para os testes de taxa de quadros acusarem uma diferença que era do
 * teste, não do código.
 */
function rodar(
  estado: EstadoGiro,
  segundos: number,
  dt: number,
  sobreODeck = false,
) {
  const passos = Math.round(segundos / dt);
  for (let i = 0; i < passos; i++) avancar(estado, dt, sobreODeck);
}

describe("deriva", () => {
  it("avança sozinha quando ninguém está mexendo", () => {
    const e = parado();
    rodar(e, 1, 1 / 60);
    expect(e.offset).toBeGreaterThan(0);
  });

  it("fecha uma volta inteira em 42 segundos", () => {
    const e = parado();
    rodar(e, 42, 1 / 60);
    expect(e.offset).toBeCloseTo(1, 1);
  });

  it("para enquanto o ponteiro está sobre o deck", () => {
    // Esta é a regra que impede a foto de fugir de quem tentou olhá-la.
    const e = parado();
    rodar(e, 3, 1 / 60, true);
    expect(e.offset).toBe(0);
  });

  it("não mexe em nada enquanto a mão está arrastando", () => {
    const e = { ...parado(), arrastando: true };
    rodar(e, 3, 1 / 60);
    expect(e.offset).toBe(0);
  });

  it("anda o mesmo tanto a 60Hz e a 120Hz", () => {
    const a = parado();
    const b = parado();
    rodar(a, 5, 1 / 60);
    rodar(b, 5, 1 / 120);
    expect(a.offset).toBeCloseTo(b.offset, 4);
  });
});

describe("inércia", () => {
  it("escorre depois de soltar e freia até o repouso", () => {
    const e = { ...parado(), velocidade: 2 };
    rodar(e, 2, 1 / 60);
    expect(e.offset).toBeGreaterThan(0);
    expect(Math.abs(e.velocidade)).toBeLessThanOrEqual(REPOUSO);
  });

  it("freia no mesmo tempo a 60Hz e a 120Hz", () => {
    // Com um atrito por quadro em vez de por segundo, o monitor mais rápido
    // frearia na metade do tempo — o deck andaria menos em telas melhores.
    const a = { ...parado(), velocidade: 2 };
    const b = { ...parado(), velocidade: 2 };
    rodar(a, 1, 1 / 60);
    rodar(b, 1, 1 / 120);
    expect(a.offset).toBeCloseTo(b.offset, 6);
  });

  it("ganha da deriva enquanto está viva", () => {
    // Enquanto a inércia corre, a deriva não soma nada por baixo — senão o
    // deck aceleraria sozinho no instante em que a mão o solta.
    const comPonteiroFora = { ...parado(), velocidade: 1 };
    const comPonteiroDentro = { ...parado(), velocidade: 1 };
    rodar(comPonteiroFora, 0.3, 1 / 60, false);
    rodar(comPonteiroDentro, 0.3, 1 / 60, true);
    expect(comPonteiroFora.offset).toBe(comPonteiroDentro.offset);
    expect(comPonteiroFora.offset).toBeGreaterThan(DERIVA * 0.3);
  });
});

describe("a volta do trilho", () => {
  it("fecha invisível nas duas pontas", () => {
    // É o que permite o cartão saltar do fim para o começo sem ninguém ver.
    expect(poseDe(-1).opacidade).toBe(0);
    expect(poseDe(1).opacidade).toBe(0);
  });

  it("deixa o cartão da frente opaco", () => {
    expect(poseDe(0).opacidade).toBe(1);
  });

  it("não deixa nenhum cartão translúcido no meio da pilha", () => {
    // Os quatro que ficam em cena. Se algum deles já estivesse esmaecendo, o
    // texto de um apareceria por dentro do outro.
    for (const s of [-0.333, 0, 0.333, 0.667]) {
      expect(poseDe(s).opacidade).toBe(1);
    }
  });

  it("mantém o cartão da frente opaco até estar quase fora do quadro", () => {
    // O fantasma que isto impede: um cartão grande e próximo a 70% de opacidade
    // vira vidro, e o texto do cartão de trás aparece por dentro dele.
    // A saída da frente é geométrica; a opacidade só entra nos últimos 6%.
    expect(poseDe(0.8).opacidade).toBe(1);
    expect(poseDe(0.9).opacidade).toBe(1);
    expect(poseDe(0.97).opacidade).toBeLessThan(1);
  });

  it("já levou o cartão para fora do quadro antes de começar a apagá-lo", () => {
    // Quatro quintos de altura abaixo do centro: a borda de cima do cartão já
    // passou do meio do palco e o resto está fora, cortado pela base.
    expect(poseDe(0.95).y).toBeGreaterThan(80);
  });

  it("deixa o cartão da frente inteiro no quadro antes da queda", () => {
    // Se o mais próximo em cena já estivesse descendo para sair, ele apareceria
    // sempre cortado pela base — que foi o defeito da versão linear.
    expect(Math.abs(poseDe(0.667).y)).toBeLessThan(20);
  });

  it("acelera a saída em vez de descer a pilha inteira", () => {
    const arco = poseDe(0.7).y - poseDe(0.3).y;
    const queda = poseDe(1).y - poseDe(0.7).y;
    expect(queda).toBeGreaterThan(arco * 2);
  });

  it("empilha o cartão da frente por cima do de trás", () => {
    expect(poseDe(0.5).camada).toBeGreaterThan(poseDe(-0.5).camada);
    expect(poseDe(0.5).z).toBeGreaterThan(poseDe(-0.5).z);
  });

  it("mantém os seis cartões espalhados, nunca dois na mesma pose", () => {
    const poses = [0, 1, 2, 3, 4, 5].map((i) =>
      poseDe(posicaoNoTrilho(i, 6, 0)).y,
    );
    expect(new Set(poses).size).toBe(6);
  });
});

describe("volta()", () => {
  it("traz qualquer valor para [0, 1)", () => {
    // O offset cresce sem limite enquanto a deriva roda; sem isto, o trilho
    // quebraria depois de alguns minutos de página aberta.
    for (const v of [-3.25, -0.5, 0, 0.5, 7.75]) {
      const r = volta(v);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(1);
    }
  });
});
