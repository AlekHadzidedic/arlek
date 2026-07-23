import Image from "next/image";
import SectionHead from "./SectionHead";

const quote = `From the very beginning, you were professional, responsive, and genuinely invested in bringing my vision to life. What really stood out was your attention to detail and commitment to quality. The final result exceeded my expectations.`;

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
    alt: "Zinc North's original Wix site — generic stock hero over a diagonal texture, thin nav, one faint call to action",
    width: 1425,
    height: 3183,
    phase: "Before",
    detail: "Wix template",
  },
  {
    src: "/work/zinc-after-full.jpeg",
    alt: "The rebuilt zincnorth.ca — specific headline, stated service area, two clear calls to action above a stats row",
    width: 1425,
    height: 3745,
    phase: "After",
    detail: "zincnorth.ca",
    emphasis: true,
  },
];

/**
 * Shows the top of each page rather than the whole thing.
 *
 * Scaled to fit, a 3,183px page lands at roughly 10% and reads as texture.
 * The hero is where the difference is legible and where the argument actually
 * lives, so the frame crops to it and the full page moves behind a link.
 */
function PageFrame({ src, alt, width, height, phase, detail, emphasis }: Shot) {
  return (
    <figure
      className={`overflow-hidden rounded-lg border bg-bg-2 ${
        emphasis ? "border-line-2" : "border-line"
      }`}
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-line pl-3.5 pr-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em]">
        <span className="py-2.5">
          <span className={emphasis ? "text-accent" : "text-fg-3"}>{phase}</span>
          <span className="text-fg-3"> · {detail}</span>
        </span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[1.75rem] items-center px-1.5 text-fg-3 transition-colors hover:text-fg"
        >
          Full page ↗
        </a>
      </figcaption>
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 32vw, (min-width: 768px) 46vw, 92vw"
          className="absolute inset-x-0 top-0 w-full"
        />
      </div>
    </figure>
  );
}

export default function Rebuild() {
  return (
    <div id="rebuild" className="scroll-mt-6">
      <SectionHead label="The rebuild" counter="Zinc North" />
      <section className="border-t border-line px-5 py-8 md:px-10">
        <p className="mb-7 max-w-[56ch] text-[0.9375rem] leading-[1.6] text-fg-2">
          A stock Wix template, rebuilt from the ground up — new structure, new
          copy, new code.
        </p>
        <div className="grid gap-8 md:grid-cols-2 md:gap-[18px] lg:grid-cols-[1fr_1fr_17rem] lg:gap-8">
          {shots.map((s) => (
            <PageFrame key={s.phase} {...s} />
          ))}
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
