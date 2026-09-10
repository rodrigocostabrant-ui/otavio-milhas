# Prompt — Hero cinemática: o voo dirigido por rolagem

> Cole este arquivo inteiro numa sessão nova do Claude Code, na raiz do repo.
> Você não tem memória da conversa que fechou este design — está tudo aqui.

---

## O que é

A pessoa chega e a tela está **limpa**. Off-white, vazia, sem hero, sem
imagem, sem texto. Um respiro.

Ela começa a rolar e uma **grande angular abre no centro** — uma fresta que
cresce em altura e largura até o vídeo ocupar a tela inteira, sangrando de
borda a borda. A partir daí **o scroll é o transporte do vídeo**: rolar para
baixo faz o avião taxiar, girar, decolar, subir entre as nuvens, virar a vista
da janela e finalmente se afastar acima do tapete de nuvens. Parar de rolar
para o voo no lugar.

Ao longo desses quadros, os textos da hero entram **um por beat** — o `<h1>`
sobre a decolagem, o subtítulo na subida, o selo na janela, o CTA do WhatsApp
antes da metade e ficando até o fim.

No último trecho, o branco das nuvens **desbota no off-white da página** e a
próxima seção emerge desse mesmo branco. O header, que estava invisível sobre
o vídeo, materializa junto.

**A hero não é um quadrado cortado dentro da página.** Não tem borda dura,
não tem cartão, não tem moldura. Ela sangra, e sai de cena virando o fundo do
site.

---

## Isto substitui os prompts anteriores. Leia com atenção.

O repo tem três arquivos que **contradizem** este. Todos estão superados:

| Arquivo | O que dizia | Status |
|---|---|---|
| `PROMPT-HERO-3D.md` | Cena 3D em React Three Fiber, câmera atravessando cinco beats | **Superado.** A tentativa foi feita (commit `e709df9`), revertida (`7fb792a`), refeita e recalibrada — e não convenceu. Abandonada. |
| `PROMPT-RETOMAR-HERO-3D.md` | Retomar a hero 3D com o vídeo como referência de calibragem | **Superado** pelo mesmo motivo. |
| `PROMPT-HERO-VIDEO-SCROLL.md` | Vídeo em loop no lugar da foto + ícone de scroll | **Superado.** Era a versão simples; o Rodrigo pediu a versão cinematográfica, que é esta. |

⚠️ **O `PROMPT-HERO-3D.md` diz textualmente que scrub de vídeo "já foi
considerado e descartado — 30-80MB de asset e trava no Safari iOS".** Aquela
objeção era contra fazer `currentTime` scrubbing num `<video>` grande, e
continua correta contra *aquela* técnica. **Não é o que este prompt manda
fazer** — leia a seção "A técnica" antes de achar que há contradição. O
material agora existe (um clipe real de 10s, 4.5MB), o orçamento é controlado
e a técnica é outra.

Não apague esses arquivos por conta própria. Se quiser limpar, pergunte ao
Rodrigo.

---

## Antes de escrever código

**Invoque as skills disponíveis na sua sessão.** No mínimo, e nesta ordem de
utilidade:

- `frontend-design:frontend-design` — a direção visual da sequência, o ritmo,
  a tipografia sobre imagem em movimento. Esta hero vive ou morre pela
  execução visual; não improvise.
- `landing-premium:construir-landing` — a integração com o design system e a
  biblioteca de seções deste plugin.
- `superpowers:test-driven-development` — a matemática dos beats é pura e
  testável (ver "Testes"). Escreva o teste antes.
- `superpowers:verification-before-completion` — antes de dizer que terminou.
- A skill de rodar o app (`run`, se estiver na sua lista) — **você precisa
  abrir isso num navegador e olhar.** Uma hero cinematográfica não se verifica
  por `npm run build`.

Do conjunto `design-skills` (instalado em `~/.claude/skills/design-skills/`,
carrega como `design-skills@skills-dir`), duas se aplicam direto aqui:

- **`qa-build-against-source-design`** — use como **portão bloqueante antes de
  entregar**. Esta hero tem um alvo visual de origem literal: os quadros do
  vídeo. A skill cobre comparação lado a lado e severidade P0–P3. É a
  verificação que falta quando se olha só o build.
