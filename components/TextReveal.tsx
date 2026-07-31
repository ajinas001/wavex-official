"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { ElementType } from "react";

interface TextRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  splitBy?: "char" | "word";
  stagger?: number;
}

/**
 * Reveals text by animating each character (or word) up from a
 * clipped mask — used for every heading in the site.
 */
export default function TextReveal({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  splitBy = "word",
  stagger = 0.03,
}: TextRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const pieces = splitBy === "char" ? Array.from(text) : text.split(" ");

  return (
    <Tag className={className}>
      <span ref={ref as any} className="inline-block overflow-hidden align-top">
        <span className="inline-flex flex-wrap">
          {pieces.map((piece, i) => (
            <span key={i} className="overflow-hidden inline-block">
              <motion.span
                className="inline-block will-change-transform"
                initial={{ y: "110%", rotate: 4 }}
                animate={inView ? { y: "0%", rotate: 0 } : {}}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: delay + i * stagger,
                }}
              >
                {piece === " " ? "\u00A0" : piece}
                {splitBy === "word" && "\u00A0"}
              </motion.span>
            </span>
          ))}
        </span>
      </span>
    </Tag>
  );
}
