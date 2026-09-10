"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { BEATS, faixa, suave } from "../beats";
import { useHeroProgresso } from "../progresso";

/**
 * Só aparece nos dois primeiros beats e some rápido. Um plano, uma faixa de
 * asfalto e alguns tracinhos de eixo — não vale investir mais que isso.
 *
 * Some por completo (`visible = false`) assim que sai de vista, para não pagar
 * draw call durante os beats de nuvem.
 */
export function Pista() {
  const grupo = useRef<Group>(null);
  const { progresso } = useHeroProgresso();

  useFrame(() => {
    const g = grupo.current;
    if (!g) return;

    // Desaparece durante a decolagem: em t = 0.34 o solo já não conta.
    const opacidade = 1 - suave(faixa(progresso.current.suave, 0.2, 0.34));
    g.visible = opacidade > 0.01;
    g.scale.setScalar(opacidade > 0.01 ? 1 : 0.0001);

    for (const filho of g.children) {
      const material = (filho as unknown as { material?: { opacity: number } })
        .material;
      if (material) material.opacity = opacidade;
    }
  });

  return (
    <group ref={grupo}>
      {/* Terreno */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[2400, 2400]} />
        <meshStandardMaterial color="#8C9A72" roughness={1} transparent />
      </mesh>

      {/* Asfalto */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[40, 0, 0]}>
        <planeGeometry args={[420, 16]} />
        <meshStandardMaterial color="#45423E" roughness={0.95} transparent />
      </mesh>

      {/* Eixo tracejado */}
      {Array.from({ length: 26 }, (_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-140 + i * 16, 0.02, 0]}
        >
          <planeGeometry args={[7, 0.55]} />
          <meshStandardMaterial color="#E8E4DC" roughness={0.9} transparent />
        </mesh>
      ))}
    </group>
  );
}

/** Beats em que a pista importa, para referência de calibragem. */
export const PISTA_VISIVEL_ATE = BEATS.decolagem[0] + 0.22;
