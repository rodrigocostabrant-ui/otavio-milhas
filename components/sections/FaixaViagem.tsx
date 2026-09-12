import { faixaViagem } from "@/content/site";
import { isPendente } from "@/content/types";
import { Imagem } from "@/components/ui/Imagem";
import { Reveal } from "@/components/ui/Reveal";
import { IconeAviao } from "@/components/ui/Icones";

/**
 * A foto de viagem, sangrada de borda a borda, logo abaixo da hero.
 *
 * Existe por dois motivos. O primeiro é de argumento: entre a hero e "Quem é o
 * Otávio" a página andava três seções inteiras sem uma única imagem, e uma
 * landing de viagem que só tem texto não prova nada. O segundo é de ritmo: é a
 * única faixa escura da primeira metade, e o corte claro→escuro→claro é o que
 * impede a página de ler como uma esteira de blocos de igual peso.
 *
 * A foto não fica solta. Ela carrega um `<h2>` e uma linha de apoio ancorados
 * na base, sobre o `overlay-cena` — que não é decoração: numa foto sangrada a
 * única borda que não compete com a imagem é a de baixo, e é o degradê que
 * garante tinta cheia exatamente onde a leitura acontece.
 *
 * Sem rótulo de seção: o teto da página é de três e eles já estão gastos no
 * selo da hero, em "Quem vai te ensinar" e em "Quem já viajou com isso".
 *
 * Sem CTA: o botão do WhatsApp está a uma tela de distância, no alto, e outro
 * aqui seria o quinto da página com a mesma intenção. O trabalho desta seção é
 * a foto.
 */
export function FaixaViagem() {
  const temFoto = !isPendente(faixaViagem.foto);

  return (
    <section className="relative isolate flex min-h-[68svh] flex-col justify-end overflow-hidden bg-ink">
      {temFoto ? (
        <Imagem foto={faixaViagem.foto} preencher sizes="100vw" />
      ) : (
        /* Sem foto, o marcador vai para a metade de cima. `preencher` centra o
           quadro no ancestral posicionado mais próximo, e com a seção inteira
           como ancestral ele caía exatamente em cima do `<h2>`, que mora na
           base. O invólucro é o ancestral menor que resolve isso. */
        <div className="absolute inset-x-0 top-0 h-1/2 px-5">
          <Imagem foto={faixaViagem.foto} preencher sizes="100vw" />
        </div>
      )}

      {temFoto ? (
        <>
          {/* A marca tingindo a luz da imagem em vez de cobri-la. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-accent/25 mix-blend-soft-light"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overlay-cena"
          />
        </>
      ) : null}

      <div className="relative mx-auto w-full max-w-6xl px-5 pt-24 pb-14 sm:px-8 sm:pb-20">
        <Reveal>
          {/* O rastro do logo abrindo a faixa: o mesmo vocabulário do avião,
              aqui no único lugar da primeira metade onde o laranja puro pode
              encostar em fundo escuro sem reprovar em contraste. */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <IconeAviao className="h-5 w-5 shrink-0 text-accent" />
            <span className="rastro-h w-20 opacity-80" />
          </div>

          <h2 className="titulo-ancora mt-6 max-w-[20ch] text-ink-inverse">
            {faixaViagem.headline}
          </h2>

          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-inverse/75 sm:text-lg">
            {faixaViagem.apoio}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
