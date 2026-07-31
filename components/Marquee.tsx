"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const ITEMS = [
  "Web Design",
  "Front-End Engineering",
  "Motion Design",
  "Brand Systems",
  "WebGL",
  "Art Direction",
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        duration: 26,
        ease: "linear",
      });
      return () => tween.kill();
    });

    return () => ctx.revert();
  }, []);

  const loopItems = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-y border-ink/10 py-8">
      <div ref={trackRef} className="flex w-max items-center">
        {loopItems.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="whitespace-nowrap px-6 font-display text-3xl text-ink/25 md:text-5xl">
              {item}
            </span>
            <span className="h-2 w-2 rounded-full bg-ink/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
