import { paraQuem } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { IconeCheck, IconeMenos } from "@/components/ui/Icones";

export function ParaQuem() {
  return (
    <section className="border-t border-border/70 bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="rotulo text-accent-strong">{paraQuem.rotulo}</p>
          <h2 className="mt-5 max-w-[24ch] font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.02em] text-balance">
            {paraQuem.headline}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <h3 className="font-display text-xl font-bold tracking-[-0.015em]">
              {paraQuem.sim.titulo}
            </h3>
            <ul className="mt-6 space-y-4">
              {paraQuem.sim.itens.map((item) => (
                <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-ink-soft">
                  <IconeCheck className="mt-[5px] h-4 w-4 shrink-0 text-accent-strong" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="font-display text-xl font-bold tracking-[-0.015em] text-ink-muted">
              {paraQuem.nao.titulo}
            </h3>
            <ul className="mt-6 space-y-4">
              {paraQuem.nao.itens.map((item) => (
                <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-ink-muted">
                  <IconeMenos className="mt-[7px] h-4 w-4 shrink-0 text-ink-muted/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <p className="mt-12 text-[17px] leading-relaxed text-ink-muted">
            {paraQuem.fecho}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
