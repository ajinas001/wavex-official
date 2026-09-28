"use client";

import { motion, useTransform } from "framer-motion";
import { IMG } from "@/data/images";
import { useSectionProgress } from "@/hooks/useSectionProgress";

function Window({
  img,
  aspect,
  progress,
  parallax,
  small,
}: {
  img: string;
  aspect: string;
  progress: ReturnType<typeof useSectionProgress>["progress"];
  parallax: number[];
  small?: boolean;
}) {
  const y = useTransform(progress, [0, 1], parallax);
  return (
    <motion.div
      className={`relative overflow-hidden ${small ? "w-full" : ""}`}
      style={{ aspectRatio: aspect, y }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="arch-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0 1 L 0 0.68 Q 0.5 0 1 0.68 L 1 1 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-stone to-black" style={{ clipPath: "url(#arch-clip)" }}>
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover opacity-40"
          style={{ clipPath: "url(#arch-clip)" }}
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-[38%]" style={{ clipPath: "url(#arch-clip)", background: "linear-gradient(180deg, transparent, rgba(36,35,36,0.55) 55%, rgba(21,20,21,0.9) 100%)" }} />
      </div>
      <span className="absolute inset-0 border-t border-yellow/20" style={{ clipPath: "url(#arch-clip)", borderRadius: "0.4rem 0.4rem 0 0" }} />
    </motion.div>
  );
}

/**
 * People — obsidian `c-people` port. Black wall with a wide arch of three
 * windows (narrow / wide / narrow), "The People / behind" title, tt-stone,
 * caption and ending.
 */
export default function People() {
  const { ref, progress } = useSectionProgress({
    offset: ["start 0.8", "end 0.7"],
  });

  const archY = useTransform(progress, [0, 1], ["4vh", "-4vh"]);

  return (
    <section ref={ref} data-header-color="light" className="relative overflow-hidden bg-black py-[14vh] text-yellow">
      {/* wall backdrop */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{ backgroundImage: `url(${IMG.peopleWall})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />

      <div className="relative -w">
        <div className="flex items-baseline justify-between" style={{ gridColumn: "1 / 13" }}>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-yellow/40">
            Team / The Minds Behind
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-yellow/40 md:block">
            The Studio
          </span>
        </div>

        {/* title */}
        <div className="overflow-hidden" style={{ gridColumn: "1 / 8", gridRow: 2 }}>
          <h2 className="font-display text-[11vw] font-light leading-[0.85]">Our Team</h2>
        </div>
        <div className="overflow-hidden justify-self-end" style={{ gridColumn: "6 / 13", gridRow: 3 }}>
          <h2 className="font-display text-[11vw] font-light italic leading-[0.85] text-yellow/50">
            at work.
          </h2>
        </div>

        {/* arch of windows */}
        <motion.div
          className="relative mt-[4vh] flex items-end justify-center gap-[2vw]"
          style={{ gridColumn: "1 / 13", gridRow: 4, y: archY }}
        >
          <div className="w-[10vw] min-w-[80px]">
            <Window img={IMG.guy1} aspect="22/30" progress={progress} parallax={[-6, 6]} small />
          </div>
          <div className="w-[30vw] min-w-[220px]">
            <Window img={IMG.peopleSilhouette} aspect="4/3" progress={progress} parallax={[0, -10]} />
          </div>
          <div className="w-[10vw] min-w-[80px]">
            <Window img={IMG.guy2} aspect="22/30" progress={progress} parallax={[6, -6]} small />
          </div>
        </motion.div>

        {/* tt-stone */}
        <motion.h3
          className="mt-[8vh] text-center font-display text-[5vw] font-light leading-[0.9]"
          style={{ gridColumn: "1 / 13", gridRow: 5 }}
        >
          A focused team,
          <br />
          <em className="text-yellow/50">one shared craft.</em>
        </motion.h3>

        {/* caption + ending */}
        <div className="mt-[6vh]" style={{ gridColumn: "9 / 13", gridRow: 6 }}>
          <p className="text-sm leading-relaxed text-yellow/70">
            Designers, developers, and strategists who obsess over every pixel and line of code — working in concert to build digital products that last.
          </p>
        </div>
        <span className="mt-2 -mm -up text-yellow/40" style={{ gridColumn: "1 / 4", gridRow: 7 }}>
          Team — The Builders
        </span>
      </div>
    </section>
  );
}
