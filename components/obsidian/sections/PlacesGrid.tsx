"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValueEvent,
  cubicBezier,
  type MotionValue,
} from "framer-motion";
import { PLACES, PLACE_NAMES } from "@/data/images";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { scrollToY } from "@/lib/scroll";

const COUNT = PLACES.length;
const EASE: [number, number, number, number] = [0.35, 0.35, 0, 1];

interface Swap {
  id: number;
  idx: number;
  dir: 1 | -1;
}

/**
 * Obsidian `c-places` thumb slots (i-1..i-6) on the 12×20 virtual grid.
 * Each flies radially outward with `min(--progress * 2, 1)` — source:
 * `.i-N { transform: translate(calc(min(var(--progress) * 2, 1)*var(--vw, 1vw)*FX),
 * calc(min(var(--progress) * 2, 1)*var(--vh, 1vh)*FY)) }`.
 */
const SLOTS: {
  fx: number;
  fy: number;
  cls: string;
}[] = [
  { fx: 30, fy: -30, cls: "lg:col-start-8 lg:col-span-2 lg:row-start-3 lg:row-span-4" },
  { fx: 30, fy: -10, cls: "lg:col-start-10 lg:col-span-3 lg:row-start-5 lg:row-span-6" },
  { fx: 35, fy: 10, cls: "lg:col-start-10 lg:col-span-3 lg:row-start-11 lg:row-span-8" },
  { fx: -20, fy: 30, cls: "lg:col-start-4 lg:col-span-3 lg:row-start-15 lg:row-span-5" },
  { fx: -30, fy: 10, cls: "lg:col-start-1 lg:col-span-3 lg:row-start-13 lg:row-span-5" },
  { fx: -35, fy: -30, cls: "lg:col-start-1 lg:col-span-3 lg:row-start-5 lg:row-span-8" },
];

const ARROW_RIGHT =
  "M38.4,11.7 L37.6,12.3 L47,24.5 L2,24.5 L2,25.5 L46.9,25.5 L37.6,36.7 L38.4,37.3 L48.6,25 Z";
const ARROW_LEFT =
  "M48,24.5 L3,24.5 L12.4,12.3 L11.6,11.7 L1.4,25 L11.6,37.3 L12.4,36.7 L3.1,25.5 L48,25.5 Z";
const PATH_D =
  "M517.1,0c246,127,804.3,132.3,752,234-27.9,54.4-412.5,84.1-649,16-228.9-65.9-467.4-48.1-462-27,15.1,59.1,394-184,527-73C924.7,350,14.1,621,250.1,1000";

function Arrow({ d, direction, className }: { d: string; direction: 1 | -1; className?: string }) {
  return (
    <svg
      viewBox="0 0 50 50"
      className={className}
      aria-hidden="true"
      style={{ "--direction": direction } as CSSProperties}
    >
      <polygon points={d} fill="currentColor" />
    </svg>
  );
}

