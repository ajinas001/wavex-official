"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import SplitHover from "@/components/obsidian/SplitHover";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import "../places-after.css";

const EASE: [number, number, number, number] = [0.5, 0, 0.3, 1];

/**
 * PlacesAfter — obsidian `c-places-after` port. Yellow section: a map
 * figure with a star mark and ship that parallax-drift with `--progress`,
 * a brown→yellow path, the "You Won't Find Them on a Map" title, and a
 * Seek Admission call-to-action with a sliding stone.
 */
export default function PlacesAfter() {
  const { ref, progress } = useSectionProgress({
    offset: ["start start", "end end"],
  });

  const reveal = {
    initial: { opacity: 0, y: "2rem" },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 1.4, ease: EASE },
  };

  return (
    <motion.section
      ref={ref}
      id="places-after"
      data-header-color="dark"
      className="c-places-after"
      style={{ "--progress": progress } as CSSProperties}
    >
      {/* Map — star mark on top, ship drifting at the bottom, parallax */}
      <div className="figure-map" aria-hidden="true">
        <figure>
          <img src="/images/home/figure-map.webp" alt="" loading="lazy" />
        </figure>
      </div>

      {/* Drawn path, brown fading to yellow */}
      <svg
        className="places-after-path"
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="places-after-path-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7b5136" />
            <stop offset="0.5" stopColor="#f1eade" />
            <stop offset="1" stopColor="#15141500" />
          </linearGradient>
        </defs>
        <path
          fill="none"
          stroke="url(#places-after-path-gradient)"
          strokeWidth="1"
          d="M109.3,0c-236.8,136.6,1005.1,38.6,576.7,146-245.3,61.5-347.8,189.4-433.3,280-70.1,74.3-126.5,86.3-134.9,60.6-48.9-149.4,1182-116.9,997.2,102.4-123.2,146.2-14.9,162.2,325,47.8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="-w">
        <span className="title -h1 -m-h3 grid-place">
          <span>Built With</span>
          <span>Purpose</span>
          <span>Delivered</span>
        </span>

        <motion.p className="subtitle -p-h6 grid-place" {...reveal}>
          Every project we take on is shaped with intention.
        </motion.p>

        <motion.p className="caption -m grid-place">
          {" "}
          We have built over <span className="-h5">50</span> digital products across
          e-commerce, SaaS, and corporate verticals —
          each engineered for performance, crafted for clarity, and designed
          to grow. Our process is thorough, not rushed.{" "}
        </motion.p>

        <motion.span className="cta-label -hp grid-place" {...reveal}>
          <span>Let&rsquo;s Build</span>
          <span>Together /</span>
        </motion.span>

        <button
          type="button"
          data-cursor="link"
          onClick={() => window.dispatchEvent(new Event("wavex:open-admission"))}
          className="button -big -p -m-m grid-place"
        >
          <SplitHover text="Start a Project" className="text -mm -up" />
        </button>
      </div>

      <figure className="stone-2" aria-hidden="true">
        <img src="/images/home/stone-2.webp" alt="" loading="lazy" />
      </figure>
    </motion.section>
  );
}
