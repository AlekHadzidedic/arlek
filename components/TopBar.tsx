export default function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-line px-5 py-[1.125rem] md:px-10">
      <div className="flex items-center gap-4">
        <div className="font-mono text-[1.0625rem] font-semibold tracking-[-0.02em]">
          Arlek<span className="font-medium text-fg-3">.ca</span>
        </div>
        <span className="hidden items-center gap-[7px] rounded-full border border-line-2 px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-fg-2 md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]" />
          Available for new projects
        </span>
      </div>
      <a
        href="mailto:hello@arlek.ca?subject=Website%20project"
        className="inline-flex items-center gap-2 rounded-full bg-fg px-[1.125rem] py-[0.5625rem] font-mono text-[0.8125rem] font-semibold text-bg transition-opacity hover:opacity-80"
      >
        Start a project →
      </a>
    </header>
  );
}
