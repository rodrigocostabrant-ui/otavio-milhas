/**
 * Toda a calibragem da hero cinemática mora aqui.
 *
 * Se o ritmo, a abertura, a entrada de um texto ou a dissolução final estiverem
 * errados, o número que resolve está neste arquivo — nomeado por beat, nunca
 * espalhado pelos componentes. Nenhum componente da hero define timing próprio.
 *
 * Este arquivo não importa React nem toca no DOM: é lido tanto pelo canvas
 * quanto pelas camadas de DOM, e é testado direto no node (`beats.test.ts`).
 *
 * `t` é o progresso da rolagem dentro do trilho, de 0 a 1.
 * `q` é o índice do quadro exibido, de 0 a `total − 1`.
 */

/* ------------------------------------------------------------------ */
/* 1. Utilidades de interpolação                                       */
/* ------------------------------------------------------------------ */

export function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** Progresso dentro de uma faixa `[a, b]`, saturado em 0 e 1. */
export function faixa(t: number, a: number, b: number): number {
  if (b === a) return t < a ? 0 : 1;
  return clamp01((t - a) / (b - a));
}

/** Smoothstep. Suaviza as pontas para nada entrar nem sair com solavanco. */
export function suave(n: number): number {
  const x = clamp01(n);
  return x * x * (3 - 2 * x);
}

export function lerp(a: number, b: number, n: number): number {
  return a + (b - a) * n;
}

/* ------------------------------------------------------------------ */
/* 2. Os beats                                                         */
/* ------------------------------------------------------------------ */

/**
 * Os limites foram medidos no material, não estimados.
 *
 * O clipe tem 10,0s e os pontos de virada caem em: 2,45s (rotação, o nariz
 * subindo), 2,70–3,30s (o chão se dissolvendo em nuvem — não é corte, é
 * transformação), 4,60–5,15s (aproximação até atravessar o vidro), 5,40–7,45s
 * (POV da janela, o trecho calmo), 7,45–7,70s (a câmera sai pelo vidro) e
 * 7,70–10,0s (afastamento acima das nuvens).
 *
 * Convertidos por `t = VOO.inicio + vt/10 × (VOO.fim − VOO.inicio)`, é de onde
 * saem os números abaixo. Mexer num limite aqui NÃO muda qual quadro aparece —
 * isso é `VOO`. Estes limites servem para saber em que beat um texto entra.
 */
export const BEATS = {
  /** Off-white, vazio. Nem header, nem texto: só o indicador de rolagem. */
  vazio: [0.0, 0.06],
  /** A fresta abre do centro até sangrar de borda a borda. Quadro travado em 0. */
  abertura: [0.06, 0.2],
  /** Corrida na pista e rotação. É onde o `<h1>` é lido. */
  decolagem: [0.2, 0.39],
  /** O chão vira nuvem e o avião sobe. O `<h1>` sai justo aqui. */
  subida: [0.39, 0.56],
  /** Atravessa o vidro e assenta no POV da janela. */
  janela: [0.56, 0.74],
  /** Sai da cabine e se afasta acima do tapete de nuvens. */
  partida: [0.74, 0.9],
  /** O quadro lava em branco e o branco vira o off-white da página. */
  dissolucao: [0.9, 1.0],
} as const;

/**
 * A faixa de `t` que gasta quadro. A abertura e a dissolução acontecem em cima
 * do primeiro e do último quadro, respectivamente — o voo inteiro cabe aqui.
 *
 * Encurtar esta faixa acelera o voo e alonga as pontas; alargar faz o contrário.
 */
export const VOO = { inicio: 0.2, fim: 0.9 } as const;

/**
 * Quanto o `t` cru é puxado para o alvo por frame. Menor = mais macio e mais
 * atrasado em relação ao dedo. 0.16 é o ponto em que a rolagem crua para de
 * tremer sem a imagem parecer que está com preguiça.
 */
export const AMORTECIMENTO = 0.16;

/** Abaixo desta diferença entre cru e suave, o rAF pode dormir. */
export const PARADA = 0.0005;

/**
 * Só redesenha quando o quadro mudou de índice ou a lavagem branca andou mais
 * que isto. Sem o limiar, o canvas repinta 60x por segundo o mesmo pixel — é o
 * princípio que a referência aplica ao `currentTime` de um vídeo, aqui aplicado
 * ao índice do quadro.
 */
export const LIMIAR_BLOOM = 0.004;

/* ------------------------------------------------------------------ */
/* 3. A abertura em grande angular                                     */
/* ------------------------------------------------------------------ */

/**
 * A fresta cresce do centro. A altura lidera e a largura fecha depois: a
 * imagem primeiro rasga na horizontal e só então alcança as bordas laterais.
 * Abrir os dois eixos juntos dá um retângulo crescendo, que lê como um cartão
 * aumentando de tamanho — exatamente o que esta hero não pode parecer.
 *
 * `largura[1]` tem de coincidir com `VOO.inicio`: a imagem acaba de sangrar no
 * mesmo instante em que o avião começa a andar. Há teste garantindo isso.
 */
