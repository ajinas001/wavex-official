"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SplitWordsProps {
  text: string;
  className?: string;
  delay?: number;
}

/**
 * SplitWords — word-by-word rise reveal for paragraphs/captions.
 * Mirrors the obsidian `-t-ut` word reveal (0.9s per word, staggered).
 */
export default function SplitWords({
  text,
  className = "",
  delay = 0,
}: SplitWordsProps) {
  const reduce = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <p className={className}>
      {reduce
        ? text
        : words.map((word, i) => (
            <span key={i} className="split-line inline-block">
              <motion.span
                className="inline-block will-change-transform"
                initial={{ y: "1.5em", opacity: 0 }}
                whileInView={{ y: "0em", opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.9,
                  ease: [0.35, 0.35, 0, 1],
                  delay: delay + i * 0.075 + Math.random() * 0.15,
                }}
              >
                {word}
                {i < words.length - 1 ? "\u00A0" : ""}
              </motion.span>
            </span>
          ))}
    </p>
  );
}
