export default function SectionHead({ label, counter }: { label: string; counter: string }) {
  return (
    <div className="flex items-baseline justify-between px-5 pb-3.5 pt-7 md:px-10">
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-fg-3">{label}</div>
      <div className="text-xs tabular-nums text-fg-3">{counter}</div>
    </div>
  );
}
