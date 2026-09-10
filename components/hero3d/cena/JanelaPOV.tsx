"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Shape, ShapeGeometry } from "three";
import { BEATS, faixa, suave } from "../beats";
import { useHeroProgresso } from "../progresso";

/**
 * O truque da janela.
 *
 * NÃO existe cabine modelada — sem assentos, sem mesinha, sem corredor, sem
 * passageiro. O que existe é uma parede escura com um furo oval, colada na
 * câmera, e uma sugestão de asa lá embaixo. As nuvens e o céu que aparecem pelo
 * furo são a cena de verdade, a mesma dos outros beats.
 *
 * Foi essa simplificação que tornou a sequência viável. Se alguém voltar aqui
 * para modelar interior de avião, parou no lugar errado.
 */

/** Distância da parede à câmera. Mexer aqui muda o "quão perto do vidro" se está. */
const DISTANCIA = 0.62;
/** Meia-largura e meia-altura do furo, na distância acima. */
const FURO = { largura: 0.2, altura: 0.28, raio: 0.14 };

function geometriaParede(): ShapeGeometry {
  // Retângulo bem maior que o frustum, com um furo oval-arredondado no meio.
  const parede = new Shape();
  parede.moveTo(-3, -3);
  parede.lineTo(3, -3);
  parede.lineTo(3, 3);
  parede.lineTo(-3, 3);
  parede.closePath();

  const { largura: w, altura: h, raio: r } = FURO;
  const furo = new Shape();
  furo.moveTo(-w, -h + r);
  furo.quadraticCurveTo(-w, -h, -w + r, -h);
  furo.lineTo(w - r, -h);
  furo.quadraticCurveTo(w, -h, w, -h + r);
  furo.lineTo(w, h - r);
  furo.quadraticCurveTo(w, h, w - r, h);
  furo.lineTo(-w + r, h);
  furo.quadraticCurveTo(-w, h, -w, h - r);
  furo.closePath();

  parede.holes.push(furo);
  return new ShapeGeometry(parede, 24);
}

export function JanelaPOV() {
  const grupo = useRef<Group>(null);
  const { progresso } = useHeroProgresso();
  const camera = useThree((s) => s.camera);

  const geometria = useMemo(() => geometriaParede(), []);

  useFrame(() => {
    const g = grupo.current;
    if (!g) return;

    const t = progresso.current.suave;

    // Entra junto com o flash de entrada e sai junto com o de saída.
    const entrada = suave(faixa(t, BEATS.passagem[0] + 0.03, BEATS.janela[0]));
    const saida = suave(faixa(t, BEATS.partida[0] - 0.01, BEATS.partida[0] + 0.045));
    const opacidade = entrada * (1 - saida);

    g.visible = opacidade > 0.01;
    if (!g.visible) return;

    // Cola na câmera todo frame. Mais barato e mais previsível que reparentar.
    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);
    g.translateZ(-DISTANCIA);

    for (const filho of g.children) {
      const material = (filho as unknown as { material?: { opacity: number } })
        .material;
      if (material) material.opacity = opacidade;
    }
  });

  return (
    <group ref={grupo} renderOrder={10}>
      {/* Parede da cabine com o furo da janela */}
      <mesh geometry={geometria}>
        <meshBasicMaterial
          color="#14120F"
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Moldura clara em volta do furo, dando espessura ao vidro */}
      <mesh position={[0, 0, 0.004]} scale={[1.14, 1.1, 1]}>
        <ringGeometry args={[FURO.largura + 0.012, FURO.largura + 0.03, 32]} />
        <meshBasicMaterial
          color="#3A352F"
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Sugestão de asa lá embaixo, vista pelo canto do furo */}
      <mesh position={[0.06, -0.235, -0.06]} rotation={[0, 0, -0.13]}>
        <planeGeometry args={[0.4, 0.06]} />
        <meshBasicMaterial
          color="#D9D4CC"
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
