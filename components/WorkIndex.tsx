"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "../content/projects";

/**
 * Shared by the row still and the sticky preview so both resolve to the same
 * optimised URL. They render the same file at the same displayed width for a
 * given viewport, and only one of the two is ever visible — differing `sizes`
 * would make Next emit two URLs and download the set twice.
 */
const STILL_SIZES = "(min-width: 1024px) 26rem, 92vw";

/**
 * Work presented as an index rather than a grid of equal-weight screenshots.
 *
 * Three large cards gave each project the same visual mass and turned the
 * section into a wall of images. Rows carry more information in less space —
 * kind and stack alongside the name — and a single preview panel does the
 * showing, so only one screenshot is on screen at a time.
 *
 * Below lg the preview panel is dropped and each row carries its own compact
 * still, because there is no hover on touch and a sticky panel has nowhere
 * to sit.
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const preview = projects[active];

  return (
    <section className="px-5 pb-10 md:px-10 lg:grid lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-start lg:gap-12">
      <ul className="border-t border-line">
        {projects.map((p, i) => (
          <li key={p.name}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex flex-col gap-3 border-b border-line py-4 transition-colors hover:border-line-2 lg:flex-row lg:items-baseline lg:gap-6 lg:py-5"
            >
              <span
                aria-hidden="true"
                className={`font-mono text-[0.6875rem] tabular-nums tracking-[0.1em] transition-colors ${
                  active === i ? "text-accent" : "text-fg-3"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="font-mono text-[1.0625rem] font-semibold tracking-[-0.01em] transition-colors group-hover:text-accent lg:w-[11rem] lg:shrink-0">
                {p.name}
              </h3>

              <span className="flex-1 text-[0.8125rem] leading-[1.45] text-fg-2">
                {p.tagline}
              </span>

              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-fg-3 lg:w-[12rem] lg:shrink-0">
                {p.kind}
                {/* Solid, not an opacity modifier: fg-3 at 70% blends to
                    2.95:1 on the page background and fails 4.5:1. */}
                <span className="block text-fg-3">{p.stack}</span>
              </span>

              <span
                aria-hidden="true"
                className="hidden font-mono text-[0.6875rem] text-fg-3 transition-colors group-hover:text-accent lg:inline"
              >
                ↗
              </span>

              {/* Touch and small-screen fallback for the sticky preview. */}
              <span className="relative mt-1 block aspect-[16/9] w-full overflow-hidden rounded-md border border-line lg:hidden">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes={STILL_SIZES}
                  className="object-cover object-top"
                />
              </span>
            </a>
          </li>
        ))}

        {projects[0]?.caseStudy ? (
          <li>
            <a
              href={projects[0].caseStudy}
              className="inline-flex items-center gap-2 py-5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3 transition-colors hover:text-accent"
            >
              ↓ See a rebuild, before and after
            </a>
          </li>
        ) : null}
      </ul>

      <div className="hidden lg:sticky lg:top-12 lg:block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line-2">
          {projects.map((p, i) => (
            <Image
              key={p.name}
              src={p.image}
              alt={p.alt}
              fill
              sizes={STILL_SIZES}
              className={`object-cover object-top transition-opacity duration-300 ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-fg-3">
          {preview.name} <span className="text-fg-3">· {preview.stack}</span>
        </p>
      </div>
    </section>
  );
}
