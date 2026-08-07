"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { IMG } from "@/data/images";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import Button from "../Button";

const ADMISSION_IMAGES = [
  { src: IMG.admission1, dy: [-6, 6] },
  { src: IMG.admission2, dy: [0, -6] },
  { src: IMG.admission3, dy: [-12, 4] },
];

function AdmissionImage({
  src,
  dy,
  progress,
}: {
  src: string;
  dy: number[];
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0, 1], dy);
  return (
    <motion.div className="figure aspect-[3/4] overflow-hidden rounded-obs" style={{ y }}>
      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
    </motion.div>
  );
}

/**
 * Admission — yellow block with three parallax figures, "Ask to be
 * admitted" heading and the apply button that opens the form.
 */
export default function Admission() {
  const { ref, progress } = useSectionProgress({
    offset: ["start 0.85", "end 0.6"],
  });

  return (
    <section
      ref={ref}
      data-header-color="dark"
      className="relative overflow-hidden bg-yellow pt-[14vh] text-brown"
    >
      <div className="px-gap md:px-margin">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-brown/50">
            Admission / Ask to be
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-brown/50">
            Currently Inviting
          </span>
        </div>

        <div className="mt-[8vh] grid grid-cols-3 gap-4 md:gap-8">
          {ADMISSION_IMAGES.map(({ src, dy }, i) => (
            <AdmissionImage key={i} src={src} dy={dy} progress={progress} />
          ))}
        </div>

        <div className="mt-[10vh] flex flex-col items-center text-center">
          <div className="overflow-hidden">
            <h2 className="font-display text-[13vw] font-light leading-[0.85] md:text-[8vw]">
              Ask to be
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display text-[13vw] font-light italic leading-[0.85] text-brown/50 md:text-[8vw]">
              admitted.
            </h2>
          </div>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-brown/70">
            Seats are offered slowly, and kept rare. Tell us who you are and
            what you mean to make.
          </p>
          <div className="mt-8">
            <Button
              label="Apply for Admission"
              variant="solid"
              onClick={() => window.dispatchEvent(new Event("wavex:open-admission"))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
