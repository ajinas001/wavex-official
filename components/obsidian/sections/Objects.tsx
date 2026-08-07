"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { IMG } from "@/data/images";
import { services, type Service } from "@/data/services";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { scrollToY } from "@/lib/scroll";

/* Four distinct, visible object images (eager-loaded, see below). */
const CARD_IMG: Record<string, string> = {
  "01": IMG.welcomeBg,
  "02": IMG.object2,
  "03": IMG.map,
  "04": IMG.object4,
};

/* Per-card grid slots (2x2, % offsets from viewport centre) */
const SLOT_X = ["-28%", "28%", "-28%", "28%"];
const SLOT_Y = ["-26%", "-26%", "26%", "26%"];

/* Front-card windows: active card swaps at 0.55 / 0.66 / 0.77 / 0.88 */
const PTS = [0, 0.4, 0.55, 0.66, 0.77, 0.88, 0.99, 1];

function scaleFor(i: number): number[] {
  const out = [0.5, 0.5, 0.45, 0.45, 0.45, 0.45, 0.5, 0.5];
  if (i === 0) out[2] = 1.15;
  if (i >= 1) out[3] = 1.15;
  if (i >= 2) out[4] = 1.15;
  if (i >= 3) out[5] = 1.15;
  return out;
}

function DeckCard({
  index,
  active,
  progress,
  service,
}: {
  index: number;
  active: number;
  progress: MotionValue<number>;
  service: Service;
}) {
  const x = useTransform(progress, PTS, [
    SLOT_X[index],
    "0%",
    "0%",
    "0%",
    "0%",
    "0%",
    SLOT_X[index] === "-28%" ? "-45%" : "45%",
    SLOT_X[index] === "-28%" ? "-45%" : "45%",
  ]);
  const y = useTransform(progress, PTS, [
    SLOT_Y[index],
    "0%",
    "0%",
    "0%",
    "0%",
    "0%",
    SLOT_Y[index] === "-26%" ? "-40%" : "40%",
    SLOT_Y[index] === "-26%" ? "-40%" : "40%",
  ]);
  const scale = useTransform(progress, PTS, scaleFor(index));
  const opacity = useTransform(progress, PTS, [
    1, 1, index === 0 ? 1 : 0.75, 0.9, 0.9, 0.85, 0.85, 0,
  ]);
  const rotate = useTransform(progress, [0, 0.4, 1], [index % 2 ? 4 : -4, 0, 0]);

  return (
    <motion.div
      className="absolute inset-0 grid place-items-center"
      style={{ zIndex: active === index ? 20 : 2 }}
    >
      <motion.div
        style={{ x, y, scale, opacity, rotate }}
        className="relative w-[36vw] max-w-[160px] sm:max-w-none md:w-[20vw] md:min-w-[220px] md:max-w-[240px]"
      >
        <div className="aspect-[1840/2480] w-full overflow-hidden rounded-[0.4rem] bg-black shadow-soft">
          <img
            src={CARD_IMG[service.index]}
            alt={service.title}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-3 pt-10">
            <span className="-mm -up text-yellow">{service.index}</span>
            <span className="text-right text-[10px] font-medium uppercase leading-tight tracking-[0.2em] text-yellow/90">
              {service.title}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Sticky 400vh — cards gather from a 2x2 grid, zoom into the centre,
 *  swap the active card mid-scroll, then zoom back out. */
function ObjectsGrid() {
  const { ref, progress } = useSectionProgress({
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    if (v < 0.55) setActive(0);
    else if (v < 0.66) setActive(1);
    else if (v < 0.77) setActive(2);
    else setActive(3);
  });

  const titleX = useTransform(progress, [0, 0.35], ["0%", "-14vw"]);
  const titleY = useTransform(progress, [0, 0.35], ["0%", "-6vh"]);
  const title2X = useTransform(progress, [0, 0.35], ["0%", "14vw"]);
  const titleOpacity = useTransform(progress, [0, 0.3], [1, 0]);
  const captionOpacity = useTransform(progress, [0.4, 0.55, 0.9], [0, 1, 0]);

  const service = services[active];

  return (
    <section ref={ref} id="objects" data-header-color="dark" className="relative h-[400vh] bg-yellow text-brown">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 -w">
          {/* Micro */}
          <div className="flex items-baseline justify-between" style={{ gridColumn: "1 / -1" }}>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-brown/50">
              Objects / 01–04
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-brown/50">
              scroll
            </span>
          </div>

          {/* Title movers */}
          <motion.div
            className="overflow-hidden"
            style={{ gridColumn: "1 / -1", gridRow: 2, x: titleX, y: titleY, opacity: titleOpacity }}
          >
            <h2 className="font-display text-[10vw] font-light leading-[0.85]">
              Our Four
            </h2>
          </motion.div>
          <motion.div
            className="overflow-hidden"
            style={{ gridColumn: "4 / -1", gridRow: 3, x: title2X, opacity: titleOpacity }}
          >
            <h2 className="justify-self-end font-display text-[10vw] font-light italic leading-[0.85] text-brown/60">
              Modes
            </h2>
          </motion.div>
        </div>

        {/* Card deck — converge, zoom, swap, zoom out */}
        <div className="pointer-events-none absolute inset-0">
          {services.map((s, i) => (
            <DeckCard key={s.index} index={i} active={active} progress={progress} service={s} />
          ))}

          {/* Active caption */}
          <motion.div
            className="absolute left-1/2 top-[74%] z-30 w-full -translate-x-1/2 px-6 text-center"
            style={{ opacity: captionOpacity }}
          >
            <p className="font-display text-2xl font-light md:text-4xl">{service.title}</p>
            <p className="mx-auto mt-2 hidden max-w-md text-sm leading-relaxed text-brown/70 md:block">
              {service.description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Sticky 500vh — butterfly path draws, active card + texts at left,
 *  prev/next swap the card, stone + ending at the end. */
function ObjectsPath() {
  const { ref, progress } = useSectionProgress({
    offset: ["start start", "end end"],
  });
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    setActive(Math.min(3, Math.max(0, Math.floor(v * 4))));
  });

  useEffect(() => {
    const el = pathRef.current;
    if (el) setLen(el.getTotalLength());
  }, []);

  const service = services[active];

  const dash = useTransform(progress, [0.1, 1], [len, 0]);
  const figureScale = useTransform(progress, [0, 0.15], [0.88, 1]);
  const titleOpacity = useTransform(progress, [0.9, 1], [1, 0.2]);
  const stoneOpacity = useTransform(progress, [0.78, 0.92], [0, 1]);
  const stoneScale = useTransform(progress, [0.78, 0.95], [0.6, 1]);
  const endingOpacity = useTransform(progress, [0.85, 0.97], [0, 1]);
  const endingY = useTransform(progress, [0.85, 0.97], ["40%", "0%"]);

  const ring = useSpring(useTransform(progress, [0, 1], [0, 360]), {
    stiffness: 90,
    damping: 22,
  });
  const ringOffset = useTransform(
    ring,
    [0, 360],
    [2 * Math.PI * 22, 0]
  );

  const scrollBy = (dir: 1 | -1) => {
    scrollToY(window.scrollY + dir * window.innerHeight);
  };

  return (
    <section ref={ref} data-header-color="dark" className="relative h-[500vh] bg-yellow text-brown">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative h-full w-full">
          {/* Butterfly path */}
          <svg
            viewBox="0 0 1200 700"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <motion.path
              ref={pathRef}
              d="M -40 660 C 240 520, 340 210, 580 300 S 900 680, 1240 380"
              fill="none"
              stroke="rgba(123,81,54,0.4)"
              strokeWidth="1.5"
              strokeDasharray={len}
              strokeDashoffset={dash}
              strokeLinecap="round"
            />
          </svg>

          {/* Left: active card */}
          <div className="absolute left-margin top-1/2 -translate-y-1/2 w-[36vw] max-w-[160px] sm:max-w-none md:w-[20vw] md:min-w-[220px] md:max-w-[240px]">
            <motion.div style={{ scale: figureScale }} className="w-full">
              <div className="figure relative aspect-[1840/2480] overflow-hidden rounded-[0.4rem] shadow-soft">
                <motion.img
                  key={service.index}
                  src={CARD_IMG[service.index]}
                  alt={service.title}
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                  initial={{ scale: 1.25 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: [0.69, 0, 0, 1] }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-3 pt-10">
                  <span className="-mm -up text-yellow">{service.index}</span>
                  <span className="text-right text-[10px] font-medium uppercase leading-tight tracking-[0.2em] text-yellow/90">
                    {service.title}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: title + texts + button */}
          <div className="absolute left-margin right-margin top-1/2 -translate-y-1/2 rounded-[0.4rem] bg-yellow/85 p-4 backdrop-blur-sm md:left-auto md:w-[min(40vw,28rem)] md:bg-transparent md:p-0 md:backdrop-blur-none">
            <motion.h2 className="font-display text-[6vw] font-light leading-[0.9] md:text-[4vw]" style={{ opacity: titleOpacity }}>
              {service.title.split(" ").map((w, i) => (
                <span key={`${service.index}-${i}`} className="mr-[0.2em] inline-block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    key={`${service.index}-${i}`}
                    initial={{ y: "110%", rotate: 4 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ duration: 0.9, delay: i * 0.08, ease: [0.69, 0, 0, 1] }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </motion.h2>

            <div className="mt-8 space-y-3">
              {[service.description, "Every mode is a position — a way of standing in the work.", "Chosen deliberately, held lightly, dropped when it stops serving."].map(
                (t, i) => (
                  <motion.p
                    key={`${service.index}-t${i}`}
                    className="max-w-md text-sm leading-relaxed text-brown/70"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.12, ease: [0.69, 0, 0, 1] }}
                  >
                    {t}
                  </motion.p>
                )
              )}
            </div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                type="button"
                data-cursor="link"
                onClick={() => window.dispatchEvent(new Event("wavex:open-admission"))}
                className="button -big -up"
              >
                Request Access
              </button>
            </motion.div>
          </div>

          {/* Sequence nav */}
          <div className="absolute bottom-[3vh] left-0 flex w-full items-center justify-between px-margin">
            <div className="flex items-center gap-gap">
              <button
                type="button"
                data-cursor="link"
                onClick={() => scrollBy(-1)}
                aria-label="Previous object"
                className="grid h-10 w-10 place-items-center rounded-full bg-black text-yellow transition-transform duration-900 hover:scale-110"
              >
                <svg viewBox="0 0 12 12" className="h-3 w-3">
                  <path d="M9 1 L3 6 L9 11" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
              <div className="relative grid h-12 w-12 place-items-center">
                <motion.svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(123,81,54,0.2)" strokeWidth="1" />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="22"
                    fill="none"
                    stroke="var(--c-brown)"
                    strokeWidth="1.5"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                  />
                </motion.svg>
                <button
                  type="button"
                  data-cursor="link"
                  onClick={() => scrollBy(1)}
                  aria-label="Next object"
                  className="grid h-9 w-9 place-items-center rounded-full bg-black text-yellow"
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3">
                    <path d="M3 1 L9 6 L3 11" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </button>
              </div>
              <span className="-mm -up text-brown/70">
                {String(active + 1).padStart(2, "0")} / 04
              </span>
            </div>

            <motion.span key={service.index} className="-mm -up text-brown/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {service.title}
            </motion.span>
          </div>

          {/* Stone + ending */}
          <motion.div
            className="absolute bottom-[6vh] right-[6vw] w-[18vw]"
            style={{ opacity: stoneOpacity, scale: stoneScale }}
          >
            <div className="figure mask-fade">
              <img src={IMG.stone2} alt="Stone" loading="eager" decoding="async" />
            </div>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-[38%] -translate-x-1/2 text-center"
            style={{ opacity: endingOpacity, y: endingY }}
          >
            <h2 className="font-display text-[8vw] font-light leading-[0.9]">
              In Motion,
              <br />
              <em className="text-brown/50">Always.</em>
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Objects() {
  return (
    <>
      <ObjectsGrid />
      <ObjectsPath />
    </>
  );
}
