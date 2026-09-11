# Prompt — Ritmo da rolagem + marca no vazio da hero

> Cole este arquivo inteiro numa sessão nova do Claude Code, na raiz do repo.
> Ele pressupõe que você não tem memória da conversa que levou a isto — está
> tudo aqui. A hero cinemática já existe e funciona (`components/hero-video/`);
> isto é um ajuste nela, não uma reconstrução.

## O que é

Três mudanças pedidas pelo Rodrigo depois de ver a hero rodando, nesta ordem
de confiança (a primeira é a mais simples, a terceira exige mais calibragem
visual ao vivo):

1. **Trocar os dois arquivos de logo do repo pelos originais do site atual**
   (`public/img/logo-otavio.png` e `public/img/logo-otavio-branco.png`) — a
   revisão já foi feita nesta sessão e encontrou que os arquivos atuais são
   uma cópia degradada.
2. **Rolagem mais devagar e mais fluida**, pelo menos na cadência do vídeo de
   origem (extraído a 12fps, ver `components/hero-video/quadros.ts:10`).
3. **O beat `vazio` (`t` 0 a 0.06, hoje só "Role para decolar" + seta) passa a
   mostrar a tagline real da marca + o logo**, em vez de ficar só com o
   indicador de rolagem.

**Não inclui foto.** Foi cogitado usar uma foto da hero do site atual do
Otávio ali, mas o Rodrigo decidiu explicitamente **não** incluir isso agora —
não tente achar ou inventar uma foto para esse momento. Se um dia isso for
retomado, é conversa nova com ele.

---

## 1. Logo — o que a revisão encontrou e o que fazer

Os dois arquivos que já existem no repo (`public/img/logo-otavio.png`,
400×221, e `public/img/logo-otavio-branco.png`, 400×221) estão em uso no
header (`components/layout/Header.tsx:26-44`) e funcionam, mas são uma cópia
**mais borrada** que o logo real publicado hoje em produção pelo próprio
Otávio.

Comparação feita nesta sessão: o site atual (`https://otaviomilhas.com.br/`)
serve o logo em
`https://otaviomilhas.com.br/wp-content/uploads/2024/10/Logo_Otavio.avif`
(colorido) e
`https://otaviomilhas.com.br/wp-content/uploads/2024/10/lOGO_02.avif`
(branco) — ambos **299×165** nativos, sem `srcset` (não existe versão maior
no site dele; é o teto real). Convertidos para PNG e ampliados para
comparar lado a lado com os arquivos do repo na mesma largura, os arquivos do
repo mostram bordas borradas e serrilhado visível no traço do avião e no
"MILHAS" — sinal de terem sido reescalados de uma fonte pior em algum
momento anterior. Os arquivos do site atual, mesmo nativamente menores em
pixels, são visivelmente mais nítidos (sem esse serrilhado).

**A identidade visual — traço laranja, avião, rastro tracejado — já é a
mesma que o `AGENTS.md` (§4) já descreve.** Isto não reabre a decisão travada
da variante visual: é só trocar um arquivo degradado pelo original limpo.

### Como refazer

```bash
mkdir -p public/img
curl -sL -A "Mozilla/5.0" -o /tmp/logo-cor.avif \
  "https://otaviomilhas.com.br/wp-content/uploads/2024/10/Logo_Otavio.avif"
curl -sL -A "Mozilla/5.0" -o /tmp/logo-branco.avif \
  "https://otaviomilhas.com.br/wp-content/uploads/2024/10/lOGO_02.avif"

ffmpeg -y -i /tmp/logo-cor.avif -update 1 public/img/logo-otavio.png
ffmpeg -y -i /tmp/logo-branco.avif -update 1 public/img/logo-otavio-branco.png
```

(`-update 1` evita o aviso de "padrão de sequência" que aparece sem ele —
mesma imagem, sem o ruído no terminal.)

Confira depois: `width`/`height` passam de 400×221 para 299×165 — os dois
lugares que usam esses arquivos com `width={400} height={221}` explícitos
(`Header.tsx:30-31` e `:40-41`, e onde quer que você use o novo no vazio, ver
seção 3) precisam do `width`/`height` corrigidos para 299×165, ou o
`next/image` vai distorcer a proporção. **Meça o arquivo de verdade depois de
gerar — não copie os números daqui sem confirmar.**

