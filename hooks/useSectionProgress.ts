"use client";

import { useRef } from "react";
import {
  useScroll,
  useTransform,
  type MotionValue,
  type Easing,
} from "framer-motion";

interface UseSectionProgressOptions {
  /** Element whose scroll travel drives the progress. */
  target?: React.RefObject<HTMLElement | null>;
  /** Scroll offsets, mirror of obsidian `string-enter-vp/exit-vp`. */
  offset?: string[];
  /** Custom easing curve applied to raw scroll progress. */
  ease?: Easing;
  /** Disable → always returns 1 (used for reduced-motion). */
  disabled?: boolean;
}

/**
 * useSectionProgress — scroll-linked 0→1 progress for one section.
 * Port of the obsidian `string="progress"` directive (framer-motion engine).
 */
export function useSectionProgress({
  target,
  offset = ["start 0.8", "end 0.5"],
  ease,
  disabled = false,
}: UseSectionProgressOptions = {}): {
  ref: React.RefObject<HTMLElement>;
  progress: MotionValue<number>;
} {
  const internalRef = useRef<HTMLElement>(null);
  const ref = target ?? internalRef;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as never,
  });

  // Always call useTransform unconditionally to satisfy React hooks rules.
  // When disabled, map everything to 1. When ease is provided, apply it.
  // Otherwise, pass through scrollYProgress identity-mapped.
  const easedProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 1],
    ease ? { ease: ease as (t: number) => number } : undefined,
  );

  const disabledProgress = useTransform(() => 1);

  const progress = disabled
    ? disabledProgress
    : ease
      ? easedProgress
      : scrollYProgress;

  return { ref: ref as React.RefObject<HTMLElement>, progress };
}
