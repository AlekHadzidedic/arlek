export default function SectionHead({ label, counter }: { label: string; counter: string }) {
  return (
    <div className="flex items-center gap-4 px-5 pb-3.5 pt-7 md:px-10">
      <h2 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-fg-2">
        {label}
      </h2>
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-gradient-to-r from-accent/25 to-line"
      />
      <span className="font-mono text-[0.6875rem] tabular-nums tracking-[0.08em] text-fg-3">
        {counter}
      </span>
    </div>
  );
}
