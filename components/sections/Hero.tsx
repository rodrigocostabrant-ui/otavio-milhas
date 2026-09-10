import { hero } from "@/content/site";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Imagem } from "@/components/ui/Imagem";
import { IconeAviao } from "@/components/ui/Icones";

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-10 sm:px-8 sm:pt-20 sm:pb-14">
        <p className="rotulo flex items-center gap-2.5 text-accent-strong">
          <IconeAviao className="h-4 w-4 text-accent" />
          {hero.rotulo}
        </p>

        <h1 className="mt-6 max-w-[19ch] font-display text-[clamp(2.25rem,6.4vw,4.25rem)] leading-[1.04] font-bold tracking-[-0.025em] text-balance">
          {hero.headlineInicio}
          <span className="text-accent">{hero.headlineDestaque}</span>
        </h1>

        <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted sm:text-lg">
          {hero.sub}
        </p>

        <div id="hero-cta" className="mt-9 flex flex-wrap items-center gap-4">
          <WhatsAppLink contexto="hero" tamanho="grande">
            {hero.cta}
          </WhatsAppLink>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-display text-2xl font-bold tracking-tight">
            {hero.seloNumero}
          </span>
          <span className="rotulo text-ink-muted">{hero.seloTexto}</span>
          <span className="rastro-h hidden w-16 sm:block" aria-hidden="true" />
          <span className="rotulo text-ink-muted">{hero.seloDesde}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-4 sm:px-8">
        <Imagem
          foto={hero.foto}
          proporcao="16/9"
          prioridade
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="rounded-2xl"
        />
      </div>
    </section>
  );
}
