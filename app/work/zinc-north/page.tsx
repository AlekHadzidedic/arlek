import type { Metadata } from "next";
import Link from "next/link";

import TopBar from "../../../components/TopBar";
import Footer from "../../../components/Footer";
import CTA from "../../../components/CTA";
import SectionHead from "../../../components/SectionHead";
import BeforeAfterSlider from "../../../components/BeforeAfterSlider";
import Decode from "../../../components/Decode";

export const metadata: Metadata = {
  title: "Zinc North — a Wix template, rebuilt | Arlek",
  description:
    "An industrial plating shop in Sudbury, moved off a stock Wix template: new layout, new interface, and a site that paints its first screen in about 0.3 seconds on Cloudflare's edge.",
};

const TITLE = "Zinc North";
const SUBTITLE = "rebuilt from a Wix template.";

/**
 * What actually changed, written as a diff.
 *
 * The wipe above shows the difference; these name it. Every line is legible in
 * the comparison, so the words make the argument and the picture corroborates
 * it — not the other way round.
 */
const changes: { before: string; after: string }[] = [
  {
    before: "“Exceptional plating and coating” — true of any shop",
    after: "“Precision plating for Northern Ontario's toughest jobs”",
  },
  {
    before: "One quote button, tucked into a corner",
    after: "Two ways to act, both above the fold",
  },
  {
    before: "Wix template on a theme shared with thousands of sites",
    after: "Custom build, served from Cloudflare's edge",
  },
  {
    before: "Nothing in the hero backing the claim",
    after: "Years, customers, and capacity, stated in the hero",
  },
];

/**
 * Three facts, each one checkable. The speed figure is a first-contentful-paint
 * measured on the live site, not a target or a Lighthouse score.
 */
const facts: { k: string; v: string }[] = [
  { k: "Client", v: "Zinc North, Sudbury ON" },
  { k: "Stack", v: "Cloudflare Workers" },
  { k: "Speed", v: "0.3 s to first paint" },
];

const PULL = "The final result exceeded my expectations.";
const QUOTE = `From the very beginning, you were professional, responsive, and genuinely invested in bringing my vision to life. What really stood out was your attention to detail and commitment to quality.`;

