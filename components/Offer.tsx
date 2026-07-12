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
      <SectionHead label="What I do" counter="01–03" />
      <section className="grid grid-cols-1 gap-7 px-5 pb-10 md:grid-cols-3 md:gap-[18px] md:px-10">
        {services.map((s) => (
          <div key={s.num} className="flex flex-col gap-2.5">
            <div className="text-xs tabular-nums text-fg-3">{s.num}</div>
            <div className="text-base font-semibold tracking-[-0.01em]">{s.title}</div>
            <div className="text-[13px] leading-[1.45] text-fg-2">{s.desc}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
