import React from "react";
import { motion } from "framer-motion";

export function SpringBackdrop() {
  const petals = Array.from({ length: 14 }).map((_, i) => i);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -top-48 right-[-180px] h-[560px] w-[560px] rounded-full bg-lime-200/30 blur-3xl" />
      <div className="absolute bottom-[-220px] left-[20%] h-[620px] w-[620px] rounded-full bg-green-200/20 blur-3xl" />

      {petals.map((i) => (
        <motion.span
          key={i}
          className="absolute h-3 w-3 rounded-full bg-emerald-300/35 ring-1 ring-emerald-200/50"
          initial={{
            x: `${(i * 7) % 100}%`,
            y: `${(i * 11) % 80}%`,
            opacity: 0.5,
            scale: 0.8,
          }}
          animate={{
            y: ["0%", "110%"],
            x: ["0%", `${(i % 2 === 0 ? 1 : -1) * 18}px`],
            rotate: [0, 180],
            opacity: [0.55, 0.15],
          }}
          transition={{
            duration: 10 + (i % 5) * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.35,
          }}
        />
      ))}
    </div>
  );
}
