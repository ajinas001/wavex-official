"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ElementType } from "react";
import { useReducedMotion } from "framer-motion";

interface SplitCharsProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** char offset in em (obsidian --dx) */
  dx?: number;
  /** char offset in em (obsidian --dy) */
  dy?: number;
  once?: boolean;
}

/**
 * SplitChars — obsidian `string="split"` char reveal (source-verbatim CSS).
 * Renders `-splitted > -s-line > -s-char` with `--char-index`, `--char-random`
 * (int 0-10), `--line-index`, `data-split-content`. `-inview` is toggled by an
 * IntersectionObserver; the CSS in globals.css reveals the line (clip-path
 * inset wipe) then lands each char (blur / scale 2 / skew 15°30° → settle),
 * gated by `html.-loaded`.
 */
export default function SplitChars({
  text,
  as: Tag = "h2",
  className = "",
  dx = 0.25,
  dy = 1,
  once = true,
}: SplitCharsProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [inview, setInview] = useState(false);

  const chars = useMemo(
    () =>
      Array.from(text).map((c) => ({
        char: c,
        random: Math.floor(Math.random() * 11),
      })),
    [text]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInview(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInview(false);
          }
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  if (reduce) {
    return (
      <Tag ref={ref as never} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      className={`${className} -splitted ${inview ? "-inview" : ""}`}
      style={{ "--dx": dx, "--dy": dy } as CSSProperties}
      aria-label={text}
    >
      <span
        className="-s-line"
        aria-hidden="true"
        style={{ "--line-index": 0 } as CSSProperties}
      >
        {chars.map(({ char, random }, i) => (
          <span
            key={i}
            className="-s-char"
            data-split-content={char}
            style={
              {
                "--char-index": i,
                "--char-random": random,
              } as CSSProperties
            }
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </Tag>
  );
}
