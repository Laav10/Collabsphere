"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn("relative flex flex-col bg-zinc-950 text-white", className)}
      {...props}
    >
      {/* Aurora layer */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(100deg, #000 0%, #000 7%, transparent 10%, transparent 12%, #000 16%)",
            "repeating-linear-gradient(100deg, #ec4899 10%, #a855f7 15%, #e879f9 20%, #7c3aed 25%, #f472b6 30%)",
          ].join(", "),
          backgroundSize: "300%, 200%",
          backgroundPosition: "50% 50%, 50% 50%",
          animation: "aurora 60s linear infinite",
          filter: "blur(10px) saturate(150%)",
          opacity: 0.5,
        }}
      />

      {/* Radial vignette so edges stay dark */}
      {showRadialGradient && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, #09090b 80%)",
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
