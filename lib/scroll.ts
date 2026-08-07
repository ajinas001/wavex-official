"use client";

/**
 * scrollToY — smooth scroll through Lenis when active, else native.
 * All programmatic scrolls should go through here so the virtual
 * scroller and the nav feel the same.
 */
export function scrollToY(y: number, duration?: number) {
  const lenis = typeof window !== "undefined" ? window.__lenis : null;
  if (lenis) {
    lenis.scrollTo(y, { duration: duration ?? 1.2, force: true });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export function scrollToId(id: string, duration?: number) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  scrollToY(top, duration);
}

export function scrollToTop(duration?: number) {
  scrollToY(0, duration);
}
