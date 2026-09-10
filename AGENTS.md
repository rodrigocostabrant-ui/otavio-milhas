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
6. **Botão flutuante só aparece depois do hero**, via IntersectionObserver em
   `#hero-cta`.
7. **Zero conteúdo inventado.** O que falta vira `pendente()` em `content/` e
   renderiza como marcador visível. `NEXT_PUBLIC_PROTOTIPO=false npm run build`
   falha de propósito enquanto houver marcador — é a trava que impede um
   protótipo de ir ao ar como se estivesse pronto.

## Regras de código

- Nenhuma cor literal em componente. Só tokens de `@theme` em `app/globals.css`.
- Nenhuma string de conteúdo em componente. Tudo em `content/`.
- `<Dado>` é o único caminho de renderização de campo `Talvez<T>`.
- Animação entre 150ms e 250ms, sempre honrando `prefers-reduced-motion`.
- `next/image` em toda imagem; `priority` só no hero.
- Verificação antes de qualquer commit: `npx vitest run && npm run lint && npm run build`.
