/**
 * Os quadros: quais existem, qual conjunto serve esta tela, e como trazê-los
 * para a memória.
 *
 * Nada aqui toca no `window` em tempo de import — só dentro das funções que
 * baixam — então a parte de política (`escolherConjunto`, `dprDoCanvas`,
 * `indicesDaPassadaGrossa`, `vizinhoCarregado`) é testada direto no node.
 *
 * Os arquivos vêm de `ffmpeg`, numerados de 1 e com três dígitos:
 *   ffmpeg -i <clipe> -vf "fps=12,scale=1280:-2" -c:v libwebp -quality 72 \
 *     -compression_level 6 -preset picture public/hero/frames/f_%03d.webp
 */
import { recorteDeCobertura, type Tamanho } from "./beats";

/* ------------------------------------------------------------------ */
/* 1. Os conjuntos que existem em public/hero                          */
/* ------------------------------------------------------------------ */

export type Conjunto = {
  readonly id: "grande" | "pequeno";
  readonly dir: string;
  readonly largura: number;
  readonly altura: number;
  readonly total: number;
  /** Peso real medido do conjunto, em bytes. Usado só para documentar. */
  readonly bytes: number;
};

export const CONJUNTOS = {
  /** Resolução nativa do clipe. Não há de onde tirar mais detalhe que isto. */
  grande: {
    id: "grande",
    dir: "/hero/frames",
    largura: 1280,
    altura: 720,
    total: 120,
    bytes: 3_377_282,
  },
  /** Conjunto de economia. Existe para o 3g, não como faixa de qualidade. */
  pequeno: {
    id: "pequeno",
    dir: "/hero/frames-640",
    largura: 640,
    altura: 360,
    total: 120,
    bytes: 1_331_332,
  },
} as const satisfies Record<string, Conjunto>;

export function urlDoQuadro(conjunto: Conjunto, indice: number): string {
  const i = Math.min(Math.max(Math.round(indice), 0), conjunto.total - 1);
  return `${conjunto.dir}/f_${String(i + 1).padStart(3, "0")}.webp`;
}

/* ------------------------------------------------------------------ */
/* 2. Qual conjunto para esta tela                                     */
/* ------------------------------------------------------------------ */

/** Acima disto a ampliação começa a aparecer como borrão. */
const UPSCALE_ACEITAVEL = 1.5;
/** Nenhum buffer de canvas passa disto, por mais denso que seja o display. */
const DPR_MAX = 2;

export type Rede = "desconhecida" | "rapida" | "3g";

/**
 * A rede como o navegador a reporta. 2g e `saveData` não aparecem aqui de
 * propósito: esses casos nem chegam a montar a sequência — a decisão é do
 * script inline em `capacidade.tsx`.
 */
export function redeAtual(): Rede {
  const conexao = (
    navigator as Navigator & { connection?: { effectiveType?: string } }
  ).connection;
  const tipo = conexao?.effectiveType;
  if (!tipo) return "desconhecida";
  return tipo === "3g" ? "3g" : "rapida";
}

function dprLimitado(dpr: number): number {
  return Math.min(Math.max(dpr, 1), DPR_MAX);
}

/** Quanto o quadro precisa ser ampliado para cobrir o destino. */
function escalaDeCobertura(fonte: Tamanho, destino: Tamanho): number {
  return Math.max(
    destino.largura / fonte.largura,
    destino.altura / fonte.altura,
  );
}

/**
 * A intuição de "tela pequena, imagem pequena" está errada aqui, e vale
 * registrar por quê: a hero sangra em `100svh`, e cobrir um viewport de
 * celular em pé (~9:19) a partir de um quadro 16:9 usa só ~26% da largura do
 * quadro. O conjunto de 640px vira ~166px reais na horizontal — borrado. Num
 * celular o conjunto certo é o grande.
 *
 * Então o conjunto pequeno serve a dois casos, e só a eles:
 *  - `3g`: não é lento o bastante para cair no hero estático (isso é
 *    `saveData` e 2g), mas 3,4MB doeria. 1,3MB passa.
 *  - janela genuinamente pequena, onde 640px cobrem a tela de fato.
 */
export function escolherConjunto(
  destino: Tamanho,
  dpr: number,
  rede: Rede,
): Conjunto {
  if (rede === "3g") return CONJUNTOS.pequeno;
  // Antes de medir a tela, a aposta segura é a nitidez: trocar para menos
  // depois é pior que já ter o certo.
  if (destino.largura <= 0 || destino.altura <= 0) return CONJUNTOS.grande;

  const d = dprLimitado(dpr);
  const emPixelsDeTela = {
    largura: destino.largura * d,
    altura: destino.altura * d,
  };
  return escalaDeCobertura(CONJUNTOS.pequeno, emPixelsDeTela) <=
    UPSCALE_ACEITAVEL
    ? CONJUNTOS.pequeno
    : CONJUNTOS.grande;
}

/**
 * O `dpr` que o buffer do canvas deve usar.
 *
 * Não é só `min(devicePixelRatio, 2)`: num celular denso, cobrir a tela já
 * amplia o quadro 2,3x ou mais, e encher um buffer de 3x disso não acrescenta
 * um pixel de detalhe — só queima taxa de preenchimento, que é justamente o que
 * derruba o frame rate no celular. O teto é a resolução da fonte, não a do
 * display.
 */
