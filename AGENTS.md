<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Landing Otávio Milhas — decisões travadas

Spec: `docs/superpowers/specs/2026-09-09-landing-otavio-milhas-design.md`
Plano: `docs/superpowers/plans/2026-09-09-landing-otavio-milhas.md`
Copy: `copy.md` · Brief: `brief.md` · Estado e pendências: `PLANO.md`

Estas decisões não se reabrem sem conversa explícita com o Rodrigo.

1. **A palavra "curso" não aparece na página.** Otávio não tem produto embalado
   com módulos, plataforma, preço ou garantia. O vocabulário é "eu te ensino /
   te acompanho". Não criar seção de formato, duração, preço ou garantia.
2. **WhatsApp é o único destino de conversão** (`https://wa.me/5531999618080`).
   Sem formulário, sem captura de e-mail, sem checkout. Toda mensagem é
   pré-preenchida por contexto em `content/site.ts`.
3. **Variante visual: Cinza/prata sobre fundo claro** (substituiu a
   "Contemporânea clara" laranja em 24/09/2026, revisada no mesmo dia a partir
   de um mockup do Claude Design — ver §Identidade preto/prata abaixo). Fundo
   off-white, muito respiro, grafite/prata como única cor de destaque,
   fotografia de viagem real e grande.
4. **Nenhum botão preenchido carrega texto que não passe AA.**
   `--color-accent-strong` é escuro o bastante para ser fundo de botão com
   `--color-ink-inverse` (claro) por cima — nunca uma cor clara sobre outra
   clara. Ver a nota em `app/globals.css` e `components/ui/WhatsAppLink.tsx`.
5. **Espinha narrativa: autoridade cedo.** "Quem é o Otávio" é a terceira seção,
   não a sexta. A oferta é conversar com uma pessoa, e como não há depoimento
   nem print de resgate, ele é a prova social.
6. **Botão flutuante só aparece depois do hero**, via IntersectionObserver na
   seção da hero (`#topo`). Era no `#hero-cta`, que deixou de existir quando a
   hero virou só a marca — a intenção é a mesma, o alvo é que mudou.
7. **Zero conteúdo inventado.** O que falta vira `pendente()` em `content/` e
   renderiza como marcador visível. `NEXT_PUBLIC_PROTOTIPO=false npm run build`
   falha de propósito enquanto houver marcador — é a trava que impede um
   protótipo de ir ao ar como se estivesse pronto.

## Hero: uma tela só (decidido em 12/09/2026, com o Rodrigo)

A hero de duas telas — a marca sozinha no off-white e a foto escura sangrada —
foi substituída por uma tela única em duas colunas, modelada na hero do
`tasteskill.dev` a pedido do Rodrigo. Motivos, na ordem em que pesaram:

- A primeira dobra não tinha CTA nenhum. Quem chegava precisava rolar 100vh
  para encontrar a única conversa que esta página oferece.
- Duas telas cheias (200vh) diziam uma coisa só.
- A fotografia, que é o argumento inteiro de uma página de viagem, só aparecia
  depois de rolar — e, enquanto as fotos não chegam, não aparecia de todo.

O que a tela nova tem: selo com ponto pulsante, `<h1>` (o único da página),
apoio, uma linha em laranja e dois CTAs à esquerda; o deck 3D arrastável de
fotos de viagem à direita, que no celular vira uma faixa que escoa.
Componentes em `components/hero/`.

**Exceção declarada à regra de 150–250ms.** A faixa de duração vale para
interação: hover, clique, abertura de acordeão. A montagem da hero usa 800ms
com `cubic-bezier(0.18, 0.89, 0.32, 1.02)`, e a respiração dos cartões usa 7,5s
a 9s — os valores exatos da referência. Tudo some sob `prefers-reduced-motion`.

**O deck deriva, mas para debaixo do cursor.** Uma volta a cada 42 segundos,
lenta o bastante para não disputar a leitura do `<h1>`. A deriva pausa no
instante em que o ponteiro entra no deck — um carrossel que anda debaixo do
cursor faz a foto fugir de quem tentou olhá-la. O arrasto ganha de tudo.

**Um laço para a hero inteira.** `HeroParallaxProvider` é a `<section>` e dona do
único `pointermove`, do único `requestAnimationFrame` e do `IntersectionObserver`
que desliga tudo quando a hero sai da tela. Deck, botão magnético e bandeiras se
inscrevem nele. O contexto carrega uma inscrição, **nunca estado do React**:
guardar a posição do mouse em `useState` re-renderizaria a árvore da hero
sessenta vezes por segundo.

**A matemática do deck mora em `components/hero/giro.ts`, e é testada.** A
prioridade entre arrasto, inércia e deriva, a independência de taxa de quadros e
a maneira como a volta do trilho fecha não se verificam olhando a tela. Ver
`giro.test.ts` antes de mexer em qualquer constante de lá.

**O ímã desloca o `transform`, nunca o layout.** No máximo 10px, e a área
clicável fica onde o olho a viu. Só existe sob `(hover: hover) and (pointer:
fine)`; em toque o botão é um botão comum, e o flutuante do celular continua
sendo o `BotaoFlutuante`, que aparece depois da hero.

