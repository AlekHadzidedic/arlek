export type Project = {
  name: string;
  tag: "Client" | "Product" | "Automation" | "Portfolio" | "Pro-bono";
  desc: string;
  from: string;
  to: string;
};

export const projects: Project[] = [
  { name: "Zinc North", tag: "Client", desc: "Industrial plating & coating manufacturer. Site rebuild on Cloudflare Workers.", from: "#1a1d24", to: "#2a2f3a" },
  { name: "PianoChords", tag: "Product", desc: "Interactive chord & progression explorer for pianists.", from: "#0f1220", to: "#1c2140" },
  { name: "Spend Monitor", tag: "Automation", desc: "Parses bank emails, classifies transactions, monthly view with alerts.", from: "#0e1a14", to: "#1a2e24" },
  { name: "Sonja Paints", tag: "Portfolio", desc: "Sanity-backed portfolio for a contemporary painter.", from: "#181614", to: "#2a2520" },
  { name: "Inside Joke", tag: "Pro-bono", desc: "Lightweight content site.", from: "#201418", to: "#2e1d25" },
];
