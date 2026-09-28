"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

/**
 * OriginObjectsScrollSequence — re-themed to obsidian hero
 * -------------------------------------------------------
 * Shares Welcome hero tokens: var(--c-black) #151415, var(--c-yellow) #f1eade,
 * var(--c-brown) #7b5136, var(--c-stroke) #9faf9b, --font-t-2 Voyage-Regular,
 * --font-mono JetBrains. Same char reveal physics as welcome.css `-splitted`.
 * Pinned sticky scrub: letters -> cards grow -> cards shrink -> tagline.
 * Fully responsive: 320 -> 4K 2560 + landscape + reduced-motion.
 */

type Card = { src: string; alt: string; caption?: string };

interface Props {
  headline?: string;
  cards?: Card[];
  tagline?: string;
  scrollSpan?: string;
}

const DEFAULT_CARDS: Card[] = [
  { src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80", alt: "Web Design" },
  { src: "https://images.unsplash.com/photo-1555066931-4365d14431b9?w=600&q=80", alt: "Web Development" },
  { src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80", alt: "UI/UX Design" },
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", alt: "Digital Strategy" },
];

const LETTER_START = 0.03;
const LETTER_END = 0.28;
const GROW_START = 0.32;
const GROW_END = 0.56;
const SHRINK_START = 0.62;
const SHRINK_END = 0.88;
const TAG_START = 0.93;
const TAG_END = 1.0;

function useWindowWidth() {
  const [ww, setWw] = useState<number>(() => {
    if (typeof window !== "undefined") return window.innerWidth;
    return 1024;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWw(window.innerWidth));
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return ww;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);
  return reduced;
}

function getDesktopCardMetrics(vw: number, cardCount: number) {
  const count = Math.max(cardCount, 1);
  let total: number;
  // Conservative totals for tablet to prevent overflow with words
  if (vw < 1024) total = Math.min(vw * 0.48, 560);
  else if (vw < 1440) total = Math.min(vw * 0.46, 780);
  else if (vw < 1920) total = Math.min(vw * 0.44, 960);
  else total = Math.min(vw * 0.42, 1180);
  const slot = total / count;
  const margin = Math.max(Math.round(slot * 0.07), 6);
  const width = Math.max(Math.round(slot - margin * 2), 88);
  return { fullWidth: width, fullMargin: margin };
}

export default function OriginObjectsScrollSequence({
  headline = "Our Services",
  cards = DEFAULT_CARDS,
  tagline = "Build. Launch. Grow.",
  scrollSpan = "500vh",
}: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const windowWidth = useWindowWidth();
  const prefersReduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const words = useMemo(() => headline.trim().split(/\s+/), [headline]);
  const totalChars = useMemo(() => headline.replace(/\s/g, "").length, [headline]);

  const { fullWidth, fullMargin } = useMemo(
    () => getDesktopCardMetrics(windowWidth, cards.length),
    [windowWidth, cards.length]
  );

  const tagOpacity = useTransform(scrollYProgress, [TAG_START, TAG_END], [0, 1]);
  const tagY = useTransform(scrollYProgress, [TAG_START, TAG_END], prefersReduced ? [0, 0] : [10, 0]);

  const desktopLeft = words[0] ?? "";
  const desktopRight = words.slice(1).join(" ");
  const desktopLeftNonSpace = desktopLeft.replace(/\s/g, "").length;

  const splitAt = Math.max(1, Math.ceil(words.length / 2));
  const mobileTop = words.slice(0, splitAt).join(" ");
  const mobileBottom = words.slice(splitAt).join(" ");
  const mobileTopNonSpace = mobileTop.replace(/\s/g, "").length;

  const isCustomHeight = scrollSpan !== "500vh";

  return (
    <section
      ref={sectionRef}
      id="origin"
      data-header-color="light"
      style={isCustomHeight ? { height: scrollSpan } : undefined}
      className={`relative bg-black ${!isCustomHeight ? "h-[360vh] min-[360px]:h-[380vh] sm:h-[400vh] md:h-[460vh] lg:h-[500vh] xl:h-[500vh]" : ""}`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (max-height: 600px) and (orientation: landscape) {
            #origin .origin-sticky { height: 100svh; min-height: 340px; padding-top: 12px; padding-bottom: 12px; }
            #origin .origin-desktop-row { gap: 0.5rem !important; padding-top: 0.25rem; padding-bottom: 0.25rem; }
            #origin .origin-mobile-stack { gap: 8px !important; padding-top: 8px; padding-bottom: 8px; }
            #origin .origin-card-desktop { height: 26vh !important; min-height: 64px !important; max-height: 200px !important; }
            #origin .origin-mobile-grid { gap: 8px !important; max-width: 380px !important; }
            #origin .origin-mobile-card { max-height: 22vh !important; min-height: 88px !important; }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            #origin .origin-desktop-row { gap: 6px !important; }
          }
          @media (max-width: 360px) {
            #origin .origin-mobile-grid { max-width: 280px !important; gap: 8px !important; }
            #origin .origin-sticky { padding-left: 8px; padding-right: 8px; }
          }
          @media (min-width: 1920px) {
            #origin .origin-desktop-row { max-width: 2000px; }
          }
          @media (min-width: 2560px) {
            #origin .origin-desktop-row { max-width: 2200px; }
          }
          /* Ensure no horizontal scroll */
          #origin { overflow-x: clip; }
        `,
        }}
      />

      <div className="origin-sticky sticky top-0 flex min-h-[100svh] h-[100svh] h-[100dvh] md:h-screen w-full flex-col items-center justify-center overflow-hidden bg-black supports-[height:100dvh]:h-[100dvh] py-4 sm:py-6 md:py-0">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 35%, rgba(var(--c-black-rgb),0.85) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(var(--c-yellow-rgb),0.12)] to-transparent"
          aria-hidden="true"
        />

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 w-[160px] min-[360px]:w-[200px] sm:w-[280px] md:w-[380px] lg:w-[440px] 2xl:w-[520px] max-w-[52vw] sm:max-w-[42vw] -translate-y-1 sm:-translate-y-4 opacity-[0.16] sm:opacity-20 md:opacity-30 z-10"
          viewBox="0 0 420 120"
          fill="none"
        >
          <path d="M0 40C90 40 150 0 260 8C330 13 380 40 420 30" stroke="rgba(var(--c-stroke-rgb),0.45)" strokeWidth="1" />
        </svg>

        {/* DESKTOP / TABLET */}
        <div className="origin-desktop-row relative z-10 hidden w-full max-w-[1700px] items-center justify-center gap-1 md:flex md:gap-1.5 lg:gap-2.5 xl:gap-3 px-2 sm:px-3 md:px-6 lg:px-10 2xl:px-8">
          <WordBlock
            word={desktopLeft}
            charOffset={0}
            totalChars={totalChars}
            progress={scrollYProgress}
            variant="desktop"
            reduced={prefersReduced}
          />

          {cards.map((card, i) => (
            <DesktopCard
              key={`d-${card.src}-${i}`}
              card={card}
              index={i}
              total={cards.length}
              progress={scrollYProgress}
              fullWidth={fullWidth}
              fullMargin={fullMargin}
              reduced={prefersReduced}
            />
          ))}

          {desktopRight ? (
            <WordBlock
              word={desktopRight}
              charOffset={desktopLeftNonSpace}
              totalChars={totalChars}
              progress={scrollYProgress}
              variant="desktop"
              reduced={prefersReduced}
            />
          ) : null}
        </div>

        {/* MOBILE */}
        <div className="origin-mobile-stack relative z-10 flex w-full flex-col items-center justify-center gap-[clamp(8px,1.6vh,16px)] px-3 min-[360px]:px-4 sm:px-6 md:hidden">
          <WordBlock
            word={mobileTop}
            charOffset={0}
            totalChars={totalChars}
            progress={scrollYProgress}
            variant="mobile"
            reduced={prefersReduced}
            align="center"
          />

          <div className="origin-mobile-grid grid w-[min(92vw,340px)] min-[360px]:w-[min(88vw,360px)] sm:w-[min(86vw,400px)] grid-cols-2 gap-2 min-[360px]:gap-2.5 sm:gap-3">
            {cards.map((card, i) => (
              <MobileCard
                key={`m-${card.src}-${i}`}
                card={card}
                index={i}
                total={cards.length}
                progress={scrollYProgress}
                reduced={prefersReduced}
              />
            ))}
          </div>

          {mobileBottom ? (
            <WordBlock
              word={mobileBottom}
              charOffset={mobileTopNonSpace}
              totalChars={totalChars}
              progress={scrollYProgress}
              variant="mobile"
              reduced={prefersReduced}
              align="center"
            />
          ) : null}
        </div>

        <motion.div
          style={{ opacity: tagOpacity, y: tagY } as any}
          className="relative z-10 mt-[clamp(10px,1.8vh,24px)] inline-flex max-w-[92vw] items-center justify-center rounded-full border border-[rgba(var(--c-yellow-rgb),0.14)] bg-[rgba(var(--c-yellow-rgb),0.06)] px-3 min-[360px]:px-4 sm:px-5 py-1.5 sm:py-2 backdrop-blur-md text-center"
        >
          <span
            className="-mm -up font-mono text-[9px] min-[360px]:text-[10px] sm:text-[11px] lg:text-xs font-medium tracking-[0.16em] min-[360px]:tracking-[0.2em] sm:tracking-[0.28em] text-yellow/70"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {tagline}
          </span>
        </motion.div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] min-[360px]:h-[10vh] sm:h-[12vh] md:h-[16vh] z-10"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(var(--c-black-rgb),0.55) 60%, var(--c-black) 100%)",
          }}
        />
      </div>
    </section>
  );
}

function WordBlock({
  word,
  charOffset,
  totalChars,
  progress,
  variant = "desktop",
  reduced = false,
  align = "left",
}: {
  word: string;
  charOffset: number;
  totalChars: number;
  progress: MotionValue<number>;
  variant?: "desktop" | "mobile";
  reduced?: boolean;
  align?: "left" | "center";
}) {
  if (!word) return null;
  let nonSpaceIdx = 0;
  const isMobile = variant === "mobile";
  return (
    <span
      className={`flex shrink-0 ${isMobile ? "flex-wrap justify-center text-center max-w-full gap-x-[0.02em]" : "whitespace-nowrap justify-center"} ${align === "center" ? "justify-center" : ""}`}
    >
      {word.split("").map((char, ci) => {
        if (char === " ") {
          return (
            <span key={`sp-${ci}`} className={isMobile ? "w-[0.32em]" : "w-[0.24em]"} aria-hidden="true">
              &nbsp;
            </span>
          );
        }
        const idx = charOffset + nonSpaceIdx;
        nonSpaceIdx += 1;
        return (
          <RevealChar
            key={`${char}-${ci}-${idx}`}
            char={char}
            index={idx}
            total={totalChars}
            progress={progress}
            variant={variant}
            reduced={reduced}
          />
        );
      })}
    </span>
  );
}

function RevealChar({
  char,
  index,
  total,
  progress,
  variant = "desktop",
  reduced = false,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  variant?: "desktop" | "mobile";
  reduced?: boolean;
}) {
  const span = LETTER_END - LETTER_START;
  const perCharStep = span / Math.max(total, 1);
  const charDuration = perCharStep * 5.5;
  const start = LETTER_START + index * perCharStep;
  const end = Math.min(start + charDuration, LETTER_END + charDuration);

  const y = useTransform(progress, [start, end], reduced ? ["0%", "0%"] : ["110%", "0%"]);
  const opacity = useTransform(progress, [start, (start + end) / 2], [0, 1]);
  const blur = useTransform(progress, [start, end], reduced ? [0, 0] : [8, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  const fontSize =
    variant === "mobile"
      ? "clamp(1.65rem, 8.2vw, 2.55rem)"
      : "clamp(1.35rem, 3.5vw, var(--large))";

  return (
    <span className="inline-block overflow-hidden leading-none">
      <motion.span
        style={{ y, opacity, filter } as any}
        className="inline-block select-none leading-[0.92] tracking-tight text-yellow drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
      >
        <span
          className="-lrg"
          style={{
            fontFamily: "var(--font-t-2)",
            fontSize,
            lineHeight: "var(--large-lh)",
            fontWeight: 300,
          }}
        >
          {char}
        </span>
      </motion.span>
    </span>
  );
}

function DesktopCard({
  card,
  index,
  total,
  progress,
  fullWidth = 160,
  fullMargin = 8,
  reduced = false,
}: {
  card: Card;
  index: number;
  total: number;
  progress: MotionValue<number>;
  fullWidth?: number;
  fullMargin?: number;
  reduced?: boolean;
}) {
  const growSpan = GROW_END - GROW_START;
  const growStep = growSpan / total;
  const growDuration = growStep * 2.4;
  const growStart = GROW_START + index * growStep;
  const growEnd = Math.min(growStart + growDuration, GROW_END);

  const shrinkSpan = SHRINK_END - SHRINK_START;
  const shrinkStep = shrinkSpan / total;
  const shrinkDuration = shrinkStep * 2.4;
  const shrinkStart = SHRINK_START + index * shrinkStep;
  const shrinkEnd = Math.min(shrinkStart + shrinkDuration, SHRINK_END);

  const points = [growStart, growEnd, shrinkStart, shrinkEnd];

  const width = useTransform(progress, points, [0, fullWidth, fullWidth, 0]);
  const marginX = useTransform(progress, points, [0, fullMargin, fullMargin, 0]);
  const opacity = useTransform(progress, points, [0, 1, 1, 0]);
  const scale = useTransform(progress, points, reduced ? [1, 1, 1, 1] : [0.82, 1, 1, 0.6]);
  const y = useTransform(progress, points, reduced ? [0, 0, 0, 0] : [28, 0, 0, -18]);

  return (
    <motion.div
      style={{
        width,
        marginLeft: marginX,
        marginRight: marginX,
        opacity,
        y,
        willChange: "transform, width, opacity",
      } as any}
      className="origin-card origin-card-desktop relative hidden md:block shrink-0 overflow-hidden rounded-obs border border-[rgba(var(--c-yellow-rgb),0.12)] bg-stone shadow-[0_20px_60px_rgba(0,0,0,0.7)] h-[clamp(88px,11vw,280px)] min-h-[72px] max-h-[320px] aspect-[22/30] md:aspect-auto md:h-[clamp(84px,10.5vw,300px)] lg:h-[clamp(96px,11vw,320px)]"
    >
      <motion.img
        src={card.src}
        alt={card.alt}
        style={{ scale } as any}
        className="h-full w-full object-cover opacity-90"
        draggable={false}
        loading="lazy"
      />
      <span className="pointer-events-none absolute inset-0 rounded-obs ring-1 ring-white/5" />
    </motion.div>
  );
}

function MobileCard({
  card,
  index,
  total,
  progress,
  reduced = false,
}: {
  card: Card;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  const growSpan = GROW_END - GROW_START;
  const growStep = growSpan / total;
  const growDuration = growStep * 2.2;
  const growStart = GROW_START + index * growStep * 0.65;
  const growEnd = Math.min(growStart + growDuration, GROW_END + 0.04);

  const shrinkSpan = SHRINK_END - SHRINK_START;
  const shrinkStep = shrinkSpan / total;
  const shrinkDuration = shrinkStep * 2.2;
  const shrinkStart = SHRINK_START + index * shrinkStep * 0.65;
  const shrinkEnd = Math.min(shrinkStart + shrinkDuration, SHRINK_END);

  const points = [growStart, growEnd, shrinkStart, shrinkEnd];

  const opacity = useTransform(progress, points, [0, 1, 1, 0]);
  const scale = useTransform(progress, points, reduced ? [1, 1, 1, 1] : [0.86, 1, 1, 0.94]);
  const y = useTransform(progress, points, reduced ? [0, 0, 0, 0] : [20, 0, 0, -8]);
  const filterBlur = useTransform(progress, [growStart, growEnd], reduced ? [0, 0] : [5, 0]);
  const filter = useTransform(filterBlur, (b) => `blur(${b}px)`);

  return (
    <motion.div
      style={{ opacity, y, scale, filter } as any}
      className="origin-card origin-mobile-card relative overflow-hidden rounded-obs border border-[rgba(var(--c-yellow-rgb),0.12)] bg-stone shadow-[0_12px_32px_rgba(0,0,0,0.5)] aspect-[22/30] w-full max-h-[clamp(128px,24vh,176px)] min-h-[108px] sm:max-h-[clamp(140px,26vh,190px)] sm:min-h-[122px]"
    >
      <img
        src={card.src}
        alt={card.alt}
        className="h-full w-full object-cover opacity-90"
        draggable={false}
        loading="lazy"
      />
      <span className="pointer-events-none absolute inset-0 rounded-obs ring-1 ring-white/5" />
    </motion.div>
  );
}
