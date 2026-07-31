"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";

/**
 * AboutWaveX
 * -----------------------------------------------------------------------
 * A single pinned, scroll-scrubbed "About" narrative told in five beats
 * that crossfade into one another as the user scrolls — nothing waits
 * for a timer, everything is driven directly by scroll position, so it's
 * fully reversible (scroll up = the story rewinds exactly).
 *
 *   BEAT 1 — Eyebrow + headline (mask-line reveal)
 *   BEAT 2 — Story paragraph (mask-word reveal)
 *   BEAT 3 — Stat counters that count up as they enter view
 *   BEAT 4 — Closing statement (mask-line reveal) + CTA button
 *   BEAT 5 — Brand tag settles, sequence complete
 *
 * A faint, oversized "WaveX" watermark drifts slowly behind everything
 * (subtle parallax) to keep the brand present without competing with
 * the copy.
 *
 * Install once:
 *   npm install framer-motion
 *
 * Usage:
 *   <AboutWaveX />          // uses sensible defaults
 *   <AboutWaveX headlineLines={[...]} paragraph="..." stats={[...]} />
 * -----------------------------------------------------------------------
 */

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

interface Props {
  eyebrow?: string;
  headlineLines?: string[];
  paragraph?: string;
  stats?: Stat[];
  closingLines?: string[];
  ctaLabel?: string;
  tagline?: string;
  scrollSpan?: string; // total scroll distance for the whole sequence
}

const DEFAULT_STATS: Stat[] = [
  { value: 8, suffix: "+", label: "Years in craft" },
  { value: 120, suffix: "+", label: "Projects shipped" },
  { value: 14, suffix: "", label: "Countries served" },
  { value: 4.9, suffix: "/5", label: "Average rating" },
];

// Phase boundaries — tune the pacing here. Each beat has a small
// crossfade buffer built in around it (see BEAT_FADE below).
const BEAT_FADE = 0.035;
const BEAT1 = [0.02, 0.24] as const; // headline
const BEAT2 = [0.27, 0.47] as const; // paragraph
const BEAT3 = [0.5, 0.7] as const; // stats
const BEAT4 = [0.73, 0.93] as const; // closing + CTA
const TAG_RANGE = [0.94, 1.0] as const;

