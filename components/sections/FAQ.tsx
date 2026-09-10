import { faqSecao } from "@/content/site";
import { faq } from "@/content/faq";
import { Reveal } from "@/components/ui/Reveal";
import { IconeMais } from "@/components/ui/Icones";

/**
 * `<details>`/`<summary>` nativos: acessível por teclado sem JavaScript.
 */
export function FAQ() {
  return (
    <section id="duvidas" className="border-t border-border/70 bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="rotulo text-accent-strong">{faqSecao.rotulo}</p>
          <h2 className="mt-5 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.12] font-bold tracking-[-0.02em] text-balance">
            {faqSecao.headline}
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {faq.map((item) => (
            <details key={item.pergunta} className="group py-1">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left font-display text-[17px] font-semibold tracking-[-0.01em] sm:text-lg [&::-webkit-details-marker]:hidden">
                <span>{item.pergunta}</span>
                <IconeMais className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="pb-6 text-[16px] leading-relaxed text-ink-muted">
                {item.resposta}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
