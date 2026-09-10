/**
 * Os seis assuntos que o Otávio domina.
 *
 * Escritos como assunto, nunca como ementa: sem "módulo", "aula", "capítulo"
 * ou "você vai receber". A página não vende produto formatado.
 *
 * PENDENTE: confirmar os seis com o Otávio antes de tratar como definitivos.
 */

export type Tema = {
  readonly numero: string;
  readonly titulo: string;
  readonly texto: string;
};

export const temas: readonly Tema[] = [
  {
    numero: "01",
    titulo: "Acumular no dia a dia",
    texto:
      "O supermercado, a farmácia, a conta de luz. Você já gasta esse dinheiro. A questão é se ele está virando milha ou desaparecendo.",
  },
  {
    numero: "02",
    titulo: "Cartões e programas",
    texto:
      "Qual cartão faz sentido para o seu gasto real — e não o que tem o melhor anúncio. Anuidade que se paga e anuidade que só custa.",
  },
  {
    numero: "03",
    titulo: "Transferências bonificadas",
    texto:
      "É aqui que a conta vira. Entender quando esperar, para onde mandar e por que a pressa custa caro.",
  },
  {
    numero: "04",
    titulo: "Emissão inteligente",
    texto:
      "Ter milhas não é ter passagem. Saber procurar, quando procurar e o que aceitar é o que separa a milha parada da viagem marcada.",
  },
  {
    numero: "05",
    titulo: "Classe executiva",
    texto:
      "A cabine que parece inalcançável costuma ser a de melhor custo-benefício em milhas. Quase ninguém sabe disso.",
  },
  {
    numero: "06",
    titulo: "Os erros que custam caro",
    texto:
      "Milha que venceu, transferência na hora errada, promoção que não era promoção. Errar aqui é caro, e dá para evitar.",
  },
];
