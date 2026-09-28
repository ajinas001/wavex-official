"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import SplitChars from "@/components/obsidian/SplitChars";
import { services, type Service } from "@/data/services";
import { scrollToY } from "@/lib/scroll";

/* -------------------------------------------------------------------------- */
/*  CONFIG & PALETTE                                                          */
/* -------------------------------------------------------------------------- */
const TOTAL_FRAMES = 215;
const FRAME_PATH = (index: number) =>
  `/assets/sequence/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

const INK_DIM = "rgba(var(--c-yellow-rgb),0.7)";
const BG_DARK = "#151415"; // var(--c-black) token
const LUX_GLIDE = [0.5, 0, 0.3, 1] as const; // --f-cubic mirror hero

interface ServiceStage {
  service: Service;
  startProgress: number;
  position: "top-left" | "bottom-right" | "top-right" | "bottom-left";
}

const STAGES: ServiceStage[] = [
  {
    service: services[0], // 01 Brand & Art Direction
    startProgress: 0.0,
    position: "top-left",
  },
  {
    service: services[1], // 02 Web Design & Development
    startProgress: 0.25,
    position: "bottom-right",
  },
  {
    service: services[2], // 03 Interactive & 3D
    startProgress: 0.52,
    position: "top-right",
  },
  {
    service: services[3], // 04 Product Strategy
    startProgress: 0.78,
    position: "bottom-left",
  },
];

/* -------------------------------------------------------------------------- */
/*  SKELETON PLACEHOLDER                                                       */
/* -------------------------------------------------------------------------- */
function SkeletonOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-15 flex items-center justify-center p-8">
      <div className="relative flex h-full w-full max-w-4xl flex-col items-center justify-center gap-6 rounded-2xl border border-[rgba(var(--c-yellow-rgb),0.08)] bg-[rgba(var(--c-black-rgb),0.42)] p-8 backdrop-blur-sm animate-pulse">
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <div className="h-4 w-32 rounded-full bg-[rgba(var(--c-brown-rgb),0.18)]" />
          <div className="h-8 w-64 rounded-lg bg-[rgba(var(--c-yellow-rgb),0.1)]" />
          <div className="h-3 w-48 rounded-full bg-[rgba(var(--c-yellow-rgb),0.06)]" />
        </div>
        <div className="relative my-4 flex h-64 w-full max-w-lg items-center justify-center rounded-xl border border-[rgba(var(--c-stroke-rgb),0.12)] bg-[rgba(var(--c-yellow-rgb),0.03)] shadow-2xl md:h-80">
          <div className="h-20 w-20 rounded-full border border-dashed border-[rgba(var(--c-stroke-rgb),0.35)] bg-[rgba(var(--c-brown-rgb),0.06)]" />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-2">
          <div className="h-3 w-full rounded bg-[rgba(var(--c-yellow-rgb),0.08)]" />
          <div className="h-3 w-3/4 rounded bg-[rgba(var(--c-yellow-rgb),0.05)]" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  HERO-STYLE SPLITCHARS KINETIC SERVICE OVERLAY                             */
/* -------------------------------------------------------------------------- */
function ServiceTextReveal({
  stage,
}: {
  stage: ServiceStage;
}) {
  const { service, position } = stage;

  const isRight = position === "bottom-right" || position === "top-right";
  const isBottom = position === "bottom-right" || position === "bottom-left";

  const positionClasses = [
    isBottom ? "bottom-[12vh]" : "top-[14vh]",
    isRight ? "right-[5vw] md:right-[8vw] items-end text-right" : "left-[5vw] md:left-[8vw] items-start text-left",
  ].join(" ");

  return (
    <motion.div
      key={service.index}
      initial={{ opacity: 0, y: isBottom ? 20 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isBottom ? 20 : -20, transition: { duration: 0.35 } }}
      transition={{ duration: 0.6, ease: LUX_GLIDE }}
      className={`pointer-events-none absolute z-30 flex flex-col max-w-xl md:max-w-2xl ${positionClasses}`}
    >
      <div className="w-full">
        <SplitChars
          as="h2"
          text={service.title}
          className="-lrg font-light leading-[0.9] tracking-tight text-yellow drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
          once={false}
        />
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  MAIN SCROLL COMPONENT                                                     */
/* -------------------------------------------------------------------------- */
export default function Scroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const lastRenderedFrameRef = useRef<number>(-1);
  const animationFrameIdRef = useRef<number | null>(null);

  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [currentFrameLoaded, setCurrentFrameLoaded] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*  60FPS FULLSCREEN CANVAS DRAWING ENGINE WITH SKELETON FALLBACK             */
  /* -------------------------------------------------------------------------- */
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      setCurrentFrameLoaded(false);

      // Clear canvas with dark background
      ctx.fillStyle = BG_DARK;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render canvas skeleton representation
      const w = canvas.width;
      const h = canvas.height;
      const cardW = w * 0.4;
      const cardH = h * 0.5;
      const rx = (w - cardW) / 2;
      const ry = (h - cardH) / 2;

      ctx.fillStyle = "rgba(241, 234, 222, 0.03)";
      ctx.strokeStyle = "rgba(159, 175, 155, 0.18)";
      ctx.lineWidth = 1.5 * dpr;

      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(rx, ry, cardW, cardH, 16 * dpr);
      } else {
        ctx.rect(rx, ry, cardW, cardH);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(123, 81, 54, 0.08)";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(cardW, cardH) * 0.2, 0, Math.PI * 2);
      ctx.fill();

      return;
    }

    setCurrentFrameLoaded(true);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = displayWidth / displayHeight;

    let renderW: number;
    let renderH: number;
    let renderX: number;
    let renderY: number;

    // Full-screen cover math
    if (canvasRatio > imgRatio) {
      renderW = displayWidth;
      renderH = displayWidth / imgRatio;
      renderX = 0;
      renderY = (displayHeight - renderH) / 2;
    } else {
      renderH = displayHeight;
      renderW = displayHeight * imgRatio;
      renderX = (displayWidth - renderW) / 2;
      renderY = 0;
    }

    ctx.drawImage(img, renderX * dpr, renderY * dpr, renderW * dpr, renderH * dpr);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*  PRELOAD ALL 215 FRAMES IN BACKGROUND (NO PRELOADER SCREEN BLOCKING)       */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    let isCancelled = false;
    const loadedImages: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    imagesRef.current = loadedImages;

    const loadFrame = (i: number) => {
      const img = new Image();
      // Prioritize near-current frames; rest deferred
      (img as any).fetchPriority = i < 24 ? "high" : "low";
      (img as any).loading = "eager";
      img.decoding = "async";
      img.src = FRAME_PATH(i);

      const handleImageLoad = () => {
        if (isCancelled) return;
        loadedImages[i] = img;
        if (i === lastRenderedFrameRef.current || (lastRenderedFrameRef.current === -1 && i === 0)) {
          drawFrame(lastRenderedFrameRef.current >= 0 ? lastRenderedFrameRef.current : 0);
        }
      };

      img.onload = () => {
        if ("decode" in img) img.decode().then(handleImageLoad).catch(handleImageLoad);
        else handleImageLoad();
      };
      img.onerror = () => {
        if (isCancelled) return;
        loadedImages[i] = null;
      };
    };

    // Eager first 24 frames for immediate scrub, rest staggered via idle
    for (let i = 0; i < Math.min(24, TOTAL_FRAMES); i++) loadFrame(i);

    let nextIdle = 24;
    const scheduleIdle = () => {
      if (isCancelled || nextIdle >= TOTAL_FRAMES) return;
      const idle = (window as any).requestIdleCallback as
        | ((cb: () => void, opts?: { timeout: number }) => number)
        | undefined;
      const runBatch = () => {
        const batch = Math.min(12, TOTAL_FRAMES - nextIdle);
        for (let k = 0; k < batch; k++) loadFrame(nextIdle++);
        if (nextIdle < TOTAL_FRAMES) scheduleIdle();
      };
      if (idle) idle(runBatch, { timeout: 1200 });
      else setTimeout(runBatch, 120);
    };
    scheduleIdle();

    return () => {
      isCancelled = true;
    };
  }, [drawFrame]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    const frameToDraw = lastRenderedFrameRef.current >= 0 ? lastRenderedFrameRef.current : 0;
    drawFrame(frameToDraw);
  }, [drawFrame]);

  const requestFrameRender = useCallback(
    (frameIdx: number) => {
      const target = Math.max(
        0,
        Math.min(TOTAL_FRAMES - 1, Math.round(frameIdx))
      );
      if (target === lastRenderedFrameRef.current && currentFrameLoaded) return;
      lastRenderedFrameRef.current = target;

      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      animationFrameIdRef.current = requestAnimationFrame(() => {
        drawFrame(target);
      });
    },
    [drawFrame, currentFrameLoaded]
  );

  /* -------------------------------------------------------------------------- */
  /*  SCROLL PROGRESS SYNC                                                      */
  /* -------------------------------------------------------------------------- */
  useMotionValueEvent(scrollYProgress, "change", (progressVal) => {
    const frame = progressVal * (TOTAL_FRAMES - 1);
    requestFrameRender(frame);

    let activeIdx = 0;
    for (let i = 0; i < STAGES.length; i++) {
      if (progressVal >= STAGES[i].startProgress) {
        activeIdx = i;
      }
    }
    setActiveStageIndex((prev) => (prev !== activeIdx ? activeIdx : prev));
  });

  useEffect(() => {
    resizeCanvas();
    requestFrameRender(0);

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [resizeCanvas, requestFrameRender]);

  const jumpToStage = (stage: ServiceStage) => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const targetY = top + stage.startProgress * el.offsetHeight;
    scrollToY(targetY);
  };

  const currentStage = STAGES[activeStageIndex];

  return (
    <section
      ref={containerRef}
      id="objects"
      data-header-color="light"
      className="relative h-[600vh] antialiased bg-black"
      style={{ backgroundColor: "var(--c-black)" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {!currentFrameLoaded && <SkeletonOverlay />}

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 38%, rgba(var(--c-black-rgb),0.65) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(var(--c-yellow-rgb),0.1)] to-transparent z-10" />

        <div className="pointer-events-auto absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 md:block md:right-10">
          <div className="relative flex flex-col items-center gap-6">
            <div
              className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[rgba(var(--c-yellow-rgb),0.12)]"
            />
            {STAGES.map((s, i) => {
              const isActive = activeStageIndex === i;
              return (
                <button
                  key={s.service.index}
                  type="button"
                  onClick={() => jumpToStage(s)}
                  aria-label={`Jump to ${s.service.title}`}
                  className="group relative z-10 flex items-center gap-3"
                >
                  <span
                    className="pointer-events-none font-mono text-[9px] uppercase tracking-[0.25em] opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-yellow/60"
                  >
                    {s.service.index}
                  </span>
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      isActive
                        ? "h-3 w-3 bg-brown shadow-[0_0_12px_rgba(123,81,54,0.6)]"
                        : "h-2 w-2 bg-[rgba(var(--c-yellow-rgb),0.28)] group-hover:scale-125 group-hover:bg-yellow"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero-Style SplitChars Kinetic Service Reveal */}
        <AnimatePresence mode="wait">
          <ServiceTextReveal key={currentStage.service.index} stage={currentStage} />
        </AnimatePresence>
      </div>
    </section>
  );
}

