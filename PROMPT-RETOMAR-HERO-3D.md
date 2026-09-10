# Prompt — Retomar a hero 3D a partir do protótipo revertido

> Cole este arquivo inteiro numa sessão nova do Claude Code, na raiz do repo.
> Ele pressupõe que você não tem memória da conversa que decidiu isto — está
> tudo aqui.

## Contexto

A hero 3D dirigida por rolagem já foi especificada em `PROMPT-HERO-3D.md`
(ainda no repo, intacto) e **já foi construída uma vez**, inteira, batendo com
o spec: commit `e709df9` ("Prototipo da hero 3D dirigida por rolagem"). Ela foi
revertida por inteiro logo em seguida no commit `7fb792a`, mas **só o código** —
`PROMPT-HERO-3D.md` e `PROMPT-BASE-OTAVIO-MILHAS.md` foram mantidos de
propósito, para retomar depois. Rode `git show e709df9 --stat` e
`git log --oneline -- components/hero3d` para ver o que existiu.

Isso significa: **não construa do zero**. Recupere os arquivos do commit
`e709df9` como ponto de partida (`git show e709df9:<arquivo>` para cada um, ou
`git checkout e709df9 -- components/hero3d content/hero3d.ts
app/prototipo-hero/page.tsx` e depois reaplique manualmente as poucas linhas
que o mesmo commit tocou em `app/globals.css` e `app/robots.ts`). Só a partir
daí é que você recalibra.

## O que mudou desde o revert: uma referência em vídeo

Há um vídeo real em `C:\Users\otica\Downloads\Airplane_taking_off_and_flying_20260910082328.mp4`
(10s, 24fps, 1280x720) — decolagem de um avião real, filmagem cinematográfica,
com os mesmos beats do spec: pista → decolagem → subida entre nuvens → POV da
janela com pedaço de asa visível → afastamento por trás acima das nuvens.

Extraia frames pra olhar antes de mexer em qualquer curva:

```
ffmpeg -i "C:\Users\otica\Downloads\Airplane_taking_off_and_flying_20260910082328.mp4" -vf "fps=1,scale=480:-1" frame_%02d.jpg
```

Use isso **só como referência de calibragem fina** — timing relativo entre
beats, densidade e luminosidade das nuvens, o quanto de asa aparece pelo canto
da janela. Três coisas que o vídeo **não** deve mudar, já decididas:

1. **A luz continua hora dourada**, como já estava em `Cena.tsx` antes do
   revert (sol baixo e quente, `Environment preset="sunset"`). O vídeo é meio-dia
   claro — não persiga esse clima, é uma referência de movimento e atmosfera de
   nuvem, não de iluminação.
2. **Não copie a pintura real do avião do vídeo** (é a libré de uma companhia
   aérea de verdade, com logo). O avião da cena é procedural
   (`components/hero3d/cena/Aviao.tsx`), monta com primitivas e já usa as cores
   da marca (`#F4F1EC` branco, `#FF5A00` laranja, `#26231F` escuro,
   `#1B3A4B` vidro) — continua assim. Não precisa de GLTF licenciado; o
   comentário no próprio arquivo já documenta isso como decisão, não como
   placeholder temporário.
3. **A arquitetura dos beats não muda** — `BEATS` em `components/hero3d/beats.ts`
   já bate com a progressão do vídeo (pista 0–0.12, decolagem 0.12–0.5, passagem
   0.5–0.58, janela 0.58–0.78, partida 0.78–0.94, hold 0.94–1). Ajuste números
   dentro dessa estrutura se o vídeo sugerir um timing melhor — não invente
   beats novos.

## O que fazer

1. Leia `PROMPT-HERO-3D.md` inteiro — é o spec vigente, nada dele foi revogado.
2. Recupere os arquivos de `e709df9` (lista completa no `git show e709df9 --stat`):
   `components/hero3d/**`, `content/hero3d.ts`, `app/prototipo-hero/page.tsx`,
   mais as linhas que o commit tocou em `app/globals.css` e `app/robots.ts`.
3. Confirme via **context7** se `@react-three/fiber@^9`, `@react-three/drei@^10`
   e `three@^0.186` (versões usadas no commit original) ainda são as atuais
   compatíveis com Next 16 / React 19 antes de instalar. Se peer deps
   conflitarem, pare e avise — não force `--legacy-peer-deps`.
4. Rode `npm run build` a cada dois ou três passos, como o spec pede.
5. Recalibre `BEATS`, `VOO`, `CAMERA_EXTERIOR`/curvas de partida e o bloco
   `NUVENS`/`Iluminacao` em `Cena.tsx` usando os frames extraídos como
   referência de proporção e densidade — respeitando as três restrições acima.
6. Confira os três estados de degradação na rota isolada `/prototipo-hero`
   (sem nav, `disallow` no robots): sem WebGL, `prefers-reduced-motion`, FPS
   baixo no primeiro segundo.
7. Antes de qualquer commit: `npx vitest run && npm run lint && npm run build`.
8. Não toque na landing base fora de `/prototipo-hero` — as decisões travadas
   em `AGENTS.md` continuam valendo, isso é protótipo isolado até aprovação.

## Me diga no fim

1. O endereço do protótipo pra eu abrir (`/prototipo-hero`)
2. Em que beat foi mais difícil calibrar a partir do vídeo, e quais constantes
   (arquivo + nome) eu devo mexer se eu quiser ajustar
3. O que ficou diferente do spec original, se algo ficou, e por quê
4. O que o `prefers-reduced-motion` mostra hoje
5. Quanto pesou o bundle da hero, separado do resto da página
