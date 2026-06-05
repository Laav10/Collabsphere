"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface ClickedCell {
  row: number;
  col: number;
  id: number;
}

interface DivGridProps {
  rows: number;
  cols: number;
  cellSize: number;
  borderColor?: string;
  fillColor?: string;
  clickedCell: ClickedCell | null;
  onCellClick: (row: number, col: number) => void;
  interactive?: boolean;
  className?: string;
}

function DivGrid({
  rows,
  cols,
  cellSize,
  borderColor = "rgba(236,72,153,0.15)",
  fillColor = "rgba(217,70,239,0.35)",
  clickedCell,
  onCellClick,
  interactive = true,
  className,
}: DivGridProps) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ cursor: interactive ? "crosshair" : "default" }}
    >
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex">
          {Array.from({ length: cols }, (_, c) => {
            let delay = 0;
            let duration = 200;
            let active = false;

            if (clickedCell) {
              const dist = Math.sqrt(
                Math.pow(r - clickedCell.row, 2) + Math.pow(c - clickedCell.col, 2)
              );
              delay = dist * 55;
              duration = 180 + dist * 25;
              active = true;
            }

            return (
              <div
                key={`${r}-${c}-${clickedCell?.id ?? 0}`}
                onClick={interactive ? () => onCellClick(r, c) : undefined}
                className={active ? "animate-cell-ripple" : ""}
                style={{
                  width: cellSize,
                  height: cellSize,
                  flexShrink: 0,
                  border: `1px solid ${borderColor}`,
                  backgroundColor: active ? fillColor : "transparent",
                  // CSS variables picked up by animate-cell-ripple
                  "--duration": `${duration}ms`,
                  "--delay": `${delay}ms`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface BackgroundRippleEffectProps {
  rows?: number;
  cols?: number;
  cellSize?: number;
  borderColor?: string;
  fillColor?: string;
  interactive?: boolean;
  className?: string;
}

export function BackgroundRippleEffect({
  rows = 8,
  cols = 27,
  cellSize = 56,
  borderColor,
  fillColor,
  interactive = true,
  className,
}: BackgroundRippleEffectProps) {
  const [clickedCell, setClickedCell] = useState<ClickedCell | null>(null);
  const idRef = useRef(0);

  const handleCellClick = useCallback((row: number, col: number) => {
    idRef.current += 1;
    setClickedCell({ row, col, id: idRef.current });
  }, []);

  return (
    <DivGrid
      rows={rows}
      cols={cols}
      cellSize={cellSize}
      borderColor={borderColor}
      fillColor={fillColor}
      clickedCell={clickedCell}
      onCellClick={handleCellClick}
      interactive={interactive}
      className={className}
    />
  );
}
