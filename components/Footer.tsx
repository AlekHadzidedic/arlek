export default function Footer() {
  return (
    <footer className="flex flex-col items-start gap-1.5 border-t border-line px-5 py-3.5 text-xs text-fg-3 md:flex-row md:items-center md:justify-between md:px-10">
      <div>© 2026 Arlek</div>
      <div>
        <a href="mailto:hello@arlek.ca" className="text-fg-3 hover:text-fg">hello@arlek.ca</a>
      </div>
    </footer>
  );
}