- **`implement-mockup-image-as-code`** — o alvo visual aqui é imagem
  específica (os quadros), não exploração aberta de design. Vale para a
  disciplina de medir a referência antes de construir.

`design-lead-gen-landing-page` é sobre construir uma landing do zero — a
página aqui já existe e tem decisões travadas no `AGENTS.md`. Leia se quiser,
mas não a use para reabrir estrutura ou copy.

**A lista de skills desta sessão pode ser maior do que a de quando este
arquivo foi escrito** — o Rodrigo está adicionando mais. Leia a sua lista e
use o que fizer sentido; não trate a lista acima como fechada.

**Use context7** para a documentação atual de Next 16 / React 19 antes de
escrever qualquer hook. Não escreva de memória.

**Antes de tocar em qualquer arquivo, rode `git status`.** A árvore
provavelmente está suja com a tentativa 3D abandonada (`components/hero3d/`,
`app/prototipo-hero/`, `content/hero3d.ts`, dependências `three`/`fiber`/`drei`
em `package.json`). **Não descarte isso sozinho.** Pergunte ao Rodrigo se
quer `git stash -u` antes de começar (reversível) ou se prefere manter. Se
mantiver, o `/prototipo-hero` continua isolado e não atrapalha — só não
misture os dois caminhos.

---

## A técnica: sequência de quadros em canvas

**Não use `<video>` com `currentTime` dirigido por scroll.** Para o seek ser
fluido o arquivo precisa ser codificado com todo quadro sendo keyframe
(`-g 1`), o que triplica o tamanho, e mesmo assim o Safari do iOS engasga —
`seeking` é assíncrono, não garante quadro entregue, e o resultado treme.

**Não use vídeo tocando com `playbackRate` ajustado pelo scroll.** Desacopla o
quadro da posição da rolagem, e o pedido é explícito: a animação acompanha a
rolagem, não corre atrás dela.

**Faça assim:** extraia o vídeo como uma **sequência de imagens**, pré-carregue
e desenhe o quadro correspondente a `t` num `<canvas>` a cada frame de
animação. É a técnica das páginas de produto da Apple. É determinística,
idêntica em todo navegador, e o "seek" é um índice de array.

O custo é banda, e é por isso que a seção de orçamento abaixo não é opcional.

---

## Referência de estilo: aviao-abacus.vercel.app

O Rodrigo pediu para usar esse site como inspiração de animação e estilo de
scroll. Eu abri e inspecionei: é um clone funcional da Azul Linhas Aéreas
(feito com a ferramenta Abacus) — usa a marca, a cor e a tag "Viajar é ser
feliz" reais da Azul, e um widget de busca de voo real. **Nada disso
atravessa para o nosso site** — nem a cor, nem a tag, nem o widget de busca
(sem formulário é decisão travada), nem qualquer texto de lá. O que vale, e o
que este site realmente ensina, é a mecânica de scroll e o tratamento
cinematográfico — isso sim, replique com conteúdo nosso.

O que adotar:

- **Vídeo scrubado por scroll com alvo suavizado, e só reposiciona o quadro
  quando a diferença passa de um limiar pequeno** — evita chamadas de seek
  redundantes a cada frame de animação. É o mesmo princípio do nosso
  `tSuave = lerp(...)`, só que eles aplicam a `currentTime` de um `<video>`.
  Confirma que a técnica funciona quando bem implementada — **mas não muda
  nossa escolha de canvas + sequência de quadros**: medi o vídeo principal
  deles e pesa **30,7MB**. É o número exato que o `PROMPT-HERO-3D.md` já
  citava como motivo para descartar essa técnica. Adote só o princípio
  (suavização + limiar antes de redesenhar), aplicado ao índice do quadro no
  canvas, não ao vídeo.
- **Sistema de frases por faixa de `t`**, cada uma entrando e saindo por
  opacidade + leve `translateY`, sempre uma de cada vez, sem sobreposição
  confusa. É o mesmo tratamento já especificado em "Texto sobre imagem em
  movimento" — a referência só confirma que é o caminho certo.
- **Legibilidade em três camadas**, não um scrim único chapado: uma barra de
  gradiente leve colada no topo, uma mais forte colada na base (onde o texto
  mora), e uma vinheta radial sutil por cima da cena inteira. Use esse padrão
  de três camadas em vez de só um gradiente vertical simples.
