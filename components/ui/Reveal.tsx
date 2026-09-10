"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Entrada sutil ao rolar: 220ms, deslocamento de 12px.
 * Com `prefers-reduced-motion` o filho é renderizado direto, sem `motion`.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Em segundos. Escalonar no máximo até 0.24 para não arrastar a leitura. */
  delay?: number;
  className?: string;
}) {
  const semMovimento = useReducedMotion();

  if (semMovimento) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.22, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
