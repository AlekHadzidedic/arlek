"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { useRevealed } from "./DecryptFrame";

const STEP = 2;
const BIG_STEP = 10;

export type BeforeAfterSliderProps = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  /** Caption bar text for each side. */
  beforeLabel: string;
  afterLabel: string;
  /** Quieter half of each caption. Dropped below `sm`, where two labels and
   *  two metas in one bar can only truncate. */
  beforeMeta?: string;
  afterMeta?: string;
  sizes: string;
  aspect?: string;
};

/**
 * One frame holding both states of the same page, split by a wipe the reader
 * drags.
 *
 * Two screenshots side by side make the reader do the comparing — hold one
 * half in memory, look at the other, find the differences. A wipe puts both
 * states in the same rectangle at the same scale, so the difference happens
 * in place and needs no memory at all.
 *
 * The chrome is the page's decrypt frame and the divider is its caret: the
 * whole thing reads as a cursor sweeping the old site off the screen. Both
 * images are cropped `object-cover object-top` to identical proportions, so
 * despite different natural heights the two halves always show the same
 * region of the page — a wipe between mismatched crops compares nothing.
 */
export default function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  beforeMeta,
  afterMeta,
  sizes,
  aspect = "aspect-[16/10]",
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const revealed = useRevealed(frameRef, true);

  const showingAfter = pos < 50;

  const setFromClientX = useCallback((clientX: number) => {
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    // Position first, capture second. `setPointerCapture` throws on a pointer
    // id the browser does not recognise, and if that happens before the move
    // the press does nothing at all — a tap on the frame has to land the wipe
    // whether or not capture is available.
    setFromClientX(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // No capture: dragging still works while the pointer stays in the frame.
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Nothing was captured; nothing to release.
    }
  };

  // Arrows nudge in the direction the handle moves, shift+arrow moves in tens,
  // and Home/End throw the wipe to the start and end of the story rather than
  // to 0 and 100 — Home is the site as it was, End is the site as it shipped.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? BIG_STEP : STEP;
    let next: number | null = null;
    if (e.key === "ArrowLeft") next = pos - step;
    else if (e.key === "ArrowRight") next = pos + step;
    else if (e.key === "Home") next = 100;
    else if (e.key === "End") next = 0;
    if (next === null) return;
    e.preventDefault();
    setPos(Math.min(100, Math.max(0, next)));
  };

  const encrypted = revealed
    ? undefined
    : ("grayscale(1) brightness(0.3) contrast(1.3)" as const);

  return (
    <figure
      ref={frameRef}
      className="overflow-hidden rounded-md border border-line-2 bg-bg-2"
    >
      {/* Both labels live in the caption bar rather than floating on the image.
          Whichever side the wipe is showing more of is the lit one, so the bar
          doubles as a readout of where the divider sits. */}
      <figcaption className="flex items-center justify-between gap-3 border-b border-line px-2.5 py-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em]">
        <span className="flex min-w-0 items-center gap-1.5">
          <span
            aria-hidden="true"
            className={
              revealed
                ? "text-fg-3 transition-colors duration-500"
                : "cursor-blink text-accent"
            }
          >
            ▍
          </span>
          <span
            className={`truncate transition-colors ${
              showingAfter ? "text-fg-3" : "text-fg-2"
            }`}
          >
            {beforeLabel}
            {beforeMeta ? (
              <span className="hidden text-fg-3 sm:inline"> · {beforeMeta}</span>
            ) : null}
          </span>
        </span>
        <span
          className={`truncate transition-colors ${
            showingAfter ? "text-accent" : "text-fg-3"
          }`}
        >
          {afterLabel}
          {afterMeta ? (
            <span className="hidden text-fg-3 sm:inline"> · {afterMeta}</span>
          ) : null}
        </span>
      </figcaption>

      <div
        ref={areaRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        // `touch-none` matters more than it looks: without it a drag on a phone
        // scrolls the page instead of moving the wipe.
        className={`relative touch-none select-none overflow-hidden ${aspect} ${
          revealed ? "" : "scanlines"
        }`}
      >
        {/* After sits underneath, whole. The before image is clipped back from
            the right, so dragging left uncovers the rebuild. */}
        <Image
          src={after}
          alt={afterAlt}
          fill
          sizes={sizes}
          className="object-cover object-top"
          style={{
            filter: encrypted,
            transition: "filter 700ms cubic-bezier(0.2, 0.7, 0.3, 1)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src={before}
            alt={beforeAlt}
            fill
            sizes={sizes}
            className="object-cover object-top"
            style={{
              filter: encrypted,
              transition: "filter 700ms cubic-bezier(0.2, 0.7, 0.3, 1)",
            }}
          />
        </div>

        {/* Phosphor wash, matching the still frames: the pair arrives tinted
            and resolves once, so the comparison joins the page's decode
            instead of arriving as a bright foreign rectangle. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-accent transition-opacity duration-700"
          style={{ mixBlendMode: "color", opacity: revealed ? 0 : 0.42 }}
        />

        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-accent"
          style={{ left: `${pos}%` }}
        >
          <button
            type="button"
            role="slider"
            aria-label="Drag to wipe between the original site and the rebuild"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(100 - pos)}% rebuilt site shown`}
            onKeyDown={onKeyDown}
            // 44px at every width. It is the primary action on the page, and a
            // handle that shrinks below the tap-target floor on desktop only
            // trades an accessibility gate for a few pixels of daintiness.
            className="pointer-events-auto absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-sm border border-accent bg-bg font-mono text-[0.625rem] text-accent transition-colors hover:bg-bg-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span aria-hidden="true">◂▸</span>
          </button>
        </div>
      </div>
    </figure>
  );
}
