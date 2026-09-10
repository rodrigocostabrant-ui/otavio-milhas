"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Cloud, Clouds, Environment, Sky } from "@react-three/drei";
import { MeshLambertMaterial } from "three";
import { Rig } from "./Rig";
import { Aviao } from "./Aviao";
import { Pista } from "./Pista";
import { JanelaPOV } from "./JanelaPOV";

/**
 * A cena. Hora dourada: sol baixo e quente, que conversa com o laranja da marca
 * sem precisar tingir nada.
 */

/** Nuvens em posições fixas do mundo — é o paralaxe real delas que dá a sensação
 *  de deslocamento. Espalhadas ao longo de todo o trajeto do voo. */
const NUVENS = [
  { pos: [70, 34, 46], escala: 2.4, semente: 1 },
  { pos: [140, 62, -58], escala: 3.1, semente: 2 },
  { pos: [215, 86, 70], escala: 2.7, semente: 3 },
  { pos: [290, 118, -44], escala: 3.4, semente: 4 },
  { pos: [355, 96, 96], escala: 2.9, semente: 5 },
  { pos: [420, 150, -80], escala: 3.6, semente: 6 },
  { pos: [480, 128, 62], escala: 3.0, semente: 7 },
  { pos: [545, 176, -30], escala: 3.3, semente: 8 },
] as const;

function Iluminacao() {
  return (
    <>
      {/* Sol baixo, quente. */}
      <directionalLight
        position={[180, 34, -120]}
        intensity={2.6}
        color="#FFD8A8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Preenchimento: céu por cima, terra por baixo. */}
      <hemisphereLight args={["#BFD8F0", "#9C8A6E", 0.75]} />
    </>
  );
}

export function Cena({ aoMontar }: { aoMontar?: () => void }) {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    aoMontar?.();
    return () => {
      // Turbopack faz hot-reload agressivo em dev; soltar o contexto evita
      // acumular contextos WebGL órfãos.
      gl.setAnimationLoop(null);
    };
  }, [aoMontar, gl]);

  return (
    <>
      <fog attach="fog" args={["#CFE0F2", 240, 1400]} />
      <Iluminacao />
      <Environment preset="sunset" background={false} environmentIntensity={0.55} />
      <Sky sunPosition={[180, 22, -120]} turbidity={6} rayleigh={2.4} />

      <Rig />
      <Aviao />
      <Pista />

      <Clouds material={MeshLambertMaterial} limit={220} frustumCulled>
        {NUVENS.map((n) => (
          <Cloud
            key={n.semente}
            seed={n.semente}
            position={[n.pos[0], n.pos[1], n.pos[2]]}
            scale={n.escala}
            segments={16}
            bounds={[9, 2, 3]}
            volume={7}
            opacity={0.62}
            speed={0}
            fade={340}
            color="#FFFFFF"
          />
        ))}
      </Clouds>

      <JanelaPOV />
    </>
  );
}
