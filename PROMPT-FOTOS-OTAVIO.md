# Prompt — Fotos reais do Otávio

> Cole este arquivo inteiro numa sessão nova do Claude Code, na raiz do repo.
> Ele pressupõe que você não tem memória da conversa que levou a isto — está
> tudo aqui. Roda a qualquer momento, não depende dos prompts da hero.

## Por que isto existe

A marca é o Otávio — ele é a prova social do site (decisão travada no
`AGENTS.md`, §5: não há depoimento nem print de resgate ainda, então a
autoridade dele *é* a prova). Isso só funciona se o rosto dele aparecer de
verdade. Hoje não aparece: os dois campos de foto dele em `content/site.ts`
são `pendente()`.

## O que já foi tentado e não funciona — não repita

- **Instagram (`@otaviomilhasbr`, achado em `brief.md`) não é fonte
  automatizável.** Testado com WebFetch: a página só entrega o título, sem
  bio, sem posts, sem URL de imagem — bloqueio deliberado contra scraping, não
  limitação passageira de ferramenta. Não adianta tentar `curl`, outro
  fetcher, ou pedir para um agente "explorar o perfil" — o bloqueio é do lado
  do Instagram.
- **Mesmo que desse certo tecnicamente, não seria o caminho certo.** Baixar
  fotos de um perfil sem passar pelo dono é diferente de receber o arquivo
  que ele mesmo escolheu te mandar — mesmo sendo o próprio cliente. Isso
  importa para o Otávio decidir *quais* fotos representam a marca, não
  qualquer uma que apareça primeiro num grid.
- **Busca local já foi feita e não achou nada.** `Downloads`, `Pictures`,
  `Desktop` e `public/img/` do projeto foram varridos — só havia assets de um
  projeto sem relação (uma marca de óticas) e as duas logos já conhecidas.

## O caminho real

Alguém com acesso ao Otávio (o Rodrigo, ou o próprio Otávio) precisa mandar os
arquivos — WhatsApp, e-mail, link do Drive, o que for mais fácil pra ele.
Precisa de, no mínimo:

1. **Um retrato profissional** dele — rosto, boa luz, de perto. Vira
   `otavio.retrato`.
2. **Uma foto de viagem** dele — ele em algum lugar, contexto de viagem, não
   uma foto de banco. Vira `otavio.fotoViagem`.
3. Opcional: quantos países ele já visitou, número exato, pra fechar
   `otavio.paises` (hoje o site só diz "vários países").

Quando os arquivos chegarem, deixe-os em `public/img/otavio/` (crie a pasta).
Nome sugerido: `retrato.jpg`, `viagem.jpg` — mas confira dimensão e proporção
reais antes de nomear, não invente.

## O que fazer quando (e se) os arquivos estiverem lá

1. Rode `ls public/img/otavio/` (ou equivalente). Se a pasta não existir ou
   estiver vazia, **pare aqui** — vá direto para "Se nada chegou ainda",
   abaixo. Não invente arquivo, não gere placeholder de banco de imagem.
2. Se houver arquivo: confira dimensões reais (`file` ou abrindo a imagem).
   `otavio.retrato` é exibido em `proporcao="1/1"` (quadrado,
   `QuemEOtavio.tsx:69-73`) e `otavio.fotoViagem` em `proporcao="4/5"`
   (retrato, `QuemEOtavio.tsx:12-17`) — confira que o enquadramento não corta
   o rosto de forma estranha nessas proporções; se cortar, peça um recorte
   diferente em vez de forçar `object-position` para disfarçar.
3. Otimize como já é convenção do projeto (as imagens passam por
   `next/image` via `components/ui/Imagem.tsx` — não precisa pré-otimizar
   agressivamente, mas não suba um arquivo de várias dezenas de MB direto da
   câmera).
4. Em `content/site.ts`, troque:
   ```ts
   fotoViagem: pendente(...) as Talvez<Foto>,
   retrato: pendente(...) as Talvez<Foto>,
   ```
   pelos objetos `Foto` reais (`src`, `alt`, `largura`, `altura` — `alt`
   descreve a cena/o retrato em linguagem natural, não é nome de arquivo).
5. Se recebeu o número de países, troque `otavio.paises` também (hoje
   `pendente("Número de países visitados", ...)`) por uma string.
6. Rode `NEXT_PUBLIC_PROTOTIPO=false npm run build` — só valida a seção; ainda
   vai falhar por outros `pendente()` no site (e-mail, CNPJ, depoimentos,
   política, termos — não são seu problema aqui). O que importa é confirmar
   que os dois marcadores de foto do Otávio especificamente saíram do
   caminho de erro.

## Se nada chegou ainda

Não invente, não use foto de banco, não gere imagem com IA para "segurar a
posição" — é exatamente o que a regra "zero conteúdo inventado" do
`AGENTS.md` proíbe, e uma foto de banco de "empresário sorrindo" na seção que
existe para provar que é uma pessoa real seria pior que a moldura tracejada
atual. **Deixe os dois campos como estão, `pendente()`.** O componente
`Imagem` já renderiza a moldura "Imagem a receber" com o motivo visível — é o
comportamento correto, não um estado quebrado.

Termine avisando o Rodrigo, direto na resposta, que a pasta
`public/img/otavio/` está pronta esperando os arquivos, e o que exatamente
falta (retrato + foto de viagem, no mínimo).
