"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import "./header.css";
import Menu from "./Menu";
import SplitHover from "./SplitHover";
import { scrollToId, scrollToTop } from "@/lib/scroll";

/**
 * Header — obsidian port (source-verbatim CSS). Fixed brown-gradient veil,
 * stacked `-h5` brand ("The Obsidian Assembly" + "Imagine Possible"), Places /
 * separator / Objects pills on the 12-col grid (5/6/7), "send request" pill
 * that drops in on scroll (col 10), 3-dash menu button (col 11). Skew drop-in
 * entrance gated by `html.-ready`, `-scrolled` / `-hidden` / `-dark` states.
 */
export default function Header() {
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dir = useScrollDirection();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onReady = () => setReady(true);
    window.addEventListener("wavex:ready", onReady);
    return () => window.removeEventListener("wavex:ready", onReady);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ready) return;
    setHidden(!reduce && dir === "down" && window.scrollY > 200);
  }, [dir, reduce, ready]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-header-color]")
    );
    if (!sections.length) return;

    const visible = new Map<HTMLElement, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target as HTMLElement, entry.intersectionRatio);
          } else {
            visible.delete(entry.target as HTMLElement);
          }
        }
        let best: HTMLElement | null = null;
        for (const [el, ratio] of visible) {
          if (!best || ratio > (visible.get(best) ?? 0)) best = el;
        }
        setDark(best?.dataset.headerColor === "dark");
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const classes = ["site-header"];
  if (scrolled && ready && !menuOpen) classes.push("-scrolled");
  if (dark) classes.push("-dark");
  if (hidden && ready && !menuOpen) classes.push("-hidden");

  const openAdmission = () =>
    window.dispatchEvent(new Event("wavex:open-admission"));

  return (
    <>
      <header className={classes.join(" ")}>
        <div className="-w">
          <a
            href="#"
            data-cursor="link"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            className="brand -nl"
          >
            <span className="-h5 the">The</span>
            <span className="-h5 obsidian">Obsidian</span>
            <span className="-h5 assembly">Assembly</span>
            <span className="-mm">Imagine Possible</span>
          </a>

          <button
            type="button"
            data-cursor="link"
            onClick={() => scrollToId("places")}
            className="button -p -m-m -reverse places"
          >
            <SplitHover text="Places" className="text -mm -up" />
          </button>
          <span className="sep" aria-hidden="true" />
          <button
            type="button"
            data-cursor="link"
            onClick={() => scrollToId("objects")}
            className="button -p -m-m -reverse objects"
          >
            <SplitHover text="Objects" className="text -mm -up" />
          </button>

          <button
            type="button"
            data-cursor="link"
            onClick={openAdmission}
            className="button -p -m-m -reverse request"
          >
            <SplitHover text="send request" className="text -mm -up" />
          </button>

          <div className="menu-wrap">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              data-cursor="link"
              onClick={() => setMenuOpen((o) => !o)}
              className="menu button -p -m-m"
            >
              <SplitHover text="Menu" className="text -mm -up" />
              <span className="menu-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
