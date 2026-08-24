"use client";

import { useState } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  useSpring,
  useReducedMotion,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import { IMG } from "@/data/images";
import { services, type Service } from "@/data/services";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { scrollToY } from "@/lib/scroll";

/* -------------------------------------------------------------------------- */
/*  PALETTE — literal obsidian: near-black stone, warm cream ink, gilt edge   */
/* -------------------------------------------------------------------------- */
const INK = "#f2e9d8";
const INK_DIM = "rgba(242,233,216,0.55)";
const BG = "#0b0907";
const GOLD = "#c9a463";

const CARD_IMG: Record<string, string> = {
  "01": IMG.welcomeBg,
  "02": IMG.object2,
  "03": IMG.map,
  "04": IMG.object4,
};

const ROMAN = ["I", "II", "III", "IV"];
const LUX_GLIDE = [0.65, 0, 0.35, 1] as const;

/* -------------------------------------------------------------------------- */
/*  GRAIN — cheap SVG noise for material texture on a flat black field        */
/* -------------------------------------------------------------------------- */
function Grain() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-40 opacity-[0.06] mix-blend-overlay">
      <svg width="100%" height="100%">
        <filter id="grain-type">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-type)" />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  REVEAL CHAR — the signature move. Each glyph is cut from the object's own */
