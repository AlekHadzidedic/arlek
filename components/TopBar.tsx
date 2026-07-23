/**
 * Wraps rather than hides on small screens.
 *
 * The availability line used to disappear below `md`, which took the page's
 * one live signal off the surface most visitors actually arrive on. It now
 * drops to a full-width line under the logo, where the blinking dot is the
 * first thing that moves.
 */
export default function TopBar() {
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2.5 border-b border-line px-5 py-3.5 md:px-10 md:py-[1.125rem]">
      <div className="order-1 font-mono text-[1.0625rem] font-semibold tracking-[-0.02em]">
        Arlek<span className="font-medium text-fg-3">.ca</span>
      </div>

      <a
        href="mailto:hello@arlek.ca?subject=Website%20project"
        className="order-2 ml-auto inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-fg px-[1.125rem] py-[0.5625rem] font-mono text-[0.8125rem] font-semibold text-bg transition-opacity hover:opacity-80 md:order-3 md:min-h-0"
      >
        Start a project →
      </a>

      <span className="order-3 inline-flex w-full items-center gap-[7px] font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-fg-2 md:order-2 md:w-auto md:rounded-full md:border md:border-line-2 md:px-2.5 md:py-1">
        <span className="cursor-blink h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]" />
        Available for new projects
      </span>
    </header>
  );
}
