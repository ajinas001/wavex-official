"use client";

import TextReveal from "./TextReveal";
import RevealImage from "./RevealImage";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";

const STATS = [
  { value: "7", label: "Years in practice" },
  { value: "42", label: "Projects shipped" },
  { value: "11", label: "Awwwards recognitions" },
];

export default function About() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section
      id="about"
      className="mx-auto max-w-[1600px] px-6 py-section-sm md:px-12 md:py-section"
    >
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
            The Studio
          </span>
        </div>

        <div className="md:col-span-8">
          <TextReveal
            as="h2"
            text="A small studio for brands that would rather be understood than described."
            className="max-w-3xl text-h2 font-medium text-balance md:text-display"
          />

          <div ref={ref} className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
            <p className="max-w-md text-lg leading-relaxed text-muted">
              We pair design and engineering under one roof — every layout is
              considered for how it will move, and every animation is
              justified by what it communicates. No stock interactions,
              no default easing curves.
            </p>

            <div className="grid grid-cols-3 gap-6 md:gap-8">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="font-display text-4xl md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-widest text-muted">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <RevealImage
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
            alt="Studio workspace with design tools and reference material"
            className="mt-16 aspect-[16/9] w-full"
          />
        </div>
      </div>
    </section>
  );
}
