"use client";

import { motion } from "framer-motion";

export function AmbientRadar() {
  return (
    <div className="relative mx-auto aspect-square w-40 sm:w-56" aria-hidden>
      <div className="absolute inset-0 rounded-full border border-sand/15" />
      <div className="absolute inset-6 rounded-full border border-sand/10" />
      <div className="absolute inset-12 rounded-full border border-sand/10" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-sand/10" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-sand/10" />
      <motion.div
        className="absolute inset-0 rounded-full opacity-70 [background:conic-gradient(from_0deg,transparent_0deg,transparent_300deg,color-mix(in_srgb,var(--orange)_35%,transparent)_360deg)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange" />
    </div>
  );
}
