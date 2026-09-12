import { paraQuem } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * A seção da honestidade.
 *
 * Era duas colunas com check verde de um lado e menos cinza do outro — o mesmo
 * layout, os mesmos dois ícones e o mesmo gesto retórico de `ViradaDeChave`,
 * três seções acima. Lidas em sequência, a segunda soava como preenchimento da
 * primeira.
 *
 * Agora é uma coluna de leitura, em duas listas empilhadas separadas por um
 * filete, sem ícone nenhum. É a seção em que o Otávio diz para quem isto não
 * serve; ela ganha lendo como texto corrido honesto e perdendo quando vira
 * grade de marketing.
 */
export function ParaQuem() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <h2 className="titulo-secao max-w-[24ch]">{paraQuem.headline}</h2>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-12 max-w-[62ch]">
            <h3 className="font-display text-xl font-bold tracking-[-0.015em]">
              {paraQuem.sim.titulo}
            </h3>
            <ul className="mt-5 space-y-3">
              {paraQuem.sim.itens.map((item) => (
                <li
                  key={item}
                  className="text-[17px] leading-relaxed text-ink-soft"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 max-w-[62ch] border-t border-border pt-12">
            <h3 className="font-display text-xl font-bold tracking-[-0.015em] text-ink-muted">
              {paraQuem.nao.titulo}
            </h3>
            <ul className="mt-5 space-y-3">
              {paraQuem.nao.itens.map((item) => (
                <li
                  key={item}
                  className="text-[17px] leading-relaxed text-ink-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-12 border-l-2 border-accent pl-5 font-display text-[clamp(1.1rem,2.2vw,1.4rem)] leading-snug font-semibold tracking-[-0.015em] text-balance">
            {paraQuem.fecho}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
