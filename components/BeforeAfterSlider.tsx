"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { useRevealed } from "./DecryptFrame";

const STEP = 2;
const BIG_STEP = 10;

export type BeforeAfterSliderProps = {
  before: string;
  after: string;
  /** Intrinsic pixel size of each screenshot, so the scroll track can hold the
   *  whole page at its true aspect rather than a cropped slice. */
  beforeW: number;
  beforeH: number;
  afterW: number;
  afterH: number;
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
};

/**
 * Both states of a page in one frame, split by a wipe the reader drags — and
 * now the *whole* page, not just its first screen.
 *
 * The earlier version cropped both shots to a 16/10 hero slice: a wipe needs
 * the two images at the same scale showing the same region, and only the hero
 * lines up between a stock template and its rebuild. But that hid everything
 * below the fold. This version instead renders each screenshot full-length
 * inside a fixed viewport that *scrolls*: drag the handle to wipe left/right,
 * scroll to travel top-to-bottom. Both layers share one scroll track, so they
 * move together and the wipe stays a like-for-like comparison at every height.
 *
 * Interaction is split so touch never fights itself: the handle is the only
 * thing that moves the wipe (horizontal drag), and everything else in the
 * frame scrolls (vertical swipe/wheel). No `touch-none` on the whole area —
 * that would have killed the scroll the redesign is built around.
 *
 * The chrome is the page's decrypt frame and the divider is its caret: the
 * whole thing reads as a cursor sweeping the old site off the screen.
 */
export default function BeforeAfterSlider({
  before,
  after,
  beforeW,
  beforeH,
  afterW,
  afterH,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  beforeMeta,
  afterMeta,
  sizes,
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const revealed = useRevealed(frameRef, true);

  const showingAfter = pos < 50;

  // The wipe is a percentage of the visible viewport's width — the images are
  // full-width inside it, so viewport-x maps straight to image-x regardless of
  // how far the frame has been scrolled.
  const setFromClientX = useCallback((clientX: number) => {
    const el = viewRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
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
  const filterStyle = {
    filter: encrypted,
    transition: "filter 700ms cubic-bezier(0.2, 0.7, 0.3, 1)",
  } as const;

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

      {/* Fixed viewport box. The scroller and the wipe overlay are siblings
          that both fill it: the scroller travels the page, the overlay stays
          put — so the divider and handle are pinned to what's on screen rather
          than riding the track down and out of view. */}
      <div
        ref={viewRef}
        className="relative h-[26rem] select-none sm:h-[34rem] lg:h-[40rem]"
      >
        {/* The scroll track: after in normal flow sets the height, before is an
            absolute overlay clipped back from the right so dragging left
            uncovers the rebuild. Both are full-width with natural height, so a
            given scroll offset shows the same slab of each page.
            `overscroll-contain` keeps a flick from scrolling the page once the
            frame reaches its end. */}
        <div className="wipe-scroll absolute inset-0 overflow-y-auto overscroll-contain">
          <div className="relative w-full">
            <Image
              src={after}
              alt={afterAlt}
              width={afterW}
              height={afterH}
              sizes={sizes}
              className="block h-auto w-full"
              style={filterStyle}
            />
            <div
              className="absolute inset-x-0 top-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <Image
                src={before}
                alt={beforeAlt}
                width={beforeW}
                height={beforeH}
                sizes={sizes}
                className="block h-auto w-full"
                style={filterStyle}
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
          </div>
        </div>

        {/* Wipe overlay, pinned to the viewport. Scanlines live here too so the
            CRT texture stays put like a real phosphor screen instead of
            scrolling with the page. */}
        <div
          className={`pointer-events-none absolute inset-0 z-10 ${
            revealed ? "" : "scanlines"
          }`}
        >
          <div
            className="absolute inset-y-0 w-px bg-accent"
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
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              // 44px at every width, and `touch-none` so a drag on the handle
              // wipes instead of scrolling the frame. It is the primary action
              // on the page; a handle that shrinks below the tap-target floor
              // trades an accessibility gate for a few pixels of daintiness.
              className="pointer-events-auto absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 touch-none cursor-ew-resize place-items-center rounded-sm border border-accent bg-bg font-mono text-[0.625rem] text-accent transition-colors hover:bg-bg-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span aria-hidden="true">◂▸</span>
            </button>
          </div>
        </div>
      </div>
    </figure>
  );
}
