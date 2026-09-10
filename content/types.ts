/**
 * Modo protótipo.
 *
 * Todo dado que ainda não foi confirmado é representado por `Pendente`, nunca
 * por uma string inventada. O componente <Dado> é o único caminho de
 * renderização de um campo `Talvez<T>`, então é impossível um valor ausente ser
 * exibido como se fosse real — ou vira marcador visível, ou quebra o build.
 *
 * Ver docs/superpowers/specs/2026-09-09-landing-otavio-milhas-design.md §6 e §7.
 */

export type Pendente = {
  readonly __pendente: true;
  /** O que falta, em linguagem de cliente. Aparece no marcador. */
  readonly label: string;
  /** Por que ainda não temos. Vira title/tooltip. */
  readonly motivo?: string;
};

export type Talvez<T> = T | Pendente;

export function pendente(label: string, motivo?: string): Pendente {
  return { __pendente: true, label, motivo };
}

export function isPendente(valor: unknown): valor is Pendente {
  return (
    typeof valor === "object" &&
    valor !== null &&
    "__pendente" in valor &&
    (valor as Pendente).__pendente === true
  );
}

/** Foto confirmada. Enquanto não chega, o campo é `Pendente`. */
export type Foto = {
  readonly src: string;
  readonly alt: string;
  readonly largura: number;
  readonly altura: number;
};

/** Protótipo ligado por padrão. `NEXT_PUBLIC_PROTOTIPO=false` proíbe marcadores. */
export const MODO_PROTOTIPO = process.env.NEXT_PUBLIC_PROTOTIPO !== "false";
