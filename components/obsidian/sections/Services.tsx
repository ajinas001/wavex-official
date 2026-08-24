"use client";

import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

/**
 * OriginObjectsScrollSequence
 * -----------------------------------------------------------------------
 * One pinned, scroll-scrubbed sequence in three connected phases:
 *
 *   PHASE 1 — TEXT BUILD (progress ~0.00 – 0.28)
 *     "Origin Objects" reveals character-by-character. Each character
 *     sits inside an overflow-hidden mask and slides up from behind it
 *     (the classic Awwwards "SplitText" wipe) with a blur-to-focus fade.
 *     The two words sit right next to each other, fully assembled.
 *
 *   PHASE 2 — SPLIT + CARDS GROW IN (progress ~0.32 – 0.58)
 *     Four image cards, seated between the words with zero width, grow
 *     outward (width/opacity/scale) in a left-to-right stagger. Because
 *     they're real flex-layout siblings — not absolutely positioned —
 *     growing their width naturally pushes "Origin" left and "Objects"
 *     right with zero manual x-position math. This is what makes the
 *     split feel physically connected to the cards rather than two
 *     separate animations layered on top of each other.
 *
 *   PHASE 3 — CARDS COLLAPSE + WORDS RECONVERGE (progress ~0.62 – 0.9)
 *     Same mechanism in reverse: each card's width collapses back to 0
 *     (staggered), which pulls the words back together into one
 *     continuous "Origin Objects" wordmark.
 *
 *   LANDING (progress ~0.92 – 1)
 *     The "IMAGINE POSSIBLE" tag fades in beneath the settled title.
 *
 * Install once:
 *   npm install framer-motion
 *
 * Usage:
 *   <OriginObjectsScrollSequence
 *     cards={[{ src: '/1.jpg', alt: '...' }, ...]}
 *   />
 * -----------------------------------------------------------------------
 */

type Card = { src: string; alt: string; caption?: string };

interface Props {
  headline?: string;
  cards?: Card[];
  tagline?: string;
  /** Total scroll distance for the whole sequence. Longer = slower/more deliberate. */
  scrollSpan?: string; // e.g. "500vh"
}

