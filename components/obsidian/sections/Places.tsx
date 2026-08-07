"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  cubicBezier,
} from "framer-motion";
import SplitChars from "@/components/obsidian/SplitChars";
import { PLACES, PLACE_NAMES } from "@/data/images";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import "../places.css";
import { scrollToY } from "@/lib/scroll";

const COUNT = PLACES.length;
const EASE: [number, number, number, number] = [0.35, 0.35, 0, 1];

function DoubleArrow({ direction }: { direction: 1 | -1 }) {
  const d = direction === -1 ? "M9 1 L3 6 L9 11" : "M3 1 L9 6 L3 11";
  return (
    <>
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <path d={d} fill="currentColor" />
      </svg>
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <path d={d} fill="currentColor" />
      </svg>
    </>
  );
}

function PlaceName({ name, active }: { name: string; active: number }) {
  return (
    <span className="place-name -h5">
      <AnimatePresence initial={false}>
        <motion.span
          key={active}
          className="grid grid-flow-col place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.9, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: EASE } }}
        >
          {Array.from(name).map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block will-change-transform"
              style={{ whiteSpace: "pre" }}
              initial={{ opacity: 0, x: "0.1em", y: "0.5em", scale: 1.5 }}
              animate={{
                opacity: 1,
                x: "0em",
                y: "0em",
                scale: 1,
                transition: { duration: 0.9, ease: EASE, delay: i * 0.075 },
              }}
              exit={{
                opacity: 0,
                x: "-0.1em",
                y: "-0.5em",
                scale: 1.5,
                transition: { duration: 0.9, ease: EASE, delay: i * 0.075 },
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Thumb({ src, n }: { src: string; n: number }) {
  return (
    <figure className={`-fit i i-${n} grid-place`} aria-hidden="true">
      <img src={src} alt="" loading="lazy" />
    </figure>
  );
}

/**
 * Places — obsidian `c-places` port. Title + caption over a drawn path,
 * then a 400vh sticky sequencer: 6 thumb figures fly outward as the
 * sequence container clip-expands from the centre and rooms swap
 * left-to-right with a place-name char transition + prev/next nav.
 */
export default function Places() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useSectionProgress({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* --progress-ending — eased, delayed; drives controller clip/scale. */
  const ending = useTransform(progress, [0.1, 0.95], [0, 1], {
    ease: cubicBezier(0.6, 0.45, 0.44, 1.02),
  });
  /* --slide-progress — ring sweep on the next button. */
  const slideDeg = useTransform(progress, (v: number) => {
    const t = Math.min(COUNT - 1, v * (COUNT - 1));
    const seg = t - Math.floor(t);
    return `${(seg * 360).toFixed(2)}deg`;
  });
  const captionY = useTransform(progress, [0, 1], ["0vh", "8vh"]);

  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [entering, setEntering] = useState(true);
  const activeRef = useRef(0);
  const dirRef = useRef<1 | -1>(1);

  /* Initial load-in reveal for the first room. */
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntering(false)),
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  const goTo = (next: number) => {
    const cur = activeRef.current;
    if (next === cur) return;
    dirRef.current = next > cur ? 1 : -1;
    setLeaving(cur);
    activeRef.current = next;
    setEntering(true);
    setActive(next);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntering(false)),
    );
  };

  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(COUNT - 1, Math.max(0, Math.round(v * (COUNT - 1))));
    if (next !== activeRef.current) goTo(next);
  });

  const handleNav = (dir: 1 | -1) => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(max-width: 1023px)").matches) {
      goTo((activeRef.current + dir + COUNT) % COUNT);
      return;
    }
    const travel = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + ((activeRef.current + dir + COUNT) % COUNT) * (travel / (COUNT - 1)));
  };

  const rev = entering && dirRef.current === -1;

  return (
    <section id="places" className="c-places">
      <svg
        className="places-path"
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="places-path-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#15141500" />
            <stop offset="0.5" stopColor="#7b5136" />
            <stop offset="1" stopColor="#15141500" />
          </linearGradient>
        </defs>
        <path
          fill="none"
          stroke="url(#places-path-gradient)"
          strokeWidth="1"
          d="M517.1,0c246,127,804.3,132.3,752,234-27.9,54.4-412.5,84.1-649,16-228.9-65.9-467.4-48.1-462-27,15.1,59.1,394-184,527-73C924.7,350,14.1,621,250.1,1000"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="title" aria-hidden="true">
        <SplitChars as="span" text="Explore" className="-lrg line-1" dx={0.25} dy={-1} />
        <SplitChars as="span" text="Places" className="-lrg line-2" dx={0.25} dy={-1} />
      </div>

      <motion.span className="caption -h5 -m-h6" style={{ y: captionY }}>
        <span>Not</span>
        <span>Everything</span>
        <span>is Visible</span>
      </motion.span>

      <motion.div
        className="places-story"
        style={{ "--progress-ending": ending } as CSSProperties}
      >
        <div className="gl" aria-hidden="true">
          <div className="relief-bg" />
        </div>

        <div className="-w">
          <motion.div
            ref={containerRef}
            className="sticky-container grid-place"
            style={{ "--progress": progress } as CSSProperties}
          >
            <div className="-gc">
              {PLACES.slice(1).map((src, i) => (
                <Thumb key={src} src={src} n={i + 1} />
              ))}

              <div className="sequence-container grid-place">
                <div className="sequence-controller">
                  {PLACES.map((src, i) => (
                    <figure
                      key={src}
                      className={`-fit ${
                        i === active
                          ? entering
                            ? "-entering"
                            : "-active"
                          : i === leaving
                            ? "-leaving"
                            : ""
                      }${rev && i === active && entering ? " -rev" : ""}`}
                      aria-hidden={i !== active}
                    >
                      <img src={src} alt={PLACE_NAMES[i]} loading="lazy" />
                    </figure>
                  ))}
                </div>
              </div>

              <div className="sequesnce-nav grid-place">
                <PlaceName name={PLACE_NAMES[active]} active={active} />
                <nav>
                  <button
                    type="button"
                    data-cursor="link"
                    className="prev"
                    style={{ "--direction": -1 } as CSSProperties}
                    onClick={() => handleNav(-1)}
                    aria-label="Previous place"
                  >
                    <DoubleArrow direction={-1} />
                  </button>
                  <button
                    type="button"
                    data-cursor="link"
                    className="next"
                    style={{ "--slide-progress": slideDeg } as CSSProperties}
                    onClick={() => handleNav(1)}
                    aria-label="Next place"
                  >
                    <DoubleArrow direction={1} />
                  </button>
                  <div className="order -h5" aria-hidden="true">
                    <span>
                      <span>{active + 1}</span>
                      <span>/{COUNT}</span>
                    </span>
                  </div>
                </nav>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
