"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Cursor — obsidian-style custom cursor: a trailing ring + center dot.
 * Grows + shows a label-ish ring over `[data-cursor]` elements.
 * Disabled on coarse pointers / reduced motion.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 400, damping: 40 });
  const ringY = useSpring(y, { stiffness: 400, damping: 40 });

  useEffect(() => {
    if (
      window.matchMedia("(hover: none), (pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      setHovering(!!(e.target as HTMLElement).closest?.("[data-cursor]"));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[400] rounded-full bg-yellow"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: 6,
          height: 6,
        }}
        animate={{ opacity: hovering ? 0 : 1 }}
      />
      {/* ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[399] rounded-full border border-yellow/40"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovering ? 56 : 28,
          height: hovering ? 56 : 28,
          opacity: pressed ? 0.4 : 1,
          borderColor: hovering ? "rgba(241,234,222,0.8)" : "rgba(241,234,222,0.4)",
        }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
}
