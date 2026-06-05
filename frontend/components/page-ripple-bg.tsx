"use client";

import { useState, useCallback, useRef } from "react";

interface ClickedCell { row: number; col: number; id: number; }

const CELL = 60;

export default function PageRippleBg() {
  const [clickedCell, setClickedCell] = useState<ClickedCell | null>(null);
  const idRef = useRef(0);

  // Compute grid dimensions dynamically from viewport
  const [dims, setDims] = useState({ rows: 20, cols: 40 });

  const ref = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const update = () => {
      setDims({
        rows: Math.ceil(el.clientHeight / CELL) + 1,
        cols: Math.ceil(el.clientWidth  / CELL) + 1,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleClick = useCallback((r: number, c: number) => {
    idRef.current += 1;
    setClickedCell({ row: r, col: c, id: idRef.current });
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="pointer-events-auto w-full h-full">
        {Array.from({ length: dims.rows }, (_, r) => (
          <div key={r} className="flex">
            {Array.from({ length: dims.cols }, (_, c) => {
              let delay = 0;
              let duration = 200;
              let active = false;

              if (clickedCell) {
                const dist = Math.sqrt(
                  Math.pow(r - clickedCell.row, 2) + Math.pow(c - clickedCell.col, 2)
                );
                delay    = dist * 55;
                duration = 180 + dist * 25;
                active   = true;
              }

              return (
                <div
                  key={`${r}-${c}-${clickedCell?.id ?? 0}`}
                  onClick={() => handleClick(r, c)}
                  className={active ? "animate-cell-ripple" : ""}
                  style={{
                    width: CELL,
                    height: CELL,
                    flexShrink: 0,
                    border: "1px solid rgba(236,72,153,0.07)",
                    backgroundColor: active ? "rgba(217,70,239,0.22)" : "transparent",
                    cursor: "crosshair",
                    "--duration": `${duration}ms`,
                    "--delay": `${delay}ms`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
