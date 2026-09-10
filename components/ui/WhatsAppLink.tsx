import { linkWhats, type ContextoCta } from "@/content/site";
import { IconeWhatsApp } from "./Icones";

/**
 * O único destino de conversão da página.
 *
 * Nenhuma variante usa `bg-accent` puro atrás de texto: branco sobre #FF5A00
 * dá 2.9:1 e reprova em AA. Botão preenchido é sempre `accent-strong`.
 */

const variantes = {
  solido:
    "bg-accent-strong text-ink-inverse hover:bg-accent-hover shadow-[0_1px_2px_rgba(28,27,26,0.08)]",
  contorno:
    "border border-accent/60 text-accent-strong hover:bg-accent-soft hover:border-accent",
  claro: "bg-ink-inverse text-accent-strong hover:bg-accent-soft",
} as const;

const tamanhos = {
  normal: "px-6 py-3 text-[15px]",
  grande: "px-7 py-4 text-base",
} as const;

export function WhatsAppLink({
  contexto,
  variante = "solido",
  tamanho = "normal",
  children,
  className = "",
}: {
  contexto: ContextoCta;
  variante?: keyof typeof variantes;
  tamanho?: keyof typeof tamanhos;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={linkWhats(contexto)}
      target="_blank"
      rel="noopener noreferrer"
      /* O header imersivo repinta o contorno de branco: sobre a imagem,
         `accent-strong` é um laranja escuro demais para ser lido. */
      data-variante={variante}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-colors duration-200 ${variantes[variante]} ${tamanhos[tamanho]} ${className}`}
    >
      <IconeWhatsApp className="h-[18px] w-[18px] shrink-0" />
      <span>{children}</span>
    </a>
  );
}
