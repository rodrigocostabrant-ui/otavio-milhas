import { hero } from "@/content/site";
import { IconeSeta } from "@/components/ui/Icones";
import { HeroParallaxProvider } from "./HeroParallaxProvider";
import { BandeirasDecorativas } from "./BandeirasDecorativas";
import { BotaoMagneticoWhatsApp } from "./BotaoMagneticoWhatsApp";
import { DeckViagens } from "./DeckViagens";

/**
 * A hero: uma tela só, dividida em duas colunas.
 *
 * Substitui as duas telas anteriores — a marca sozinha no off-white e a foto
 * escura sangrada. Elas gastavam 200vh para dizer uma coisa e a primeira não
 * tinha nenhum botão: quem chegava precisava rolar para encontrar a única
 * conversa que esta página oferece. Agora a frase, a prova e o WhatsApp cabem
 * juntos na primeira dobra, e as fotos de viagem entram como deck à direita.
 *
 * `id="topo"` continua sendo o que `BotaoFlutuante` observa. A intenção da
 * decisão §6 do AGENTS.md não muda: o botão flutuante só aparece quando esta
 * seção sai de vista.
 *
 * A escada de entrada (`hero-entra` com `--atraso`) é 800ms, acima da faixa de
 * 150–250ms que o AGENTS.md fixa. A faixa vale para interação — resposta a um
 * clique precisa ser instantânea. Esta é a montagem da página, uma vez só, e a
 * referência que o Rodrigo pediu (tasteskill.dev) usa exatamente 800ms com esta
 * curva. Sob `prefers-reduced-motion` tudo isto some.
 *
 * Este componente continua sendo de servidor. O `HeroParallaxProvider` é o
 * cliente, e recebe tudo o mais como `children` — então o texto, o `<h1>` e os
 * links continuam sendo renderizados no servidor e chegam no HTML.
 */
export function Hero() {
  return (
    <HeroParallaxProvider id="topo" className="relative isolate overflow-hidden">
      {/* O halo laranja atrás da coluna de texto. Fica no canto inferior
          esquerdo, longe do texto, para não rebaixar contraste em nada. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-32 -z-10 h-96 w-96 rounded-full bg-accent/8 blur-3xl"
      />

      <BandeirasDecorativas />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 pt-14 pb-16 sm:px-8 lg:min-h-[calc(100svh-var(--altura-header))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12 lg:pt-10 lg:pb-12">
        <div className="flex min-w-0 flex-col">
          <p
            className="hero-entra mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-accent/35 bg-accent-soft px-3.5 py-1.5 text-[13px] font-medium tracking-tight text-accent-strong"
            style={{ "--atraso": "0ms" } as React.CSSProperties}
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
              <span className="hero-pulso absolute inset-0 rounded-full bg-accent/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {hero.selo}
          </p>

          <h1
            className="hero-entra font-display text-[clamp(2.5rem,5.2vw,4rem)] leading-[0.98] font-semibold tracking-[-0.035em]"
            style={{ "--atraso": "90ms" } as React.CSSProperties}
          >
            {hero.headline}
          </h1>

          <p
            className="hero-entra mt-5 max-w-[28ch] font-display text-[clamp(1.15rem,2.2vw,1.65rem)] leading-[1.25] font-normal tracking-[-0.02em] text-ink-soft text-balance"
            style={{ "--atraso": "180ms" } as React.CSSProperties}
          >
            {hero.apoio}
          </p>

          <p
            className="hero-entra mt-4 text-[15px] font-medium text-accent-strong sm:text-[17px]"
            style={{ "--atraso": "260ms" } as React.CSSProperties}
          >
            {hero.linha}
          </p>

          <div
            className="hero-entra mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ "--atraso": "340ms" } as React.CSSProperties}
          >
            <BotaoMagneticoWhatsApp contexto="hero">
              {hero.cta}
            </BotaoMagneticoWhatsApp>

            <a
              href={hero.ctaSecundarioHref}
              className="botao-tatil group/secundario inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 text-base font-medium text-ink-soft transition-colors duration-200 hover:border-ink-inverse/25 hover:text-ink-inverse"
            >
              {hero.ctaSecundario}
              <IconeSeta className="h-4 w-4 text-accent-strong transition-transform duration-200 group-hover/secundario:translate-x-0.5" />
            </a>
          </div>
        </div>

        <DeckViagens />
      </div>
    </HeroParallaxProvider>
  );
}
