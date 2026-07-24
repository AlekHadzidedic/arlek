import type { Metadata } from "next";
import Link from "next/link";

import TopBar from "../../../components/TopBar";
import Footer from "../../../components/Footer";
import CTA from "../../../components/CTA";
import SectionHead from "../../../components/SectionHead";
import DecryptFrame from "../../../components/DecryptFrame";
import Decode from "../../../components/Decode";

export const metadata: Metadata = {
  title: "Zinc North — a Wix template, rebuilt | Arlek",
  description:
    "A stock Wix template rebuilt from the ground up for an industrial plating shop in Sudbury: new structure, new copy, new code on Cloudflare Workers. Before and after, full page.",
};

const TITLE = "Zinc North";
const SUBTITLE = "rebuilt from a Wix template.";

/**
 * What actually changed, written as a diff.
 *
 * The screenshots below ask the reader to spot the difference; this states it.
 * Every line here is legible in the shots that follow, so the words make the
 * argument and the pictures corroborate it — not the other way round.
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

/** Facts, all of them drawn from the project record or the screenshots. */
const facts: { k: string; v: string }[] = [
  { k: "Client", v: "Zinc North, Sudbury ON" },
  { k: "Work", v: "Site rebuild" },
  { k: "Stack", v: "Cloudflare Workers" },
  { k: "Live", v: "zincnorth.ca" },
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

          <p className="mt-5 max-w-[56ch] text-[0.9375rem] leading-[1.6] text-fg-2">
            A stock Wix template, rebuilt from the ground up — new structure,
            new copy, new code, served from Cloudflare&apos;s edge.
          </p>

          <a
            href="https://zincnorth.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-full border border-line-2 px-[1.125rem] py-2.5 font-mono text-[0.8125rem] font-semibold text-fg-2 transition-colors hover:border-fg hover:text-fg"
          >
            Visit zincnorth.ca ↗
          </a>

          {/* Stacked key/value lines at phone, four ruled columns at desktop —
              the same border-l split the rest of the site uses instead of
              boxes. */}
          <dl className="mt-8 grid grid-cols-1 md:mt-10 md:grid-cols-4">
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
          <SectionHead label="The problem" counter="Wix template" />
          <section className="px-5 pb-10 pt-2 md:px-10 md:pb-12">
            <div className="flex max-w-[62ch] flex-col gap-4 text-[0.9375rem] leading-[1.6] text-fg-2">
              <p>
                Zinc North plates and coats parts for the mines, mills, and job
                sites of Northern Ontario. The business was solid. The site was
                a stock Wix template running a theme shared with thousands of
                other sites.
              </p>
              <p>
                The headline read{" "}
                <span className="text-fg">
                  &ldquo;Exceptional plating and coating&rdquo;
                </span>{" "}
                — true of any shop in the country. One quote button sat in the
                corner of the nav. The numbers that actually make the case —
                the years, the customers, the parts processed — were a screen
                further down, below the fold.
              </p>
            </div>
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
          <SectionHead label="Above the fold" counter="Hero" />
          <section className="px-5 pb-10 pt-2 md:px-10 md:pb-12">
            <p className="mb-5 max-w-[56ch] text-[0.9375rem] leading-[1.6] text-fg-2">
              The same crop of both homepages: everything a visitor sees before
              they scroll.
            </p>
            {/* The comparison that has to land. Cropped to one screen of each
                page and kept tight enough that both frames sit on a phone
                screen at once — a difference you have to scroll between is not
                a comparison. `revealOnce` on both, because half a decoded pair
                is useless. */}
            <div className="grid gap-3 md:grid-cols-2 md:gap-5">
              <DecryptFrame
                src="/work/zinc-before-full.jpeg"
                alt="Zinc North's original Wix site above the fold — a generic stock headline over a diagonal texture, thin nav, one faint call to action"
                label="Before"
                meta="Wix template"
                aspect="aspect-[16/10]"
                width={1425}
                height={3183}
                sizes="(min-width: 768px) 46vw, 92vw"
                revealOnce
              />
              <DecryptFrame
                src="/work/zinc-after-full.jpeg"
                alt="The rebuilt zincnorth.ca above the fold — a specific headline naming the service area, two calls to action, and a row of numbers directly beneath"
                label="After"
                meta="zincnorth.ca"
                aspect="aspect-[16/10]"
                width={1425}
                height={3745}
                sizes="(min-width: 768px) 46vw, 92vw"
                emphasis
                revealOnce
              />
            </div>
          </section>
        </div>

        <div className="border-t border-line">
          <SectionHead label="Top to bottom" counter="Full page" />
          <section className="px-5 pb-10 pt-2 md:px-10 md:pb-12">
            <p className="mb-5 max-w-[56ch] text-[0.9375rem] leading-[1.6] text-fg-2">
              Both homepages in full, at the same scale. Open either one for the
              original capture.
            </p>
            {/* No crop here: the whole page, at its own proportions, so the
                change in structure is visible as shape before it is read as
                text. These use the default while-read resolve — scrolling a
                tall pair, only the one being looked at is in colour. */}
            <div className="grid items-start gap-6 md:grid-cols-2 md:gap-5">
              <DecryptFrame
                src="/work/zinc-before-full.jpeg"
                alt="The full original Wix homepage for Zinc North, top to bottom"
                label="Before"
                meta="Wix template"
                href="/work/zinc-before-full.jpeg"
                aspect="aspect-[1425/3183]"
                width={1425}
                height={3183}
                sizes="(min-width: 768px) 46vw, 92vw"
              />
              <DecryptFrame
                src="/work/zinc-after-full.jpeg"
                alt="The full rebuilt zincnorth.ca homepage, top to bottom"
                label="After"
                meta="zincnorth.ca"
                href="/work/zinc-after-full.jpeg"
                aspect="aspect-[1425/3745]"
                width={1425}
                height={3745}
                sizes="(min-width: 768px) 46vw, 92vw"
                emphasis
              />
            </div>
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
