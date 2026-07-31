"use client";

import { useMagnetic } from "@/hooks/useMagnetic";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";

export default function Contact() {
  const emailRef = useMagnetic<HTMLAnchorElement>(0.25);

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-surface px-6 py-section-sm md:px-12 md:py-section"
    >
      <div className="mx-auto max-w-[1600px]">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          Start a Project
        </span>

        <TextReveal
          as="h2"
          text="Have something in mind? Let's build it properly."
          className="mt-8 max-w-5xl text-hero-sm font-medium text-balance md:text-hero-md"
        />

        <div className="mt-16 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <a
            ref={emailRef}
            data-cursor="link"
            href="mailto:hello@studionoir.co"
            className="font-display text-3xl underline decoration-1 underline-offset-8 transition-opacity hover:opacity-60 md:text-4xl"
          >
            hello@studionoir.co
          </a>

          <MagneticButton href="mailto:hello@studionoir.co">
            Start a conversation
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
