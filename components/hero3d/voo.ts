import { Vector3 } from "three";
import { faixa, lerp, suave, VOO } from "./beats";

/**
 * Onde o avião está e como está inclinado, para qualquer `t`.
 *
 * É uma função pura de `t` — sem estado, sem integração de tempo. Rolar para
 * trás desfaz o voo exatamente, o que é o comportamento certo para uma
 * sequência dirigida por rolagem.
 */

const grau = Math.PI / 180;

export type EstadoVoo = {
  posicao: Vector3;
  /** Ângulo de ataque em radianos, para rotacionar o modelo. */
  pitch: number;
  /** 0 = trem recolhido, 1 = trem embaixo. */
  trem: number;
};

const reutilizavel = new Vector3();

export function estadoVoo(t: number, destino = reutilizavel): EstadoVoo {
  const [rotIni, rotFim] = VOO.rotacao;

  let x: number;
  let y: number;

  if (t < rotIni) {
    // Taxiando: anda na pista, nariz no chão.
    x = lerp(VOO.taxiX[0], VOO.taxiX[1], faixa(t, 0, rotIni));
    y = VOO.alturaTremBaixo;
  } else if (t < rotFim) {
    // Rotação: larga o solo.
    const n = suave(faixa(t, rotIni, rotFim));
    x = lerp(VOO.taxiX[1], VOO.posRotacao.x, n);
    y = lerp(VOO.alturaTremBaixo, VOO.posRotacao.y, n);
  } else {
    // Subida: desacelera a taxa de subida conforme se aproxima do cruzeiro.
    const n = faixa(t, rotFim, 1);
    x = lerp(VOO.posRotacao.x, VOO.cruzeiro.x, n);
    y = lerp(VOO.posRotacao.y, VOO.cruzeiro.y, suave(n) * 0.35 + n * 0.65);
  }

  destino.set(x, y, 0);

  const pitch =
    t < rotIni
      ? 0
      : t < rotFim
        ? lerp(0, VOO.pitchGraus[0], suave(faixa(t, rotIni, rotFim))) * grau
        : lerp(VOO.pitchGraus[0], VOO.pitchGraus[1], suave(faixa(t, rotFim, 1))) *
          grau;

  const trem = 1 - suave(faixa(t, VOO.trem[0], VOO.trem[1]));

  return { posicao: destino, pitch, trem };
}
