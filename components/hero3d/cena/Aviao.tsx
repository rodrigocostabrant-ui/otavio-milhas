"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useHeroProgresso } from "../progresso";
import { estadoVoo } from "../voo";

/**
 * Avião procedural, montado com primitivas.
 *
 * É o stand-in enquanto o GLTF licenciado não entra — e continua sendo o
 * fallback se o modelo não carregar. Pesa 0KB, não tem licença para atribuir e
 * já está na marca. Para trocar pelo GLTF, só este componente muda: a
 * trajetória, a câmera e o trem de pouso são dirigidos de fora, por `estadoVoo`.
 *
 * Cores: o laranja cru da marca funciona aqui porque é superfície 3D com luz em
 * cima, não texto sobre fundo — a regra de contraste dos botões não se aplica.
 */

const BRANCO = "#F4F1EC";
const LARANJA = "#FF5A00";
const ESCURO = "#26231F";
const VIDRO = "#1B3A4B";

export function Aviao() {
  const grupo = useRef<Group>(null);
  const trem = useRef<Group>(null);
  const { progresso } = useHeroProgresso();

  useFrame(() => {
    const g = grupo.current;
    if (!g) return;

    const estado = estadoVoo(progresso.current.suave);
    g.position.copy(estado.posicao);
    g.rotation.z = estado.pitch;

    if (trem.current) {
      // Recolhe encolhendo para dentro da fuselagem: barato e legível a essa
      // distância. Some de vez em 0 para não render geometria invisível.
      const s = Math.max(estado.trem, 0.0001);
      trem.current.scale.set(1, s, 1);
      trem.current.visible = estado.trem > 0.01;
    }
  });

  return (
    <group ref={grupo} dispose={null}>
      {/* Fuselagem */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.85, 0.85, 11, 16]} />
        <meshStandardMaterial color={BRANCO} roughness={0.35} metalness={0.25} />
      </mesh>

      {/* Nariz */}
      <mesh position={[5.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <sphereGeometry args={[0.85, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={BRANCO} roughness={0.35} metalness={0.25} />
      </mesh>

      {/* Cone de cauda */}
      <mesh position={[-6.4, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.85, 2.6, 16]} />
        <meshStandardMaterial color={BRANCO} roughness={0.35} metalness={0.25} />
      </mesh>

      {/* Faixa laranja da marca, correndo pela fuselagem */}
      <mesh position={[0, -0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.862, 0.862, 11, 16, 1, true, Math.PI * 0.06, Math.PI * 0.2]} />
        <meshStandardMaterial color={LARANJA} roughness={0.4} side={2} />
      </mesh>

      {/* Faixa de janelas */}
      <mesh position={[0.4, 0.34, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.858, 0.858, 8.4, 16, 1, true, Math.PI * 0.44, Math.PI * 0.1]} />
        <meshStandardMaterial color={VIDRO} roughness={0.15} metalness={0.6} side={2} />
      </mesh>

      {/* Asas */}
      <group position={[-0.6, -0.35, 0]}>
        <mesh castShadow position={[-0.9, 0, 4.4]} rotation={[0, -0.32, 0.03]}>
          <boxGeometry args={[3.1, 0.16, 8.8]} />
          <meshStandardMaterial color={BRANCO} roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh castShadow position={[-0.9, 0, -4.4]} rotation={[0, 0.32, -0.03]}>
          <boxGeometry args={[3.1, 0.16, 8.8]} />
          <meshStandardMaterial color={BRANCO} roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* Motores */}
      {[3.1, -3.1].map((z) => (
        <mesh key={z} position={[-0.4, -1.05, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.52, 0.46, 2.2, 12]} />
          <meshStandardMaterial color={ESCURO} roughness={0.45} metalness={0.5} />
        </mesh>
      ))}

      {/* Deriva (cauda vertical) — o laranja da marca */}
      <mesh castShadow position={[-6, 1.9, 0]} rotation={[0, 0, 0.34]}>
        <boxGeometry args={[2.6, 3.2, 0.16]} />
        <meshStandardMaterial color={LARANJA} roughness={0.4} metalness={0.15} />
      </mesh>

      {/* Estabilizadores horizontais */}
      {[1.9, -1.9].map((z) => (
        <mesh
          key={z}
          position={[-6.2, 0.5, z]}
          rotation={[0, z > 0 ? -0.34 : 0.34, 0]}
        >
          <boxGeometry args={[1.6, 0.12, 3.6]} />
          <meshStandardMaterial color={BRANCO} roughness={0.4} metalness={0.2} />
        </mesh>
      ))}

      {/* Trem de pouso: recolhe entre VOO.trem[0] e VOO.trem[1] */}
      <group ref={trem}>
        {[
          [3.6, 0, 0],
          [-1.2, 0, 1.5],
          [-1.2, 0, -1.5],
        ].map(([x, , z]) => (
          <group key={`${x}:${z}`} position={[x, -1.15, z]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, 0.7, 6]} />
              <meshStandardMaterial color={ESCURO} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 0.2, 10]} />
              <meshStandardMaterial color={ESCURO} roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
