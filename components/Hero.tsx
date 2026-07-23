import Decode from "./Decode";

const LINE_1 = "Websites and automation";
const LINE_2 = "for Canadian small businesses.";

export default function Hero() {
  return (
    <section className="border-b border-line px-5 pb-9 pt-14 md:px-10 md:pb-14 md:pt-[5.5rem]">
      <h1 className="max-w-[26ch] font-mono text-[clamp(1.75rem,4.6vw,4rem)] font-semibold leading-[1.14] tracking-[-0.03em]">
        <Decode text={LINE_1} />{" "}
        <Decode
          text={LINE_2}
          className="text-fg-3"
          indexOffset={LINE_1.length}
        />
      </h1>
    </section>
  );
}
