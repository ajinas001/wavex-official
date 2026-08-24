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

const INK_DIM = "rgba(242,233,216,0.7)";
const BG_DARK = "#0b0907";
const GOLD = "#c9a463";
const LUX_GLIDE = [0.65, 0, 0.35, 1] as const;

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
/*  PRELOADER                                                                  */
/* -------------------------------------------------------------------------- */
function Preloader({
  progress,
  loadedCount,
  total,
}: {
  progress: number;
  loadedCount: number;
  total: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: LUX_GLIDE } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0907] px-6 text-center"
    >
      <div className="relative mb-8 flex h-16 w-16 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-[rgba(201,164,99,0.4)]"
        />
        <span className="font-mono text-xs tracking-widest text-[#c9a463]">
          WX
        </span>
      </div>

      <h3 className="mb-2 font-serif text-2xl font-light tracking-wide text-[#f2e9d8] md:text-3xl">
        WaveX &middot; Objects Sequence
      </h3>
      <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[rgba(242,233,216,0.5)]">
        60FPS High-Res Assets &middot; {loadedCount} / {total}
      </p>

      <div className="relative h-1 w-64 overflow-hidden rounded-full bg-[rgba(242,233,216,0.12)] md:w-80">
        <motion.div
          className="h-full bg-gradient-to-r from-[#c9a463] via-[#f2e9d8] to-[#c9a463]"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ ease: "easeOut", duration: 0.1 }}
        />
      </div>

      <div className="mt-4 font-mono text-xs tracking-widest text-[#c9a463]">
        {Math.round(progress)}%
      </div>
    </motion.div>
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
      {/* Index Badge */}
      

      {/* Hero Font Voyage-Regular + SplitChars Reveal */}
      <div className="w-full">
        <SplitChars
          as="h2"
          text={service.title}
          className="-lrg text-[9vw] md:text-[5.5vw] font-light leading-[0.9] tracking-tight text-[#3f383c] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
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
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastRenderedFrameRef = useRef<number>(-1);
  const animationFrameIdRef = useRef<number | null>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  /* -------------------------------------------------------------------------- */
  /*  PRELOAD ALL 215 FRAMES WITH ASYNC DECODING FOR INSTANT DRAW               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let completed = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);

      const checkComplete = () => {
        if (isCancelled) return;
        completed++;
        setLoadedCount(completed);
        setLoadProgress((completed / TOTAL_FRAMES) * 100);

        if (completed === TOTAL_FRAMES) {
          imagesRef.current = loadedImages;
          setImagesLoaded(true);
        }
      };

      img.onload = () => {
        if ("decode" in img) {
          img.decode().then(checkComplete).catch(checkComplete);
        } else {
          checkComplete();
        }
      };

      img.onerror = checkComplete;
      loadedImages[i] = img;
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* -------------------------------------------------------------------------- */
  /*  60FPS FULLSCREEN CANVAS DRAWING ENGINE                                    */
  /* -------------------------------------------------------------------------- */
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    if (lastRenderedFrameRef.current >= 0) {
      drawFrame(lastRenderedFrameRef.current);
    }
  }, [drawFrame]);

  const requestFrameRender = useCallback(
    (frameIdx: number) => {
      const target = Math.max(
        0,
        Math.min(TOTAL_FRAMES - 1, Math.round(frameIdx))
      );
      if (target === lastRenderedFrameRef.current) return;
      lastRenderedFrameRef.current = target;

      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      animationFrameIdRef.current = requestAnimationFrame(() => {
        drawFrame(target);
      });
    },
    [drawFrame]
  );

  /* -------------------------------------------------------------------------- */
  /*  SCROLL PROGRESS SYNC                                                      */
  /* -------------------------------------------------------------------------- */
  useMotionValueEvent(scrollYProgress, "change", (progressVal) => {
    if (!imagesLoaded) return;
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
    if (!imagesLoaded) return;
    resizeCanvas();
    requestFrameRender(0);

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [imagesLoaded, resizeCanvas, requestFrameRender]);

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
      className="relative h-[600vh] antialiased"
      style={{ backgroundColor: BG_DARK }}
    >
      {/* Preloader */}
      <AnimatePresence>
        {!imagesLoaded && (
          <Preloader
            progress={loadProgress}
            loadedCount={loadedCount}
            total={TOTAL_FRAMES}
          />
        )}
      </AnimatePresence>

      {/* Sticky Full-Screen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Fullscreen Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Ambient Dark Edge Vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(11, 9, 7, 0.6) 100%)",
          }}
        />

        {/* Right Clickable Chapter Rail */}
        <div className="pointer-events-auto absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 md:block md:right-10">
          <div className="relative flex flex-col items-center gap-6">
            <div
              className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
              style={{ backgroundColor: "rgba(242,233,216,0.15)" }}
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
                    className="pointer-events-none font-mono text-[9px] uppercase tracking-[0.25em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ color: INK_DIM }}
                  >
                    {s.service.index}
                  </span>
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      isActive
                        ? "h-3 w-3 bg-[#c9a463] shadow-[0_0_12px_#c9a463]"
                        : "h-2 w-2 bg-[rgba(242,233,216,0.3)] group-hover:scale-125 group-hover:bg-[#f2e9d8]"
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
