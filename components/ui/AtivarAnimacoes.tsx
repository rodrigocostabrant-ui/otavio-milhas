/**
 * Liga a entrada ao rolar — e é o único lugar que decide isso.
 *
 * Roda num script inline, durante o parse, antes do primeiro paint. Precisa ser
 * assim por dois motivos, nesta ordem:
 *
 *  1. **O conteúdo não pode nascer escondido.** O HTML servido mostra tudo. Se
 *     o estado escondido dependesse de hidratação, quem está sem JS ou com
 *     `prefers-reduced-motion` receberia uma página vazia — foi exatamente o
 *     defeito que `components/ui/Reveal.test.ts` agora tranca.
 *  2. **Ligar depois do paint piscaria.** O bloco apareceria inteiro e só então
 *     recuaria para o estado inicial da animação.
 *
 * O atributo é a permissão: `Reveal` só observa, e o CSS só esconde, quando ele
 * está escrito. Escrevê-lo é a prova de que existe JS vivo para desfazer.
 */

/**
 * Sem interpolação: este texto vai inteiro para dentro de um `<script>`, e a
 * única defesa que ele tem é ser constante.
 */
const SCRIPT = [
  "try{",
  'if(!matchMedia("(prefers-reduced-motion: reduce)").matches){',
  'document.documentElement.dataset.anima="sim";',
  "}}catch(_){}",
].join("");

/** Renderize antes do conteúdo, ou o primeiro bloco pisca. */
export function AtivarAnimacoes() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
