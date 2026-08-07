"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import SplitChars from "@/components/obsidian/SplitChars";
import { PLACES, PLACE_NAMES } from "@/data/images";
import "../places-bento.css";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LOCATIONS = [
  "below the ridge",
  "level four · east stair",
  "down the meadow",
  "on the headland",
  "behind the furnace wall",
  "off the map",
  "over the courtyard",
];

const CARDS = PLACES.map((img, i) => ({
  img,
  name: PLACE_NAMES[i],
  loc: LOCATIONS[i],
  n: i + 1,
}));

const grid = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

const cardMotion = {
  hidden: {
    opacity: 0,
    y: 52,
    scale: 0.985,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE },
  },
};

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M6.5 17.5L17.5 6.5M8.5 6.5H17.5V15.5" strokeLinecap="square" />
    </svg>
  );
}

function BentoCard({
  card,
  featured,
  reduce,
}: {
  card: (typeof CARDS)[number];
  featured: boolean;
  reduce: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [hov, setHov] = useState(false);

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const sx = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 22, mass: 0.6 });
  const spot = useMotionTemplate`radial-gradient(640px circle at ${mx}% ${my}%, rgba(241,234,222,0.14), transparent 45%)`;

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  }, [mx, my]);

  const spring = { type: "spring", stiffness: 190, damping: 24, mass: 0.8 } as const;

  return (
    <motion.article
      ref={ref as never}
      className={`bento-card bento-card-${card.n}`}
      variants={reduce ? undefined : cardMotion}
      data-cursor="link"
      aria-label={card.name}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseMove={reduce ? undefined : onMove}
    >
      <div className="bento-oi">
        <motion.img
          src={card.img}
          alt={card.name}
          loading={card.n === 1 ? "eager" : "lazy"}
          decoding={card.n === 1 ? "sync" : "async"}
          fetchPriority={card.n === 1 ? "high" : "low"}
          style={
            reduce
              ? undefined
              : { x: sx, y: sy, willChange: "transform" }
          }
          animate={{
            scale: hov ? 1.1 : 1.05,
            transition: hov
              ? { ...spring, duration: 0.6 }
              : { ...spring, duration: 0.75 },
          }}
        />
        <div className="bento-shade" aria-hidden="true" />
        <div className="bento-veil" aria-hidden="true" />
        <motion.div
          className="bento-spot"
          style={{ backgroundImage: spot }}
          aria-hidden="true"
        />
      </div>

      <div className="bento-ring" aria-hidden="true" />
      {featured && <div className="bento-accent" aria-hidden="true" />}

      <div className="bento-top" aria-hidden="true">
        <span className="bento-idx">0{card.n}</span>
        <span className="bento-top-line" />
        <motion.span
          className="bento-loc"
          animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : "0.5em" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {card.loc}
        </motion.span>
      </div>

      <div className="bento-txt">
        <motion.h3
          className="bento-title"
          animate={{ y: hov ? -6 : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {card.name}
        </motion.h3>
        <div className="bento-sub">
          <motion.span
            animate={{ y: hov ? 0 : "1.4em", opacity: hov ? 1 : 0.4 }}
            transition={{ duration: 0.6, ease: EASE, delay: hov ? 0.05 : 0 }}
          >
            {card.loc}
          </motion.span>
        </div>
      </div>

      <motion.span
        className="bento-cta"
        aria-hidden="true"
        animate={{
          opacity: hov ? 1 : 0,
          scale: hov ? 1 : 0.6,
          x: hov ? 0 : 8,
          y: hov ? 0 : 8,
          backgroundColor: hov ? "var(--c-brown)" : "var(--c-yellow)",
        }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <ArrowIcon />
      </motion.span>
    </motion.article>
  );
}

/**
 * PlacesBento — "Explore / Places" heading + caption + premium bento grid.
 * Layout, gutters (1rem), radius (0.4rem), type scale and palette mirror the
 * obsidian reference; entrance/hover built on framer variants + springs.
 */
export default function PlacesBento() {
  const reduce = useReducedMotion();

  return (
    <section id="places" data-header-color="light" className="c-bento">
      <div className="bento-inner">
        <div className="b-head" aria-hidden="true">
          <SplitChars as="span" text="Explore" className="-lrg" dx={0.25} dy={-1} />
          <SplitChars as="span" text="Places" className="-lrg line-2" dx={0.25} dy={-1} />
        </div>

        <div className="b-meta">
          <span className="cap -h5 -m-h6">
            <span>Not</span>
            <span>Everything</span>
            <span>is Visible</span>
          </span>
          <span className="b-count -mm" aria-hidden="true">
            {String(CARDS.length).padStart(2, "0")} — Places
          </span>
        </div>

        <motion.div
          className="bento-grid"
          variants={reduce ? undefined : grid}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, amount: 0.08 }}
        >
          {CARDS.map((card) => (
            <BentoCard
              key={card.name}
              card={card}
              featured={card.n === 1}
              reduce={!!reduce}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
