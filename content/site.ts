/**
 * Todo o conteúdo da página. Nenhuma string de texto mora em componente.
 * A fonte deste texto é copy.md — se divergir, copy.md é a verdade.
 */
import { pendente, type Foto, type Talvez } from "./types";

/* ------------------------------------------------------------------ */
/* WhatsApp — o único destino de conversão da página                   */
/* ------------------------------------------------------------------ */

export const whatsapp = {
  numero: "5531999618080",
  exibicao: "(31) 99961-8080",
  base: "https://wa.me/5531999618080",
} as const;

export type ContextoCta =
  | "header"
  | "hero"
  | "temas"
  | "comeca"
  | "paraQuem"
  | "final"
  | "flutuante"
  | "rodape";

/** Mensagem pré-preenchida por contexto, para o Otávio saber de onde a pessoa veio. */
const mensagens: Record<ContextoCta, string> = {
  header: "Oi Otávio! Quero entender como funciona.",
  hero: "Oi Otávio! Quero aprender a viajar com milhas — me conta como funciona.",
  temas:
    "Oi Otávio! Vi os assuntos no site e quero entender como aplicar no meu caso.",
  comeca: "Oi Otávio! Quero começar. Como funciona o primeiro passo?",
  paraQuem: "Oi Otávio! Acho que meu perfil encaixa — podemos conversar?",
  final: "Oi Otávio! Estou pronto para começar minha jornada usando milhas.",
  flutuante: "Oi Otávio! Quero aprender a viajar com milhas.",
  rodape: "Oi Otávio! Vim pelo site e quero falar com você.",
};

export function linkWhats(contexto: ContextoCta): string {
  return `${whatsapp.base}?text=${encodeURIComponent(mensagens[contexto])}`;
}

/* ------------------------------------------------------------------ */
/* Conteúdo                                                            */
/* ------------------------------------------------------------------ */

export const marca = {
  nome: "Otávio Milhas",
  primeiroNome: "Otávio",
  descricao: "Milhas aéreas, cartões e viagens.",
  nomeCompleto: pendente(
    "Nome completo do Otávio",
    "cliente ainda não informou",
  ) as Talvez<string>,
  cidade: pendente(
    "Cidade",
    "sabemos apenas que o DDD é 31, região de Belo Horizonte",
  ) as Talvez<string>,
  email: pendente("E-mail de contato") as Talvez<string>,
  cnpj: pendente("CNPJ", "confirmar se existe") as Talvez<string>,
  instagram: "https://instagram.com/otaviomilhasbr",
  instagramHandle: "@otaviomilhasbr",
} as const;

export const nav = [
  { rotulo: "Como funciona", href: "#como-funciona" },
  { rotulo: "Quem é o Otávio", href: "#quem-e" },
  { rotulo: "Dúvidas", href: "#duvidas" },
] as const;

export const hero = {
  rotulo: "Milhas aéreas · desde 2021",
  /** Verbatim do site atual. `destaque` é renderizado em laranja. */
  headlineInicio: "Aprenda as melhores estratégias para acumular milhas, viajar mais, ",
  headlineDestaque: "gastando menos.",
  sub: "Aprenda com quem já percorreu vários países sem gastar uma fortuna em passagens aéreas.",
  cta: "Quero aprender a viajar com milhas",
  seloNumero: "+5 milhões",
  seloTexto: "de milhas negociadas",
  seloDesde: "desde 2021",
  foto: pendente(
    "Foto de viagem para o topo da página",
    "Rodrigo vai fornecer fotos reais das viagens do Otávio",
  ) as Talvez<Foto>,
} as const;

export const virada = {
  rotulo: "A virada de chave",
  headline:
    "Você sabia que pode transformar suas compras e gastos do dia a dia em viagens inesquecíveis pelo mundo?",
  apoio:
    "Milhões de pessoas pagam caro por passagens aéreas, enquanto outras aproveitam o poder das milhas para explorar novos destinos com muito mais economia.",
  semMilhas: {
    rotulo: "Quem paga a passagem cheia",
    itens: [
      "Junta dinheiro o ano inteiro para uma viagem só.",
      "Usa o cartão todo mês e não recebe nada de volta por isso.",
      "Vê o preço da passagem e desiste do destino antes de pesquisar.",
      "Acha que milhas são complicadas demais para valer o esforço.",
    ],
  },
  comMilhas: {
    rotulo: "Quem usa milhas",
    itens: [
      "Viaja mais vezes no mesmo orçamento.",
      "Transforma o gasto que já existe em passagem.",
      "Escolhe o destino primeiro e resolve a passagem depois.",
      "Aprendeu o básico uma vez e usa para o resto da vida.",
    ],
  },
  fecho:
    "A diferença entre as duas colunas não é quanto cada um ganha. É o que cada um sabe.",
} as const;