- **Indicador de "continue rolando" ancorado na base**, visível só nos
  primeiros beats — isso não está no resto deste prompt e devia estar.
  Adicione: texto curto (`content/site.ts`) + seta ou ícone, visível enquanto
  `t < 0.10` (antes da abertura terminar) e escondido depois — quem já está
  rolando não precisa mais do aviso.
- **Feedback de carregamento com barra de progresso** enquanto o material
  pesado não chegou, em vez de só o pôster parado. Aplique isso durante a
  primeira passada de quadros (a esparsa, ~15 imagens) — uma barra simples
  sobre o pôster já resolve.

O que **não** trazer, mesmo parecendo só uma ideia de layout:

- **Nenhum card com dado que a gente não tem.** Eles têm um card de vidro
  "Próxima decolagem, ao vivo" — dado real de voo, existe porque é uma
  companhia aérea de verdade. Se quiser um card nesse estilo (glassmorphism,
  ancorado na lateral do vídeo), ele só pode mostrar dado real que já existe
  em `content/site.ts` — por exemplo o selo "+5 milhões de milhas
  negociadas". Não invente um número que não temos.
- **Nenhuma UI de busca/reserva.** Eles têm abas de Voos/Hotéis/Carros e
  campos de origem/destino/data. Decisão travada do `AGENTS.md`: sem
  formulário, sem captura, WhatsApp é o único destino de conversão.
- **A segunda faixa cinematográfica no meio da página deles** (vídeo curto
  reprisado depois do conteúdo, formato mais baixo) é bonita mas é escopo
  novo, fora do que foi pedido para a hero. Não implemente por conta própria
  — se achar que a página pede um momento assim mais pra baixo, pergunte ao
  Rodrigo antes de construir.
- **Nenhuma cor, tag ou copy da Azul.** Óbvio, mas registrado: paleta vem só
  de `--color-*` em `app/globals.css`, toda string vem de `content/`.

---

## Preparar os assets

Fonte: `C:\Users\otica\Downloads\Airplane_taking_off_and_flying_20260910082328.mp4`
— 10.01s, 1280x720, 24fps, 4.54MB, com trilha de áudio (que morre aqui: não
há áudio nesta hero).

**O vídeo inteiro é usado, sem cortes.** Ele mostra a pintura e o logo reais
da easyJet. Isso foi sinalizado ao Rodrigo e ele decidiu explicitamente usar
o material como está, assumindo o risco de marca. **Decisão fechada — não
reabra, não proponha borrar, não corte trechos por esse motivo.**

Gere a sequência (12fps sobre 10.01s ≈ 120 quadros — sobra resolução temporal
para scrub, que raramente avança um quadro por frame de tela):

```bash
mkdir -p public/hero/frames
ffmpeg -i "C:\Users\otica\Downloads\Airplane_taking_off_and_flying_20260910082328.mp4" \
  -vf "fps=12,scale=960:-2" -c:v libwebp -quality 72 -compression_level 6 \
  public/hero/frames/f_%03d.webp
```

Gere também um conjunto menor para telas pequenas (`scale=640:-2`, mesmo fps,
em `public/hero/frames-640/`) e escolha em runtime por largura de viewport ×
DPR.

O pôster — o quadro estático que aparece antes da sequência carregar e que é
**a hero inteira** em modo degradado:

```bash
ffmpeg -i "<mesmo arquivo>" -ss 6.5 -frames:v 1 -q:v 2 public/hero/poster.jpg
```

`6.5s` cai na vista da janela, que é o quadro mais calmo e mais bonito parado.
Compare com `3.5s` (decolagem em perfil) e escolha com os olhos, não pelo
número.

**Meça e reporte o peso total de cada conjunto.** Se o de 960px passar de
~4MB, baixe a qualidade ou o fps antes de aceitar — não empurre para o
navegador e siga em frente.

---

## Os beats

`t` é o progresso da rolagem no trilho, de 0 a 1. `q` é o quadro exibido.