export const ABERTURA = {
  altura: [0.06, 0.185],
  largura: [0.075, 0.2],
  /** Largura da fresta no começo, em fração da tela. */
  larguraInicial: 0.55,
  /** Raio dos cantos da fresta, em px. Vai a 0 quando ela sangra. */
  raioInicial: 40,
} as const;

export function aberturaPara(t: number): {
  topo: number;
  lado: number;
  raio: number;
} {
  const pAltura = suave(faixa(t, ABERTURA.altura[0], ABERTURA.altura[1]));
  const pLargura = suave(faixa(t, ABERTURA.largura[0], ABERTURA.largura[1]));
  return {
    topo: 0.5 * (1 - pAltura),
    lado: ((1 - ABERTURA.larguraInicial) / 2) * (1 - pLargura),
    raio: ABERTURA.raioInicial * (1 - Math.min(pAltura, pLargura)),
  };
}

/* ------------------------------------------------------------------ */
/* 4. Os blocos de texto                                               */
/* ------------------------------------------------------------------ */

export const BLOCOS = ["headline", "sub", "selo", "cta"] as const;
export type Bloco = (typeof BLOCOS)[number];

/** Os que contam a história e se revezam. O CTA não: ele entra e fica. */
export const BLOCOS_NARRATIVOS = ["headline", "sub", "selo"] as const;

export type JanelaDeBloco = {
  readonly entra: readonly [number, number];
  readonly sai: readonly [number, number] | null;
};

/**
 * Um bloco por beat, e duas regras que os amarram.
 *
 * **1. O revezamento é seco: um sai inteiro antes do próximo começar a entrar.**
 *
 * A primeira versão cruzava os dois — a janela de saída de um era a de entrada
 * do próximo, o que garante no papel que o maior dos dois nunca desce de 0,5.
 * Na tela ficou ruim: as três frases dividem a mesma âncora na base, e duas
 * frases a 50% empilhadas não leem como transição, leem como texto borrado. Dá
 * para ver o subtítulo atravessando o `<h1>`. Há teste que falha se dois blocos
 * narrativos passarem de 6% de opacidade ao mesmo tempo.
 *
 * **2. O CTA entra inteiro antes do primeiro revezamento.**
 *
 * É o que torna o revezamento seco seguro: no instante em que nenhuma frase
 * está visível, o botão já está lá, e a tela nunca fica sem texto. Sem isso, um
 * corte seco em `t ≈ 0.49` deixaria a tela momentaneamente vazia no meio da
 * rolagem. Também há teste.
 */
export const TEXTO = {
  /**
   * Sobre a pista e a rotação, onde há tempo de ler. Sai já na subida: o `<h1>`
   * acompanha a decolagem inteira, que é o momento de pagamento da sequência.
   */
  headline: { entra: [0.215, 0.265], sai: [0.47, 0.505] },
  /** Sobre a subida entre as nuvens. */
  sub: { entra: [0.505, 0.545], sai: [0.66, 0.695] },
  /** Sobre o POV da janela. Sai na partida, deixando a tela só com o CTA. */
  selo: { entra: [0.695, 0.735], sai: [0.83, 0.865] },
  /** Entra antes da metade e não sai mais: a oferta fica sempre alcançável. */
  cta: { entra: [0.42, 0.47], sai: null },
} as const satisfies Record<Bloco, JanelaDeBloco>;

export function janelaDeTexto(
  t: number,
  entra: readonly [number, number],
  sai: readonly [number, number] | null,
): number {
  const dentro = suave(faixa(t, entra[0], entra[1]));
  const fora = sai ? suave(faixa(t, sai[0], sai[1])) : 0;
  return dentro * (1 - fora);
}

/**
 * O indicador de "continue rolando" é a única coisa na tela durante o vazio —
 * sem ele, uma página off-white em branco parece quebrada em vez de parecer um
 * respiro. Some antes de a abertura terminar: quem já está rolando não precisa
 * mais do aviso.
 */
export const INDICADOR = { sai: [0.055, 0.12] } as const;

export function indicadorPara(t: number): number {
  return 1 - suave(faixa(t, INDICADOR.sai[0], INDICADOR.sai[1]));
}

/* ------------------------------------------------------------------ */
/* 5. A dissolução final                                               */
/* ------------------------------------------------------------------ */

/**
 * A saída é por luminância, não por geometria: a máscara não fecha de volta
 * num cartão.
 *
 * Em dois tempos, e a ordem importa. O último quadro do clipe **não** é céu
 * claro: o alto dele é azul saturado, e um véu off-white subindo sobre azul lê
 * como uma película por cima da imagem — a costura que faz a hero parecer um
 * quadrado cortado. Então primeiro o `bloom` lava o quadro para quase branco
 * dentro do próprio canvas, e só depois o `veu` (na cor exata de `--color-bg`)
 * termina o serviço. Quando o véu chapado chega, já não há azul para ele
 * cobrir.
 *
 * `bloom[0] < veu[0]` é obrigatório, e há teste garantindo.
 */
