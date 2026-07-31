"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { ReactNode } from "react";

interface MagneticButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}

export default function MagneticButton({
  href,
  onClick,
  children,
  variant = "solid",
  className = "",
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLAnchorElement>(0.35);

  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 font-body text-sm tracking-wide transition-colors duration-500 ease-lux";
  const solid = "bg-ink text-bg hover:text-ink";
  const outline = "border border-ink/20 text-ink hover:text-bg";

  const content = (
    <>
      <span
        className={`absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-full ${
          variant === "solid" ? "bg-surface" : "bg-ink"
        } transition-transform duration-500 ease-lux group-hover:scale-y-100`}
        aria-hidden
      />
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 grid h-6 w-6 place-items-center overflow-hidden rounded-full">
        <ArrowUpRight
          className="absolute h-4 w-4 -translate-x-4 translate-y-4 opacity-0 transition-all duration-400 ease-lux group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
        />
        <ArrowUpRight className="h-4 w-4 transition-all duration-400 ease-lux group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:opacity-0" />
      </span>
    </>
  );

  const classes = `${base} ${variant === "solid" ? solid : outline} ${className}`;

  if (href) {
    return (
      <Link
        ref={ref}
        href={href}
        data-cursor="link"
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      ref={ref}
      onClick={onClick}
      role="button"
      tabIndex={0}
      data-cursor="link"
      className={classes}
    >
      {content}
    </a>
  );
}
