"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import "./menu.css";

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

const LINKS = [
  { label: "Back Home", cls: "back-home", id: "top" },
  { label: "Places", cls: "places", id: "places" },
  { label: "Objects", cls: "objects", id: "objects" },
  { label: "About", cls: "about", id: "about" },
  { label: "People", cls: "people", id: "people" },
];

const LEAVE_MS = 2100; // overlay 1.5s + links ≤ 0.9 + 5*.15

/** Source split chars: `data-split-content`, `--char-index`, `--char-random`(0-10). */
function MenuChars({ text, random = false }: { text: string; random?: boolean }) {
  const chars = Array.from(text);
  return (
    <>
      {chars.map((char, i) => (
        <span
          key={i}
          className="-s-char"
          data-split-content={char}
          style={
            {
              "--char-index": i,
              ...(random
                ? { "--char-random": Math.floor(Math.random() * 11) }
                : {}),
            } as CSSProperties
          }
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}

/**
 * Menu — obsidian full-screen menu port (source-verbatim CSS). Grey overlay
 * + stone-wall masked underlay, close pill + rotating X, 6-col/8-col nav
 * grid with char-rotate links ("Back Home / Places / Objects / About /
 * Contacts (disabled) / People"), decorative rings ("guy") with a split
 * figure label. Enter/leave driven by `-t-menu-*` phase classes.
 */
export default function Menu({ open, onClose }: MenuProps) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"enter" | "leave" | null>(null);

  useEffect(() => {
    if (reduce) {
      setMounted(open);
      return;
    }
    if (open) {
      const y = window.scrollY;
      document.documentElement.style.setProperty("--top-position", String(y));
      setMounted(true);
      setPhase("enter");
      const t = setTimeout(() => setPhase(null), 60);
      return () => clearTimeout(t);
    }
    if (mounted) {
      setPhase("leave");
      const t = setTimeout(() => {
        setMounted(false);
        setPhase(null);
      }, LEAVE_MS);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduce]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  const rootClass = [
    "full-screen-menu",
    phase === "enter" ? "-t-menu-enter-active -t-menu-enter-from" : "",
    phase === null ? "-t-menu-enter-active" : "",
    phase === "leave" ? "-t-menu-leave-active -t-menu-leave-to" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const go = (id: string) => {
    onClose();
    setTimeout(() => {
      if (id === "top") scrollToTop();
      else scrollToId(id);
    }, 100);
  };

  return (
    <div className={rootClass} aria-hidden={!open}>
      <div className="overlay" />
      <div className="oy">
        <div className="-w">
          <a
            href="#"
            className="button-close grid-place"
            data-cursor="link"
            onClick={(e) => {
              e.preventDefault();
              go("top");
            }}
          >
            <span className="-mm -up">Close</span>
          </a>

          <button
            type="button"
            className="close grid-place"
            onClick={onClose}
            aria-label="Close menu"
            data-cursor="link"
          />

          <div className="underlay grid-place">
            <div />
          </div>

          <nav className="grid-place">
            <span className="guy">
              <figure>
                <svg viewBox="0 0 40 40" aria-hidden="true" fill="var(--c-yellow)">
                  <path d="M20 4c-6 0-10 4.6-10 10.4 0 4.6 2.6 8.4 6.4 10-1.8.6-3 2-3 3.6 0 .8.4 1.6 1 2.4-3.6 1-6.4 4-7 8h25.2c-.6-4-3.4-7-7-8 .6-.8 1-1.6 1-2.4 0-1.6-1.2-3-3-3.6 3.8-1.6 6.4-5.4 6.4-10C30 8.6 26 4 20 4z" />
                </svg>
              </figure>
              <span>
                <MenuChars text="Guy" random />
              </span>
            </span>

            {LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.id === "top" ? "#" : `#${link.id}`}
                className={link.cls}
                data-cursor="link"
                style={{ "--l-delay": i } as CSSProperties}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.id);
                }}
              >
                <span className="-splitted">
                  <MenuChars text={link.label} />
                </span>
              </a>
            ))}

            <span className="contacts">
              <span className="-splitted">
                <MenuChars text="Contacts" />
              </span>
            </span>
          </nav>
        </div>
      </div>
    </div>
  );
}
