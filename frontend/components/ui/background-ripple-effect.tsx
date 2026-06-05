"use client";

import { useState, useCallback } from "react";

interface CellProps {
  rowIdx: number;
  colIdx: number;
  onRipple: (row: number, col: number) => void;
  rippleOrigin: { row: number; col: number } | null;
  cellSize: number;
}

function Cell({ rowIdx, colIdx, onRipple, rippleOrigin, cellSize }: CellProps) {
  let delay = 0;
  let duration = 200;
  let active = false;

  if (rippleOrigin) {
    const dist = Math.sqrt(
      Math.pow(rowIdx - rippleOrigin.row, 2) +
        Math.pow(colIdx - rippleOrigin.col, 2)
    );
    delay = dist * 60;
    duration = 200 + dist * 30;
    active = true;
  }

  return (
    <div
      onClick={() => onRipple(rowIdx, colIdx)}
      className="border border-zinc-800/60 cursor-pointer transition-colors"
      style={{
        width: cellSize,
        height: cellSize,
        animationName: active ? "cell-ripple" : "none",
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationFillMode: "none",
        animationIterationCount: "1",
        animationTimingFunction: "ease-out",
      }}
    />
  );
}

interface BackgroundRippleEffectProps {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}

export function BackgroundRippleEffect({
  rows = 8,
  cols = 27,
  cellSize = 56,
  className = "",
}: BackgroundRippleEffectProps) {
  const [rippleOrigin, setRippleOrigin] = useState<{
    row: number;
    col: number;
    key: number;
  } | null>(null);

  const handleRipple = useCallback((row: number, col: number) => {
    setRippleOrigin((prev) => ({
      row,
      col,
      key: (prev?.key ?? 0) + 1,
    }));
  }, []);

  return (
    <div
      className={`overflow-hidden select-none ${className}`}
      style={{ width: cols * cellSize, maxWidth: "100%" }}
    >
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex">
          {Array.from({ length: cols }, (_, c) => (
            <Cell
              key={`${r}-${c}-${rippleOrigin?.key ?? 0}`}
              rowIdx={r}
              colIdx={c}
              onRipple={handleRipple}
              rippleOrigin={rippleOrigin}
              cellSize={cellSize}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
