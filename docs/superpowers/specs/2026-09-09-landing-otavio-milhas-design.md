# Landing page Otávio Milhas — design

Data: 2026-09-09
Status: aprovado em 2026-09-09

## 1. O problema

Otávio mantém hoje `otaviomilhas.com.br`: uma one-page de WordPress com logo,
três frases e três botões apontando para o mesmo WhatsApp. A página não
argumenta, não qualifica, não prova nada e não tem identidade visual além do
logo. Ela desperdiça a única coisa que Otávio tem de sobra: credibilidade
concreta no nicho de milhas.

Esta spec descreve a substituição: uma landing profissional, com sistema visual
próprio derivado do logo, espinha narrativa de conversão e copy no tom dele.

## 2. O que a página vende

**Não vende um curso.** Otávio não tem produto embalado com módulos,
plataforma, preço ou garantia. O que ele tem é conhecimento e disposição para
ensinar e acompanhar pessoas, e a conversa acontece no WhatsApp.

Decisão travada: a palavra "curso" **não aparece na página**. O vocabulário é
"eu te ensino / eu te acompanho". A copy existente do site é reaproveitada
verbatim onde não depende dessa palavra, e reescrita onde depende.

Consequência estrutural: não existe seção "Como funciona o curso" com formato,
duração, plataforma, preço ou garantia. Nada disso seria verdade e nada disso
pode ser inventado.

### Oferta e conversão

- **Ação única:** conversa no WhatsApp `+55 31 99961-8080`
  (`https://wa.me/5531999618080`), com mensagem pré-preenchida.
- **Ação secundária:** seguir `@otaviomilhasbr`.
- Sem formulário, sem captura de e-mail, sem checkout nesta rodada.
- O destino do CTA vive em uma constante única em `content/site.ts`. Se um
  checkout aparecer depois, troca-se em um lugar só.

## 3. Fatos confirmados

Levantados do site atual (verificado via web em 2026-09-09) e do perfil público
do Instagram. Nada além disto pode ser afirmado na página.

- Nome público: "Otávio Milhas". Primeiro nome: Otávio.
- DDD 31, região de Belo Horizonte/MG.
- Bio do Instagram: "Gestor Especialista em Milhas Aéreas e Cartões", agente de
  viagens. Tagline: "Quer viajar mais, gastando menos?!?"
- 7.012 seguidores, 304 seguindo (setembro/2026).
- Destaques do perfil: casos de gestão de clientes, Argentina, gastronomia,
  Curaçao. Apareceu no podcast "Moema Talks".
- Desde 2021 no universo das milhas. Mais de 5 milhões de milhas negociadas.
- Copy verbatim do site atual, para reaproveitar e não descartar:
  - "Aprenda as melhores estratégias para acumular milhas, viajar mais,
    gastando menos."
  - "Aprenda com quem já percorreu vários países sem gastar uma fortuna em
    passagens aéreas."
  - "Você sabia que pode transformar suas compras e gastos do dia a dia em
    viagens inesquecíveis pelo mundo? Milhões de pessoas pagam caro por
    passagens aéreas, enquanto outras aproveitam o poder das milhas para
    explorar novos destinos com muito mais economia."
  - "Desde 2021, venho mergulhando no fascinante universo das milhas aéreas e
    essa jornada me levou a conhecer na prática países incríveis. Ao longo desse
    caminho, tive a oportunidade de negociar mais de 5 milhões de milhas de
    forma estratégica, otimizando minhas viagens, garantindo que cada destino
    fosse ainda mais acessível e, acima de tudo, inesquecível."
  - "Está pronto para começar sua jornada pelo mundo usando milhas?"

### Tom de voz

Conversacional, direto, aspiracional. Trata o leitor por "você". Abre seções com
pergunta retórica. Fala de economia, acesso e liberdade, nunca de luxo. Prova
pela experiência pessoal. Pode usar "!", mas sem CAPS LOCK, sem excesso de
emoji, sem promessa irreal ("viaje de graça").

## 4. Espinha narrativa

Ordem escolhida: **autoridade cedo**. O raciocínio: a página não vende um
produto embalado, vende *conversar com uma pessoa no WhatsApp*. A única coisa
que faz alguém mandar essa mensagem é acreditar nele. Como não há depoimento nem
print de resgate disponível, **Otávio é a prova social**, e portanto ele aparece
na terceira seção, não na sexta.

