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
        <span className="pointer-events-none absolute inset-x-0 text-center text-[11px] font-medium uppercase tracking-[0.08em]">
          <span className={emphasis ? "text-fg" : "text-fg-3"}>{phase}</span>
          <span className="text-fg-3"> · {detail}</span>
        </span>
      </figcaption>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 34vw, (min-width: 768px) 46vw, 92vw"
        className="h-auto w-full"
      />
    </figure>
  );
}

export default function Rebuild() {
  return (
    <>
      <SectionHead label="The rebuild" counter="Zinc North" />
      <section className="border-t border-line px-5 py-8 md:px-10">
        <p className="mb-7 max-w-[52ch] text-[15px] leading-[1.6] text-fg-2">
          A stock Wix template, rebuilt from the ground up — new structure, new
          copy, new code. Shown in full, top to bottom.
        </p>
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="grid flex-1 items-start gap-8 md:grid-cols-2 md:gap-[18px]">
            {shots.map((s) => (
              <PageFrame key={s.phase} {...s} />
            ))}
          </div>
          <aside className="lg:w-[300px] lg:shrink-0">
            <figure className="flex max-w-[52ch] flex-col gap-5 lg:sticky lg:top-10">
              <blockquote className="text-[15px] leading-[1.65] text-fg">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="text-[13px] text-fg-3">
                <span className="font-medium text-fg-2">Eric</span> · Zinc North
              </figcaption>
            </figure>
          </aside>
        </div>
      </section>
    </>
  );
}
