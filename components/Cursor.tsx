"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const quickDotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const quickDotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const quickRingX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const quickRingY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    function move(e: MouseEvent) {
      quickDotX(e.clientX);
      quickDotY(e.clientY);
      quickRingX(e.clientX);
      quickRingY(e.clientY);
    }

    function handleOver(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("[data-cursor]") as HTMLElement | null;
      if (!target) return;
      const mode = target.dataset.cursor;
      const text = target.dataset.cursorText;

      if (mode === "view" || mode === "link") {
        gsap.to(ring, {
          scale: mode === "view" ? 2.6 : 1.8,
          duration: 0.45,
          ease: "power3.out",
        });
        gsap.to(dot, { scale: 0, duration: 0.3 });
        if (text && labelRef.current) {
          labelRef.current.textContent = text;
          gsap.to(labelRef.current, { opacity: 1, duration: 0.3 });
        }
      }
    }

    function handleOut(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      if (!target) return;
      gsap.to(ring, { scale: 1, duration: 0.45, ease: "power3.out" });
      gsap.to(dot, { scale: 1, duration: 0.3 });
      if (labelRef.current) gsap.to(labelRef.current, { opacity: 0, duration: 0.2 });
    }

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block" aria-hidden>
      <div
        ref={ringRef}
        className="fixed left-0 top-0 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink mix-blend-difference"
      >
        <span
          ref={labelRef}
          className="text-[10px] uppercase tracking-widest text-bg opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
      />
    </div>
  );
}