export default function ZincNorthCaseStudy() {
  return (
    <>
      <TopBar />
      <main>
        {/* Page head. Mirrors the homepage hero — same decode, same two-tone
            headline — so arriving here reads as the session continuing rather
            than as a new site. */}
        <section className="px-5 pb-9 pt-6 md:px-10 md:pb-12 md:pt-8">
          <Link
            href="/#work"
            className="-ml-1 inline-flex min-h-[2.75rem] items-center gap-2 px-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3 transition-colors hover:text-fg"
          >
            <span aria-hidden="true">←</span> Work index
          </Link>

          <h1 className="mt-3 max-w-[22ch] font-mono text-[clamp(1.75rem,4.6vw,4rem)] font-semibold leading-[1.14] tracking-[-0.03em]">
            <Decode text={TITLE} />{" "}
            <Decode
              text={SUBTITLE}
              className="text-fg-3"
              indexOffset={TITLE.length}
            />
          </h1>

          <p className="mt-5 max-w-[62ch] text-[0.9375rem] leading-[1.6] text-fg-2">
            Zinc North ran on a stock Wix template: a theme shared with
            thousands of other sites, a headline that could have described any
            plating shop, and the numbers that make the case sitting below the
            fold. The rebuild reorganised the page around what the shop
            actually sells and replaced the interface end to end. It now runs
            on Cloudflare&apos;s edge and paints its first screen in about
            three tenths of a second.
          </p>

          <a
            href="https://zincnorth.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-full border border-line-2 px-[1.125rem] py-2.5 font-mono text-[0.8125rem] font-semibold text-fg-2 transition-colors hover:border-fg hover:text-fg"
          >
            Visit zincnorth.ca ↗
          </a>

          {/* Stacked key/value lines at phone, three ruled columns at desktop —
              the same border-l split the rest of the site uses instead of
              boxes. */}
          <dl className="mt-8 grid grid-cols-1 md:mt-10 md:grid-cols-3">
            {facts.map((f, i) => (
              <div
                key={f.k}
                className={`flex items-baseline justify-between gap-4 border-t border-line py-3 md:flex-col md:justify-start md:gap-1.5 md:border-t-0 md:py-0 ${
                  i > 0 ? "md:border-l md:border-line md:pl-6" : ""
                } ${i < facts.length - 1 ? "md:pr-6" : ""}`}
              >
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
                  {f.k}
                </dt>
                <dd className="font-mono text-[0.8125rem] text-fg-2">{f.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="border-t border-line">
          <SectionHead label="Before and after" counter="Drag to compare" />
          <section className="px-5 pb-10 pt-2 md:px-10 md:pb-12">
            {/* One rectangle, both states, same scale. The comparison the page
                exists for.

                Capped rather than run full-bleed: at 1440 the section is
                1360px wide, and a 16/10 frame across all of it stands 850px
                tall — taller than the viewport, so the wipe and its own
                caption bar could not be seen at the same time. */}
            <div className="max-w-[58rem]">
              <BeforeAfterSlider
                before="/work/zinc-before-full.jpeg"
                after="/work/zinc-after-full.jpeg"
                beforeAlt="Zinc North's original Wix site — a generic stock headline over a diagonal texture, thin nav, one faint call to action"
                afterAlt="The rebuilt zincnorth.ca — a specific headline naming the service area, two calls to action, and a row of numbers directly beneath"
                beforeLabel="Before"
                afterLabel="After"
                beforeMeta="Wix template"
                afterMeta="zincnorth.ca"
                sizes="(min-width: 1024px) 58rem, 92vw"
              />
            </div>

            <p className="mt-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
              Full page:{" "}
              <a
                href="/work/zinc-before-full.jpeg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[2.75rem] items-center text-fg-3 underline decoration-line-2 underline-offset-4 transition-colors hover:text-fg"
              >
                before ↗
              </a>{" "}
              ·{" "}
              <a
                href="/work/zinc-after-full.jpeg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[2.75rem] items-center text-fg-3 underline decoration-line-2 underline-offset-4 transition-colors hover:text-fg"
              >
                after ↗
              </a>
            </p>
          </section>
        </div>

        <div className="border-t border-line">
          <SectionHead label="What changed" counter="04 lines" />
          <section className="px-5 pb-10 pt-2 md:px-10 md:pb-12">
            {/* Column labels only exist where there are columns. At phone the
                −/+ glyphs label the two halves themselves. */}
            <div className="hidden grid-cols-2 border-t border-line font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3 md:grid">
              <span className="py-2.5 pr-6">Before</span>
              <span className="border-l border-line py-2.5 pl-6">After</span>
            </div>

            <dl className="divide-y divide-line border-y border-line font-mono text-[0.8125rem] leading-[1.5] md:border-t-0">
              {changes.map((c) => (
                <div key={c.after} className="md:grid md:grid-cols-2">
                  <dt className="flex gap-2.5 pb-1 pt-3.5 text-fg-3 md:py-3.5 md:pr-6">
                    <span aria-hidden="true" className="select-none">
                      −
                    </span>
                    <span className="line-through decoration-fg-3">
                      {c.before}
                    </span>
                  </dt>
                  <dd className="flex gap-2.5 pb-3.5 text-fg md:border-l md:border-line md:py-3.5 md:pl-6">
                    <span
                      aria-hidden="true"
                      className="select-none text-accent"
                    >
                      +
                    </span>
                    <span>{c.after}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="border-t border-line">
          <SectionHead label="Client" counter="Zinc North" />
          <section className="px-5 pb-12 pt-2 md:px-10">
            {/* A full page can afford a real pull quote: one sentence at CTA
                size, the rest of it at reading size underneath. */}
            <figure className="border-l border-line pl-5 md:pl-6">
              <blockquote className="flex flex-col gap-4">
                <p className="max-w-[24ch] font-mono text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.02em]">
                  &ldquo;{PULL}&rdquo;
                </p>
                <p className="max-w-[56ch] text-[0.9375rem] leading-[1.6] text-fg-2">
                  {QUOTE}
                </p>
              </blockquote>
              <figcaption className="mt-5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
                <span className="text-fg-2">Eric</span> · Zinc North
              </figcaption>
            </figure>
          </section>
        </div>

        <nav className="border-t border-line px-5 py-2 md:px-10">
          <Link
            href="/#work"
            className="-ml-1 inline-flex min-h-[2.75rem] items-center gap-2 px-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3 transition-colors hover:text-fg"
          >
            <span aria-hidden="true">←</span> Back to the work index
          </Link>
        </nav>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
