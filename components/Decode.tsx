"use client";

import { useEffect, useState } from "react";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/\\<>[]{}#$%&*+=_|~^";

const SCRAMBLE_MS = 260;
export const STAGGER_MS = 14;
const FRAME_MS = 50;

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
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [cells, setCells] = useState<Cell[] | null>(null);

  useEffect(() => {
    // Optional call: matchMedia is absent in some embedded webviews, and its
    // absence should mean "skip the animation", never "throw".
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches !== false) return;

    const total = delay + SCRAMBLE_MS + text.length * STAGGER_MS;
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
            const revealAt = delay + SCRAMBLE_MS + i * STAGGER_MS;
            if (elapsed >= revealAt) return { ch, locked: true };
            return { ch: GLYPHS[(Math.random() * GLYPHS.length) | 0], locked: false };
          }),
        );
      }

      if (elapsed < total) raf = requestAnimationFrame(tick);
      else setCells(null);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);

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
