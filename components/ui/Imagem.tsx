import NextImage from "next/image";
import { isPendente, type Foto, type Talvez } from "@/content/types";
import { garantirProtótipo } from "./Placeholder";
import { IconeAviao } from "./Icones";

/**
 * Imagem que nunca mente.
 *
 * Enquanto a foto real não chega, renderiza uma moldura tracejada dizendo o que
 * falta — nunca uma foto de banco provisória sem rótulo, que passaria por real.
 * A moldura herda a mesma trava de build do `Placeholder`.
 */

const proporcoes = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
} as const;

export function Imagem({
  foto,
  proporcao = "16/9",
  prioridade = false,
  sizes = "100vw",
  className = "",
  preencher = false,
}: {
  foto: Talvez<Foto>;
  proporcao?: keyof typeof proporcoes;
  prioridade?: boolean;
  sizes?: string;
  className?: string;
  /** Sangra pelo pai (`absolute inset-0`, `object-cover`) em vez de reservar
   *  a própria caixa por `proporcao` — para foto de fundo de seção, não de
   *  painel. O pai precisa ser `relative` e ter altura própria. */
  preencher?: boolean;
}) {
  if (isPendente(foto)) {
    garantirProtótipo(foto.label);

    return (
      <div
        role="note"
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-accent/35 bg-accent-soft/50 px-6 py-10 text-center ${preencher ? "absolute inset-0 m-auto h-fit max-w-md" : proporcoes[proporcao]} ${className}`}
      >
        <IconeAviao className="h-7 w-7 text-accent/70" />
        <span className="rotulo text-accent-strong">Imagem a receber</span>
        <span className="max-w-[34ch] text-[15px] leading-relaxed text-ink-muted">
          {foto.label}
        </span>
        {foto.motivo ? (
          <span className="max-w-[38ch] text-[13px] leading-relaxed text-ink-muted/80">
            {foto.motivo}
          </span>
        ) : null}
      </div>
    );
  }

  if (preencher) {
    return (
      <NextImage
        src={foto.src}
        alt={foto.alt}
        fill
        sizes={sizes}
        priority={prioridade}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${proporcoes[proporcao]} ${className}`}>
      <NextImage
        src={foto.src}
        alt={foto.alt}
        width={foto.largura}
        height={foto.altura}
        sizes={sizes}
        priority={prioridade}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
