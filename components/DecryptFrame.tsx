"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}#$%&*+=_|~^";

const SCRAMBLE_MS = 420;
const FRAME_MS = 55;

/**
 * Churns `text` for a moment, then settles on it. Used for the caption bar so
 * the frame's label resolves in step with its image.
 *
 * Returns `text` unchanged until `run` flips true, so the server-rendered
 * markup and the first client render always agree.
 */
function useScramble(text: string, run: boolean) {
  const [out, setOut] = useState(text);
  // The label churns the first time its frame resolves and never again: a
  // frame that re-resolves on every scroll pass should not re-announce itself.
  const spent = useRef(false);

  useEffect(() => {
    if (!run || spent.current) return;
    spent.current = true;
    let raf = 0;
    let start = 0;
    let last = -Infinity;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      if (elapsed >= SCRAMBLE_MS) {
        setOut(text);
        return;
      }
      if (elapsed - last >= FRAME_MS) {
        last = elapsed;
        // Characters settle left to right so the label reads as it lands.
        const settled = Math.floor((elapsed / SCRAMBLE_MS) * text.length);
        setOut(
          [...text]
            .map((ch, i) =>
              i < settled || ch === " " || ch === "·"
                ? ch
                : GLYPHS[(Math.random() * GLYPHS.length) | 0],
            )
            .join(""),
        );
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, run]);

  return out;
}

/**
 * Whether the frame is currently resolved.
 *
 * `once` frames resolve the first time they are scrolled to and stay that way
 * — right for a pair being compared, where re-encrypting half the comparison
 * would destroy it. `while-read` frames resolve only while they sit in a band
 * across the middle of the viewport, so a column of screenshots is never more
 * than one bright rectangle at a time: the page decrypts what is being looked
 * at and lets the rest sit as texture.
 *
 * Either way, reduced motion and browsers without the observer get the plain
 * resolved image immediately.
 */
function useRevealed(ref: React.RefObject<HTMLElement | null>, once: boolean) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches !== false;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (once) {
          if (!visible) return;
          setRevealed(true);
          io.disconnect();
        } else {
          setRevealed(visible);
        }
      },
      once
        ? // A little way into the viewport rather than at its very edge: the
          // resolve should happen where it can be watched, not off the bottom.
          { threshold: 0.25, rootMargin: "0px 0px -12% 0px" }
        : { threshold: 0, rootMargin: "-36% 0px -36% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [ref, once]);

  return revealed;
}

export type DecryptFrameProps = {
  src: string;
  alt: string;
  /** Left half of the caption bar. Scrambles as the image resolves. */
  label: string;
  /** Right half of the caption bar — quieter, never scrambles. */
  meta?: string;
  /** Optional link on the right of the caption bar. Omit inside an anchor. */
  href?: string;
  hrefLabel?: string;
  /** Tailwind aspect class for the crop, e.g. `aspect-[16/10]`. */
  aspect?: string;
  sizes: string;
  /** Intrinsic size. Given, the image renders at natural ratio and is cropped
   *  from the top; omitted, it fills the frame. */
  width?: number;
  height?: number;
  /** Marks the frame the section is arguing for. */
  emphasis?: boolean;
  priority?: boolean;
  /**
   * `true` resolves the image on first sight and leaves it resolved — for
   * frames that must be readable together, like a before/after pair.
   * `false` (the default) resolves it only while it is the frame being read.
   */
  revealOnce?: boolean;
};

/**
 * The single frame every client screenshot on this page sits in.
 *
 * Screenshots of other people's websites arrive with their own colour, and a
 * column of them reads as a wall of foreign rectangles. Here each one starts
 * as a phosphor-graded, scanlined still with a churning label, and resolves to
 * full colour when it is scrolled to — the same decode the headline performs,
 * so the work belongs to the page rather than interrupting it.
 */
export default function DecryptFrame({
  src,
  alt,
  label,
  meta,
  href,
  hrefLabel = "Full page ↗",
  aspect = "aspect-[16/10]",
  sizes,
  width,
  height,
  emphasis,
  priority,
  revealOnce = false,
}: DecryptFrameProps) {
  const ref = useRef<HTMLElement>(null);
  const revealed = useRevealed(ref, revealOnce);
  const shown = useScramble(label, revealed);

  return (
    <figure
      ref={ref}
      className={`group/frame overflow-hidden rounded-md border bg-bg-2 ${
        emphasis ? "border-line-2" : "border-line"
      }`}
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-line pl-2.5 pr-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em]">
        <span className="flex min-w-0 items-center gap-1.5 py-2">
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
          <span className="truncate">
            <span className={emphasis ? "text-accent" : "text-fg-2"}>{shown}</span>
            {meta ? <span className="text-fg-3"> · {meta}</span> : null}
          </span>
        </span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[2.75rem] shrink-0 items-center px-2 text-fg-3 transition-colors hover:text-fg md:min-h-[1.75rem]"
          >
            {hrefLabel}
          </a>
        ) : null}
      </figcaption>

      <div className={`relative overflow-hidden ${aspect} ${revealed ? "" : "scanlines"}`}>
        <Image
          src={src}
          alt={alt}
          {...(width && height
            ? { width, height, className: "absolute inset-x-0 top-0 w-full" }
            : { fill: true, className: "object-cover object-top" })}
          sizes={sizes}
          priority={priority}
          style={{
            // Greyscale first, then knocked down and hardened: a light-themed
            // client site has to land at the same value as a dark one, or the
            // phosphor wash turns it into a solid green field.
            filter: revealed ? "none" : "grayscale(1) brightness(0.3) contrast(1.3)",
            transition: "filter 700ms cubic-bezier(0.2, 0.7, 0.3, 1)",
          }}
        />
        {/* Phosphor wash over the greyscale still. `color` blend keeps the
            screenshot's own luminance, so the layout stays readable while it
            is still tinted. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-accent transition-opacity duration-700"
          style={{ mixBlendMode: "color", opacity: revealed ? 0 : 0.42 }}
        />
      </div>
    </figure>
  );
}
