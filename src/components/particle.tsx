"use client";
import { motion } from "framer-motion";

export default function Particles() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {[...Array(30)].map((_, i) => {
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 15 + 10;
        const opacity = Math.random() * 0.4 + 0.1;
        const color = i % 3 === 0 ? "var(--primary)" : i % 2 === 0 ? "var(--secondary)" : "var(--muted)";

        return (
          <motion.span
            key={i}
            className="absolute bottom-0 rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              backgroundColor: color,
              opacity,
            }}
            animate={{
              y: [-1000, window.innerHeight + 100],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_120%)]">
        <svg
          className="absolute inset-0 h-full w-full stroke-foreground/5 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hero"
              width="80"
              height="80"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero)" />
        </svg>
      </div>
    </div>
  );
}