**As bandeiras ainda não são bandeiras.** `hero.bandeiras` é `pendente()` porque
o site do Otávio diz apenas "vários países" — escolher seis seria afirmar seis
viagens que ninguém confirmou. Enquanto isso, `BandeirasDecorativas` desenha o
avião e o rastro do próprio logo. É o único marcador da página que **não**
aparece como moldura tracejada: decoração não é conteúdo, e uma moldura boiando
em volta do `<h1>` seria absurda. A troca, quando a lista chegar, é de dados.

## A faixa de foto abaixo da hero

`FaixaViagem` é a "foto de viagem real do Otávio, largura total, sangrada" que o
`copy.md` sempre previu e que ficou sem lugar quando a hero virou uma tela só.
Entre a hero e "Quem é o Otávio" a página andava três seções sem uma única
imagem, e uma landing de viagem que só tem texto não prova nada.

**A copy dela não foi inventada.** As duas frases saem da lista "Headlines
alternativas para o hero", no fim do `copy.md`: o `<h2>` é a alternativa 2 e a
linha de apoio é a 3. Foram escritas junto com o resto e só não tinham sido
escolhidas para a hero — a alternativa 1 continua sendo a headline do site.
Quem for mexer nelas, mexa lá primeiro.

Sem rótulo (o teto de três está gasto) e sem CTA (seria o quinto da página com a
mesma intenção, e o botão do WhatsApp está uma tela acima). O trabalho da seção
é a foto.

## Ritmo da página (mesma conversa)

- **No máximo 3 rótulos de seção na página inteira.** Hoje: o selo da hero,
  "Quem vai te ensinar" e "Quem já viajou com isso". Eram sete, um por seção, e
  sete etiquetas iguais em caixa alta produzem ritmo de template.
- **Três degraus de título, não um.** `titulo-ancora` para as seções que
  carregam o argumento, `titulo-secao` para as que detalham, e o `<h1>` acima
  das duas. Antes todo `<h2>` usava o mesmo tamanho, e oito seções do mesmo
  tamanho não têm hierarquia.
- **Sem listras.** A página roda sobre `--color-bg`; o que separa as seções é o
  respiro, não um `border-t` no topo de cada uma. `--color-surface` aparece uma
  vez só, em "Os assuntos".

## Identidade preto/prata (decidido em 24/09/2026, com o Rodrigo)

A variante "Contemporânea clara" original (fundo off-white, laranja como único
destaque) saiu de cena a pedido do Rodrigo — laranja fora, "luxo, sofisticação,
design automotivo" no lugar. Essa troca teve duas leituras no mesmo dia:

1. Uma primeira tentativa foi para um **tema escuro** (fundo preto, texto
   claro, prata como detalhe) — chegou a ir ao ar em produção.
2. O Rodrigo então rodou a mesma referência pelo Claude Design, que devolveu
   um mockup **claro** (fundo off-white, cartões cinza-prata, só a faixa de CTA
   final em preto) e pediu para aplicar essa leitura no lugar da escura — a
   que vale hoje.

A troca é só de tokens em `app/globals.css` (e os handful de pontos onde um
token de texto precisa saber se o fundo por baixo é claro ou escuro);
estrutura, copy, layout, animações e a lógica de cada seção não mudaram. O
mockup do Claude Design também trazia um gradiente sutil próprio por seção e
um "cartão vencedor" preto na comparação de "A virada de chave" — isso ficou
de fora de propósito: contradiz a regra de "sem listras" (§Ritmo da página) e
o design system de tokens únicos deste projeto, então a troca ficou só na cor.

**O que ficou de fora da troca, de propósito.** Logo, ícone da aba e imagem de
compartilhamento continuam laranja — estavam na lista de "preservar" do
Rodrigo, e o logo (`public/img/logo-otavio.png`) já é transparente, então o
laranja da marca lê bem tanto sobre o header claro quanto sobre um eventual
fundo escuro. Não é inconsistência: é a única cor que continua sendo a marca,
e todo o resto da página é neutro ao redor dela.

**`--color-ink` mantém o papel duplo original.** É o texto por cima do fundo
claro da página E o preto das três seções de impacto que usam `bg-ink`
(Footer, FaixaViagem, CTAFinal) — os dois papéis coexistem sem colisão porque
a página é majoritariamente clara, do jeito que o design original já previa.
Isso só quebra se a página virar majoritariamente escura de novo (foi
exatamente o que aconteceu na tentativa 1) — nesse caso `--color-accent-strong`
precisa virar claro, porque passa a ser a cor de texto/ícone direto sobre o
fundo da página, e todo botão preenchido com ele por baixo precisa trocar o
texto de `--color-ink-inverse` para `--color-ink`. Ver a nota no topo de
`app/globals.css` e em `components/ui/WhatsAppLink.tsx` antes de mexer nisso.

## Regras de código

- Nenhuma cor literal em componente. Só tokens de `@theme` em `app/globals.css`.
- Nenhuma string de conteúdo em componente. Tudo em `content/`.
- `<Dado>` é o único caminho de renderização de campo `Talvez<T>`.
- Animação de interação entre 150ms e 250ms, sempre honrando
  `prefers-reduced-motion`. A hero tem exceção declarada acima.
- `next/image` em toda imagem; `priority` só no hero.
- Verificação antes de qualquer commit: `npx vitest run && npm run lint && npm run build`.