export const otavio = {
  rotulo: "Quem vai te ensinar",
  headline: "Eu não aprendi isso num livro. Aprendi viajando.",
  /** Verbatim do site atual. */
  corpo:
    "Desde 2021, venho mergulhando no fascinante universo das milhas aéreas e essa jornada me levou a conhecer na prática países incríveis. Ao longo desse caminho, tive a oportunidade de negociar mais de 5 milhões de milhas de forma estratégica, otimizando minhas viagens, garantindo que cada destino fosse ainda mais acessível e, acima de tudo, inesquecível.",
  ponte:
    "Hoje eu faço o mesmo com outras pessoas. Olho o que você já gasta, entendo para onde você quer ir, e te mostro como um alimenta o outro.",
  numeros: [
    { valor: "+5 milhões", rotulo: "milhas negociadas" },
    { valor: "2021", rotulo: "quando tudo começou" },
  ],
  paises: pendente(
    "Número de países visitados",
    "o site diz apenas “vários países”",
  ) as Talvez<string>,
  fotoViagem: pendente(
    "Foto de viagem do Otávio",
    "Rodrigo vai fornecer",
  ) as Talvez<Foto>,
  retrato: pendente(
    "Retrato profissional do Otávio",
    "a coletar",
  ) as Talvez<Foto>,
} as const;

export const temasSecao = {
  rotulo: "Os assuntos",
  headline:
    "Milhas não é um truque. É um conjunto de decisões que você aprende a tomar.",
  sub: "Estes são os assuntos que eu domino e que a gente vai destravar juntos, no seu ritmo e a partir da sua realidade.",
  cta: "Quero aplicar isso no meu caso",
  aviso: pendente(
    "Confirmar os seis assuntos com o Otávio",
    "os textos descrevem temas padrão do nicho; precisam do aval dele para virarem definitivos",
  ),
} as const;

export const comeca = {
  rotulo: "O primeiro passo",
  headline: "Começar leva menos tempo do que escolher um destino.",
  passos: [
    {
      numero: "01",
      titulo: "Você me chama no WhatsApp",
      texto: "Sem formulário, sem cadastro, sem compromisso. É uma conversa.",
    },
    {
      numero: "02",
      titulo: "Eu entendo o seu momento",
      texto:
        "Quanto você gasta por mês, quais cartões já tem, para onde quer ir e quando. É daí que sai o caminho — não de uma fórmula pronta.",
    },
    {
      numero: "03",
      titulo: "Eu te mostro o caminho",
      texto:
        "O que fazer primeiro, o que ignorar por enquanto e quanto tempo até a sua primeira viagem sair do papel.",
    },
  ],
  cta: "Quero dar o primeiro passo",
} as const;

export const paraQuem = {
  rotulo: "Antes de você me chamar",
  headline: "Prefiro ser honesto agora do que te decepcionar depois.",
  sim: {
    titulo: "É para você se…",
    itens: [
      "Você usa cartão de crédito no dia a dia, mesmo que seja um cartão simples.",
      "Você quer viajar mais e acha que não cabe no orçamento.",
      "Você já ouviu falar de milhas, mas nunca soube por onde começar.",
      "Você topa aprender uma coisa nova para não depender de ninguém depois.",
    ],
  },
  nao: {
    titulo: "Não é para você se…",
    itens: [
      "Você quer viajar de graça. Milhas reduzem muito o custo, não zeram.",
      "Você quer viajar no mês que vem sem ter nenhuma milha hoje.",
      "Você não quer entender como funciona, só quer que alguém resolva.",
    ],
  },
  fecho: "Se você se viu na segunda lista, tudo bem. Melhor descobrir agora.",
} as const;

export const provas = {
  rotulo: "Quem já viajou com isso",
  headline: pendente(
    "Título da seção de depoimentos",
    "depende dos depoimentos reais",
  ),
  depoimentos: pendente(
    "Três depoimentos com nome e contexto",
    "aguardando autorização de uso",
  ),
  prints: pendente(
    "Prints de resgates e emissões reais",
    "é a prova mais forte do nicho — vale mais que qualquer ajuste de texto",
  ),
} as const;

export const faqSecao = {
  rotulo: "Dúvidas",
  headline: "O que todo mundo me pergunta antes de começar.",
} as const;

export const ctaFinal = {
  headline: "Está pronto para começar sua jornada pelo mundo usando milhas?",
  corpo:
    "Não perca mais tempo e dinheiro. Me chama no WhatsApp e descubra como viajar pelo Brasil e pelo mundo com mais economia e praticidade.",
  cta: "Quero começar agora",
  microcopy: "Sem compromisso. É só uma conversa.",
} as const;

export const rodape = {
  copyright: "© Otávio Milhas 2026. Todos os direitos reservados.",
  politica: pendente(
    "Política de Privacidade",
    "texto ainda não existe — não vira link até existir",
  ),
  termos: pendente(
    "Termos de Uso",
    "texto ainda não existe — não vira link até existir",
  ),
} as const;
