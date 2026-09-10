import { temasSecao } from "@/content/site";
import { temas } from "@/content/temas";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Placeholder } from "@/components/ui/Placeholder";

export function Temas() {
  return (
    <section id="como-funciona" className="border-t border-border/70 bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="rotulo text-accent-strong">{temasSecao.rotulo}</p>
          <h2 className="mt-5 max-w-[26ch] font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.02em] text-balance">
            {temasSecao.headline}
          </h2>
          <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-ink-muted">
            {temasSecao.sub}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-8 max-w-2xl">
            <Placeholder
              bloco
              label={temasSecao.aviso.label}
              motivo={temasSecao.aviso.motivo}
            />
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {temas.map((tema, i) => (
            <li key={tema.numero}>
              <Reveal delay={Math.min(i * 0.04, 0.24)}>
                <div className="flex items-center gap-3">
                  <span className="rotulo text-accent">{tema.numero}</span>
                  <span className="rastro-h w-8" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.015em]">
                  {tema.titulo}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
                  {tema.texto}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-14">
            <WhatsAppLink contexto="temas">{temasSecao.cta}</WhatsAppLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
