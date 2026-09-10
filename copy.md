# Copy — Landing Otávio Milhas

**Base:** `brief.md` · **Spec:** `docs/superpowers/specs/2026-09-09-landing-otavio-milhas-design.md`

Arco escolhido: **público consciente do problema, não da solução**, com uma
adaptação — a autoridade sobe para a terceira posição, porque a oferta é
conversar com uma pessoa e não comprar um produto embalado.

Regras que valem para todo texto abaixo:

- A palavra **"curso"** não aparece.
- Todo número tem origem no `brief.md`. Sem origem, não entra.
- Trechos marcados `[PENDENTE: …]` viram `pendente()` em `content/site.ts` e
  renderizam como marcador visível na página.

---

## Wireframe

| # | Seção | Objetivo | O que o leitor pensa ao chegar | O que precisa provar |
|---|---|---|---|---|
| 1 | Hero | Nomear a promessa e dar o primeiro CTA | "Viajar mais gastando menos? Como?" | Que existe um caminho e alguém que já percorreu |
| 2 | A virada de chave | Criar o desconforto certo | "Espera, eu estou do lado errado dessa conta" | Que a diferença não é sorte, é método |
| 3 | Quem é o Otávio | Dar motivo para confiar | "Quem é esse cara para me ensinar isso?" | 5 milhões de milhas e viagens reais desde 2021 |
| 4 | No que eu te ajudo | Tornar o conhecimento concreto | "Ok, mas o que exatamente eu vou aprender?" | Que o assunto tem escopo e ele domina cada parte |
| 5 | Como começa | Remover o atrito do primeiro passo | "E se eu chamar, o que acontece?" | Que começar é simples e sem compromisso |
| 6 | Para quem é / não é | Qualificar antes da conversa | "Será que serve para mim?" | Honestidade — inclusive sobre para quem não serve |
| 7 | Prova social | Mostrar resultado de outras pessoas | "Funcionou para mais alguém?" | `[PENDENTE: seção inteira]` |
| 8 | Dúvidas | Derrubar as cinco objeções | "Mas e se…" | Que as objeções dele já foram respondidas |
| 9 | CTA final | Fechar | "Tá bom, vamos" | Nada — só remover o último atrito |

---

## 1. Hero

**Chave:** `hero`

**Rótulo (eyebrow):**
`Milhas aéreas · desde 2021`

**Headline** (verbatim do site atual; "gastando menos" em destaque laranja):
> Aprenda as melhores estratégias para acumular milhas, viajar mais, **gastando menos.**

**Subheadline** (verbatim do site atual):
> Aprenda com quem já percorreu vários países sem gastar uma fortuna em passagens aéreas.

**CTA:** `Quero aprender a viajar com milhas`
**Mensagem de WhatsApp:** "Oi Otávio! Quero aprender a viajar com milhas — me conta como funciona."

**Selo de prova (abaixo do CTA):**
`+5 milhões de milhas negociadas` · `desde 2021`

**Imagem:** foto de viagem real do Otávio, largura total, sangrada.
`[PENDENTE: Foto de viagem para o hero — Rodrigo vai fornecer]`

---

## 2. A virada de chave

**Chave:** `virada`

**Headline** (pergunta retórica, verbatim do site atual):
> Você sabia que pode transformar suas compras e gastos do dia a dia em viagens inesquecíveis pelo mundo?

**Parágrafo de apoio** (verbatim do site atual):
> Milhões de pessoas pagam caro por passagens aéreas, enquanto outras aproveitam o poder das milhas para explorar novos destinos com muito mais economia.

**Coluna A — sem milhas**
Rótulo: `Quem paga a passagem cheia`
- Junta dinheiro o ano inteiro para uma viagem só.
- Usa o cartão todo mês e não recebe nada de volta por isso.
- Vê o preço da passagem e desiste do destino antes de pesquisar.
- Acha que milhas são complicadas demais para valer o esforço.

**Coluna B — com milhas**
Rótulo: `Quem usa milhas`
- Viaja mais vezes no mesmo orçamento.
- Transforma o gasto que já existe em passagem.
- Escolhe o destino primeiro e resolve a passagem depois.
- Aprendeu o básico uma vez e usa para o resto da vida.

**Fecho da seção:**
> A diferença entre as duas colunas não é quanto cada um ganha. É o que cada um sabe.

---

## 3. Quem é o Otávio

