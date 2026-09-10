# Prompt — Landing page base do Otávio Milhas

> Cole este arquivo inteiro no Claude Code, dentro da pasta `otavio-milhas`.
> Ele monta a **primeira base** da landing. O ajuste fino vem depois, em prompts curtos.

---

## O que eu quero

Construir do zero uma landing page **profissional** para o **Otávio Milhas**
(`otaviomilhas.com.br`, Instagram `@otaviomilhasbr`), um criador que ensina
pessoas a **acumular milhas aéreas e viajar mais gastando menos**. A página que
ele tem hoje é uma one-page de WordPress extremamente simples (logo + três frases
+ três botões de WhatsApp). Quero substituí-la por uma landing de nível
profissional, com identidade visual própria, estrutura de conversão real e copy
consistente com o jeito dele de falar.

Esta rodada entrega a **base**: estrutura + copy + página codada e no ar em
preview. Sem inventar informação que eu não confirmei — o que faltar entra como
marcador visível para eu preencher depois.

## Use as skills instaladas, nesta ordem

1. **`superpowers:brainstorming`** — rodar rápido comigo antes de qualquer código,
   só para fechar posicionamento, oferta desta página e variante visual.
2. **`landing-premium:briefing-cliente`** — gerar `brief.md`. Já parto com muita
   informação coletada abaixo; use-a e **só me pergunte as lacunas reais**
   (`AskUserQuestion`, blocos de 2–4 perguntas).
3. **`landing-premium:estrutura-e-copy`** — wireframe de seções + `copy.md`
   completo em português, no tom do Otávio, antes de escrever código.
4. **`landing-premium:construir-landing`** + **`frontend-design:frontend-design`**
   — projeto Next.js App Router + Tailwind, tokens da marca, seção por seção.
5. **`landing-premium:revisao-e-entrega`** — auditoria de SEO, performance,
   responsividade e acessibilidade; publicar preview na Vercel.
6. Ao terminar, gerar **`copy.md`, `brief.md`, `PLANO.md`** versionados e me listar
   todos os marcadores de conteúdo pendente.

Antes de responder qualquer coisa, invoque `superpowers:using-superpowers` e as
skills acima. Não pule o brainstorming.

---

## Informação já coletada (do site atual + logo)

**Não consegui acessar o Instagram `@otaviomilhasbr`** (exige login). No
brainstorming, me peça prints do perfil, dos destaques e de 5–10 posts recentes,
ou tente novamente com as ferramentas de web. Não invente nada do Instagram.

### Negócio e oferta
- **Nome público:** "Otávio Milhas". Primeiro nome: **Otávio**. Sobrenome / nome
  completo: **a confirmar**.
- **Localização:** DDD 31 → Belo Horizonte/MG. Cidade exata: **a confirmar**.
- **O que vende nesta página:** um **curso exclusivo** de milhas aéreas —
  "como acumular e usar milhas para viajar pelo Brasil e pelo mundo com mais
  economia e praticidade". Não é consultoria de emissão de passagens.
  Formato, duração, módulos, plataforma, preço, garantia: **tudo a confirmar**.
- **História (dita por ele, no site):** "Desde 2021, venho mergulhando no
  fascinante universo das milhas aéreas e essa jornada me levou a conhecer na
  prática países incríveis. Ao longo desse caminho, tive a oportunidade de
  negociar mais de 5 milhões de milhas de forma estratégica, otimizando minhas
  viagens, garantindo que cada destino fosse ainda mais acessível e, acima de
  tudo, inesquecível."
- **Promessa central:** "transformar suas compras e gastos do dia a dia em
  viagens inesquecíveis pelo mundo"; "viajar mais, gastando menos"; "aprenda com
  quem já percorreu vários países sem gastar uma fortuna em passagens aéreas".

### Copy existente (verbatim — reaproveitar e expandir, não jogar fora)
- Headline: "Aprenda as melhores estratégias para acumular milhas, viajar mais,
  gastando menos."
- Sub: "Aprenda com quem já percorreu vários países sem gastar uma fortuna em
  passagens aéreas."
- Bloco: "Você sabia que pode transformar suas compras e gastos do dia a dia em
  viagens inesquecíveis pelo mundo? Milhões de pessoas pagam caro por passagens
  aéreas, enquanto outras aproveitam o poder das milhas para explorar novos
  destinos com muito mais economia."
