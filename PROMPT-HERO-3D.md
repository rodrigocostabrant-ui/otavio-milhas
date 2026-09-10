# Prompt — Hero 3D: a trajetória do avião dirigida por rolagem

> Rode **depois** que a landing base já estiver no ar (`PROMPT-BASE-OTAVIO-MILHAS.md`).
> Este prompt substitui a hero estática por uma sequência cinemática em 3D.
> Se algo aqui brigar com o que já foi construído, o que está construído perde —
> menos os tokens de cor e o `content/`, que continuam mandando.

---

## O que é

Uma câmera única atravessa quatro momentos enquanto o visitante rola: o avião na
pista vista de cima, a decolagem em perfil, a passagem **através de uma janela**
para o ponto de vista de um passageiro sobre as nuvens, e a saída para vê-lo
partindo de costas. Acaba, assenta, e o site continua normalmente.

**Isto é 3D em tempo real (React Three Fiber), não vídeo.** Não existe arquivo de
vídeo, não existe scrub de `currentTime`, não existe sequência de imagens. O
scroll dirige uma câmera dentro de uma cena Three.js de verdade. Se você estava
prestes a propor scrub de vídeo porque é mais simples: já foi considerado e
descartado — 30-80MB de asset e trava no Safari iOS.

## Antes de escrever código

Invoque `superpowers:brainstorming` só se algo abaixo estiver ambíguo o bastante
para mudar a arquitetura — o design já foi fechado comigo e está descrito aqui.
Depois use `frontend-design:frontend-design` para a direção visual da cena e
`landing-premium:construir-landing` para a integração com a página.

Consulte a documentação atual do React Three Fiber e do drei via **context7**
antes de codar. Não escreva R3F de memória.

⚠️ **Compatibilidade:** o projeto está em Next 16 / React 19.
`@react-three/fiber` **v8 não suporta React 19** — precisa ser v9+. Confirme a
versão antes de instalar. Se houver conflito de peer deps, pare e me avise em vez
de forçar `--legacy-peer-deps`.

---

## Os beats

`t` é o progresso normalizado da rolagem, de 0 a 1.

| `t` | Beat | Câmera | Cena |
|---|---|---|---|
| `0.00–0.12` | Pista | A pino, bem acima | Avião taxiando, pista visível |
| `0.12–0.50` | Decolagem | Desce e gira para o perfil / três-quartos | Trem recolhe, solo se afasta |
| `0.50–0.58` | **Passagem** | Fecha na fuselagem e atravessa o vidro | Estouro de luz cobre o corte |
| `0.58–0.78` | POV janela | Quase parada, deriva sutil | Moldura escura em 1º plano, nuvens além |
| `0.78–0.94` | Partida | Volta pra fora, por trás e acima | Avião se afasta e diminui |
| `0.94–1.00` | Hold | Assenta | Último frame respira antes da próxima seção |

O avião **voa continuamente durante toda a sequência**, inclusive enquanto a
câmera está "dentro" dele. Assim, quando voltamos pra fora no beat de partida,
ele está numa posição plausível — não teleportado.

---

## Arquitetura

### O driver de rolagem

**Não use `<ScrollControls>` do drei.** Ele assume o container de scroll da página
e briga com o resto da landing em fluxo normal de documento. Faça manual:

```
<section style={{ height: 'var(--hero-runway)' }}>   // trilho de rolagem
  <div className="sticky top-0 h-[100svh]">          // o que fica na tela
    <Canvas />                                        // a cena
    <CamadaDeTexto />                                 // DOM por cima
    <Flash />                                         // overlay branco do corte
  </div>
</section>
```

`t = clamp((scrollY - topoDaSecao) / (alturaDaSecao - alturaDaViewport), 0, 1)`

Rolagem crua é trêmula. Passe `t` por damping dentro do `useFrame`
(`tSuave = lerp(tSuave, tCru, k)`), como o `smoothing` do `ScrollScrub` da
clínica já faz. Calcule `t` **uma vez**, num contexto ou store, e deixe câmera,
texto e flash lerem a mesma fonte — não três listeners de scroll.

Use `100svh`, não `100vh` — barra de endereço de celular quebra `vh`.

### O rig de câmera

Segmento exterior (`t` 0 → 0.50) e segmento de partida (`t` 0.78 → 1.0) usam
**duas curvas `CatmullRomCurve3` separadas**: uma de posição e outra de alvo de
look-at. É isso que permite a câmera orbitar enquanto continua mirando o avião —
uma curva só não dá esse controle.

O segmento POV (`t` 0.58 → 0.78) não usa curva: câmera praticamente fixa, com uma
deriva de baixa amplitude para não parecer travada.

Deixe os pontos de controle das curvas **num único arquivo de constantes,
nomeados por beat**, não espalhados. Eu vou querer mexer neles.

### A cena

- **Avião** — GLTF do Sketchfab com licença **CC-BY**, Draco-comprimido, alvo de
  **< 500KB**. Retexturize na marca: fuselagem branca, cauda e faixa no laranja
  `#FF5A00`. O laranja cru funciona aqui porque é superfície 3D com luz em cima,
  não texto sobre fundo — a regra de contraste do botão não se aplica.
  **Me mostre o modelo escolhido e o link da licença antes de seguir.** A
  atribuição CC-BY vai no rodapé do site, não negocie isso.