export function dprDoCanvas(
  destino: Tamanho,
  conjunto: Conjunto,
  dpr: number,
): number {
  if (destino.largura <= 0 || destino.altura <= 0) return 1;
  const { sw } = recorteDeCobertura(conjunto, destino);
  const teto = (UPSCALE_ACEITAVEL * sw) / destino.largura;
  return Math.min(Math.max(Math.min(dpr, DPR_MAX, teto), 1), DPR_MAX);
}

/* ------------------------------------------------------------------ */
/* 3. Carregamento em duas passadas                                    */
/* ------------------------------------------------------------------ */

/** Um em cada oito na primeira passada. */
export const PASSO_GROSSO = 8;
/** Quantos downloads ao mesmo tempo. Mais que isto congestiona sem ganhar. */
const SIMULTANEOS = 6;
/** Falhas na passada grossa antes de desistir e cair no estático. */
const FALHAS_ACEITAS = 3;

/**
 * A primeira passada. ~16 imagens já permitem scrubar de forma grossa; o resto
 * preenche os buracos depois. O primeiro e o último entram sempre: são os dois
 * quadros que ficam parados em tela por mais tempo (abertura e dissolução).
 */
export function indicesDaPassadaGrossa(
  total: number,
  passo = PASSO_GROSSO,
): number[] {
  if (total <= 0) return [];
  const fora: number[] = [];
  for (let i = 0; i < total; i += passo) fora.push(i);
  const ultimo = total - 1;
  if (fora[fora.length - 1] !== ultimo) fora.push(ultimo);
  return fora;
}

/**
 * O índice carregado mais próximo do alvo, ou -1 se ainda não há nada para
 * desenhar. É o que faz o scrub funcionar durante o carregamento em vez de
 * piscar.
 *
 * No empate escolhe o anterior: um quadro atrasado lê como leve atraso, um
 * quadro adiantado lê como salto.
 */
export function vizinhoCarregado<T>(
  quadros: readonly (T | null)[],
  alvo: number,
): number {
  const total = quadros.length;
  if (total === 0) return -1;

  const centro = Math.min(Math.max(Math.round(alvo), 0), total - 1);
  if (quadros[centro] != null) return centro;

  for (let d = 1; d < total; d += 1) {
    const antes = centro - d;
    if (antes >= 0 && quadros[antes] != null) return antes;
    const depois = centro + d;
    if (depois < total && quadros[depois] != null) return depois;
  }
  return -1;
}

export type EstadoDaSequencia = {
  readonly conjunto: Conjunto;
  readonly quadros: readonly (HTMLImageElement | null)[];
  /** Fração da passada grossa que já chegou, 0 a 1. */
  readonly progresso: number;
  /** A passada grossa terminou: o trilho já vale. */
  readonly pronta: boolean;
  /** Nem o essencial chegou. Cai no estático e não tenta de novo. */
  readonly falhou: boolean;
};

function baixar(url: string, alta: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    // Atributo em vez de propriedade: `fetchPriority` ainda não está no lib.dom
    // de todas as versões de TypeScript, e o atributo funciona igual.
    img.setAttribute("fetchpriority", alta ? "high" : "low");
    img.onload = () => {
      // `decode()` paga a decodificação agora, fora do `drawImage` — senão o
      // primeiro quadro de cada imagem engasga dentro do rAF.
      if (typeof img.decode === "function") {
        img.decode().then(
          () => resolve(img),
          () => resolve(img),
        );
      } else {
        resolve(img);
      }
    };
    img.onerror = () => reject(new Error(`quadro não carregou: ${url}`));
    img.src = url;
  });
}

/**
 * Começa o carregamento e avisa a cada avanço. Devolve a função de cancelar —
 * chame-a ao desmontar, senão downloads de uma hero que saiu de cena continuam
 * ocupando a conexão.
 */
export function carregarSequencia(
  conjunto: Conjunto,
  aoMudar: (estado: EstadoDaSequencia) => void,
): () => void {
  const quadros: (HTMLImageElement | null)[] = Array.from(
    { length: conjunto.total },
    () => null,
  );
  const grossa = indicesDaPassadaGrossa(conjunto.total);
  const grossos = new Set(grossa);
  const resto: number[] = [];
  for (let i = 0; i < conjunto.total; i += 1) {
    if (!grossos.has(i)) resto.push(i);
  }

  let vivo = true;
  let prontos = 0;
  let falhas = 0;
  let pronta = false;
  let falhou = false;

  const avisar = () => {
    if (!vivo) return;
    aoMudar({
      conjunto,
      quadros,
      progresso: grossa.length === 0 ? 1 : Math.min(prontos, grossa.length) / grossa.length,
      pronta,
      falhou,
    });
  };

  async function fila(indices: number[], alta: boolean): Promise<void> {
    let cursor = 0;
    const trabalhador = async () => {
      while (vivo) {
        const posicao = cursor;
        cursor += 1;
        if (posicao >= indices.length) return;
        const indice = indices[posicao];
        try {
          const img = await baixar(urlDoQuadro(conjunto, indice), alta);
          if (!vivo) return;
          quadros[indice] = img;
          if (alta) prontos += 1;
          avisar();
        } catch {
          if (!vivo) return;
          if (alta) {
            falhas += 1;
            if (falhas > FALHAS_ACEITAS) {
              falhou = true;
              avisar();
              return;
            }
          }
        }
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(SIMULTANEOS, indices.length) }, () =>
        trabalhador(),
      ),
    );
  }

  void (async () => {
    await fila(grossa, true);
    if (!vivo || falhou) return;
    pronta = true;
    avisar();
    await fila(resto, false);
  })();

  return () => {
    vivo = false;
  };
}
