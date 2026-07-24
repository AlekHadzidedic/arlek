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
 * The rebuild stated as outcomes rather than a line-by-line diff.
 *
 * The wipe above already shows the visual change; naming it a second time as a
 * −/+ diff was redundant and leaned on the weakest argument (that the old
 * headline "could describe any shop"). These name what the work produced —
 * speed, structure, positioning — each with a specific the reader can check.
 */
const outcomes: { label: string; detail: string }[] = [
  {
    label: "Speed",
    detail:
      "First paint in roughly 0.3 seconds, served from Cloudflare's edge — a purpose-built front end in place of a shared template runtime.",
  },
  {
    label: "Layout",
    detail:
      "A modern page built for this shop, off the stock theme it had shared with thousands of other Wix sites.",
  },
  {
    label: "Positioning",
    detail:
      "The hero names the market the shop serves — precision plating for Northern Ontario's toughest jobs.",
  },
  {
    label: "Conversion",
    detail:
      "Two quote paths above the fold, where the old layout carried a single button tucked into a corner.",
  },
  {
    label: "Proof",
    detail:
      "Twenty-six years, 400+ manufacturers, and 10,000+ parts processed, stated in the hero instead of below the fold.",
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
            Zinc North&apos;s previous site ran on a stock Wix theme. The
            rebuild reorganised the page around the services the shop sells,
            moved its operating figures — years in business, manufacturers
            served, parts processed — into the hero, and reimplemented the
            front end on Cloudflare Workers. First contentful paint on the
            production site measures roughly 0.3 seconds.
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
          <SectionHead label="Before and after" counter="Drag · scroll" />
          <section className="px-5 pb-10 pt-2 md:px-10 md:pb-12">
            {/* One rectangle, both states, same scale — the comparison the page
                exists for. The frame scrolls through the whole of each page;
                drag the handle to wipe between them at any height.

                Capped rather than run full-bleed: at 1440 the section is
                1360px wide, and a screenshot that wide leaves the two pages too
                small to read side of the wipe. 58rem keeps the type legible. */}
            <div className="max-w-[58rem]">
              <BeforeAfterSlider
                before="/work/zinc-before-full.jpeg"
                after="/work/zinc-after-full.jpeg"
                beforeW={1425}
                beforeH={3183}
                afterW={1425}
                afterH={3745}
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
              Open full size:{" "}
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
          <SectionHead label="Outcomes" counter="05" />
          <section className="px-5 pb-10 pt-2 md:px-10 md:pb-12">
            {/* Outcomes, not a diff: a fixed label column and a plain-language
                detail. The label stays mono/uppercase like the rest of the
                page's meta; the detail carries the specific. Ruled rows keep
                the terminal-ledger read without reintroducing −/+ theatre. */}
            <dl className="divide-y divide-line border-y border-line">
              {outcomes.map((o) => (
                <div
                  key={o.label}
                  className="py-3.5 md:grid md:grid-cols-[8.5rem_1fr] md:gap-6 md:py-4"
                >
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
                    {o.label}
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] leading-[1.55] text-fg-2 md:mt-0">
                    {o.detail}
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
