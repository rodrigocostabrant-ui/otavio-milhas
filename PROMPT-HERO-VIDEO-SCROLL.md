# Prompt — Vídeo no hero + indicador de scroll

> Cole este arquivo inteiro numa sessão nova do Claude Code, na raiz do repo.
> Ele pressupõe que você não tem memória da conversa que decidiu isto — está
> tudo aqui. Não é a hero 3D (isso foi abandonado por ora — ver nota no fim).

## O que é

Trocar a foto estática do topo da hero (`components/sections/Hero.tsx`, campo
`hero.foto`, hoje `pendente()`) por um vídeo curto em loop, mudo, sem
controles, no mesmo espaço visual. Abaixo dele (ou sobre a própria hero), um
indicador animado simples de "role para baixo" — um ícone de mouse com um
pontinho que desce em loop.

Sem 3D, sem React Three Fiber, sem câmera dirigida por scroll. É um `<video>`
de verdade tocando um clipe real, e um ícone com uma animação CSS. Nada mais.

## O vídeo-fonte, usado inteiro

O arquivo original está em
`C:\Users\otica\Downloads\Airplane_taking_off_and_flying_20260910082328.mp4`
(10.01s, 1280x720, 24fps, com trilha de áudio): pista, decolagem, subida entre
nuvens, POV de janela, afastamento por trás.

**Ele mostra a pintura e o logo reais da companhia aérea easyJet** — nome
escrito na fuselagem e na cauda, em boa parte do vídeo. Isso foi sinalizado ao
Rodrigo (dono do projeto) e ele decidiu explicitamente usar o vídeo **inteiro,
sem cortar nem mascarar nada**, assumindo o risco de marca por conta própria.
Não reabra essa decisão nem proponha editar/desfocar o logo — já foi discutido
e fechado.

### Preparar o clipe final

- Vídeo inteiro, os 10.01s, sem cortes de conteúdo — só sem áudio (`-an`).
- Reencode leve, mudo, loop-friendly: `-c:v libx264 -crf 23 -preset slow -an`.
- Gere um poster estático (`-vframes 1` num frame representativo, ex. o de
  decolagem) para o atributo `poster` do `<video>` — cobre o instante antes do
  vídeo carregar e quem estiver com "economizar dados" ligado no navegador.
- Salve os dois em `public/video/hero-aviao.mp4` e
  `public/video/hero-aviao-poster.jpg` (crie a pasta).
- Confira o tamanho do arquivo final — 10s a 1280x720 deve passar de 1-2MB;
  se ficar pesado demais para a hero (mire abaixo de ~4-5MB), reduza a
  resolução (ex. 960px de largura) ou suba o CRF antes de aceitar. O corte
  entre o último e o primeiro frame do loop provavelmente vai dar um pulo
  visível (é um clipe narrativo, não uma cena ambiente) — teste e avise se
  incomodar, mas não corte conteúdo para resolver isso sem perguntar.

## Mudança de conteúdo e tipos

`content/types.ts` só tem `Foto` como tipo de mídia (`src`, `alt`, `largura`,
`altura`). Adicione um tipo `Video` ao lado, no mesmo espírito (campos
confirmados, nunca implícitos):

```ts
export type Video = {
  readonly src: string;
  readonly poster: string;
  readonly alt: string; // descreve a cena para quem não vê o vídeo
  readonly largura: number;
  readonly altura: number;
};
```

Em `content/site.ts`, troque o campo `hero.foto` (`pendente(...)`) por
`hero.video: Talvez<Video>` apontando pro arquivo que você gerou — agora ele
deixa de ser pendente, porque o conteúdo existe de verdade. Alt text descreve
a cena (algo como "Vista de uma janela de avião sobre nuvens, asa visível").

## Componente de vídeo

Crie `components/ui/VideoAmbiente.tsx` no mesmo padrão do `Imagem.tsx` (leia
esse arquivo inteiro antes de escrever — é o modelo): recebe `video:
Talvez<Video>`, se `isPendente` renderiza a mesma moldura tracejada de
"conteúdo a receber" que `Imagem`/`Placeholder` já usam (reaproveite
`garantirProtótipo`), senão renderiza:

