"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;

    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 350);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 900);
      return () => clearTimeout(t);
    }
  }, [done, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            className="mb-10"
          >
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              stroke="#111111"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.path
              d="M40 66 L54 80 L82 44"
              stroke="#111111"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
            />
          </svg>

          <div className="font-mono text-xs tracking-[0.3em] text-muted">
            LOADING
          </div>
          <div className="mt-2 font-display text-6xl tabular-nums">
            {progress}
            <span className="text-2xl align-top">%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
