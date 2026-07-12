export type Project = {
  name: string;
  desc: string;
  from: string;
  to: string;
};

export const projects: Project[] = [
  { name: "Zinc North", desc: "Industrial plating & coating manufacturer. Site rebuild on Cloudflare Workers.", from: "#1a1d24", to: "#2a2f3a" },
  { name: "PianoChords", desc: "Interactive chord & progression explorer for pianists.", from: "#0f1220", to: "#1c2140" },
  { name: "Sonja Paints", desc: "Sanity-backed portfolio for a contemporary painter.", from: "#181614", to: "#2a2520" },
];