1. **Hero** — logo + nav enxuta. Headline verbatim com "gastando menos" em
   destaque laranja. Sub verbatim. CTA WhatsApp. Selo de prova:
   "+5 milhões de milhas negociadas · desde 2021". Foto de viagem sangrada.
2. **A virada de chave** — o contraste "milhões pagam caro / outros usam
   milhas", em duas colunas.
3. **Quem é o Otávio** — história verbatim, foto real de viagem, números de
   credibilidade. Retrato profissional entra como marcador.
4. **No que ele te ajuda** — 6 temas de milhas escritos como assunto que ele
   domina, **não** como ementa de curso: acumular no dia a dia, cartões e
   programas, transferências bonificadas, emissão inteligente, classe executiva,
   erros caros. Numerados com o motivo tracejado. Marcado no PLANO como
   "confirmar com o Otávio".
5. **Como começa** — 3 passos: você chama no WhatsApp, ele entende seu perfil
   de gastos e para onde você quer ir, ele te mostra o caminho.
6. **Para quem é / não é** — duas colunas. Qualifica o lead antes do WhatsApp e
   reduz conversa desqualificada.
7. **Prova social** — seção desenhada e vazia, marcada como pendente. Grade
   pronta para depoimento e print de resgate quando existirem.
8. **FAQ** — objeções reais do nicho: "milhas não é só para quem gasta muito?",
   "funciona para quem está começando?", "preciso de cartão caro?", "quanto
   tempo até a primeira viagem?", "quanto custa?". A última direciona para o
   WhatsApp sem citar número inventado.
9. **CTA final** — "Está pronto para começar sua jornada pelo mundo usando
   milhas?" com fechamento reescrito sem a palavra "curso".
10. **Rodapé** — logo branca, Instagram, WhatsApp, Política de Privacidade,
    Termos de Uso, ©.

## 5. Sistema visual

Variante: **Clara contemporânea**. Fundo off-white, muito respiro, tipografia
display grande, laranja como única cor de destaque, fotografia de viagem real e
grande.

### Tokens

Definidos em `@theme` no `app/globals.css`, nomeados por papel e nunca por cor.
Nenhuma cor literal em componente.

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--color-bg` | `#FAF8F5` | fundo da página | — |
| `--color-surface` | `#FFFFFF` | cartões | — |
| `--color-border` | `#E7E1D9` | divisórias | — |
| `--color-ink` | `#1C1B1A` | texto principal | 15.8:1 sobre bg |
| `--color-ink-muted` | `#5C5750` | texto secundário | 6.9:1 sobre bg |
| `--color-accent` | `#FF5A00` | ícone, borda, rastro, hover, sobre escuro | não carrega texto pequeno |
| `--color-accent-strong` | `#C2410C` | preenchimento de botão | 4.9:1 com branco, passa AA |
| `--color-accent-hover` | `#9A3412` | hover do botão | 6.6:1 com branco |
| `--color-accent-soft` | `#FFF1E8` | fundo de destaque leve | — |
| `--color-ink-inverse` | `#FFFFFF` | texto sobre accent-strong | — |

Regra dura: **o laranja puro do logo (`#FF5A00`) nunca carrega texto pequeno.**
Branco sobre ele reprova em AA. Ele vive em traço, ícone, o avião, o rastro
tracejado e o sublinhado da palavra-chave do hero. Todo preenchimento de botão
com texto branco usa `--color-accent-strong`.

### Tipografia

- **Display:** Bricolage Grotesque, peso 700, tracking apertado. Personalidade
  sem imitar o script do logo.
- **Corpo:** Instrument Sans.
- **Rótulo e olho de seção:** caixa alta, `tracking: 0.18em`, replicando
  exatamente o "MILHAS" do logo. É a assinatura tipográfica que amarra a página
  à marca.

Ambas via `next/font` (Google), com `display: swap` e fallback declarado.

### Elemento gráfico

O rastro tracejado que sai do avião no logo vira o motivo recorrente do sistema:
separa seções, conecta os 3 passos de "Como começa", contorna a numeração dos
temas. É um sistema derivado da marca, não decoração aplicada por cima.

### Direção de arte

Viagem real: aeroporto, janela de avião, mapa, carimbo de passaporte, destino.
Nunca foto de banco genérica de "casal pulando na praia". As fotos são as das
viagens do próprio Otávio (Rodrigo vai fornecer). Até chegarem, cada imagem
renderiza como marcador de imagem pendente, nunca uma foto de stock provisória
sem rótulo.

## 6. Arquitetura técnica

