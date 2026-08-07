"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** translate in vh units across the travel (mirrors obsidian parallax directive) */
  factor?: number;
  /** offset viewports for the parallax range */
  offset?: string[];
}

/**
 * Parallax — background layer drift tied to scroll position. Keep deltas
 * small and apply to images/decor, never body copy.
 */
export default function Parallax({
  children,
  className = "",
  factor = 10,
  offset = ["start 0.1", "end -0.1"],
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as never,
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${factor}vh`, `${-factor}vh`]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
