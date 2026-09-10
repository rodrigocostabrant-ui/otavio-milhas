"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import {
  BEATS,
  CAMERA_EXTERIOR,
  CAMERA_JANELA,
  CAMERA_PARTIDA,
  clamp01,
  faixa,
  suave,
} from "../beats";
import { useHeroProgresso } from "../progresso";
import { estadoVoo } from "../voo";

/**
 * A câmera. Uma só, atravessando os quatro momentos.
 *
 * Posição e alvo vêm de curvas de DESLOCAMENTO relativo ao avião, então mexer na
 * trajetória do voo não desenquadra nada.
 *
 * As descontinuidades nas fronteiras (0.58 e 0.78) são deliberadas e ficam
 * escondidas dentro dos flashes — é o mesmo truque de montagem que cobre a
 * passagem pelo vidro.
 */

const posAviao = new Vector3();
const desloc = new Vector3();
const alvo = new Vector3();

export function Rig() {
  const camera = useThree((s) => s.camera);
  const { progresso } = useHeroProgresso();
  const relogio = useRef(0);

  useFrame((_, delta) => {
    relogio.current += delta;

    const t = progresso.current.suave;
    const voo = estadoVoo(t, posAviao);

    if (t <= BEATS.passagem[1]) {
      // Beats 1 a 3: pista, decolagem, aproximação do vidro.
      const u = clamp01(t / BEATS.passagem[1]);
      CAMERA_EXTERIOR.posicao.getPoint(u, desloc);
      CAMERA_EXTERIOR.alvo.getPoint(u, alvo);
    } else if (t < BEATS.partida[0]) {
      // Beat 4: POV da janela. Câmera quase parada, com deriva de baixa
      // amplitude para não parecer travada.
      const { amplitude, velocidade } = CAMERA_JANELA.deriva;
      const fase = relogio.current * velocidade;
      desloc
        .copy(CAMERA_JANELA.deslocamento)
        .add(
          new Vector3(
            Math.sin(fase) * amplitude,
            Math.sin(fase * 0.73 + 1.1) * amplitude,
            0,
          ),
        );
      alvo.copy(CAMERA_JANELA.alvo);
    } else {
      // Beat 5 e hold: partida.
      const u = suave(faixa(t, BEATS.partida[0], 1));
      CAMERA_PARTIDA.posicao.getPoint(u, desloc);
      CAMERA_PARTIDA.alvo.getPoint(u, alvo);
    }

    camera.position.copy(voo.posicao).add(desloc);
    alvo.add(voo.posicao);
    camera.lookAt(alvo);
  });

  return null;
}