| `t` | Beat | Tela |
|---|---|---|
| `0.00–0.06` | **Vazio** | Off-white. Nada. Nem header visível, nem texto. É o respiro que faz a abertura valer. |
| `0.06–0.20` | **Grande angular** | A fresta abre do centro: altura de 0 a 100%, largura de ~55% a 100%, cantos de arredondados a retos. Quadro travado no primeiro (`q=0`, pista). |
| `0.20–0.44` | **Decolagem** | Sequência corre da pista à rotação e subida. `<h1>` entra em `t≈0.24`. |
| `0.44–0.62` | **Subida** | Nuvens. Subtítulo entra em `t≈0.47`, `<h1>` sai. **CTA do WhatsApp entra em `t≈0.45` e não sai mais.** |
| `0.62–0.78` | **Janela** | POV da janela sobre as nuvens. Selo (`+5 milhões…`) entra em `t≈0.64`, subtítulo sai. |
| `0.78–0.90` | **Partida** | Afastamento acima das nuvens, céu claro. Selo sai. Só o CTA permanece. |
| `0.90–1.00` | **Dissolução** | Véu `--color-bg` sobe sobre o canvas até 1. O header materializa. A `ViradaDeChave` emerge do mesmo branco. |

Mapeamento de quadro: `q = round(faixa(t, 0.20, 0.90) × (total − 1))`, travado
em `0` antes de `0.20` e no último a partir de `0.90`. Ou seja: a abertura e a
dissolução não gastam quadro — o voo inteiro acontece entre `0.20` e `0.90`.

**Todos esses números moram num arquivo só**, `components/hero-video/beats.ts`,
nomeados por beat, como o `beats.ts` da tentativa 3D fazia. O Rodrigo vai
querer mexer neles.

Os textos vêm de `content/site.ts`, objeto `hero`, que já existe e já tem os
campos certos: `rotulo`, `headlineInicio` + `headlineDestaque`, `sub`, `cta`,
`seloNumero`, `seloTexto`, `seloDesde`. **Não escreva string de conteúdo em
componente** — é regra do `AGENTS.md`.

---

## Arquitetura

```
<section style={{ height: 'var(--trilho-hero)' }}>   ← trilho de rolagem
  <div className="sticky top-0 h-[100svh]">          ← o que fica na tela
    <Sequencia />        ← canvas + carregador de quadros
    <Veu />              ← off-white que sobe na dissolução
    <CamadaDeTexto />    ← DOM por cima, sempre no DOM
  </div>
</section>
```

`t = clamp((scrollY − topoDaSecao) / (alturaDaSecao − alturaDaViewport), 0, 1)`

- **Calcule `t` uma única vez**, num contexto/store, e deixe canvas, texto e
  véu lerem a mesma fonte. Não crie três listeners de scroll.
- **Amorteça**: `tSuave = lerp(tSuave, tCru, 0.16)` dentro do `rAF`. Rolagem
  crua é trêmula. Mantenha o `rAF` vivo até `|tSuave − tCru| < 0.0005`.
- **Use `100svh`, não `100vh`** — barra de endereço de celular quebra `vh`.
- **Pause o `rAF` quando o trilho sai da viewport** (IntersectionObserver).
  Não queime bateria desenhando enquanto a pessoa lê o FAQ.
- **Nunca sequestre a rolagem.** Sem `preventDefault` em `wheel`, sem snap
  entre beats. O sticky solta limpo nas duas pontas.

`--trilho-hero` **já existe** em `app/globals.css` (240svh no celular, 380svh
a partir de 768px) — sobrou da tentativa 3D. Reaproveite; se aquele bloco tiver
sido removido pelo stash, recrie igual.

Arquivos sugeridos (`components/hero-video/`): `HeroVideo.tsx` (orquestra),
`Sequencia.tsx` (canvas + carregamento), `CamadaDeTexto.tsx`, `Abertura.tsx`
(a máscara), `beats.ts` (toda a calibragem), `progresso.tsx` (driver único),
`useCapacidade.ts` (detecção de degradação), `PosterHero.tsx` (estático).
Cada um com um propósito só; se um arquivo crescer demais, ele está fazendo
duas coisas.

O canvas é montado em import dinâmico com `ssr: false`, dentro de `<Suspense>`
com o pôster como fallback.

---

## Como ela se mescla com a página

Isto é o coração do pedido. "Não quero que seja só um quadrado cortado na
hero."

1. **Sangra.** O canvas ocupa `100vw × 100svh`, fora do `max-w-6xl` que rege o
   resto da página. Sem `rounded-*`, sem borda, sem sombra, sem container.