/*  photograph via background-clip:text with background-attachment:fixed, so */
/*  every letter shows the correct slice of one continuous image regardless  */
/*  of where it sits on screen — the word reads as carved from the material, */
/*  not printed over it. Reveal is scroll-scrubbed per glyph: opacity, lift,  */
/*  blur-to-focus, a slight 3D tilt settling flat, and tracking contracting  */
/*  in — all driven by exact scroll position, not a timer.                   */
/* -------------------------------------------------------------------------- */
function RevealChar({
  ch,
  index,
  reveal,
  imgUrl,
}: {
  ch: string;
  index: number;
  reveal: MotionValue<number>;
  imgUrl: string;
}) {
  const opacity = useTransform(reveal, [index - 0.55, index], [0, 1]);
  const y = useTransform(reveal, [index - 0.55, index], [28, 0]);
  const blurPx = useTransform(reveal, [index - 0.55, index], [8, 0]);
  // Blur composes with a fixed grayscale/contrast/brightness pass so the
  // photo reads as toned material rather than a raw snapshot behind glass.
  const filter = useTransform(blurPx, (b) => `blur(${b}px) grayscale(0.35) contrast(1.15) brightness(0.92)`);
  const rotateX = useTransform(reveal, [index - 0.55, index], [-24, 0]);
  const tracking = useTransform(reveal, [index - 0.55, index], [7, 0]);
  const letterSpacing = useTransform(tracking, (t) => `${t}px`);

  if (ch === " ") return <span className="inline-block w-[0.28em]" />;

  return (
    <motion.span
      style={{
        opacity,
        y,
        filter,
        rotateX,
        letterSpacing,
        display: "inline-block",
        backgroundImage: `linear-gradient(rgba(11,9,7,0.35), rgba(11,9,7,0.35)), url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        WebkitTextStroke: "0.4px rgba(201,164,99,0.35)",
      }}
    >
      {ch}
    </motion.span>
  );
}

/* -------------------------------------------------------------------------- */
/*  KINETIC HEADLINE                                                          */
/* -------------------------------------------------------------------------- */
function KineticHeadline({ service, reveal }: { service: Service; reveal: MotionValue<number> }) {
  const words = service.title.split(" ");
  let cursor = 0;
  const imgUrl = CARD_IMG[service.index];
  return (
    <h2
      className="font-serif text-[11vw] font-light leading-[0.92] tracking-tight md:text-[7.5vw]"
      style={{ perspective: 1400 }}
    >
      {words.map((word, wi) => {
        const chars = word.split("");
        const startIndex = cursor;
        cursor += word.length + 1;
        return (
          <span key={`${service.index}-w${wi}`} className="mr-[0.22em] inline-block" style={{ transformStyle: "preserve-3d" }}>
            {chars.map((ch, ci) => (
              <RevealChar key={`${service.index}-${wi}-${ci}`} ch={ch} index={startIndex + ci} reveal={reveal} imgUrl={imgUrl} />
            ))}
          </span>
        );
      })}
    </h2>
  );
}

/* -------------------------------------------------------------------------- */
/*  MARQUEE                                                                    */
/* -------------------------------------------------------------------------- */
function ModeMarquee() {
  const line = services.map((s) => s.title).join("   \u2014   ");
  return (
    <div className="relative w-full overflow-hidden border-t" style={{ borderColor: "rgba(242,233,216,0.12)" }}>
      <div
        className="motion-safe:animate-[marquee_38s_linear_infinite] flex w-max whitespace-nowrap py-3 font-mono text-[10px] uppercase tracking-[0.35em]"
        style={{ color: INK_DIM }}
      >
        <span className="pr-8">{line}</span>
        <span className="pr-8">{line}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ROOT: ONE STICKY TYPOGRAPHIC SEQUENCE, FOUR CHAPTERS                      */
/* -------------------------------------------------------------------------- */
export default function Objects() {
  const reduceMotion = useReducedMotion();
  const { ref, progress } = useSectionProgress({ offset: ["start start", "end end"] });
  const smoothProgress = useSpring(progress, { stiffness: 70, damping: 24, mass: 0.6 });

  const [active, setActive] = useState(0);
  const chapters = services.length;
  const span = 1 / chapters;

  useMotionValueEvent(smoothProgress, "change", (v) => {
    const idx = Math.min(chapters - 1, Math.max(0, Math.floor(v / span)));
    setActive(idx);
  });

  const revealCount = useTransform(smoothProgress, (v) => {
    const idx = Math.min(chapters - 1, Math.max(0, Math.floor(v / span)));
    const localT = (v - idx * span) / span;
    const revealT = reduceMotion ? 1 : Math.min(1, Math.max(0, (localT - 0.02) / 0.42));
    return revealT * services[idx].title.length;
  });

  const underlineScale = useTransform(smoothProgress, (v) => {
    const idx = Math.min(chapters - 1, Math.max(0, Math.floor(v / span)));
    const localT = (v - idx * span) / span;
    return reduceMotion ? 1 : Math.min(1, Math.max(0, (localT - 0.05) / 0.4));
  });

  const descOpacity = useTransform(smoothProgress, (v) => {
    const idx = Math.min(chapters - 1, Math.max(0, Math.floor(v / span)));
    const localT = (v - idx * span) / span;
    if (localT < 0.5) return 0;
    if (localT < 0.6) return (localT - 0.5) / 0.1;
    if (localT < 0.85) return 1;
    if (localT < 0.95) return 1 - (localT - 0.85) / 0.1;
    return 0;
  });
  const descY = useTransform(descOpacity, [0, 1], [14, 0]);

  const railY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const finaleOpacity = useTransform(smoothProgress, [0.94, 1], [0, 1]);
  const finaleY = useTransform(smoothProgress, [0.94, 1], [24, 0]);

  const jumpToChapter = (i: number) => {
    const el = ref.current as unknown as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const target = top + i * span * el.offsetHeight + 40;
    scrollToY(target);
  };

  const service = services[active];

  return (
    <section
      ref={ref}
      id="objects"
      data-header-color="light"
      className="relative h-[560vh] antialiased"
      style={{ backgroundColor: BG }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden p-6 md:p-12">
        <Grain />
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: `radial-gradient(60vw 60vh at 50% 50%, rgba(201,164,99,0.06), transparent 70%)` }}
        />

        {/* Top HUD */}
        <div
          className="z-20 flex items-baseline justify-between border-b pb-4 font-mono text-[9px] uppercase tracking-[0.3em]"
          style={{ borderColor: "rgba(242,233,216,0.15)", color: INK_DIM }}
        >
          <span>Origin Objects</span>
          <span>Scroll to read</span>
        </div>

        {/* Vertical progress rail with clickable chapter ticks */}
        <div className="pointer-events-auto absolute right-6 top-1/2 z-30 hidden h-[38vh] -translate-y-1/2 md:block md:right-10">
          <div className="relative h-full w-px" style={{ backgroundColor: "rgba(242,233,216,0.15)" }}>
            <motion.div
              className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ top: railY, backgroundColor: GOLD, boxShadow: `0 0 12px ${GOLD}` }}
            />
            {services.map((s, i) => (
              <button
                key={s.index}
                type="button"
                onClick={() => jumpToChapter(i)}
                aria-label={`Jump to ${s.title}`}
                className="group absolute left-1/2 flex -translate-x-1/2 items-center"
                style={{ top: `${(i / chapters) * 100}%` }}
              >
                <span
                  className="block h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{ backgroundColor: active === i ? GOLD : "rgba(242,233,216,0.35)" }}
                />
                <span
                  className="pointer-events-none absolute right-4 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.25em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: INK_DIM }}
                >
                  {s.index}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: the kinetic, image-filled headline */}
        <div className="relative z-20 flex flex-1 flex-col items-center justify-center text-center">
          <span className="mb-5 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: GOLD }}>
            Object {ROMAN[active]} &middot; 0{active + 1} / 0{chapters}
          </span>

          <div className="max-w-[92vw]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={service.index}
                initial={{ clipPath: "inset(0 0 0 0%)" }}
                animate={{ clipPath: "inset(0 0 0 0%)" }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.55, ease: LUX_GLIDE }}
              >
                <KineticHeadline service={service} reveal={revealCount} />
              </motion.div>
            </AnimatePresence>

            <motion.div
              aria-hidden="true"
              style={{ scaleX: underlineScale, backgroundColor: GOLD }}
              className="mx-auto mt-6 h-px w-40 origin-center md:w-56"
            />

            <motion.p
              style={{ opacity: descOpacity, y: descY, color: INK_DIM }}
              className="mx-auto mt-7 max-w-md text-xs font-normal leading-relaxed md:text-sm"
            >
              {service.description}
            </motion.p>
          </div>
        </div>

        {/* Bottom: marquee ticker */}
        <div className="z-20">
          <ModeMarquee />
        </div>

        {/* Finale — a foil-stamped headline, catching light as it settles */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center text-center"
          style={{ opacity: finaleOpacity, y: finaleY, backgroundColor: BG }}
        >
          <span className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: "rgba(242,233,216,0.5)" }}>
            Principle
          </span>
          <h2
            className="font-serif text-[8vw] font-light leading-[0.9] motion-safe:animate-[foil-sweep_6s_ease-in-out_infinite]"
            style={{
              backgroundImage: `linear-gradient(100deg, ${INK} 20%, ${GOLD} 40%, #fff8e7 50%, ${GOLD} 60%, ${INK} 80%)`,
              backgroundSize: "220% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            In Motion,
            <br />
            <em>Always.</em>
          </h2>
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: LUX_GLIDE }}
            className="mt-6 h-px w-24 origin-center"
            style={{ backgroundColor: GOLD }}
          />
          <motion.button
            type="button"
            data-cursor="link"
            onClick={() => window.dispatchEvent(new Event("wavex:open-admission"))}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="group pointer-events-auto relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-[0.2rem] border px-7 py-3 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-500"
            style={{ borderColor: INK, color: INK }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0"
              style={{ backgroundColor: GOLD }}
            />
            <span className="relative transition-colors duration-500 group-hover:text-[#0b0907]">
              Request Access &rarr;
            </span>
          </motion.button>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes foil-sweep {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}