import { describe, expect, it } from "vitest";
import { isPendente, pendente } from "./types";

describe("mecanismo de pendência", () => {
  it("marca um valor como pendente com rótulo e motivo", () => {
    const p = pendente("Sobrenome do Otávio", "cliente ainda não confirmou");
    expect(p.__pendente).toBe(true);
    expect(p.label).toBe("Sobrenome do Otávio");
    expect(p.motivo).toBe("cliente ainda não confirmou");
  });

  it("reconhece um valor pendente", () => {
    expect(isPendente(pendente("Cidade"))).toBe(true);
  });

  it("não confunde valor confirmado com pendência", () => {
    expect(isPendente("Belo Horizonte")).toBe(false);
    expect(isPendente(null)).toBe(false);
    expect(isPendente(undefined)).toBe(false);
    expect(isPendente(5_000_000)).toBe(false);
    expect(isPendente({ label: "quase, mas não" })).toBe(false);
  });
});
