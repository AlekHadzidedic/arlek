"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type Props = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
};

export default function BeforeAfter({ before, after, beforeAlt, afterAlt }: Props) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 2));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 2));
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-lg border border-line"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* After (full, underneath) */}
      <Image src={after} alt={afterAlt} fill sizes="(min-width: 768px) 640px, 100vw" className="object-cover" priority={false} />
      <span className="absolute right-3 top-3 rounded-full bg-bg/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-fg-2 backdrop-blur">
        After
      </span>

      {/* Before (clipped from the right, revealing left portion) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={beforeAlt} fill sizes="(min-width: 768px) 640px, 100vw" className="object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-bg/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-fg-2 backdrop-blur">
          Before
        </span>
      </div>

      {/* Divider + handle */}
      <div className="absolute inset-y-0 z-10 w-px bg-fg/60" style={{ left: `${pos}%` }}>
        <button
          type="button"
          aria-label="Drag to compare before and after"
          onKeyDown={onKeyDown}
          className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-line-2 bg-bg/80 text-fg-2 backdrop-blur transition hover:text-fg"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4L2 8l4 4M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