- **Céu** — `<Sky>` do drei para o gradiente.
- **Nuvens** — `<Clouds>` (instanciado) com `<Cloud>` dentro. Não modele nuvem.
- **Ambiente** — um HDRI leve só como env map, para o metal refletir. Não use
  HDRI como fundo visível.
- **Pista** — um plano texturizado. Só aparece nos beats 1-2 e some rápido; não
  invista nele.
- **Luz** — direcional quente em ângulo baixo (hora dourada, conversa com o
  laranja da marca) + hemisférica de preenchimento.

### O truque da janela — leia isto com atenção

**O POV não tem cabine modelada.** Não modele assentos, mesinha, corredor,
passageiros. O que existe é:

1. Uma moldura oval arredondada em primeiro plano, material escuro
2. Um vignette escuro nas bordas do frame
3. Nuvens e céu visíveis através da abertura
4. Opcionalmente, uma sugestão de asa lá embaixo

São ~20 linhas de geometria. Foi essa simplificação que tornou a abordagem
viável — se você se pegar modelando interior de avião, parou no lugar errado.

**A passagem pelo vidro:** não resolva a geometria de atravessar. No pico da
aproximação, um overlay branco em DOM sobe a opacidade e desce — o corte acontece
escondido no estouro. É um truque de montagem clássico e é suficiente.

**Não instale `@react-three/postprocessing` para isso.** O flash é uma `div` com
`background: white` e opacidade dirigida por `t`. Bloom e motion blur de verdade
custam ~50KB e um passe de render a mais, para um efeito que o flash já entrega.
Se depois de ver funcionando eu achar que falta, a gente adiciona — não agora.

### A camada de texto

DOM sticky **por cima** do canvas. Nunca renderize a copy dentro do Three.js —
leitor de tela precisa receber as quatro linhas independente de haver WebGL.

| Beat | Texto |
|---|---|
| Pista | "Tudo começa com uma decisão." ← este é o `<h1>` |
| Decolagem | "Aprenda a acumular milhas no dia a dia." |
| Janela | "E veja o mundo de outro lugar." |
| Partida | CTA do WhatsApp + reforço |

Só **um** `<h1>` na página inteira; os outros são `<p>`. Opacidade e translateY
dirigidos pelo mesmo `t`, com sobreposição curta entre um e outro — nunca a tela
completamente sem texto.

**O botão de WhatsApp entra em `t ≈ 0.45` e não sai mais.** A oferta precisa
estar alcançável durante a maior parte da rolagem; essa hero é longa e não pode
adiar a conversão por quatro telas.

Todo esse texto vai para `content/site.ts` como os outros. Nada hardcoded no
componente.

---

## Degradação — obrigatório, não é enfeite

Nesta ordem:

1. **Sem WebGL** → hero estática normal, altura de tela única, sem trilho de rolagem
2. **`prefers-reduced-motion`** → **um frame estático bem composto** (equivalente
   ao beat da janela ou da decolagem), sem pinar a rolagem, hero vira altura normal
3. **FPS baixo no primeiro segundo** → cai para o estático e não tenta de novo
4. **Ainda carregando** → poster estático no lugar do canvas

O item 2 é uma decisão deliberada e diferente do que foi feito na clínica: lá o
`ScrollScrub` só reduzia a suavização, porque era 1:1 com o gesto. Cena 3D com
nuvens que se movem sozinhas é outra categoria — merece o desligamento honesto.

**Nunca sequestre a rolagem.** O sticky solta limpo nas duas pontas. Sem
`scroll-jacking`, sem `preventDefault` em wheel, sem snap forçado entre beats.

## Orçamento

- Rolagem: **~380vh no desktop, ~240vh no mobile** (a sequência é a mesma, só
  mais comprimida — não corte beats no celular)
- `dpr={[1, 2]}` no desktop, teto menor no mobile
- Pause o `useFrame` quando a hero sair da viewport (IntersectionObserver) — não
  queime GPU enquanto a pessoa lê o resto do site
- Canvas em import dinâmico com `ssr: false` (Three toca `window`), dentro de
  `<Suspense>` com o poster como fallback
- Alvo: **60fps num Android mediano**. Se não bater, corte qualidade de nuvem
  antes de cortar beat.

---

## Construa isolado primeiro

Rota `app/prototipo-hero/page.tsx`, **não linkada em nenhuma navegação**, com
`disallow` no `robots.ts`. Comentário no topo marcando como temporária.

Calibre ali: curvas, timing dos beats, damping, o momento exato do flash. Só
**depois que eu aprovar** é que isso vira a hero real da página. É o mesmo
caminho que o `/prototipo-scroll` fez na clínica e funcionou.

Rode `npm run build` a cada dois ou três passos, não só no fim.

## Me diga no fim

1. Qual modelo você usou, de onde, sob qual licença, e onde pôs a atribuição
2. O endereço do protótipo pra eu abrir
3. Em que beat você teve mais dificuldade de calibrar e quais números eu devo
   mexer para ajustar (nome do arquivo e da constante)
4. O que o `prefers-reduced-motion` mostra hoje
5. Quanto pesou o bundle da hero, separado do resto da página
