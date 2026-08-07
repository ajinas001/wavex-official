"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { IMG } from "@/data/images";
import { useSectionProgress } from "@/hooks/useSectionProgress";

interface RowProps {
  label: string;
  value: string;
  action: "copy" | "link" | "instagram";
  href?: string;
}

function Row({ label, value, action, href }: RowProps) {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    if (action === "copy") {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        /* noop */
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const Wrapper = href ? "a" : "button";
  const inner = (
    <span className="flex w-full items-center justify-between">
      <span className="font-display text-[8vw] font-light leading-none transition-transform duration-900 group-hover:translate-x-3 md:text-[4.5vw]">
        {copied ? "Copied." : value}
      </span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 transition-all duration-900 group-hover:bg-black group-hover:text-yellow md:h-12 md:w-12">
        {action === "copy" ? (
          <svg viewBox="0 0 12 12" className="h-3 w-3">
            <path d="M3 1 L9 6 L3 11" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        ) : (
          <svg viewBox="0 0 12 12" className="h-3 w-3 transition-transform duration-900 group-hover:rotate-45">
            <path d="M3 1 L9 6 L3 11" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        )}
      </span>
    </span>
  );

  return (
    <div className="group relative overflow-hidden border-t border-black/10">
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-yellow transition-transform duration-900 ease-[cubic-bezier(0.69,0,0,1)] group-hover:scale-y-100" />
      <div className="relative flex items-center justify-between px-gap py-6 md:px-margin md:py-10">
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-black/50 md:block md:w-40">
          {label}
        </span>
        <Wrapper
          type={Wrapper === "button" ? "button" : undefined}
          href={href}
          onClick={handle}
          data-cursor="link"
          className="flex-1 text-left"
        >
          {inner}
        </Wrapper>
      </div>
    </div>
  );
}

/**
 * Connection — obsidian `c-connection` port. `-w` title / caption grid,
 * a dashed connection-path whose dot rides the line on scroll, then the
 * contact rows with hover sweep and copy-to-clipboard.
 */
export default function Connection() {
  const { ref, progress } = useSectionProgress({
    offset: ["start 0.7", "end 0.8"],
  });
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);

  useEffect(() => {
    const el = pathRef.current;
    if (el) setLen(el.getTotalLength());
  }, []);

  const dash = useTransform(progress, [0.15, 0.9], [len, 0]);
  const dotX = useTransform(progress, (v) => {
    const el = pathRef.current;
    if (!el || !len) return 0;
    return el.getPointAtLength(Math.min(v, 1) * len).x;
  });
  const dotY = useTransform(progress, (v) => {
    const el = pathRef.current;
    if (!el || !len) return 0;
    return el.getPointAtLength(Math.min(v, 1) * len).y;
  });

  return (
    <section ref={ref} id="contact" data-header-color="dark" className="relative bg-light pb-10 pt-[14vh] text-black">
      <div className="-w">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/50" style={{ gridColumn: "1 / 4" }}>
          Contact / Staying in Touch
        </span>

        <div className="overflow-hidden" style={{ gridColumn: "1 / 10", gridRow: 2 }}>
          <h2 className="font-display text-[12vw] font-light leading-[0.85] md:text-[7vw]">
            Staying in
            <br />
            <em className="text-black/40">Touch.</em>
          </h2>
        </div>

        <div className="mt-[6vh]" style={{ gridColumn: "10 / 13", gridRow: 2, alignSelf: "end" }}>
          <p className="max-w-xs text-sm leading-relaxed text-black/60">
            No pipelines, no portals. Write, and the answer comes back — slowly, on purpose, like everything here.
          </p>
        </div>
      </div>

      {/* connection-path */}
      <div className="relative -w mt-[6vh]">
        <svg viewBox="0 0 1200 320" className="col-span-full h-auto w-full" aria-hidden="true">
          <motion.path
            ref={pathRef}
            d="M 0 280 C 300 120, 460 320, 680 200 S 1000 40, 1200 190"
            fill="none"
            stroke="rgba(21,20,21,0.35)"
            strokeWidth="1.5"
            strokeDasharray={len}
            strokeDashoffset={dash}
            strokeLinecap="round"
          />
          <motion.g style={{ x: dotX, y: dotY }}>
            <circle r="5" fill="var(--c-black)" />
            <circle r="11" fill="none" stroke="rgba(21,20,21,0.3)" strokeWidth="1" />
          </motion.g>
        </svg>
      </div>

      {/* rows */}
      <div className="mt-[4vh] border-b border-black/10">
        <Row label="Email" value="studio@wavex.studio" action="copy" />
        <Row label="Studio" value="wavex.studio" action="link" href="https://wavex.studio" />
        <div className="group relative overflow-hidden border-t border-black/10">
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-yellow transition-transform duration-900 ease-[cubic-bezier(0.69,0,0,1)] group-hover:scale-y-100" />
          <div className="relative flex items-center justify-between px-gap py-6 md:px-margin md:py-10">
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-black/50 md:block md:w-40">
              Instagram
            </span>
            <a href="https://instagram.com" data-cursor="link" className="flex flex-1 items-center justify-between text-left">
              <span className="flex items-center gap-6">
                <span className="figure hidden h-16 w-16 overflow-hidden rounded-full border border-black/10 md:block">
                  <img src={IMG.guy1} alt="" loading="lazy" />
                </span>
                <span className="font-display text-[8vw] font-light leading-none transition-transform duration-900 group-hover:translate-x-3 md:text-[4.5vw]">
                  @wavex.studio
                </span>
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 transition-all duration-900 group-hover:rotate-45 group-hover:bg-black group-hover:text-yellow md:h-12 md:w-12">
                <svg viewBox="0 0 12 12" className="h-3 w-3">
                  <path d="M3 1 L9 6 L3 11" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* footers */}
      <div className="-w mt-6">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/40" style={{ gridColumn: "1 / 5" }}>
          By hand. No forms, no pipelines.
        </span>
        <span className="text-right text-[10px] font-medium uppercase tracking-[0.3em] text-black/40" style={{ gridColumn: "9 / 13" }}>
          Responds within 48 hours
        </span>
      </div>
    </section>
  );
}