- "Quem sou?" → parágrafo da história acima.
- Fechamento: "Está pronto para começar sua jornada pelo mundo usando milhas?
  Não perca mais tempo e dinheiro. Inscreva-se no meu curso exclusivo..."
- **CTA único, repetido:** "Quero Aprender a Viajar com Milhas Agora!"
- Rodapé: "© Otavio Milhas 2024. ALL RIGHTS RESERVED." + Política de Privacidade
  + Termos de Uso.

### Objetivo de conversão
- **Ação principal:** conversa no **WhatsApp** — `+55 31 99961-8080`
  (`https://wa.me/5531999618080`), com mensagem pré-preenchida
  ("Oi Otávio! Quero aprender a viajar com milhas — me conta como funciona o
  curso."). Confirmar comigo se há checkout/página de vendas do curso; se não
  houver, o WhatsApp é o destino.
- **Ação secundária:** seguir `@otaviomilhasbr` no Instagram.

### Tom de voz (seguir na copy nova)
Conversacional, direto, aspiracional e motivacional. Trata o leitor por **"você"**.
Usa perguntas retóricas para abrir seções ("Você sabia que...?", "Está pronto
para...?"). Fala de **economia, acesso e liberdade de viajar**, não de luxo.
Entusiasmo com moderação — pode usar "!", mas sem virar anúncio gritado, sem
CAPS LOCK, sem emoji em excesso, sem promessa irreal ("viaje de graça"). Prova
pela experiência pessoal ("aprenda com quem já fez").

### Identidade visual (extraída do logo atual)
- **Logo:** a palavra "Otavio" em **script manuscrito** laranja, com um
  **aviãozinho decolando** e um rastro tracejado saindo do "O" final; abaixo,
  "MILHAS" em **sans-serif caixa alta com tracking largo**.
  - Colorida: `https://otaviomilhas.com.br/wp-content/uploads/2024/10/Logo_Otavio.avif`
  - Branca (p/ fundo escuro): `https://otaviomilhas.com.br/wp-content/uploads/2024/10/lOGO_02.avif`
  - As duas já estão baixadas em `assets-referencia/` (`.avif` + `.png`
    convertido). Mova para `public/img/`, verifique o resultado e, se possível,
    reconstrua uma versão vetor/SVG limpa do lettering + avião.
- **Cor da marca:** laranja vibrante, amostrado do logo entre `#FF4400` e
  `#FF6600` (núcleo ~ **`#FF5A00`**).
  - ⚠️ **Contraste:** branco sobre `#FF5A00` reprova em AA para texto pequeno.
    Faça como padrão: derive um **laranja escuro legível** (algo em torno de
    `#C2410C` / `#B23C00`) para preenchimento de botão com texto branco, e use o
    `#FF5A00` puro em detalhes, ícones, bordas, hover e sobre fundo escuro.
    Centralize tudo em tokens no `globals.css`; nada de cor hardcoded.
- **Tipografia sugerida:** um display com personalidade para títulos (sem imitar o
  script do logo no corpo) + sans neutra e legível no texto. Decidir na skill de
  design.
- **Direção de arte:** viagem real — aeroportos, janela de avião, mapas, carimbos
  de passaporte, destinos — sem cair em foto de banco genérica de "casal
  pulando na praia". Marcar toda imagem provisória como tal.
- **Variante visual:** minha sugestão é **Contemporânea** adaptada (criador /
  infoproduto, com movimento e destaque saturado), provavelmente com **fundo
  claro** e o laranja como única cor de destaque. Confirmar no brainstorming.

---

## Estrutura sugerida da página (validar na skill de estrutura-e-copy)

1. **Hero** — logo + nav enxuta, headline forte no tom atual, sub, CTA de
   WhatsApp, e um selo de prova ("+5 milhões de milhas negociadas desde 2021").
   ⚠️ **Faça a hero simples e estática nesta rodada.** Ela vai ser substituída
   por uma sequência cinemática em 3D dirigida por rolagem, já especificada em
   `PROMPT-HERO-3D.md` (rodada seguinte). Não invista em efeito de hero agora, e
   deixe a seção isolada num componente próprio, fácil de trocar inteiro.
2. **A virada de chave** — o bloco "milhões pagam caro / outros usam milhas":
   contraste entre quem paga passagem cheia e quem viaja com milhas.
3. **O que você vai aprender** — 4 a 6 pilares do método (acumular no dia a dia,
   cartões e programas, transferências bonificadas, emissão inteligente, classe
   executiva, evitar erros caros). **Conteúdo exato a confirmar com o Otávio.**
4. **Quem é o Otávio** — a história pessoal (verbatim como base) + foto real
   (**a coletar**) + números de credibilidade.
5. **Para quem é / não é** — qualifica o lead antes do WhatsApp.
6. **Prova social** — depoimentos de alunos e prints de resgates/viagens
   (**a coletar** — deixar a seção desenhada e marcada como pendente).
7. **Como funciona o curso** — formato, acesso, suporte, garantia
   (**a confirmar** — marcador).
8. **FAQ** — objeções: "milhas não é só para quem gasta muito?", "funciona para
   quem está começando?", "preciso de cartão caro?", "é atualizado?", preço.
9. **CTA final** — o fechamento "Está pronto para começar sua jornada...".
10. **Rodapé** — logo branca, © Otávio Milhas, Instagram, Política de
    Privacidade, Termos de Uso, WhatsApp.

---

## Restrições técnicas

- **Stack:** Next.js 16 App Router + Tailwind v4 + framer-motion (mesmo do
  projeto `C:\Users\otica\clinica-estetica` — pode usar como referência de
  arquitetura). **Antes de codar, leia os guias em `node_modules/next/dist/docs/`**
  — esta versão do Next tem breaking changes.
- **Tokens centralizados** em `app/globals.css` (`@theme`). Papéis de cor:
  fundo, superfície, borda, texto, texto-suave, destaque, destaque-hover,
  destaque-fg. Nenhuma cor literal espalhada nos componentes.
- **Texto nunca hardcoded no componente** — tudo em `content/site.ts` (+
  `content/faq.ts`, `content/curso.ts` se fizer sentido), tipado.
- **Mecanismo de pendência visível:** reaproveite o padrão da clínica —
  `content/types.ts` (`pendente()`) e `components/ui/Placeholder.tsx` de
  `C:\Users\otica\clinica-estetica`. Todo dado não confirmado (sobrenome, cidade,
  preço, formato do curso, depoimentos, foto, e-mail, CNPJ, números de prova)
  renderiza como marcador discreto mas inequívoco — **nunca** valor inventado nem
  "Rua Exemplo, 123" / "+500 alunos".
- **WhatsApp** com mensagem pré-preenchida; botão flutuante; sem formulário de
  captura nesta base (a conversa acontece no WhatsApp), salvo se eu pedir.
- **SEO/infra:** `metadata`, `opengraph-image`, `sitemap`, `robots`, `JsonLd`
  (Person + Course), favicon a partir do avião do logo.
- **Acessibilidade AA obrigatória:** contraste de todo texto (atenção ao laranja),
  `alt` descritivo, foco visível, hierarquia de headings, `prefers-reduced-motion`.
- **Performance:** `next/image` em tudo, `priority` só no hero, fontes via
  `next/font`, animações de entrada sutis (150–250ms).
- **Deploy:** preview na Vercel. Domínio final `otaviomilhas.com.br` fica para
  depois — não configurar agora.

---

## Perguntas que provavelmente vou precisar responder (me pergunte no briefing)

- Nome completo do Otávio e cidade.
- O curso: é gravado, ao vivo, ou mentoria? Duração? Quantos módulos/aulas?
  Plataforma (Hotmart, Kiwify, área de membros própria)? Preço e forma de
  pagamento? Tem garantia? Tem bônus?
- Existe página de vendas/checkout, ou o fluxo é 100% pelo WhatsApp?
- Tenho depoimentos de alunos? Prints de resgates/viagens? Autorização de uso?
- Foto profissional do Otávio? Fotos de viagens dele?
- Números que posso afirmar (nº de alunos, países visitados, anos de experiência)?
- E-mail de contato, CNPJ (se houver), redes além do Instagram.
- Textos de Política de Privacidade e Termos — tenho, ou gero um rascunho?

---

## Entregáveis desta rodada

1. `brief.md`, `copy.md`, `PLANO.md` versionados.
2. Projeto Next.js buildando limpo, rodando em preview da Vercel.
3. Landing base com todas as seções acima, tokens da marca aplicados, marcadores
   de pendência visíveis onde faltar conteúdo.
4. `CLAUDE.md` / `AGENTS.md` do projeto com as decisões travadas (tom, laranja
   fora dos botões, variante visual, destino WhatsApp).
5. Ao final: lista do que ficou pendente de conteúdo meu e o que mudou em
   relação à página atual.
