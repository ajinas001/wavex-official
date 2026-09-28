"use client";

import SplitHover from "../SplitHover";
import { IMG } from "@/data/images";

const SOCIALS = [
  { label: "X", href: "https://x.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

const LINKS = [
  { text: "Services", href: "#places" },
  { text: "Work", href: "#objects" },
  { text: "Contact", href: "#contact" },
];

/**
 * Footer — white rounded block with mini-nav, socials and giant
 * char-split links, closing stone and credit.
 */
export default function Footer() {
  return (
    <footer data-header-color="dark" className="relative z-10 bg-light">
      <div className="relative overflow-hidden rounded-t-[3vw] bg-yellow px-gap pb-8 pt-12 text-brown md:px-margin">
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-brown/50">
            © 2026 Wavex Agency
          </span>
          <div className="hidden items-center gap-6 text-[10px] font-medium uppercase tracking-[0.2em] text-brown/60 md:flex">
            <a href="#" data-cursor="link" className="transition-colors hover:text-brown">
              Privacy
            </a>
            <a href="#" data-cursor="link" className="transition-colors hover:text-brown">
              Cookies
            </a>
            <a href="#" data-cursor="link" className="transition-colors hover:text-brown">
              Legal
            </a>
          </div>
        </div>

        {/* giant nav */}
        <nav className="mt-16 flex flex-col gap-2">
          {LINKS.map((l) => (
            <a
              key={l.text}
              href={l.href}
              data-cursor="link"
              className="group flex w-max items-center gap-6"
            >
              <SplitHover
                text={l.text}
                className="font-display text-[14vw] font-light leading-[0.9] md:text-[9vw]"
              />
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brown/30 transition-all duration-700 group-hover:-translate-y-1 group-hover:bg-brown group-hover:text-yellow md:h-14 md:w-14">
                <svg viewBox="0 0 12 12" className="h-4 w-4">
                  <path d="M3 1 L9 6 L3 11" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-20 flex items-end justify-between border-t border-brown/10 pt-6">
          <div className="max-w-[40ch]">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-brown/50">
              Wavex — Your digital partner for web design, development & strategy. We build products that perform.
            </p>
            <div className="mt-4 flex items-center gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  data-cursor="link"
                  className="text-[10px] font-medium uppercase tracking-[0.2em] text-brown/70 transition-colors hover:text-brown"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div className="figure w-24 opacity-80 md:w-32">
            <img src={IMG.footerStone} alt="Stone" loading="lazy" className="mask-fade" />
          </div>
        </div>
      </div>
    </footer>
  );
}
