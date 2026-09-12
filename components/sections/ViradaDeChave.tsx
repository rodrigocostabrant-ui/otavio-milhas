import { virada } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { IconeCheck, IconeMenos } from "@/components/ui/Icones";

/**
 * A primeira seção depois da hero, e a que carrega o argumento inteiro da
 * página — por isso usa `titulo-ancora`, o degrau de cima da escala.
 *
 * As duas colunas já não são cartões. A moldura arredondada não comunicava
 * elevação nenhuma: são duas listas lado a lado, e o que as separa é o que
 * dizem, não uma caixa. Sobrou um filete à esquerda de cada uma — cinza de um
 * lado, laranja do outro — que é a diferença inteira, em 2px.
 *
 * Também não há mais `border-t` no topo nem troca de fundo. A página inteira
 * roda sobre `--color-bg` e o que separa as seções é o respiro; oito faixas
 * com filete no topo liam como uma pilha de listras de igual peso.
 */
export function ViradaDeChave() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 pt-24 pb-16 sm:px-8 sm:pt-32 sm:pb-24">
        <Reveal>
          <h2 className="titulo-ancora max-w-[22ch]">{virada.headline}</h2>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-ink-muted">
            {virada.apoio}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <div className="border-l border-border pl-6 sm:pl-8">
              <p className="rotulo text-ink-muted">{virada.semMilhas.rotulo}</p>
              <ul className="mt-6 space-y-4">
                {virada.semMilhas.itens.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[16px] leading-relaxed text-ink-muted"
                  >
                    <IconeMenos className="mt-[7px] h-4 w-4 shrink-0 text-ink-muted/50" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border-l-2 border-accent pl-6 sm:pl-8">
              <p className="rotulo text-accent-strong">
                {virada.comMilhas.rotulo}
              </p>
              <ul className="mt-6 space-y-4">
                {virada.comMilhas.itens.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[16px] leading-relaxed text-ink-soft"
                  >
                    <IconeCheck className="mt-[5px] h-4 w-4 shrink-0 text-accent-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <p className="mt-16 max-w-[46ch] font-display text-[clamp(1.25rem,2.4vw,1.6rem)] leading-snug font-semibold tracking-[-0.015em] text-balance">
            {virada.fecho}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
