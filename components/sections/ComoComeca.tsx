import { comeca } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * Os três passos.
 *
 * Saíram as bolinhas com `01 / 02 / 03`. O conteúdo do passo já é o rótulo do
 * passo, e uma numeração decorativa dentro de um círculo laranja é o desenho
 * padrão de toda página que explica um processo — some a partir do momento em
 * que a pessoa lê o primeiro título. O que ficou foi o rastro tracejado
 * atravessando os três, que é vocabulário da marca e faz o trabalho de dizer
 * "isto é uma sequência" sem gastar um número.
 *
 * A ordem continua semântica: é um `<ol>`, e leitor de tela numera sozinho.
 */
export function ComoComeca() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <h2 className="titulo-secao max-w-[22ch]">{comeca.headline}</h2>
        </Reveal>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {comeca.passos.map((passo, i) => (
            <li key={passo.numero}>
              <Reveal delay={Math.min(i * 0.06, 0.24)}>
                <div className="flex items-center gap-3" aria-hidden="true">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                  {/* O rastro liga um passo ao seguinte; o último não liga a
                      nada, então não recebe traço. */}
                  {i < comeca.passos.length - 1 ? (
                    <span className="rastro-h hidden flex-1 md:block" />
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
