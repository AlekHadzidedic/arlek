export type Project = {
  name: string;
  /** Who it is for, in a few words. Sized for a single index row. */
  tagline: string;
  /** What kind of engagement this was. */
  kind: string;
  /** The part of the stack worth naming. */
  stack: string;
  desc: string;
  from: string;
  to: string;
  image: string;
  alt: string;
  url: string;
  /** Anchor of an in-page case study, where one exists. */
  caseStudy?: string;
};

export const projects: Project[] = [
  {
    name: "Zinc North",
    tagline: "Industrial plating & coating",
    kind: "Site rebuild",
    stack: "Cloudflare Workers",
    desc: "Industrial plating & coating manufacturer. Site rebuild on Cloudflare Workers.",
    from: "#1a1d24",
    to: "#2a2f3a",
    image: "/work/zinc-north-after.jpeg",
    alt: "Zinc North homepage — hero section of the rebuilt site",
    url: "https://zincnorth.ca",
    caseStudy: "#rebuild",
  },
  {
    name: "PianoChords",
    tagline: "Chord & progression explorer",
    kind: "Web app",
    stack: "Firestore",
    desc: "Interactive chord & progression explorer for pianists.",
    from: "#0f1220",
    to: "#1c2140",
    image: "/work/pianochords.jpeg",
    alt: "PianoChords chord explorer with interactive keyboard",
    url: "https://pianochords.ca",
  },
  {
    name: "Sonja Paints",
    tagline: "Painter's portfolio",
    kind: "Portfolio + CMS",
    stack: "Sanity",
    desc: "Sanity-backed portfolio for a contemporary painter.",
    from: "#181614",
    to: "#2a2520",
    image: "/work/sonja-paints.jpeg",
    alt: "Sonja Paints landscapes gallery",
    url: "https://sonjapaints.ca",
  },
];
