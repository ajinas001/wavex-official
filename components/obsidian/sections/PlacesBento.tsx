'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitChars from '@/components/obsidian/SplitChars';
import { PLACES, PLACE_NAMES } from '@/data/images';
import '../places-bento.css';

const LOCATIONS = [
  'below the ridge',
  'level four · east stair',
  'down the meadow',
  'on the headland',
  'behind the furnace wall',
  'off the map',
  'over the courtyard',
];

const CARDS = PLACES.slice(0, 7).map((img, i) => ({
  img,
  name: PLACE_NAMES[i] || `Place ${i + 1}`,
  loc: LOCATIONS[i] || 'unmapped location',
  n: i + 1,
}));

// Optional: Provide a dedicated video source or fallback to a sample standard video
const CENTER_VIDEO_SRC = './hero.mp4';

export default function PlacesBento() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // 7 Panel Refs
  const centerCardRef = useRef<HTMLDivElement>(null); // Card 4 (Active Center)
  const card1Ref = useRef<HTMLDivElement>(null);      // Card 1 (Far-Left Top)
  const card2Ref = useRef<HTMLDivElement>(null);      // Card 2 (Far-Left Bottom)
  const card3Ref = useRef<HTMLDivElement>(null);      // Card 3 (Top-Center Small)
  const card5Ref = useRef<HTMLDivElement>(null);      // Card 5 (Bottom-Center Wide)
  const card6Ref = useRef<HTMLDivElement>(null);      // Card 6 (Far-Right Top)
  const card7Ref = useRef<HTMLDivElement>(null);      // Card 7 (Far-Right Bottom)

  const [activeIndex, setActiveIndex] = useState(0);
  const [bypassAnimation, setBypassAnimation] = useState(false);

  useEffect(() => {
    const checkResponsiveBypass = () => {
      const isMobileOrTablet = window.innerWidth < 1024;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setBypassAnimation(isMobileOrTablet || prefersReducedMotion);
    };

    checkResponsiveBypass();
    window.addEventListener('resize', checkResponsiveBypass);

    if (window.innerWidth < 1024) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = triggerRef.current;
    const pin = pinRef.current;

    // Reset exact positions matching the bento grid reference
    gsap.set(centerCardRef.current, { width: '40vw', height: '22vw', borderRadius: '10px' });
    gsap.set(
      [
        card1Ref.current,
        card2Ref.current,
        card3Ref.current,
        card5Ref.current,
        card6Ref.current,
        card7Ref.current,
      ],
      { opacity: 1, x: 0, y: 0, scale: 1 }
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.1,
        pin: pin,
        pinSpacing: true,
      },
    });

    // Pinned zoom & scatter sequence
    tl.to({}, { duration: 0.5 })
      .to(
        centerCardRef.current,
        {
          width: '100vw',
          height: '100vh',
          borderRadius: '0px',
          ease: 'power1.inOut',
          duration: 2.5,
        },
        'zoom'
      )
      .to(card1Ref.current, { x: '-45vw', y: '-20vh', opacity: 0, ease: 'power1.inOut', duration: 2.0 }, 'zoom')
      .to(card2Ref.current, { x: '-45vw', y: '25vh', opacity: 0, ease: 'power1.inOut', duration: 2.0 }, 'zoom')
      .to(card3Ref.current, { x: '0vw', y: '-35vh', opacity: 0, ease: 'power1.inOut', duration: 2.0 }, 'zoom')
      .to(card5Ref.current, { x: '0vw', y: '35vh', opacity: 0, ease: 'power1.inOut', duration: 2.0 }, 'zoom')
      .to(card6Ref.current, { x: '45vw', y: '-20vh', opacity: 0, ease: 'power1.inOut', duration: 2.0 }, 'zoom')
      .to(card7Ref.current, { x: '45vw', y: '25vh', opacity: 0, ease: 'power1.inOut', duration: 2.0 }, 'zoom');

    return () => {
      window.removeEventListener('resize', checkResponsiveBypass);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === trigger) t.kill();
      });
    };
  }, []);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % CARDS.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length);
  };

  const renderPanel = (cardIndex: number, ref: React.RefObject<HTMLDivElement | null>, positionClasses: string) => {
    const card = CARDS[cardIndex % CARDS.length];
    return (
      <div
        ref={ref}
        className={`absolute border border-white/10 rounded-[10px] overflow-hidden bg-[#121212] shadow-2xl select-none pointer-events-none ${positionClasses}`}
      >
        <img src={card.img} alt={card.name} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 text-[10px] text-[#e0a96d] font-mono">0{card.n}</div>
        <div className="absolute bottom-3 left-3 right-3">
          <span className="block text-xs font-serif text-neutral-200 truncate">{card.name}</span>
          <span className="block text-[10px] text-neutral-400 truncate">{card.loc}</span>
        </div>
      </div>
    );
  };

  // Mobile / Reduced Motion Fallback
  if (bypassAnimation) {
    return (
      <section id="places" data-header-color="light" className="c-bento py-16 px-4 md:px-8 bg-[#0a0a0a]">
        <div className="bento-inner max-w-7xl mx-auto">
          <div className="b-head mb-6">
            <SplitChars as="span" text="Explore" className="-lrg" dx={0.25} dy={-1} />
            <SplitChars as="span" text="Places" className="-lrg line-2" dx={0.25} dy={-1} />
          </div>

          <div className="b-meta mb-12 flex justify-between items-end">
            <span className="cap -h5 -m-h6">
              <span>Not</span> <span>Everything</span> <span>is Visible</span>
            </span>
            <span className="b-count -mm text-xs font-mono text-neutral-400">
              07 — Places
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CARDS.map((card) => (
              <div
                key={card.n}
                className="relative min-h-[280px] rounded-[10px] overflow-hidden border border-white/10 bg-[#121212] p-5 flex flex-col justify-end"
              >
                <img src={card.img} alt={card.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative z-10">
                  <span className="text-xs text-[#e0a96d] font-mono">0{card.n}</span>
                  <h3 className="text-lg text-neutral-100 font-serif mt-1">{card.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1 uppercase">{card.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="places" data-header-color="light" className="relative w-full bg-[#151415]">
      {/* 1. Header (Flows away naturally upon scroll) */}
      <div className="bento-inner w-full max-w-7xl mx-auto px-6 pt-16 pb-8 flex flex-col items-center text-center">
        <div className="b-head">
          <SplitChars as="span" text="Explore" className="-lrg" dx={0.25} dy={-1} />
          <SplitChars as="span" text="Places" className="-lrg line-2" dx={0.25} dy={-1} />
        </div>
      </div>

      {/* 2. Pinned GSAP Bento Canvas */}
      <div ref={triggerRef} className="relative w-full h-[300vh]">
        <div ref={pinRef} className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">

          <div className="relative w-full h-full max-w-[96vw] max-h-[92vh] flex items-center justify-center">

            {/* Top Center Metadata Text */}
            <div className="absolute top-[3vh] left-1/2 -translate-x-1/2 text-center pointer-events-none z-30 flex flex-col items-center">
              <span className="cap -h5 -m-h6 text-neutral-200 font-serif text-lg leading-tight block">
                <span>Not</span> <span>Everything</span> <span>is Visible</span>
              </span>
            </div>

            {/* FAR-LEFT COLUMN */}
            {renderPanel(1, card1Ref, 'left-[2vw] top-[10vh] w-[21vw] h-[25vw]')}
            {renderPanel(2, card2Ref, 'left-[2vw] bottom-[4vh] w-[21vw] h-[11vw]')}

            {/* CENTER COLUMN (Top Small & Bottom Wide surrounding Active Center Card) */}
            {renderPanel(3, card3Ref, 'left-[34vw] -translate-x-1/2 top-[10vh] w-[12vw] h-[6vw]')}
            {renderPanel(5, card5Ref, 'left-1/2 -translate-x-1/2 bottom-[4vh] w-[16vw] h-[7vw]')}

            {/* FAR-RIGHT COLUMN */}
            {renderPanel(6, card6Ref, 'right-[2vw] top-[10vh] w-[21vw] h-[13vw]')}
            {renderPanel(7, card7Ref, 'right-[2vw] bottom-[4vh] w-[21vw] h-[23vw]')}

            {/* ACTIVE CENTER MAIN CARD (CARD 4 - ALWAYS A VIDEO) */}
            <div
              ref={centerCardRef}
              className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 border border-white/20 rounded-[10px] shadow-2xl flex items-center justify-center overflow-hidden z-20 group bg-[#141414]"
            >
              <video
                src={CARDS[activeIndex].video || CENTER_VIDEO_SRC}
                poster={CARDS[activeIndex].img}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Active Card Title Overlay */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl md:text-2xl font-serif text-white/90 pointer-events-none z-30">
                {CARDS[activeIndex].name}
              </div>

              {/* Central Navigation Buttons */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-4 z-40 pointer-events-auto">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-amber-100 hover:bg-[#e0a96d] hover:text-black transition-colors duration-300 cursor-pointer backdrop-blur-md"
                  aria-label="Previous place"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-amber-100 hover:bg-[#e0a96d] hover:text-black transition-colors duration-300 cursor-pointer backdrop-blur-md"
                  aria-label="Next place"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Slide Counter */}
              <div className="absolute bottom-6 right-6 font-mono text-sm text-neutral-300 pointer-events-none z-30">
                {activeIndex + 1} / {CARDS.length}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}