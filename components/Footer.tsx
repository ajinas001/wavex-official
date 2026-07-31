"use client";

import { ArrowUp } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

const COLUMNS = [
  {
    heading: "Sitemap",
    links: [
      { label: "Work", href: "#work" },
      { label: "Studio", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Social",
    links: [
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Twitter / X", href: "#" },
    ],
  },
];

export default function Footer() {
  const backToTopRef = useMagnetic<HTMLButtonElement>(0.4);

  function scrollTop() {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="border-t border-ink/10 px-6 pb-10 pt-section-sm md:px-12">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-16 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <h2 className="font-display text-3xl">Studio Noir</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            An independent design and development practice. Based remotely,
            working worldwide.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:flex md:gap-20">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-muted">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      data-cursor="link"
                      href={link.href}
                      className="text-sm text-ink transition-opacity hover:opacity-60"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button
          ref={backToTopRef}
          data-cursor="link"
          onClick={scrollTop}
          aria-label="Back to top"
          className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-bg"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto mt-20 flex max-w-[1600px] flex-col items-start justify-between gap-4 border-t border-ink/10 pt-8 text-xs text-muted md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} Studio Noir. All rights reserved.</span>
        <span>Designed &amp; built in-house.</span>
      </div>
    </footer>
  );
}