function PlaceName({
  name,
  active,
  className = "",
}: {
  name: string;
  active: number;
  className?: string;
}) {
  return (
    <span
      className={`-h5 place-name ${className}`}
      style={{ lineHeight: 0.7, display: "grid", placeItems: "center start" }}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={active}
          className="grid grid-flow-col place-items-center"
          style={{ gridArea: "1/1", whiteSpace: "nowrap" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.5, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: EASE } }}
        >
          {Array.from(name).map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block will-change-transform"
              style={{ whiteSpace: "pre" }}
              initial={{ opacity: 0, x: `${0.1 * i}em`, y: "0.5em", scale: 1.5 }}
              animate={{
                opacity: 1,
                x: "0em",
                y: "0em",
                scale: 1,
                transition: { duration: 0.9, ease: EASE, delay: i * 0.075 },
              }}
              exit={{
                opacity: 0,
                x: `${-0.1 * i}em`,
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

/**
 * `.sequence-controller` card — all figures stack in one grid cell; the
 * entering one wipes in with the exact source clip semantics:
 *   -leaving visible below (z2), -entering clipped from the right edge
 *   (`inset(0 0 0 100%)` when it follows a leaving sibling — forward
 *   travel) or from the left (`inset(0 100% 0 0)` — backward travel),
 *   then settles as -active (z3) with `clip-path .9s var(--f-cubic)`.
 * Images loosen at `scale(1.5, 1.2)` origin `100% 50%` and settle to 1
 * over 1.5s var(--f-cubic).
 */
function CardView({
  shown,
  swap,
  onSwapComplete,
  className,
}: {
  shown: number;
  swap: Swap | null;
  onSwapComplete: (s: Swap) => void;
  className?: string;
}) {
  return (
    <div
      className={`relative h-full w-full bg-black ${className ?? ""}`}
      style={{
        gridArea: "1/1",
        transformOrigin: "50% 100%",
      }}
    >
      {/* settled active figure */}
      <figure aria-hidden="true" className="-fit absolute inset-0">
        <img
          src={PLACES[shown]}
          alt={PLACE_NAMES[shown]}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </figure>

      {/* wipe-in entering figure */}
      {swap && (
        <motion.figure
          key={swap.id}
          aria-hidden="true"
          className="-fit absolute inset-0"
          style={{ zIndex: 3 }}
          initial={{
            clipPath: swap.dir === 1 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
          }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: 0.9, ease: EASE }}
          onAnimationComplete={() => onSwapComplete(swap)}
        >
          <motion.img
            src={PLACES[swap.idx]}
            alt={PLACE_NAMES[swap.idx]}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ originX: 1, originY: 0.5 }}
            initial={{ scaleX: 1.5, scaleY: 1.2 }}
            animate={{ scaleX: 1, scaleY: 1 }}
            transition={{ duration: 1.5, ease: EASE }}
          />
        </motion.figure>
      )}
    </div>
  );
}

/**
 * `.sequesnce-nav` — place-name + prev/next/order in a 6-col grid row
 * with top border. Buttons are circles with a yellow fill sweep and two
 * stacked arrows rotating around `50% 400%` on hover; the next button
 * carries the scroll-driven conic ring (`--slide-progress`).
 */
function Nav({
  active,
  slideDeg,
  onPrev,
  onNext,
  className,
}: {
  active: number;
  slideDeg: MotionValue<string>;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  const arrow = "transition-[rotate] duration-[1200ms] ease-f-cubic-in group-hover:duration-[900ms] group-hover:ease-f-cubic [transform-origin:50%_400%]";
  return (
    <div className={className}>
      <PlaceName
        name={PLACE_NAMES[active]}
        active={active}
        className="ml-gap"
      />

      <div className="grid grid-cols-6 gap-gap border-t border-yellow/20 pt-[calc(var(--g-gap)/2)]">
        <button
          type="button"
          aria-label="Previous place"
          onClick={onPrev}
          className="group relative z-0 grid place-items-center justify-self-center overflow-hidden rounded-full bg-black p-4 [clip-path:circle(calc(50%_-_1px)_at_50%)] col-start-2 lg:col-start-3"
        >
          <span className="pointer-events-none absolute inset-0 z-[1] origin-bottom rounded-full bg-yellow [scale:1_0] transition-[scale] duration-[1200ms] ease-f-cubic-in group-hover:[scale:1_1] group-hover:duration-[900ms] group-hover:ease-f-cubic" />
          <Arrow d={ARROW_LEFT} direction={-1} className={`relative z-[1] w-10 fill-yellow [rotate:calc(0deg*var(--direction))] ${arrow} group-hover:[rotate:calc(90deg*var(--direction))]`} />
          <Arrow d={ARROW_LEFT} direction={-1} className={`relative z-[1] w-10 fill-black [rotate:calc(-90deg*var(--direction))] ${arrow} group-hover:[rotate:calc(0deg*var(--direction))]`} />
        </button>

        <button
          type="button"
          aria-label="Next place"
          onClick={onNext}
          className="group relative z-0 grid place-items-center justify-self-center overflow-hidden rounded-full bg-black p-4 [clip-path:circle(calc(50%_-_1px)_at_50%)] col-start-4"
          style={
            {
              backgroundImage:
                "linear-gradient(to bottom, transparent 5%, var(--c-yellow) 5%, var(--c-yellow) 10%, transparent 10%)",
              backgroundPosition: "50%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1px 100%",
            } as CSSProperties
          }
        >
          <span className="pointer-events-none absolute inset-0 z-[1] origin-bottom rounded-full bg-yellow [scale:1_0] transition-[scale] duration-[1200ms] ease-f-cubic-in group-hover:[scale:1_1] group-hover:duration-[900ms] group-hover:ease-f-cubic" />
          <span
            className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-[600ms] ease-f-cubic group-hover:opacity-0"
            style={{
              padding: 2,
              boxSizing: "border-box",
              backgroundImage:
                "conic-gradient(from 0deg, var(--c-black), var(--c-yellow) calc(var(--slide-progress, 0deg)), transparent 0)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          <Arrow d={ARROW_RIGHT} direction={1} className={`relative z-[1] w-10 fill-yellow [rotate:calc(0deg*var(--direction))] ${arrow} group-hover:[rotate:calc(90deg*var(--direction))]`} />
          <Arrow d={ARROW_RIGHT} direction={1} className={`relative z-[1] w-10 fill-black [rotate:calc(-90deg*var(--direction))] ${arrow} group-hover:[rotate:calc(0deg*var(--direction))]`} />
        </button>

        {/* order — 01 / 07 ring */}
        <div className="relative grid place-items-center justify-self-center p-4 -h5 col-start-5 col-span-2 [translate:0_calc(-100%_-_var(--h5))] lg:col-start-6 lg:col-span-1 lg:[translate:0_0]">
          <span className="absolute inset-0 rounded-full border border-yellow/20" />
          <span className="absolute -inset-[10%] rounded-full border border-yellow/10" />
          <span className="flex">
            <span>{String(active + 1).padStart(2, "0")}</span>
            <span className="text-yellow/40">/{COUNT}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Obsidian `c-places` — exact Tailwind port of the home-page sequence:
 * path SVG, Explore/Places title (masked second line), mobile-only
 * caption, sticky story (400vh) with the 6-photo grid flying out of the
 * 12×20 virtual grid while the centre card clips open (inset 25%×30% →
 * full, scale .75 → 1), swaps place images per scroll travel with the
 * source wipe semantics, then closes into a centre band via the eased
 * `--progress-ending`.
 */
export default function PlacesGrid() {
  const { ref, progress } = useSectionProgress({
    offset: ["start start", "end end"],
  });

  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isDesktop = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches;

  /* sc = min(--progress * 2, 1) — entry half of the travel. */
  const sc = useTransform(progress, (v: number) => Math.min(v * 2, 1));

  /* --progress-ending — eased exit (progress-end, cubic-bezier(.6,.45,.44,1.02)). */
  const ending = useTransform(progress, [0.5, 1], [0, 1], {
    ease: cubicBezier(0.6, 0.45, 0.44, 1.02),
  });

  /* `.sequence-container` clip — inset(25% + gap/4 x, 30% - gap/1.5 y) → 0. */
  const winClip = useTransform(sc, (s: number) => {
    const k = (1 - s).toFixed(4);
    return `inset(calc((30% - var(--g-gap)/1.5)*${k} + var(--g-gap)) calc((25% + var(--g-gap)/4)*${k}) calc((30% - var(--g-gap)/1.5)*${k} + var(--g-gap)) calc((25% + var(--g-gap)/4)*${k}) round 0.4rem)`;
  });

  /* `.sequence-controller` exit band — inset(50%e + gap, 41.66667%e + gap/2.5). */
  const bandClip = useTransform(ending, (e: number) => {
    const k = e.toFixed(4);
    return `inset(calc(50%*${k} + var(--g-gap)) calc((41.66667% + var(--g-gap)/2.5)*${k}) var(--g-gap) calc((41.66667% + var(--g-gap)/2.5)*${k}) round calc((var(--col) + var(--g-gap)/2)*${k} + 0.4rem) calc((var(--col) + var(--g-gap)/2)*${k} + 0.4rem) 0.4rem 0.4rem)`;
  });

  /* `.sequence-controller` scale .75 → 1. */
  const ctrlScale = useTransform(sc, (s: number) => 0.75 + 0.25 * s);
  /* controller figures settle at scale(1 - --progress-ending / 2). */
  const figScale = useTransform(ending, (e: number) => 1 - e / 2);
  /* nav rises from below: translate3d(0, -35vh - (-35vh + h0)*progress, 0). */
  const navY = useTransform(progress, (p: number) => {
    const k = p.toFixed(4);
    return `calc(${(35 * (p - 1)).toFixed(3)}vh - ${k}*var(--h0))`;
  });

  /* next-button ring sweep. */
  const slideDeg = useTransform(progress, (v: number) => {
    const t = Math.min(COUNT - 1, v * (COUNT - 1));
    const seg = t - Math.floor(t);
    return `${(seg * 360).toFixed(2)}deg`;
  });

  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [swap, setSwap] = useState<Swap | null>(null);
  const activeRef = useRef(0);
  const dirRef = useRef<1 | -1>(1);
  const swapSeq = useRef(0);

  const goTo = (next: number) => {
    const cur = activeRef.current;
    if (next === cur) return;
    dirRef.current = next > cur ? 1 : -1;
    activeRef.current = next;
    setActive(next);
    setSwap((prev) => ({
      id: prev ? prev.id + 1 : ++swapSeq.current,
      idx: next,
      dir: dirRef.current,
    }));
  };

  const completeSwap = (s: Swap) => {
    setShown(s.idx);
    setSwap((prev) => (prev?.id === s.id ? null : prev));
  };

  /* initial load-in reveal for the first room. */
  useEffect(() => {
    const t = setTimeout(() => {
      dirRef.current = 1;
      setSwap({ id: ++swapSeq.current, idx: 0, dir: 1 });
    }, 400);
    return () => clearTimeout(t);
  }, []);

  /* scroll drives the active room (desktop sticky only). */
  useMotionValueEvent(progress, "change", (v: number) => {
    if (!isDesktop()) return;
    const next = Math.min(COUNT - 1, Math.max(0, Math.round(v * (COUNT - 1))));
    if (next !== activeRef.current) goTo(next);
  });

  const handleNav = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    if (!isDesktop()) {
      goTo((activeRef.current + dir + COUNT) % COUNT);
      return;
    }
    const travel = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(
      top + ((activeRef.current + dir + COUNT) % COUNT) * (travel / (COUNT - 1)),
    );
  };

  return (
    <section
      ref={ref}
      className="relative bg-black pb-gap text-yellow lg:pb-0"
    >
      {/* places-path */}
      <svg
        className="pointer-events-none absolute left-0 right-0 top-[-var(--large)] z-[1] w-full"
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ aspectRatio: "1440 / 1600" }}
      >
        <linearGradient id="places-path-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15141500" />
          <stop offset=".5" stopColor="#7b5136" />
          <stop offset="1" stopColor="#15141500" />
        </linearGradient>
        <path
          d={PATH_D}
          fill="none"
          stroke="url(#places-path-gradient)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* title */}
      <div className="relative z-[2] flex flex-col items-center justify-end text-center">
        <span className="-lrg relative">Explore</span>
        <span
          className="-lrg relative m-[-1em] p-[1em]"
          style={{
            WebkitMaskImage:
              "linear-gradient(180deg, #000 40%, transparent 65%)",
            maskImage: "linear-gradient(180deg, #000 40%, transparent 65%)",
          }}
        >
          Places
        </span>
      </div>

      {/* caption — mobile only (desktop collapses to height 0) */}
      <span className="relative z-[3] -h5 -m-h6 flex flex-col items-center justify-start text-center lg:h-0 lg:overflow-hidden">
        <span className="block -translate-x-[0.25em]">Not</span>
        <span className="block translate-x-[2em]">Everything</span>
        <span className="block -translate-x-[0.5em]">is Visible</span>
      </span>

      {/* places-story */}
      <div className="relative w-full [contain:paint_layout]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-[20vh] w-full bg-[linear-gradient(to_bottom,var(--c-black),transparent)]" />

        {/* gl — sticky relief layer */}
        <div className="relative z-0 flex h-0 items-start lg:sticky lg:top-0">
          <div
            className="h-screen w-full"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(123,81,54,0.10), transparent 55%)",
            }}
          />
        </div>

        {/* -w */}
        <div className="relative z-[2] mt-[var(--h5)] lg:mt-0">
          {/* sticky-container — 400vh */}
          <div className="relative lg:h-[400vh]">
            {/* -gc — 12 × 20 virtual grid, sticky viewport */}
            <div className="relative grid h-[60vh] grid-cols-1 gap-gap lg:sticky lg:top-0 lg:h-screen lg:grid-cols-12 lg:grid-rows-[repeat(20,minmax(0,1fr))]">
              {/* flying thumbnails */}
              {SLOTS.map((slot, i) => (
                <motion.figure
                  key={i}
                  aria-hidden="true"
                  className={`-fit relative hidden overflow-hidden rounded-obs will-change-transform lg:block ${slot.cls}`}
                  style={{
                    x: useTransform(sc, (s: number) =>
                      `${(s * slot.fx).toFixed(3)}vw`,
                    ),
                    y: useTransform(sc, (s: number) =>
                      `${(s * slot.fy).toFixed(3)}vh`,
                    ),
                  }}
                >
                  <img
                    src={PLACES[i + 1]}
                    alt={PLACE_NAMES[i + 1]}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </motion.figure>
              ))}

              {/* sequence-container */}
              <motion.div
                className="relative col-start-1 row-start-1 col-span-1 row-span-1 h-full overflow-hidden rounded-obs lg:col-span-12 lg:row-span-20 lg:rounded-none"
                style={desktop ? { clipPath: winClip } : undefined}
              >
                {/* sequence-controller */}
                <motion.div
                  className="grid h-full w-full place-items-center will-change-transform"
                  style={
                    desktop
                      ? { clipPath: bandClip, scale: ctrlScale }
                      : undefined
                  }
                >
                  <motion.div
                    className="h-full w-full will-change-transform"
                    style={desktop ? { scale: figScale } : undefined}
                  >
                    <CardView
                      shown={shown}
                      swap={swap}
                      onSwapComplete={completeSwap}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* sequesnce-nav */}
              <motion.div
                className="relative z-20 col-start-1 row-start-1 col-span-1 row-span-1 mb-[var(--h5)] self-end lg:col-start-4 lg:col-span-6 lg:row-span-20 lg:mb-0"
                style={desktop ? { y: navY } : undefined}
              >
                <Nav
                  active={active}
                  slideDeg={slideDeg}
                  onPrev={() => handleNav(-1)}
                  onNext={() => handleNav(1)}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}