/**
 * A matemática do deck: a pose de um cartão e o avanço de um quadro.
 *
 * Mora fora do componente porque é pura e porque é onde os defeitos moram. A
 * prioridade entre arrasto, inércia e deriva, e a independência de taxa de
 * quadros, não se verificam olhando a tela — se verificam em
 * `components/hero/giro.test.ts`.
 */

export type Pose = {
  x: number;
  y: number;
  z: number;
  escala: number;
  rx: number;
  ry: number;
  rz: number;
  opacidade: number;
  camada: number;
};

export type EstadoGiro = {
  /** Posição no trilho, em voltas. Uma volta inteira passa por todos os cartões. */
  offset: number;
  /** Voltas por segundo herdadas do arrasto. */
  velocidade: number;
  /** A mão está no cartão? Enquanto estiver, mais nada mexe no offset. */
  arrastando: boolean;
};

/** Fração da velocidade que sobra depois de um segundo de inércia. */
export const ATRITO_POR_SEGUNDO = 0.02;
/** Velocidade abaixo da qual a inércia é considerada morta. */
export const REPOUSO = 0.0015;
/** Voltas por segundo da deriva automática: uma volta inteira a cada 42s. */
export const DERIVA = 1 / 42;

/** Traz um valor qualquer para a volta [0, 1). */
export function volta(v: number): number {
  return ((v % 1) + 1) % 1;
}

/** Onde o cartão `i` está no trilho, em [-1, 1). */
export function posicaoNoTrilho(i: number, total: number, offset: number): number {
  return volta(i / total - offset) * 2 - 1;
}

/**
 * A pose de um cartão a partir da sua posição no trilho.
 *
 * `s` vai de -1 (mais longe e mais alto) a +1 (mais perto e mais baixo). A
 * opacidade zera nas duas pontas — é o que faz a volta fechar sem ninguém ver
 * o cartão saltar do fim para o começo.
 */
export function poseDe(s: number): Pose {
  const u = (s + 1) / 2;

  /*
   * As duas pontas do trilho não saem da mesma maneira, e isso não é capricho.
   *
   * A ponta de trás (s → -1) é pequena, escura e atrás de tudo: some por
   * opacidade sem ninguém notar, e a faixa pode ser larga.
   *
   * A ponta da frente (s → +1) é o cartão maior e mais próximo. Desbotá-lo ali
   * fazia dele um vidro: o texto do cartão de trás aparecia por dentro do da
   * frente, que era o fantasma que sobrava em cima da pilha. Então a saída da
   * frente é majoritariamente geométrica: o cartão desce para fora do quadro e
   * o `overflow-hidden` do palco o corta, e só nos últimos 12% do trilho —
   * quando ele já está cortado pela base — a opacidade termina o serviço.
   *
   * A faixa de entrada é larga (22%) porque ela faz outro trabalho: com seis
   * cartões no trilho, ela mantém quatro na cena. Com os seis visíveis a pilha
   * vira uma escada de degraus iguais, que é padrão, não profundidade.
   */
  const entrando = Math.min(1, Math.max(0, (1 + s) / 0.22));
  const saindo = Math.min(1, Math.max(0, (1 - s) / 0.08));
  const borda = Math.min(entrando, saindo);

  /** 0 até 70% do trilho, subindo a 1 no último terço. */
  const saidaAcelerada = Math.max(0, (s - 0.7) / 0.3);

  return {
    // O deslocamento em x é linear, não senoidal: com seno todos os cartões
    // visíveis caíam na mesma faixa de 4% e a pilha lia como uma resma de
    // papel. Linear, eles descem em diagonal — que é o que dá o espalhamento.
    x: -50 + s * 26,
    // O y não é linear, e é o que mantém o cartão da frente inteiro no quadro.
    //
    // Linear, o cartão mais próximo ficava sempre meio cortado pela base: para
    // que o último saísse do quadro, todos precisavam descer demais. Com a
    // parcela quadrática, o trilho é suave nos 70% que ficam em cena e despenca
    // nos 30% finais — que é como um objeto se comporta ao passar pela câmera,
    // e é o que dá ao cartão da frente a tela inteira para existir.
    y: -50 + s * 82 + saidaAcelerada * saidaAcelerada * 78,
    z: -1000 + u * 1240,
    escala: 0.72 + u * 0.46,
    rx: 2.6 - s * 1.4,
    ry: -2.4 + s * 1.8,
    rz: s * 2.6,
    opacidade: borda,
    camada: 20 + Math.round(u * 80),
  };
}

/**
 * Um quadro de movimento do trilho. Muta o estado, como o laço faz.
 *
 * A ordem de prioridade é a regra inteira desta função:
 *
 *  1. **Arrasto.** Enquanto a mão está no cartão, nada mais escreve no offset.
 *  2. **Inércia.** Depois de soltar, o deck escorre e freia.
 *  3. **Deriva.** Só quando o resto se calou, e só se o ponteiro não estiver
 *     sobre o deck — um carrossel que anda debaixo do cursor é hostil.
 *
 * O decaimento é por segundo (`pow`), não por quadro: com uma multiplicação
 * fixa por quadro, um monitor de 120Hz frearia na metade do tempo de um de
 * 60Hz. Pelo mesmo motivo a deriva multiplica por `dt`.
 */
export function avancar(estado: EstadoGiro, dt: number, sobreODeck: boolean): void {
  if (estado.arrastando) return;

  if (Math.abs(estado.velocidade) > REPOUSO) {
    // A integral exata do decaimento no intervalo, não `velocidade * dt`.
    //
    // Multiplicar a velocidade do começo do quadro pelo intervalo é integração
    // de Euler, e ela erra para cima: durante o quadro a velocidade já está
    // caindo. O erro é proporcional a `dt`, então o deck escorregava ~1,5% mais
    // longe a 60Hz do que a 120Hz — uma tela melhor dava um deck diferente.
    // Como o decaimento é exponencial, a integral fecha em forma:
    // ∫v₀·kᵗ dt = v₀·(k^dt − 1)/ln k.
    const fator = Math.pow(ATRITO_POR_SEGUNDO, dt);
    estado.offset +=
      (estado.velocidade * (fator - 1)) / Math.log(ATRITO_POR_SEGUNDO);
    estado.velocidade *= fator;
    return;
  }

  estado.velocidade = 0;
  if (!sobreODeck) estado.offset += DERIVA * dt;
}