const DEFAULT_CARDS: Card[] = [
  { src: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&q=80", alt: "Origin object one" },
  { src: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=600&q=80", alt: "Origin object two" },
  { src: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80", alt: "Origin object three" },
  { src: "https://images.unsplash.com/photo-1620641622078-de9c50e40d1e?w=600&q=80", alt: "Origin object four" },
];

// Phase boundaries — tune the pacing here.
const LETTER_START = 0.03;
const LETTER_END = 0.28;

const GROW_START = 0.32;
const GROW_END = 0.56;

const SHRINK_START = 0.62;
const SHRINK_END = 0.88;

const TAG_START = 0.93;
const TAG_END = 1.0;

export default function OriginObjectsScrollSequence({
  headline = "Origin Objects",
  cards = DEFAULT_CARDS,
  tagline = "Imagine Possible",
  scrollSpan = "500vh",
}: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const words = useMemo(() => headline.split(" "), [headline]);
  const totalChars = headline.replace(/\s/g, "").length;

  const tagOpacity = useTransform(scrollYProgress, [TAG_START, TAG_END], [0, 1]);
  const tagY = useTransform(scrollYProgress, [TAG_START, TAG_END], [10, 0]);

  return (
    <section ref={sectionRef} style={{ height: scrollSpan }} className="relative">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f1e9dc]">
        {/* decorative corner line — matches brand mark elsewhere on the site */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 left-0 w-[420px] max-w-[45vw] opacity-40"
          viewBox="0 0 420 120"
          fill="none"
        >
          <path d="M0 40C90 40 150 0 260 8C330 13 380 40 420 30" stroke="#8c7365" strokeWidth="1" />
        </svg>

        <div className="flex w-full max-w-[1700px] items-center justify-center px-4">
          {/* -------- Word 1 -------- */}
          <WordBlock
            word={words[0]}
            charOffset={0}
            totalChars={totalChars}
            progress={scrollYProgress}
          />

          {/* -------- Cards, seated between the words -------- */}
          {cards.map((card, i) => (
            <ScrollCard
              key={card.src + i}
              card={card}
              index={i}
              total={cards.length}
              progress={scrollYProgress}
            />
          ))}

          {/* -------- Word 2 -------- */}
          <WordBlock
            word={words[1] ?? ""}
            charOffset={words[0]?.length ?? 0}
            totalChars={totalChars}
            progress={scrollYProgress}
          />
        </div>

        {/* -------- Tagline, lands last -------- */}
        <motion.div
          style={{ opacity: tagOpacity, y: tagY }}
          className="mt-8 inline-flex items-center rounded bg-[#1a1410] px-3 py-1.5"
        >
          <span className="text-[9px] font-sans font-medium uppercase tracking-[0.25em] text-[#f4efe6]">
            {tagline}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */
/* Word: a row of masked, reveal-on-scroll characters                   */
/* -------------------------------------------------------------------- */
function WordBlock({
  word,
  charOffset,
  totalChars,
  progress,
}: {
  word: string;
  charOffset: number;
  totalChars: number;
  progress: MotionValue<number>;
}) {
  return (
    <span className="flex shrink-0 whitespace-nowrap">
      {word.split("").map((char, ci) => (
        <RevealChar
          key={ci}
          char={char}
          index={charOffset + ci}
          total={totalChars}
          progress={progress}
        />
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------- */
/* Character: clipped mask + slide-up + blur-to-focus                   */
/* -------------------------------------------------------------------- */
function RevealChar({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const span = LETTER_END - LETTER_START;
  const perCharStep = span / Math.max(total, 1);
  const charDuration = perCharStep * 5.5; // overlap factor — higher = smoother wave

  const start = LETTER_START + index * perCharStep;
  const end = Math.min(start + charDuration, LETTER_END + charDuration);

  const y = useTransform(progress, [start, end], ["110%", "0%"]);
  const opacity = useTransform(progress, [start, (start + end) / 2], [0, 1]);
  const blur = useTransform(progress, [start, end], [8, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <span className="inline-block overflow-hidden">
      <motion.span
        style={{ y, opacity, filter }}
        className="inline-block select-none font-serif text-[12vw] leading-[0.92] tracking-tight text-[#1a1410] sm:text-[8vw] md:text-[6vw]"
      >
        {char}
      </motion.span>
    </span>
  );
}

/* -------------------------------------------------------------------- */
/* Card: grows in (pushing words apart) then shrinks back (pulling them */
/* back together) — a single 4-point transform captures grow→hold→shrink*/
/* -------------------------------------------------------------------- */
function ScrollCard({
  card,
  index,
  total,
  progress,
}: {
  card: Card;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const FULL_WIDTH = 230;
  const FULL_MARGIN = 18;

  const growSpan = GROW_END - GROW_START;
  const growStep = growSpan / total;
  const growDuration = growStep * 2.4; // overlap for a smooth wave, not a strict cascade
  const growStart = GROW_START + index * growStep;
  const growEnd = Math.min(growStart + growDuration, GROW_END);

  const shrinkSpan = SHRINK_END - SHRINK_START;
  const shrinkStep = shrinkSpan / total;
  const shrinkDuration = shrinkStep * 2.4;
  const shrinkStart = SHRINK_START + index * shrinkStep;
  const shrinkEnd = Math.min(shrinkStart + shrinkDuration, SHRINK_END);

  const points = [growStart, growEnd, shrinkStart, shrinkEnd];

  const width = useTransform(progress, points, [0, FULL_WIDTH, FULL_WIDTH, 0]);
  const marginX = useTransform(progress, points, [0, FULL_MARGIN, FULL_MARGIN, 0]);
  const opacity = useTransform(progress, points, [0, 1, 1, 0]);
  const scale = useTransform(progress, points, [0.82, 1, 1, 0.6]);
  const y = useTransform(progress, points, [36, 0, 0, -22]);

  return (
    <motion.div
      style={{ width, marginLeft: marginX, marginRight: marginX, opacity, y }}
      className="relative h-[16vw] max-h-[380px] min-h-[130px] shrink-0 overflow-hidden rounded-xl shadow-lg"
    >
      <motion.img
        src={card.src}
        alt={card.alt}
        style={{ scale }}
        className="h-full w-[230px] max-w-none object-cover"
        draggable={false}
      />
    </motion.div>
  );
}