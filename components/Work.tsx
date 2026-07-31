// components/DimensionalWarpShowcase.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface WarpItem {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  image: string;
  tags: string[];
}

const ITEMS: WarpItem[] = [
  {
    id: '1',
    number: '01',
    title: 'Monopoly Prime',
    category: 'LUXURY REAL ESTATE ARCHITECTURE',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    tags: ['Next.js 16', '3D WebGL', 'Framer Motion'],
  },
  {
    id: '2',
    number: '02',
    title: 'Titan Estates',
    category: 'ARCHITECTURAL CRM & PORTFOLIO',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    tags: ['GSAP ScrollTrigger', 'Dark UX', 'Custom Shaders'],
  },
  {
    id: '3',
    number: '03',
    title: 'Chronos Vault',
    category: 'HAUTE HORLOGERIE EXPERIENCE',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
    tags: ['E-Commerce', 'WebGL Physics', 'Interactive 3D'],
  },
  {
    id: '4',
    number: '04',
    title: 'Toolvo Dynamics',
    category: 'INDUSTRIAL PRECISION PLATFORM',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    tags: ['Cylindrical Engine', 'Design System'],
  },
  {
    id: '5',
    number: '05',
    title: 'Al Sarh Trading',
    category: 'INDUSTRIAL MATERIAL CATALOGUE',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    tags: ['High-Density UI', 'Enterprise Web'],
  },
];

export function DimensionalWarpShowcase() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const tileElements = tilesRef.current.filter(Boolean);
      const totalTiles = tileElements.length;

      // Calculate initial 3D positions along a logarithmic depth tunnel
      const initialPositions = tileElements.map((_, i) => {
        const step = i / totalTiles;
        // Angles spaced in a spiral
        const angle = step * Math.PI * 3.5;
        const radius = 280 + i * 40; // Lateral spread from center

        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * (radius * 0.6),
          // Stacked in depth far behind screen (Z: -2500px to -500px)
          z: -2500 + i * 500,
          rotateZ: (i % 2 === 0 ? 1 : -1) * (12 + i * 4),
        };
      });

      // Update function mapping progress (0 to 1) to camera Z-travel
      const updateWarpState = (progress: number) => {
        // Total camera travel distance down the tunnel
        const zTravel = progress * (totalTiles * 500 + 1200);

        tileElements.forEach((tile, i) => {
          if (!tile) return;
          const pos = initialPositions[i];
          const currentZ = pos.z + zTravel;

          // Fade logic: invisible when far back, crisp at viewport center (Z=0), dissolves as it passes camera (Z > 300)
          let opacity = 0;
          if (currentZ > -1800 && currentZ < 400) {
            if (currentZ < -800) {
              opacity = gsap.utils.mapRange(-1800, -800, 0, 1, currentZ);
            } else if (currentZ > 100) {
              opacity = gsap.utils.mapRange(100, 400, 1, 0, currentZ);
            } else {
              opacity = 1;
            }
          }

          // Dynamic scale based on distance to simulate physical camera lens proximity
          const scale = gsap.utils.mapRange(-2500, 300, 0.4, 1.2, currentZ);

          gsap.set(tile, {
            x: pos.x,
            y: pos.y,
            z: currentZ,
            rotateZ: pos.rotateZ,
            scale: Math.max(0.1, scale),
            opacity: Math.max(0, opacity),
            transformPerspective: 1000,
            transformOrigin: 'center center',
          });
        });
      };

      // Set initial frame
      updateWarpState(0);

      // Pinned ScrollTrigger controls Z-axis progression
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=350%',
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          updateWarpState(self.progress);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Interactive Inertial Camera Tilt based on Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalize coordinates (-1 to 1)
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;

    gsap.to(viewport, {
      rotateY: x * 8, // Subtle 3D yaw
      rotateX: -y * 8, // Subtle 3D pitch
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    gsap.to(viewport, {
      rotateY: 0,
      rotateX: 0,
      duration: 1.2,
      ease: 'power2.out',
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none"
    >
      {/* Dynamic Ambient Core Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(240,192,89,0.06)_0%,transparent_65%)] pointer-events-none" />

      {/* Header Context */}
      <div className="absolute top-10 left-8 md:left-16 z-30 flex items-center space-x-3 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#F0C059] animate-pulse" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
          Chapter 03 // Spatial Depth Engine
        </span>
      </div>

      <div className="absolute top-10 right-8 md:right-16 z-30 hidden md:block pointer-events-none">
        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
          [ Scroll to penetrate dimensional tunnel ]
        </p>
      </div>

      {/* Static Center Focus Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute font-serif text-[12vw] text-white/5 font-black uppercase tracking-tighter select-none">
          WARP
        </div>
      </div>

      {/* 3D Perspective Viewport Canvas */}
      <div
        ref={viewportRef}
        className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d] will-change-transform z-10"
      >
        {ITEMS.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              tilesRef.current[index] = el;
            }}
            className="absolute w-[85vw] sm:w-[480px] md:w-[560px] h-[300px] sm:h-[340px] md:h-[380px] rounded-2xl bg-neutral-900/80 border border-white/15 backdrop-blur-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] group cursor-pointer hover:border-[#F0C059]/60 hover:shadow-[0_0_40px_rgba(240,192,89,0.25)] transition-colors duration-500 [transform-style:preserve-3d] will-change-transform"
          >
            {/* Background Image with Depth Parallax */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
              style={{ backgroundImage: `url(${item.image})` }}
            />

            {/* Dark Obsidian Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />

            {/* Glowing Accent Border Line */}
            <div className="absolute inset-0 border border-transparent group-hover:border-[#F0C059]/50 rounded-2xl transition-colors duration-500 pointer-events-none" />

            {/* Card Content Hierarchy */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <span className="font-mono text-3xl font-light text-white/30 group-hover:text-[#F0C059] transition-colors duration-300">
                  {item.number}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 font-mono text-[10px] tracking-widest text-[#F0C059] uppercase backdrop-blur-md">
                  {item.category}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl md:text-4xl font-serif text-white group-hover:translate-x-1 transition-transform duration-300">
                  {item.title}
                </h3>

                <div className="flex flex-wrap gap-2 pt-1">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-300 bg-white/5 border border-white/10 rounded-md backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center space-x-2 font-mono text-xs text-[#F0C059]">
                  <span>ENTER EXPERIENCE</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Nav Information */}
      <div className="absolute bottom-10 inset-x-8 md:inset-x-16 z-30 flex justify-between items-end pointer-events-none">
        <p className="font-mono text-xs text-neutral-500 max-w-xs">
          3D spatial gallery engine. Built with GSAP ScrollTrigger matrix transformations.
        </p>
        <div className="font-mono text-xs text-[#F0C059] tracking-widest uppercase border-b border-[#F0C059]/40 pb-1">
          DEPTH WARP // 05 PROJECTS
        </div>
      </div>
    </section>
  );
}

export default DimensionalWarpShowcase;