export const DISSOLUCAO = {
  /** Lavagem branca desenhada DENTRO do canvas. Mata o azul. */
  bloom: [0.855, 0.965],
  /** Até onde a lavagem vai. 1 apagaria o quadro antes da hora. */
  bloomMax: 0.82,
  /** Véu de `--color-bg` no DOM. Fecha antes de 1 para sobrar um respiro. */
  veu: [0.895, 0.98],
} as const;

export function bloomPara(t: number): number {
  return (
    suave(faixa(t, DISSOLUCAO.bloom[0], DISSOLUCAO.bloom[1])) *
    DISSOLUCAO.bloomMax
  );
}

export function veuPara(t: number): number {
  return suave(faixa(t, DISSOLUCAO.veu[0], DISSOLUCAO.veu[1]));
}

/**
 * Onde a máscara permanente do canvas começa a apagar, em fração da altura.
 * A borda de baixo nunca é dura: o vídeo desvanece no fundo da página em vez de
 * terminar numa linha reta.
 */
export const MASCARA_INFERIOR = 0.78;

/* ------------------------------------------------------------------ */
/* 6. O header                                                         */
/* ------------------------------------------------------------------ */

/**
 * Três estados, porque duas não bastam: durante o vazio o fundo é off-white e
 * um logo branco seria invisível, então o header não existe. Ele só aparece
 * quando há imagem atrás dele para dar contraste, e materializa de novo
 * (fundo, borda, logo escuro) junto com a dissolução.
 */
export const HEADER = {
  /** A partir daqui a imagem já cobre o topo: header transparente, logo branco. */
  imersivoDe: 0.17,
  /** A partir daqui o header volta ao normal, junto com a página. */
  normalDe: 0.885,
} as const;

export type ModoDeHeader = "vazio" | "imersivo" | "normal";

export function headerPara(t: number): ModoDeHeader {
  if (t >= HEADER.normalDe) return "normal";
  if (t >= HEADER.imersivoDe) return "imersivo";
  return "vazio";
}

/* ------------------------------------------------------------------ */
/* 7. Rolagem e quadro                                                 */
/* ------------------------------------------------------------------ */

/**
 * `t` a partir da rolagem. Calculado num lugar só; canvas, texto e véu leem a
 * mesma fonte.
 *
 * `topo` e `scrollY` estão no espaço do documento. Quando o trilho não é mais
 * alto que a viewport não há percurso, e a resposta honesta é 0 — não NaN.
 */
export function progresso(
  scrollY: number,
  topo: number,
  altura: number,
  viewport: number,
): number {
  const percurso = altura - viewport;
  if (percurso <= 0) return 0;
  return clamp01((scrollY - topo) / percurso);
}

/**
 * O quadro para um `t`. Trava em 0 antes de a abertura terminar e no último a
 * partir da dissolução, porque `faixa` já satura — sem `if` nenhum.
 */
export function quadroPara(t: number, total: number): number {
  if (total <= 1) return 0;
  return Math.round(faixa(t, VOO.inicio, VOO.fim) * (total - 1));
}

/* ------------------------------------------------------------------ */
/* 8. Geometria do quadro na tela                                      */
/* ------------------------------------------------------------------ */

export type Tamanho = { largura: number; altura: number };

/**
 * Ponto do quadro que fica no centro da tela quando sobra imagem para recortar.
 *
 * `0.5, 0.5` mantém o avião centrado nos seis quadros que eu conferi, inclusive
 * no recorte de celular em pé — que é o mais violento, porque cobrir 9:19 a
 * partir de 16:9 usa só ~26% da largura do quadro. Se algum beat sair
 * desenquadrado no celular, é este par que resolve.
 */
export const FOCO = { x: 0.5, y: 0.5 } as const;

/**
 * O recorte do quadro que cobre a tela sem esticar nada — o `object-fit: cover`
 * feito à mão, porque quem desenha é o canvas.
 *
 * É a conta que quebra a hero no celular se estiver errada: em tela alta o
 * quadro sobra na largura, em tela panorâmica sobra na altura, e nos dois casos
 * a proporção do destino tem de ser respeitada ou o avião entorta.
 */
export function recorteDeCobertura(
  fonte: Tamanho,
  destino: Tamanho,
  foco: { x: number; y: number } = FOCO,
): { sx: number; sy: number; sw: number; sh: number } {
  if (destino.largura <= 0 || destino.altura <= 0) {
    return { sx: 0, sy: 0, sw: fonte.largura, sh: fonte.altura };
  }

  const escala = Math.max(
    destino.largura / fonte.largura,
    destino.altura / fonte.altura,
  );
  const sw = Math.min(fonte.largura, destino.largura / escala);
  const sh = Math.min(fonte.altura, destino.altura / escala);

  return {
    sx: clamp01(foco.x) * (fonte.largura - sw),
    sy: clamp01(foco.y) * (fonte.altura - sh),
    sw,
    sh,
  };
}
