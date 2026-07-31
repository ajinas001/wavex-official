"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function RevealImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
}: RevealImageProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-lux ${className}`}
      style={{
        clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(4% 4% 4% 4%)",
        transition: "clip-path 1.1s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <motion.div
        initial={{ scale: 1.25, opacity: 0.4 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
