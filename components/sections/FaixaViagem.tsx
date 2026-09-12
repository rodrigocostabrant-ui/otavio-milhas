import { faixaViagem } from "@/content/site";
import { isPendente } from "@/content/types";
import { Imagem } from "@/components/ui/Imagem";
import { Reveal } from "@/components/ui/Reveal";
import { IconeAviao } from "@/components/ui/Icones";

/**
 * A foto de viagem ocupando uma tela inteira, com o texto escrito por cima.
 *
 * Existe por dois motivos. O primeiro é de argumento: entre a hero e "Quem é o
 * Otávio" a página andava três seções inteiras sem uma única imagem, e uma
 * landing de viagem que só tem texto não prova nada. O segundo é de ritmo: é a
 * única faixa escura da primeira metade, e o corte claro→escuro→claro é o que
 * impede a página de ler como uma esteira de blocos de igual peso.
 *
 * O texto mora **em cima** da foto, não embaixo dela, e é o `overlay-cena` que
 * torna isso legível. Ele não é decoração: numa foto sangrada a única borda que
 * não compete com a imagem é a de baixo, e o véu concentra densidade no terço
 * inferior — os dois terços de cima ficam com a foto quase limpa. A conta de
 * contraste está em `app/globals.css`, e ela é o que impede o véu de ficar mais
 * leve do que já está.
 *
 * Sem rótulo de seção: o teto da página é de três e eles já estão gastos no
 * selo da hero, em "Quem vai te ensinar" e em "Quem já viajou com isso".
 *
 * Sem CTA: o botão do WhatsApp está a uma tela de distância, no alto, e outro
 * aqui seria o quinto da página com a mesma intenção. O trabalho desta seção é
 * a foto.
 *
 * O `<h2>` é `<h2>` e não `<h1>`: o único `<h1>` da página é o da hero, e uma
 * página com dois deles não tem mais um título — tem dois candidatos.
 */
export function FaixaViagem() {
  const temFoto = !isPendente(faixaViagem.foto);

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
      {temFoto ? (
        <>
          <Imagem foto={faixaViagem.foto} preencher sizes="100vw" />

          {/* A marca tingindo a luz da imagem em vez de cobri-la. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-accent/20 mix-blend-soft-light"
          />

          {/* O véu que torna o texto legível sem tapar a foto. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overlay-cena"
          />
        </>
      ) : (
        /* Sem foto, o marcador fica na metade de cima. `preencher` centra o
           quadro no ancestral posicionado mais próximo, e com a seção inteira
           como ancestral ele caía exatamente em cima do `<h2>`, que mora na
           base. O invólucro é o ancestral menor que resolve isso. */
        <div className="absolute inset-x-0 top-0 h-[58%] px-5">
          <Imagem foto={faixaViagem.foto} preencher sizes="100vw" />
        </div>
      )}

      <div className="relative mx-auto w-full max-w-6xl px-5 pt-24 pb-16 sm:px-8 sm:pb-24">
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

          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-inverse/80 sm:text-lg">
            {faixaViagem.apoio}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
