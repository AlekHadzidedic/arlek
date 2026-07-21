import BeforeAfter from "./BeforeAfter";
import SectionHead from "./SectionHead";

const quote = `From the very beginning, you were professional, responsive, and genuinely invested in bringing my vision to life. What really stood out was your attention to detail and commitment to quality — every element was carefully considered, and any feedback I had was addressed quickly and effectively. The final result exceeded my expectations. I highly recommend Alek to anyone looking for a reliable and talented web developer.`;

export default function Spotlight() {
  return (
    <>
      <SectionHead label="Case study" counter="Zinc North" />
      <section className="border-t border-line px-5 py-8 md:px-10">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <BeforeAfter
            before="/work/zinc-north-before.jpeg"
            after="/work/zinc-north-after.jpeg"
            beforeAlt="Zinc North — original Wix site before the rebuild"
            afterAlt="Zinc North — rebuilt site on Cloudflare Workers"
          />
          <figure className="flex flex-col gap-5">
            <blockquote className="text-[17px] leading-[1.55] text-fg md:text-lg">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <figcaption className="text-[13px] text-fg-3">
              <span className="font-medium text-fg-2">Eric</span> · Zinc North
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
