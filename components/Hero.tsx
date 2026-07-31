'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Refs for animation targets
  const bgGradientRef = useRef<HTMLDivElement>(null);
  const bgSolidBlackRef = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const rockRef = useRef<HTMLDivElement>(null);
  const heroUiRef = useRef<HTMLDivElement>(null);

  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);

  const exploreTitleRef = useRef<HTMLDivElement>(null);

  const [bypassAnimation, setBypassAnimation] = useState(false);

  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (isMobile || prefersReducedMotion) {
      setBypassAnimation(true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.normalizeScroll(true);
      ScrollTrigger.config({ ignoreMobileResize: true });

      gsap.set(
        [
          text3Ref.current,
          rockRef.current,
          heroUiRef.current,
          bgGradientRef.current,
          bgSolidBlackRef.current,
          leftCardRef.current,
          rightCardRef.current,
          heroTitleRef.current,
          exploreTitleRef.current,
        ],
        { force3D: true }
      );

      // Start text and rock immediately visible on mount (no blank screen delay)
      gsap.set(text3Ref.current, { opacity: 1, y: 0 });
      gsap.set(rockRef.current, { scale: 0.5, opacity: 0.6, rotate: -15, y: 0 });
      gsap.set(heroUiRef.current, { opacity: 0 });
      gsap.set(bgGradientRef.current, { opacity: 0 });
      gsap.set(bgSolidBlackRef.current, { opacity: 0 });
      gsap.set(leftCardRef.current, { x: -120, y: 120, opacity: 0, rotate: -25 });
      gsap.set(rightCardRef.current, { x: 120, y: 120, opacity: 0, rotate: 25 });
      gsap.set(heroTitleRef.current, { y: 50, opacity: 0 });
      gsap.set(exploreTitleRef.current, { y: 100, opacity: 0 });

      const trigger = triggerRef.current;
      const pin = pinRef.current;

      const tl = gsap.timeline({
        defaults: { ease: 'none', overwrite: 'auto' },
        scrollTrigger: {
          trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      // Text immediately fades out & rock expands as soon as scroll begins
      tl.to(text3Ref.current, { opacity: 0, y: -30, duration: 0.8, ease: 'power2.in' })
        .to(rockRef.current, { opacity: 0.9, scale: 0.7, rotate: 10, duration: 0.8, ease: 'power2.out' }, '<')

      // Immediate transition into main Hero reveal
      .to(bgGradientRef.current, { opacity: 1, duration: 1 }, 'reveal')
        .to(rockRef.current, { opacity: 1, scale: 1, rotate: 0, duration: 1.5, ease: 'power2.out' }, 'reveal')
        .to(heroUiRef.current, { opacity: 1, duration: 1 }, 'reveal')
        .to(heroTitleRef.current, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 'reveal+=0.3')
        .to(leftCardRef.current, { opacity: 1, x: 0, y: 0, rotate: -10, duration: 1.5, ease: 'power3.out' }, 'reveal+=0.3')
        .to(rightCardRef.current, { opacity: 1, x: 0, y: 0, rotate: 8, duration: 1.5, ease: 'power3.out' }, 'reveal+=0.3')

      // Morph into "Explore Places"
      .to(bgSolidBlackRef.current, { opacity: 1, duration: 1.2 }, 'morph')
        .to(rockRef.current, { opacity: 0, scale: 0.25, y: -100, rotate: -15, duration: 1.5, ease: 'power2.inOut' }, 'morph')
        .to(heroTitleRef.current, { opacity: 0, y: -100, duration: 1.2, ease: 'power2.inOut' }, 'morph')
        .to(leftCardRef.current, { x: -380, y: -380, scale: 1.35, rotate: -35, opacity: 0, duration: 1.8, ease: 'power3.inOut' }, 'morph')
        .to(rightCardRef.current, { x: 380, y: -380, scale: 1.35, rotate: 28, opacity: 0, duration: 1.8, ease: 'power3.inOut' }, 'morph')
        .to(exploreTitleRef.current, { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }, 'morph+=0.4');

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  if (bypassAnimation) {
    return (
      <section className="relative w-full h-screen bg-[#131313] flex flex-col justify-center items-center overflow-hidden px-6 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#2f251c_0%,_#131313_100%)] opacity-75" />

        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <ellipse cx="50" cy="50" rx="45" ry="45" fill="none" stroke="var(--line)" strokeWidth="0.12" />
          <ellipse cx="50" cy="50" rx="32" ry="32" fill="none" stroke="var(--line)" strokeWidth="0.12" />
        </svg>

        <div className="relative flex-1 flex flex-col justify-center items-center z-10 w-full">
          <div className="absolute w-[200px] h-[200px] z-0 pointer-events-none opacity-80">
            <Image src="/obsidian_rock.png" alt="Central obsidian rock" fill className="object-contain" />
          </div>

          <div className="text-center font-serif leading-none tracking-tighter text-fg flex flex-col items-center z-10">
            <span className="text-[13vw] font-normal leading-[0.88] select-none">Nothing</span>
            <span className="text-[13vw] font-normal leading-[0.88] translate-x-10 select-none">Shown</span>
            <span className="text-[13vw] font-normal leading-[0.88] -translate-x-10 select-none">First</span>
          </div>
        </div>

        <div className="flex justify-between items-end z-10 w-full">
          <span className="text-[9px] text-fg-muted uppercase tracking-[0.2em] font-sans">A Private Assembly for Makers</span>
          <span className="font-serif italic text-[10px] text-accent/70 text-center">Commitment Precedes Entry /</span>
          <span className="text-[9px] text-fg-muted uppercase tracking-[0.2em] font-sans">Coordinates Withheld</span>
        </div>
      </section>
    );
  }

  return (
    <section ref={triggerRef} className="relative w-full h-[350vh] bg-[#131313] z-10" id="hero-story">
      <div
        ref={pinRef}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#131313] flex flex-col justify-between"
        style={{ willChange: 'transform' }}
      >
        {/* Ambient gradient background */}
        <div
          ref={bgGradientRef}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#383129_0%,_#131313_100%)] z-0 pointer-events-none"
          style={{ willChange: 'opacity' }}
        />

        {/* Solid black morph-cover layer */}
        <div
          ref={bgSolidBlackRef}
          className="absolute inset-0 bg-[#0c0c0c] z-[1] pointer-events-none"
          style={{ willChange: 'opacity' }}
        />

        {/* Ambient concentric rings */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <ellipse cx="50" cy="50" rx="45" ry="45" fill="none" stroke="var(--line)" strokeWidth="0.15" />
          <ellipse cx="50" cy="50" rx="35" ry="35" fill="none" stroke="var(--line)" strokeWidth="0.15" />
        </svg>

        {/* Single Storytelling text (Visible immediately on landing) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-8 md:px-16">
          <div ref={text3Ref} className="absolute text-center max-w-[38ch]" style={{ willChange: 'transform, opacity' }}>
            <p className="font-serif italic text-2xl md:text-[2rem] lg:text-[2.25rem] text-white font-light leading-[1.55]">
              "WaveX Studio. Systems built to move."
            </p>
          </div>
        </div>

        {/* Central obsidian stone (Visible immediately on landing) */}
        <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
          <div
            ref={rockRef}
            className="relative w-[280px] h-[280px] md:w-[480px] md:h-[480px] flex items-center justify-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <Image
              src="/obsidian_rock.png"
              alt="Central raw obsidian glass stone"
              fill
              priority
              className="object-contain filter drop-shadow-[0_15px_50px_rgba(47,40,30,0.4)]"
            />
          </div>
        </div>

        {/* Hero UI overlay */}
        <div
          ref={heroUiRef}
          className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 md:p-14 pointer-events-none z-20 select-none"
          style={{ willChange: 'opacity' }}
        >
          {/* Central overlay titles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 w-full h-full">
            <div
              ref={heroTitleRef}
              className="flex flex-col items-center justify-center font-serif leading-[0.8] tracking-tighter text-[#ededed] text-center w-full"
              style={{ willChange: 'transform, opacity' }}
            >
              <span className="text-[12vw] font-normal leading-[0.85] select-none block -translate-y-6">Nothing</span>
              <span className="text-[12vw] font-normal leading-[0.85] select-none block translate-x-[15%] z-5">Shown</span>
              <span className="text-[12vw] font-normal leading-[0.85] select-none block -translate-x-[12%] z-20">First</span>
            </div>
          </div>

          {/* Explore Places morph typography */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[11] w-full h-full">
            <div
              ref={exploreTitleRef}
              className="flex flex-col items-center justify-center font-serif leading-[0.8] tracking-tighter text-[#ededed] text-center w-full"
              style={{ willChange: 'transform, opacity' }}
            >
              <span className="text-[12vw] font-normal leading-[0.85] select-none block translate-y-6">Explore</span>
              <span className="text-[12vw] font-normal leading-[0.85] select-none block translate-x-[12%] translate-y-6">Places</span>
              <span className="text-sm font-sans uppercase tracking-[0.25em] text-accent/80 mt-16 font-medium block">Not Everything</span>
            </div>
          </div>

          {/* Floating side panels */}
          <div
            ref={leftCardRef}
            className="absolute bottom-20 left-6 md:left-20 w-[140px] h-[190px] md:w-[260px] md:h-[360px] bg-bg border border-line rounded-[2px] p-2 flex flex-col justify-between pointer-events-auto cursor-pointer shadow-2xl origin-bottom-left"
            style={{ willChange: 'transform, opacity' }}
            data-cursor="PORTFOLIO"
          >
            <div className="relative w-full h-[85%] overflow-hidden rounded-[1px]">
              <Image
                src="/snowy_window.png"
                alt="Snowy architectural view"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-center px-1 mt-2">
              <span className="font-serif text-[10px] text-fg-muted">P.</span>
              <span className="text-[9px] font-sans uppercase tracking-[0.18em] text-fg-muted/70">Snowy Courtyard</span>
            </div>
          </div>

          <div
            ref={rightCardRef}
            className="absolute bottom-20 right-6 md:right-20 w-[140px] h-[190px] md:w-[260px] md:h-[360px] bg-bg border border-line rounded-[2px] p-2 flex flex-col justify-between pointer-events-auto cursor-pointer shadow-2xl origin-bottom-right"
            style={{ willChange: 'transform, opacity' }}
            data-cursor="SERVICES"
          >
            <div className="relative w-full h-[85%] overflow-hidden rounded-[1px]">
              <Image
                src="/interior_sea.png"
                alt="Bright interior ocean view"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-center px-1 mt-2">
              <span className="font-serif text-[10px] text-fg-muted">I.</span>
              <span className="text-[9px] font-sans uppercase tracking-[0.18em] text-fg-muted/70">Ambient View</span>
            </div>
          </div>

          {/* Bottom coordinates bar */}
          <div className="flex flex-col sm:flex-row justify-between items-end w-full text-[9px] text-fg-muted uppercase tracking-[0.2em] font-sans font-medium">
            <span>A Private Assembly for Makers</span>
            <span className="font-serif italic capitalize text-[10px] text-accent/80 not-uppercase normal-case tracking-normal">Commitment Precedes Entry /</span>
            <span>Coordinates Withheld</span>
          </div>
        </div>
      </div>
    </section>
  );
}