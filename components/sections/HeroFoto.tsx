import { heroFoto } from "@/content/site";
import { isPendente } from "@/content/types";
import { Imagem } from "@/components/ui/Imagem";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { AviaoOtavio } from "@/components/marca/AviaoOtavio";

/**
 * A segunda tela da hero: a foto de viagem do Otávio, sangrada de borda a
 * borda, com o texto ancorado na base sobre um degradê.
 *
 * É o que a câmera revela por dentro do avião — por isso ela é escura. A
 * primeira tela é off-white e vazia; esta é foto cheia e ocupada, e o corte
 * entre as duas é a marca abrindo. Duas telas claras seguidas não teriam
 * momento nenhum.
 *
 * O texto fica embaixo, não ao lado: numa foto sangrada a única borda que não
 * compete com a imagem é a de baixo, onde o `overlay-cena` já garante tinta
 * cheia. Antes disto era um painel de retrato à direita — a foto agora é o
 * palco inteiro, não um recorte dele.
 *
 * Aqui o laranja puro pode carregar texto, e isso é a regra do `AGENTS.md`,
 * não exceção: `--color-accent` sobre `--color-ink` dá 5,5:1. O que continua
 * proibido é ele carregar texto sobre claro.
 *
 * A rota tracejada sobre a foto é o mesmo vocabulário do avião que acabou de
 * voar na tela anterior — não é decoração emprestada, é a marca continuando a
 * se repetir. Estática de propósito: a hero já gastou o único momento de
 * movimento não solicitado que esta página se permite.
 */
export function HeroFoto() {
  const temFoto = !isPendente(heroFoto.foto);

  return (
    <section
      id="quem-te-ensina"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"
    >
      <Imagem foto={heroFoto.foto} preencher sizes="100vw" prioridade />

      {temFoto ? (
        <>
          {/* A sobreposição da marca sobre a foto. `soft-light` tinge sem
              chapar: o laranja entra na luz da imagem em vez de cobri-la. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-accent/30 mix-blend-soft-light"
          />

          {/* A rota: mesmo tracejado do rastro-h/rastro-v, agora atravessando
              a foto inteira, subindo até um ponto alto — como se o avião que
              veio da tela anterior tivesse continuado por cima da paisagem. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full text-accent"
          >
            <path
              d="M8 78 C 28 68, 42 52, 56 44 C 70 36, 78 24, 84 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              strokeDasharray="1.2 1.4"
              strokeLinecap="round"
              opacity="0.75"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute h-8 w-8 text-accent drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] sm:h-9 sm:w-9"
            style={{ left: "84%", top: "13%", transform: "translate(-50%, -50%) rotate(-14deg)" }}
          >
            <AviaoOtavio className="h-full w-full" />
          </span>

          {/* Degradê sob o texto, garantindo tinta cheia na base. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overlay-cena"
          />
        </>
      ) : null}

      <div className="relative mx-auto w-full max-w-6xl px-5 pt-20 pb-14 sm:px-8 sm:pb-20 lg:pb-24">
        <div className="max-w-[34rem]">
          <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.1] font-bold tracking-[-0.025em] text-balance text-ink-inverse">
            {heroFoto.headline}
          </h2>

          <p className="mt-6 border-l-2 border-accent/60 pl-4 text-[17px] leading-relaxed text-accent">
            {heroFoto.apoio}
          </p>

          <div className="mt-9">
            <WhatsAppLink contexto="hero" tamanho="grande">
              {heroFoto.cta}
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
