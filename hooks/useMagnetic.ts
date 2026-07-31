"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

/**
 * Applies a magnetic pull effect to the referenced element:
 * it drifts toward the cursor within its bounds and springs
 * back to rest on mouse leave.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.4): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const quickX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      quickX(relX * strength);
      quickY(relY * strength);
    }

    function handleLeave() {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return ref;
}