Se o site do Otávio tiver mudado o logo entre agora e quando você rodar isto,
os arquivos vêm de lá mesmo assim — são a fonte da verdade, não os que já
estão no repo.

---

## 2. Ritmo da rolagem — mais devagar e mais fluido

O clipe de origem foi extraído a `fps=12` (`quadros.ts:10`), 120 quadros
totais. Hoje o trilho de rolagem (`--trilho-hero`, `app/globals.css:35` e
`:47`) é `240svh` no celular e `380svh` a partir de 768px — é essa distância
de rolagem que se converte nos 120 quadros via `VOO` (`beats.ts:79`, faixa
`[0.2, 0.9]` do trilho).

Rolar rápido hoje pode pular vários quadros por frame de tela, o que lê como
mais brusco que a cadência original do vídeo. **A alavanca real é
`--trilho-hero`: alongá-lo faz o mesmo voo consumir mais pixels de rolagem
por quadro**, sem mudar quadro nenhum do conteúdo.

Primeira proposta para calibrar ao vivo (não é número final):

```css
/* app/globals.css */
:root {
  --trilho-hero: 320svh; /* era 240svh */
}
@media (min-width: 768px) {
  :root {
    --trilho-hero: 480svh; /* era 380svh */
  }
}
```

Depois de trocar, **abra no navegador e role de verdade** (a skill `run`,
se estiver disponível, sobe o dev server) — em desktop e numa viewport de
celular. Se ainda sentir brusco em flick rápido de scroll, o segundo
parâmetro a considerar é `AMORTECIMENTO` (`beats.ts:86`, hoje `0.16`): baixar
esse número (ex. `0.12`) atrasa mais o quadro suave em relação ao cru, o que
suaviza flicks fortes ao custo de a cena "chegar atrasada" quando a pessoa
para de rolar. **Mude um de cada vez e sinta a diferença** — os dois juntos
sem comparação isolada tornam impossível saber qual resolveu o quê.

Não toque em `AMORTECIMENTO` e `--trilho-hero` como se fossem a mesma coisa:
o primeiro governa quão em atraso a cena fica do dedo; o segundo governa
quantos pixels de rolagem cada quadro do vídeo consome. O pedido do Rodrigo
("mais devagar e mais fluido") é primariamente sobre o segundo.

---

## 3. Marca no vazio — tagline + logo em vez de só o indicador

Hoje, `t` entre `0` e `0.06` (`BEATS.vazio`, `beats.ts:58`) mostra só "Role
para decolar" + seta (`Indicador.tsx`) sobre off-white liso — nem imagem, nem
scrim, nada. O Rodrigo quer a tagline real (`hero.headlineInicio` +
`headlineDestaque`, já existe em `content/site.ts:75-76`, é verbatim do site
dele) e o logo aparecendo nesse momento, para não parecer página em branco.

### A armadilha real: contraste

O `<h1>` que já existe em `CamadaDeTexto.tsx` usa `text-ink-inverse` (branco)
— **isso só funciona porque, quando ele aparece hoje (`t ≈ 0.215`), já há
imagem de vídeo e o scrim (`data-hero-scrim`, `globals.css:273-304`) atrás
dele.** Durante o `vazio` (`t < 0.06`) não há imagem nenhuma — a abertura
(`ABERTURA`, `beats.ts:112`) ainda não começou a abrir, é off-white liso. Se
você simplesmente antecipar a janela de entrada do `<h1>` existente para
cobrir o vazio, vai renderizar **texto branco sobre fundo off-white**: ilegível,
reprova contraste na hora.

**Não tente resolver isso trocando a cor do `<h1>` condicionalmente por `t`.**
Isso reintroduz complexidade num bloco que já tem teste garantindo o
revezamento seco entre headline/sub/selo (`beats.ts:150-167`,
`beats.test.ts`) — mexer ali é mexer no que já está calibrado e testado para
a decolagem em diante, que não é o que foi pedido.

### O caminho recomendado: um bloco novo, só para o vazio

