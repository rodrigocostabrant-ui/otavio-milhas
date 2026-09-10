/**
 * ROTA TEMPORÁRIA — protótipo de calibragem da hero 3D.
 *
 * Não está linkada em nenhuma navegação e está em `disallow` no robots.ts.
 * Serve para acertar curvas, timing dos beats, damping e o momento exato do
 * flash antes de isso virar a hero real da página.
 *
 * Todos os números de calibragem estão em `components/hero3d/beats.ts`.
 *
 * Quando a hero for aprovada e promovida, apagar esta pasta e a linha
 * correspondente do robots.ts.
 */
import type { Metadata } from "next";
import { Hero3D } from "@/components/hero3d/Hero3D";

export const metadata: Metadata = {
  title: "Protótipo — hero 3D",
  robots: { index: false, follow: false },
};

export default function PrototipoHero() {
  return (
    <>
      <Hero3D />

      {/* Prova de que o sticky solta limpo e a página continua normalmente. */}
      <section className="border-t border-border/70 bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
          <p className="rotulo text-accent-strong">Depois da hero</p>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.02em]">
            A rolagem segue normal a partir daqui.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-muted">
            Se esta seção entrar com solavanco, o problema está na altura do
            trilho (<code className="text-ink">--trilho-hero</code>, em{" "}
            <code className="text-ink">app/globals.css</code>) e não na cena.
          </p>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-muted">
            Os números de calibragem estão todos em{" "}
            <code className="text-ink">components/hero3d/beats.ts</code>,
            nomeados por beat.
          </p>
        </div>
      </section>

      <div className="h-[120svh] bg-bg" aria-hidden="true" />
    </>
  );
}
