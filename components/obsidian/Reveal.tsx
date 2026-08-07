"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** mirrors obsidian --l-delay (seconds) */
  delay?: number;
  /** 0..1 viewport amount */
  amount?: number;
  /** top or bottom direction */
  dir?: "top" | "bottom";
  as?: "div" | "span" | "figure" | "li";
}

const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  figure: motion.figure,
  li: motion.li,
} as const;

/**
 * Reveal — generic rise/fade on scroll. Mirrors obsidian `.-a-to-top`.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  amount = 0.2,
  dir = "top",
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const y = dir === "top" ? "var(--h5)" : "calc(var(--h5) * -1)";
  const Tag = MOTION_TAGS[as];

  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 1.5,
        ease: [0.5, 0, 0.3, 1],
        delay,
      }}
    >
      {children}
    </Tag>
  );
}
