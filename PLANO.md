# Landing Otávio Milhas — estado do projeto

**Atualizado em:** 2026-09-09

## Onde está

Base construída e rodando. Build limpo, lint limpo, testes passando.

| Item | Estado |
|---|---|
| Spec de design | ✅ `docs/superpowers/specs/2026-09-09-landing-otavio-milhas-design.md` |
| Plano de implementação | ✅ `docs/superpowers/plans/2026-09-09-landing-otavio-milhas.md` |
| Brief | ✅ `brief.md` |
| Copy | ✅ `copy.md` |
| Projeto Next.js | ✅ Next 16.3.4 + React 19.2 + Tailwind v4 + framer-motion 13 |
| Nove seções | ✅ todas construídas |
| SEO / OG / JSON-LD | ✅ metadata, opengraph-image, sitemap, robots, Person + Service |
| Favicon | ✅ o avião do logo, gerado em `app/icon.tsx` |
| Preview local | ✅ `npm run dev` |
| Preview na Vercel | ⬜ pendente |
| Logo em vetor (SVG) | ⬜ PNG por enquanto — ver "Dívidas técnicas" |

## O que mudou em relação à página atual

A página de hoje é um WordPress com logo, três frases e três botões de WhatsApp
idênticos. O que mudou:

1. **Deixou de vender um "curso" que não existe.** A copy antiga terminava em
   "inscreva-se no meu curso exclusivo", sem nunca dizer o que era o curso. A
   nova fala de aprender e ser acompanhado por ele — que é o que de fato
   acontece.
2. **Ganhou argumento.** De três frases soltas para uma sequência: o contraste
   entre quem paga passagem cheia e quem usa milhas, quem é o Otávio, os
   assuntos que ele domina, como começar, para quem serve e para quem não serve,
   e as cinco objeções respondidas.
3. **A autoridade subiu para o topo.** Os 5 milhões de milhas e o "desde 2021"
   agora aparecem no primeiro scroll e de novo na terceira seção, em vez de
   ficarem enterrados num parágrafo "Quem sou?".
4. **Ganhou identidade visual.** Antes existia só o logo. Agora há um sistema:
   tokens de cor, tipografia display + corpo, rótulos em caixa alta replicando
   o "MILHAS" do logo, e o rastro tracejado do avião como motivo recorrente.
5. **Ficou acessível.** O laranja da marca reprova em AA quando carrega texto
   branco. A página usa uma variante escura do laranja nos botões e reserva o
   `#FF5A00` para traço, ícone e fundo escuro.
6. **Os CTAs pararam de ser iguais.** Cada seção manda uma mensagem
   pré-preenchida diferente, então o Otávio sabe de onde a pessoa veio.
7. **Ficou honesta sobre o que não tem.** Todo dado não confirmado aparece como
   marcador visível, nunca como valor plausível inventado.

## Pendências de conteúdo

Cada item abaixo aparece na página como marcador. O rótulo é exatamente o que
está escrito no marcador, para você cruzar o que vê com esta lista.

| Rótulo na página | Onde aparece | Quem resolve |
|---|---|---|
| Foto de viagem para o topo da página | Hero | Rodrigo (tem as fotos) |
| Foto de viagem do Otávio | Quem é o Otávio | Rodrigo |
| Retrato profissional do Otávio | Quem é o Otávio | a coletar |
| Número de países visitados | Quem é o Otávio | Otávio |
| Nome completo do Otávio | Quem é o Otávio, JSON-LD | Otávio |
| Cidade | Quem é o Otávio | Otávio |
| Confirmar os seis assuntos com o Otávio | Os assuntos | Otávio |
| Título da seção de depoimentos | Prova social | depende dos depoimentos |
| Três depoimentos com nome e contexto | Prova social | Otávio + autorização |
| Prints de resgates e emissões reais | Prova social | Otávio |
| E-mail de contato | Rodapé | Otávio |
| CNPJ | Rodapé | Otávio, se houver |
| Política de Privacidade | Rodapé | a redigir |
| Termos de Uso | Rodapé | a redigir |

**A mais valiosa da lista:** um único print de emissão real vale mais, em
conversão, que qualquer ajuste de texto que eu faça na página.

## Como preencher uma pendência

1. Abrir `content/site.ts` (ou `temas.ts` / `faq.ts`).
2. Trocar `pendente("Cidade", "…")` pelo valor real: `"Belo Horizonte"`.
3. Para foto, colocar o arquivo em `public/img/` e trocar o `pendente(...)` por
   `{ src: "/img/arquivo.jpg", alt: "descrição real", largura: 1600, altura: 900 }`.
4. Rodar `npm run build`. Quando a lista zerar,
   `NEXT_PUBLIC_PROTOTIPO=false npm run build` passa — e é essa a hora de
   apontar o domínio.

## Riscos registrados no brief

1. **A oferta não tem forma.** Sem preço, formato ou entregável, a página gera
   interesse mas não responde "o que exatamente eu recebo?". Estruturar isso é o
   maior ganho possível na próxima rodada.
2. **Zero prova social de terceiros.** A página se apoia inteiramente na
   credibilidade pessoal do Otávio.
3. **Sem instrumentação.** Não há como medir se a página funcionou. Vercel
   Analytics resolve com uma linha.
4. **Descompasso entre site e Instagram.** O perfil vende gestão de milhas; a
   página vende aprendizado. Vale revisitar quando houver dado de conversão.

## Dívidas técnicas

- **Logo em PNG, não em vetor.** O lettering manuscrito não foi vetorizado nesta
  rodada. O PNG de 400×221 é nítido nos tamanhos usados (36–44px de altura), mas
  um SVG seria melhor em telas grandes. Preferi manter o PNG fiel a arriscar um
  vetor que descaracterizasse a marca.
- **Sem testes de componente.** Só a lógica de pendência tem teste automatizado
  (`content/types.test.ts`). O resto é markup, verificado por build, lint e
  inspeção visual.

## Próximos passos sugeridos

1. Você me manda as fotos de viagem → saem quatro marcadores de uma vez.
2. Otávio confirma os seis assuntos, nome, cidade e países.
3. Publicar preview na Vercel.
4. Caçar um print de emissão real para a seção de prova social.
5. Só então apontar `otaviomilhas.com.br`.
