"use client";

import { useEffect, useState } from "react";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/\\<>[]{}#$%&*+=_|~^";

// Timing: each character churns for SCRAMBLE_MS before locking, and each
// successive character starts STAGGER_MS later, so the resolve sweeps
// left-to-right. Two lines chained gives roughly 1.9s end to end — slow
// enough to read as deliberate rather than a flicker on load.
const SCRAMBLE_MS = 560;
const STAGGER_MS = 24;
const FRAME_MS = 55;

type Cell = { ch: string; locked: boolean };

/**
 * Resolves `text` out of a character scramble, once, on mount.
 *
 * Renders the real text on the server and on the first client render, so the
 * markup search engines and no-JS visitors receive is never scrambled. The
 * animated form is swapped in from an effect, which also means the first
 * client render matches the server and no hydration mismatch occurs.
 */
export default function Decode({
  text,
  className,
  indexOffset = 0,
}: {
  text: string;
  className?: string;
  /**
   * How many characters precede this run in the overall headline. Chaining two
   * runs by offset keeps the resolve sweeping continuously across both.
   *
   * Deliberately a character count rather than a delay in milliseconds: the
   * caller is a server component, and importing a timing constant from this
   * "use client" module would hand it a client reference instead of a number.
   */
  indexOffset?: number;
}) {
  const [cells, setCells] = useState<Cell[] | null>(null);

  useEffect(() => {
    // Optional call: matchMedia is absent in some embedded webviews, and its
    // absence should mean "skip the animation", never "throw".
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches !== false) return;

    const revealAt = (i: number) => SCRAMBLE_MS + (indexOffset + i) * STAGGER_MS;
    const total = revealAt(text.length);
    let raf = 0;
    let start = 0;
    let last = -Infinity;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;

      // Randomisation happens here rather than during render so that render
      // stays a pure function of state.
      if (elapsed - last >= FRAME_MS) {
        last = elapsed;
        setCells(
          [...text].map((ch, i) => {
            if (ch === " ") return { ch, locked: true };
            if (elapsed >= revealAt(i)) return { ch, locked: true };
            return { ch: GLYPHS[(Math.random() * GLYPHS.length) | 0], locked: false };
          }),
        );
      }

      if (elapsed < total) raf = requestAnimationFrame(tick);
      else setCells(null);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, indexOffset]);

  if (cells === null) return <span className={className}>{text}</span>;

  // Group into words. Per-character spans would otherwise let the browser
  // break a line mid-word.
  const words: Cell[][] = [];
  let current: Cell[] = [];
  for (const cell of cells) {
    if (cell.ch === " ") {
      words.push(current);
      current = [];
    } else {
      current.push(cell);
    }
  }
  words.push(current);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span className={className} aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi}>
            {wi > 0 ? " " : null}
            <span className="inline-block">
              {word.map((cell, ci) => (
                <span key={ci} className={cell.locked ? undefined : "text-accent"}>
                  {cell.ch}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
