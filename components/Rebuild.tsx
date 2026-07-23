import Image from "next/image";
import SectionHead from "./SectionHead";

const quote = `From the very beginning, you were professional, responsive, and genuinely invested in bringing my vision to life. What really stood out was your attention to detail and commitment to quality — every element was carefully considered, and any feedback I had was addressed quickly and effectively. The final result exceeded my expectations. I highly recommend Alek to anyone looking for a reliable and talented web developer.`;

type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  phase: string;
  detail: string;
  emphasis?: boolean;
};

const shots: Shot[] = [
  {
    src: "/work/zinc-before-full.jpeg",
    alt: "Zinc North's original Wix site, full page — generic stock hero, plain stat counters, basic service tiles, colored footer blocks",
    width: 1425,
    height: 3183,
    phase: "Before",
    detail: "Wix template",
  },
  {
    src: "/work/zinc-after-full.jpeg",
    alt: "The rebuilt zincnorth.ca, full page — structured hero, stats row, service cards, Why Zinc North section, call to action and footer",
    width: 1425,
    height: 3745,
    phase: "After",
    detail: "zincnorth.ca",
    emphasis: true,
  },
];

function PageFrame({ src, alt, width, height, phase, detail, emphasis }: Shot) {
  return (
    <figure
      className={`overflow-hidden rounded-lg border bg-bg-2 ${
        emphasis ? "border-line-2" : "border-line"
      }`}
    >
      <figcaption className="relative flex items-center border-b border-line px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-[7px] w-[7px] rounded-full bg-fg/15" />
          <span className="h-[7px] w-[7px] rounded-full bg-fg/15" />
          <span className="h-[7px] w-[7px] rounded-full bg-fg/15" />
        </span>
        <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em]">
          <span className={emphasis ? "text-fg" : "text-fg-3"}>{phase}</span>
          <span className="text-fg-3"> · {detail}</span>
        </span>
      </figcaption>

      {/*
        The full-page shots are ~3200px tall. Shown whole on a phone they land
        at roughly 10% scale and read as nothing. Desktop keeps the full length,
        because seeing the whole page is the actual argument; mobile shows the
        top and offers the full image on demand.
      */}
      <div className="relative max-h-[28rem] overflow-hidden md:max-h-none">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 34vw, (min-width: 768px) 46vw, 92vw"
          className="h-auto w-full"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-2 to-transparent md:hidden"
        />
      </div>

      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 border-t border-line py-3 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-fg-3 transition-colors hover:text-fg md:hidden"
      >
        View full page ↗
      </a>
    </figure>
  );
}

export default function Rebuild() {
  return (
    <>
      <SectionHead label="The rebuild" counter="Zinc North" />
      <section className="border-t border-line px-5 py-8 md:px-10">
        <p className="mb-7 max-w-[52ch] text-[0.9375rem] leading-[1.6] text-fg-2">
          A stock Wix template, rebuilt from the ground up — new structure, new
          copy, new code.
        </p>
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="grid flex-1 items-start gap-8 md:grid-cols-2 md:gap-[18px]">
            {shots.map((s) => (
              <PageFrame key={s.phase} {...s} />
            ))}
          </div>
          <aside className="lg:w-[19rem] lg:shrink-0">
            <figure className="flex max-w-[52ch] flex-col gap-5 border-l-2 border-accent/30 pl-5 lg:sticky lg:top-10">
              <blockquote className="text-[0.9375rem] leading-[1.65] text-fg">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
                <span className="text-fg-2">Eric</span> · Zinc North
              </figcaption>
            </figure>
          </aside>
        </div>
      </section>
    </>
  );
}
