"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SplitLinesProps {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  /** extra delay, mirrors obsidian --l-delay */
  delay?: number;
  /** 1.5s reveal, or repeat whenever out of view */
  repeat?: boolean;
}

/**
 * SplitLines — line-by-line clip-path reveal. Mirrors obsidian `.-splitted`
 * `. -s-line`: each line masked `inset(0 0 100% 0)` + translated down 3em,
 * revealing to `inset(-10% …)` with a line-index stagger.
 */
export default function SplitLines({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
  repeat = false,
}: SplitLinesProps) {
  const reduce = useReducedMotion();

  return (
    <Tag className={`${className} font-display`}>
      {lines.map((line, i) => (
        <span key={i} className="split-line" aria-hidden={line === ""}>
          <motion.span
            className="inline-block will-change-transform"
            initial={reduce ? { opacity: 0 } : { y: "3em", clipPath: "inset(0 0 100% 0)" }}
            whileInView={
              reduce
                ? { opacity: 1 }
                : { y: "0em", clipPath: "inset(-10% 0 -10% 0)" }
            }
            viewport={{ once: !repeat, amount: 0.4 }}
            transition={{
              duration: 1.5,
              ease: [0.5, 0, 0.3, 1],
              delay: delay + i * 0.075,
            }}
          >
            {line || "\u00A0"}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
