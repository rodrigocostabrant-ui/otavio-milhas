import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    /* A matemática da hero (beats, mapeamento de quadro, recorte) é pura e
       mora em components/hero-video — testável sem navegador. */
    include: ["content/**/*.test.ts", "components/**/*.test.ts"],
  },
});
