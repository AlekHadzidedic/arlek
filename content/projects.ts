export type Project = {
  name: string;
  desc: string;
  from: string;
  to: string;
  image: string;
  alt: string;
};

export const projects: Project[] = [
  { name: "Zinc North", desc: "Industrial plating & coating manufacturer. Site rebuild on Cloudflare Workers.", from: "#1a1d24", to: "#2a2f3a", image: "/work/zinc-north-after.jpeg", alt: "Zinc North homepage — hero section of the rebuilt site" },
  { name: "PianoChords", desc: "Interactive chord & progression explorer for pianists.", from: "#0f1220", to: "#1c2140", image: "/work/pianochords.jpeg", alt: "PianoChords chord explorer with interactive keyboard" },
  { name: "Sonja Paints", desc: "Sanity-backed portfolio for a contemporary painter.", from: "#181614", to: "#2a2520", image: "/work/sonja-paints.jpeg", alt: "Sonja Paints landscapes gallery" },
];
