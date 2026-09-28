"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/**
 * SmoothScroll — Lenis + GSAP ScrollTrigger synced.
 * Lenis drives virtual scroll, GSAP ticker drives raf so ScrollTrigger
 * stays in sync (no double raf). Framer useScroll still reads native scrollY.
 * Exposes window.__lenis for programmatic scrolls.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < 768
    ) {
      window.__lenis = null;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.15,
      gestureOrientation: "vertical",
      lerp: 0.095,
    });

    window.__lenis = lenis;

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    return () => {
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      lenis.destroy();
      window.__lenis = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
