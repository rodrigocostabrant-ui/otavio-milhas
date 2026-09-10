import { marca, otavio } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Imagem } from "@/components/ui/Imagem";
import { Dado } from "@/components/ui/Placeholder";

export function QuemEOtavio() {
  return (
    <section id="quem-e" className="border-t border-border/70">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <Imagem
              foto={otavio.fotoViagem}
              proporcao="4/5"
              sizes="(max-width: 1024px) 100vw, 460px"
              className="rounded-2xl"
            />
          </Reveal>

          <Reveal delay={0.06}>
            <p className="rotulo text-accent-strong">{otavio.rotulo}</p>
            <h2 className="mt-5 max-w-[20ch] font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.02em] text-balance">
              {otavio.headline}
            </h2>

            <p className="mt-6 text-[17px] leading-relaxed text-ink-soft">
              {otavio.corpo}
            </p>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-muted">
              {otavio.ponte}
            </p>

            <dl className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
              {otavio.numeros.map((n) => (
                <div key={n.rotulo}>
                  <dt className="sr-only">{n.rotulo}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-bold tracking-tight">
                      {n.valor}
                    </span>
                    <span className="rotulo mt-2 block text-ink-muted">
                      {n.rotulo}
                    </span>
                  </dd>
                </div>
              ))}
              <div>
                <dt className="sr-only">Países conhecidos na prática</dt>
                <dd>
                  <span className="block font-display text-3xl font-bold tracking-tight">
                    <Dado valor={otavio.paises} />
                  </span>
                  <span className="rotulo mt-2 block text-ink-muted">
                    países conhecidos na prática
                  </span>
                </dd>
              </div>
            </dl>

            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-ink-muted">
              <span className="font-medium text-ink">{marca.primeiroNome}</span>
              <Dado valor={marca.nomeCompleto} />
              <span className="rastro-h w-10" aria-hidden="true" />
              <Dado valor={marca.cidade} />
            </p>

            <div className="mt-8 max-w-sm">
              <Imagem
                foto={otavio.retrato}
                proporcao="1/1"
                sizes="384px"
                className="rounded-2xl"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
