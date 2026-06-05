"use client";

import { useId, useEffect, useRef, useState } from "react";

interface SquigglyTextProps {
  children: React.ReactNode;
  steps?: number;
  stepDuration?: number;
  scale?: number | [number, number];
  baseFrequency?: number;
  numOctaves?: number;
  as?: "span" | "div";
  className?: string;
}

export function SquigglyText({
  children,
  steps = 5,
  stepDuration = 80,
  scale = [6, 8],
  baseFrequency = 0.02,
  numOctaves = 3,
  as: Tag = "span",
  className,
}: SquigglyTextProps) {
  const id = useId().replace(/:/g, "");
  const filterId = `squiggly-${id}`;
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const [seed, setSeed] = useState(0);

  const scaleX = Array.isArray(scale) ? scale[0] : scale;
  const scaleY = Array.isArray(scale) ? scale[1] : scale;

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % steps;
      setSeed((s) => s + 1);
      if (turbRef.current) {
        turbRef.current.setAttribute("seed", String(step * 7 + 1));
      }
    }, stepDuration);
    return () => clearInterval(interval);
  }, [steps, stepDuration]);

  return (
    <Tag className={className} style={{ filter: `url(#${filterId})` }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence
              ref={turbRef}
              type="turbulence"
              baseFrequency={baseFrequency}
              numOctaves={numOctaves}
              seed={seed}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={Math.max(scaleX, scaleY)}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </Tag>
  );
}
