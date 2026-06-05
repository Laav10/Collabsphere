"use client";

import { SquigglyText } from "@/components/ui/squiggly-text";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export default function Footer() {
  return (
    <footer className="relative bg-[#09090b] border-t border-zinc-900 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-pink-600/6 blur-[80px] rounded-full" />
      </div>

      {/* Ripple grid — passive visible layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-35">
        <BackgroundRippleEffect rows={6} cols={30} cellSize={52} />
      </div>

      {/* Ripple grid — interactive layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BackgroundRippleEffect rows={6} cols={30} cellSize={52} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4 gap-5 pointer-events-none">
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">
          <SquigglyText
            steps={6}
            stepDuration={70}
            scale={[5, 9]}
            baseFrequency={0.018}
          >
            Collabsphere
          </SquigglyText>
        </h2>

        <p className="text-zinc-600 text-xs tracking-[0.28em] uppercase mt-2">
          Build together. Ship faster.
        </p>

        <div className="h-px w-20 bg-gradient-to-r from-transparent via-pink-500/40 to-transparent mt-2" />

        <p className="text-xs text-zinc-700">
          © {new Date().getFullYear()} Collabsphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
