import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    /* A matemática da hero (beats e a curva do voo) é pura e
       mora em components/hero-marca — testável sem navegador. */
    include: ["content/**/*.test.ts", "components/**/*.test.ts"],
  },
});
