# Prompt — Segunda tela da hero: foto de fundo sangrada

> Cole este arquivo inteiro numa sessão nova do Claude Code, na raiz do repo.
> Ele pressupõe que você não tem memória da conversa que levou a isto — está
> tudo aqui. **Isto já foi implementado** nesta sessão; o arquivo existe para
> registro e para o que falta (a foto real), não como instrução para construir
> do zero.

## O que mudou, e por quê

O Rodrigo pediu para redesenhar a hero usando como inspiração um componente
colado (`glyph-portal.tsx` — câmera dirigida por rolagem que entra por dentro
de uma letra) e o print `inspo-site.jpg` (site de viagens "Wanderlust", escuro
e denso, com card de busca flutuante e badges).

Duas descobertas mudaram o escopo antes de qualquer código:

1. **`glyph-portal.tsx` já está no repo**, em `components/ui/glyph-portal.tsx`,
   com uma nota de uma sessão anterior explicando por que ele não é
   instanciado direto: a marca do Otávio é *lettering* desenhado, não uma
   fonte, e a mesma técnica de câmera (maior quadrado de tinta cheia, zoom em
   escala logarítmica, `clip-path`) já foi extraída para o vetor do avião em
   `components/hero-marca/Voo.tsx` + `beats.ts` (constantes `ZOOM`,
   `escalaDoZoom`). **Comparei a matemática das duas: são a mesma curva de
   easing (`4p³` / `1-(-2p+2)³/2`) e a mesma interpolação logarítmica de
   escala.** Não há nada estrutural para "evoluir" ali — já está no nível do
   componente de referência. Não mexi em `Voo.tsx` nem em `beats.ts`.
2. **`inspo-site.jpg` contradiz a decisão travada §3 do `AGENTS.md`**
   ("Contemporânea clara": fundo off-white, laranja só como destaque). O
   Rodrigo confirmou explicitamente: manter a identidade visual, usar a
   inspo só como referência de **composição** (foto de fundo sangrada, texto
   por cima com degradê) — não a paleta escura/teal dela.

O trabalho real, então, ficou só na segunda tela da hero (`HeroFoto.tsx`, o
que a câmera revela por dentro do avião — já era escura, isso não mudou):

- **Saiu** o painel de retrato lateral (coluna de 46% à direita).
- **Entrou** a foto como fundo sangrado da seção inteira (`object-cover`,
  `next/image` com `fill`), com o `h2` + apoio + CTA ancorados na base sobre
  um degradê novo (`overlay-cena` em `app/globals.css`) — gradiente de baixo
  para cima, o oposto do `overlay-painel` existente (que fechava da
  esquerda).
- A rota tracejada + avião (mesmo vocabulário da tela anterior) e o tingimento
  `bg-accent/30 mix-blend-soft-light` continuam, recalculados para a foto
  inteira em vez do painel de 46%.

## Arquivos tocados

| Arquivo | Mudança |
|---|---|
| `content/site.ts` | Novo campo `heroFoto.foto: Talvez<Foto>`, hoje `pendente("Foto de viagem para o topo da página", "Rodrigo tem as fotos")`. É uma foto própria da hero — não reaproveita `otavio.retrato` nem `otavio.fotoViagem`, que já são usados em `QuemEOtavio.tsx`. |
| `components/ui/Imagem.tsx` | Novo prop `preencher?: boolean` — sangra pelo pai (`fill` + `object-cover`) em vez de reservar caixa por `proporcao`. O estado `pendente()` também respeita `preencher`: mostra a mesma moldura tracejada, mas centralizada (`absolute inset-0 m-auto`) em vez de esticada de borda a borda. |
| `components/sections/HeroFoto.tsx` | Reescrito: fundo sangrado + texto na base. Sem foto real (`isPendente`), a seção some com a decoração (tingimento, rota, avião, degradê) e mostra só o marcador de pendência sobre `bg-ink` sólido — não force decoração em cima de nada. |
| `app/globals.css` | Novo `@utility overlay-cena` (degradê de baixo pra cima). `overlay-painel` (o antigo, horizontal) continua existindo — não é usado mais aqui, mas não apaguei porque não sei se outra seção vai precisar dele. |

## O que falta

**A foto.** `heroFoto.foto` é `pendente()` até chegar um arquivo real. Quando
o Rodrigo mandar:

1. Deixe em `public/img/otavio/` (crie se não existir — mesma pasta sugerida
   em `PROMPT-FOTOS-OTAVIO.md` para retrato/foto de viagem).
2. Confira a proporção real. A seção é `min-h-[100svh]` com `object-cover`;
   uma foto muito vertical (retrato) vai cortar bastante nas laterais em
   telas largas — prefira algo próximo de paisagem (16:9 a 3:2) se o Rodrigo
   tiver escolha entre mais de uma.
3. Em `content/site.ts`, troque `foto: pendente(...)` por
   `foto: { src: "/img/otavio/....", alt: "...", largura, altura }`.
4. Rode `NEXT_PUBLIC_PROTOTIPO=false npm run build` — só valida que este
   marcador específico saiu do caminho de erro; o build de protótipo ainda
   vai falhar pelos outros `pendente()` do site (e-mail, CNPJ, depoimentos…),
   e não é problema seu resolver isso aqui.
5. **Olhe a rota tracejada com a foto de verdade.** As coordenadas do `path`
   e do ícone do avião (`left: 84%, top: 13%`) foram ajustadas a olho, sem uma
   foto real para calibrar contra — é o primeiro lugar para revisar se a
   composição não ficar bem com a foto que chegar.

## Verificação já feita nesta sessão

`npx vitest run && npm run lint && npm run build` — os três, verdes. Não
mudei nenhum teste (a mudança é só de composição visual e conteúdo; a
matemática dos beats, que é o que os testes cobrem, ficou intocada).

**Não verifiquei visualmente com uma foto real** — não existe uma no repo
ainda (confirmei: `public/img/otavio/` não existe). O que dá para conferir
sem foto é o estado de pendência (moldura tracejada centralizada, sem
decoração por cima) — abra `http://localhost:3000` e role até a segunda tela
da hero.