export default function AboutWaveX({
  eyebrow = "About WaveX",
  headlineLines = ["We don't just design pixels.", "We design momentum."],
  paragraph = "WaveX partners with ambitious founders and brands to turn bold ideas into interfaces people can't stop using. Every project starts with a story, yours, and ends with an experience that moves it forward.",
  stats = DEFAULT_STATS,
  closingLines = ["This isn't just a studio.", "It's where your next chapter gets designed."],
  ctaLabel = "Start your project",
  tagline = "Imagine Possible",
  scrollSpan = "600vh",
}: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // slow ambient drift for the background watermark
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const watermarkOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.92, 1],
    [0, 0.05, 0.05, 0]
  );

  const tagOpacity = useTransform(scrollYProgress, [...TAG_RANGE], [0, 1]);
  const tagY = useTransform(scrollYProgress, [...TAG_RANGE], [10, 0]);

  return (
    <section ref={sectionRef} style={{ height: scrollSpan }} className="relative bg-[#1a1410]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ambient watermark */}
        <motion.div
          aria-hidden="true"
          style={{ y: watermarkY, opacity: watermarkOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        >
          <span
            className="font-serif text-[24vw] leading-none tracking-tighter whitespace-nowrap"
            style={{ color: "transparent", WebkitTextStroke: "1px #f4efe6" }}
          >
            WaveX
          </span>
        </motion.div>

        {/* -------- Beat 1: headline -------- */}
        <Beat progress={scrollYProgress} range={BEAT1}>
          <Eyebrow progress={scrollYProgress} range={BEAT1} text={eyebrow} />
          <MaskLines
            lines={headlineLines}
            progress={scrollYProgress}
            windowStart={BEAT1[0] + 0.03}
            windowEnd={BEAT1[1] - 0.02}
            className="font-serif text-[9vw] leading-[1.02] tracking-tight text-[#f4efe6] sm:text-[6.5vw] md:text-[4.6vw]"
          />
        </Beat>

        {/* -------- Beat 2: paragraph -------- */}
        <Beat progress={scrollYProgress} range={BEAT2}>
          <RevealWords
            text={paragraph}
            progress={scrollYProgress}
            windowStart={BEAT2[0] + 0.02}
            windowEnd={BEAT2[1] - 0.02}
            className="max-w-[46ch] text-center font-serif text-[5.4vw] leading-[1.25] tracking-tight text-[#f4efe6]/90 sm:text-[2.6vw] md:text-[1.9vw]"
          />
        </Beat>

        {/* -------- Beat 3: stats -------- */}
        <Beat progress={scrollYProgress} range={BEAT3}>
          <div className="grid w-full max-w-[1100px] grid-cols-2 gap-y-10 px-8 sm:grid-cols-4 sm:gap-x-6">
            {stats.map((stat, i) => (
              <StatItem
                key={stat.label}
                stat={stat}
                index={i}
                total={stats.length}
                progress={scrollYProgress}
                windowStart={BEAT3[0]}
                windowEnd={BEAT3[1] - 0.05}
              />
            ))}
          </div>
        </Beat>

        {/* -------- Beat 4: closing + CTA -------- */}
        <Beat progress={scrollYProgress} range={BEAT4}>
          <MaskLines
            lines={closingLines}
            progress={scrollYProgress}
            windowStart={BEAT4[0] + 0.02}
            windowEnd={BEAT4[1] - 0.12}
            className="font-serif text-[7.5vw] leading-[1.05] tracking-tight text-[#f4efe6] sm:text-[4.6vw] md:text-[3.2vw]"
          />
          <CtaButton
            label={ctaLabel}
            progress={scrollYProgress}
            windowStart={BEAT4[1] - 0.1}
            windowEnd={BEAT4[1] - 0.01}
          />
        </Beat>

        {/* -------- Landing tag -------- */}
        <motion.div
          style={{ opacity: tagOpacity, y: tagY }}
          className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 inline-flex items-center rounded bg-[#f4efe6] px-3 py-1.5"
        >
          <span className="text-[9px] font-sans font-medium uppercase tracking-[0.25em] text-[#1a1410]">
            {tagline}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */
/* Beat: a full-bleed crossfading story block                           */
/* -------------------------------------------------------------------- */
function Beat({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number];
  children: React.ReactNode;
}) {
  const [start, end] = range;
  const opacity = useTransform(
    progress,
    [start - BEAT_FADE, start, end, end + BEAT_FADE],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start - BEAT_FADE, start, end, end + BEAT_FADE],
    [26, 0, 0, -26]
  );
  const blurAmt = useTransform(
    progress,
    [start - BEAT_FADE, start, end, end + BEAT_FADE],
    [6, 0, 0, 6]
  );
  const filter = useTransform(blurAmt, (b) => `blur(${b}px)`);

  return (
    <motion.div
      style={{ opacity, y, filter }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------- */
/* Eyebrow label with a small expanding rule                            */
/* -------------------------------------------------------------------- */
function Eyebrow({
  progress,
  range,
  text,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number];
  text: string;
}) {
  const [start] = range;
  const opacity = useTransform(progress, [start, start + 0.04], [0, 1]);
  const width = useTransform(progress, [start, start + 0.06], [0, 28]);

  return (
    <motion.div style={{ opacity }} className="flex items-center gap-3">
      <motion.span style={{ width }} className="h-px bg-[#8c7365]" />
      <span className="text-[10px] font-sans font-medium uppercase tracking-[0.3em] text-[#8c7365]">
        {text}
      </span>
    </motion.div>
  );
}

/* -------------------------------------------------------------------- */
/* MaskLines: each full line slides up from behind a clipped mask       */
/* -------------------------------------------------------------------- */
function MaskLines({
  lines,
  progress,
  windowStart,
  windowEnd,
  className,
}: {
  lines: string[];
  progress: MotionValue<number>;
  windowStart: number;
  windowEnd: number;
  className?: string;
}) {
  const step = (windowEnd - windowStart) / Math.max(lines.length, 1);
  const duration = step * 2.2;

  return (
    <div className="flex flex-col items-center">
      {lines.map((line, i) => {
        const start = windowStart + i * step;
        const end = Math.min(start + duration, windowEnd);
        return (
          <div key={i} className="overflow-hidden">
            <LineSpan line={line} start={start} end={end} progress={progress} className={className} />
          </div>
        );
      })}
    </div>
  );
}

function LineSpan({
  line,
  start,
  end,
  progress,
  className,
}: {
  line: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
  className?: string;
}) {
  const y = useTransform(progress, [start, end], ["100%", "0%"]);
  const opacity = useTransform(progress, [start, (start + end) / 2], [0, 1]);
  const blur = useTransform(progress, [start, end], [10, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.span style={{ y, opacity, filter }} className={`inline-block ${className ?? ""}`}>
      {line}
    </motion.span>
  );
}

/* -------------------------------------------------------------------- */
/* RevealWords: each word fades/slides in with a scroll-driven stagger  */
/* -------------------------------------------------------------------- */
function RevealWords({
  text,
  progress,
  windowStart,
  windowEnd,
  className,
}: {
  text: string;
  progress: MotionValue<number>;
  windowStart: number;
  windowEnd: number;
  className?: string;
}) {
  const words = useMemo(() => text.split(" "), [text]);
  const step = (windowEnd - windowStart) / Math.max(words.length, 1);
  const duration = step * 4;

  return (
    <p className={className}>
      {words.map((word, i) => {
        const start = windowStart + i * step;
        const end = Math.min(start + duration, windowEnd);
        return <RevealWord key={i} word={word} start={start} end={end} progress={progress} />;
      })}
    </p>
  );
}

function RevealWord({
  word,
  start,
  end,
  progress,
}: {
  word: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [start, end], [14, 0]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const blur = useTransform(progress, [start, end], [4, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.span style={{ y, opacity, filter, display: "inline-block" }}>
      {word}&nbsp;
    </motion.span>
  );
}

/* -------------------------------------------------------------------- */
/* StatItem: number counts up as its window becomes active              */
/* -------------------------------------------------------------------- */
function StatItem({
  stat,
  index,
  total,
  progress,
  windowStart,
  windowEnd,
}: {
  stat: Stat;
  index: number;
  total: number;
  progress: MotionValue<number>;
  windowStart: number;
  windowEnd: number;
}) {
  const step = (windowEnd - windowStart) / total;
  const start = windowStart + index * step * 0.6;
  const end = start + step * 1.4;

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [20, 0]);
  const countMV = useTransform(progress, [start, end], [0, stat.value]);

  const isDecimal = stat.value % 1 !== 0;
  const [display, setDisplay] = useState("0");

  useMotionValueEvent(countMV, "change", (latest) => {
    setDisplay(isDecimal ? latest.toFixed(1) : Math.round(latest).toString());
  });

  return (
    <motion.div style={{ opacity, y }} className="flex flex-col items-center gap-1.5">
      <span className="font-serif text-[9vw] leading-none text-[#f4efe6] sm:text-[3.6vw] md:text-[2.6vw]">
        {display}
        {stat.suffix}
      </span>
      <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#f4efe6]/60">
        {stat.label}
      </span>
    </motion.div>
  );
}

/* -------------------------------------------------------------------- */
/* CtaButton: settles in after the closing line, with a hover micro-    */
/* interaction (arrow slides, fill wipes) for that final premium beat   */
/* -------------------------------------------------------------------- */
function CtaButton({
  label,
  progress,
  windowStart,
  windowEnd,
}: {
  label: string;
  progress: MotionValue<number>;
  windowStart: number;
  windowEnd: number;
}) {
  const opacity = useTransform(progress, [windowStart, windowEnd], [0, 1]);
  const y = useTransform(progress, [windowStart, windowEnd], [16, 0]);

  return (
    <motion.a
      href="#contact"
      style={{ opacity, y }}
      className="group relative mt-2 inline-flex items-center gap-3 overflow-hidden rounded-full border border-[#f4efe6]/30 px-7 py-3 pointer-events-auto"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-[#f4efe6] transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <span className="relative z-10 text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#f4efe6] transition-colors duration-500 group-hover:text-[#1a1410]">
        {label}
      </span>
      <span className="relative z-10 text-[#f4efe6] transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#1a1410]">
        →
      </span>
    </motion.a>
  );
}