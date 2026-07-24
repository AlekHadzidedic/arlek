"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "../content/projects";
import DecryptFrame from "./DecryptFrame";

/**
 * Shared by the row still and the preview panel so both resolve to the same
 * optimised URL. They render the same file at the same displayed width for a
 * given viewport, and only one of the two is ever visible — differing `sizes`
 * would make Next emit two URLs and download the set twice.
 *
 * The two desktop steps track the preview column: 38rem minus its rule and
 * left padding at xl, 26rem minus the same at lg.
 */
const STILL_SIZES = "(min-width: 1280px) 35rem, (min-width: 1024px) 22rem, 92vw";

/**
 * Work presented as an index rather than a grid of equal-weight screenshots.
 *
 * Three large cards gave each project the same visual mass and turned the
 * section into a wall of images. Rows carry more information in less space —
 * kind and stack alongside the name — and a single preview panel does the
 * showing, so only one screenshot is on screen at a time.
 *
 * The two columns are joined by a rule, not a gap: the list's top hairline runs
 * across the preview column and a `border-l` drops between them, so the index
 * and the thing it is indexing are one ruled block rather than a list sitting
 * next to a thumbnail. Nothing is sticky — three rows generate about 350px of
 * column, which is less scroll travel than a sticky element needs to justify
 * itself, and pinning it only pushed the panel out of line with the rows.
 *
 * Below lg the preview panel is dropped and each row carries its own still in
 * the page's decrypt frame, because there is no hover on touch and a second
 * column has nowhere to sit. The frames are what keep three foreign-coloured
 * screenshots from reading as three interruptions.
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const preview = projects[active];

  return (
    <section className="px-5 pb-10 md:px-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:pb-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,38rem)]">
      <ul className="border-t border-line">
        {projects.map((p, i) => (
          <li key={p.name}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex flex-col gap-2 border-b border-line py-4 transition-colors hover:border-line-2 lg:flex-row lg:items-baseline lg:gap-6 lg:py-5 lg:pr-8 xl:gap-8 xl:py-7 xl:pr-10"
            >
              <span
                aria-hidden="true"
                className={`font-mono text-[0.6875rem] tabular-nums tracking-[0.1em] transition-colors lg:w-[1.5rem] lg:shrink-0 ${
                  active === i ? "text-accent" : "text-fg-3"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Name over tagline in one cell. They used to be two fixed
                  columns with the tagline stretching between them, which left a
                  260px hole in the middle of every row at 1440 and squeezed the
                  tagline to 66px at 1024. Stacked, the row has two ends and no
                  middle to strand. */}
              <span className="flex min-w-0 flex-col gap-1.5 lg:flex-1">
                <h3 className="font-mono text-[1.0625rem] font-semibold tracking-[-0.01em] transition-colors group-hover:text-accent">
                  {p.name}
                </h3>
                <span className="text-[0.9375rem] leading-[1.5] text-fg-2 lg:text-[0.8125rem] lg:leading-[1.45]">
                  {p.tagline}
                </span>
              </span>

              <span className="font-mono text-[0.6875rem] uppercase leading-[1.6] tracking-[0.08em] text-fg-3 lg:w-[11rem] lg:shrink-0 lg:text-right">
                {p.kind}
                {/* Solid, not an opacity modifier: fg-3 at 70% blends to
                    2.95:1 on the page background and fails 4.5:1. */}
                <span className="block text-fg-3">{p.stack}</span>
              </span>

              <span
                aria-hidden="true"
                className="hidden font-mono text-[0.6875rem] text-fg-3 transition-colors group-hover:text-fg lg:inline"
              >
                ↗
              </span>

              {/* Touch and small-screen stand-in for the preview column. No
                  link inside it — the whole row is already the anchor. */}
              <span className="mt-1.5 block lg:hidden">
                <DecryptFrame
                  src={p.image}
                  alt={p.alt}
                  label={p.name}
                  meta={p.stack}
                  aspect="aspect-[16/9]"
                  sizes={STILL_SIZES}
                  priority={i === 0}
                />
              </span>
            </a>
          </li>
        ))}

        {/* The index terminates on a rule like every other row rather than
            trailing off. It is a page now, not an anchor further down this one,
            so it points sideways.

            Set at row weight rather than caption weight: at 0.6875rem uppercase
            grey it read as a footnote under the list, and the one piece of
            proof on the site is worth more than a footnote. The accent arrow
            and the second line say plainly that it goes somewhere. */}
        {projects[0]?.caseStudy ? (
          <li>
            <a
              href={projects[0].caseStudy}
              className="group flex min-h-[2.75rem] items-baseline gap-2.5 border-b border-line py-4 transition-colors hover:border-line-2 lg:gap-6 lg:pr-8 xl:gap-8 xl:py-5 xl:pr-10"
            >
              <span
                aria-hidden="true"
                className="font-mono text-[0.6875rem] text-accent lg:w-[1.5rem] lg:shrink-0"
              >
                →
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-mono text-[0.9375rem] font-semibold tracking-[-0.01em] text-fg-2 transition-colors group-hover:text-accent">
                  Read the Zinc North case study
                </span>
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
                  Before and after, drag to compare
                </span>
              </span>
            </a>
          </li>
        ) : null}
      </ul>

      {/* Same chrome as the row frames, so the two ways of showing work read as
          one device at different sizes. The preview is always resolved: it
          shows whatever row is selected, and selection is the reveal. The
          column carries the list's top rule across and drops a rule between the
          two, which is what stops the panel reading as a floating thumbnail —
          whatever space is left under it is bounded on both sides. */}
      <div className="hidden border-line lg:flex lg:flex-col lg:border-l lg:border-t lg:pl-8 lg:pt-6 xl:pl-12">
        <figure className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-line-2 bg-bg-2">
          <figcaption className="flex items-center gap-1.5 border-b border-line px-2.5 py-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em]">
            <span aria-hidden="true" className="text-accent">
              ▍
            </span>
            <span className="truncate">
              <span className="text-fg-2">{preview.name}</span>
              <span className="text-fg-3"> · {preview.stack}</span>
            </span>
          </figcaption>
          {/* 16/10 is the floor, not the crop: the panel grows to whatever the
              row list leaves it, so the two columns always end on the same
              line and the leftover never lands under the image. */}
          <div className="relative aspect-[16/10] min-h-0 flex-1 overflow-hidden">
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
        </figure>
      </div>
    </section>
  );
}