```html
<video
  src={video.src}
  poster={video.poster}
  autoPlay
  muted
  loop
  playsInline
  aria-label={video.alt}
  className="h-full w-full object-cover"
/>
```

Sem `next/image` aqui — a regra "`next/image` em toda imagem" é sobre `<img>`,
não se aplica a `<video>`. Mantenha a mesma proporção/cantos arredondados que
a `<Imagem>` tinha nesse lugar da hero (prop `proporcao="16/9"` equivalente).

Em `Hero.tsx`, troque o bloco `<Imagem foto={hero.foto} .../>` por
`<VideoAmbiente video={hero.video} .../>`. Não mude mais nada nessa seção.

## Indicador de scroll

Ícone novo em `components/ui/Icones.tsx`, seguindo o padrão dos outros
(`IconeWhatsApp`, `IconeAviao`): SVG inline, `currentColor`, sem lib externa.
Formato clássico de "scroll mouse" — um contorno arredondado tipo cápsula
vertical, com um traço curto dentro perto do topo representando a roda.

```tsx
export function IconeScroll({ className }: Props) {
  return (
    <svg viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <rect x="4" y="1" width="16" height="28" rx="8" />
      <line x1="12" y1="7" x2="12" y2="13" strokeLinecap="round" className="animate-scroll-dot" />
    </svg>
  );
}
```

A animação (o traço subindo/descendo dentro da cápsula) é `@keyframes` em
`app/globals.css`, como utility, do lado das outras (`rastro-h`/`rastro-v`):

```css
@utility animate-scroll-dot {
  animation: rolar-mouse 1.6s ease-in-out infinite;
}

@keyframes rolar-mouse {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(8px); opacity: 0.3; }
}
```

**Não precisa fazer nada a mais pelo `prefers-reduced-motion`** — o
`globals.css` já zera toda `animation-duration`/`transition-duration` global
sob essa media query (linha ~68), então esse loop já para sozinho. Confirme
isso rodando com a preferência ligada antes de dar por encerrado.

Nota sobre a regra "animação entre 150ms e 250ms" do `AGENTS.md`: ela é
pensada pra transições de interação (hover, entrada de elemento), não pra um
loop ambiente decorativo como esse. Se achar que está brigando com a letra da
regra, não decida sozinho — pergunte ao Rodrigo antes de assumir a exceção.

Posicione o ícone centralizado, colado na base da hero (`absolute bottom-*
left-1/2 -translate-x-1/2` dentro da `<section id="topo">`, que já é
`relative`). Cor: laranja de traço (`text-accent`), não preenchido — é
ícone/traço, a regra de contraste de texto não se aplica (não é texto).

## Testar

- `npm run dev`, veja a hero em `/` — não em `/prototipo-hero`, essa rota é
  de outra tentativa e não entra aqui.
- Autoplay funcionando mudo, sem barra de controles, em loop sem soluço no
  corte (ajuste os pontos de entrada/saída se der um pulo visível).
- Poster aparecendo antes do vídeo carregar (jogue a rede pra "Slow 3G" no
  devtools pra ver).
- Indicador de scroll animando, parando com `prefers-reduced-motion` ligado.
- `npx vitest run && npm run lint && npm run build` — o build com
  `NEXT_PUBLIC_PROTOTIPO=false` precisa passar, já que `hero.video` deixou de
  ser `pendente()`.

## Nota: e a hero 3D?

Existe um protótipo isolado em `/prototipo-hero` (rota fora da nav, com
`disallow` no robots) de uma tentativa anterior — câmera 3D dirigida por
scroll, React Three Fiber. Está com alterações não commitadas. Essa hero de
vídeo é uma direção separada e mais simples para a hero **real** da página;
não mexe em `/prototipo-hero` nem depende dele. Não precisa apagar nem tocar
nesses arquivos — só não misture os dois.
