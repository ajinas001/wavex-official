"use client";

import type { ReactNode } from "react";
import SplitHover from "./SplitHover";

interface ButtonProps {
  label: string;
  href?: string;
  variant?: "solid" | "reverse" | "big";
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

/**
 * Button — obsidian `BaseButton` port. Yellow pill with clip-path inset,
 * char-split label, black slide-up fill on hover. `-reverse` = glass on dark.
 */
export default function Button({
  label,
  href,
  variant = "solid",
  className = "",
  onClick,
  children,
}: ButtonProps) {
  const cls = `button -${variant} ${className}`.trim();
  const content = (
    <>
      <span className="text -mm -up uppercase tracking-[0.15em] font-body font-medium">
        <SplitHover text={label} />
      </span>
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={cls} data-cursor="link">
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} data-cursor="link">
      {content}
    </button>
  );
}
