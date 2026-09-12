import { provas } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";

/**
 * Seção desenhada e vazia.
 *
 * O layout já é o definitivo: três cartões de depoimento e uma faixa de prints.
 * Quando o conteúdo real chegar, ele entra sem reabrir o layout — trocar o
 * `Placeholder` pelo cartão preenchido é a única mudança necessária.
 */
export function ProvaSocial() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="rotulo text-accent-strong">{provas.rotulo}</p>
          <div className="mt-5 max-w-xl">
            <Placeholder
              bloco
              label={provas.headline.label}
              motivo={provas.headline.motivo}
            />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Reveal key={i} delay={Math.min(i * 0.06, 0.24)}>
              <div className="h-full">
                <Placeholder
                  bloco
                  label={`${provas.depoimentos.label} — ${i + 1} de 3`}
                  motivo={provas.depoimentos.motivo}
                />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6">
            <Placeholder
              bloco
              label={provas.prints.label}
              motivo={provas.prints.motivo}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
