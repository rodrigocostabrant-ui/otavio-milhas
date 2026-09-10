/**
 * Textos da hero 3D. Como todo o resto, nada fica hardcoded no componente.
 *
 * `entra` e `sai` são faixas de `t` (0 a 1). A sobreposição entre um bloco e o
 * seguinte é curta e proposital: a tela nunca fica completamente sem texto.
 * `sai: null` significa que o bloco entra e não sai mais.
 */

export type BlocoHero3D = {
  readonly chave: string;
  readonly texto: string;
  /** Só um bloco da página inteira pode ser `h1`. */
  readonly tag: "h1" | "p";
  readonly entra: readonly [number, number];
  readonly sai: readonly [number, number] | null;
};

export const hero3d = {
  blocos: [
    {
      chave: "pista",
      texto: "Tudo começa com uma decisão.",
      tag: "h1",
      entra: [0.0, 0.02],
      sai: [0.14, 0.2],
    },
    {
      chave: "decolagem",
      texto: "Aprenda a acumular milhas no dia a dia.",
      tag: "p",
      entra: [0.16, 0.22],
      sai: [0.42, 0.49],
    },
    {
      chave: "janela",
      texto: "E veja o mundo de outro lugar.",
      tag: "p",
      entra: [0.585, 0.635],
      sai: [0.79, 0.84],
    },
  ] as const satisfies readonly BlocoHero3D[],

  /** Entra em t ≈ 0.45 e não sai mais: a oferta precisa ficar alcançável
   *  durante a maior parte da rolagem. */
  cta: {
    rotulo: "Quero aprender a viajar com milhas",
    entra: [0.45, 0.5] as const,
  },

  reforco: {
    texto: "Com quem já negociou mais de 5 milhões de milhas desde 2021.",
    entra: [0.82, 0.87] as const,
  },

  /** Usado pelo poster estático e pela versão sem WebGL. */
  estatico: {
    titulo: "Tudo começa com uma decisão.",
    sub: "Aprenda a acumular milhas no dia a dia e veja o mundo de outro lugar.",
  },
} as const;
