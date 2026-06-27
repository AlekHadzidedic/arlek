export default function CTA() {
  return (
    <section className="grid grid-cols-1 items-center gap-[18px] border-t border-line px-5 py-12 md:grid-cols-[1.4fr_1fr] md:gap-10 md:px-10">
      <div className="text-[clamp(22px,2.4vw,30px)] font-semibold leading-[1.2] tracking-[-0.02em]">
        Site dated, slow, or embarrassing to send? <span className="text-fg-3">Let&apos;s fix that.</span>
      </div>
      <div className="flex flex-wrap justify-start gap-2.5 md:justify-end">
        <a href="#book" className="inline-flex items-center gap-1.5 rounded-full bg-fg px-[18px] py-2.5 text-[13px] font-semibold text-bg">
          Book a 20-min call →
        </a>
        <a href="mailto:hello@arlek.ca" className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-[18px] py-2.5 text-[13px] font-semibold text-fg-2 hover:border-fg hover:text-fg">
          Send a note
        </a>
      </div>
    </section>
  );
}
