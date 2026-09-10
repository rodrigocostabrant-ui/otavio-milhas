import Image from "next/image";
import { linkWhats, marca, rodape, whatsapp } from "@/content/site";
import { Dado, Placeholder } from "@/components/ui/Placeholder";
import { IconeInstagram, IconeWhatsApp } from "@/components/ui/Icones";

export function Footer() {
  return (
    <footer className="bg-ink text-ink-inverse">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <Image
              src="/img/logo-otavio-branco.png"
              alt={marca.nome}
              width={400}
              height={221}
              className="h-11 w-auto"
            />
            <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-ink-inverse/65">
              {marca.descricao}
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-[15px] text-ink-inverse/65">
              <span>Contato:</span>
              <Dado valor={marca.email} tom="escuro" />
            </p>
          </div>

          <nav aria-label="Contato e redes">
            <ul className="space-y-3">
              <li>
                <a
                  href={linkWhats("rodape")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[15px] text-ink-inverse/80 transition-colors duration-200 hover:text-accent"
                >
                  <IconeWhatsApp className="h-[18px] w-[18px]" />
                  {whatsapp.exibicao}
                </a>
              </li>
              <li>
                <a
                  href={marca.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[15px] text-ink-inverse/80 transition-colors duration-200 hover:text-accent"
                >
                  <IconeInstagram className="h-[18px] w-[18px]" />
                  {marca.instagramHandle}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-ink-inverse/12 pt-7">
          <div className="flex flex-wrap items-center gap-3">
            <Placeholder
              tom="escuro"
              label={rodape.politica.label}
              motivo={rodape.politica.motivo}
            />
            <Placeholder
              tom="escuro"
              label={rodape.termos.label}
              motivo={rodape.termos.motivo}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-inverse/50">
            <span>{rodape.copyright}</span>
            <Dado valor={marca.cnpj} tom="escuro" />
          </div>
        </div>
      </div>
    </footer>
  );
}
