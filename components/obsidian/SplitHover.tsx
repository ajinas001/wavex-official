"use client";

import { useMemo } from "react";

interface SplitHoverProps {
  text: string;
  className?: string;
  /**
   * "center" — obsidian `char[center]`: `--char-center` = distance from the
   * middle char, drives the button hover ripple (scale + stagger).
   * "index" — plain `--char-index` stagger.
   */
  mode?: "center" | "index";
}

/**
 * SplitHover — obsidian `string="split"` char markup. The wrapper carries
 * `-splitted` so chars get `display: inline-flex` and the per-button /
 * per-menu char-swap CSS in globals.css / menu.css can animate them.
 * Each char gets `data-split-content`, `--char-index` and (center mode)
 * `--char-center`.
 */
export default function SplitHover({
  text,
  className = "",
  mode = "center",
}: SplitHoverProps) {
  const chars = useMemo(() => Array.from(text), [text]);
  const center = Math.floor((chars.length - 1) / 2);

  return (
    <span className={`${className} -splitted`}>
      {chars.map((char, i) => (
        <span
          key={i}
          className="-s-char"
          data-split-content={char}
          style={{
            ["--char-index" as string]: i,
            ...(mode === "center"
              ? { ["--char-center" as string]: Math.abs(i - center) }
              : {}),
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
