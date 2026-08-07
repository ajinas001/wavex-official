"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";
import SplitChars from "../SplitChars";
import SplitHover from "../SplitHover";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import "../welcome.css";

/**
 * Welcome — hero. Obsidian `c-welcome` port (source-verbatim CSS):
 * - w-bg arch veil + bottom fade, content-height grid
 * - "Nothing Shown First" `-lrg` title, `.splitted` char reveal on -inview
 * - micro texts + CTA reveal via `-a-to-top` + `-inview` (--l-delay stagger)
 * - stone with cursor spotlight (lerped `--spotlight-angle/-distance`, -90°)
 * - P. / I. side figures rotating out on scroll progress
 * - cursor-following welcome-path SVG trail (lerped `--x`)
 */
export default function Welcome() {
  const sectionRef = useRef<HTMLElement>(null);
  const stoneRef = useRef<HTMLDivElement>(null);
  const cursorTarget = useRef(0);
  const cursorCurrent = useRef(0);
  const spotlightTarget = useRef({ angle: 0, dist: 2000 });
  const spotlightCurrent = useRef({ angle: 0, dist: 2000 });

  const { progress } = useSectionProgress({
    target: sectionRef,
    offset: ["start start", "end top"],
  });

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(".-a-to-top, .-a-to-bottom");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("-inview", entry.isIntersecting);
        }
      },
      { threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      cursorCurrent.current +=
        (cursorTarget.current - cursorCurrent.current) * 0.1;
      sectionRef.current?.style.setProperty(
        "--x",
        cursorCurrent.current.toFixed(2)
      );

      const t = spotlightTarget.current;
      const c = spotlightCurrent.current;
      c.angle += (t.angle - c.angle) * 0.2;
      c.dist += (t.dist - c.dist) * 0.2;
      stoneRef.current?.style.setProperty("--spotlight-angle", c.angle.toFixed(1));
      stoneRef.current?.style.setProperty("--spotlight-distance", c.dist.toFixed(1));

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleCursor = (e: React.MouseEvent) => {
    cursorTarget.current = e.clientX;
  };

  const handleSpotlight = (e: React.MouseEvent) => {
    const el = stoneRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    spotlightTarget.current = {
      angle: (Math.atan2(dy, dx) * 180) / Math.PI - 90,
      dist: Math.sqrt(dx * dx + dy * dy),
    };
  };

  const resetSpotlight = () => {
    spotlightTarget.current = { angle: 0, dist: 2000 };
  };

  return (
    <motion.section
      ref={sectionRef}
      data-header-color="light"
      className="c-welcome"
      style={{ "--progress": progress } as CSSProperties}
      onMouseMove={handleCursor}
    >
      {/* Arch clip def — used by the :before veil */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="arch" clipPathUnits="objectBoundingBox">
            <path d="M 0 1 L 0 0.75 Q 0.5 0 1 0.75 L 1 1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="-w">
        <SplitChars
          as="span"
          text="Nothing"
          className="-lrg title line-1 grid-place"
        />
        <SplitChars
          as="span"
          text="Shown"
          className="-lrg title line-2 grid-place"
        />
        <SplitChars
          as="span"
          text="First"
          className="-lrg title line-3 grid-place"
        />

        <p
          className="-mm line-1-m -a-to-top grid-place"
          style={{ "--l-delay": 0.3 } as CSSProperties}
        >
          Coordinates
          <br />
          Withheld
        </p>
        <p
          className="-mm line-2-m -a-to-top grid-place"
          style={{ "--l-delay": 0.45 } as CSSProperties}
        >
          A Private Assembly
          <br />
          for Makers
        </p>

        <div
          className="cta -a-to-top grid-place"
          style={{ "--l-delay": 0.6 } as CSSProperties}
        >
          <span className="cta-label -hp">
            <span>Commitment</span>
            <span>Precedes</span>
            <span>Entry /</span>
          </span>
          <button
            type="button"
            data-cursor="link"
            onClick={() => window.dispatchEvent(new Event("wavex:open-admission"))}
            className="-big button -p -m-m"
          >
            <SplitHover text="Seek Admission" className="text -mm -up" />
          </button>
        </div>

        <div
          ref={stoneRef}
          className="stone grid-place"
          onMouseMove={handleSpotlight}
          onMouseLeave={resetSpotlight}
        >
          <img src="/images/home/stone.webp" alt="Stone" loading="lazy" />
          <span className="hover-1" />
          <span className="hover-2" />
        </div>

        <figure className="-fit places grid-place" aria-hidden="true">
          <img src="/images/offices/6.webp" alt="" loading="lazy" />
        </figure>
        <figure className="-fit items grid-place" aria-hidden="true">
          <img src="/images/offices/7.webp" alt="" loading="lazy" />
        </figure>
      </div>

      {/* Cursor-following trail */}
      <svg
        className="welcome-path"
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="welcome-path-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#A68773" />
            <stop offset="0.5" stopColor="#9FAF9B" />
            <stop offset="1" stopColor="#151415" />
          </linearGradient>
        </defs>
        <path
          fill="none"
          stroke="url(#welcome-path-gradient)"
          strokeWidth="1"
          d="M859,0c513,94.4,377,448.9-79,595.4-424,136.3-685,299.7-263,484.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.section>
  );
}
