"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import "./transition.css";

const ENTER = 1.05; // .6 + 3 * .15 — bars fully in
const HOLD = 0.1;
const LEAVE = 1.5; // .9 + 3 * .15 — bars fully out
const FADE = 1.5;
const LOADED_AT = 0.9; // source: loadingTimeout default 900ms
const READY_AT = 1.15; // after enter completes

type Phase = "enter" | "hold" | "leave" | "done";

/**
 * PageTransition — obsidian page-transition port (source-verbatim CSS).
 * 4 panels scale-wipe in (staggered `--order`), hold, wipe out from the
 * right (`--order-back`), grey veil fades 1.2s in / 1.5s out. Title chars
 * rise `translate 0 100% → 0` with the same stagger. Mobile adds the
 * black 13dvh bar wipe (.m-transition-underlay). Drives `html.-loaded`
 * (900ms, reveals gate) and `html.-ready` (scroll unlock + header
 * entrance), then dispatches `wavex:ready`.
 */
export default function PageTransition() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("enter");
  const [enterFrom, setEnterFrom] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const doc = document.documentElement;

    const setUnits = () => {
      doc.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
      doc.style.setProperty("--vw", `${window.innerWidth * 0.01}px`);
    };
    setUnits();
    window.addEventListener("resize", setUnits);

    const topPos = window.scrollY;
    doc.style.setProperty("--top-position", String(topPos));

    if (reduce) {
      doc.classList.add("-loaded", "-ready");
      window.dispatchEvent(new Event("wavex:ready"));
      setPhase("done");
      return () => window.removeEventListener("resize", setUnits);
    }

    const tLoaded = LOADED_AT * 1000;
    const tReady = READY_AT * 1000;
    const tHold = (ENTER + HOLD) * 1000;
    const tLeave = tHold;
    const tDone = (ENTER + HOLD + LEAVE + FADE) * 1000;

    const timers = [
      setTimeout(() => doc.classList.add("-loaded"), tLoaded),
      setTimeout(() => setEnterFrom(false), 60),
      setTimeout(() => {
        doc.classList.add("-ready");
        window.dispatchEvent(new Event("wavex:ready"));
      }, tReady),
      setTimeout(() => setPhase("leave"), tLeave),
      setTimeout(() => {
        setPhase("done");
        setMounted(false);
      }, tDone),
    ];

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", setUnits);
    };
  }, [reduce]);

  if (reduce || !mounted) return null;

  const enterActive = phase === "enter" || phase === "hold";

  const rootClass = [
    "page-transition",
    enterActive ? "-t-enter-active" : "-t-leave-active",
    phase === "enter" && enterFrom ? "-t-enter" : "",
    phase === "leave" ? "-t-leave-to" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const underlayClass = [
    "m-transition-underlay",
    phase === "enter" && enterFrom ? "-t-enter-from" : "",
    phase === "leave" ? "-t-leave-to" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={rootClass} aria-hidden="true">
        <div className="g">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              style={{ "--order": i, "--order-back": 5 - i } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="t">
          <span>
            <span
              className="-h5 the"
              style={{ "--order": 1 } as React.CSSProperties}
            >
              The
            </span>
            <span
              className="-h5 obsidian"
              style={{ "--order": 2 } as React.CSSProperties}
            >
              &nbsp;Obsidian
            </span>
            <span
              className="-h5 assembly"
              style={{ "--order": 3 } as React.CSSProperties}
            >
              &nbsp;Assembly
            </span>
          </span>
        </div>
      </div>
      <div className={underlayClass} aria-hidden="true" />
    </>
  );
}
