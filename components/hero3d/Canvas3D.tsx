"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CAMERA_FOV } from "./beats";
import { Cena } from "./cena/Cena";

/**
 * O canvas em si. Importado dinamicamente com `ssr: false` pelo Hero3D, porque
 * three toca `window` no módulo.
 *
 * Fora da viewport o frameloop vai para "never": não faz sentido queimar GPU
 * enquanto a pessoa lê o resto do site.
 */
export default function Canvas3D({
  aoMontar,
  alvoDeVisibilidade,
}: {
  aoMontar?: () => void;
  /** Elemento observado para pausar o laço quando a hero sai da tela. */
  alvoDeVisibilidade: React.RefObject<HTMLElement | null>;
}) {
  const [visivel, setVisivel] = useState(true);
  const jaMontou = useRef(false);

  useEffect(() => {
    const alvo = alvoDeVisibilidade.current;
    if (!alvo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => setVisivel(entrada.isIntersecting),
      { rootMargin: "120px" },
    );
    observador.observe(alvo);
    return () => observador.disconnect();
  }, [alvoDeVisibilidade]);

  return (
    <Canvas
      className="absolute inset-0"
      frameloop={visivel ? "always" : "never"}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: CAMERA_FOV, near: 0.1, far: 4000, position: [0, 60, 20] }}
      onCreated={() => {
        if (jaMontou.current) return;
        jaMontou.current = true;
        aoMontar?.();
      }}
    >
      <Suspense fallback={null}>
        <Cena />
      </Suspense>
    </Canvas>
  );
}
