"use client";

/**
 * Wordmark — fixed bottom-center brand pill. Click scrolls to top.
 */
export default function Wordmark() {
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2">
      <button
        type="button"
        data-cursor="link"
        onClick={() => {
          const lenis = (window as any).__lenis;
          if (lenis) lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="group flex items-center gap-3 rounded-full border border-yellow/25 bg-black/45 px-6 py-3 text-yellow backdrop-blur-md transition-colors duration-500 hover:bg-black/70"
      >
        <span className="text-[9px] font-medium uppercase tracking-[0.35em]">
          TheWaveXAssembly
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-yellow/50 transition-colors duration-500 group-hover:bg-yellow" />
      </button>
    </div>
  );
}
