import { ctaFinal } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { IconeAviao } from "@/components/ui/Icones";

/**
 * Sobre `bg-ink`, o laranja puro do logo finalmente passa AA — é o único lugar
 * da página onde ele aparece em texto.
 */
export function CTAFinal() {
  return (
    <section className="bg-ink text-ink-inverse">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <Reveal>
          <div className="flex items-center justify-center gap-3" aria-hidden="true">
            <span className="rastro-h w-16 opacity-70" />
            <IconeAviao className="h-6 w-6 text-accent" />
            <span className="rastro-h w-16 opacity-70" />
          </div>

          <h2 className="mx-auto mt-8 max-w-[20ch] font-display text-[clamp(1.85rem,4.6vw,3rem)] leading-[1.1] font-bold tracking-[-0.02em] text-balance">
            {ctaFinal.headline}
          </h2>

          <p className="mx-auto mt-6 max-w-[54ch] text-[17px] leading-relaxed text-ink-inverse/75">
            {ctaFinal.corpo}
          </p>

          <div className="mt-10">
            <WhatsAppLink contexto="final" variante="claro" tamanho="grande">
              {ctaFinal.cta}
            </WhatsAppLink>
          </div>

          <p className="rotulo mt-6 text-ink-inverse/55">{ctaFinal.microcopy}</p>
        </Reveal>
      </div>
    </section>
  );
}