**Chave:** `otavio` · **ID da âncora:** `quem-e`

**Rótulo:** `Quem vai te ensinar`

**Headline:**
> Eu não aprendi isso num livro. Aprendi viajando.

**Corpo** (verbatim do site atual):
> Desde 2021, venho mergulhando no fascinante universo das milhas aéreas e essa jornada me levou a conhecer na prática países incríveis. Ao longo desse caminho, tive a oportunidade de negociar mais de 5 milhões de milhas de forma estratégica, otimizando minhas viagens, garantindo que cada destino fosse ainda mais acessível e, acima de tudo, inesquecível.

**Parágrafo de ponte:**
> Hoje eu faço o mesmo com outras pessoas. Olho o que você já gasta, entendo para onde você quer ir, e te mostro como um alimenta o outro.

**Números:**
| Valor | Rótulo |
|---|---|
| +5 milhões | milhas negociadas |
| 2021 | quando tudo começou |
| `[PENDENTE: Países visitados]` | países conhecidos na prática |

**Imagens:**
- Foto de viagem, retrato vertical. `[PENDENTE: Foto de viagem do Otávio]`
- Retrato profissional. `[PENDENTE: Retrato profissional do Otávio]`

**Assinatura:** Otávio `[PENDENTE: Sobrenome]` · `[PENDENTE: Cidade]`

---

## 4. No que eu te ajudo

**Chave:** `temas` · **ID da âncora:** `como-funciona` · **Arquivo:** `content/temas.ts`

**Rótulo:** `Os assuntos`

**Headline:**
> Milhas não é um truque. É um conjunto de decisões que você aprende a tomar.

**Subheadline:**
> Estes são os assuntos que eu domino e que a gente vai destravar juntos, no seu ritmo e a partir da sua realidade.

> ⚠️ `[PENDENTE: confirmar os seis temas com o Otávio]` — os textos abaixo
> descrevem assuntos padrão do nicho que ele demonstra dominar. Precisam do aval
> dele antes de ir ao ar como definitivos.

**01 · Acumular no dia a dia**
O supermercado, a farmácia, a conta de luz. Você já gasta esse dinheiro. A questão é se ele está virando milha ou desaparecendo.

**02 · Cartões e programas**
Qual cartão faz sentido para o seu gasto real — e não o que tem o melhor anúncio. Anuidade que se paga e anuidade que só custa.

**03 · Transferências bonificadas**
É aqui que a conta vira. Entender quando esperar, para onde mandar e por que a pressa custa caro.

**04 · Emissão inteligente**
Ter milhas não é ter passagem. Saber procurar, quando procurar e o que aceitar é o que separa a milha parada da viagem marcada.

**05 · Classe executiva**
A cabine que parece inalcançável costuma ser a de melhor custo-benefício em milhas. Quase ninguém sabe disso.

**06 · Os erros que custam caro**
Milha que venceu, transferência na hora errada, promoção que não era promoção. Errar aqui é caro, e dá para evitar.

**CTA da seção:** `Quero aplicar isso no meu caso`

---

## 5. Como começa

**Chave:** `comeca`

**Rótulo:** `O primeiro passo`

**Headline:**
> Começar leva menos tempo do que escolher um destino.

**Passo 01 — Você me chama no WhatsApp**
Sem formulário, sem cadastro, sem compromisso. É uma conversa.

**Passo 02 — Eu entendo o seu momento**
Quanto você gasta por mês, quais cartões já tem, para onde quer ir e quando. É daí que sai o caminho — não de uma fórmula pronta.

**Passo 03 — Eu te mostro o caminho**
O que fazer primeiro, o que ignorar por enquanto e quanto tempo até a sua primeira viagem sair do papel.

**CTA:** `Quero dar o primeiro passo`

---

## 6. Para quem é / não é

**Chave:** `paraQuem`

**Rótulo:** `Antes de você me chamar`

**Headline:**
> Prefiro ser honesto agora do que te decepcionar depois.

**É para você se…**
- Você usa cartão de crédito no dia a dia, mesmo que seja um cartão simples.
- Você quer viajar mais e acha que não cabe no orçamento.
- Você já ouviu falar de milhas, mas nunca soube por onde começar.
- Você topa aprender uma coisa nova para não depender de ninguém depois.

