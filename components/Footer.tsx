export default function Footer() {
  return (
    <footer className="flex flex-col items-start gap-1.5 border-t border-line px-5 py-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-fg-3 md:flex-row md:items-center md:justify-between md:px-10">
      <div className="py-1.5">© 2026 Arlek Studios</div>
      <a
        href="mailto:hello@arlek.ca"
        className="inline-flex min-h-[2.75rem] items-center py-1.5 text-fg-3 transition-colors hover:text-fg"
      >
        hello@arlek.ca
      </a>
    </footer>
  );
}
