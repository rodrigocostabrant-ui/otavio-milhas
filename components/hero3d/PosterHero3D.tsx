import { hero3d } from "@/content/hero3d";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * O frame estático.
 *
 * É o que aparece com `prefers-reduced-motion`, quando o FPS não segura, e como
 * fallback do `<Suspense>` enquanto a cena carrega. Composto no beat da janela:
 * céu de hora dourada visto por uma janela de avião.
 *
 * Sem trilho de rolagem, sem sticky, altura de tela normal — nada de pinar a
 * página para quem pediu menos movimento.
 */
export function PosterHero3D({
  /** Sem WebGL a página não deve prometer nada de 3D: só a hero, limpa. */
  comJanela = true,
}: {
  comJanela?: boolean;
}) {
  return (
    <section
      id="topo"
      className="relative isolate flex min-h-[86svh] items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #2A4A73 0%, #6E86A8 38%, #D9A273 74%, #F2C48E 100%)",
      }}
    >
      {/* Sugestão de nuvens, sem custo de GPU. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(38% 22% at 22% 62%, rgba(255,255,255,0.75), transparent 70%)," +
            "radial-gradient(30% 16% at 68% 52%, rgba(255,255,255,0.6), transparent 72%)," +
            "radial-gradient(46% 20% at 88% 72%, rgba(255,255,255,0.5), transparent 74%)",
        }}
      />

      {comJanela ? (
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 100 100"
        >
          <path
            fillRule="evenodd"
            fill="#14120F"
            fillOpacity="0.92"
            d="M0 0h100v100H0z M72 26 a11 17 0 0 0 -11 17 v14 a11 17 0 0 0 22 0 v-14 a11 17 0 0 0 -11 -17z"
          />
          <ellipse
            cx="72"
            cy="50"
            rx="11.6"
            ry="24.4"
            fill="none"
            stroke="#3A352F"
            strokeWidth="1.4"
          />
        </svg>
      ) : null}

      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="max-w-[22ch]">
          <h1 className="font-display text-[clamp(2rem,6vw,4rem)] leading-[1.06] font-bold tracking-[-0.025em] text-balance text-ink-inverse [text-shadow:0_2px_28px_rgba(12,14,18,0.45)]">
            {hero3d.estatico.titulo}
          </h1>
        </div>

        <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-ink-inverse/85 [text-shadow:0_1px_16px_rgba(12,14,18,0.5)]">
          {hero3d.estatico.sub}
        </p>

        <div className="mt-9">
          <WhatsAppLink contexto="hero" tamanho="grande">
            {hero3d.cta.rotulo}
          </WhatsAppLink>
        </div>

        <p className="mt-5 max-w-[36ch] text-[15px] leading-relaxed text-ink-inverse/75 [text-shadow:0_1px_16px_rgba(12,14,18,0.5)]">
          {hero3d.reforco.texto}
        </p>
      </div>
    </section>
  );
}
