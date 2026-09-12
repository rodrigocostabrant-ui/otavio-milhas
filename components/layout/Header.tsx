import Image from "next/image";
import { marca, nav } from "@/content/site";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * Sticky, sempre visível — a marca no topo da página é o `<h1>` de
 * `Marca.tsx`, não este logo pequeno, então não há disputa entre os dois.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/85 backdrop-blur-md">
      {/* A altura vem de um token porque a hero depende dela: ela sobe por
          baixo do header exatamente esta medida. Ver `--altura-header`. */}
      <div className="mx-auto flex h-[var(--altura-header)] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#topo"
          className="relative shrink-0"
          aria-label={`${marca.nome} — início`}
        >
          {/* Um logo só: o fundo atrás do header é sempre o off-white da
              página — não há mais imagem escura passando por baixo dele. */}
          <Image
            src="/img/logo-otavio.png"
            alt={marca.nome}
            width={299}
            height={165}
            loading="eager"
            className="h-9 w-auto sm:h-10"
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
