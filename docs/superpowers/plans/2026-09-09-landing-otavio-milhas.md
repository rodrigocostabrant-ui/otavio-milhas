# Landing Otávio Milhas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a one-page de WordPress do Otávio Milhas por uma landing profissional em Next.js, com sistema visual próprio derivado do logo, copy no tom dele e conversão única no WhatsApp.

**Architecture:** Next.js 16 App Router com uma única rota (`/`) composta de nove seções server-rendered. Todo conteúdo mora tipado em `content/`, nunca em componente. Todo dado não confirmado é representado por `Pendente` e só pode ser renderizado por `<Dado>`/`<Placeholder>`, que quebram o build em modo produção — é impossível um valor inventado ir ao ar. Cores só existem como tokens de papel em `@theme`.

**Tech Stack:** Next.js 16.3.4, React 19.2, Tailwind v4, framer-motion 13, TypeScript 5, Vitest (só para a lógica de pendência).

**Spec:** `docs/superpowers/specs/2026-09-09-landing-otavio-milhas-design.md`

## Global Constraints

Copiadas verbatim da spec. Valem para toda task.

- A palavra **"curso"** não aparece em nenhum texto visível da página. Vocabulário: "eu te ensino / te acompanho".
- WhatsApp é o **único** destino de conversão: `https://wa.me/5531999618080`. Sem formulário, sem captura de e-mail, sem checkout.
- `#FF5A00` **nunca** carrega texto pequeno. Todo botão preenchido com texto branco usa `--color-accent-strong` (`#C2410C`), hover `#9A3412`.
- Nenhuma cor literal em componente. Só tokens de `@theme`.
- Nenhuma string de conteúdo em componente. Tudo em `content/`.
- Zero conteúdo inventado. O que falta vira `pendente()` e renderiza como marcador visível.
- Toda animação entre 150ms e 250ms e honra `prefers-reduced-motion`.
- Contraste AA em todo texto; `alt` descritivo; foco visível; headings sem salto.
- `next/image` em toda imagem; `priority` só no hero; fontes via `next/font`.
- Antes de escrever qualquer código, ler os guias em `node_modules/next/dist/docs/`. Esta versão do Next tem breaking changes.
- Deploy: preview na Vercel. **Não** configurar o domínio `otaviomilhas.com.br`.

### Nota sobre verificação

Uma landing estática não tem lógica de negócio para TDD clássico. O plano aplica testes automatizados onde existe invariante real — o mecanismo de pendência (`content/types.ts` + a trava de build do `Placeholder`), que é a garantia central do projeto. As demais tasks são verificadas por `npx tsc --noEmit`, `npm run lint`, `npm run build` e checagem visual documentada. Cada task termina em deliverable testável e em um commit.

---

### Task 1: Brief do cliente

**Files:**
- Create: `brief.md`

**Interfaces:**
- Consumes: a spec.
- Produces: `brief.md` — documento de referência para a copy. Nenhum código depende dele.

- [ ] **Step 1: Invocar a skill `landing-premium:briefing-cliente`**

Usar as respostas já dadas nesta sessão. Não repetir perguntas já respondidas: posicionamento (sem produto "curso"), conversão (WhatsApp único), variante visual (clara contemporânea), temas sem virar ementa, "Como começa" em 3 passos, fotos de viagem reais a fornecer.

- [ ] **Step 2: Escrever `brief.md`**

Seções: negócio, público, oferta, promessa, tom de voz, fatos confirmados (com fonte de cada um), concorrência do nicho, objetivo de conversão, restrições, e a lista de pendências de conteúdo da spec §7.

Regra: cada afirmação factual traz a fonte entre parênteses — `(site atual)`, `(Instagram, set/2026)`, `(cliente, 2026-09-09)`. Afirmação sem fonte não entra.

- [ ] **Step 3: Commit**

```bash
git add brief.md
git commit -m "docs: brief do cliente"
```

---

### Task 2: Estrutura e copy

**Files:**
- Create: `copy.md`

