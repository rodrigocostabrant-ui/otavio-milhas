import { CatmullRomCurve3, Vector3 } from "three";

/**
 * TODAS as constantes de calibragem da hero 3D moram aqui.
 *
 * Se a sequência estiver com o timing errado, o número que resolve está neste
 * arquivo — não espalhado pelos componentes. Nomeado por beat.
 *
 * Sistema de coordenadas: Y é cima, o avião voa no sentido +X.
 */

/* ------------------------------------------------------------------ */
/* 1. Limites dos beats, em `t` (0 a 1)                                */
/* ------------------------------------------------------------------ */

export const BEATS = {
  pista: [0.0, 0.12],
  decolagem: [0.12, 0.5],
  passagem: [0.5, 0.58],
  janela: [0.58, 0.78],
  partida: [0.78, 0.94],
  hold: [0.94, 1.0],
} as const;

/** Quanto o `t` cru é suavizado por frame. Menor = mais macio e mais atrasado. */
export const AMORTECIMENTO = 0.12;

/** Onde o flash branco cobre o corte pelo vidro. */
export const FLASH_ENTRADA = { inicio: 0.5, pico: 0.545, fim: 0.6, forca: 1.0 };

/** Flash da saída da cabine. Zere `forca` se preferir sair sem estouro. */
export const FLASH_SAIDA = { inicio: 0.775, pico: 0.795, fim: 0.83, forca: 0.42 };

/* ------------------------------------------------------------------ */
/* 2. Trajetória do avião                                              */
/* ------------------------------------------------------------------ */

/**
 * O avião voa continuamente durante TODA a sequência, inclusive enquanto a
 * câmera está dentro dele. É o que garante que, no beat de partida, ele esteja
 * numa posição plausível em vez de teleportado.
 */
export const VOO = {
  /** Onde ele começa a taxiar e onde larga o solo. */
  taxiX: [-46, -8],
  alturaTremBaixo: 1.15,
  /** Rotação (o nariz subindo) acontece entre estes dois `t`. */
  rotacao: [0.12, 0.24],
  /** Fim da rotação: onde ele está ao terminar de subir o nariz. */
  posRotacao: { x: 34, y: 13 },
  /** Fim da subida, em t = 1. */
  cruzeiro: { x: 540, y: 205 },
  /** Ângulo de ataque em graus: no pico da rotação e em cruzeiro. */
  pitchGraus: [13, 5.5],
  /** Trem de pouso recolhe entre estes dois `t`. */
  trem: [0.2, 0.3],
} as const;

/* ------------------------------------------------------------------ */
/* 3. Câmera                                                           */
/* ------------------------------------------------------------------ */

/**
 * As curvas são de DESLOCAMENTO relativo ao avião, não posições absolutas.
 *
 * Duas curvas separadas — uma de posição, outra de alvo de look-at — é o que
 * permite a câmera orbitar enquanto continua mirando o avião. Uma curva só não
 * daria esse controle.
 *
 * Trabalhar em deslocamento e não em posição absoluta significa que mexer na
 * trajetória do avião (VOO, acima) não quebra o enquadramento: a câmera
 * continua presa a ele.
 */

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

/** Beat 1 a 3: pista → decolagem → aproximação do vidro (t 0 → 0.58). */
export const CAMERA_EXTERIOR = {
  posicao: new CatmullRomCurve3([
    v(0, 62, 9), // a pino, bem acima da pista
    v(-10, 38, 22), // desce e começa a girar
    v(-19, 9.5, 36), // perfil, na altura da fuselagem
    v(-11, 5, 27), // três-quartos, acompanhando a subida
    v(-3.4, 2.6, 13), // fecha na fuselagem
    v(0.7, 1.75, 3.1), // encostado no vidro
  ]),
  alvo: new CatmullRomCurve3([
    v(0, 0, 0),
    v(3, 1.2, 0),
    v(5, 1.6, 0),
    v(3.5, 1.6, 0),
    v(1.2, 1.4, 0),
    v(0.2, 1.6, -3), // já mirando através do vidro, para dentro
  ]),
} as const;

/** Beat 5: partida (t 0.78 → 1). Começa exatamente onde o POV termina. */
export const CAMERA_PARTIDA = {
  posicao: new CatmullRomCurve3([
    v(0.7, 1.75, 3.1), // continuidade com a saída da cabine
    v(-13, 6.5, 17),
    v(-48, 15, 31),
    v(-104, 26, 42), // longe e acima, vendo ele partir de costas
  ]),
  alvo: new CatmullRomCurve3([
    v(0.2, 1.5, -1),
    v(0, 1, 0),
    v(0, 0.6, 0),
    v(0, 0.4, 0),
  ]),
} as const;

/** Beat 4: POV da janela. Sem curva — quase parada, com deriva de baixa amplitude. */
export const CAMERA_JANELA = {
  /** Onde a câmera senta dentro da fuselagem, relativo ao avião. */
  deslocamento: v(0.7, 1.75, 2.4),
  /** Para onde olha: para fora e um pouco à frente. */
  alvo: v(7, 0.4, 30),
  /** Amplitude e velocidade da deriva. Zerar `amplitude` deixa travado. */
  deriva: { amplitude: 0.09, velocidade: 0.32 },
} as const;

export const CAMERA_FOV = 42;

/* ------------------------------------------------------------------ */
/* 4. Utilidades de interpolação                                       */
/* ------------------------------------------------------------------ */

export function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** Progresso dentro de uma faixa `[a, b]`, saturado em 0 e 1. */
export function faixa(t: number, a: number, b: number): number {
  return clamp01((t - a) / (b - a));
}

/** Suaviza as pontas para a câmera não entrar e sair de um beat com solavanco. */
export function suave(n: number): number {
  const x = clamp01(n);
  return x * x * (3 - 2 * x);
}

export function lerp(a: number, b: number, n: number): number {
  return a + (b - a) * n;
}

/** Pulso triangular suavizado, usado pelos flashes. */
export function pulso(
  t: number,
  { inicio, pico, fim, forca }: { inicio: number; pico: number; fim: number; forca: number },
): number {
  if (t <= inicio || t >= fim) return 0;
  const n = t < pico ? faixa(t, inicio, pico) : 1 - faixa(t, pico, fim);
  return suave(n) * forca;
}
