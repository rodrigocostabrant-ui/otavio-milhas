import { temasSecao } from "@/content/site";
import { temas } from "@/content/temas";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Placeholder } from "@/components/ui/Placeholder";

/**
 * Os seis assuntos.
 *
 * Duas colunas, não três. Com três, cada assunto virava um cartão estreito com
 * três linhas de texto e os seis liam como um grid de features — a terceira
 * grade de três colunas seguida nesta página. Em duas, cada um tem largura de
 * leitura de verdade e a lista lê como índice, que é o que ela é.
 *
 * Esta é a única seção da página sobre `--color-surface`. O branco puro aqui é
 * deliberado e único: levanta o bloco que carrega a substância do que o Otávio
 * ensina. Alternar superfície a cada seção, como antes, transformava o
 * levantamento em listra e não levantava nada.
 */
export function Temas() {
  return (
    <section id="como-funciona" className="bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <h2 className="titulo-secao max-w-[26ch]">{temasSecao.headline}</h2>
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

        <ul className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
          {temas.map((tema, i) => (
            <li key={tema.numero}>
              <Reveal delay={Math.min(i * 0.04, 0.24)}>
                <span className="rastro-h block w-10" aria-hidden="true" />
                <h3 className="mt-5 font-display text-[1.35rem] leading-tight font-bold tracking-[-0.02em]">
                  {tema.titulo}
                </h3>
                <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-ink-muted">
                  {tema.texto}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-16">
            <WhatsAppLink contexto="temas">{temasSecao.cta}</WhatsAppLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