**Interfaces:**
- Consumes: `brief.md`, a spec §3 (copy verbatim) e §4 (espinha narrativa).
- Produces: `copy.md` com o texto final de cada seção, identificado por chave. As chaves viram exatamente os campos de `content/site.ts` na Task 5: `hero`, `virada`, `otavio`, `temas`, `comeca`, `paraQuem`, `provas`, `faq`, `ctaFinal`, `rodape`.

- [ ] **Step 1: Invocar a skill `landing-premium:estrutura-e-copy`**

- [ ] **Step 2: Escrever o wireframe de seções**

Nove seções na ordem da spec §4, cada uma com: objetivo, o que o leitor pensa ao chegar nela, e o que ela precisa provar.

- [ ] **Step 3: Escrever a copy completa em português**

Regras: "você"; pergunta retórica para abrir seção; economia/acesso/liberdade e nunca luxo; sem CAPS LOCK; sem promessa irreal; a palavra "curso" não aparece.

Reaproveitar verbatim (spec §3): headline, sub, bloco da virada de chave, parágrafo "Desde 2021…", e "Está pronto para começar sua jornada pelo mundo usando milhas?".

Marcar explicitamente com `[PENDENTE: …]` todo trecho que dependa de dado não confirmado.

- [ ] **Step 4: Commit**

```bash
git add copy.md
git commit -m "docs: estrutura de secoes e copy final"
```

---

### Task 3: Scaffold, tokens e fontes

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`
- Reference: `C:\Users\otica\clinica-estetica` (mesmas versões e mesma configuração)

**Interfaces:**
- Produces: as variáveis CSS de `@theme` usadas por toda task de seção — `bg`, `surface`, `border`, `ink`, `ink-muted`, `accent`, `accent-strong`, `accent-hover`, `accent-soft`, `ink-inverse` — e as classes utilitárias `font-display` e `font-corpo`.

`create-next-app` não é usado: o diretório já tem `docs/` e `.md` que fazem o scaffolder abortar por conflito. Os arquivos de configuração são escritos à mão, espelhando a clínica.

- [ ] **Step 1: Ler os guias do Next**

```bash
ls node_modules/next/dist/docs/
```

Ler pelo menos o guia de App Router e o de `next/font`. Anotar qualquer breaking change que afete `layout.tsx` ou `metadata`.

(Executar depois do `npm install` do Step 3; voltar aqui antes de escrever qualquer componente.)

- [ ] **Step 2: Escrever `package.json`**

```json
{
  "name": "otavio-milhas",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  },
  "dependencies": {
    "framer-motion": "^13.2.0",
    "next": "16.3.4",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.4",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^3"
  }
}
```

- [ ] **Step 3: Instalar**

```bash
npm install
```

Esperado: sem erro de peer dependency.

- [ ] **Step 4: Copiar as configurações da clínica**

`tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` são copiados de `C:\Users\otica\clinica-estetica` sem alteração, exceto o `name` já definido no `package.json`.

- [ ] **Step 5: Escrever `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #FAF8F5;
  --color-surface: #FFFFFF;
  --color-border: #E7E1D9;
  --color-ink: #1C1B1A;
  --color-ink-muted: #5C5750;
  --color-accent: #FF5A00;
  --color-accent-strong: #C2410C;
  --color-accent-hover: #9A3412;
  --color-accent-soft: #FFF1E8;
  --color-ink-inverse: #FFFFFF;

  --font-display: var(--fonte-display), ui-sans-serif, system-ui, sans-serif;
  --font-corpo: var(--fonte-corpo), ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  html { scroll-behavior: smooth; }
  body {
    background: var(--color-bg);
    color: var(--color-ink);
    font-family: var(--font-corpo);
    -webkit-font-smoothing: antialiased;
  }
  :focus-visible {
    outline: 2px solid var(--color-accent-strong);
    outline-offset: 3px;
    border-radius: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

/* Rótulo de seção: replica o "MILHAS" do logo. */
@utility rotulo {
  font-family: var(--font-corpo);
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}
```

- [ ] **Step 6: Escrever `app/layout.tsx` com as fontes**

```tsx
import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--fonte-display",
  display: "swap",
});

