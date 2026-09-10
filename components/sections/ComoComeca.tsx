import { comeca } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

export function ComoComeca() {
  return (
    <section className="border-t border-border/70">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="rotulo text-accent-strong">{comeca.rotulo}</p>
          <h2 className="mt-5 max-w-[22ch] font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.02em] text-balance">
            {comeca.headline}
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {comeca.passos.map((passo, i) => (
            <li key={passo.numero} className="relative">
              <Reveal delay={Math.min(i * 0.06, 0.24)}>
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-accent-soft font-display text-[15px] font-bold text-accent-strong">
                    {passo.numero}
                  </span>
                  {/* Rastro conectando os passos: horizontal no desktop. */}
                  {i < comeca.passos.length - 1 ? (
                    <span
                      className="rastro-h hidden flex-1 md:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold tracking-[-0.015em]">
                  {passo.titulo}
                </h3>
                <p className="mt-3 max-w-[38ch] text-[16px] leading-relaxed text-ink-muted">
                  {passo.texto}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="mt-14">
            <WhatsAppLink contexto="comeca" tamanho="grande">
              {comeca.cta}
            </WhatsAppLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
