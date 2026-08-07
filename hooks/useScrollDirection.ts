"use client";

import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down" | null;

/**
 * useScrollDirection — last scroll direction, for header hide/show.
 */
export function useScrollDirection(threshold = 4): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (Math.abs(delta) > threshold) {
          setDirection(delta > 0 ? "down" : "up");
        }
        lastY = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}