2. **A borda de baixo nunca é dura.** Aplique uma máscara permanente no
   canvas: `mask-image: linear-gradient(to bottom, black 0 78%, transparent
   100%)`. O vídeo desvanece no fundo em vez de terminar numa linha.
3. **A saída é por luminância, não por geometria.** Nada de a máscara fechar
   de volta num cartão. O último beat é o véu `--color-bg` subindo de 0 a 1
   sobre um quadro que já é céu claro e nuvem branca — o branco do vídeo vira
   o off-white do site sem costura visível.
4. **O header entra junto.** Hoje ele é `sticky top-0 z-30` com fundo
   `bg-bg/85 backdrop-blur-md` e o logo escuro — ou seja, ele apareceria por
   cima do vídeo desde o primeiro pixel e mataria a "abertura limpa". Faça o
   `HeroVideo` marcar `document.documentElement.dataset.heroImersivo` enquanto
   `t < 0.88`, e trate a aparência no `globals.css` sob esse atributo: header
   sem fundo, sem borda, e com o logo branco. **`public/img/logo-otavio-branco.png`
   já existe no repo** — é exatamente para isso. Renderize os dois logos e
   troque a opacidade; não faça `src` condicional.
5. **A transição entra na próxima seção.** A `ViradaDeChave` (seção seguinte,
   em `app/page.tsx`) deve começar sem uma quebra brusca — dê a ela um respiro
   maior no topo, ou uma entrada suave, para que emergir do branco pareça
   intencional.

---

## Texto sobre imagem em movimento

- **Todo texto vive no DOM**, sempre, nunca dentro do canvas. Leitor de tela
  precisa receber as quatro blocos independente de scroll ou de canvas ter
  carregado. `t` dirige **só** opacidade e `translateY` — nunca montagem e
  desmontagem.
- **Um `<h1>` só na página inteira.** É o da hero. Os outros blocos são `<p>`.
- **Escurecimento sob o texto é obrigatório.** Branco sobre céu claro reprova
  em AA. Use um scrim — gradiente de `--color-ink` com opacidade, ancorado
  atrás do bloco de texto, não uma camada chapada sobre a tela inteira.
  Meça o contraste real do resultado; não confie no olho.
- **O laranja pode aparecer aqui.** `#FF5A00` (`--color-accent`) sobre o scrim
  escuro dá ~5:1, passa em AA para texto grande — e a regra do `AGENTS.md` diz
  que o laranja puro vive "em traço, ícone, o avião… e sobre fundo escuro".
  O `headlineDestaque` continua laranja. **Botão preenchido continua usando
  `--color-accent-strong`**, sem exceção.
- Sobreposição curta entre um texto e o seguinte — a tela nunca fica
  completamente sem texto no meio da sequência.

---

## Armadilhas específicas deste repo

Três coisas que vão te morder se você não souber antes:

1. **`#hero-cta` não pode sair do DOM.** `components/ui/BotaoFlutuante.tsx`
   faz `document.getElementById("hero-cta")` **uma vez, na montagem**, e se
   não achar, desiste em silêncio (`if (!alvo) return`). Se você renderizar o
   CTA condicionalmente a partir de `t ≥ 0.45`, o botão flutuante do WhatsApp
   nunca mais aparece na página inteira. O `id="hero-cta"` fica montado desde
   o primeiro render; só a opacidade muda.

2. **`NEXT_PUBLIC_PROTOTIPO=false npm run build` não passa hoje, e não é culpa
   sua.** Há 13 campos `pendente()` espalhados em `content/site.ts` (e-mail,
   CNPJ, depoimentos, política, termos…). A trava é proposital. Verifique com
   `npm run build` normal; o que você precisa garantir é que **a hero deixou
   de contribuir com um marcador** — hoje `hero.foto` é `pendente()` e some
   quando o vídeo real entrar.

3. **`html` tem `scroll-behavior: smooth`.** Cliques em âncora (o header tem
   várias) disparam rolagem animada que vai atravessar o trilho da hero.
   Confira que o `t` amortecido não fica esquisito nesse trajeto, e que
   `scroll-padding-top: 5rem` continua fazendo sentido com o header
   invisível no topo.