Stack idêntica ao projeto `clinica-estetica`, que serve de referência de
arquitetura: Next.js 16 App Router, React 19, Tailwind v4, framer-motion.

**Antes de escrever código, ler os guias em `node_modules/next/dist/docs/`.**
Esta versão do Next tem breaking changes em relação ao conhecimento prévio.

```
otavio-milhas/
  app/
    layout.tsx, page.tsx, globals.css
    icon.tsx, opengraph-image.tsx, sitemap.ts, robots.ts
  components/
    layout/    Header, Footer
    sections/  Hero, ViradaDeChave, QuemEOtavio, Temas, ComoComeca,
               ParaQuem, ProvaSocial, FAQ, CTAFinal
    ui/        Placeholder, Imagem, Reveal, WhatsAppLink,
               BotaoFlutuante, Icones
    JsonLd.tsx
  content/     site.ts, temas.ts, faq.ts, types.ts
  public/img/  logo-colorido.svg, logo-branco.svg, viagens/
```

### Conteúdo e pendências

`content/types.ts` é portado do projeto da clínica sem alteração de contrato:
`Pendente`, `Talvez<T>`, `pendente()`, `isPendente()`, e a trava
`MODO_PROTOTIPO` lida de `NEXT_PUBLIC_PROTOTIPO`.

`components/ui/Placeholder.tsx` exporta `Placeholder`, `Dado` e
`garantirProtótipo`, com a paleta readaptada aos tokens desta marca. `<Dado>` é o
**único** caminho de renderização de campo `Talvez<T>`, então não existe caminho
pelo qual um dado ausente vire texto inventado. Com `NEXT_PUBLIC_PROTOTIPO=false`
o componente lança erro em build, o que impede um marcador de ir ao ar por
esquecimento.

Nenhuma string de conteúdo mora em componente. Tudo tipado em `content/`.

### Interação

- Botão flutuante de WhatsApp: oculto enquanto o CTA do hero está visível
  (IntersectionObserver), entra depois, canto inferior direito.
- Todo CTA usa mensagem pré-preenchida, definida por contexto em `site.ts`.
- Animações de entrada de 150 a 250ms, sutis, todas respeitando
  `prefers-reduced-motion`.

### SEO e infra

- `metadata` completo (title, description, openGraph, twitter, canonical).
- `opengraph-image.tsx` gerada com a marca.
- `sitemap.ts`, `robots.ts`.
- JsonLd: **Person + Service**. Não `Course`, porque não existe curso.
- Favicon recortado do avião do logo, via `app/icon.tsx`.
- Logos reconstruídos em SVG limpo a partir dos PNG de referência.

### Acessibilidade, AA obrigatório

Contraste verificado em todo texto (ver tabela de tokens), `alt` descritivo em
toda imagem, foco visível em todo elemento interativo, hierarquia de headings sem
salto, `prefers-reduced-motion` honrado, FAQ operável por teclado.

### Performance

`next/image` em toda imagem, `priority` apenas no hero, fontes via `next/font`,
zero biblioteca de ícone (SVG inline em `ui/Icones.tsx`).

### Deploy

Preview na Vercel. O domínio `otaviomilhas.com.br` **não** é configurado nesta
rodada.

## 7. Pendências de conteúdo

Tudo abaixo nasce como marcador visível na página. Nenhum destes valores pode ser
inventado, nem preenchido com exemplo plausível.

- Sobrenome e nome completo de Otávio
- Cidade exata
- Retrato profissional
- Fotos das viagens (Rodrigo vai fornecer)
- Número de países visitados
- Número de pessoas já ajudadas
- Depoimentos e autorização de uso
- Prints de resgates e emissões
- E-mail de contato
- CNPJ, se houver
- Texto de Política de Privacidade
- Texto de Termos de Uso
- Confirmação dos 6 temas da seção "No que ele te ajuda"

## 8. Decisões travadas

Estas decisões não se reabrem sem conversa explícita, e são replicadas em
`CLAUDE.md` e `AGENTS.md` do projeto:

1. A palavra "curso" não aparece na página. Vocabulário: "eu te ensino / te
   acompanho".
2. WhatsApp é o único destino de conversão. Sem formulário, sem checkout.
3. Variante visual: Clara contemporânea.
4. `#FF5A00` nunca carrega texto pequeno. Botão preenchido usa `#C2410C`.
5. Espinha narrativa: autoridade cedo, Otávio na terceira seção.
6. Botão flutuante só aparece depois do hero.
7. Zero conteúdo inventado. O que falta vira `pendente()`.
