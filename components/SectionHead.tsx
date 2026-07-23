/**
 * Every section opens the same way: a prompt caret, the section's name, a rule
 * running out to a count. The caret is what makes the page read as one
 * continuous session rather than a stack of unrelated blocks.
 */
export default function SectionHead({ label, counter }: { label: string; counter: string }) {
  return (
    <div className="flex items-center gap-2.5 px-5 pb-3.5 pt-8 md:px-10">
      <span aria-hidden="true" className="font-mono text-[0.6875rem] text-accent">
        &gt;
      </span>
      <h2 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-fg-2">
        {label}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
      <span className="font-mono text-[0.6875rem] tabular-nums tracking-[0.08em] text-fg-3">
        {counter}
      </span>
    </div>
  );
}