Bônus: `app/globals.css` já zera `animation-duration` e `transition-duration`
globalmente sob `prefers-reduced-motion` (linha ~68). Animação em CSS herda
isso de graça — mas **animação dirigida por JS não**, e a sua é. Trate
explicitamente (próxima seção).

---

## Degradação — obrigatório, não é enfeite

Nesta ordem, e cada uma testada de verdade:

1. **`prefers-reduced-motion: reduce`** → hero estática: o pôster, altura de
   tela normal, **todos os textos visíveis ao mesmo tempo**, sem trilho, sem
   sticky, sem canvas. Desligamento honesto, não versão lenta.
2. **Sem JS** → o mesmo estático, renderizado no servidor.
3. **`navigator.connection.saveData`, ou `effectiveType` 2g/slow-2g** → o
   mesmo estático. Não baixe 4MB de quadros para quem pediu economia.
4. **Quadros ainda carregando** → pôster no lugar do canvas; o trilho só passa
   a valer quando a passada grossa estiver pronta.
5. **Falha ao decodificar** → cai no estático e não tenta de novo.

Carregue em duas passadas: primeiro um em cada oito quadros (~15 imagens, uns
500KB) — já dá para scrubar de forma grossa — depois o resto preenchendo os
buracos. Desenhe sempre o quadro carregado mais próximo do alvo.

---

## Orçamento

- Sequência 960px: **alvo ≤ 4MB**, ~120 quadros. Reporte o número real.
- Sequência 640px para telas pequenas, escolhida por viewport × DPR.
- O pôster é o elemento de LCP: sirva por `next/image` com `priority`.
- Canvas com DPR limitado a `[1, 2]`.
- `rAF` só com o trilho visível.
- Nada de biblioteca de animação nova. Sem GSAP, sem Lenis, sem Framer Motion
  para isto — é um `rAF`, um `lerp` e um `drawImage`. Se você se pegar
  instalando dependência para esta hero, parou no lugar errado.

---

## Testes

A matemática é pura e não precisa de navegador. Escreva o teste antes
(`vitest` já está configurado; veja `content/types.test.ts` como forma):

- `progresso(scrollY, topo, altura, viewport) → t` — travado em 0 e 1 nas
  pontas, monotônico no meio.
- `quadroPara(t, total) → índice` — `0` antes da abertura terminar, último a
  partir da dissolução, nunca fora do intervalo.
- `janelaDeTexto(t, entrada, saida) → opacidade` — 0 fora, 1 no miolo,
  transição nas bordas; e a garantia de que **nunca existe `t` em que todos os
  blocos estão em 0** entre `0.24` e `0.90`.

Esse último teste é o que protege o pedido "e assim sucessivamente os próximos
textos" de virar um buraco visual.

---

## Verificação antes de dizer que terminou

- `npx vitest run && npm run lint && npm run build` — os três, verdes.
- **Abra no navegador e role.** Desktop e uma viewport de celular.
  Uma hero cinematográfica não se verifica por log de build.
- Confira, com os olhos: a abertura realmente começa vazia; a grande angular
  abre sem pulo; os textos entram na ordem e nenhum trecho fica sem texto; o
  final dissolve no off-white sem borda visível; o header materializa junto.
- Ligue `prefers-reduced-motion` no sistema e recarregue. Depois desligue o
  JS. Depois simule "Slow 3G" no devtools.
- Confirme que o botão flutuante do WhatsApp aparece depois da hero (é o teste
  de que você não quebrou o `#hero-cta`).

---

## Me diga no fim

1. Peso real de cada conjunto de quadros e quantos quadros ficaram.
2. Qual beat foi mais difícil de calibrar e **quais constantes** (arquivo +
   nome) o Rodrigo deve mexer para ajustar ritmo, abertura e entrada de texto.
3. Como ficou o contraste medido do texto sobre o vídeo, por bloco.
4. O que o `prefers-reduced-motion` mostra hoje, e o que aparece sem JS.
5. Quanto a hero pesou no bundle, separado do resto da página.
6. O que você tentou e não funcionou — especialmente na dissolução final, que
   é a parte que mais facilmente fica com cara de "quadrado cortado".

Se quiser subir um preview para o Rodrigo abrir no celular, há MCP da Vercel
disponível — mas **pergunte antes de publicar qualquer coisa**, mesmo preview.
