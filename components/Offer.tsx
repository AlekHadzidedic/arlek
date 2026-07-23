import SectionHead from "./SectionHead";

const services = [
  {
    num: "01",
    title: "Design & build",
    desc: "Your site redesigned and rebuilt — fast, modern, and easy to find on Google. Same stack the big companies use, sized for a small business.",
  },
  {
    num: "02",
    title: "Care & upkeep",
    desc: "Hosting, content changes, and small fixes handled for you. Send an email, it gets done — no tickets, no retainer you never use.",
  },
  {
    num: "03",
    title: "Quiet automations",
    desc: "Small tools that erase busywork — chasing invoices, sorting inbox mail, alerts when something needs you. Built only where they pay for themselves.",
  },
];

export default function Offer() {
  return (
    <div className="border-t border-line">
      <SectionHead label="What I do" counter="03 services" />
      {/* The 01/02/03 numerals are gone: these three are alternatives, not
          steps, and numbering them implied an order that does not exist. The
          rules do the separating instead. */}
      <section className="grid grid-cols-1 px-5 pb-12 pt-2 md:grid-cols-3 md:px-10 md:pt-6">
        {services.map((s, i) => (
          <div
            key={s.num}
            className={`flex flex-col gap-2.5 border-t border-line py-5 md:border-t-0 md:py-0 ${
              i > 0 ? "md:border-l md:border-line md:pl-6" : ""
            } ${i < services.length - 1 ? "md:pr-6" : ""}`}
          >
            <h3 className="font-mono text-[1.0625rem] font-semibold tracking-[-0.01em] md:text-[0.9375rem]">
              {s.title}
            </h3>
            <p className="text-[0.9375rem] leading-[1.55] text-fg-2 md:text-[0.8125rem] md:leading-[1.5]">
              {s.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
