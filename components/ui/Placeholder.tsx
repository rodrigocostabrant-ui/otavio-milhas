import { isPendente, MODO_PROTOTIPO, type Talvez } from "@/content/types";

/**
 * Marcador de informação ainda não confirmada.
 *
 * Com NEXT_PUBLIC_PROTOTIPO=false o componente lança erro em tempo de build: é o
 * que impede um marcador de ir ao ar por esquecimento quando o site deixar de
 * ser protótipo.
 *
 * `tom="escuro"` é a versão para o rodapé e para a faixa de CTA final, onde o
 * fundo é `ink`.
 */

type Tom = "claro" | "escuro";

/**
 * Exportada porque nem todo marcador passa por `Placeholder`: a moldura de
 * imagem pendente em `Imagem.tsx` usa layout próprio e precisa da mesma trava.
 */
export function garantirProtótipo(label: string): void {
  if (!MODO_PROTOTIPO) {
    throw new Error(
      `[modo produção] Informação pendente encontrada na página: "${label}". ` +
        `Preencha o dado em content/site.ts ou remova a seção antes de publicar.`,
    );
  }
}

const paleta: Record<
  Tom,
  { borda: string; rotulo: string; texto: string; fundo: string }
> = {
  claro: {
    borda: "border-accent/35",
    rotulo: "text-accent-strong",
    texto: "text-ink-muted",
    fundo: "bg-accent-soft/60",
  },
  escuro: {
    borda: "border-accent/45",
    rotulo: "text-accent",
    texto: "text-ink-inverse/70",
    fundo: "bg-ink-inverse/5",
  },
};

export function Placeholder({
  label,
  motivo,
  bloco = false,
  tom = "claro",
}: {
  label: string;
  motivo?: string;
  /** Marcador em bloco, para seções inteiras, em vez de inline. */
  bloco?: boolean;
  tom?: Tom;
}) {
  garantirProtótipo(label);

  const cor = paleta[tom];

  if (bloco) {
    return (
      <div
        className={`rounded-lg border border-dashed px-5 py-6 sm:px-6 ${cor.borda} ${cor.fundo}`}
        role="note"
      >
        <span className={`rotulo block ${cor.rotulo}`}>A confirmar</span>
        <span className={`mt-2 block text-[15px] leading-relaxed ${cor.texto}`}>
          {label}
        </span>
        {motivo ? (
          <span className={`mt-1.5 block text-[13px] leading-relaxed ${cor.texto}`}>
            {motivo}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-baseline gap-1.5 rounded border border-dashed px-2 py-0.5 align-baseline ${cor.borda} ${cor.fundo}`}
      title={motivo ? `A confirmar — ${motivo}` : "A confirmar"}
    >
      <span className={`rotulo ${cor.rotulo}`}>A confirmar</span>
      <span className={`text-[13px] leading-snug ${cor.texto}`}>{label}</span>
    </span>
  );
}

/**
 * Renderiza o valor quando confirmado, o marcador quando não.
 * É o único caminho de renderização para campos `Talvez<string>` — por isso não
 * há como um dado ausente aparecer como se fosse real.
 */
export function Dado({
  valor,
  bloco = false,
  tom = "claro",
}: {
  valor: Talvez<string>;
  bloco?: boolean;
  tom?: Tom;
}) {
  if (isPendente(valor)) {
    return (
      <Placeholder
        label={valor.label}
        motivo={valor.motivo}
        bloco={bloco}
        tom={tom}
      />
    );
  }
  return <>{valor}</>;
}
