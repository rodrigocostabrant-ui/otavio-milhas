import Image from "next/image";
import { marca, nav } from "@/content/site";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * O header tem três aparências, e nenhuma delas é estado do React: ele lê
 * `data-hero-fase` do `<html>`, escrito pela hero. Ver o bloco "Header sobre a
 * hero" em `app/globals.css`.
 *
 * Os dois logos ficam montados e só a opacidade troca. `src` condicional
 * causaria um request no meio da rolagem, exatamente no momento em que a
 * conexão está ocupada com os quadros da sequência.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#topo"
          className="relative shrink-0"
          aria-label={`${marca.nome} — início`}
        >
          {/* `loading="eager"` em vez de `preload`: são dois candidatos a LCP
              para a mesma posição, e a doc do Next 16 é explícita em não
              pré-carregar nesse caso. */}
          <Image
            data-logo="escuro"
            src="/img/logo-otavio.png"
            alt={marca.nome}
            width={400}
            height={221}
            loading="eager"
            className="h-9 w-auto sm:h-10"
          />
          <Image
            data-logo="claro"
            src="/img/logo-otavio-branco.png"
            alt=""
            aria-hidden="true"
            width={400}
            height={221}
            loading="eager"
            className="absolute inset-0 h-9 w-auto sm:h-10"
          />
        </a>

        <nav aria-label="Seções da página" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[15px] text-ink-muted transition-colors duration-200 hover:text-ink"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <WhatsAppLink contexto="header" variante="contorno" className="shrink-0">
          <span className="hidden sm:inline">Falar no WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </WhatsAppLink>
      </div>
    </header>
  );
}
