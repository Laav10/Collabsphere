"use client";

import { SquigglyText } from "@/components/ui/squiggly-text";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Footer() {
  return (
    <AuroraBackground className="border-t border-zinc-900">
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 gap-4 text-center">

        {/* Squiggly wordmark — white */}
        <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none select-none text-white">
          <SquigglyText steps={6} stepDuration={70} scale={[5, 9]} baseFrequency={0.018}>
            Collabsphere
          </SquigglyText>
        </h2>

        {/* Tagline — warm white */}
        <p className="text-zinc-300 text-sm sm:text-base tracking-[0.2em] uppercase mt-2">
          Build together. Ship faster.
        </p>

        <div className="h-px w-20 bg-white/15 mt-1" />

        {/* Copyright — soft white */}
        <p className="text-zinc-400 text-xs sm:text-sm">
          © {new Date().getFullYear()} Collabsphere. All rights reserved.
        </p>
      </div>
    </AuroraBackground>
  );
}
