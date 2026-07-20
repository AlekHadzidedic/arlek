export default function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-line px-5 py-[18px] md:px-10">
      <div className="flex items-center gap-4">
        <div className="text-lg font-bold tracking-[-0.02em]">
          Arlek<span className="font-normal text-fg-3">.ca</span>
        </div>
        <span className="hidden items-center gap-[7px] rounded-full border border-line-2 px-2.5 py-1 text-[11.5px] font-medium text-fg-2 md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6BCB77] shadow-[0_0_6px_#6BCB77]" />
          Available for new projects
        </span>
      </div>
      <a
        href="#book"
        className="inline-flex items-center gap-2 rounded-full bg-fg px-[18px] py-[9px] text-[13px] font-semibold text-bg hover:bg-white"
      >
        Book a call →
      </a>
    </header>
  );
}
