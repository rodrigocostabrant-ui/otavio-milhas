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
3. **Variante visual: Contemporânea clara.** Fundo off-white, muito respiro,
   laranja como única cor de destaque, fotografia de viagem real e grande.
4. **`#FF5A00` (`--color-accent`) nunca carrega texto pequeno.** Branco sobre ele
   dá 2.9:1 e reprova em AA. Botão preenchido usa `--color-accent-strong`
   (`#C2410C`, 4.9:1), hover `--color-accent-hover`. O laranja puro vive em
   traço, ícone, o avião, o rastro tracejado e sobre `bg-ink`.
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

## Ritmo da página (mesma conversa)

- **No máximo 3 rótulos de seção na página inteira.** Hoje: o selo da hero,
  "Quem vai te ensinar" e "Quem já viajou com isso". Eram sete, um por seção, e
  sete etiquetas iguais em caixa alta laranja produzem ritmo de template.
- **Três degraus de título, não um.** `titulo-ancora` para as seções que
  carregam o argumento, `titulo-secao` para as que detalham, e o `<h1>` acima
  das duas. Antes todo `<h2>` usava o mesmo tamanho, e oito seções do mesmo
  tamanho não têm hierarquia.
- **Sem listras.** A página roda sobre `--color-bg`; o que separa as seções é o
  respiro, não um `border-t` no topo de cada uma. `--color-surface` aparece uma
  vez só, em "Os assuntos".

## Regras de código

- Nenhuma cor literal em componente. Só tokens de `@theme` em `app/globals.css`.
- Nenhuma string de conteúdo em componente. Tudo em `content/`.
- `<Dado>` é o único caminho de renderização de campo `Talvez<T>`.
- Animação de interação entre 150ms e 250ms, sempre honrando
  `prefers-reduced-motion`. A hero tem exceção declarada acima.
- `next/image` em toda imagem; `priority` só no hero.
- Verificação antes de qualquer commit: `npx vitest run && npm run lint && npm run build`.