const corpo = Instrument_Sans({
  subsets: ["latin"],
  variable: "--fonte-corpo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Otávio Milhas — viaje mais, gastando menos",
  description:
    "Aprenda as melhores estratégias para acumular milhas aéreas e viajar pelo Brasil e pelo mundo com mais economia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Escrever um `app/page.tsx` mínimo e verificar o build**

```tsx
export default function Home() {
  return <main className="p-10 font-display text-4xl">Otávio Milhas</main>;
}
```

Run: `npm run build`
Expected: build limpo, sem erro de tipo e sem aviso de fonte.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next 16 com tokens da marca e fontes"
```

---

### Task 4: Mecanismo de pendência

**Files:**
- Create: `content/types.ts`, `components/ui/Placeholder.tsx`, `content/types.test.ts`, `vitest.config.ts`
- Reference: `C:\Users\otica\clinica-estetica\content\types.ts` e `components\ui\Placeholder.tsx`

**Interfaces:**
- Produces, consumido por todas as tasks seguintes:
  - `type Pendente = { readonly __pendente: true; readonly label: string; readonly motivo?: string }`
  - `type Talvez<T> = T | Pendente`
  - `pendente(label: string, motivo?: string): Pendente`
  - `isPendente(valor: unknown): valor is Pendente`
  - `const MODO_PROTOTIPO: boolean`
  - `garantirProtótipo(label: string): void` — lança quando `MODO_PROTOTIPO` é falso
  - `<Placeholder label motivo bloco tom />` com `tom: "claro" | "escuro"`
  - `<Dado valor bloco tom />` com `valor: Talvez<string>`

- [ ] **Step 1: Escrever o teste que falha**

```ts
// content/types.test.ts
import { describe, expect, it } from "vitest";
import { isPendente, pendente } from "./types";

describe("mecanismo de pendência", () => {
  it("marca um valor como pendente com rótulo e motivo", () => {
    const p = pendente("Sobrenome do Otávio", "cliente ainda não confirmou");
    expect(p.__pendente).toBe(true);
    expect(p.label).toBe("Sobrenome do Otávio");
    expect(p.motivo).toBe("cliente ainda não confirmou");
  });

  it("reconhece um valor pendente", () => {
    expect(isPendente(pendente("x"))).toBe(true);
  });

  it("não confunde string confirmada com pendência", () => {
    expect(isPendente("Belo Horizonte")).toBe(false);
    expect(isPendente(null)).toBe(false);
    expect(isPendente({ label: "quase" })).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run content/types.test.ts`
Expected: FAIL — `Cannot find module './types'`.

- [ ] **Step 3: Escrever `content/types.ts`**

Portar de `C:\Users\otica\clinica-estetica\content\types.ts` sem alterar o contrato, ajustando só os comentários para referenciarem esta spec.

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run content/types.test.ts`
Expected: PASS, 3 testes.

- [ ] **Step 5: Escrever `components/ui/Placeholder.tsx`**

Portar da clínica, trocando a paleta pelos tokens desta marca:

```tsx
const paleta: Record<Tom, { borda: string; rotulo: string; texto: string; fundo: string }> = {
  claro: {
    borda: "border-border",
    rotulo: "text-accent-strong",
    texto: "text-ink-muted",
    fundo: "bg-accent-soft/50",
  },
  escuro: {
    borda: "border-accent/40",
    rotulo: "text-accent",
    texto: "text-ink-inverse/80",
    fundo: "bg-ink/60",
  },
};
```

Manter `garantirProtótipo` exportado — o marcador de imagem da Task 6 depende dele para herdar a mesma trava de build.

- [ ] **Step 6: Verificar a trava de produção**

Run: `NEXT_PUBLIC_PROTOTIPO=false npm run build`
Expected: FAIL, com a mensagem `[modo produção] Informação pendente encontrada na página`, desde que exista ao menos um marcador na página. Nesta task ainda não existe seção; anotar e reexecutar na Task 13.

- [ ] **Step 7: Commit**

```bash
git add content/types.ts content/types.test.ts components/ui/Placeholder.tsx vitest.config.ts
git commit -m "feat: mecanismo de pendencia visivel com trava de build"
```

---

### Task 5: Conteúdo tipado

**Files:**
- Create: `content/site.ts`, `content/temas.ts`, `content/faq.ts`

**Interfaces:**
- Consumes: `copy.md` (Task 2), `Talvez`/`pendente` (Task 4).
- Produces:
  - `const whatsapp = { numero: "5531999618080", base: "https://wa.me/5531999618080" } as const`
  - `type ContextoCta = "header" | "hero" | "temas" | "comeca" | "paraQuem" | "final" | "flutuante" | "rodape"`
  - `function linkWhats(contexto: ContextoCta): string`
  - `type Foto = { src: string; alt: string; largura: number; altura: number }`
  - `const site` com os campos `marca`, `nav`, `hero`, `virada`, `otavio`, `comeca`, `paraQuem`, `provas`, `ctaFinal`, `rodape`
  - `const temas: Tema[]` onde `type Tema = { numero: string; titulo: string; texto: string }`
  - `const faq: PerguntaFaq[]` onde `type PerguntaFaq = { pergunta: string; resposta: string }`

- [ ] **Step 1: Escrever o construtor de link do WhatsApp**

```ts
// content/site.ts
export const whatsapp = {
  numero: "5531999618080",
  base: "https://wa.me/5531999618080",
} as const;

export type ContextoCta =
  | "header" | "hero" | "temas" | "comeca"
  | "paraQuem" | "final" | "flutuante" | "rodape";

const mensagens: Record<ContextoCta, string> = {
  header: "Oi Otávio! Quero entender como funciona.",
  hero: "Oi Otávio! Quero aprender a viajar com milhas — me conta como funciona.",
  temas: "Oi Otávio! Vi os temas no site e quero entender como aplicar no meu caso.",
  comeca: "Oi Otávio! Quero começar. Como funciona o primeiro passo?",
  paraQuem: "Oi Otávio! Acho que meu perfil encaixa — podemos conversar?",
  final: "Oi Otávio! Estou pronto para começar minha jornada usando milhas.",
  flutuante: "Oi Otávio! Quero aprender a viajar com milhas.",
  rodape: "Oi Otávio! Vim pelo site e quero falar com você.",
};

export function linkWhats(contexto: ContextoCta): string {
  return `${whatsapp.base}?text=${encodeURIComponent(mensagens[contexto])}`;
}
```

- [ ] **Step 2: Transcrever a copy de `copy.md` para `site.ts`**

Todo campo cuja fonte não esteja em `brief.md` como confirmada entra como `pendente()`. Obrigatoriamente pendentes nesta rodada (spec §7):

```ts
export const site = {
  marca: {
    nome: "Otávio Milhas",
    nomeCompleto: pendente("Nome completo do Otávio", "cliente ainda não informou"),
    cidade: pendente("Cidade", "sabemos apenas que o DDD é 31"),
    email: pendente("E-mail de contato"),
    cnpj: pendente("CNPJ", "confirmar se existe"),
    instagram: "https://instagram.com/otaviomilhasbr",
    instagramHandle: "@otaviomilhasbr",
  },
  // … demais campos conforme copy.md
} as const;
```

- [ ] **Step 3: Escrever `content/temas.ts` e `content/faq.ts`**

Seis temas e cinco perguntas, exatamente como redigidos em `copy.md`. Nenhum tema numerado como módulo ou aula.

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erro.

- [ ] **Step 5: Commit**

```bash
git add content/
git commit -m "feat: conteudo tipado com pendencias declaradas"
```

---

### Task 6: Primitivas de UI

**Files:**
- Create: `components/ui/Icones.tsx`, `components/ui/WhatsAppLink.tsx`, `components/ui/Reveal.tsx`, `components/ui/Imagem.tsx`, `components/ui/Rastro.tsx`

**Interfaces:**
- Consumes: `linkWhats`, `ContextoCta` (Task 5); `garantirProtótipo`, `Talvez`, `isPendente` (Task 4).
- Produces:
  - `<IconeWhatsApp className />`, `<IconeAviao className />`, `<IconeInstagram className />`, `<IconeMais className />`
  - `<WhatsAppLink contexto={ContextoCta} variante="solido" | "contorno" | "texto" children />`
  - `<Reveal delay?: number children />`
  - `<Imagem foto={Talvez<Foto>} proporcao="16/9" | "4/5" | "1/1" prioridade?: boolean />`
  - `<Rastro orientacao="horizontal" | "vertical" />`

- [ ] **Step 1: Escrever `Icones.tsx`**

SVG inline, `currentColor`, `aria-hidden="true"`, sem biblioteca externa. O avião reproduz o do logo: fuselagem inclinada subindo à direita.

- [ ] **Step 2: Escrever `WhatsAppLink.tsx`**

```tsx
import { linkWhats, type ContextoCta } from "@/content/site";
import { IconeWhatsApp } from "./Icones";

const variantes = {
  solido:
    "bg-accent-strong text-ink-inverse hover:bg-accent-hover",
  contorno:
    "border border-accent text-accent-strong hover:bg-accent-soft",
  texto: "text-accent-strong underline underline-offset-4 hover:text-accent-hover",
} as const;

export function WhatsAppLink({
  contexto,
  variante = "solido",
  children,
}: {
  contexto: ContextoCta;
  variante?: keyof typeof variantes;
  children: React.ReactNode;
}) {
  return (
    <a
      href={linkWhats(contexto)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-corpo text-[15px] font-medium transition-colors duration-200 ${variantes[variante]}`}
    >
      <IconeWhatsApp className="h-[18px] w-[18px]" />
      {children}
    </a>
  );
}
```

Nenhuma variante usa `bg-accent` puro atrás de texto — é a regra dura da spec §5.

- [ ] **Step 3: Escrever `Reveal.tsx`**

Client component com framer-motion: opacidade 0→1 e `y` 12px→0, `duration: 0.22`, `viewport={{ once: true, margin: "-80px" }}`. Usar `useReducedMotion()`; quando verdadeiro, renderizar o filho sem `motion`.

- [ ] **Step 4: Escrever `Imagem.tsx`**

Quando `foto` é `Pendente`, chamar `garantirProtótipo(foto.label)` e renderizar uma moldura tracejada na proporção pedida, com o rótulo "Imagem a receber" e o label. Quando confirmada, `next/image` com `sizes` correto e `priority` só quando pedido.

- [ ] **Step 5: Verificar**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erro.

- [ ] **Step 6: Commit**

```bash
git add components/ui/
git commit -m "feat: primitivas de UI da marca"
```

---

### Task 7: Logos, favicon e imagens

**Files:**
- Create: `public/img/logo-otavio-colorido.svg`, `public/img/logo-otavio-branco.svg`, `app/icon.tsx`
- Modify: mover `assets-referencia/*.png` para `public/img/`

**Interfaces:**
- Produces: os dois arquivos de logo consumidos por `Header` (Task 8) e `Footer` (Task 12), e o favicon.

- [ ] **Step 1: Mover os PNG de referência**

```bash
mkdir -p public/img
cp assets-referencia/logo-otavio-colorido.png public/img/
cp assets-referencia/logo-otavio-branco.png public/img/
```

- [ ] **Step 2: Reconstruir o logo em SVG**

Redesenhar o lettering e o avião como vetor limpo. Se a fidelidade do script manuscrito não for alcançável, manter o PNG e registrar a pendência "logo em vetor" no `PLANO.md` — um PNG fiel é melhor que um SVG que descaracteriza a marca.

- [ ] **Step 3: Escrever `app/icon.tsx`**

Favicon 32×32 via `ImageResponse`: o avião do logo em `#FF5A00` sobre fundo transparente.

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: build limpo; `/icon` gerado.

- [ ] **Step 5: Commit**

```bash
git add public/img app/icon.tsx
git commit -m "feat: logos e favicon da marca"
```

---

### Task 8: Header e Hero

**Files:**
- Create: `components/layout/Header.tsx`, `components/sections/Hero.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `site.nav`, `site.hero`, `WhatsAppLink`, `Imagem`, `Reveal`.
- Produces: o elemento com `id="hero-cta"` que a Task 12 observa para mostrar o botão flutuante.

- [ ] **Step 1: Escrever `Header.tsx`**

Logo à esquerda (altura 40px), nav com três âncoras — "Como funciona", "Quem é o Otávio", "Dúvidas" — e `WhatsAppLink` variante contorno à direita. No mobile, a nav some e resta logo + CTA. `sticky top-0` com `backdrop-blur` e borda inferior só depois de rolar.

- [ ] **Step 2: Escrever `Hero.tsx`**

- `<h1>` em `font-display`, `text-[clamp(2.5rem,7vw,4.5rem)]`, `leading-[1.05]`, `tracking-tight`, com a headline verbatim da spec e "gastando menos" envolto em `<span className="text-accent">`.
- Sub verbatim em `text-ink-muted`, `max-w-[52ch]`.
- `<WhatsAppLink contexto="hero">` dentro de um wrapper com `id="hero-cta"`.
- Selo de prova: `<IconeAviao>` + "+5 milhões de milhas negociadas" + `<Rastro>` + "desde 2021", em `rotulo`.
- `<Imagem>` de viagem sangrada, `proporcao="16/9"`, `prioridade`. A foto entra como `pendente("Foto de viagem para o hero")` até Rodrigo enviar.

- [ ] **Step 3: Montar em `app/page.tsx` e olhar**

Run: `npm run dev`
Verificar em 390px, 768px e 1440px: sem scroll horizontal, headline sem viúva feia, contraste do laranja no `<span>` legível.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Header.tsx components/sections/Hero.tsx app/page.tsx
git commit -m "feat: header e hero"
```

---

### Task 9: Virada de chave e Quem é o Otávio

**Files:**
- Create: `components/sections/ViradaDeChave.tsx`, `components/sections/QuemEOtavio.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `site.virada`, `site.otavio`, `Imagem`, `Reveal`, `Rastro`, `Dado`.

- [ ] **Step 1: Escrever `ViradaDeChave.tsx`**

Duas colunas em contraste. Esquerda, quem paga passagem cheia: tipografia em `text-ink-muted`, sem cor. Direita, quem usa milhas: `bg-accent-soft`, número grande, borda `accent`. Acima, a pergunta retórica verbatim como `<h2>`. Em mobile, empilha.

- [ ] **Step 2: Escrever `QuemEOtavio.tsx`**

`id="quem-e"`. Grade de duas colunas: foto de viagem real à esquerda (`proporcao="4/5"`), texto à direita com o parágrafo "Desde 2021…" verbatim. Abaixo, três números: `5.000.000` milhas negociadas, `2021` como início, e países visitados via `<Dado>` — este último é `pendente()`. Retrato profissional entra como segunda `<Imagem>` pendente.

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit && npm run build`
Expected: limpo. Conferir visualmente que os marcadores aparecem legíveis e não parecem erro de layout.

- [ ] **Step 4: Commit**

```bash
git add components/sections/ViradaDeChave.tsx components/sections/QuemEOtavio.tsx app/page.tsx
git commit -m "feat: secoes de virada de chave e autoridade"
```

---

### Task 10: Temas e Como começa

**Files:**
- Create: `components/sections/Temas.tsx`, `components/sections/ComoComeca.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `temas` (Task 5), `site.comeca`, `Rastro`, `Reveal`, `WhatsAppLink`.

- [ ] **Step 1: Escrever `Temas.tsx`**

`id="como-funciona"`. Grade de três colunas no desktop, uma no mobile. Cada tema: numeração `01`–`06` em `rotulo text-accent`, título em `font-display`, texto em `text-ink-muted`. Sem palavra que sugira aula, módulo ou ementa. `<Reveal delay>` escalonado em 40ms por item, teto de 240ms.

- [ ] **Step 2: Escrever `ComoComeca.tsx`**

Três passos conectados pelo `<Rastro>` — horizontal no desktop, vertical no mobile. Passo 1 "Você me chama no WhatsApp", passo 2 "Eu entendo seu perfil de gastos e para onde você quer ir", passo 3 "Eu te mostro o caminho". Texto exato vem de `copy.md`. `WhatsAppLink` fechando a seção.

- [ ] **Step 3: Verificar**

Run: `npm run build`
Expected: limpo. Conferir que o rastro não quebra em 390px.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Temas.tsx components/sections/ComoComeca.tsx app/page.tsx
git commit -m "feat: temas e como comeca"
```

---

### Task 11: Para quem é, Prova social, FAQ e CTA final

**Files:**
- Create: `components/sections/ParaQuem.tsx`, `components/sections/ProvaSocial.tsx`, `components/sections/FAQ.tsx`, `components/sections/CTAFinal.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `site.paraQuem`, `site.provas`, `faq` (Task 5), `site.ctaFinal`, `Placeholder`, `WhatsAppLink`.

- [ ] **Step 1: Escrever `ParaQuem.tsx`**

Duas colunas: "É para você se…" com marcador `accent`, e "Não é para você se…" em `ink-muted`. A coluna negativa é curta e honesta — qualifica sem ofender.

- [ ] **Step 2: Escrever `ProvaSocial.tsx`**

Seção desenhada e vazia: grade de três cartões, cada um com `<Placeholder bloco label="Depoimento de aluno" motivo="aguardando autorização de uso" />`, e abaixo uma faixa com `<Placeholder bloco label="Prints de resgates e emissões" />`. O layout tem que ficar pronto para receber o conteúdo real sem reabrir.

- [ ] **Step 3: Escrever `FAQ.tsx`**

`id="duvidas"`. `<details>`/`<summary>` nativos — acessível por teclado sem JavaScript. Ícone `<IconeMais>` que rotaciona 45° no `open`, transição 200ms. Cinco perguntas da spec §4. A resposta de preço direciona ao WhatsApp sem citar valor.

- [ ] **Step 4: Escrever `CTAFinal.tsx`**

Faixa em `bg-ink` com o rastro tracejado em `accent`. `<h2>` verbatim "Está pronto para começar sua jornada pelo mundo usando milhas?", parágrafo de fechamento reescrito sem "curso", `WhatsAppLink contexto="final"`. Texto branco sobre `bg-ink` — o laranja aqui pode ser puro, porque sobre o escuro ele passa AA.

- [ ] **Step 5: Verificar**

Run: `npm run build`
Expected: limpo. Testar o FAQ só com teclado: Tab até o `summary`, Enter abre.

- [ ] **Step 6: Commit**

```bash
git add components/sections/ app/page.tsx
git commit -m "feat: qualificacao, prova social, FAQ e CTA final"
```

---

### Task 12: Rodapé e botão flutuante

**Files:**
- Create: `components/layout/Footer.tsx`, `components/ui/BotaoFlutuante.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `site.rodape`, `site.marca`, `Dado`, `linkWhats`, `#hero-cta` (Task 8).

- [ ] **Step 1: Escrever `Footer.tsx`**

Fundo `bg-ink`, logo branca, links para Instagram e WhatsApp, links de Política de Privacidade e Termos de Uso como `<Placeholder>` — não existem ainda e não podem virar link morto. `© Otávio Milhas 2026`. E-mail e CNPJ via `<Dado tom="escuro">`.

- [ ] **Step 2: Escrever `BotaoFlutuante.tsx`**

Client component. `IntersectionObserver` em `#hero-cta`: visível → botão oculto; fora de vista → botão entra. Transição de opacidade e `translate-y` de 200ms. `aria-label` descritivo. Respeita `prefers-reduced-motion`. Canto inferior direito, `z-40`, com folga de 20px das bordas.

- [ ] **Step 3: Verificar**

Run: `npm run dev`
Rolar: o botão não pode aparecer enquanto o CTA do hero está na tela, e tem que aparecer logo depois.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Footer.tsx components/ui/BotaoFlutuante.tsx app/page.tsx
git commit -m "feat: rodape e botao flutuante de WhatsApp"
```

---

### Task 13: SEO, dados estruturados e trava de produção

**Files:**
- Create: `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/JsonLd.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `site.marca`, tokens de cor.

- [ ] **Step 1: Completar o `metadata` em `layout.tsx`**

`metadataBase`, `title` com template, `description`, `openGraph`, `twitter`, `alternates.canonical`, `robots`.

- [ ] **Step 2: Escrever `opengraph-image.tsx`**

1200×630 via `ImageResponse`: fundo `#FAF8F5`, headline curta em display, avião e rastro em `#FF5A00`, "otaviomilhas.com.br" em rótulo.

- [ ] **Step 3: Escrever `JsonLd.tsx`**

`Person` (Otávio, `sameAs` do Instagram, `jobTitle` "Especialista em milhas aéreas") e `Service` (o acompanhamento, `areaServed: "BR"`, `availableChannel` apontando para o WhatsApp). **Não** emitir `Course`.

Campos pendentes não entram no JSON-LD — dado estruturado inventado é pior que dado estruturado ausente.

- [ ] **Step 4: Escrever `sitemap.ts` e `robots.ts`**

- [ ] **Step 5: Verificar a trava de produção**

Run: `NEXT_PUBLIC_PROTOTIPO=false npm run build`
Expected: FAIL com `[modo produção] Informação pendente encontrada na página: "…"`. É a confirmação de que nenhum marcador pode ir ao ar por esquecimento.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/ components/JsonLd.tsx
git commit -m "feat: SEO, open graph e dados estruturados"
```

---

### Task 14: Auditoria e entrega

**Files:**
- Create: `CLAUDE.md`, `AGENTS.md`, `PLANO.md`, `README.md`

**Interfaces:**
- Consumes: tudo.

- [ ] **Step 1: Invocar a skill `landing-premium:revisao-e-entrega`**

- [ ] **Step 2: Auditoria**

- Contraste: medir todo par texto/fundo, principalmente qualquer uso de `accent`.
- Responsividade: 390, 768, 1280, 1440. Sem scroll horizontal em nenhum.
- Headings: um `<h1>`, sem salto de nível.
- Teclado: percorrer a página inteira só com Tab; foco sempre visível.
- `prefers-reduced-motion`: ativar no sistema e confirmar que nada anima.
- `alt`: toda imagem descritiva; nenhuma com `alt` vazio que não seja decorativa.

- [ ] **Step 3: Escrever `CLAUDE.md` e `AGENTS.md`**

`AGENTS.md` recebe o bloco `nextjs-agent-rules` gerado pelo `next dev`. `CLAUDE.md` recebe as sete decisões travadas da spec §8, em linguagem imperativa.

- [ ] **Step 4: Escrever `PLANO.md`**

Estado do projeto, decisões travadas, o que mudou em relação à página atual, e a lista completa de pendências de conteúdo com o rótulo exato que aparece na página — para Rodrigo conseguir cruzar marcador visto com item da lista.

- [ ] **Step 5: Publicar preview na Vercel**

Sem configurar domínio.

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md AGENTS.md PLANO.md README.md
git commit -m "docs: decisoes travadas, plano e pendencias de conteudo"
```

---

## Self-Review

**Cobertura da spec:** §2 oferta → Tasks 2 e 5. §3 fatos e tom → Tasks 1 e 2. §4 espinha narrativa → Tasks 8 a 12, uma seção por task, na ordem. §5 tokens, tipografia, elemento gráfico, direção de arte → Tasks 3, 6, 7. §6 arquitetura, conteúdo, interação, SEO, a11y, performance, deploy → Tasks 3 a 7 e 12 a 14. §7 pendências → Task 5 declara, Task 13 verifica a trava, Task 14 lista. §8 decisões travadas → Global Constraints e Task 14.

**Consistência de nomes:** `pendente`/`isPendente`/`Talvez`/`MODO_PROTOTIPO`/`garantirProtótipo` idênticos em Tasks 4, 5, 6, 9, 11, 12. `linkWhats`/`ContextoCta` idênticos em Tasks 5, 6, 12. `Foto` definido na Task 5 e consumido na 6. `#hero-cta` criado na Task 8 e observado na Task 12.

**Risco conhecido:** a Task 7 pode não alcançar fidelidade no vetor do lettering manuscrito. O plano já resolve — mantém o PNG e registra a pendência, em vez de entregar um logo descaracterizado.