**Não é para você se…**
- Você quer viajar de graça. Milhas reduzem muito o custo, não zeram.
- Você quer viajar no mês que vem sem ter nenhuma milha hoje.
- Você não quer entender como funciona, só quer que alguém resolva.

**Fecho:**
> Se você se viu na segunda lista, tudo bem. Melhor descobrir agora.

---

## 7. Prova social

**Chave:** `provas`

**Rótulo:** `Quem já viajou com isso`

**Headline:**
> `[PENDENTE: headline da seção — depende dos depoimentos reais]`

**Conteúdo:** `[PENDENTE: 3 depoimentos com nome e contexto — aguardando autorização de uso]`

**Faixa inferior:** `[PENDENTE: prints de resgates e emissões reais]`

> Nota para a construção: a seção fica desenhada e vazia, com marcadores em
> bloco. O layout precisa aceitar o conteúdo real depois sem ser reaberto.
> Depoimento sem nome não entra.

---

## 8. Dúvidas

**Chave:** `faq` · **ID da âncora:** `duvidas` · **Arquivo:** `content/faq.ts`

**Rótulo:** `Dúvidas`

**Headline:**
> O que todo mundo me pergunta antes de começar.

**Milhas não é só para quem gasta muito?**
Não. Quem gasta muito acumula mais rápido, só isso. O que decide não é o valor da fatura, é o que você faz com ela. Muita gente com gasto alto acumula mal, e muita gente com gasto normal viaja todo ano.

**Funciona para quem está começando do zero?**
Funciona, e é até melhor. Quem começa do zero não tem vício nem milha vencendo. A gente monta o caminho certo desde a primeira decisão.

**Preciso de um cartão caro, com anuidade alta?**
Não necessariamente. Existe cartão com anuidade que se paga várias vezes e existe cartão caro que não entrega nada. A escolha depende do quanto e de como você gasta — a gente vê isso junto, antes de você trocar qualquer coisa.

**Quanto tempo até a minha primeira viagem?**
Depende do seu gasto mensal e do destino que você quer. Não vou te dar um prazo genérico aqui para te agradar. Me chama, me conta o seu caso, e eu te digo um número realista.

**Quanto custa?**
Isso a gente conversa no WhatsApp, porque depende do que você precisa. O primeiro contato é sem compromisso — você pode sair da conversa sabendo mais sobre milhas do que entrou, independente de fechar alguma coisa.

---

## 9. CTA final

**Chave:** `ctaFinal`

**Headline** (verbatim do site atual):
> Está pronto para começar sua jornada pelo mundo usando milhas?

**Corpo** (adaptado do site atual, sem a palavra "curso"):
> Não perca mais tempo e dinheiro. Me chama no WhatsApp e descubra como viajar pelo Brasil e pelo mundo com mais economia e praticidade.

**CTA:** `Quero começar agora`

**Microcopy sob o botão:**
`Sem compromisso. É só uma conversa.`

---

## 10. Rodapé

**Chave:** `rodape`

- Logo branca.
- `Otávio Milhas — milhas aéreas, cartões e viagens.`
- Instagram: `@otaviomilhasbr`
- WhatsApp: `(31) 99961-8080`
- E-mail: `[PENDENTE: E-mail de contato]`
- `[PENDENTE: Política de Privacidade]` · `[PENDENTE: Termos de Uso]`
- `[PENDENTE: CNPJ]`
- `© Otávio Milhas 2026. Todos os direitos reservados.`

---

## Microcopy geral

| Onde | Texto |
|---|---|
| CTA do header | `Falar no WhatsApp` |
| CTA do hero | `Quero aprender a viajar com milhas` |
| CTA dos temas | `Quero aplicar isso no meu caso` |
| CTA de "Como começa" | `Quero dar o primeiro passo` |
| CTA final | `Quero começar agora` |
| Botão flutuante (aria-label) | `Falar com o Otávio no WhatsApp` |
| Nav | `Como funciona` · `Quem é o Otávio` · `Dúvidas` |

---

## Headlines alternativas para o hero

A escolhida é a verbatim do site atual, para preservar a voz dele. Trocar exige
uma linha em `content/site.ts`.

1. **(escolhida)** Aprenda as melhores estratégias para acumular milhas, viajar mais, **gastando menos.**
2. Você já tem as milhas para viajar. Só ainda não sabe usá-las.
3. O seu gasto de todo mês já pagou uma passagem. Vamos buscar?