Um quarto elemento — mais parecido com o `Indicador` (sempre montado,
dirigido pelo mesmo `inscrever`) do que com os blocos de `TEXTO` — que:

- Mostra o logo (`logo-otavio.png`, a versão colorida — fundo é off-white
  claro) e a tagline em `--color-ink`/`--color-ink-soft` (cores escuras,
  contraste garantido sobre `--color-bg`).
- Reaproveita `hero.headlineInicio` + `hero.headlineDestaque` — **o mesmo
  texto que já existe**, não é uma frase nova. Zero conteúdo inventado.
- Entra em algo como `[0, 0.03]` e sai em algo como `[0.16, 0.2]` — saindo
  **antes** de `TEXTO.headline.entra` (`0.215`) começar, para nunca haver dois
  blocos de texto narrativos visíveis ao mesmo tempo. São números de partida,
  não finais — calibre olhando a tela.
- Precisa de constantes próprias em `beats.ts` (nomeadas, ex.
  `MARCA_VAZIO = { entra: [0, 0.03], sai: [0.16, 0.2] } as const` e uma
  `marcaVazioPara(t)` no mesmo formato de `indicadorPara`) — não invente
  timing solto dentro do componente, o arquivo é claro sobre isso
  (`beats.ts:1-6`).

### O que ainda falta decidir olhando a tela (não decida no escuro)

- **Onde esse bloco fica.** O indicador de rolagem já ocupa
  `absolute inset-x-0 bottom-9` (`Indicador.tsx:55`) e o resto do texto da
  hero é ancorado embaixo também (`CamadaDeTexto.tsx:60-62`, `items-end` +
  `pb-[16svh]`). Logo + tagline entrando na mesma área vão brigar de espaço
  com a seta "role para decolar" se você não escolher uma hierarquia. Um
  ponto de partida razoável: logo pequeno + tagline centralizados
  verticalmente, e o indicador de rolagem mantém o canto inferior — mas
  **abra no navegador e veja se cabe** antes de fixar.
- **Se o indicador "Role para decolar" continua fazendo sentido ao lado da
  tagline**, ou se fica redundante. A tagline não é uma instrução de rolagem
  — ela não substitui o indicador, só preenche o vazio visual. Provavelmente
  os dois convivem, mas confirme olhando.

### Teste que protege isto

Se você adicionar `MARCA_VAZIO`, escreva (ou estenda) um teste em
`beats.test.ts` garantindo `MARCA_VAZIO.sai[1] <= TEXTO.headline.entra[0]` —
o mesmo espírito do teste que já existe garantindo
`DISSOLUCAO.bloom[0] < DISSOLUCAO.veu[0]` (`beats.ts:221`). É a mesma classe
de bug: duas coisas que não podem se sobrepor, e só um teste garante isso
para sempre, não uma revisão visual pontual.

---

## Verificação antes de dizer que terminou

- `npx vitest run && npm run lint && npm run build` — os três, verdes (é a
  regra do `AGENTS.md`, seção "Regras de código").
- Abrir no navegador (desktop e uma viewport de celular) e rolar de
  verdade desde o topo: confirmar que o vazio agora mostra logo + tagline
  legíveis, que a transição para a abertura não deixa os dois textos
  (marca do vazio e `<h1>` da decolagem) visíveis ao mesmo tempo, e que a
  rolagem inteira está mais devagar/fluida que antes.
- Testar `prefers-reduced-motion` — a hero estática (sem trilho, sem
  sequência) não passa pelo `vazio` dirigido por scroll, então o bloco novo
  só precisa existir no modo sequência; confirme que não vazou para o modo
  estático sem querer.
- Comparar visualmente o logo novo (mais nítido) com o antigo — abra os dois
  lado a lado se tiver dúvida de que a troca realmente melhorou algo.

## Me diga no fim

1. Os valores finais de `--trilho-hero` e (se mexeu) `AMORTECIMENTO`, e por
   que pareceram certos.
2. As janelas finais de `MARCA_VAZIO` e onde o bloco ficou posicionado.
3. Se manteve, mudou ou removeu o indicador "Role para decolar" e por quê.
4. Qualquer contraste que precisou medir de novo (a nota de luminância em
   `globals.css:255-258` é o padrão de referência).
