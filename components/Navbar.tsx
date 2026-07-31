"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Navbar
 * -----------------------------------------------------------------------
 * On page load, the brand mark first appears large and centered (like a
 * loading screen), then scales + translates itself down into its resting
 * spot in the navbar. Built with a FLIP-style transform (measure start/end
 * rects, animate the delta) so it lands exactly on target at any viewport
 * size — no hardcoded pixel/vw guessing.
 * -----------------------------------------------------------------------
 */

// Timing knobs — tweak freely
const HOLD_MS = 650; // how long the big centered wordmark sits still first
const MOVE_MS = 950; // duration of the scale/translate move
const FADE_MS = 400; // crossfade duration between overlay and real navbar

type Phase = "loading" | "moving" | "revealing" | "done";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // ---- Intro animation state ----
  const [phase, setPhase] = useState<Phase>("loading");
  const [transform, setTransform] = useState<string>(
    "translate(0px, 0px) scale(1)"
  );

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setPhase("done");
      return;
    }

    const t1 = setTimeout(() => {
      const overlayEl = overlayRef.current;
      const targetEl = targetRef.current;
      if (!overlayEl || !targetEl) return;

      const overlayRect = overlayEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const scale = targetRect.width / overlayRect.width;

      const overlayCenterX = overlayRect.left + overlayRect.width / 2;
      const overlayCenterY = overlayRect.top + overlayRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      const translateX = targetCenterX - overlayCenterX;
      const translateY = targetCenterY - overlayCenterY;

      setTransform(
        `translate(${translateX}px, ${translateY}px) scale(${scale})`
      );
      setPhase("moving");
    }, HOLD_MS);

    const t2 = setTimeout(() => {
      setPhase("revealing");
    }, HOLD_MS + MOVE_MS);

    const t3 = setTimeout(() => {
      setPhase("done");
    }, HOLD_MS + MOVE_MS + FADE_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const overlayVisible = phase !== "done";
  const navContentVisible = phase === "revealing" || phase === "done";

  const menuLinks = [
    { label: "About", href: "#about" },
    { label: "Works", href: "#places" },
    { label: "Services", href: "#objects" },
    { label: "Contact", href: "#contact" },
  ];

  const navLinks = [
    { label: "Works", href: "/works" },
    { label: "Services", href: "/services" },
  ];

  return (
    <>
      {/* ----------------------------------------------------------- */}
      {/* Real navbar — always in the DOM so the brand mark's resting */}
      {/* position can be measured, but contents stay hidden/faded    */}
      {/* until the intro settles.                                    */}
      {/* ----------------------------------------------------------- */}
      <header className="fixed top-0 left-0 w-full z-[100] px-8 md:px-12 py-7 pointer-events-none">
        <div className="flex justify-between items-center w-full max-w-[1920px] mx-auto">

          {/* Left: Brand Name Stack — this is the animation's landing target */}
          <div className="flex items-start gap-3.5 pointer-events-auto">
            <div
              ref={targetRef}
              className="flex flex-col font-serif leading-[0.95] text-[#f4efe6] tracking-tight"
              style={{ visibility: navContentVisible ? "visible" : "hidden" }}
            >
              <span className="self-start text-[1.05rem] md:text-[1.15rem] font-normal">The</span>
              <span className="self-center text-[1.9rem] md:text-[2.2rem] font-normal mt-1">WaveX</span>
              <span className="self-end text-[1.05rem] md:text-[1.15rem] font-normal mt-1 pl-6">Official</span>
            </div>

            <span
              className={`text-[8.5px] tracking-[0.22em] text-[#f4efe6]/60 font-sans font-medium translate-y-1.5 hidden sm:block transition-opacity duration-500 ${
                navContentVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              Imagine Possible
            </span>
          </div>

          {/* Center: Two separate pill buttons with a thin vertical divider between them */}
          <nav
            className={`hidden md:flex items-center gap-3 pointer-events-auto transition-opacity duration-500 ${
              navContentVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {navLinks.map((item, i) => (
              <React.Fragment key={item.label}>
                <a
                  href={item.href}
                  className="px-24 py-2 rounded-lg text-[10px] font-medium uppercase tracking-[0.3em] text-[#f4efe6] bg-[white]/10 border border-[#8c7365]/30 backdrop-blur-md shadow-md hover:bg-[#5c4a3d]/70 transition-all duration-300"
                >
                  {item.label}
                </a>
                {i === 0 && (
                  <span
                    className="w-[1.5px] h-12 m-6 bg-white opacity-70"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Right: Solid Cream Menu Button */}
          <div
            className={`flex items-center pointer-events-auto relative transition-opacity duration-500 ${
              navContentVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="relative z-[120] flex items-between justify-between bg-[#f4efe6] text-[#1a1410] px-4 md:px-20 py-3 rounded-lg hover:bg-[#e8dfd2] transition-all duration-300 font-sans text-[10px] font-bold uppercase tracking-[0.25em] shadow-md min-w-[125px]"
            >
              {/* Hamburger Icon Lines */}
              <div className="flex flex-col justify-between w-4 h-2.5 mr-3">
                <span className={`w-full h-[1.25px] bg-[#1a1410] rounded-full transition-transform ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
                <span className={`w-full h-[1.25px] bg-[#1a1410] rounded-full transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`w-full h-[1.25px] bg-[#1a1410] rounded-full transition-transform ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
              </div>

              <span className="tracking-[0.28em] font-semibold">{menuOpen ? "Close" : "Menu"}</span>
            </button>
          </div>

        </div>

        {/* Full-screen takeover menu */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-[110] bg-[#1a1410] pointer-events-auto overflow-hidden"
            style={{ animation: "panelIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards" }}
          >
            {/* watermark signature — oversized outline wordmark, dead behind the list */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
            >
              <span
                className="font-serif text-[26vw] leading-none tracking-tighter whitespace-nowrap"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(244,239,230,0.06)",
                }}
              >
                WaveX
              </span>
            </div>

            <div className="relative h-full w-full flex flex-col justify-between px-8 md:px-16 py-10">

              {/* top row inside overlay — mirrors brand mark so it reads as one continuous surface */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col font-serif leading-[0.95] text-[#f4efe6]/40 tracking-tight">
                  <span className="self-start text-[1.05rem] font-normal">The</span>
                  <span className="self-center text-[1.9rem] font-normal mt-1">WaveX</span>
                  <span className="self-end text-[1.05rem] font-normal mt-1 pl-6">Official</span>
                </div>
               
              </div>

              {/* main index list */}
              <nav className="flex-1 flex flex-col justify-center -mt-8">
                {menuLinks.map((item, i) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      animation: "lineIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
                      animationDelay: `${120 + i * 70}ms`,
                      opacity: 0,
                    }}
                    className="group relative flex items-baseline gap-6 md:gap-10 py-4 md:py-5 border-b border-[#f4efe6]/[0.08] first:border-t transition-opacity duration-500"
                  >
                    <span className="font-serif text-[11px] md:text-[13px] text-[#8c7365] tracking-[0.2em] tabular-nums w-6 shrink-0 transition-colors duration-500 group-hover:text-[#f4efe6]">
                      0{i + 1}
                    </span>

                    <span
                      className="font-serif text-[13vw] md:text-[6.4vw] leading-[0.9] tracking-tight transition-all duration-500 ease-out"
                      style={{
                        color: hoveredIndex === null || hoveredIndex === i ? "#f4efe6" : "rgba(244,239,230,0.25)",
                        transform: hoveredIndex === i ? "translateX(0.4em)" : "translateX(0)",
                      }}
                    >
                      {item.label}
                    </span>

                    <span
                      aria-hidden="true"
                      className="ml-auto hidden md:block text-[1.6rem] text-[#8c7365] opacity-0 -translate-x-3 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#f4efe6]"
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </nav>

              {/* bottom row — secondary nav + tagline, closes the loop */}
              
            </div>

            <style>{`
              @keyframes panelIn {
                from { clip-path: circle(0% at 100% 0%); }
                to { clip-path: circle(150% at 100% 0%); }
              }
              @keyframes lineIn {
                from { opacity: 0; transform: translateY(24px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        )}
      </header>

      {/* ----------------------------------------------------------- */}
      {/* Loading overlay — big centered wordmark that shrinks/moves  */}
      {/* into the navbar's brand slot via measured transform, then   */}
      {/* fades away.                                                  */}
      {/* ----------------------------------------------------------- */}
      {overlayVisible && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-[#1a1410] transition-opacity ease-out pointer-events-none"
          style={{
            opacity: phase === "revealing" ? 0 : 1,
            transitionDuration: `${FADE_MS}ms`,
          }}
          aria-hidden="true"
        >
          <div
            ref={overlayRef}
            className="flex flex-col font-serif leading-[0.95] text-[#f4efe6] tracking-tight"
            style={{
              transform,
              transformOrigin: "center center",
              transition: `transform ${MOVE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
            }}
          >
            <span className="self-start text-[1.6rem] sm:text-[2rem] md:text-[2.4rem] font-normal">The</span>
            <span className="self-center text-[3.4rem] sm:text-[4.6rem] md:text-[5.6rem] font-normal mt-2">WaveX</span>
            <span className="self-end text-[1.6rem] sm:text-[2rem] md:text-[2.4rem] font-normal mt-2 pl-10">Official</span>
          </div>
        </div>
      )}
    </>
  );
}