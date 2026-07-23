import SectionHead from "./SectionHead";
import DecryptFrame from "./DecryptFrame";

const quote = `From the very beginning, you were professional, responsive, and genuinely invested in bringing my vision to life. What really stood out was your attention to detail and commitment to quality. The final result exceeded my expectations.`;

/**
 * What actually changed, written as a diff.
 *
 * Two screenshots side by side ask the reader to spot the difference, and at
 * phone width — where the pair is stacked and neither is full size — most
 * readers won't. Every line here is legible in the two shots below it, so the
 * diff states the argument and the screenshots corroborate it.
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
    before: "Nothing on the page backing the claim",
    after: "Years, projects, and capacity, stated in the hero",
  },
];

export default function Rebuild() {
  return (
    <div id="rebuild" className="scroll-mt-6">
      <SectionHead label="The rebuild" counter="Zinc North" />
      <section className="border-t border-line px-5 py-8 md:px-10">
        <p className="mb-6 max-w-[56ch] text-[0.9375rem] leading-[1.6] text-fg-2">
          A stock Wix template, rebuilt from the ground up — new structure, new
          copy, new code.
        </p>

        <dl className="mb-8 divide-y divide-line border-y border-line font-mono text-[0.8125rem] leading-[1.45]">
          {changes.map((c) => (
            <div
              key={c.after}
              className="grid gap-1 py-3 md:grid-cols-2 md:gap-6 md:py-2.5"
            >
              <dt className="flex gap-2 text-fg-3">
                <span aria-hidden="true" className="select-none">
                  −
                </span>
                <span className="line-through decoration-fg-3/40">{c.before}</span>
              </dt>
              <dd className="flex gap-2 text-fg">
                <span aria-hidden="true" className="select-none text-accent">
                  +
                </span>
                <span>{c.after}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-6 md:grid-cols-2 md:gap-[18px] lg:grid-cols-[1fr_1fr_17rem] lg:gap-8">
          {/* Cropped to the hero: scaled to fit, a 3,183px page lands at
              roughly 10% and reads as texture. The hero is where the
              difference is legible, and the full page is one tap away. */}
          <DecryptFrame
            src="/work/zinc-before-full.jpeg"
            alt="Zinc North's original Wix site — generic stock hero over a diagonal texture, thin nav, one faint call to action"
            label="Before"
            meta="Wix template"
            href="/work/zinc-before-full.jpeg"
            aspect="aspect-[16/11]"
            width={1425}
            height={3183}
            sizes="(min-width: 1024px) 32vw, (min-width: 768px) 46vw, 92vw"
            revealOnce
          />
          <DecryptFrame
            src="/work/zinc-after-full.jpeg"
            alt="The rebuilt zincnorth.ca — specific headline, stated service area, two clear calls to action above a stats row"
            label="After"
            meta="zincnorth.ca"
            href="/work/zinc-after-full.jpeg"
            aspect="aspect-[16/11]"
            width={1425}
            height={3745}
            sizes="(min-width: 1024px) 32vw, (min-width: 768px) 46vw, 92vw"
            emphasis
            revealOnce
          />

          <figure className="flex flex-col gap-4 border-l-2 border-accent/30 pl-5 md:col-span-2 lg:col-span-1 lg:border-l lg:border-line lg:pl-6">
            <blockquote className="text-[0.9375rem] leading-[1.6] text-fg">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <figcaption className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
              <span className="text-fg-2">Eric</span> · Zinc North
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
