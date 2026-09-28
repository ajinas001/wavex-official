"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { IMG } from "@/data/images";
import { scrollToY } from "@/lib/scroll";

const UPDATES = [
  {
    img: IMG.updates[0],
    num: "01",
    status: "Web Design",
    title: "Booker Store launched",
    caption: "Full e-commerce platform for Booker went live this week — responsive, fast, and conversion-optimised from the ground up.",
  },
  {
    img: IMG.updates[1],
    num: "02",
    status: "SaaS Product",
    title: "Vexa Dashboard complete",
    caption: "Vexa\'s internal analytics dashboard is complete and in production. Clean UI, real-time data, fully accessible.",
  },
  {
    img: IMG.updates[2],
    num: "03",
    status: "Branding & Web",
    title: "AlSarh Corp rebranded",
    caption: "AlSarh Corporation\'s full brand refresh and corporate website are live. Identity-led design meeting enterprise standards.",
  },
];

const PILLS = ["01", "02", "03", "04", "05"];

function Slide({
  img,
  i,
  idx,
  caption,
}: {
  img: string;
  i: number;
  idx: MotionValue<number>;
  caption: string;
}) {
  const clip = useTransform(idx, (v: number) => `inset(0 0 0 ${(v - i) * 100}%)`);
  return (
    <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
      <img src={img} alt={caption} className="h-full w-full object-cover" loading="lazy" />
    </motion.div>
  );
}

function SideFigure({
  img,
  progress,
  start,
}: {
  img: string;
  progress: MotionValue<number>;
  start: number;
}) {
  const clip = useTransform(progress, [start, 1], ["inset(100% 0 0 0)", "inset(0 0 0 0)"]);
  const scale = useTransform(progress, [start, 1], [1.3, 1]);
  return (
    <motion.div
      className="figure aspect-[22/30] rounded-[0.4rem]"
      style={{ clipPath: clip, scale }}
    >
      <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
    </motion.div>
  );
}

/**
 * Updates — obsidian port. Three-slot stage (small / large / small),
 * arrows, word-swapped status/title/caption, five numbered state pills
 * with active / neighbour / dim states.
 */
export default function Updates() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [num, setNum] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const idx = useTransform(scrollYProgress, [0, 1], [0, UPDATES.length - 1]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setNum(Math.round(v * (UPDATES.length - 1)));
  });
  useMotionValueEvent(idx, "change", (v) =>
    setCurrent(Math.min(UPDATES.length - 1, Math.max(0, Math.round(v))))
  );

  const jump = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.offsetTop;
    const travel = el.offsetHeight - window.innerHeight;
    scrollToY(top + ((i + PILLS.length) % PILLS.length) * (travel / (UPDATES.length - 1)));
  };

  const arrows = useMemo(
    () => ({
      prev: () => jump(current - 1),
      next: () => jump(current + 1),
    }),
    [current],
  );

  const u = UPDATES[current] ?? UPDATES[0];

  return (
    <section ref={sectionRef} data-header-color="dark" className="relative h-[300vh] bg-light text-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 -w">
          {/* micro */}
          <div className="flex items-baseline justify-between" style={{ gridColumn: "1 / 7" }}>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/50">
              Projects / Recent Work
            </span>
          </div>
          <span className="hidden justify-self-end text-[10px] font-medium uppercase tracking-[0.3em] text-black/50 md:block" style={{ gridColumn: "10 / 13" }}>
            scroll to explore
          </span>

          {/* title */}
          <div className="overflow-hidden" style={{ gridColumn: "1 / 9", gridRow: 2 }}>
            <h2 className="font-display text-[10vw] font-light leading-[0.85]">Projects</h2>
          </div>

          {/* left small figure */}
          <div style={{ gridColumn: "1 / 2", gridRow: 3, alignSelf: "start" }}>
            <SideFigure img={IMG.updates[3]} progress={scrollYProgress} start={0.05} />
          </div>

          {/* centre big figure */}
          <div className="relative aspect-[8/5] overflow-hidden rounded-[0.4rem]" style={{ gridColumn: "3 / 10", gridRow: 3 }}>
            {UPDATES.map((x, i) => (
              <Slide key={i} img={x.img} i={i} idx={idx} caption={x.caption} />
            ))}

            {/* arrows */}
            <button
              onClick={arrows.prev}
              aria-label="Previous update"
              className="group absolute left-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-black/30 bg-light/60 backdrop-blur-sm transition-colors hover:bg-black hover:text-light"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3">
                <path d="M9 1 L3 6 L9 11" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <button
              onClick={arrows.next}
              aria-label="Next update"
              className="group absolute right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-black/30 bg-light/60 backdrop-blur-sm transition-colors hover:bg-black hover:text-light"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3">
                <path d="M3 1 L9 6 L3 11" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </div>

          {/* right small figure */}
          <div style={{ gridColumn: "11 / 12", gridRow: 3, alignSelf: "end" }}>
            <SideFigure img={IMG.updates[4]} progress={scrollYProgress} start={0.15} />
          </div>

          {/* status / title / caption */}
          <div style={{ gridColumn: "1 / 5", gridRow: 4 }}>
            <motion.span
              key={`${u.num}-st`}
              className="block text-[10px] font-medium uppercase tracking-[0.3em] text-black/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.69, 0, 0, 1] }}
            >
              {u.status}
            </motion.span>
            <motion.h3
              key={`${u.num}-tt`}
              className="mt-1 font-display text-2xl font-light md:text-3xl"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.69, 0, 0, 1] }}
            >
              <span className="block overflow-hidden">
                <span className="block">{u.title}</span>
              </span>
            </motion.h3>
            <motion.p
              key={`${u.num}-cp`}
              className="mt-3 max-w-md text-sm leading-relaxed text-black/60"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.69, 0, 0, 1] }}
            >
              {u.caption}
            </motion.p>
          </div>

          {/* numbered pills */}
          <div className="flex items-center gap-2" style={{ gridColumn: "8 / 13", gridRow: 4, alignSelf: "end", justifySelf: "end" }}>
            {PILLS.map((p, i) => {
              const isActive = i === current;
              const isNeighbour = Math.abs(i - current) === 1;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => jump(i)}
                  className={`grid h-10 place-items-center rounded-full border px-5 text-[10px] font-medium tracking-[0.2em] transition-all duration-700 ${
                    isActive
                      ? "border-black bg-black text-light"
                      : isNeighbour
                        ? "border-black/30 text-black/70"
                        : "border-black/10 text-black/30"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
