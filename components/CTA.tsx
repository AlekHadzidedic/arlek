export default function CTA() {
  return (
    <section
      id="book"
      className="grid grid-cols-1 items-center gap-[1.125rem] border-t border-line px-5 py-12 md:grid-cols-[1.4fr_1fr] md:gap-10 md:px-10"
    >
      <div className="font-mono text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.02em]">
        Site dated, slow, or embarrassing to send?{" "}
        <span className="text-fg-3">Let&apos;s fix that.</span>
      </div>
      <div className="flex flex-wrap justify-start gap-2.5 md:justify-end">
        <a
          href="mailto:hello@arlek.ca?subject=Website%20project"
          className="inline-flex items-center gap-1.5 rounded-full bg-fg px-[1.125rem] py-2.5 font-mono text-[0.8125rem] font-semibold text-bg transition-opacity hover:opacity-80"
        >
          Start a project →
        </a>
        <a
          href="mailto:hello@arlek.ca?subject=Quick%20question"
          className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-[1.125rem] py-2.5 font-mono text-[0.8125rem] font-semibold text-fg-2 transition-colors hover:border-fg hover:text-fg"
        >
          Send a note
        </a>
      </div>
    </section>
  );
}
