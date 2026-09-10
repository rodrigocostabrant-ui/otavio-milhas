/**
 * Cada pergunta responde a uma objeção mapeada em brief.md.
 * Nenhuma resposta cita preço, prazo garantido ou número sem origem no brief.
 */

export type PerguntaFaq = {
  readonly pergunta: string;
  readonly resposta: string;
};

export const faq: readonly PerguntaFaq[] = [
  {
    pergunta: "Milhas não é só para quem gasta muito?",
    resposta:
      "Não. Quem gasta muito acumula mais rápido, só isso. O que decide não é o valor da fatura, é o que você faz com ela. Muita gente com gasto alto acumula mal, e muita gente com gasto normal viaja todo ano.",
  },
  {
    pergunta: "Funciona para quem está começando do zero?",
    resposta:
      "Funciona, e é até melhor. Quem começa do zero não tem vício nem milha vencendo. A gente monta o caminho certo desde a primeira decisão.",
  },
  {
    pergunta: "Preciso de um cartão caro, com anuidade alta?",
    resposta:
      "Não necessariamente. Existe cartão com anuidade que se paga várias vezes e existe cartão caro que não entrega nada. A escolha depende do quanto e de como você gasta — a gente vê isso junto, antes de você trocar qualquer coisa.",
  },
  {
    pergunta: "Quanto tempo até a minha primeira viagem?",
    resposta:
      "Depende do seu gasto mensal e do destino que você quer. Não vou te dar um prazo genérico aqui para te agradar. Me chama, me conta o seu caso, e eu te digo um número realista.",
  },
  {
    pergunta: "Quanto custa?",
    resposta:
      "Isso a gente conversa no WhatsApp, porque depende do que você precisa. O primeiro contato é sem compromisso — você pode sair da conversa sabendo mais sobre milhas do que entrou, independente de fechar alguma coisa.",
  },
];
