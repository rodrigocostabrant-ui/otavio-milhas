import { virada } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { IconeCheck, IconeMenos } from "@/components/ui/Icones";

export function ViradaDeChave() {
  return (
    <section className="border-t border-border/70 bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="rotulo text-accent-strong">{virada.rotulo}</p>
          <h2 className="mt-5 max-w-[24ch] font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.02em] text-balance">
            {virada.headline}
          </h2>
          <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-ink-muted">
            {virada.apoio}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-bg px-6 py-7 sm:px-8 sm:py-9">
              <p className="rotulo text-ink-muted">{virada.semMilhas.rotulo}</p>
              <ul className="mt-6 space-y-4">
                {virada.semMilhas.itens.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-ink-muted">
                    <IconeMenos className="mt-[7px] h-4 w-4 shrink-0 text-ink-muted/50" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-accent/40 bg-accent-soft px-6 py-7 sm:px-8 sm:py-9">
              <p className="rotulo text-accent-strong">{virada.comMilhas.rotulo}</p>
              <ul className="mt-6 space-y-4">
                {virada.comMilhas.itens.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-ink-soft">
                    <IconeCheck className="mt-[5px] h-4 w-4 shrink-0 text-accent-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <p className="mt-12 max-w-[46ch] font-display text-[clamp(1.25rem,2.4vw,1.6rem)] leading-snug font-semibold tracking-[-0.015em] text-balance">
            {virada.fecho}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
