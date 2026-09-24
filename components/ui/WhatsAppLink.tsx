import { linkWhats, type ContextoCta } from "@/content/site";
import { IconeWhatsApp } from "./Icones";

/**
 * O único destino de conversão da página.
 *
 * `accent-strong` é escuro o bastante para carregar texto claro por cima
 * (`ink-inverse`, 4.5:1+). Botão preenchido é sempre `accent-strong`.
 *
 * `botao-tatil` é o afundar de 1px ao pressionar. Sem ele o botão só troca de
 * cor, e trocar de cor é exatamente o que ele já faz no hover — o clique fica
 * sem resposta própria. Ver `app/globals.css`.
 */

const variantes = {
  solido:
    "bg-accent-strong text-ink-inverse hover:bg-accent-hover shadow-[0_1px_2px_rgba(28,27,26,0.08)]",
  contorno:
    "border border-accent/60 text-accent-strong hover:bg-accent-soft hover:border-accent",
  claro: "bg-ink-inverse text-accent-strong hover:bg-accent-soft",
} as const;

/**
 * O tamanho grande encolhe no celular. Com `px-7 text-base` fixos, o rótulo
 * mais longo da página ("Quero aprender a viajar com milhas") quebrava em duas
 * linhas dentro da pílula a 400px — um botão de duas linhas lê como defeito,
 * e o rótulo é copy verbatim que não se encurta.
 */
const tamanhos = {
  normal: "px-6 py-3 text-[15px]",
  grande: "px-5 py-3.5 text-[15px] sm:px-7 sm:py-4 sm:text-base",
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
      className={`botao-tatil inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-colors duration-200 ${variantes[variante]} ${tamanhos[tamanho]} ${className}`}
    >
      <IconeWhatsApp className="h-[18px] w-[18px] shrink-0" />
      <span>{children}</span>
    </a>
  );
}
